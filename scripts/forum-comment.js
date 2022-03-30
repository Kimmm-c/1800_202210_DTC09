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
db.collection("thread/" + threadID + "/comments").onSnapshot((snapshot) => {
    realtime_comment = snapshot.docChanges();
    realtime_comment.forEach(change => {
        if (change.type == 'added') {
            render_comments(change.doc.data(), change.doc.id);
        }
    })
})

function render_comments(data, data_id) {
    $("#comment_box").append(`<div class="comment_div"><b>${data.username}</b>
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
        })
    })
}

function setup() {
    $("#post_comment").click(add_comment);
}

$(document).ready(setup);

