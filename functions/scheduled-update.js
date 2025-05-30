// Function to test Google Sheets connection
const { GoogleSpreadsheet } = require('google-spreadsheet');

exports.handler = async function(event, context) {
  try {
    console.log('Starting scheduled update function');
    
    // Check environment variables
    const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
    const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
    const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;
    
    if (!SPREADSHEET_ID || !CLIENT_EMAIL || !PRIVATE_KEY) {
      return {
        statusCode: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          message: 'Environment variables missing',
          environment: {
            hasSpreadsheetId: !!SPREADSHEET_ID,
            hasClientEmail: !!CLIENT_EMAIL,
            hasPrivateKey: !!PRIVATE_KEY
          }
        })
      };
    }

    // Try to connect to Google Sheets
    console.log('Attempting to connect to Google Sheets...');
    
    try {
      const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
      
      await doc.useServiceAccountAuth({
        client_email: CLIENT_EMAIL,
        private_key: PRIVATE_KEY.replace(/\\n/g, '\n'),
      });
      
      await doc.loadInfo();
      
      console.log(`Connected to: ${doc.title}`);
      
      return {
        statusCode: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          message: 'Successfully connected to Google Sheets',
          timestamp: new Date().toISOString(),
          spreadsheet: {
            title: doc.title,
            sheetCount: doc.sheetCount
          }
        })
      };
    } catch (sheetsError) {
      console.error('Google Sheets error:', sheetsError);
      return {
        statusCode: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          message: 'Google Sheets connection failed',
          error: sheetsError.message,
          timestamp: new Date().toISOString()
        })
      };
    }
  } catch (error) {
    console.error('Function error:', error);
    
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