let uid = localStorage.getItem('uid')


async function populateRecent() {
    // Hidden by default
    // Populates the user's bookmarked activities by
    // pulling from the firebase collection
    let recentTab = document.getElementById('recent');
    if (recentTab.className == 'buttonInactive') return;

    let activityCardTemplate = document.getElementById("activityCardTemplate");
    let activityCardGroup = document.getElementById("activityCardGroup");
    let savedActivity = await db.collection('meditation').get().then()
    
    savedActivity.forEach(data => {
        if (!data.data().bookmarks.includes(uid)) return;
        else {
            let activityCard = activityCardTemplate.content.cloneNode(true);
            activityCard.querySelector('.cardTitle').innerHTML = data.data().songName;  
            activityCard.querySelector('.cardTitle').onclick = () => console.log(data.data().songName)
            activityCard.querySelector('.activityLength').innerHTML = data.data().description;
            activityCard.querySelector('img').src = `https://picsum.photos/${getRandInt(200, 299)}/200/`;
            activityCardGroup.appendChild(activityCard);
        }
    })
};


function populateFeatured() {
    // Shown by default
    // Populates the three activities that the user can
    // click either 3 to navigate to the activity's list of songs
    let activityCardTemplate = document.getElementById("activityCardTemplate");
    let activityCardGroup = document.getElementById("activityCardGroup");

    const activities = ['Breathe', 'Sleep', 'Relax']
    activities.forEach(element => {
        let activityCard = activityCardTemplate.content.cloneNode(true);
        activityCard.querySelector('.cardTitle').innerHTML = element;
        activityCard.querySelector('button').onclick = () => setActivityData(element);
        activityCard.querySelector('.activityLength').innerHTML = `${getRandInt(5, 10)} - ${getRandInt(10, 20)} mins`;
        activityCard.querySelector('img').src = `https://picsum.photos/${getRandInt(200, 299)}/200/`; //will change later
        activityCardGroup.appendChild(activityCard);
    })
}


function setActivityData(element) {
    // stores the activityName to local storage
    localStorage.setItem('activityName', element)
}


function getRandInt(min, max) {
    // general random int function
    return Math.floor((Math.random() * max) + min);
};


function clickTab() {
    // Onclick will toggle between the recent and featured container
    let recentTab = document.getElementById('recent');
    let featuredTab = document.getElementById("featured");

    recentTab.addEventListener("click", () => {
        if (recentTab.className === 'buttonActive') return
        featuredTab.className = 'buttonInactive'
        recentTab.className = 'buttonActive'
        $('#activityCardGroup').empty();
        populateRecent();
    });

    featuredTab.addEventListener("click", () => {
        if (featuredTab.className === 'buttonActive') return
        featuredTab.className = 'buttonActive'
        recentTab.className = 'buttonInactive'
        $('#activityCardGroup').empty()
        populateFeatured();
    });
};


clickTab();
populateFeatured();
populateRecent();