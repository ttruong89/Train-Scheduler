$(document).ready(function() {
 // 1.  Initialize Firebase
 var config = {
    apiKey: "AIzaSyDLSXQMIdgDD5uloe-_t2RdqQ8qJ1kIT-A",
    authDomain: "tony-2d40b.firebaseapp.com",
    databaseURL: "https://tony-2d40b.firebaseio.com",
    storageBucket: "tony-2d40b.appspot.com",
    messagingSenderId: "161999354755"
 };

 firebase.initializeApp(config);

 var database = firebase.database();

 // 2.  Click function for adding trains to Current Train Schedule.
 $("#add-train-btn").on("click", function() {
 	var trainName = $("#train-name-input").val().trim();
 	var destination = $("#destination-input").val().trim();
 	var firstTrain = $("#first-train-time-input").val().trim();
 	var frequency = $("#frequency-input").val().trim();

 // Creates local temporary object for holding train data.
 var newTrain = {
 	train: trainName,
 	destination: destination,
 	firstTrain: firstTrain,
 	frequency: frequency
 };

 	// Uploads train data to database.
 	database.ref().push(newTrain);

 	// Logs everything to the console.
 	// console.log(newTrain.train);
 	// console.log(newTrain.destination);
 	// console.log(newTrain.firstTrain);
 	// console.log(newTrain.frequency); // Works.

 	// Clears out textboxes.
 	$(".input").val("");

 	// Prevent page from refreshing.
 	return false;
 }); // Close button click function for adding trains.

 // 3.  Create Firebase events for adding trains to the database and a row in the html when user adds an entry.
 database.ref().on("child_added", function(childSnapshot, prevChildKey) {

 	console.log(childSnapshot.val());

 	// Store everything into a variable.
 	var tTrainName = childSnapshot.val().train;
 	var tDestination = childSnapshot.val().destination;
 	var tFirstTrain = childSnapshot.val().firstTrain;
 	var tFrequency = childSnapshot.val().frequency;

  	// Train Info.
  	// console.log("Train Name: " + trainName);
  	// console.log("Destination: " + destination);
  	// console.log("First Train: " + firstTrain);
  	// console.log("Frequency: " + frequency + " minutes"); // Works

  	// Train time pushed back 1 year to make sure it comes before current time.
  	var firstTimeConverted = moment(tFirstTrain, "HH:mm").subtract(1, "years");
  	// console.log(firstTimeConverted); // Works

  	// Current time.
  	var currentTime = moment();
  	// console.log("Current Time: " + moment(currentTime).format("HH:mm")); // Works

  	// Difference between firstTrain and currentTime in minutes.
  	var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  	// console.log("Difference in time: " + diffTime); // Works

  	// Time apart (remainder).
  	var tRemainder = diffTime % tFrequency;
  	// console.log(tRemainder); // Works 

  	// Minutes until next train arrives.
  	var tMinutesTillTrain = tFrequency - tRemainder;
  	// console.log("Minutes till train: " + tMinutesTillTrain); // Works

	// Next train from current time.  	
  	var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  	var nextTrainPretty = moment(nextTrain).format("hh:mm A"); // Format the next train time to show nicely.

  	// Appending info to HTML
  	$("#currentTrainSchedule > tbody").append("<tr><td>" + tTrainName + "</td><td>" + tDestination + "</td><td>" + tFrequency + " minutes" + "</td><td>" + nextTrainPretty + "</td><td>" + tMinutesTillTrain + " minutes" + "</td></tr>");

 }, function(errorObject){
 		console.log("Errors handled: " + errorObject.code)
 }); // Closes firebase event function.

}); // Close document.ready function.