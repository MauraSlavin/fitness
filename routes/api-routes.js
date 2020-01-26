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
  db.Exercise.find({})
    .then(dbExercise => {
      res.json(dbExercise);
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
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

// retrieves a workout and all its exercises given the
//  _id of the workout
router.get("/workout/:id", (req, res) => {
  db.Workout.findOne({
    _id: req.params.id
  })
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

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
    { $push: { exercises: req.params.exerciseId } }
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

// Populate is a mongoose term, to POPULATE with RELATED data
router.get("/populated", (req, res) => {
  db.Workout.find({})
    .populate("exercises")  
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

