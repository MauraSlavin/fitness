function renderPage() {
  // get name of current workout from workouts collection
  $.get("api/populated", workouts => {
    console.log("currentPopulated in workout.js; workout:");
    console.log(workouts);
    if (workouts === null) {
      console.log(
        "ERROR:  There should be a current workout, and there isn't."
      );
    } else {
      const currentWO = workouts.find(workout => workout.current === true);

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
        tableElt = '<tr class="execTableRow">';
        tableElt += `<td>${exercise.description}</td>`;
        tableElt += `<td>${exercise.unit}</td>`;
        tableElt += `<td>${exercise.reps}</td>`;
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

  // listen for (and handle) when Go! button is clicked to create a new workout
  $("#createNewExercise").on("click", () => createExercise());
});
