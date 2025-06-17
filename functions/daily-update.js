// Daily update function that runs once per day at midnight
exports.handler = async (event, context) => {
  console.log('Daily update function triggered at:', new Date().toISOString());
  
  const result = {
    status: 'success',
    message: 'Daily update completed successfully',
    timestamp: new Date().toISOString()
  };
  
  console.log('Daily update completed:', result);
  
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(result)
  };
}; 