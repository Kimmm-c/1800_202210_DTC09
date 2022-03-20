function sayHello() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            // Do something for the user here. 
            console.log(user.uid);
            db.collection("users").doc(user.uid)
                .get()
                .then(function (doc) {
                    var n = doc.data().name;
                    console.log(n);
                    //$("#username").text(n);
                    document.getElementById("username").innerText = n;
                })
        } else {
            // No user is signed in.
        }
    });
}

function toggleOffer(id) {
    offers = ['#moodtracker-content', '#meditation-content', '#forum-content']
    if ($(offers[id]).css('display') === 'none') $(offers[id]).show()
    else return

    offers.splice(id, 1)
    for (div of offers) {
        $(div).css('display', 'none')
    }
}