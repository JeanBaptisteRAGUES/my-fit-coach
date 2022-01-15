import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Fragment } from 'react/cjs/react.development';
import { FirebaseContext } from '../Firebase';
import MenuLinks from './menuLinks';
import { FiMenu } from 'react-icons/fi';

const Header = () => {
    const firebase = useContext(FirebaseContext);
    const [user, setUser] = useState(null);
    const [showMenu, setShowMenu] = useState(false);

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

    const profile = user !== null && (
        <div className='md:flex flex-col justify-center items-center text-white w-fit hidden'>
            <span onClick={() => setShowMenu(!showMenu)} className='font-bold cursor-pointer'>{user.username}</span>
        </div>
    )

    const disconnect = () => {
        console.log("Déconnexion");
        setUser(null);
        firebase.signoutUser();
    }

    const profileLinks = showMenu && (
        <MenuLinks user={user} disconnect={disconnect}/>
    )

    const disconnectedDisplay = user === null && (
        <div className='md:flex flex-row justify-center items-center text-white w-fit hidden'>
            <Link className='mx-1' to='/signup'>S'inscrire</Link>
            <Link className='mx-1' to='/login'>Se connecter</Link>
        </div>
    )

    const burgerMenu = (
        <FiMenu className='md:hidden text-white cursor-pointer' onClick={() => setShowMenu(!showMenu)} >

        </FiMenu>
    )

    return (
        <Fragment>
            <div className='flex flex-row justify-around items-center fixed top-0 z-50 bg-slate-600 min-h-10 w-full'>
                <div className='text-white font-bold' >My Fit Coach</div>
                <ul className='md:flex flex-row justify-around items-center text-white hidden'>
                    <li className='m-2' ><Link to='/'>Accueil</Link></li>
                    {user !== null ? <li className='m-2' ><Link to='/schedule'>Emploi du temps</Link></li> : <Link className='m-2' to='/login'>Emploi du temps</Link>}
                    {user !== null ? <li className='m-2'><Link to='/workout' >Sport</Link></li> : <Link className='m-2' to='/login'>Sport</Link>}
                    {user !== null ? <li className='m-2'><Link to='/nutrition/new' state={{userID: user.userID}}>Nutrition</Link></li> : <Link className='m-2' to='/login'>Nutrition</Link>}
                </ul>
                {profile}
                {burgerMenu}
                {disconnectedDisplay}
            </div>
            {profileLinks}
        </Fragment>
    )
}

export default Header;
