const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
  name: { type: String, enum: ["A", "B"], required: true, unique: true },
  algorithms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Algorithm" }], // up to 20
});

// Limit algorithms array to 20
GroupSchema.pre("save", function (next) {
  if (this.algorithms.length > 20) {
    return next(new Error("A group can have at most 20 algorithms."));
  }
});

const Group = mongoose.model("Group", GroupSchema);

module.exports = { Group };
