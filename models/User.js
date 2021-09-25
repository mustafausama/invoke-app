const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },
  country: {
    type: String,
    length: 2,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  role: {
    type: [{ type: String, enum: ["new", "author"] }],
    required: true,
    default: ["new"]
  }
});

UserSchema.pre("save", async function (next) {
  if (this.isNew) {
    const user = await this.constructor.findOne({ username: this.username });
    if (user) return next(new Error("Username exists"));
    if (!this.isModified("password")) next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.getSignedToken = function () {
  console.log(this.role);
  return jwt.sign(
    { id: this._id, username: this.username, role: this.role },
    process.env.secretOrKey,
    {
      expiresIn: process.env.JWT_EXPIRE
    }
  );
};

UserSchema.index({ location: "2dsphere" });

module.exports = User = mongoose.model("User", UserSchema);
