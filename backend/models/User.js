const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  role: { type: String, enum: ["interviewer", "interviewee"], required: true },
  interviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Interview" }]
});

module.exports = mongoose.model("User", userSchema);
