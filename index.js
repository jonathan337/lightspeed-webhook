const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const config = require('./config');
const sheetsManager = require('./sheets');

const app = express();

// Configure body parser to handle raw data
app.use(express.raw({ type: 'application/x-www-form-urlencoded' }));
app.use(bodyParser.json());

// Add this test route
app.get('/test', (req, res) => {
    console.log('Test endpoint hit!');
    res.json({ message: 'Test successful!' });
});

// Add this new GET endpoint
app.get('/webhook', (req, res) => {
    res.json({ 
        message: 'Webhook endpoint is active', 
        note: 'This endpoint only accepts POST requests from Vend/Lightspeed'
    });
});

app.post('/webhook', async (req, res) => {
    try {
        // Parse the raw body
        const rawBody = req.body.toString('utf8');
        const params = new URLSearchParams(rawBody);
        const payloadStr = params.get('payload');
        
        if (!payloadStr) {
            console.error('No payload received');
            return res.status(400).json({ error: 'No payload received' });
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
                return res.status(400).json({ error: 'No product SKU in payload' });
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
                return res.status(400).json({ error: 'No SKU in payload' });
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

        res.json({ status: 'success' });
    } catch (error) {
        console.error('Webhook processing error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
}); 