const mongoose = require("mongoose");
const Notification = require("./Notification");

const InvokeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: false
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
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  voke: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Voke",
    required: true
  }
});

module.exports = Invoke = mongoose.model("Invoke", InvokeSchema);
