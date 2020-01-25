const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CurrentSchema = new Schema({
  workoutId: {
    type: Schema.Types.ObjectId,
    ref: "exercise"
  }
});

const Current = mongoose.model("Current", CurrentSchema);

module.exports = Current;
