import app from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const config = {
    apiKey: "AIzaSyBC8bmwG6ZtFlmNW2aPCA26UzsPSgjrtQ8",
    authDomain: "my-fit-coach.firebaseapp.com",
    projectId: "my-fit-coach",
    storageBucket: "my-fit-coach.appspot.com",
    messagingSenderId: "492341611900",
    appId: "1:492341611900:web:9553b8d2bae73dc49ce8f9"
};

class Firebase {
    constructor(){
        app.initializeApp(config);
        this.auth = app.auth();
        this.db = app.firestore();
        this.firestore = app.firestore;
    }

    // Inscription
    signupUser = (email, password) => {
        return this.auth.createUserWithEmailAndPassword(email, password);
    }

    // Connexion
    loginUser = (email, password) => {
        return this.auth.signInWithEmailAndPassword(email, password);
    }

    // Deconnexion
    signoutUser = () => {
        return this.auth.signOut();
    }

    // Récupérer le mot de passe
    passwordReset = (email) => this.auth.sendPasswordResetEmail(email);

    // Créer un nouveau document dans users avec pour id l'uid généré automatiquement lors de l'authentification via Firebase
    user = (uid) => this.db.doc(`users/${uid}`);

    event = (eid) => this.db.doc(`events/${eid}`);

    meal = (mid) => this.db.doc(`meals/${mid}`);

    session = (sid) => this.db.doc(`sessions/${sid}`);

    usersCollection = () => this.db.collection('users');
}

export default Firebase;
