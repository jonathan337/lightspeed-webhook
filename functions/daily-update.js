// Daily update function that tests real functionality
const sheetsManager = require('../sheets');

exports.handler = async function(event, context) {
  const results = {
    timestamp: new Date().toISOString(),
    tests: {}
  };

  try {
    // Test 1: Check if Google Sheets can initialize
    console.log('Testing Google Sheets connection...');
    await sheetsManager.init();
    results.tests.googleSheets = 'Connection successful';
    results.tests.sheetCount = sheetsManager.sheets ? sheetsManager.sheets.length : 0;
    
    // Test 2: Check environment variables
    results.tests.envVars = {
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID ? 'Set' : 'Missing',
      clientEmail: process.env.GOOGLE_CLIENT_EMAIL ? 'Set' : 'Missing',
      privateKey: process.env.GOOGLE_PRIVATE_KEY ? 'Set' : 'Missing'
    };

    results.status = 'success';
    results.message = 'Daily update function tested successfully';

  } catch (error) {
    console.error('Daily update test failed:', error);
    results.status = 'error';
    results.message = 'Daily update test failed';
    results.error = error.message;
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(results)
  };
}; 