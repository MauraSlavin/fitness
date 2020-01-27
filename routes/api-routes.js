// get external npm package
const router = require("express").Router();
// get internal database models
const db = require("../models");

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
  console.log("in GET api/exercises (get all)");
  db.Exercise.find({})
    .then(dbExercises => {
      res.json(dbExercises);
    })
    .catch(err => {
      res.json(err);
    });
});

// retrieves all exercises in this workout (given array of exerice ids)
//   from the exercises collection
// router.get("/exercises/:exerciseIds", (req, res) => {
router.get("/exercises/inworkout", (req, res) => {
  console.log("In GET api/exercises/[exer ids]. exer ids:");
  console.log(req.params.exerciseIds);
  console.log("exerciseIds");
  console.log(exerciseIds);

  db.Exercise.find({ '_id' : { $in: req.params.exercises}})
    .then(dbExercises => {
      console.log("exercises found (dbExercises):");
      console.log(dbExercises);
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

// // retrieves a workout and all its exercises given the
// //  _id of the workout
// router.get("/workout/:id", (req, res) => {
//   db.Workout.findOne({
//     _id: req.params.id
//   })
//     .then(dbWorkout => {
//       res.json(dbWorkout);
//     })
//     .catch(err => {
//       res.json(err);
//     });
// });

// makes the workout with the given id current
router.put("/workout/:id", (req, res) => {
  console.log("Set this workout to the current workout.  ID: " + req.params.id);

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
  console.log("Workout ID: " + req.params.workoutId);
  console.log("Exercise ID: " + req.params.exerciseId);
  
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
router.get("/populated", (req, res) => {
  console.log("in POPULATED in api-routes");
  db.Workout.find({"current": true})
    // .populate("exercises")  
    .populate("exerciseIds")  
    .then(dbWorkout => {
      console.log("dbWorkout:");
      console.log(dbWorkout);
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

// Write new document to exercises when new exercise added
router.post("/exercise/:name/:unit/:reps", (req, res) => {
  console.log("In POST api/exercise/<name>/<unit>/<reps>");
  console.log("     Name: " + req.params.name);
  console.log("     Unit: " + req.params.unit);
  console.log("     Reps: " + req.params.reps);
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

function getTime() {
  let today = new Date();

  let date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

  let hours = parseInt(today.getHours());

  if (hours == 0) {
    hours = 12;
    ampm = "AM";
  } else if (hours == 12) {
    ampm = "PM";
  } else if (hours > 12) {
    hours = hours - 12;
    ampm = "PM";
  } else {
    ampm = "AM";
  };

  time = hours + ":" + today.getMinutes();
  return date + " " + time + " " + ampm;

} // end of getTime function

module.exports = router;

  // const body = {
  //   name: req.params.workout,
  //   current: true
  // };

  // db.Workout.create(body)
  //   .then(dbExercise => {
  //     res.json(dbExercise);
  //   })
  //   .catch(err => {
  //     res.json(err);
  //   });

