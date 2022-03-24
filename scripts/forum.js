// db.collection("thread").get().then((data) => {
//     data.docs.forEach(doc => {
//         renderThread(doc.data(), doc.id);
//     });
// })

db.collection("thread").onSnapshot(snapshot => {
    //console.log(snapshot.docChanges());
    realtime_thread = snapshot.docChanges();
    realtime_thread.forEach(change => {
        if (change.type == 'added') {
            //console.log(change.doc.data());
            console.log(change.type);
            console.log(change.doc.id);
            renderThread(change.doc.data(), change.doc.id);
        } else if (change.type == 'removed') {
            thread = document.getElementById(change.doc.id);
            //     console.log(thread);
            thread.remove();
            //console.log(change.type);
        }
    })
})

function renderThread(data, data_id) {
    //console.log(data);
    //console.log(data.title);
    //console.log(data.details);
    firebase.auth().onAuthStateChanged(user => {
        //console.log(user.uid);
        //console.log(data.userID);
        if (user.uid == data.userID) {
            $(".thread_render").append(`<div class="single_thread" id=${data_id}>
        <h5><b>${data.title}</b></h5>
        <button class="thread_buttons edit_post">Edit post</button>
        <button class="thread_buttons delete_post">Delete post</button>
        <p>${data.content}</p></div>`)
        } else {
            $(".thread_render").append(`<div class="single_thread">
        <h5><b>${data.title}</b></h5>
        <button class="thread_buttons report_post">Report</button>
        <p>${data.content}</p></div>`)
        }
    })
}

//Last update: ${data.last_updated.toDate()}
function writeReview() {
    let Description = document.getElementById("description").value;
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
                userID: user.uid,
                last_updated: firebase.firestore.FieldValue.serverTimestamp()
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
                userID: user.uid,
                last_updated: firebase.firestore.FieldValue.serverTimestamp()
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

function display_delete_modal() {
    $(this).parent().append(`<div class="delete_modal" id="delete_modal">
    <div class="modal_content">
    <h3><b>Delete Post</b></h3>
    <p>Are you sure you want to delete this post?</p>
    <button id="cancel_delete" onclick="document.getElementById('delete_modal').remove()">Cancel</button>
    <button id="confirm_delete" class="confirm_delete">Delete</button>
    </div></div>`)

}

function deleteThread() {
    //console.log($(this).parent().parent().parent().attr("id"));
    threadID = $(this).parent().parent().parent().attr("id");
    db.collection("thread").doc(threadID).delete();
}

function setup() {
    $("#start_thread").click(display_thread_form);
    $("#write_journal").click(display_journal_form);
    $("body").on('click', ".cancel_button", () => {
        window.location.href = "index.html";
    })
    $("body").on("click", ".delete_post", display_delete_modal);
    $("body").on("click", ".confirm_delete", deleteThread);
    //$('#journal_submit_button').click(saveJournal);
    //$("#thread_submit_button").click(saveThread);
}
$(document).ready(setup);


