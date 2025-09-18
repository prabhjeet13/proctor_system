const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  time: { 
    type: Date, 
    default: Date.now 
  },
  type: { 
    type: String, 
    required: true 
  },
});

module.exports = mongoose.model("Event", eventSchema);
