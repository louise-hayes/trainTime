var config = {
    apiKey: "AIzaSyANYTuxU9CgXv4sQG13ynRPBZYz3mrTHVI",
    authDomain: "traintime-cce14.firebaseapp.com",
    databaseURL: "https://traintime-cce14.firebaseio.com",
    projectId: "traintime-cce14",
    storageBucket: "traintime-cce14.appspot.com",
    messagingSenderId: "590340808573"
};


firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

// Initial Values
var name = "";
var destination = "";
var startTime = "";
var frequency = 0;


$(document).ready(function () {
    // form submit handler
    $('body').on('click', '#add-Train', function (event) {
        event.preventDefault();
        name = $("#train-name").val().trim();
        destination = $("#destination").val().trim();
        startTime = $("#first-train-time").val().trim();
        frequency = parseInt($("#train-frequency").val().trim());
        // Code for handling the push
        database.ref().push({
            name: name,
            destination: destination,
            startTime: startTime,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
    });
});


// Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
database.ref().on("child_added", function (childSnapshot) {

    var name = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var startTime = (childSnapshot.val().startTime);
    console.log("startTime= " + startTime);
    var frequency = (childSnapshot.val().frequency);

    // set dateSTart to a date in function toDate
    var dateStart = toDate(startTime);
    console.log("dateStart= " + dateStart);
    // this dateStart is now in right format to be compared with moment.
    var minutesSinceStart = moment().diff(dateStart, "minutes");
    // we now have the mins since the time the train started and now
    console.log("minutesSinceStart= " + minutesSinceStart + "frequency= " + frequency);
    // get the remainder of 'minutesSinceStart' divided by 'frequency' (if diff = 0 
    // then next train is due now / else the next train is due in 'diff' minutes
   var nextTrainTime="";
   var nextTrain=0;
    if (minutesSinceStart >= 0) {
        var remainder = minutesSinceStart % frequency;
        console.log("remainder = " + remainder);
        // if remainder = 0, (train due now) then nextTrainTime=0 , else nextTrainTime=(frequency-remainder)
        nextTrain = remainder ? frequency - remainder : 0;
        console.log("nextTrain= " + nextTrain);
        // creata a new date of now
        nextTrainTime = new Date();
        // add the remaining mins (nextTrain) to nextTrainTime(time now) in a function addMinutes
        nextTrainTime = addMinutes(nextTrainTime, nextTrain);
        // set the seconds to 0 so that when train due now, it works!
        nextTrainTime.setSeconds(0);

    }
    // start time in future land
    else if (minutesSinceStart < 0) {
        console.log ("less than zero");
        nextTrainTime = dateStart;
        nextTrain = minutesSinceStart;

    } ;

    console.log("nextTrainTime= " + nextTrainTime);
    // var dueTime=checkDate(dateStart);
    // full list of items to the well
    var varDiv = $('<tr>');
    var td1 = $('<td>' + name + '</td>');
    var td2 = $('<td>' + destination + '</td>');
    var td3 = $('<td>' + frequency + '</td>');
    var td4 = $('<td>' + nextTrainTime.getHours().toString() + ':' + (nextTrainTime.getMinutes() < 10 ? '0' : '') + nextTrainTime.getMinutes() + '</td>');
    var td5 = $('<td>' + nextTrain + '</td>');

    varDiv.append(td1);
    varDiv.append(td2);
    varDiv.append(td3);
    varDiv.append(td4);
    varDiv.append(td5);

    $("#tableBody").append(varDiv);

    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

// I believe this function changes the starttime to a date i.e. it takes the startTime from user input and returns a date object 
// set to today with a time of user input startTime ...thank you stackoverflow!!!
function toDate(dStr) {
    var now = new Date();
    console.log("now= " + now);
    //    if start time is in future set 
    if (dStr > now) {

    }
    now.setHours(dStr.substr(0, dStr.indexOf(":")));
    now.setMinutes(dStr.substr(dStr.indexOf(":") + 1));
    now.setSeconds(0);
    return now;
}

// function checkDate(dStr) {
//     var now = new Date();
//     console.log("now= " + now);
// //    if start time is in future set due time to start time
//     if (dStr > now){
//         dueTime = dStr;
//         return dueTime;
//     };

//     };

// this function I believe takes the date/time as of now and 
// adds the 'minutes' remaining until next train is due 
// and returns the 'date' i.e. nextarrivaltime in a readable format
// ...thanks stack overflow

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}