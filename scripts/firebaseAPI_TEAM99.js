//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
const firebaseConfig = {
    apiKey: "AIzaSyCFI7f6upIpgTyBbMLqeyiWOUrG5GNvzLE",
    authDomain: "friend-comp-1800.firebaseapp.com",
    projectId: "friend-comp-1800",
    storageBucket: "friend-comp-1800.appspot.com",
    messagingSenderId: "316008911447",
    appId: "1:316008911447:web:1bc58999f78082b349c912",
    measurementId: "G-30X5HEPPK8",
  };
  
//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();