var moodRating; // Global variable for user's submitted mood rating
var DocUID; // Global variable to get the uid document of current date
var currentUser; // Global variable for CurrentUser
var TODAY;

firebase.auth().onAuthStateChanged(user => {
    // A function that takes the current user who is login
    if (user) {
        currentUser = db.collection("user").doc(user.uid);   //global

        // the following functions are always called when someone is logged in
        currentdate()
        checkifRating()
    } else {
        // No user is signed in.
        console.log("No user is signed in");
        window.location.href = "login.html";
    }
});

function getMood(moodResponse) {
    // function that takes the moodrating users submitted

    let today = document.getElementById("today-date").innerHTML // The line that shows the current date
    currentUser.collection("dailymood").add({      // Creates a subcollection called "daily mood" in the currentUser document
        emotion: moodResponse,   // Creates field for the rating they submitted
        date: today,     // Creates a field for the current date
    }).then(function () {
        console.log("Added subcollection")
    })
        .catch((error) => {
            console.log("Unable to add daily rating" + error)
        })

    checkifRating()
}

function currentdate() {
    // Function that updates the span (today-date) which contains date into real-time date
    var today = new Date().toDateString() // takes a new date

    $("#today-date").html(today) // shows it to the website
}


$(".response_button").click(function () {
    // A function that keeps track which button user
    // clicked
    moodRating = $(this).val();
})


function checkifRating() {
    // Function that disables the rating card
    // if User has done it for today
    TODAY = document.getElementById("today-date").innerHTML // Takes the current date
    currentUser.collection("dailymood").get() // Visits the dailymood subcollection of the user
        .then(allRating => {
            allRating.forEach(doc => { // Visits each document in the subcollection
                day = doc.data().date  // And takes the date field of the document
                feeling = doc.data().emotion

                if (TODAY === day) {  // If day is the same as the today, the card will be disabled and instead show a text
                    DocUID = doc.id
                    $(".moodtracking-card").empty()
                    $(".moodtracking-card").html(`<h3> You rated: ${feeling} </h3> 
                                    <div> <h4 id="question"> ${writeQuestion(feeling)} <h4>
                                    <input type="text" id="UserResponse" name="UserResponse" placeholder="Start writing here?" value=""> </div>
                                    <button id="response-button" type="button" class="btn btn-outline-success" 
                                            onclick="getResponse()">Submit</button>`)
                }
            })
        })
}

function writeQuestion(mood) {
    number = parseInt((Math.random() * (9 - 1 + 1)), 10) + 1
    mood = decomposing(mood)
    randq = "Q" + number
    if (mood >= 3) {
        db.collection("MoodQuestions").doc("FeelingUp").get().then(question => {

            randomQ = question.data()[randq]
            $("#question").html(randomQ)
        })
    } else {
        db.collection("MoodQuestions").doc("FeelingDown").get().then(question => {

            randomQ = question.data()[randq]
            $("#question").html(randomQ)
        })
    }
    
}

function decomposing(mood) {
    if ("Splendid" === mood) {
        return 5
    } else if ("Good" === mood) {
        return 4
    } else if ("Meh" === mood) {
        return 3
    } else if ("Bad" === mood) {
        return 2
    } else {
        return 1
    }
}

function getResponse() {
    UserResponse = currentUser.collection("dailymood").doc(DocUID);
    UserResponse.update({
        response: $("#UserResponse").val(),
        question: document.getElementById("question").innerHTML,
    
    })
    checkifResponse()
}

function getQoute() {
    number = parseInt((Math.random() * (6 - 1 + 1)), 10) + 1
    db.collection("MoodQuestions").doc("Qoutes").get().then(qoute => {
        pickedQoute = qoute.data().qoutes[number];
        $("#qoute-tag").html(pickedQoute)
    });
}


function WriteQoutes() {
    CurrentDoc = db.collection("MoodQuestions").doc("Qoutes")
    CurrentDoc.update({
        qoutes: ["\"Thousands of candles can be lighted from a single candle, and the life of the candle will not be shortened. Happiness never decreases by being shared.\" - Buddha",
            "\"There is only one way to happiness and that is to cease worrying about things which are beyond the power of our will.\" - Epictetus",
            "\"For every minute you are angry you lose sixty seconds of happiness.\" -  Ralph Waldo Emerson",
            "\"Happiness is when what you think, what you say, and what you do are in harmony.\" -  Mahatma Gandhi",
            "\"Happiness in intelligent people is the rarest thing I know. \" - Ernest Hemingway",
            "\"People are just as happy as they make up their minds to be.\" - Abraham Lincoln",
            "\"We all live with the objective of being happy; our lives are all different and yet the same.\" - Anne Frank"
        ]
    })
}

function checkifResponse() {
    currentUser.collection("dailymood").get() // Visits the dailymood subcollection of the user
        .then(allRating => {
            allRating.forEach(doc => { // Visits each document in the subcollection
                day = doc.data().date  // And takes the date field of the document
                response = doc.data().response
                console.log(response)
                console.log(day)
                if (TODAY === day && response !== undefined) {  // If day is the same as the today, the card will be disabled and instead show a text
                    var user_Name;
                    currentUser.get().then(userDoc => {
                        user_Name = userDoc.data().name;
                        $(".moodtracking-card").empty()
                        $(".moodtracking-card").html(` 
                            <h4> Thank you for sharing, ${user_Name} </h4>
                                <blockqoute id="qoute-tag"> ${getQoute()} <blockqoute>`)
                    })
                }
            })
        })
}