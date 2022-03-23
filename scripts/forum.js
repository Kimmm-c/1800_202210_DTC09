db.collection("thread").get().then((data) => {
    data.docs.forEach(doc => {
        renderThread(doc.data());
    });
})

function renderThread(data) {
    //console.log(data);
    //console.log(data.title);
    //console.log(data.details);
    $(".thread_render").append(`<div class="single_thread">
    <h5><b>${data.title}</b></h5>
    <p>${data.content}</p></div>`)
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
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection("journals").add({
                title: $("#journal_title").val(),
                content: $("#journal_content").val(),
                userID: user.uid
            })
            console.log("data added");
            $("#journal_title").val('');
            $("#journal_content").val('');
        } else {
            console.log("user not signed in")
        }
    })
}

function saveThread() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection("thread").add({
                title: $("#thread_title").val(),
                content: $("#thread_content").val(),
                userID: user.uid
            })
            console.log("data added");
            $("#thread_title").val('');
            $("#thread_content").val('');
        } else {
            console.log("user not signed in")
        }
    })
}

function display_thread_form() {
    $("#thread").empty();
    $("#journal").empty();
    $("#write_journal").css("text-decoration", "none");
    $(this).css("text-decoration", "underline");
    $("#thread").append(`
    <label for="title"><b>Title:</b></label><br>
    <input type="text" id="thread_title"><br>
    <label for="content"><b>Content:</b></label><br>
    <textarea id="thread_content" rows="5" cols="50"></textarea><br>
    <button class="cancel_button">Cancel</button>
    <button id="thread_submit_button" onclick=saveThread()>Post</button>`)

}

function display_journal_form() {
    $("#thread").empty();
    $("#journal").empty();
    $("#start_thread").css("text-decoration", "none");
    $(this).css("text-decoration", "underline");
    $("#journal").append(`
    <label for="title"><b>Title:</b></label><br>
    <input type="text" id="journal_title"><br>
    <label for="content"><b>Content:</b></label><br>
    <textarea id="journal_content" rows="5" cols="50"></textarea><br>
    <button class="cancel_button">Cancel</button>
    <button id="journal_submit_button" onclick=saveJournal()>Save</button>`)

}
function setup() {
    $("#start_thread").click(display_thread_form);
    $("#write_journal").click(display_journal_form);
    $("body").on('click', ".cancel_button", () => { 
        window.location.href = "http://127.0.0.1:5500/html/forum/index.html";
    })
    //$('#journal_submit_button').click(saveJournal);
    //$("#thread_submit_button").click(saveThread);
}
$(document).ready(setup);


