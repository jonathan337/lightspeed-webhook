// Function to run hourly updates from Google Sheets
const { GoogleSpreadsheet } = require('google-spreadsheet');

// This handler will be scheduled to run every hour
exports.handler = async function(event, context) {
  try {
    console.log('Starting scheduled update function');

    // Return a successful response for testing
    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        message: 'Scheduled update function is working',
        timestamp: new Date().toISOString(),
        info: 'This function will be enhanced to fetch data from Google Sheets'
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