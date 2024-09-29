import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  // Get token from cookies
  const token = req.cookies.token;
  if (!token) return res.status(401).send('Access Denied. No token provided.');

  try {
    // Verify the token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; 
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};

export const roleCheck = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).send('Access Denied');
    }
    next();
  };
};
