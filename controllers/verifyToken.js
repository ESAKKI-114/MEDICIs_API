const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Get token from headers
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // Bearer tokenString
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access denied. Token missing.' });
  }

  try {
    // Verify token using your secret key
    const secretKey = process.env.JWT_SECRET || 'your_jwt_secret'; // Use env var in prod
    const decoded = jwt.verify(token, secretKey);

    // Attach user info from token to request object
    req.user = decoded;

    next(); // proceed to next middleware/controller
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = verifyToken;
