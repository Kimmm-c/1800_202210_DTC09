var TODAY;
var currentUser
var UID; // UID of the mood

firebase.auth().onAuthStateChanged(user => {
    // A function that takes the current user who is login
    if (user) {
        currentUser = db.collection("user").doc(user.uid);   //global

        // the following functions are always called when someone is logged in
        populate_mood()
        NewDay()
    } else {
        // No user is signed in.
        console.log("No user is signed in");
        window.location.href = "login.html";
    }
});

function populate_mood() {
    let moodTemplate = document.getElementById("moodHistoryTemplate")
    currentUser.collection("dailymood")
        .orderBy("date")
        .get()
        .then(mood => {
            var i = 1;
            mood.forEach(doc => {
                var rating = doc.data().emotion;
                var day = doc.data().date;
                var quest = doc.data().question;
                var answer = doc.data().response;
                var id = doc.id;
                console.log(id)
                let newcard = moodTemplate.content.cloneNode(true);
                //update rating, day, question, answer 
                if (TODAY === day) {
                    return;
                }
                if (TODAY !== day) {
                    newcard.querySelector(".date-goes-here").innerHTML = `Date: ${day}`;
                    newcard.querySelector(".emotion-goes-here").innerHTML = `Rated: ${rating}`;
                    newcard.querySelector(".question-goes-here").innerHTML = `Question of the day: ${quest}`;
                    newcard.querySelector(".written-response").innerHTML = `Response: ${answer}`;
                    newcard.querySelector(".edit_button").href = "edit-response.html?id="+id

                    //attach to container
                    document.getElementById("mood_render").append(newcard);
                    i++
                }
            })
        })
}

function NewDay() {
    let moodTemplate = document.getElementById("moodHistoryTemplate")
    currentUser.collection("dailymood")
        .orderBy("date")
        .get()
        .then(mood => {
            var i = 1;
            mood.forEach(doc => {
                var rating = doc.data().emotion;
                var day = doc.data().date;
                var quest = doc.data().question;
                var answer = doc.data().response;
                var id = doc.data().id
                //update rating, day, question, answer 
                if (TODAY === day) {
                    $(".NewDayContainer").empty()
                    $(".NewDayContainer").html(`
                    <div class="today-response">
                        <h4 class="emotion-goes-here today-featured"> ${rating} </h4>
                        <h5 class="date-goes-here today-featured"> ${day} </h5>
                        <hr>
                        <h6 class="question-goes-here today-featured"> ${quest} </h6>
                        <p class="written-response today-featured"> ${answer} </p>
                        <hr>
                        <button class="mood_button edit_button" id=${id}> Edit Response |</button>
                    </div>`)
                }
            })
        })
}

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

function currentdate() {
    // Function that updates the span (today-date) which contains date into real-time date
    TODAY = new Date().toDateString() // takes a new date

    $("#today-date").html(TODAY) // shows it to the website
}

document.getElementsByClassName("edit_button")

currentdate()