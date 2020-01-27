// Global variable for this page
let currentWO = ""; // object of current workout

function renderPage() {
  // get name of CURRENT workout from workouts collection
  $.get("api/populated", workout => {
    console.log("currentPopulated in workout.js; workout:");
    console.log(workout);
    if (workout.length == 0) {
      // This error message isn't on the console long enough to see,
      //  but may be helpful for debugging!
      console.log(
        "ERROR:  There should be a current workout, and there isn't."
      );
      // send back to the home page, since workout page assumes current workout
      window.location.href = "index.html";
    } else {
      // set global currentWO to the object for the current workout
      console.log(workout);
      // workout should only have one element, and currentWO is an obj (not array)
      currentWO = workout[0];
      console.log("the current workout is: (currentWO):");
      console.log(currentWO);
      console.log("Current workout name: " + currentWO.name);
      console.log("Current workout ID: " + currentWO._id);
      console.log("Current exercises: ");
      const currentExercises = currentWO.exercises;
      console.log(currentExercises);

      // put the workout name in the sub-header on the html page
      $("#workoutName").text(currentWO.name);

      // get exercise ids for all exercises in the workout
      // exerIndicesInWO is an array of the _id of each exercise in the workout
      let exerIndicesInWO = currentExercises.map(exer => exer._id);

      // clear out list of exercises in workout, and all exercises
      //  so we know we're building the lists from scratch
      $(".execInWOTableRow").remove(); // exercises in workout
      $(".execTableRow").remove(); // all available exercises

      console.log("exerIndicesInWO:  ");
      console.log(exerIndicesInWO);
      // get all exercises from db
      $.get("api/exercises", exercises => {
        let allExecRow = ""; // row element in section for all exercises available
        let execInWORow = ""; // row element in section for exercises in this workout only
        exercises.forEach(exercise => {
          // add exercise to section of ALL exercises available
          allExecRow = `<tr class="execTableRow">`;
          allExecRow += `<td>${exercise.description}</td>`;
          allExecRow += `<td>${exercise.unit}</td>`;
          allExecRow += `<td>${exercise.reps}</td>`;
          allExecRow += '<td><button class="btn btn-default addExerToWO" '; // start button tag
          allExecRow += `data-id="${exercise._id}" `; // add exercise id
          allExecRow += 'type="submit">Add to workout</button></td>'; // finish button tag
          allExecRow += "</tr>";
          $(".allExercises").append(allExecRow);

          // if this exercise is in the current workout, display it in that list, too,
          //   with the time/date done.
          console.log("First exercise in all exercises list.  It is: ");
          console.log(exercise);
          console.log("_id:" + exercise._id);

          let index;
          // find how many times this exercise was done in this workout,
          //   and where in workouts.exercises the timestamps can be found
          // let thisExerIndicies = exerIndicesInWO.indexOf(exercise._id);

          let thisExerIndicies = exerIndicesInWO.reduce(function(array, elt, index) {
            if (elt === exercise._id) array.push(index);
            return array;
          }, []);
          // ["Nano","Volvo","BMW","Nano","VW","Nano"].reduce(function(a, e, i) {
          //     if (e === 'Nano')
          //         a.push(i);
          //     return a;
          // }, []);

          console.log("indexes into WO.exercises for dup exercises done:");
          console.log(thisExerIndicies);
          console.log("Begin loop through these indexes (above)");
          for (let i = 0; i < thisExerIndicies.length; i++) {
            console.log("In i loop...  i: " + i);
            // i-th time this exercise was done in this workout,
            //  index gets timestamp from WO.exercises
            index = thisExerIndicies[i];
            console.log("index: " + index);
            // then display exercise & date/time in top section
            //  (exercises in the current workout), too

            // put each exercise on the html page
            console.log("Id for an exercise in the workout:");
            console.log(exerIndicesInWO[index]);
            console.log("exercise:");
            console.log(exercise);
            // find whenDone
            const whenDone = currentExercises[index].whenDone;

            console.log("whenDone: " + whenDone);
            // console.log(exercise.whenDone);
            // let whenDone = exercise.whenDone.toString();

            execInWORow = `<tr class="execInWOTableRow">`;
            execInWORow += `<td>${exercise.description}</td>`;
            execInWORow += `<td>${exercise.unit}</td>`;
            execInWORow += `<td>${exercise.reps}</td>`;
            execInWORow += `<td>${whenDone}</td>`;
            execInWORow += `<td>`;
            execInWORow += "</tr>";
            $(".addExercisesInWO").append(execInWORow);
          } // end of for each of this exercise in workout
          //     could be more than one of same thing
        }); // end of for each index
      }).catch(error => {
        console.log(error);
      }); // end of GET api/exercises
    } // end of else - there is a current workout
  }); // end of GET api/populated
} // end of renderPage function

function createExercise() {
  // get exercise information from html

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
  console.log("Unit & typeof");
  console.log(unit);
  console.log(typeof unit);

  if (unit === "") {
    unit = "1";
  }
  console.log(unit);
  if (reps === "") {
    reps = "1";
  }

  // clear the input field from the html page.
  $("#exercise").val("");
  $("#unit").val("");
  $("#reps").val("");

  // write new document to exercise collection
  console.log("About to call api route to add new exercise:");
  console.log("   exerciseName: " + exerciseName);
  console.log("   Unit: " + unit);
  console.log("   Reps: " + reps);
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
