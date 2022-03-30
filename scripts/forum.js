// db.collection("thread").get().then((data) => {
//     data.docs.forEach(doc => {
//         renderThread(doc.data(), doc.id);
//     });
// })

//Get the threads from database in order to render them on Forum page
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        db.collection("thread").orderBy('last_updated').onSnapshot(snapshot => {
            //console.log(snapshot.docChanges());
            realtime_thread = snapshot.docChanges();
            realtime_thread.forEach(change => {                        
                if (change.type == 'added') {                           //if new thread is added
                    //console.log(change.doc.data());
                    //console.log(change.type);
                    //console.log(change.doc.id);
                    renderThread(change.doc.data(), change.doc.id);
                } else if (change.type == 'removed') {                  //if an existing thread is removed
                    thread = document.getElementById(change.doc.id);
                    //     console.log(thread);
                    thread.remove();
                    //console.log(change.type);
                } else {                                                //if a thread is modified
                    document.getElementById(change.doc.id).children[0].innerHTML = "<b>"+change.doc.data().title+"</b>";
                    document.getElementById(change.doc.id).children[3].innerHTML = change.doc.data().content;
                }
            })
        })
    }else{
        window.location.href="../../login.html";
    }
})

function renderThread(data, data_id) {
    //console.log(data);
    //console.log(data.title);
    //console.log(data.details)
    firebase.auth().onAuthStateChanged(user => {
        //console.log(user.uid);
        //console.log(data.userID);
        if (user.uid == data.userID) {
            $(".thread_render").prepend(`<div class="single_thread" id=${data_id}>
        <h5><b>${data.title}</b></h5>
        <button class="thread_buttons edit_post">Edit post |</button> 
        <button class="thread_buttons delete_post">Delete post</button>
        <hr>
        <p>${data.content}</p>
        <hr>
        <div><a class="comment_section" data="${data_id}" href="comment.html">Comment</a></div></div>`)
        } else {
            $(".thread_render").prepend(`<div class="single_thread">
        <h5><b>${data.title}</b></h5>
        <button class="thread_buttons report_post">Report</button>
        <hr>
        <p>${data.content}</p>
        <hr>
        <div><a class="comment_section" data="${data_id}" href="comment.html">Comment</a></div></div>`)
        }
    })
    
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
    <textarea id="thread_content" rows="5" cols="40"></textarea><br>
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
    <textarea id="journal_content" rows="5" cols="40"></textarea><br>
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

function display_edit_form() {
    //console.log($(this).siblings("h5").text());
    old_title = $(this).siblings("h5").text();
    old_content = $(this).siblings("p").text();
    threadID = $(this).parent().attr("id");
    $(this).parent().append(`<div id="edit_form">
    <label for="update_thread_title"><b>Title:</b></label><br>
    <input type="text" id="update_thread_title" value="${old_title}"><br>
    <label for="update_thread_content"><b>Content:</b></label><br>
    <textarea id="update_thread_content" rows="10" cols="40">${old_content}</textarea><br>
    <button class="cancel_edit" onclick="$(this).parent().remove();">Cancel</button>
    <button id="${threadID}" class="update_thread">Save</button>`)
    //console.log($(this).parent());
}

function updateThread(){
    //console.log($(this).attr("id"));
    update_title=$(this).siblings("input").val();
    update_content=$(this).siblings("textarea").val();
    //console.log(update_title);
    console.log(update_content);
    db.collection("thread").doc($(this).attr("id")).update({
        title: update_title,
        content: update_content,
        last_updated: firebase.firestore.FieldValue.serverTimestamp()
    })
    $(this).parent().remove();
}

function save_to_storage(){
    //console.log('testing');
    localStorage.setItem("threadID", $(this).attr("data"));
}

function setup() {
    $("#start_thread").click(display_thread_form);
    $("#write_journal").click(display_journal_form);
    $("body").on('click', ".cancel_button", () => {
        document.getElementsByClassName("cancel_button")[0].parentElement.innerHTML="";
    })
    $("body").on("click", ".delete_post", display_delete_modal);
    $("body").on("click", ".confirm_delete", deleteThread);
    $("body").on("click", ".edit_post", display_edit_form);
    $("body").on("click", ".update_thread", updateThread);
    $("body").on("click", ".comment_section", save_to_storage);
    //$("#thread_submit_button").click(saveThread);
}
$(document).ready(setup);


