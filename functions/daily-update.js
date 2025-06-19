// Daily update function that runs once per day at midnight
exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      message: 'Daily update function is working',
      timestamp: new Date().toISOString()
    })
  };
}; 