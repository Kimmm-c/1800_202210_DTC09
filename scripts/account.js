function populateAccount() {
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
    if (uploader.files && uploader.files[0]) {
        $('#pfp-image').attr('src', window.URL.createObjectURL(uploader.files[0]))
        console.log($('#pfp-image').attr('src'))
    }
}


function editInfo() {
    let uid = localStorage.getItem('uid');
    db.collection("user").doc(uid).update({
        name: $('input[name="name"]').val(),   
        birthdate: $('#birthday').val(),
        gender: $('input[name="gender"]:checked').val(),
        country:  $('#country').find(':selected').text(),
        profilePic: null,
    })
    .then(() => {
      console.log('Successfully added additional info to firebase');
      document.getElementById('result').innerHTML = 'Saved!'
      
    })
    .catch(e => {
        console.log(e)
        document.getElementById('result').innerHTML = 'Error!'
    })
}


async function populateMeditation() {
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


$('#pfp-image').click(() => {
    $('#img-upload').click()
});

$("#img-upload").change(function () {
    previewer(this);
});


populateAccount();
populateMeditation();
populateForum();