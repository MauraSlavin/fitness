const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
  // id of exercise in workout
  exerciseId: {
    type: Schema.Types.ObjectId,
    ref: "Exercise"
  },
  // time stamp when added
  //   I used Java Date.now() for
  //   timezone and formatting, so
  //   used string data type
  whenDone: {
    type: String
  }
});

const WorkoutSchema = new Schema({
  // name of workout
  name: {
    type: String,
    unique: true,
    required: "Workout must have a unique name."
  },
  // this field only exists if this workout
  //   is the current workout, and it'll then be true
  current: {
    type: Boolean
  },
  // array of {exerciseID and timestamp} for each
  //   exercise completed in the workout.
  exercises: [exerciseSchema]
});

const Workout = mongoose.model("Workout", WorkoutSchema);

module.exports = Workout;
