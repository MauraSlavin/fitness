// put current workout name and list of workouts on home page
function renderHomePage() {
  console.log("In renderHomePage");

  // Get _id of current workout from currnets collection
  $.get("api/workouts/current", current => {
    console.log("current:");
    console.log(current);
    console.log("workout: " + current[0].workout);
    // get name of current workout from workouts collection
    $.get('api/workouts/current', workout => {
      console.log(workout);
      let hrefEnabled =
        '<a href="workout.html" class="btn btn-default goToCurrent"></a>';
      let btnDisabled =
        '<button class="btn btn-default goToCurrent" disabled>No current workout.</button>';
      // if there is one, put the name on the html page
      //   and enable the button to go to it
      console.log("Index.js, workout:");
      console.log(workout);
      console.log(workout.length);
      $(".goToCurrent").remove();
      if (workout.length > 0) {
        $("#btnHref").append(hrefEnabled);
        $(".goToCurrent").html(workout[0].name);
        // $(".goToCurrent").attr("disabled", false);
        // $(".goToCurrent").attr("href","workout.html");
        // <p>Continue with current workout: <a href="workout.html" class="btn btn-default goToCurrent">aerobic</a></p>
        // if there is NOT one, put a message on the html page
        //   and disable the button to go to it
      } else {
        $("#btnHref").append(btnDisabled);
      }
    });
  });

  // Load all the workout names on the page
  $.get("api/workouts", workouts => {
    let beginButton = '<br><button class="btn btn-default btnSpace" data-id=';
    let workoutButton = "";
    console.log("In index.js, api/workouts");
    console.log("workouts:  ");
    console.log(workouts);
    workouts.forEach(workout => {
      workoutButton = beginButton; // they all start the same
      workoutButton += `"${workout._id}" `; // add data-id with the _id of the workout
      workoutButton += `type="button">${workout.name}</button>`; // finish button elt, incl name of workout on button
      //   workoutButton += '<br>'; // next button on a new line
      $(".addWorkoutList").append(workoutButton); // add the button to the html
    });
  });
}

// Wait until page is loaded
$(document).ready(() => {
  renderHomePage();
});
