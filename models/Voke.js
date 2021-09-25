const mongoose = require("mongoose");

const VokeSchema = new mongoose.Schema({
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
      enum: ["Point"]
    },
    coordinates: {
      type: [Number]
    }
  },
  authors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  ],
  radius: {
    type: Number,
    required: true,
    default: 20000
  }
});

module.exports = Voke = mongoose.model("Voke", VokeSchema);
