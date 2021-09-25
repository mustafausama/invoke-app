const User = require("../models/User");
const ErrorResponse = require("../utils/ErrorResponse");

module.exports.register = async (req, res, next) => {
  const {
    username,
    password,
    country,
    location: { longitude, latitude }
  } = req.body;
  try {
    const userExists = await User.findOne({ username });
    if (userExists) return next(new ErrorResponse("Username exists", 400));
    const user = await User.create({
      username,
      password,
      location: {
        type: "Point",
        coordinates: [longitude, latitude]
      },
      country,
      role: ["author"]
    });
    const token = user.getSignedToken();
    res.status(201).json({ success: true, token });
  } catch (error) {
    next(error);
  }
};

module.exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username }).select("+password");

    if (!user) return next(new ErrorResponse("User not found", 404));
    if (!(await user.matchPassword(password)))
      return next(new ErrorResponse("Invalid password", 400));

    const token = user.getSignedToken();

    res.status(201).json({ success: true, token });
  } catch (error) {
    return next(new ErrorResponse(error.message));
  }
};
module.exports.deleteUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    var user = await User.findById(userId);
    if (!user) return next(new ErrorResponse("Cannot find user", 404));
    user = await User.findByIdAndDelete(userId);
    res.status(200).json({ success: true, user });
  } catch (error) {
    return next(new ErrorResponse(error.message));
  }
};
