import React, { useContext, useState, useEffect, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FirebaseContext } from '../Firebase';
import MenuLinks from './menuLinks';
import { FiMenu } from 'react-icons/fi';

const Header = () => {
    const firebase = useContext(FirebaseContext);
    let navigate = useNavigate();
    const [user, setUser] = useState({userID: null, username: ""});
    const [showMenu, setShowMenu] = useState(false);

    useEffect(async () => {
        firebase.auth.onAuthStateChanged( async (user) => {
            if(user){
                let userDoc = await firebase.db.collection('users').doc(user.uid).get();
                let userID = userDoc.id;
                let userData = userDoc.data();
                userData.userID = userID;
                setUser(userData);
            }else{
                console.log("Deconnexion");
            }
        });
    }, []);

    const profile = user.userID !== null && (
        <div className='md:flex flex-col justify-center items-center basicText-white w-fit hidden'>
            <span onClick={() => setShowMenu(!showMenu)} className='font-bold cursor-pointer'>{user.username}</span>
        </div>
    )

    const disconnect = () => {
        console.log("Déconnexion");
        setShowMenu(false);
        setUser({userID: null, username: ""});
        navigate('/');
        firebase.signoutUser();
    }

    const profileLinks = showMenu && (
        <MenuLinks user={user} disconnect={disconnect} setShowMenu={setShowMenu} />
    )

    const disconnectedDisplay = user.userID === null && (
        <div className='md:flex flex-row justify-center items-center text-white w-fit hidden'>
            <Link className='basicText-white mx-1' to='/signup'>S'inscrire</Link>
            <Link className='basicText-white mx-1' to='/login'>Se connecter</Link>
        </div>
    )

    
    const burgerMenu = (
        <FiMenu className='md:hidden text-white cursor-pointer' onClick={() => setShowMenu(!showMenu)} >

        </FiMenu>
    )

    return (
        <Fragment>
            <div className='flex flex-row justify-around items-center sticky top-0 z-50 bg-slate-600 h-header w-full'>
                <div className='basicText-white font-PaytoneOne' >My Fit Coach</div>
                <ul className='md:flex flex-row justify-around items-center basicText-white hidden'>
                    <li className='m-2' ><Link to='/'>Accueil</Link></li>
                    <li className='m-2' ><Link to='/schedule' state={{userID: user.userID}}>Emploi du temps</Link></li>
                    <li className='m-2'><Link to='/workout' state={{userID: user.userID}}>Sport</Link></li>
                    <li className='m-2'><Link to='/nutrition' state={{userID: user.userID, mealID: null}}>Nutrition</Link></li>
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
