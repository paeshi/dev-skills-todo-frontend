// import firebase core module
import firebase from 'firebase/app'
// import the auth package from firebase
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyACEc0bQL_1JeCc_u2q71DnZiwA9GRzMLc",
    authDomain: "react-dev-skills-e1389.firebaseapp.com",
    projectId: "react-dev-skills-e1389",
    storageBucket: "react-dev-skills-e1389.appspot.com",
    messagingSenderId: "136534180108",
    appId: "1:136534180108:web:417ab44314c448c54f0929"
  };


// initialize the firebase app 
firebase.initializeApp(firebaseConfig);
// set up a firebase provider(s)
const provider = new firebase.auth.GoogleAuthProvider();
// configure the firebase provider(s)
const auth = firebase.auth();
// set up auth actions ie. login, logout
function login() {
auth.signInWithPopup(provider);
}
function logout() {
auth.signOut();
}
// export our actions
export {
    auth,
    login,
    logout
}