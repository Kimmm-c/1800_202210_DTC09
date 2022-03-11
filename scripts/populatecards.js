function populateCardsDynamically() {
    let medidateCardTemplate = document.getElementById("medidateCardTemplate");
    let meditateCardGroup = document.getElementById("meditateCardGroup");
    
    db.collection('meditation').get()
        .then(allActivity => {
            allActivity.forEach(doc => {
                var activityName = doc.data().activity;
                var activityLength = doc.data().length;
                var songName = doc.data().song;
                let meditateCard = medidateCardTemplate.content.cloneNode(true);
                
                meditateCard.querySelector('.card-title').innerHTML = activityName;
                meditateCard.querySelector('.card-length').innerHTML = activityLength;
                meditateCard.querySelector('a').onclick = () => songName;
                meditateCard.querySelector('img').src = `https://picsum.photos/id/${getRandInt()}/50/50`; //will change later
                meditateCardGroup.appendChild(meditateCard);
            })
        })
}


function getRandInt() {
    return Math.floor((Math.random() * 999) + 1);
}

populateCardsDynamically();