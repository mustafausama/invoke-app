const passwordValidator = require("password-validator");

const { validate: uuidvalidate } = require("uuid");

const isEmptyObject = require("is-empty-object");

const countryList = require("country-list");

const {
  isEmpty,
  isLength,
  isAlphanumeric,
  isNumeric,
  isMobilePhone,
  isEmail,
  isDate,
  isAfter,
  equals
} = require("validator");

const ErrorResponse = require("../utils/ErrorResponse");

module.exports.validateUsernamePassword = (req, res, next) => {
  var { username, password } = req.body;
  if (
    !username ||
    isEmpty((username = username.trim())) ||
    !isLength(username, { min: 3, max: 25 })
  )
    return next(new ErrorResponse("Invalid Username", 400));
  else req.body.username = username;

  const pwSchema = new passwordValidator();
  pwSchema.is().min(6).is().max(25);

  if (!password || isEmpty(password) || !pwSchema.validate(password))
    return next(new ErrorResponse("Invalid Password", 400));

  next();
};

module.exports.validateRegister = (req, res, next) => {
  if (!req.body.location)
    return next(new ErrorResponse("No location found", 400));
  const {
    country,
    location: { longitude: lng, latitude: lat }
  } = req.body;
  if (
    !country ||
    isEmpty(country) ||
    !isLength(country, { min: 2, max: 2 }) ||
    !countryList.getCodes().includes(country)
  )
    return next(new ErrorResponse("Invalid Country", 400));
  if (!validateCoords(lat, lng))
    return next(new ErrorResponse("Invalid location coordinates", 400));

  next();
};

module.exports.validateInvoke = (req, res, next) => {
  if (!req.body.location)
    return next(new ErrorResponse("No location found", 400));
  var {
    title,
    body,
    location: { longitude: lng, latitude: lat }
  } = req.body;
  if (
    !title ||
    isEmpty((title = title.trim())) ||
    !isLength(title, { min: 3, max: 100 })
  )
    return next(new ErrorResponse("Invalid Title", 400));
  else req.body.title = title;

  if (
    body &&
    (isEmpty((req.body.body = body.trim())) ||
      !isLength(body, { min: 3, max: 5000 }))
  )
    return next(new ErrorResponse("Invalid Body", 400));

  if (!validateCoords(lat, lng))
    return next(new ErrorResponse("Invalid location coordinates", 400));

  next();
};

module.exports.validateVoke = (req, res, next) => {
  var { title, body, location } = req.body;

  if (
    !title ||
    isEmpty((title = title.trim())) ||
    !isLength(title, { min: 3, max: 100 })
  )
    return next(new ErrorResponse("Invalid Title", 400));
  else req.body.title = title;

  if (
    body &&
    (isEmpty((req.body.body = body.trim())) ||
      !isLength(body, { min: 3, max: 5000 }))
  )
    return next(new ErrorResponse("Invalid Title", 400));
  if (location && !validateCoords(location.latitude, location.longitude))
    return next(new ErrorResponse("Invalid location coordinates", 400));

  next();
};

validateCoords = (lat, lng) => {
  return (
    isFinite(lat) &&
    Math.abs(lat) <= 90 &&
    isFinite(lng) &&
    Math.abs(lng) <= 180
  );
};
