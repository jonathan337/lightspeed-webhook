const { GoogleSpreadsheet } = require('google-spreadsheet');
const config = require('./config');

class SheetsManager {
    constructor() {
        this.doc = new GoogleSpreadsheet(config.GOOGLE.SPREADSHEET_ID);
    }

    async init() {
        try {
            console.log('Initializing Google Sheets connection...');
            await this.doc.useServiceAccountAuth({
                client_email: config.GOOGLE.CLIENT_EMAIL,
                private_key: config.GOOGLE.PRIVATE_KEY.replace(/\\n/g, '\n'),
            });
            console.log('Auth successful, loading sheet info...');
            await this.doc.loadInfo();
            
            // Instead of accessing a single sheet, we'll store all sheets
            this.sheets = this.doc.sheetsByIndex;
            console.log(`Loaded ${this.sheets.length} sheets successfully`);
            
            // Log all sheet titles for debugging
            this.sheets.forEach((sheet, index) => {
                console.log(`Sheet ${index + 1}: ${sheet.title}`);
            });
        } catch (error) {
            console.error('Error initializing sheets:', error);
            if (error.message.includes('private_key')) {
                console.error('Private key error. Current private key format:', config.GOOGLE.PRIVATE_KEY);
            }
            throw error;
        }
    }

    async updateInventory(sku, productName, productId, inventory, price, status) {
        try {
            console.log('Starting sheet update for:', {
                sku,
                productName,
                productId,
                inventory,
                price,
                status
            });

            await this.init();
            
            // Try to update the SKU in all sheets
            let updatedAny = false;
            
            for (const sheet of this.sheets) {
                // Skip sheets with no header row
                if (!sheet.headerValues || sheet.headerValues.length === 0) {
                    console.warn(`Skipping sheet "${sheet.title}" because it has no header row.`);
                    continue;
                }

                const rows = await sheet.getRows();
                console.log(`Checking sheet "${sheet.title}" with ${rows.length} rows`);
                
                // Find the row with matching SKU
                const rowIndex = rows.findIndex(row => {
                    const sheetSku = row['SKU']?.toString().trim();
                    const searchSku = sku?.toString().trim();
                    return sheetSku === searchSku;
                });
                
                if (rowIndex !== -1) {
                    console.log(`Found SKU in sheet "${sheet.title}" at row:`, rowIndex + 2);
                    
                    // Only update fields that are provided (not null)
                    if (productName) rows[rowIndex]['Name'] = productName;
                    if (productId) rows[rowIndex]['Product ID'] = productId;
                    if (inventory !== null) rows[rowIndex]['Inventory'] = inventory;
                    if (price !== null) rows[rowIndex]['Price'] = price;
                    rows[rowIndex]['Status'] = status || 'Updated via Webhook';
                    
                    // Format date as MM/DD/YYYY hh:mm AM/PM
                    const now = new Date();
                    const formattedDate = now.toLocaleDateString('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    });
                    rows[rowIndex]['Last Updated'] = formattedDate;
                    
                    await rows[rowIndex].save();
                    console.log(`Row updated successfully in sheet "${sheet.title}"`);
                    updatedAny = true;
                }
            }
            
            if (!updatedAny) {
                console.log('No matching SKU found in any sheet:', sku);
            }
        } catch (error) {
            console.error('Error in updateInventory:', error);
            throw error;
        }
    }
}

module.exports = new SheetsManager(); 