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

var loadFile = function (event) {
    var image = document.getElementById("output");
    image.src = URL.createObjectURL(event.target.files[0]);
};

  
populateAccount();

