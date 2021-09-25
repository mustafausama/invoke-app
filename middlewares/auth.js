const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ErrorResponse = require("../utils/ErrorResponse");

exports.protect = (role) => async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer") &&
    req.headers.authorization.split(" ").length === 2
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token)
    return next(new ErrorResponse("Invalid or missing access token", 401));

  try {
    const decoded = jwt.verify(token, process.env.secretOrKey);
    const user = await User.findById(decoded.id);
    if (!user) return next(new ErrorResponse("Invalid user id", 404));
    if (!user.role.includes(role))
      return next(new ErrorResponse("Unauthorized", 401));
    req.user = { id: decoded.id, username: decoded.username };
    next();
  } catch (error) {
    return next(new ErrorResponse(error.message));
  }
};
