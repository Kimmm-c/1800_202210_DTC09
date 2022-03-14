function populateFeatured() {
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

function populateRecent() {
    let activityCardTemplate = document.getElementById("activityCardTemplate");
    let activityCardGroup = document.getElementById("activityCardGroup");

    let activityCard = activityCardTemplate.content.cloneNode(true);
    activityCard.querySelector('.cardTitle').innerHTML = 'Hello';  
}

function getRandInt() {
    return Math.floor((Math.random() * 299) + 200);
};

function checkTab() {
    let recentTab = document.getElementById("recent");
    let featuredTab = document.getElementById("featured");

    if (featuredTab.getAttribute('selected') == 'true') populateFeatured();
    else populateRecent();
};

function clickTab() {
    let recentTab = document.getElementById('recent');
    let featuredTab = document.getElementById("featured");

    recentTab.addEventListener("click", () => {
        recentTab.setAttribute('selected', 'true')
        featuredTab.setAttribute('selected', 'false')
        featuredTab.className = 'buttonInactive'
        recentTab.className = 'buttonActive'
        return;
    });

    featuredTab.addEventListener("click", () => {
        featuredTab.setAttribute('selected', 'true')
        recentTab.setAttribute('selected', 'false')
        featuredTab.className = 'buttonActive'
        recentTab.className = 'buttonInactive'
        return;
    });
};

clickTab();
checkTab();