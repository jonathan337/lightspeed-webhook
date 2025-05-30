// Simple test function that returns a basic response
exports.handler = async function(event, context) {
  try {
    console.log('Hourly update function called');
    
    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        message: 'Hourly update function is working',
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Error in hourly update function:', error);
    
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