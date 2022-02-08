import React, { useContext } from 'react'
import { Link } from 'react-router-dom';

const MenuLinks = ({user, disconnect, setShowMenu}) => {

    const userMenu = user !== null && (
        <div className='md:flex flex-col justify-center items-center gap-8 hidden'>
            <Link className='font-bold' to='/profile' onClick={() => setShowMenu(false)} state={user}>Mon compte</Link>
            <span className='cursor-pointer' onClick={() => disconnect()}>Déconnexion</span>
        </div>
    )

    const burgerMenu = (
        <ul className='flex flex-col justify-center items-center gap-8 md:hidden'>
            {user !== null ? <li><Link className='font-bold' to='/profile' onClick={() => setShowMenu(false)} state={user}>Mon compte</Link></li> : <Link to='/signup'>S'inscrire</Link>}
            {user === null ? <li><Link to='/login' onClick={() => setShowMenu(false)}>Se connecter</Link></li> : null}
            <li><Link to='/' onClick={() => setShowMenu(false)}>Accueil</Link></li>
            {user !== null ? <li><Link to='/schedule' onClick={() => setShowMenu(false)}>Emploi du temps</Link></li> : <Link to='/login' onClick={() => setShowMenu(false)}>Emploi du temps</Link>}
            {user !== null ? <li><Link to='/workout' onClick={() => setShowMenu(false)} >Sport</Link></li> : <Link to='/login' onClick={() => setShowMenu(false)}>Sport</Link>}
            {user !== null ? <li><Link to='/nutrition/new' onClick={() => setShowMenu(false)} state={{userID: user.userID}}>Nutrition</Link></li> : <Link to='/login' onClick={() => setShowMenu(false)}>Nutrition</Link>}
            {user !== null ? <li><span className='cursor-pointer' onClick={() => disconnect()}>Déconnexion</span></li> : null}
        </ul>
    )

    const disconnectedMenu = user === null && (
        <div className='md:flex flex-col justify-center items-center gap-8 hidden'>
            <Link to='/signup' onClick={() => setShowMenu(false)}>S'inscrire</Link>
            <Link to='/login' onClick={() => setShowMenu(false)}>Se connecter</Link>
        </div>
    )

    return (
        <div className='flex flex-row justify-center font-bold text-2xl items-center fixed top-0 z-40 text-white w-full min-h-screen backdrop-blur-md bg-slate-900/50 motion-safe:animate-fall'>
            {userMenu}
            {disconnectedMenu}
            {burgerMenu}
        </div>
    )
}

export default MenuLinks;
