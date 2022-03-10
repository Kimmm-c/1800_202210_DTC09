// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle. 
      var user = authResult.user;                            // get the user object from the Firebase authentication database
      if (authResult.additionalUserInfo.isNewUser) {         //if new user
        db.collection("user").doc(user.uid).set({         //write to firestore. We are using the UID for the ID in users collection
          name: user.displayName,                    //"users" collection
          email: user.email                          //with authenticated user's ID (user.uid)
        }).then(function () {
          console.log("New user added to firestore");
          window.location.assign("main.html");       //re-direct to main.html after signup
        })
          .catch(function (error) {
            console.log("Error adding new user: " + error);
          });
      } else {
        return true;
      }
      return false;
    },
  },
  uiShown: function () {
    // The widget is rendered.
    // Hide the loader.
    document.getElementById('loader').style.display = 'none';
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',
  signInSuccessUrl: 'main.html',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    //   firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    //   firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    //   firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    //   firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    //   firebase.auth.PhoneAuthProvider.PROVIDER_ID
  ],
  // Terms of service url.
  tosUrl: '<your-tos-url>',
  // Privacy policy url.
  privacyPolicyUrl: '<your-privacy-policy-url>'
};

ui.start('#firebaseui-auth-container', uiConfig);

var firebaseConfig = {
  apiKey: "AIzaSyCFI7f6upIpgTyBbMLqeyiWOUrG5GNvzLE",
  authDomain: "friend-comp-1800.firebaseapp.com",
  projectId: "friend-comp-1800",
  storageBucket: "friend-comp-1800.appspot.com",
  messagingSenderId: "316008911447",
  appId: "1:316008911447:web:1bc58999f78082b349c912",
  measurementId: "G-30X5HEPPK8"
};

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();