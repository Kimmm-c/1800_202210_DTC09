var moodRating; // Global variable for moodRating
var currentUser; // Global variable for CurrentUser


firebase.auth().onAuthStateChanged(user => {
    // A function that takes the current user who is login
    if (user) {
        currentUser = db.collection("user").doc(user.uid);   //global
        console.log(currentUser);

        // the following functions are always called when someone is logged in
        currentdate()
        checkifDone()
    } else {
        // No user is signed in.
        console.log("No user is signed in");
        window.location.href = "login.html";
    }
});

function getMood(moodResponse) {
    // function that takes the moodrating users submitted

    let today = document.getElementById("today-date").innerHTML // The line that takes the current date
    currentUser.collection("dailymood").add({      // Creates a subcollection called "daily mood" in the currentUser document
        rating: moodResponse,   // Creates field for the rating they submitted
        date: today     // Creates a field for the current date
    }).then(function () {
        console.log("Added subcollection")
    })
        .catch((error) => {
            console.log("Unable to add daily rating" + error)
        })
    
        checkifDone()
}

function currentdate() {
    // Function that updates the span (today-date) which contains date into real-time date
    var today = new Date() // takes a new date
    var dd = String(today.getDate()).padStart(2, '0'); // takes the current day
    var mm = String(today.getMonth() + 1).padStart(2, '0'); // takes the current month
    var yyyy = today.getFullYear(); // takes the current year

    today = mm + '/' + dd + '/' + yyyy;
    $("#today-date").html(today) // shows it to the website
}


$(".response_button").click(function(){
    // A function that keeps track which button user
    // clicked
    moodRating = $(this).val();
})

function checkifDone (){
    // Function that disables the rating card
    // if User has done it for today
    today = document.getElementById("today-date").innerHTML // Takes the current date
    currentUser.collection("dailymood").get() // Visits the dailymood subcollection of the user
    .then(allRating => {
        allRating.forEach(doc => { // Visits each document in the subcollection
            day = doc.data().date  // And takes the date field of the document
            
            if (today === day) {  // If day is the same as the today, the card will be disabled and instead show a text
                $("#moodCard").empty()
                moodDisabler = $("#moodCard").html(`<h3> Thank you for sharing, see you tomorrow! </h3`)
            }
        })
    })
}