import app from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const config = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY ,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
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

    exercice = (exid) => this.db.doc(`exercices/${exid}`);

    training = (tid) => this.db.doc(`trainings/${tid}`);

    exerciceTrainings = (eid) => this.db.collection('trainings').where("exerciceID", "==", eid);

    usersCollection = () => this.db.collection('users');

    userExercices = (uid) => this.db.collection('exercices').where("userID", "==", uid);

    userSessions = (uid) => this.db.collection('sessions').where("userID", "==", uid);

    userMeals = (uid) => this.db.collection('meals').where("userID", "==", uid);

    userEvents = (uid) => this.db.collection('events').where("userID", "==", uid);
}

export default Firebase;
