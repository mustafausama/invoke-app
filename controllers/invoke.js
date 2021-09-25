const {
  Types: { ObjectId }
} = require("mongoose");
const Invoke = require("../models/Invoke");
const Notification = require("../models/Notification");
const User = require("../models/User");
const Voke = require("../models/Voke");
const ErrorResponse = require("../utils/ErrorResponse");
const geolib = require("geolib");
module.exports.postInvoke = async (req, res, next) => {
  const {
    title,
    body,
    location: { latitude: lat, longitude: lng }
  } = req.body;
  const { vokeId } = req.params;
  if (!ObjectId.isValid(vokeId))
    return next(new ErrorResponse("Invalid id", 400));

  const { user } = req;
  try {
    const voke = await Voke.findById(vokeId);
    if (!voke) return next(new ErrorResponse("Voke not found", 404));
    if (!voke.authors.includes(user.id))
      return next(new ErrorResponse("Unauthorized voke", 401));
    const invoke = await Invoke.create({
      title,
      body,
      location: { type: "Point", coordinates: [lng, lat] },
      author: new ObjectId(user.id),
      voke: new ObjectId(voke._id)
    });
    const affectedUsers = await User.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: invoke.location.coordinates
          },
          $maxDistance: voke.radius
        }
      },
      _id: { $ne: user.id }
    });
    await Promise.all(
      affectedUsers.map(async (user) => {
        const distance = geolib.getDistance(
          {
            latitude: user.location.coordinates[1],
            longitude: user.location.coordinates[0]
          },
          {
            latitude: invoke.location.coordinates[1],
            longitude: invoke.location.coordinates[0]
          }
        );
        const priority =
          6 - Math.max(Math.ceil((distance * 5) / voke.radius), 1);
        await Notification.create({
          title: invoke.title,
          reference: new ObjectId(invoke.voke),
          user: new ObjectId(user._id),
          priority
        });
      })
    );
    res.status(201).json({ success: true, invoke });
  } catch (error) {
    next(new ErrorResponse(error.message));
  }
};

module.exports.modifyInvoke = async (req, res, next) => {
  const {
    title,
    body,
    location: { latitude: lat, longitude: lng }
  } = req.body;
  const { invokeId } = req.params;
  if (!ObjectId.isValid(invokeId))
    return next(new ErrorResponse("Invalid id", 400));

  const { user } = req;
  try {
    var invoke = await Invoke.findById(invokeId);
    if (!invoke) return next(new ErrorResponse("Invoke not found", 404));
    if (invoke.author.toString() != user.id)
      return next(new ErrorResponse("Unauthorized to edit"));
    invoke.title = title;
    invoke.body = body;
    invoke.location = { type: "Point", coordinates: [lng, lat] };
    invoke = await invoke.save();
    res.status(200).json({ success: true, invoke });
  } catch (error) {
    next(new ErrorResponse(error.message));
  }
};

module.exports.deleteInvoke = async (req, res, next) => {
  const { invokeId } = req.params;
  const { user } = req;
  if (!ObjectId.isValid(invokeId))
    return next(new ErrorResponse("Invalid id", 400));

  try {
    var invoke = await Invoke.findById(invokeId);
    if (!invoke) return next(new ErrorResponse("Cannot find invoke", 404));
    if (invoke.author.toString() != user.id.toString())
      return next(new ErrorResponse("Unauthorized to delete"));
    invoke = await Invoke.findByIdAndDelete(invokeId);
    res.status(200).json({ success: true, invoke });
  } catch (error) {
    next(new ErrorResponse(error.message));
  }
};

module.exports.getInvokes = async (req, res, next) => {
  const { vokeId } = req.params;
  if (!ObjectId.isValid(vokeId))
    return next(new ErrorResponse("Invalid id", 400));

  try {
    var voke = await Voke.findById(vokeId);
    if (!voke) return next(new ErrorResponse("Voke not found", 404));
    var invokes = await Invoke.find({ vokeId }).populate("author");
    res.status(200).json({ success: true, invokes });
  } catch (error) {
    next(new ErrorResponse(error.message));
  }
};

module.exports.getInvoke = async (req, res, next) => {
  const { invokeId } = req.params;
  if (!ObjectId.isValid(invokeId))
    return next(new ErrorResponse("Invalid id", 400));

  try {
    var invoke = await Invoke.findById(invokeId).populate("author");
    if (!invoke) return next(new ErrorResponse("Invoke not found", 404));
    res.status(200).json({ success: true, invoke });
  } catch (error) {
    next(new ErrorResponse(error.message));
  }
};

module.exports.getNotifications = async (req, res, next) => {
  const { id: userId } = req.user;
  try {
    const notifications = await Notification.find({ user: userId });
    await Notification.deleteMany({ user: userId });
    res.status(200).json({ success: 200, notifications });
  } catch (error) {
    next(new ErrorResponse(error.message));
  }
};
