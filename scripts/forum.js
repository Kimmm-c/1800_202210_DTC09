function addThread() {
    max = 5;
    //define a variable for the collection you want to create in Firestore to populate data
    var hikesRef = db.collection("thread");
    for (i = 1; i <= max; i++) {
        hikesRef.add({ //add to database, autogen ID
            code: "id" + i,
            title: "Title" + i,
            details: "Testing" + i
        })
   }
}


function writeReview() {
    let Description = document.getElementById("description").value;
    //console.log(Title, Level, Season, Description, Flooded, Scrambled);
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var currentUser = db.collection("user").doc(user.uid)
            var userID = user.uid;
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    var userEmail = userDoc.data().email;
                    db.collection("Reply").add({
                        details: Description,

                    }).then(() => {
                        window.location.href = "forum.html";
                    })
                })

        } else {
            // No user is signed in.
        }
    });

}

function saveJournal() {
    let title = document.getElementById("title").value;
    let Description = document.getElementById("description").value;
    //console.log(Title, Level, Season, Description, Flooded, Scrambled);
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var currentUser = db.collection("user").doc(user.uid)
            var userID = user.uid;
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    var userEmail = userDoc.data().email;
                    db.collection("journals").add({
                        title: title,
                        details: Description,

                    }).then(() => {
                        window.location.href = "forum.html";
                    })
                })

        } else {
            // No user is signed in.
        }
    });

}


