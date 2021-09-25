const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  reference: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Voke",
    required: true
  },
  priority: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
    default: 1
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

module.exports = Notification = mongoose.model(
  "Notification",
  NotificationSchema
);
