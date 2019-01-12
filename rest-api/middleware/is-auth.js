const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = new Error('Headers not present')
    error.statusCode = 401;
    throw error;
  }
  // Get the token from our request headers
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "secretkey");
  } catch(err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error('Not Authenticated');
    error.statusCode = 401;
    throw error;
  }
  // Store the user ID in the request, so we can use it in other requests
  req.userId = decodedToken.userId;
  // forward next request
  next();
};