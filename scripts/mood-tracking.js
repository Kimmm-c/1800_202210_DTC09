
function read_display_Quote() {

    db.collection("moodtracker").doc("Question Bank")                                                      //name of the collection and documents should matach excatly with what you have in Firestore
        .onSnapshot(Questions => {       
            let number = getRandInt();                                                       //arrow notation
            console.log("current document data: " + Questions.data());                          //.data() returns data object
            document.getElementById("question").innerHTML = Questions.data()[number];      //using javascript to display the data on the right place

            //Here are other ways to access key:value data fields
            //$('#quote-goes-here').text(c.data().quote);                                       //using jquery object dot notation
            //$("#quote-goes-here").text(c.data()["quote"]);                                    //using json object indexing
        })
}

function writeMood(moodResponse) {
    let day = document.getElementById("today").innerHTML
    let question = document.getElementById("question").innerHTML
    
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var currentUser = db.collection('users').doc(user.uid);
            var userID = user.uid;
            console.log(`UID`, userID)

            currentUser.get()
                .then(userDoc => {
                    db.collection('moodtracker').add({
                        day: day,
                        question: question,
                        user: userID
                    })
                    .then(console.log('submitted'))
                })
        }
        else console.log("no user signed in")
    })

}


function getRandInt() {
    return Math.floor(Math.random() * (7 - 1 + 1)) + 1;
}


read_display_Quote()        //calling the function