const config = require('../config');
const sheetsManager = require('../sheets');
const axios = require('axios');

// This handler will be scheduled to run every hour
exports.handler = async function(event, context) {
  console.log('Starting scheduled update of all SKUs');
  
  try {
    // Initialize sheets connection
    await sheetsManager.init();
    
    // New function to get all SKUs from all sheets
    const allSkus = await getAllSkusFromSheets(sheetsManager.sheets);
    console.log(`Found ${allSkus.length} SKUs across all sheets`);
    
    // Process each SKU
    let successCount = 0;
    let errorCount = 0;
    
    for (const skuInfo of allSkus) {
      try {
        // Fetch latest data from Lightspeed API for this SKU
        const productData = await fetchProductFromLightspeed(skuInfo.sku);
        
        if (!productData) {
          console.log(`No data found in Lightspeed for SKU: ${skuInfo.sku}`);
          continue;
        }
        
        // Update the SKU in Google Sheets with the latest data
        await sheetsManager.updateInventory(
          skuInfo.sku,
          productData.name,
          productData.id,
          productData.inventory?.count,
          productData.price,
          'Scheduled Update'
        );
        
        successCount++;
        console.log(`Successfully updated SKU: ${skuInfo.sku}`);
      } catch (error) {
        errorCount++;
        console.error(`Error updating SKU ${skuInfo.sku}:`, error.message);
      }
    }
    
    console.log(`Scheduled update completed. Success: ${successCount}, Errors: ${errorCount}`);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Scheduled update completed',
        stats: {
          total: allSkus.length,
          success: successCount,
          errors: errorCount
        }
      })
    };
  } catch (error) {
    console.error('Error in scheduled update:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process scheduled update' })
    };
  }
};

// Helper function to get all SKUs from all sheets
async function getAllSkusFromSheets(sheets) {
  const allSkus = [];
  
  for (const sheet of sheets) {
    try {
      // Skip sheets with no header row
      if (!sheet.headerValues || sheet.headerValues.length === 0) {
        console.warn(`Skipping sheet "${sheet.title}" because it has no header row.`);
        continue;
      }
      
      const rows = await sheet.getRows();
      console.log(`Processing ${rows.length} rows from sheet "${sheet.title}"`);
      
      // Extract SKUs from each row
      for (const row of rows) {
        const sku = row['SKU']?.toString().trim();
        
        // Skip rows without a valid SKU (like section headers or empty rows)
        if (!sku) continue;
        
        allSkus.push({
          sku,
          sheetTitle: sheet.title,
          productId: row['Product ID'] || null
        });
      }
    } catch (error) {
      console.error(`Error getting SKUs from sheet "${sheet.title}":`, error.message);
    }
  }
  
  return allSkus;
}

// Helper function to fetch product data from Lightspeed
async function fetchProductFromLightspeed(sku) {
  try {
    const url = `${config.LIGHTSPEED.BASE_URL}/products?sku=${sku}`;
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${config.LIGHTSPEED.PERSONAL_ACCESS_TOKEN}`
      }
    });
    
    if (response.data && response.data.data && response.data.data.length > 0) {
      return response.data.data[0];
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching product from Lightspeed for SKU ${sku}:`, error.message);
    return null;
  }
} 