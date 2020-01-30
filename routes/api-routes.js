// get external npm package
const router = require("express").Router();
// get internal database models
const db = require("../models");

// write a new document to the workout collection
//   when a new workout is created.
router.post("/workout/:workout", (req, res) => {
  const body = {
    name: req.params.workout,
    current: true
  };

  db.Workout.create(body)
    .then(dbExercise => {
      res.json(dbExercise);
    })
    .catch(err => {
      res.json(err);
    });
});

// retrieves all exercises in the database (regardless of the workout)
//   from the exercises collection
router.get("/exercises", (req, res) => {
  db.Exercise.find({})
    .then(dbExercises => {
      res.json(dbExercises);
    })
    .catch(err => {
      res.json(err);
    });
});

// retrieves the current workout from the currents collection
// should only be one.  Uses the first, if more than one retrieved
router.get("/workouts/current", (req, res) => {
  db.Workout.findOne({ current: true })
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

// retrieves all the workout names from the workouts collection
router.get("/workouts", (req, res) => {
  db.Workout.find({})
    .then(dbWorkouts => {
      res.json(dbWorkouts);
    })
    .catch(err => {
      res.json(err);
    });
});

// makes the workout with the given id current
router.put("/workout/:id", (req, res) => {

  db.Workout.updateOne(
    {
      _id: req.params.id
    },
    { $set: { current: true } }
  )
    .then(result => {
      res.json(result);
    })
    .catch(error => {
      res.json(error);
    });
});

// puts the exercise in the workout
router.put("/workout/:workoutId/:exerciseId", (req, res) => {
  
  db.Workout.findOneAndUpdate(
    { _id: req.params.workoutId },
    { $push: { "exercises": {"_id": req.params.exerciseId,  "whenDone": getTime() } }}
  )
    .then(result => {
      res.json(result);
    })
    .catch(error => {
      res.json(error);
    });
});

// deletes all the current fields from the workouts collection
//   (so nothing is noted as current)
router.put("/workouts/current", (req, res) => {

  db.Workout.update(
    {
      current: true
    },
    { $unset: { current: "" } }
  )
    .then(result => {
      res.json(result);
    })
    .catch(error => {
      res.json(error);
    });
});

// Get populated current workout
// Populate is a mongoose term, to POPULATE with RELATED data
router.get("/workout/populated", (req, res) => {

  db.Workout.find({"current": true})
    // .populate("exercises")  
    .populate("exerciseIds")  
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

// Write new document to exercises when new exercise added
router.post("/exercise/:name/:unit/:reps", (req, res) => {
  const body = {
    description: req.params.name,
    unit: req.params.unit,
    reps: req.params.reps
  }
  db.Exercise.create(body)
    .then(dbExercise => {
      res.json(dbExercise);
    })
    .catch(err => {
      res.json(err);
    });
});

// get current date and time
// in local timezone
// in readable format
function getTime() {
  // get date & time (in browser's time zone)
  let today = new Date();
  // get parts of the date and time we need
  let year = today.getFullYear();
  let month = today.getMonth() + 1; // returns 0 - 11; need 1 - 12
  let date = today.getDate();
  let hour = today.getHours();
  let minutes = today.getMinutes();

  // change into strings
  year = year.toString();
  month = month.toString();
  date = date.toString();  // just the 1-31 part

    // put in two character string format with leading 0, if needed.
  minutes = String(minutes).padStart(2, '0')

  // date in xx/xx/xxxx format
  date = month + "/"  + date + "/" + year;

  // convert 24 hour time to 12 am/pm format
  if (hour == 0) {
    hour = 12;
    ampm = "AM";
  } else if (hour == 12) {
    ampm = "PM";
  } else if (hour > 12) {
    hour = hour - 12;
    ampm = "PM";
  } else {
    ampm = "AM";
  };
  // then change hour to a string, too
  hour = hour.toString();

  // assign time in xx:xx AM (or PM) format
  time = hour + ":" + minutes + " " + ampm;
  // put it all together and return
  return date + " " + time;

} // end of getTime function

module.exports = router;