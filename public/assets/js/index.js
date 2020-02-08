// put current workout name and list of workouts on home page
function renderHomePage() {
  // If offline, add the offline message and disable the createNewWorkout button

  if (!navigator.onLine) {
    renderOffline();
  };

  // get name of current workout from workouts collection
  $.get("api/workouts/current", workout => {
    // href is enabled if there is a current workout.
    let hrefEnabled =
      '<a href="./workout.html" class="btn btn-warning goToCurrent"></a>';
    // the element will be a disabled button if there is no current workout.
    let btnDisabled =
      '<button class="btn btn-warning goToCurrent" disabled>No current workout.</button>';

    // if there is a current workout, put the name on the html page
    //   and enable the button (href) to go to the workout page with that workout
    // otherwise, it's a disabled button

    // Don't need the goToCurrent class unless there is a current workout
    $(".goToCurrent").remove();
    if (workout !== null) {
      // if there is a workout, use the enabled href & goToCurrent class
      $(".btnHref").append(hrefEnabled);
      $(".goToCurrent").html(workout.name);
    } else {
      // if no current workout, disable the button
      $(".btnHref").append(btnDisabled);
    }
  });

  // Load all the workout names on the page
  $.get("api/workouts", workouts => {
    loadWorkoutNames(workouts);
  }); // end of get api/workouts
} // end of renderHomePage function

function loadWorkoutNames(workouts) {
  
  let beginButton = `<br><button class="btn btn-warning btnSpace" data-id=`;
  let workoutButton = "";

  workouts.forEach(workout => {
    // do NOT include this workout if it is the current one
    if (typeof workout.current === "undefined" || !workout.current) {
      workoutButton = beginButton; // they all start the same
      workoutButton += `"${workout._id}" `; // add data-id with the _id of the workout
      // disable button if offline
      if (!navigator.onLine) {
        workoutButton += 'disabled="disabled" ';
      };
      workoutButton += `type="button">${workout.name}</button>`; // finish button elt, incl name of workout on button
      workoutButton += '<br>'; // next button on a new line
      $(".addWorkoutList").append(workoutButton)  // add the button to the html

    } // end of if NOT the current workout
  }); // end of workouts.forEach
} // end of loadWorkoutNames function

// Puts message on window if offline, and disables buttons that won't work.
// Takes disable message off, and enables buttons when back online.
function updateStatus() {
  if (navigator.onLine) {
    // Online handling...
    renderOnline();
  } else {
    // Offline handling...
    renderOffline();
  }
} // of updateStatus function

function renderOnline() {
  // Online handling...

  // remove offline message, if it was there.
  $(".offline").remove();

  // enable button to add a workout ("Go!" button)
  $(".createNewWorkout").attr("disabled", false);

  // enable buttons that go to different workouts
  $(".btnSpace").attr("disabled", false);
} // of function renderOnline

function renderOffline() {
  // Offline handling...

  // Put offline message on window.
  const offlineMsg =
    '<p class="offline">You are now offline.  You can see the list of workouts, and the current workout, but you cannot add or change workouts or exercises.  Thank you for your patience.</p>';
  $("h3").append(offlineMsg);

  // disable button to add a workout ("Go!" button)
  $(".createNewWorkout").attr("disabled", true);

  // disable buttons that go to different workouts
  $(".btnSpace").attr("disabled", true);
} // of function renderOffline

function createWorkout() {
  // get workout name from html
  const workoutName = $("#workout")
    .val()
    .trim();
  // clear the input field from the html page.
  $("#workout").val("");

  // take current property off any document (row) that it's now on
  $.ajax({
    method: "PUT",
    url: `/api/workouts/current`
  })
    .then(result => {
      console.log(result);
    })
    .then(result => {
      $.ajax({
        // write new document to collection w/"current" set to true
        method: "POST",
        url: `api/workout/${workoutName}`
      })
        .then(result => {
          // In case the page is cached (and not re-loaded) when user returns...
          //    reload it, so it will have the new current page in the first section,
          //    and the correct list of other workouts in the bottom section.
          renderHomePage();
        })
        .then(result => {
          // send user to workout html page
          window.location.href = "./workout.html";
        })
        .catch(error => {
          console.log(error);
        });
    });
} // end of function createWorkout

function goToOldWorkout(id) {
  // Make workout chosen the current workout
  // first remove old current workout,
  //    then make this the current workout
  //    then go to workout page for this workout

  // take current property off any document (row) that it's now on
  $.ajax({
    method: "PUT",
    url: `/api/workouts/current`
  }).then(result => {
    // update document to make this workout the current one
    $.ajax({
      method: "PUT",
      url: `api/workout/${id}`
    })
      .then(result => {
        // send user to workout html page
        window.location.href = "./workout.html";
      })
      .catch(error => {
        console.log(error);
      });
  });
} // end of function goToOldWorkout

// Wait until page is loaded
$(document).ready(() => {
  renderHomePage();

  // window was loading part-way down.  Make it load at the top.
  window.scrollTo(0,0);

  // Put notice on website and enable/disable buttons when online status changes
  window.addEventListener("online", updateStatus);
  window.addEventListener("offline", updateStatus);

  // Clicking on current workout is handled in the html.

  // listen for (and handle) when Go! button is clicked to create a new workout
  $(".createNewWorkout").on("click", () => createWorkout());

  // listen for (& handle) when another workout is clicked on
  $(".addWorkoutList").on("click", ".btnSpace", function(event) {
    const workoutId = $(this).data("id");
    goToOldWorkout(workoutId);
  });
}); // end of document ready
