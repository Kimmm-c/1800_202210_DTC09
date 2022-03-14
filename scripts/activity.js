let activityID = localStorage.getItem('activityID');

function populateCard() {
    let featuredTab = document.getElementById("featured");

    if (featuredTab.getAttribute('selected') == 'false') return;

    let activityCardTemplate = document.getElementById("activityCardTemplate");
    let activityCardGroup = document.getElementById("activityCardGroup");
    
    db.collection('meditation').get()
        .then(allActivity => {
            allActivity.forEach(doc => {
                var activityName = doc.data().activity;
                var activityLength = doc.data().length;
                var songName = doc.data().song;
                let activityCard = activityCardTemplate.content.cloneNode(true);
                
                activityCard.querySelector('.cardTitle').innerHTML = activityName;
                activityCard.querySelector('.activityLength').innerHTML = activityLength;
                activityCard.querySelector('img').src = `https://picsum.photos/${getRandInt()}/200/`; //will change later
                activityCardGroup.appendChild(activityCard);
            })
        })
};


function getRandInt(min, max) {
    return Math.floor((Math.random() * max) + min);
};