// Global variable for this page
let currentWO = ""; // object of current workout

function renderPage() {
  // get name of CURRENT workout from workouts collection
  $.get("api/workout/populated", workout => {
    if (workout.length == 0) {
      handleNoCurrentWO();
    } else {
      // set global currentWO to the object for the current workout
      // workout should only have one element, and currentWO is an obj (not array)
      currentWO = workout[0];
      const currentExercises = currentWO.exercises;

      // put the workout name in the sub-header on the html page
      $("#workoutName").text(currentWO.name);

      // get exercise ids for all exercises in the workout
      // exerIndicesInWO is an array of the _id of each exercise in the workout
      let exerIndicesInWO = currentExercises.map(exer => exer._id);

      putExercisesOnHtml({ currentExercises, exerIndicesInWO });
    } // end of else - there is a current workout
  }); // end of GET api/populated
} // end of renderPage function

function handleNoCurrentWO() {
  // This error message isn't on the console long enough to see,
  //  but may be helpful for debugging!
  console.log("ERROR:  There should be a current workout, and there isn't.");
  // send back to the home page, since workout page assumes current workout
  window.location.href = "./index.html";
} // end of handleNoCurrentWO function

function putExercisesOnHtml({ currentExercises, exerIndicesInWO }) {
  // clear out list of exercises in workout, and all exercises
  //  so we know we're building the lists from scratch
  $(".execInWOTableRow").remove(); // exercises in workout
  $(".execTableRow").remove(); // all available exercises

  // get all exercises from db
  $.get("api/exercises", exercises => {
    let execInWORow = ""; // row element in section for exercises in this workout only
    exercises.forEach(exercise => {
      // put every exercise on the html page to be able to add an exercise
      //   in the middle section
      appendExercises(exercise);

      // put exercises in the workout on the html page, too
      //   on the top section (for exercises in workout)
      appendWOExercises({ exercise, exerIndicesInWO, currentExercises });
      // if this exercise is in the current workout, display it in that list, too,
      //   with the time/date done.
    }); // end of for each index
  }).catch(error => {
    console.log(error);
  }); // end of GET api/exercises
} // end of putExercisesOnHtml function

function appendExercises(exercise) {
  let allExecRow;
  // add exercise to section of ALL exercises available
  allExecRow = `<tr class="execTableRow">`;
  allExecRow += `<td>${exercise.description}</td>`;
  allExecRow += `<td>${exercise.unit}</td>`;
  allExecRow += `<td>${exercise.reps}</td>`;
  allExecRow += '<td><button class="btn btn-default addExerToWO" '; // start button tag
  allExecRow += `data-id="${exercise._id}" `; // add exercise id
  allExecRow += 'type="submit">Add</button></td>'; // finish button tag
  allExecRow += "</tr>";
  $(".allExercises").append(allExecRow);
} // end of appendExercises function

function appendWOExercises({ exercise, exerIndicesInWO, currentExercises }) {
  // find how many times this exercise was done in this workout,
  //   and where in workouts.exercises the timestamps can be found
  let thisExerIndicies = exerIndicesInWO.reduce(function(array, elt, index) {
    if (elt === exercise._id) array.push(index);
    return array;
  }, []);

  for (let i = 0; i < thisExerIndicies.length; i++) {
    let index;
    // i-th time this exercise was done in this workout,
    //  index gets timestamp from WO.exercises
    index = thisExerIndicies[i];

    // then display exercise & date/time in top section
    //  (exercises in the current workout), too

    // put each exercise on the html page

    // find whenDone
    const whenDone = currentExercises[index].whenDone;

    execInWORow = `<tr class="execInWOTableRow">`;
    execInWORow += `<td>${exercise.description}</td>`;
    execInWORow += `<td>${exercise.unit}</td>`;
    execInWORow += `<td>${exercise.reps}</td>`;
    execInWORow += `<td>${whenDone}</td>`;
    execInWORow += `<td>`;
    execInWORow += "</tr>";
    // prepend so latest is on top
    $(".addExercisesInWO").prepend(execInWORow);
  } // end of for each of this exercise in workout
  //     could be more than one of same thing
} // end of appendWOExercises function

function createExercise() {
  // get exercise information from html
  console.log("In 'createExercise' -- button clicked.");
  let exerciseName = $("#exercise")
    .val()
    .trim();
  let unit = $("#unit")
    .val()
    .trim();
  let reps = $("#reps")
    .val()
    .trim();

  if (exerciseName === "") {
    $("#exercise").val("Exercise name required");
    return;
  }

  if (unit === "") {
    unit = "1";
  }

  if (reps === "") {
    reps = "1";
  }

  // clear the input field from the html page.
  $("#exercise").val("");
  $("#unit").val("");
  $("#reps").val("");

  // write new document to exercise collection
  $.ajax({
    method: "POST",
    url: `api/exercise/${exerciseName}/${unit}/${reps}`
  })
    .then(result => {
      // re-display page to get new exercise in list of exercises to choose from
      renderPage();
    })
    .catch(error => {
      console.log(error);
    });
} // end of function createExercise

function addExerciseToWorkout(id) {
  // put the new exercise to the exercises in the workout document
  // pass current workout id and id of exercise to be added to server api
  // currentWO is a global object of the current workout

  $.ajax({
    method: "PUT",
    url: `api/workout/${currentWO._id}/${id}`
  })
    .then(result => {
      // re-display page to get new exercise in list of exercises to choose from
      renderPage();
    })
    .catch(error => {
      console.log(error);
    });
} // end of addExerciseToWorkout function

$(document).ready(() => {
  // get the current workout (also displays name on page)
  renderPage();

  $(".allExercises").on("click", ".addExerToWO", function(event) {
    // get info from the html: _id of chosen exercise
    const exerciseId = $(this).data("id");

    addExerciseToWorkout(exerciseId);
  }); // of allExercises on click, addExerToWO

  // listen for (and handle) when button is clicked to create a new exercise
  $(".createNewExercise").on("click", () => {
    console.log("About to call 'createExercise' -- button clicked.");
    createExercise();
  });
});
