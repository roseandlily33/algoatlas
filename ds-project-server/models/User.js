const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  weeklyFocus: [{ type: mongoose.Schema.Types.ObjectId, ref: "Algorithm" }], // up to 8
  weeklyFocusStartDate: { type: Date }, // Sunday of current week
});

module.exports = mongoose.model("User", UserSchema);
