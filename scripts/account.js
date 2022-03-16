function populateAccount() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("user").doc(user.uid);
            currentUser.get().then(userDoc => {
                $('#accountName').text(userDoc.data().name)
                $('#accountEmail').text(userDoc.data().email)
            })
        }
    })
}

populateAccount();