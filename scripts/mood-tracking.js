var moodRating; // Global variable for user's submitted mood rating
var DocUID; // Global variable to get the uid document of current date
var currentUser; // Global variable for CurrentUser
var TODAY; // Global variable for today's date
var emotionButtons = document.getElementsByClassName("response_button");

firebase.auth().onAuthStateChanged(user => {
    // A function that takes the current user who is login
    if (user) {
        currentUser = db.collection("user").doc(user.uid);   //global

        // the following functions are always called when someone is logged in
        currentdate()
        checkifRating()
        checkifResponse()
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
        checkifRating()
    })
        .catch((error) => {
            console.log("Unable to add daily rating" + error)
        })
}

function currentdate() {
    // Function that updates the span (today-date) which contains date into real-time date
    TODAY = new Date().toDateString() // takes a new date

    $("#today-date").html(TODAY) // shows it to the website
}


$(".response_button").click(function () {
    // A function that keeps track which button user
    // clicked
    moodRating = $(this).val();
})


function checkifRating() {
    // Function that disables the rating card
    // if User has done it for today
    currentUser.collection("dailymood").get() // Visits the dailymood subcollection of the user
        .then(allRating => {
            allRating.forEach(doc => { // Visits each document in the subcollection
                day = doc.data().date  // And takes the date field of the document
                feeling = doc.data().emotion
                if (TODAY === day) {  // If day is the same as the today, the card will be disabled and instead show a text
                    DocUID = doc.id
                    $(".trackingContainer").empty()
                    $(".trackingContainer").html(`<h3> You rated: ${feeling}</button> </h3> 
                                    <br>
                                    <div id="input-container"> <h4 id="question"> ${writeQuestion(feeling)}</h4>
                                    <textarea id="UserResponse" name="UserResponse" placeholder="Write here" value=""> </textarea>
                                    <button id="response-button" type="button" class="btn-lg" 
                                            onclick="getResponse()"> Submit </button>`)
                }
            })
        })
}

