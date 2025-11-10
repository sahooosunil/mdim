function requireRole(role) {
    return (req, res, next) => {
      const roles = req.user?.roles || [];
      if (roles.includes(role)) return next();
      return res.status(403).json({ message: 'Forbidden' });
    };
  }
  
 export default requireRole;
  