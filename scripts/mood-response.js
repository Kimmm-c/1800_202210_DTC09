function gettingresponse() {
   let response = ($(this).attr('id')); //This will grab the id of the element and alert. Although $(this).id also work, I like this way.
   let day = document.getElementById("question-goes-here").value;

   firebase.auth().onAuthStateChanged(user => {
    if (user) {
        var currentUser = db.collection("user").doc(user.uid)
        var userID = user.uid;
        //get the document for current user.
        currentUser.get()
            .then(userDoc => {
                var userEmail = userDoc.data().email;
                db.collection("mood").add({
                    answer: response,
                    day: userID,
                    question: day
                }).then(()=>{
                    window.location.href = "next,q"; //new line added
                })
            })
               
    } else {
        // No user is signed in.
    }
});

}

$(".response_button").click(gettingresponse)