const { URLSearchParams } = require('url');
const config = require('../config');
const sheetsManager = require('../sheets');

exports.handler = async (event, context) => {
  try {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }

    // Parse the raw body
    const rawBody = event.body;
    const params = new URLSearchParams(rawBody);
    const payloadStr = params.get('payload');
    
    if (!payloadStr) {
      console.error('No payload received');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No payload received' })
      };
    }

    const payload = JSON.parse(payloadStr);
    console.log('Full payload:', payload);

    // Get the base price from price_book_entries
    const basePrice = payload.price_book_entries?.find(entry => entry.type === 'BASE')?.price || null;

    if (params.get('type') === 'inventory.update') {
      const product = payload.product;
      const inventory = payload.count;

      if (!product || !product.sku) {
        console.error('No product SKU in payload');
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'No product SKU in payload' })
        };
      }

      await sheetsManager.updateInventory(
        product.sku,
        product.name,
        product.id,
        inventory,
        basePrice,
        'Inventory Update'
      );
      
      console.log('Successfully updated inventory for SKU:', product.sku);
    } else if (params.get('type') === 'product.update') {
      // Handle product updates
      if (!payload.sku) {
        console.error('No SKU in payload');
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'No SKU in payload' })
        };
      }

      await sheetsManager.updateInventory(
        payload.sku,
        payload.name,
        payload.id,
        payload.inventory?.[0]?.count,
        basePrice,
        'Product Update'
      );
      
      console.log('Successfully updated product for SKU:', payload.sku);
    } else {
      console.log('Unhandled event type:', params.get('type'));
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'success' })
    };
  } catch (error) {
    console.error('Webhook processing error:', error);
    console.error('Error stack:', error.stack);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
}; 