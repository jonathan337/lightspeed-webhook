// Simple function that returns a success message to verify Netlify functions are working
exports.handler = async function(event, context) {
  try {
    console.log('Scheduled update function called');
    console.log('HTTP Method:', event.httpMethod);
    
    // Return a simple response
    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        message: 'Scheduled update function is working',
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Error in scheduled update function:', error);
    
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