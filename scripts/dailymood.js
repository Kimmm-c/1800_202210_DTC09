var TODAY;
var currentUser
var UID; // UID of the mood

firebase.auth().onAuthStateChanged(user => {
    // A function that takes the current user who is login
    if (user) {
        currentUser = db.collection("user").doc(user.uid);   //global

        // the following functions are always called when someone is logged in
        populate_mood() //populate the history container
        NewDay() // Checks weather user has tracked their mood already today
        currentdate() // Takes the current date 
    } else {
        // No user is signed in.
        console.log("No user is signed in");
        window.location.href = "login.html";
    }
});

// Populates the cards in the history container
function populate_mood() {
    let moodTemplate = document.getElementById("moodHistoryTemplate") // Takes the template
    currentUser.collection("dailymood") // Goes inside the dailymoo collection of the user
        .get()
        .then(mood => {
            var i = 1;
            mood.forEach(doc => {
                var rating = doc.data().emotion; // takes the emotion value
                var day = doc.data().date; // Takes the date value
                var quest = doc.data().question; // Takes the question value
                var answer = doc.data().response; // Takes the response value
                var id = doc.id; // Takes the uid of the document
                let newcard = moodTemplate.content.cloneNode(true);
                //update rating, day, question, answer 
                if (TODAY === day) { // condition that if the doc is today
                    return; // it will simply ignore the document
                }
                if (TODAY !== day) { // If the doc is not current day, then it will use its fields to populate the template
                    newcard.querySelector(".date-goes-here").innerHTML = `Date: ${day}`; // populate the date-goes-here tag
                    newcard.querySelector(".emotion-goes-here").innerHTML = `Rated: ${rating}`; // populate the emotion-goes-here tag
                    newcard.querySelector(".question-goes-here").innerHTML = `Question of the day: ${quest}`; // populate the question-goes-here tag
                    newcard.querySelector(".written-response").innerHTML = `Response: ${answer}`; // populate the written-response tag
                    newcard.querySelector(".edit_button").href = "edit-response.html?id="+id // populate the href of edit-response tag with the id in the url

                    //attach to container
                    document.getElementById("mood_render").append(newcard); // appends the card and shows it the mood_render container
                    i++
                }
            })
        })
}

// Takes the moodtrack report done by user today
function NewDay() {
    currentUser.collection("dailymood") // Goes inside the dailymoo collection of the user
        .get()
        .then(mood => {
            mood.forEach(doc => {
                var rating = doc.data().emotion; //takes the emotion value
                var day = doc.data().date; // takes the date value
                var quest = doc.data().question; // takes the question value
                var answer = doc.data().response; // takes the response value
                var id = doc.id // takes the id value

                if (TODAY === day) { // condition that if the doc is made just today
                    $("#NewDayContainer").empty() // it will empty out the NewDayContainer - the welcome qoute, and moodtrack button
                    document.getElementById("NewDayContainer").style.borderRadius = "20%" // changes the css property of the container
                    $("#NewDayContainer").html(` 
                    <div class="today-response">
                        <div class="inner-today-response">
                            <div>
                                <h4 class="emotion-goes-here today-featured"> You Rated: ${rating} </h4>
                                <hr>
                                <h6 class="question-goes-here today-featured"> Question of the day: <span> ${quest} </span> </h6>
                                <p class="written-response today-featured"> ${answer} </p>
                                <hr>
                                <a class="mood_button edit_button" href="edit-response.html?id=${id}">Edit</a>
                                <br>
                            </div>
                        </div>
                    </div>`) // Adds a new html elements in the container containing what they just rated today
                            // their response and they can also edit it
                }
            })
        })
}

// Fake data to populate the dailymood
function writemoods() {
    //define a variable for the collection you want to create in Firestore to populate data
    var hikesRef = currentUser.collection("dailymood");

    hikesRef.add({
        date: "Mon Apr 04 2022",
        emotion: "Awful",
        question: "Why do you feel down today?",
        response: "I didn't do my homework"
    });
    hikesRef.add({
        date: "Sun Apr 03 2022",
        emotion: "Good",
        question: "What's the most beautiful thing you saw today?",
        response: "I saw Kim and Lexie, duh!"
    });
    hikesRef.add({
        date: "Sat Apr 02 2022",
        emotion: "Meh",
        question: "What made you laugh or smile today?",
        response: "My idea for COMP 1510 A4"
    });
    hikesRef.add({
        date: "Fri Apr 01 2022",
        emotion: "Bad",
        question: "How far have you come?",
        response: "I have come really really really far"
    });
    hikesRef.add({
        date: "Thurs Mar 31 2022",
        emotion: "Splendid",
        question: "What about yourself you are grateful for?",
        response: "I cry a lot and I only think about men"
    });
}

// Function that updates the span (today-date) which contains date into real-time date
function currentdate() {
    TODAY = new Date().toDateString() // takes a new date

    $("#today-date").html(TODAY) // shows it to the website
}