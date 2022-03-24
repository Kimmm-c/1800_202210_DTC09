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
    console.log(moodResponse)
    console.log(currentUser)
    currentUser.collection("dailymood").add({
        rating: moodResponse,
        date: today
    }).then(function () {
        console.log("Added subcollection")
    })
        .catch((error) => {
            console.log("Unable to add daily rating" + error)
        })
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
    console.log(moodRating)
})

// function checkifDone (){
//     today = document.getElementById("today-date").innerHTML
//     currentUser.collection("dailymood").get()
//     .then(AllRating => {
//         AllRating.forEach(doc => {
//             var day = doc.data().date;

//             if (day === today) {
//                 $("#choices").empty

//             } else {
//                 console.log("Haven't done yet")
//             }
//         })
//     })
// }