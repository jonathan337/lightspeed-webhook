// This is a simplified version to test functionality
exports.handler = async function(event, context) {
  console.log('Starting simplified scheduled update function');
  
  try {
    // Return immediately for OPTIONS requests (CORS preflight)
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET'
        },
        body: ''
      };
    }
    
    // Check if this is a manual trigger or scheduled
    const isManual = event.httpMethod === 'GET';
    console.log(`Update triggered ${isManual ? 'manually' : 'by schedule'}`);
    
    // This function currently doesn't do anything with sheets or API
    // It's just to test if Netlify functions are working
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: 'Scheduled update function is working',
        timestamp: new Date().toISOString(),
        event_type: event.httpMethod,
        manual_trigger: isManual
      })
    };
  } catch (error) {
    console.error('Error in scheduled update:', error);
    console.error('Error stack:', error.stack);
    
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: 'Error in scheduled update',
        message: error.message,
        stack: error.stack
      })
    };
  }
}; 