// A function that picks a question from Firebase
// A show that to the user
function writeQuestion(mood) {
    number = parseInt((Math.random() * (9 - 1 + 1)), 10) + 1 // picks a random number
    mood = decomposing(mood)    // change the emotion to number value
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
// Change the string value into numerical value
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

// Gets the user's response and upload that to firebase
// on the same day document
function getResponse() {
    UserResponse = currentUser.collection("dailymood").doc(DocUID);
    checkifResponse()
    UserResponse.update({
        response: $("#UserResponse").val(),
        question: document.getElementById("question").innerHTML,

    })
}

// Gets a random quote from the document
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

function backToIndex() {
    window.location.replace("index.html");
}

// A function that disables the question-write card
// Will then show a random quote
function checkifResponse() {
    currentUser.collection("dailymood").get() // Visits the dailymood subcollection of the user
        .then(allRating => {
            allRating.forEach(doc => { // Visits each document in the subcollection
                day = doc.data().date  // And takes the date field of the document
                response = doc.data().response
                if (TODAY === day && response !== undefined) {  // If day is the same as the today, the card will be disabled and instead show a quote
                    var user_Name;
                    currentUser.get().then(userDoc => {
                        user_Name = userDoc.data().name;
                        $(".trackingContainer").empty()
                        $(".trackingContainer").html(` 
                                <div id="qoute-tag">
                                <blockqoute> ${getQoute()} <blockqoute> </div>
                                <h6> Thank you for sharing, ${user_Name} </h6>`)
                        setTimeout(backToIndex, 3000)
                    })
                }
            })
        })
}

function change_colour(){
    if (this.id.includes('splendid')){
        document.getElementById("splendid-button").style.color = "rgb(255,248,220)"
        document.getElementById("splendid-button").style.backgroundColor = "rgb(255,127,80)"
        document.getElementById("good-button").style.color = "rgb(50,205,50)"
        document.getElementById("good-button").style.backgroundColor = "rgba(230,230,250, 0.5)"
        document.getElementById("meh-button").style.color = "rgb(64,224,208)"
        document.getElementById("meh-button").style.backgroundColor = "rgba(230,230,250, 0.5)"
        document.getElementById("bad-button").style.color = "rgb(0,191,255)"
        document.getElementById("bad-button").style.backgroundColor = "rgba(230,230,250, 0.5)"
        document.getElementById("awful-button").style.color = "rgb(65,105,225)"
        document.getElementById("awful-button").style.backgroundColor = "rgba(230,230,250, 0.5)"
    }
    if (this.id.includes('good')){
        document.getElementById("good-button").style.color = "rgb(255,248,220)"
        document.getElementById("good-button").style.backgroundColor = "rgb(50,205,50)"
        document.getElementById("splendid-button").style.color = "rgb(255,127,80)"
        document.getElementById("splendid-button").style.backgroundColor = "rgba(230,230,250, 0.5)"
        document.getElementById("meh-button").style.color = "rgb(64,224,208)"
        document.getElementById("meh-button").style.backgroundColor = "rgba(230,230,250, 0.5)"
        document.getElementById("bad-button").style.color = "rgb(0,191,255)"
        document.getElementById("bad-button").style.backgroundColor = "rgba(230,230,250, 0.5)"
        document.getElementById("awful-button").style.color = "rgb(65,105,225)"
        document.getElementById("awful-button").style.backgroundColor = "rgba(230,230,250, 0.5)"
    }
    if (this.id.includes('meh')){
        document.getElementById("good-button").style.color = "rgb(50,205,50)"
        document.getElementById("good-button").style.backgroundColor = "rgba(230,230,250, 0.5)"
        document.getElementById("splendid-button").style.color = "rgb(255,127,80)"
        document.getElementById("splendid-button").style.backgroundColor = "rgba(230,230,250, 0.5)"
        document.getElementById("meh-button").style.color = "rgb(255,248,220)"
        document.getElementById("meh-button").style.backgroundColor = "rgb(64,224,208)"
        document.getElementById("bad-button").style.color = "rgb(0,191,255)"
        document.getElementById("bad-button").style.backgroundColor = "rgba(230,230,250, 0.5)"
        document.getElementById("awful-button").style.color = "rgb(65,105,225)"
        document.getElementById("awful-button").style.backgroundColor = "rgba(230,230,250, 0.5)"
    }
    if (this.id.includes('bad')){
        document.getElementById("good-button").style.color = "rgb(50,205,50)"
        document.getElementById("good-button").style.backgroundColor = "rgba(230,230,250, 0.5)"
        document.getElementById("splendid-button").style.color = "rgb(255,127,80)"
        document.getElementById("splendid-button").style.backgroundColor = "rgba(230,230,250, 0.5)"
        document.getElementById("meh-button").style.color = "rgb(64,224,208)"
        document.getElementById("meh-button").style.backgroundColor = "rgba(230,230,250, 0.5)"
        document.getElementById("bad-button").style.color = "rgb(255,248,220)"
        document.getElementById("bad-button").style.backgroundColor = "rgb(0,191,255)"
        document.getElementById("awful-button").style.color = "rgb(65,105,225)"
        document.getElementById("awful-button").style.backgroundColor = "rgba(230,230,250, 0.5)"
    }
    if (this.id.includes('awful')){
        document.getElementById("good-button").style.color = "rgb(50,205,50)"
        document.getElementById("good-button").style.backgroundColor = "rgba(230,230,250, 0.5)"
        document.getElementById("splendid-button").style.color = "rgb(255,127,80)"
        document.getElementById("splendid-button").style.backgroundColor = "rgba(230,230,250, 0.5)"
        document.getElementById("meh-button").style.color = "rgb(64,224,208)"
        document.getElementById("meh-button").style.backgroundColor = "rgba(230,230,250, 0.5)"
        document.getElementById("bad-button").style.color = "rgb(0,191,255)"
        document.getElementById("bad-button").style.backgroundColor = "rgba(230,230,250, 0.5)"
        document.getElementById("awful-button").style.color = "rgb(255,248,220)"
        document.getElementById("awful-button").style.backgroundColor = "rgb(65,105,225)"
    }
}

for (i = 0; i < emotionButtons.length; i++) {
    console.log(emotionButtons[i])
    emotionButtons[i].addEventListener("click", change_colour)
}