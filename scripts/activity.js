let activityName = localStorage.getItem('activityName');
let uid = localStorage.getItem('uid')


db.collection('meditation').where("activity", "==", activityName)
    .get()
    .then(queryActivity => {
        size = queryActivity.size;
        Activity = queryActivity.docs;

        var thisActivity = Activity[0].data();
        name = thisActivity.activity;
        document.getElementById("activityName").innerHTML = name;
    })
    .catch(e => console.log(e));


function populateSection() {
    let activityContainer = document.getElementById('activityCard');
    let activitySection = document.getElementById('activitySection');

    db.collection('meditation').where('activity', '==', activityName)
        .get()
        .then(allActivity => {
            allActivity.forEach(doc => {
                var songName = doc.data().songName;
                var activityID = doc.data().activityID;
                var description = doc.data().description;
                var url = doc.data().url;
                var bookmarked = doc.data().bookmarks.includes(uid)
                let activityCard = activitySection.content.cloneNode(true);
                activityCard.querySelector('.activitySong').innerHTML = songName
                activityCard.querySelector('.description').innerHTML = description
                activityCard.querySelector('.likeBtn').id = 'save-' + activityID
                activityCard.querySelector('.likeBtn').innerHTML = bookmarked ? '\u2665' : '\u2661' 
                activityCard.querySelector('.likeBtn').onclick = () => toggleBookmark(activityID)
                activityCard.querySelector('.arrowBtn').href = 'eachActivity.html?activity=' + songName + `&id=` + activityID
                activityContainer.appendChild(activityCard)
            })
        })        
};
 

function toggleBookmark(activityID) {
    let activityIDRef = db.collection("meditation").doc(activityID)
    activityIDRef.get().then(data => {
        if (!data.data().bookmarks.includes(uid)) saveBookmark(activityID)
        else deleteBookmark(activityID)
    })
}


function saveBookmark(activityID) {
    db.collection("meditation").doc(activityID).set({
            bookmarks: firebase.firestore.FieldValue.arrayUnion(uid)
        }, {
            merge: true
        })
        .then(function () {
            console.log(`bookmark ${activityID} added for user (${uid})`);
            var iconID = 'save-' + activityID;
            likeToggle(iconID, true)
        });
}


function deleteBookmark(activityID) {
    db.collection("meditation").doc(activityID).update({
        bookmarks: firebase.firestore.FieldValue.arrayRemove(uid)
    })
    .then(function () {
        console.log(`bookmark ${activityID} removed for user (${uid})`);
        var iconID = 'save-' + activityID;
        likeToggle(iconID, false)
    });
}


async function fetchQuote() {
    let response = await fetch(`https://mindfulness-quotes-free.p.rapidapi.com/random`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "mindfulness-quotes-free.p.rapidapi.com",
            "x-rapidapi-key": "9a86ba5d0dmsh79f6b6dfe64d36ep1f5b68jsn7bc272f83316"
        }
    });
    if (response.status !== 200) console.log(`Error fetching quotes API`, response.status);
    let data = await response.json()
    
    let quoteContent = document.getElementById('quoteContent')
    let quoteAuthor = document.getElementById('quoteAuthor')
    quoteContent.innerHTML = data.quote
    quoteAuthor.innerHTML = `— ${data.author}`
};


function createTitle() {
    const titles = [
        "Letting Go Of Stress",
        "Washing Your Hands",
        "Reset",
        "Breathing Through",
        "Concentrate",
        "Focus",
        "Clarity",
        "Breathe In, Breathe Out"
    ]
    var index = Math.floor(Math.random() * titles.length);
    let activityTitle = document.getElementById('title');
    activityTitle.innerHTML = titles[index];
};


function likeToggle(activityID, status) {
    const whiteHeart = '\u2661';
    const blackHeart = '\u2665';
    var button = document.getElementById(activityID);
    if (status === true) button.innerHTML = blackHeart
    else button.innerHTML = whiteHeart
}


populateSection();
createTitle();
//fetchQuote();