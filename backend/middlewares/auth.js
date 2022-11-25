const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

exports.isAutheticatedUser = async (req, res, next) => {
  console.log(req.cookies, "cookie");
  const { token } = req.headers;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Please login to access this resource",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Please login to access this resource",
    });
  }
};

exports.authorisedRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(
        res.status(403).json({
          success: false,
          message: `Role (${req.user.role}) is not allowed to access this resource`,
        })
      );
    }

    next();
  };
};
