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
$('#pfp-image').click(() => {
    $('#img-upload').click()
});

$("#img-upload").change(function () {
    previewer(this);
});

populateAccount();
