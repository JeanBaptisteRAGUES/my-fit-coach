import React, { useContext } from 'react'
import { Link } from 'react-router-dom';

const MenuLinks = ({user, disconnect, setShowMenu}) => {

    console.log(user);

    const connectedDesktopLinks = user !== null && (
        <div className='md:flex flex-col justify-center items-center gap-8 hidden'>
            <Link className='font-bold' to='/profile' onClick={() => setShowMenu(false)} state={user}>Mon compte</Link>
            <span className='cursor-pointer' onClick={() => disconnect()}>Déconnexion</span>
        </div>
    )

    const disconnectedDesktopLinks = user.userID === null && (
        <div className='md:flex flex-col justify-center items-center gap-8 hidden'>
            <Link to='/signup' onClick={() => setShowMenu(false)}>S'inscrire</Link>
            <Link to='/login' onClick={() => setShowMenu(false)}>Se connecter</Link>
        </div>
    )

    const connectedMobileLinks = user.userID !== null && (
        <ul className='flex flex-col justify-center items-center gap-8 md:hidden'>
            <li><Link className='font-bold' to='/profile' onClick={() => setShowMenu(false)} state={user}>Mon compte</Link></li>
            <li><Link to='/' onClick={() => setShowMenu(false)}>Accueil</Link></li>
            <li><Link to='/schedule' state={{userID: user.userID}} onClick={() => setShowMenu(false)}>Emploi du temps</Link></li>
            <li><Link to='/workout' state={{userID: user.userID}} onClick={() => setShowMenu(false)} >Sport</Link></li>
            <li><Link to='/nutrition' state={{userID: user.userID, mealID: null}} onClick={() => setShowMenu(false)} state={{userID: user.userID}}>Nutrition</Link></li>
            <li><span className='cursor-pointer' onClick={() => disconnect()}>Déconnexion</span></li>
        </ul>
    )

    const disconnectedMobileLinks = user.userID === null && (
        <ul className='flex flex-col justify-center items-center gap-8 md:hidden'>
            <li><Link to='/login' onClick={() => setShowMenu(false)}>Se connecter</Link></li>
            <li><Link to='/signup' onClick={() => setShowMenu(false)}>S'inscrire</Link></li>
        </ul>
    )

    return (
        <div className='flex flex-row justify-center font-bold text-2xl items-center fixed top-0 z-40 text-white w-full min-h-screen backdrop-blur-md bg-slate-900/50 motion-safe:animate-fall'>
            {connectedDesktopLinks}
            {disconnectedDesktopLinks}
            {connectedMobileLinks}
            {disconnectedMobileLinks}
        </div>
    )
}

export default MenuLinks;
