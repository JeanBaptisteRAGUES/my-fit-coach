import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { useEffect } from 'react/cjs/react.development';

const MenuLinks = ({user, disconnect}) => {

    const userMenu = user !== null && (
        <div className='md:flex flex-col justify-center items-center gap-8 hidden'>
            <Link className='font-bold' to='/profile' state={user}>Mon compte</Link>
            <span className='cursor-pointer' onClick={() => disconnect()}>Déconnexion</span>
        </div>
    )

    const burgerMenu = (
        <ul className='flex flex-col justify-center items-center gap-8 md:hidden'>
            {user !== null ? <li><Link className='font-bold' to='/profile' state={user}>Mon compte</Link></li> : <Link to='/signup'>S'inscrire</Link>}
            {user === null ? <li><Link to='/login'>Se connecter</Link></li> : null}
            <li><Link to='/'>Accueil</Link></li>
            {user !== null ? <li><Link to='/schedule'>Emploi du temps</Link></li> : <Link to='/login'>Emploi du temps</Link>}
            {user !== null ? <li><Link to='/workout' >Sport</Link></li> : <Link to='/login'>Sport</Link>}
            {user !== null ? <li><Link to='/nutrition/new' state={{userID: user.userID}}>Nutrition</Link></li> : <Link to='/login'>Nutrition</Link>}
            {user !== null ? <li><span className='cursor-pointer' onClick={() => disconnect()}>Déconnexion</span></li> : null}
        </ul>
    )

    const disconnectedMenu = user === null && (
        <div className='md:flex flex-col justify-center items-center gap-8 hidden'>
            <Link to='/signup'>S'inscrire</Link>
            <Link to='/login'>Se connecter</Link>
        </div>
    )

    return (
        <div className='flex flex-row justify-center font-bold text-2xl items-center fixed top-0 z-10 text-white w-full min-h-screen bg-slate-900 opacity-95 motion-safe:animate-fall'>
            {userMenu}
            {disconnectedMenu}
            {burgerMenu}
        </div>
    )
}

export default MenuLinks;
