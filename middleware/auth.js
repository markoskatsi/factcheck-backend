const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (apiKey && apiKey === process.env.API_SECRET_KEY) {
    next();
  } else {
    res.status(401).json({ 
      error: 'Unauthorised',
      message: 'Valid API key required with your request'
    });
  }
};

export default validateApiKey;
