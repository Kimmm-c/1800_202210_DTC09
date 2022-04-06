var currentUser;
var UID; // UID of the mood
var RESPONSE;

firebase.auth().onAuthStateChanged(user => {
    // A function that takes the current user who is login
    if (user) {
        currentUser = db.collection("user").doc(user.uid);   //global
        // the following functions are always called when someone is logged in
        getID()
        populate_page()
    } else {
        // No user is signed in.
        console.log("No user is signed in");
        window.location.href = "login.html";
    }
});


function populate_page() {
    currentUser.collection("dailymood").doc(UID).get()
        .then(mood => {
            var rating = mood.data().emotion;
            var day = mood.data().date;
            var quest = mood.data().question;
            var answer = mood.data().response;
            document.getElementById("emotion").innerHTML = rating;
            document.getElementById("date").innerHTML = day;
            document.getElementById("question").innerHTML = quest;
            document.getElementById("input-response").value = answer;
            RESPONSE = answer
        })
}


function visible_button(){
    currentResponse = document.getElementById("input-response").value
    if (currentResponse === RESPONSE) {
        document.getElementById("update_button").style.visibility = "hidden"
    } else {
        document.getElementById("update_button").style.visibility = "visible"
    }
}


function overwrite_response(){
    currentUser.collection("dailymood").doc(UID)
    console.log(document.getElementById("input-response").value)
    .update({
        response: document.getElementById("input-response").value
    })
}


function getID() {
    let params = new URL(window.location.href)
    UID = params.searchParams.get("id")
}

document.getElementById("input-response").addEventListener("change", visible_button)
document.getElementById("update_button").addEventListener("click", overwrite_response)