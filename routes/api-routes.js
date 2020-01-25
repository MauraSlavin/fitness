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
  console.log("api-routes: /workouts/current");
  db.Workout.find({ current: true })
    .then(dbWorkout => {
      console.log("in api-routes, /workouts/current, dbWorkout:");
      console.log(dbWorkout);
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
  db.Workout.find({
    _id: req.params.id
  })
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
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
      console.log(result);
    })
    .catch(error => {
      console.log(error);
    });
});

// // Populated is a mongoose term, to POPULATE with RELATED data
// router.get("/populated", (req, res) => {
//   db.Workout.find({})
//     .populate("exercises")  // PLURAL
//     .then(dbWorkout => {
//       res.json(dbWorkout);
//     })
//     .catch(err => {
//       res.json(err);
//     });
// });

module.exports = router;
