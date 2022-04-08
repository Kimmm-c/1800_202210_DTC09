function populateAccount() {
    // On logged in user, populates their info to each field on the accounts container
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("user").doc(user.uid);
            currentUser.get().then(userDoc => {
                $('#accountName').attr("value", userDoc.data().name)
                $('#accountEmail').attr("value", userDoc.data().email)
                $(`#accountGender[value="${userDoc.data().gender}"]`).prop('checked', 'checked')
                $('#birthday').attr('value', userDoc.data().birthdate)
                $(`option[value="${userDoc.data().country}"]`).prop('selected', 'selected')
            })
        }
    })
}


function previewer(uploader) {
    // gives user the option to upload their on profile picture to be displayed
    if (uploader.files && uploader.files[0]) {
        $('#pfp-image').attr('src', window.URL.createObjectURL(uploader.files[0]))
        console.log($('#pfp-image').attr('src'))
    }
}


function editInfo() {
    // with the UID, the values for each field will be updated to the firebase
    let uid = localStorage.getItem('uid');
    db.collection("user").doc(uid).update({
        name: $('input[name="name"]').val(),   
        birthdate: $('#birthday').val(),
        gender: $('input[name="gender"]:checked').val(),
        country:  $('#country').find(':selected').text(),
        profilePic: null,
    })
    .then(() => { // Successful update to firebase will print Saved! beside the save button
      console.log('Successfully added additional info to firebase');
      document.getElementById('result').innerHTML = 'Saved!'
      
    })
    .catch(e => { // Error updating to firebase will produce an error message
        console.log(e)
        document.getElementById('result').innerHTML = 'Error!'
    })
}


async function populateMeditation() {
    // Dynamically populates the meditation container from the firebase meditation collection by current UID
    let uid = localStorage.getItem('uid')
    let meditationTemplate = document.getElementById("meditation-template");
    let meditationCardGroup = document.getElementById("meditation-container");
    let savedData = await db.collection('meditation').get().then()

    savedData.forEach(doc => {
        if (!doc.data().bookmarks.includes(uid)) return;
        let meditationCard = meditationTemplate.content.cloneNode(true);
        meditationCard.querySelector('.cardTitle').innerHTML = doc.data().songName;  
        meditationCard.querySelector('.cardTitle').href = `../../html/meditation/eachActivity.html?activity=${doc.data().songName}&id=${doc.data().activityID}`
        meditationCard.querySelector('.activityLength').innerHTML = doc.data().description;
        meditationCardGroup.appendChild(meditationCard);
    })
}


async function populateForum() {
    // Dynamically populates the Journal container from the firebase Journal collection by current UID
    let uid = localStorage.getItem('uid')
    let forumTemplate = document.getElementById("forum-template");
    let forumCardGroup = document.getElementById("forum-container");
    let savedData = await db.collection('journals').get().then()

    savedData.forEach(doc => {
        if (doc.data().userID !== uid) return;
        let forumCard = forumTemplate.content.cloneNode(true);
        forumCard.querySelector('.cardTitle').innerHTML = doc.data().title
        forumCard.querySelector('.updated').innerHTML = doc.data().last_updated.toDate()
        forumCard.querySelector('.journal-content').innerHTML = doc.data().content
        forumCardGroup.appendChild(forumCard);
    })
}


async function populateMood() {
    // Dynamically populates the moodtracker container from the firebase collection 
    // by current UID's dailymood subcollection
    let uid = localStorage.getItem('uid')
    let moodTemplate = document.getElementById("mood-template");
    let moodCardGroup = document.getElementById("mood-container");
    let savedData = await db.collection('user').doc(uid).collection('dailymood').get()
    savedData.forEach(doc => {
        let moodCard = moodTemplate.content.cloneNode(true)
        moodCard.querySelector('.cardTitle').innerHTML = doc.data().question
        moodCard.querySelector('.mood-updated').innerHTML = doc.data().date
        moodCard.querySelector('.mood-emotion').innerHTML = doc.data().emotion
        moodCard.querySelector('.mood-response').innerHTML = doc.data().response
        moodCardGroup.appendChild(moodCard)
    })
}

// when the id pfp-image is clicked, it will invoke the id of img-upload click
$('#pfp-image').click(() => {
    $('#img-upload').click()
});

// will invoke the previewer function on any change to the id img-upload
$("#img-upload").change(function () {
    previewer(this);
});


populateAccount();
populateMeditation();
populateForum();
populateMood();