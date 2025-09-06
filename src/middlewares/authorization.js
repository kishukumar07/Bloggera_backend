export const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.body.role)) {
      return res.status(403).json({ success: false, msg: "ROLE FORBIDDEN " });
    }
    next();
  };
};
