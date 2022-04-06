threadID = localStorage.getItem("threadID");
console.log(threadID);

db.collection('thread').doc(`${threadID}`).get().then((doc) => {
    $(".thread_box").append(`<h3><b>${doc.data().title}</b></h3>
    <p>Last updated: ${(doc.data().last_updated).toDate()}</p>
    <p>${doc.data().content}</p>`)
})

// db.collection("thread/" + threadID + "/comments").get().then((doc)=>{
//     doc.docs.forEach((comment)=>{
//         console.log(comment.data());
//     })
// })
db.collection("thread/" + threadID + "/comments").orderBy('last_updated').onSnapshot((snapshot) => {
    realtime_comment = snapshot.docChanges();
    realtime_comment.forEach(change => {
        if (change.type == 'added') {
            render_comments(change.doc.data(), change.doc.id);
        } else if (change.type == 'removed') {
            comment = document.getElementById(change.doc.id);
            comment.remove();
        } else {
            $(`#${change.doc.id}`).children("p").text(`${change.doc.data().content}`);
        }
    })
})

function render_comments(data, data_id) {
    $("#comment_box").prepend(`<div class="comment_div" id="${data_id}"><b>${data.username}</b>
    <p>${data.content}</p></div>`)
}

function add_comment() {
    userID = null;
    firebase.auth().onAuthStateChanged((user) => {
        //console.log(user.uid);
        userID = user.uid;
        db.collection('user').doc(`${user.uid}`).get().then((profile) => {
            //console.log(profile.data().name);
            username = profile.data().name;
            userPic = profile.data().profilePic;

            db.collection(`thread/${threadID}/comments`).add({
                userid: userID,
                username: username,
                userpic: userPic,
                content: $("#comment_content").val(),
                last_updated: firebase.firestore.FieldValue.serverTimestamp()
            })
            $("#comment_content").val('');
            $("#post_comment").attr('disabled', true);
        })
    })
}

function display_options() {
    //console.log('testing');
    commentID = $(this).attr("id");
    console.log(commentID);
    firebase.auth().onAuthStateChanged((user) => {
        userID = user.uid;
        db.collection(`thread/${threadID}/comments`).doc(commentID).get().then((doc) => {
            comment_owner_id = doc.data().userid;
            if (userID == comment_owner_id) {
                $("#comment_options").html(`<div id="owner_comment_options" data="${commentID}"><span class="edit_comment">Edit</span><hr>
                <span class="delete_comment">Delete</span><hr>
                <span class="cancel_comment_option">Cancel</span>`)
            } else {
                $("#comment_options").append(`<div id="reader_comment_options"><span>Report</span><hr>
                <span class="cancel_comment_option">Cancel</span>`)
            }
        })
    })

}

function delete_comment() {
    //console.log('testing');
    commentID = $(this).parent().attr("data");
    db.collection(`thread/${threadID}/comments`).doc(commentID).delete();
    $("#comment_options").empty();
}

function edit_comment() {
    //console.log('testing');
    commentID = $(this).parent().attr("data");
    //x = $(`#${commentID}`).children("p").text();
    //console.log(x);
    old_comment = $(`#${commentID}`).children("p").text();
    console.log(old_comment);
    $("#comment_options").empty();
    $("#comment_edit_form").html(`<div id="comment_edit_box"><textarea id="update_comment">${old_comment}</textarea><br>
    <button class="save_edit_comment" data="${commentID}">Update</button>
    <button class="cancel_edit_comment" >Cancel</button></div>`)
}

function update_comment() {
    commentID = $(this).attr("data");
    //console.log(commentID);
    new_comment = $(this).siblings("textarea").val();
    //console.log(new_comment);
    db.collection(`thread/${threadID}/comments`).doc(commentID).update({
        content: new_comment,
        last_updated: firebase.firestore.FieldValue.serverTimestamp()
    })
    $("#comment_edit_form").empty();
}

function setup() {
    $("#post_comment").click(add_comment);
    $("body").on("click", ".comment_div", display_options)
    $("body").on("click", ".cancel_comment_option", () => {
        $("#comment_options").empty();
    })
    $("body").on("click", ".delete_comment", delete_comment);
    $("body").on("click", ".edit_comment", edit_comment);
    $("body").on("click", ".cancel_edit_comment", () => {
        $("#comment_edit_form").empty();
    })
    $("body").on("click", ".save_edit_comment", update_comment);
    $("#comment_content").on("input change", () => {
        if ($(this).val != '') {
            $("#post_comment").attr('disabled', false);
        } else {
            $("#post_comment").attr('disabled', true);
        }
    })
}

$(document).ready(setup);

