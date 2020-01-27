const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
  exerciseId: {
    type: Schema.Types.ObjectId,
    ref: "Exercise"
  },
  whenDone: {
    type: String
  }
});

const WorkoutSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: "Workout must have a unique name."
  },
  current: {
    type: Boolean
  },
  exercises: [exerciseSchema]
});

const Workout = mongoose.model("Workout", WorkoutSchema);

module.exports = Workout;
