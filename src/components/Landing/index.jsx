import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import {FirebaseContext} from '../Firebase';

const Landing = () => {
    const firebase = useContext(FirebaseContext);
    const [username, setUserName] = useState('');
    const [user, setUser] = useState(null);

    const disconnect = () => {
        console.log("Déconnexion");
        firebase.signoutUser();
    }

    /*
    useEffect(() => {
        if(!connected){
            console.log("Déconnexion");
            firebase.signoutUser();
        }
    }, [connected, firebase])
    */
    

    useEffect(async () => {
        firebase.auth.onAuthStateChanged( async (user) => {
            if(user){
                let userDoc = await firebase.db.collection('users').doc(user.uid).get();
                let userData = userDoc.data();
                console.log("Username : " + JSON.stringify(user.displayName));
                setUserName(user.displayName); //Can't perform a react state update on an unmounted component -> useAsync Hook + async/await ?
                setUser(userData);
            }else{
                console.log("Deconnexion");
                setUserName('');
            }
        });
    }, []);

    const disconnectedDisplay = username === '' && (
        <div>
            <Link to='/signup'>S'inscrire</Link><br/>
            <Link to='/login'>Se connecter</Link>
        </div>
    )

    const connectedDisplay = username !== '' && (
        <div>
            <span>Bonjour {username}</span><br/>
            <Link to='/schedule'>Emploi du temps</Link><br/>
            <Link to='/workout'>Sport</Link><br/>
            <Link to='/nutrition/new'>Nutrition</Link><br/>
            <Link to='/test' state={{user: JSON.stringify(user)}} >Test</Link><br/>
            <span onClick={() => disconnect()}>Se déconnecter</span>
        </div>
    )

    return (
        <div>
            Page d'accueil :<br/>
            {disconnectedDisplay}
            {connectedDisplay}
        </div>
    )
}

export default Landing;
