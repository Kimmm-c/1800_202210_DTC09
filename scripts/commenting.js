function postComment(){
    //console.log("asdfasfd")
    let title = document.getElementById("title").value;
    let comment = document.getElementById("comment").value;
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var currentUser = db.collection("users").doc(user.uid)
            var userID = user.uid;
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    var userEmail = userDoc.data().email;
                    db.collection("Comment").add({
                        userID: userID,
                        title: title,
                        comment: comment,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    }).then(()=>{
                        window.location.href = "forum1.html"; //new line added
                    })
                })
                   
        } else {
            // No user is signed in.
        }
    });

}
function saveDraft(){
    //console.log("asdfasfd")
    let draft = document.getElementById("writing_something").value;
    let title = document.getElementById("thread_title").value;
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var currentUser = db.collection("users").doc(user.uid)
            var userID = user.uid;
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    var userEmail = userDoc.data().email;
                    db.collection("Draft").add({
                        userID: userID,
                        title: title,
                        draft: draft,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    }).then(()=>{
                        window.location.href = "forum1.html"; //new line added
                    })
                })
                   
        } else {
            // No user is signed in.
        }
    });

}
postComment();