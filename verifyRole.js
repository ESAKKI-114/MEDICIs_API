module.exports = function verifyRole(allowedRoles = []) {
  return (req, res, next) => {
    const userRole = req.headers['x-user-role']; // e.g., 'ADMIN'

    if (!userRole) {
      return res.status(401).json({ error: "User role missing in request" });
    }

    if (!allowedRoles.includes(userRole.toUpperCase())) {
      return res.status(403).json({ error: "Access denied: insufficient role" });
    }

    next(); // ✅ Proceed to route handler
  };
};
