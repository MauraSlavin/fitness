const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
  // description of exercise
  description: {
    type: String,
    trim: true,
    required: "Description of exercise is required."
  },
  // units (weight, distance, etc.) or exercise
  unit: {
    type: String,
    trim: true,
    required: "Unit of measure (weight, distance, etc.) is required."
  },
  // how many or how long (5 miles, 20 reps, etc.)
  reps: {
    type: Number,
    default: 1
  }
});

const Exercise = mongoose.model("Exercise", ExerciseSchema);

module.exports = Exercise;
