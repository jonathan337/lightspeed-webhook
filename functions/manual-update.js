// Simple function that returns a success message to verify Netlify functions are working
exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      message: 'Manual update function is working',
      timestamp: new Date().toISOString()
    })
  };
}; 