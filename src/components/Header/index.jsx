import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FirebaseContext } from '../Firebase';

const Header = () => {
    const firebase = useContext(FirebaseContext);
    const [user, setUser] = useState(null);

    useEffect(async () => {
        firebase.auth.onAuthStateChanged( async (user) => {
            if(user){
                let userDoc = await firebase.db.collection('users').doc(user.uid).get();
                let userData = userDoc.data();
                setUser(userData);
            }else{
                console.log("Deconnexion");
            }
        });
    }, []);

    const disconnect = () => {
        console.log("Déconnexion");
        setUser(null);
        firebase.signoutUser();
    }

    const profile = user !== null && (
        <div className='flex flex-col justify-center items-center text-white w-fit'>
            <span className='font-bold'>{user.username}</span>
            <span className='cursor-pointer' onClick={() => disconnect()}>Déconnexion</span>
        </div>
    )

    const disconnectedDisplay = user === null && (
        <div className='flex flex-row justify-center items-center text-white w-fit'>
            <Link className='mx-1' to='/signup'>S'inscrire</Link>
            <Link className='mx-1' to='/login'>Se connecter</Link>
        </div>
    )

    return (
        <div className='flex flex-row justify-around items-center fixed top-0 z-50 bg-slate-600 h-10 w-full'>
            <div className='text-white font-bold' >My Fit Coach</div>
            <ul className='flex flex-row justify-around items-center text-white'>
                <li className='m-2' ><Link to='/'>Accueil</Link></li>
                {user !== null ? <li className='m-2' ><Link to='/schedule'>Emploi du temps</Link></li> : <Link className='m-2' to='/login'>Emploi du temps</Link>}
                {user !== null ? <li className='m-2'><Link to='/workout' >Sport</Link></li> : <Link className='m-2' to='/login'>Sport</Link>}
                {user !== null ? <li className='m-2'><Link to='/nutrition/new' state={{userID: user.userID}}>Nutrition</Link></li> : <Link className='m-2' to='/login'>Nutrition</Link>}
            </ul>
            {profile}
            {disconnectedDisplay}
        </div>
    )
}

export default Header;
