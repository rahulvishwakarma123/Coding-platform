

// This assumes you have a role field in your User model
// If not, add this to your User schema:
// 

export const requireAdmin = (req, res, next) => {
  // req.user should be set by your auth middleware (protect)
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authenticated' 
    });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Admin privileges required.' 
    });
  }
  
  next();
};