import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <div className='flex flex-row justify-items-start items-center fixed top-0 z-50 bg-slate-600 h-10 w-full'>
            <div className='text-white font-bold m-8' >My Fit Coach</div>
            <ul className='flex flex-row justify-around items-center text-white m-80'>
                <li className='m-2' ><Link to='/'>Accueil</Link></li>
                <li className='m-2' ><Link to='/schedule'>Emploi du temps</Link></li>
                <li className='m-2'><Link to='/workout'>Sport</Link></li>
                <li className='m-2'><Link to='/nutrition/new'>Nutrition</Link></li>
            </ul>
        </div>
    )
}

export default Header;
