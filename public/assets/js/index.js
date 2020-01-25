// put current workout name and list of workouts on home page
function renderHomePage() {
  console.log("In renderHomePage");

  // get name of current workout from workouts collection
  $.get("api/workouts/current", workout => {
    
    let hrefEnabled =
      '<a href="workout.html" class="btn btn-default goToCurrent"></a>';
    let btnDisabled =
      '<button class="btn btn-default goToCurrent" disabled>No current workout.</button>';
    // if there is one, put the name on the html page
    //   and enable the button to go to it

    $(".goToCurrent").remove();
    if (workout.length > 0) {
      $("#btnHref").append(hrefEnabled);
      $(".goToCurrent").html(workout[0].name);

    } else {
      $("#btnHref").append(btnDisabled);
    }
  });

  // Load all the workout names on the page
  $.get("api/workouts", workouts => {
    let beginButton = '<br><button class="btn btn-default btnSpace" data-id=';
    let workoutButton = "";

    workouts.forEach(workout => {

      // do NOT include this workout if it is the current one
      if (typeof workout.current === "undefined" || !workout.current) {
        workoutButton = beginButton; // they all start the same
        workoutButton += `"${workout._id}" `; // add data-id with the _id of the workout
        workoutButton += `type="button">${workout.name}</button>`; // finish button elt, incl name of workout on button
        //   workoutButton += '<br>'; // next button on a new line
        $(".addWorkoutList").append(workoutButton); // add the button to the html
      }; // end of if NOT the current workout
    });  // end of workouts.forEach
  }); // end of get api/workouts

} // end of renderHomePage function

function createWorkout() {
  // get workout name from html

  const workoutName = $("#workout")
    .val()
    .trim();
  // clear the input field from the html page.
  $("#workout").val("");
  console.log("workoutName: " + workoutName);
  // take current property off any document (row) that it's now on
  // use put & update with $unset ??
  $.ajax({
    method: "PUT",
    url: `/api/workouts/current`
  }).then(result => {
    console.log(result);
  });

  // write new document to collection for new workout
  //  current will be set to true
  $.ajax({
    method: "POST",
    url: `api/workout/${workoutName}`
  })
    .then(result => {
      console.log("New workout written.");
      console.log(result);
      // send user to workout html page
      window.location.href = "workout.html";
    })
    .catch(error => {
      console.log(error);
    });
}

// Wait until page is loaded
$(document).ready(() => {
  renderHomePage();

  $("#createNewWorkout").on("click", () => createWorkout());
});
