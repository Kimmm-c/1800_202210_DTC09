// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      var user = authResult.user;                            
      if (authResult.additionalUserInfo.isNewUser) {         
        db.collection("user").doc(user.uid).set({        
          name: user.displayName,                   
          email: user.email                            
        }).then(function () { 
          // if it's a new user, it will invoke the additional information function
          console.log("New user added to firestore");
          setUserID(user.uid);
          hideFireAuth();    
        })
          .catch(function (error) {
            console.log("Error adding new user: " + error);
          });
      } else {
        setUserID(user.uid)
        return true;
      }
      return false;
    },
  },
  uiShown: function () {
    document.getElementById('loader').style.display = 'none';
  },
  signInFlow: 'popup',
  signInSuccessUrl: 'main.html',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
  // Terms of service url.
  tosUrl: '<your-tos-url>',
  // Privacy policy url.
  privacyPolicyUrl: '<your-privacy-policy-url>'
};

function hideFireAuth() {
    // Hides the current fireauth container
    // toggles on the additional sign up form container
    $('#firebaseui-auth-container').toggle()
    $('#signup-form').toggle()
}

function setUserID(element) {
  // stores uid to localstorage
  localStorage.setItem('uid', element)
}

function saveInfo() {
    // pushes the values of the additional sign up form's 
    // values into the firebase user collection connected to
    // the uid
    let uid = localStorage.getItem('uid');
    db.collection("user").doc(uid).update({   
        birthdate: $('#birthday').val(),
        gender: $('input[name="gender"]:checked').val(),
        country:  $('#country').find(':selected').text(),
        profilePic: null,
    })
    .then(() => {
      console.log('Successfully added additional info to firebase');
      window.location.assign('main.html');
    })
    .catch(e => console.log(e))
}

ui.start('#firebaseui-auth-container', uiConfig);