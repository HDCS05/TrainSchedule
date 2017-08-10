$(function () {

   // Initialize Firebase
   var config = {
      apiKey: "AIzaSyDf8TUZZQpo9o9pHscnnSvuG00Uxbf54Wk",
      authDomain: "tschedulehomework.firebaseapp.com",
      databaseURL: "https://tschedulehomework.firebaseio.com",
      projectId: "tschedulehomework",
      storageBucket: "tschedulehomework.appspot.com",
      messagingSenderId: "532776913098"
   };

   firebase.initializeApp(config);

   var dataref = firebase.database();

   //Initial Values
   var vtname = "";
   var vdest = "";
   var vfirsttime = "";
   var vfrequency = 0;

   // Capture Button Click
   $("#dsubmit").on("click", function(event) {

      event.preventDefault();

      // Code in the logic for storing and retrieving the most recent user.
      // Don't forget to provide initial data to your Firebase database.
      vtname = $("#ditname").val().trim();
      vdest = $("#didest").val().trim();
      vfirsttime = $("#diftrain").val().trim();
      vfrequency = $("#difrequency").val().trim();

      // Code for the push
      dataref.ref().push({
         trainName: vtname,
         destination: vdest,
         firstTrain: vfirsttime,
         frequency: vfrequency,
         dateAdded: firebase.database.ServerValue.TIMESTAMP
      });

      $("#ditname").val("");
      $("#didest").val("");
      $("#diftrain").val("");
      $("#difrequency").val("");

   });

   // Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
   dataref.ref().on("child_added", function(childSnapshot) {

      var vtablerow = $("<tr />");
      var vtdata = "";
      var vnext = 0;
      var vaway = 0;

      vtdata = $("<td />").text(childSnapshot.val().trainName);
      vtablerow.append(vtdata);
      vtdata = $("<td />").text(childSnapshot.val().destination);
      vtablerow.append(vtdata);
      vtdata = $("<td />").text(childSnapshot.val().frequency);
      vtablerow.append(vtdata);
      var vftime = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");
      var vdifftime = moment().diff(moment(vftime), "minutes");
      var vtremainder = vdifftime % childSnapshot.val().frequency;
      vaway = childSnapshot.val().frequency - vtremainder;
      vnext = moment().add(vaway, "minutes");
      vtdata = $("<td />").text(moment(vnext).format("hh:mm"));
      vtablerow.append(vtdata);
      vtdata = $("<td />").text(vaway);
      vtablerow.append(vtdata);

      // full list of items to the table list
      $("table.tablelist").append(vtablerow);

   // Handle the errors
   }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
   });

});