import Firebase from 'firebase'

const db = Firebase.initializeApp({
    apiKey: "AIzaSyDAE4ZdR9N8Ep5gY9qSGZvIsab_xaZ4M-c",
    authDomain: "away-from-life-3bb5b.firebaseapp.com",
    databaseURL: "https://away-from-life-3bb5b.firebaseio.com",
    projectId: "away-from-life-3bb5b",
    storageBucket: "",
    messagingSenderId: "175709487980"
  }).database();

  export {db};