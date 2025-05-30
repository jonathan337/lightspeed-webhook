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
    
    // For now, just return a successful response
    // In the next iteration, we'll actually connect to Google Sheets
    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        message: 'Scheduled update function is working',
        timestamp: new Date().toISOString(),
        config: {
          spreadsheetId: SPREADSHEET_ID ? SPREADSHEET_ID.substring(0, 5) + '...' : 'Not configured',
          clientEmail: CLIENT_EMAIL ? CLIENT_EMAIL.substring(0, 5) + '...' : 'Not configured',
          privateKey: PRIVATE_KEY ? 'Configured (hidden)' : 'Not configured'
        }
      })
    };
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