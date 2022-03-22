db.collection("thread").get().then((data) => {
    data.docs.forEach(doc => {
        renderThread(doc.data());
    });
})

function renderThread(data){
    //console.log(data);
    //console.log(data.title);
    //console.log(data.details);
    $(".thread_render").append(`<div class="single_thread">
    <h5><b>${data.title}</b></h5>
    <p>${data.details}</p></div>`)
}
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
    let title = document.getElementById("journal_title").value;
    let content = document.getElementById("journal_content").value;
    console.log(title);
    console.log(content);
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
                        content: content,
                        userid: userID
                    }).then(() => {
                        //window.location.href = "http://127.0.0.1:5500/html/forum/index.html";
                        console.log("journal added into database")
                    })
                })
        } else {
            console.log("user not signed in")
        }
    });
}

function saveThread() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            let title = document.getElementById("thread_title").value;
            let content = document.getElementById("thread_content").value;
            console.log(title);
            console.log(content);
            var currentUser = db.collection("user").doc(user.uid);
            var userID = user.uid;
            currentUser.get()
                .then(userDoc => {
                    var userEmail = userDoc.data().email;
                    db.collection("thread").add({
                        title: title,
                        content: content,
                        userid: userID
                    }).then(() => {
                        //window.location.href = "http://127.0.0.1:5500/html/forum/index.html";
                        console.log("thread added into database")
                    })
                })
        } else {
            console.log("user not signed in")
        }
    });
}

function display_thread_form() {
    $("#thread").empty();
    $("#journal").empty();
    $("#thread").append(`<form>
    <label for="title"><b>Title:</b></label><br>
    <input type="text" id="thread_title"><br>
    <label for="content"><b>Content:</b></label><br>
    <textarea id="thread_content" rows="5" cols="50"></textarea><br>
    <button class="cancel_button">Cancel</button>
    <button id="thread_submit_button" onclick=saveThread()>Post</button></form>`)
    
}

function display_journal_form() {
    $("#thread").empty();
    $("#journal").empty();
    $("#journal").append(`<form>
    <label for="title"><b>Title:</b></label><br>
    <input type="text" id="journal_title"><br>
    <label for="content"><b>Content:</b></label><br>
    <textarea id="journal_content" rows="5" cols="50"></textarea><br>
    <button class="cancel_button">Cancel</button>
    <button id="journal_submit_button" onclick=saveJournal()>Save</button></form>`)

}
function setup() {
    $("#start_thread").click(display_thread_form);
    $("#write_journal").click(display_journal_form);
    //$('#journal_submit_button').click(saveJournal);
    //$("#thread_submit_button").click(saveThread);
}
$(document).ready(setup);


