var currentUser;
var UID; // UID of the mood
var RESPONSE;

firebase.auth().onAuthStateChanged(user => {
    // A function that takes the current user who is login
    if (user) {
        currentUser = db.collection("user").doc(user.uid);   //global
        // the following functions are always called when someone is logged in
        getID() // Takes the document id that is being edited of the url
        populate_page() // Populate the page
    } else {
        // No user is signed in.
        console.log("No user is signed in");
        window.location.href = "login.html";
    }
});

// Populate the page with user's emotion, date it was written on, their responnse and the question that day
function populate_page() {
    currentUser.collection("dailymood").doc(UID).get() // visits the specific document that is being edited
        .then(mood => {
            var rating = mood.data().emotion; // takes the emotion value
            var day = mood.data().date; // takes the date value
            var quest = mood.data().question; // takes the question value
            var answer = mood.data().response; // takes the response value
            document.getElementById("emotion").innerHTML = rating; // populate the emotion id
            document.getElementById("date").innerHTML = day;  // populate the date id
            document.getElementById("question").innerHTML = quest; // populate the question id
            document.getElementById("input-response").value = answer; // populate the input-response value
            RESPONSE = answer // gets user's response where it will be use to be compared later
        })
}

// Updates the respponse field if user added more information during the editing
function overwrite_response() {
    currentResponse = document.getElementById("input-response").value // gets the value of the text-area tag
    if (currentResponse === RESPONSE) { // A condition that user did not change anything
        alert("There are no changes") // it will alert the user
    } else { // If user indeed edited something
        currentUser.collection("dailymood").doc(UID) // the function will visit the document using the id from the url
            .update({
                response: document.getElementById("input-response").value, // updates it with the new input
                
            })
            go_home()
    }
}

// Gets the ID of the url
function getID() {
    let params = new URL(window.location.href) // takes the url
    UID = params.searchParams.get("id") // takes the id value from the url
}

// Used when user clicked on the home button
function go_home(){
    alert("Going back to Mood Tracker") // it will alert the user what is going on
    window.location.href = "index.html" // Goes back to the moodtracker homepage
}

// Listens if user clicked the update_button button
document.getElementById("update_button").addEventListener("click", overwrite_response)

// Listens if the user clicked back_button button
document.getElementById("back_button").addEventListener("click", go_home)
