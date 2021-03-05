import * as firebase from "firebase"
import "firebase/firestore"
import "firebase/auth"

firebase.initializeApp ({
    apiKey: "AIzaSyBfUqUp1BNH_LWj-tAc1ZEK0IEEFoNYMrI",
    authDomain: "locals-expo-auth.firebaseapp.com",
    databaseURL: "https://locals-expo-auth.firebaseio.com",
    projectId: "locals-expo-auth",
    storageBucket: "locals-expo-auth.appspot.com",
    messagingSenderId: "435511933422",
    appId: "1:435511933422:web:d9a617393070aafe6136ff",
    measurementId: "G-16739ESJX7"
});



const db = firebase.firestore();
const auth = firebase.auth();

export { db, auth }