function populateRecent() {
    let recentTab = document.getElementById('recent');
    
    if (recentTab.getAttribute('selected') == 'false') return;

    let activityCardTemplate = document.getElementById("activityCardTemplate");
    let activityCardGroup = document.getElementById("activityCardGroup");

    let activityCard = activityCardTemplate.content.cloneNode(true);
    
    activityCard.querySelector('.cardTitle').innerHTML = 'Hello';  
    activityCard.querySelector('.activityLength').innerHTML = 'Gang';
    activityCard.querySelector('img').src = `https://picsum.photos/${getRandInt(200, 299)}/200/`; //will change later
    activityCardGroup.appendChild(activityCard);
};


function populateFeatured() {
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
    localStorage.setItem('activityID', element)
}

function getRandInt(min, max) {
    return Math.floor((Math.random() * max) + min);
};


function clickTab() {
    let recentTab = document.getElementById('recent');
    let featuredTab = document.getElementById("featured");

    recentTab.addEventListener("click", () => {
        featuredTab.className = 'buttonInactive'
        recentTab.className = 'buttonActive'
        featuredTab.setAttribute('selected', 'false')
        recentTab.setAttribute('selected', 'true')
    });

    featuredTab.addEventListener("click", () => {
        featuredTab.className = 'buttonActive'
        recentTab.className = 'buttonInactive'
        featuredTab.setAttribute('selected', 'true')
        recentTab.setAttribute('selected', 'false')
    });
};



clickTab();
populateFeatured();