const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
  interviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  interviewee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  duration: {
     type: Number, 
     required: true,
     default: 60
  },
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
  timmings: {
       type: Date,
       required: true,
  },
  start_time: {
       type: Date,
  },
  end_time: {
       type: Date,
  },
  isCompeleted: {
     type: Boolean,
     default : false,   
  },
  recording: {
      type: String,
  },
  finalScore: {
     type: Number,
  }
});

module.exports = mongoose.model("Interview", interviewSchema);