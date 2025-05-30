// Simple function to test scheduled updates
exports.handler = async function(event, context) {
  try {
    console.log('Starting scheduled update function');
    
    // Check if the environment variables exist but don't try to use them yet
    const hasSpreadsheetId = !!process.env.GOOGLE_SPREADSHEET_ID;
    const hasClientEmail = !!process.env.GOOGLE_CLIENT_EMAIL;
    const hasPrivateKey = !!process.env.GOOGLE_PRIVATE_KEY;
    
    // Return a response with environment status
    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        message: 'Scheduled update function is working',
        timestamp: new Date().toISOString(),
        environment: {
          hasSpreadsheetId,
          hasClientEmail,
          hasPrivateKey
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