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
            
            this.sheet = this.doc.sheetsByIndex[1];
            console.log('Sheet loaded successfully:', this.sheet.title);
            
            if (this.sheet.title !== 'Lightspeed API Test Sync') {
                console.error('Warning: Sheet title does not match expected name');
            }
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
            const rows = await this.sheet.getRows();
            console.log('Total rows in sheet:', rows.length);
            console.log('First row headers:', Object.keys(rows[0])); // Debug line to see column headers
            
            // Find the row with matching SKU
            const rowIndex = rows.findIndex(row => {
                const sheetSku = row['SKU']?.toString().trim();
                const searchSku = sku?.toString().trim();
                console.log('Comparing SKUs:', { sheetSku, searchSku });
                return sheetSku === searchSku;
            });
            
            console.log('Found row index:', rowIndex);
            
            if (rowIndex !== -1) {
                console.log('Updating row:', rowIndex + 2);
                
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
                console.log('Row updated successfully');
            } else {
                console.log('No matching SKU found:', sku);
            }
        } catch (error) {
            console.error('Error in updateInventory:', error);
            throw error;
        }
    }
}

module.exports = new SheetsManager(); 