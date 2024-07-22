const mongoose = require("mongoose");
const { Schema } = mongoose;

const TranscationDetail = new Schema({
  Give_by: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  Resive: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  T_name: {
    type: String,
  },
  amount: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
const Transcation = mongoose.model("transcationDetail", TranscationDetail);
module.exports = Transcation;
