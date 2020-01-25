function getCurrentWO() {
  // get name of current workout from workouts collection
  $.get("api/workouts/current", workout => {

    if (workout === null) {
      console.log(
        "ERROR:  There should be a current workout, and there isn't."
      );
    } else {
      $("#workoutName").text(workout.name);

      return workout;
    }
  });
} // end of getCurrentWO function

$(document).ready(() => {
  console.log("In workout.js, document ready");
  // get the current workout (also displays name on page)
  let workout = getCurrentWO();
});
