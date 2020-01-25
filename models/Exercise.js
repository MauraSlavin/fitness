const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
  description: {
    type: String,
    trim: true,
    required: "Description of exercise is required."
  },
  unit: {
    type: String,
    trim: true,
    required: "Unit of measure (weight, distance, etc.) is required."
  },
  reps: {
    type: Number,
    default: 1
  }
});

const Exercise = mongoose.model("Exercise", ExerciseSchema);

module.exports = Exercise;
