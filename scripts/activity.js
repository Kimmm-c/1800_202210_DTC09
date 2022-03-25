let activityName = localStorage.getItem('activityName');

// Populates the title of the activity with the activity 
// with the name in the local storage
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
                let activityCard = activitySection.content.cloneNode(true);
                activityCard.querySelector('.likeBtn').setAttribute("id", activityID)
                activityCard.querySelector('.likeBtn').setAttribute("onclick", `likeToggle(${activityID})`)
                activityCard.querySelector('.activitySong').innerHTML = songName
                activityCard.querySelector('.description').innerHTML = description
                activityContainer.appendChild(activityCard)
            })
        })        
};
 

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


function likeToggle(activityID) {
    const whiteHeart = '\u2661';
    const blackHeart = '\u2665';
    var button = document.getElementById(activityID);
    
    console.log(button)

    if (button.innerHTML == whiteHeart) button.innerHTML = blackHeart
    else button.innerHTML = whiteHeart
}

populateSection();
fetchQuote();
createTitle();