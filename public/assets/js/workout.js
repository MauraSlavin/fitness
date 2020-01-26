// Global variables for this page
let currentWO = ""; // object of current workout

function renderPage() {
  // get name of current workout from workouts collection
  $.get("api/populated", workouts => {
    console.log("currentPopulated in workout.js; workouts:");
    console.log(workouts);
    if (workouts === null) {
      console.log(
        "ERROR:  There should be a current workout, and there isn't."
      );
    } else {
      // set global currentWO to the object for the current workout
      currentWO = workouts.find(workout => workout.current === true);
      console.log("Current workout name: " + currentWO.name);
      console.log("Current workout ID: " + currentWO._id);

      $("#workoutName").text(currentWO.name);
      //   console.log("workout:");
      //   console.log(workout);
      // display exercises in workout
      // exerciseIds is an array of the _id of each exercise in the workout
      // let exerciseIds = workout.exercises;
      // $.get(`api/exercises/${exerciseIds}`, exercises => {
      //     console.log(exercises);
      // }).catch((error) => {
      //     console.log(error);
      // });
    } // end of else - there is a current workout

    // display all exercises
    $.get("api/exercises", exercises => {
      //   console.log("In workout.js; renderPage; GET api/exercises; exercises:");
      //   console.log(exercises);
      // clear out rows so exercises aren't duplicated
      $(".execTableRow").remove();
      let tableElt = "";
      exercises.forEach(exercise => {
        tableElt = `<tr class="execTableRow">`;
        tableElt += `<td>${exercise.description}</td>`;
        tableElt += `<td>${exercise.unit}</td>`;
        tableElt += `<td>${exercise.reps}</td>`;
        tableElt += '<td><button class="btn btn-default addExerToWO" '; // start button tag
        tableElt += `data-id="${exercise._id}" `; // add exercise id
        tableElt += 'type="submit">Add to workout</button></td>'; // finish button tag
        tableElt += "</tr>";
        $(".allExercises").append(tableElt);
      });
    }).catch(error => {
      console.log(error);
    }); // end of GET api/exercises
  }); // end of GET api/populated
} // end of renderPage function

function createExercise() {
  // get exercise information from html

  const exerciseName = $("#exercise")
    .val()
    .trim();
  const unit = $("#unit")
    .val()
    .trim();
  const reps = $("#reps")
    .val()
    .trim();

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

$(document).ready(() => {
  console.log("In workout.js, document ready");
  // get the current workout (also displays name on page)
  renderPage();

  $(".allExercises").on("click", ".addExerToWO", function(event) {
    // get info from the html: _id of chosen exercise
    const exerciseId = $(this).data("id");
    console.log("Clicked on exercise to add.  ID:  " + exerciseId);

    // put the new exercise to the exercises in the workout document
    // pass current workout id and id of exercise to be added to server api
    console.log("Workout ID: " + currentWO._id);
    console.log("Exercise ID: " + exerciseId);
    $.ajax({
      method: "PUT",
      url: `api/workout/${currentWO._id}/${exerciseId}`
    })
      .then(result => {
        console.log("In 'then' of PUT api/workout/WO id/exer id. Result:");
        console.log(result);
        // re-display page to get new exercise in list of exercises to choose from
        renderPage();
      })
      .catch(error => {
        console.log(error);
      });
  }); // of allExercises on click, addExerToWO

  // listen for (and handle) when Go! button is clicked to create a new workout
  $("#createNewExercise").on("click", () => createExercise());
});
