threadID = localStorage.getItem("threadID");
console.log(threadID);

db.collection('thread').doc(`${threadID}`).get().then((doc)=>{
    $(".thread_box").append(`<h3><b>${doc.data().title}</b></h3>
    <p>Last updated: ${(doc.data().last_updated).toDate()}</p>
    <p>${doc.data().content}</p>`)
    })

// db.collection("thread/" + threadID + "/comments").get().then((doc)=>{
//     doc.docs.forEach((comment)=>{
//         console.log(comment.data());
//     })
// })
db.collection("thread/" + threadID + "/comments").onSnapshot((snapshot)=>{
    realtime_comment = snapshot.docChanges();
    realtime_comment.forEach(change => {
        if(change.type == 'added') {
            render_comments(change.doc.data(), change.doc.id);
        }
    })
})

function render_comments(data, data_id){
    $("#comment_box").append(`<div>${data.content}</div>`)
}
function setup(){

}

$(document).ready(setup);

