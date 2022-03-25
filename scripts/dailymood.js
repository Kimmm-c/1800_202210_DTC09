var moodRating;
var currentUser;

firebase.auth().onAuthStateChanged(user => {
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
    let today = document.getElementById("today-date").innerHTML
    currentUser.collection("dailymood").add({
        rating: moodResponse,
        date: today
    }).then(function () {
        console.log("Added subcollection")
    })
        .catch((error) => {
            console.log("Unable to add daily rating" + error)
        })
    
        checkifDone()
}

function currentdate() {
    var today = new Date()
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    $("#today-date").html(today)
}


$(".response_button").click(function(){
    moodRating = $(this).val();
})

function checkifDone (){
    today = document.getElementById("today-date").innerHTML
    currentUser.collection("dailymood").get()
    .then(allRating => {
        allRating.forEach(doc => {
            day = doc.data().date
            
            if (today === day) {
                $("#moodCard").empty()
                moodDisabler = $("#moodCard").html(`<h3> Thank you for sharing, see you tomorrow! </h3`)
            }
        })
    })
}