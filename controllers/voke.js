const {
  Types: { ObjectId }
} = require("mongoose");
const User = require("../models/User");
const Voke = require("../models/Voke");
const ErrorResponse = require("../utils/ErrorResponse");

module.exports.postVoke = async (req, res, next) => {
  const { title, body, location } = req.body;

  const { user } = req;
  try {
    console.log(req.body);
    const voke = await Voke.create({
      title,
      body,
      location: location
        ? {
            type: "Point",
            coordinates: [location.longitude, location.latitude]
          }
        : null,
      authors: [new ObjectId(user.id)]
    });
    res.status(201).json({ success: true, voke });
  } catch (error) {
    next(new ErrorResponse(error.message));
  }
};

module.exports.modifyVoke = async (req, res, next) => {
  const { title, body, location } = req.body;
  const { vokeId } = req.params;
  const { user } = req;
  if (!ObjectId.isValid(vokeId))
    return next(new ErrorResponse("Invalid id", 400));

  try {
    var voke = await Voke.findById(vokeId);
    if (!voke) return next(new ErrorResponse("Voke not found", 404));
    if (!voke.authors.includes(user.id))
      return next(new ErrorResponse("Unauthorized to edit"));
    voke.title = title;
    voke.body = body;
    voke.location = location
      ? { type: "Point", coordinates: [location.longitude, location.latitude] }
      : null;
    voke = await voke.save();
    res.status(200).json({ success: true, voke });
  } catch (error) {
    next(new ErrorResponse(error.message));
  }
};

module.exports.addAuthor = async (req, res, next) => {
  const { vokeId } = req.params;
  const authors = req.params["0"].split("/");
  const { user } = req;
  if (!ObjectId.isValid(vokeId))
    return next(new ErrorResponse("Invalid id", 400));
  try {
    var voke = await Voke.findById(vokeId);
    if (!voke) return next(new ErrorResponse("Voke not found", 404));
    if (!voke.authors.includes(user.id))
      return next(new ErrorResponse("Unauthorized to edit"));
    for (var i = 0; i < authors.length; i++)
      if (!(await User.findById(authors[i])))
        return next(new ErrorResponse(`Cannot find user: ${authors[i]}`, 404));
    voke.authors = [
      ...new Set([
        ...voke.authors.map((auth) => auth.toString()),
        ...authors.map((auth) => auth.toString())
      ])
    ];
    voke = await voke.save();
    res.status(200).json({ success: true, voke });
  } catch (error) {
    next(new ErrorResponse(error.message));
  }
};

module.exports.deleteVoke = async (req, res, next) => {
  const { vokeId } = req.params;
  const { user } = req;
  if (!ObjectId.isValid(vokeId))
    return next(new ErrorResponse("Invalid id", 400));

  try {
    var voke = await Voke.findById(vokeId);
    if (!voke) return next(new ErrorResponse("Cannot find voke", 404));
    if (!voke.authors.includes(user.id))
      return next(new ErrorResponse("Unauthorized to delete"));
    voke = await Voke.findByIdAndDelete(vokeId);
    res.status(200).json({ success: true, voke });
  } catch (error) {
    next(new ErrorResponse(error.message));
  }
};

module.exports.getVokes = async (req, res, next) => {
  try {
    var vokes = await Voke.find();
    res.status(200).json({ success: true, vokes });
  } catch (error) {
    next(new ErrorResponse(error.message));
  }
};
module.exports.getVoke = async (req, res, next) => {
  const { vokeId } = req.params;
  if (!ObjectId.isValid(vokeId))
    return next(new ErrorResponse("Invalid id", 400));
  try {
    var voke = await Voke.findById(vokeId);
    if (!voke) return next(new ErrorResponse("Cannot find voke", 404));
    res.status(200).json({ success: true, voke });
  } catch (error) {
    next(new ErrorResponse(error.message));
  }
};
