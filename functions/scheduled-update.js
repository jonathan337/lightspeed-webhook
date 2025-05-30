// Function to run hourly updates from Google Sheets
const { GoogleSpreadsheet } = require('google-spreadsheet');

// This handler will be scheduled to run every hour
exports.handler = async function(event, context) {
  try {
    console.log('Starting scheduled update function');
    
    // Initialize environment variables
    const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
    const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
    const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;
    
    if (!SPREADSHEET_ID || !CLIENT_EMAIL || !PRIVATE_KEY) {
      console.error('Missing required Google Sheets credentials');
      return {
        statusCode: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          error: 'Configuration error',
          message: 'Missing Google Sheets credentials'
        })
      };
    }
    
    // Log that we're going to connect to Google Sheets
    console.log('Connecting to Google Sheets...');
    
    try {
      // Initialize the Google Spreadsheet
      const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
      
      // Authenticate with the Google Sheets API
      await doc.useServiceAccountAuth({
        client_email: CLIENT_EMAIL,
        private_key: PRIVATE_KEY.replace(/\\n/g, '\n'),
      });
      
      // Load the document properties and worksheets
      await doc.loadInfo();
      
      console.log(`Successfully connected to sheet: ${doc.title}`);
      console.log(`Total sheets: ${doc.sheetCount}`);
      
      // Get information about all sheets
      const sheetInfo = doc.sheetsByIndex.map((sheet, index) => ({
        index,
        title: sheet.title,
        rowCount: sheet.rowCount,
        columnCount: sheet.columnCount
      }));
      
      return {
        statusCode: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          message: 'Successfully connected to Google Sheets',
          timestamp: new Date().toISOString(),
          spreadsheetTitle: doc.title,
          sheetCount: doc.sheetCount,
          sheets: sheetInfo
        })
      };
    } catch (sheetError) {
      console.error('Error connecting to Google Sheets:', sheetError);
      return {
        statusCode: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          error: 'Google Sheets error',
          message: sheetError.message
        })
      };
    }
  } catch (error) {
    console.error('Error in scheduled update:', error);
    
    return {
      statusCode: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Function error',
        message: error.message
      })
    };
  }
}; 