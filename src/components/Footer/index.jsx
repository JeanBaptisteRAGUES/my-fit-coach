import React, { useContext, useEffect, useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { FirebaseContext } from '../Firebase';

const Footer = () => {
    const firebase = useContext(FirebaseContext);
    const [user, setUser] = useState({userID: null, username: ""});

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

    return (
    <div className=' flex flex-col justify-around items-center gap-5 w-full min-h-[30vh] bg-slate-600 py-5'>
        <div className='flex flex-col md:flex-row justify-around items-center gap-2 md:items-start w-full'>
            <div className='flexStart md:flexCenter w-[50%]' id="about">
                <ul className='flex flex-col justify-center items-start basicText-white'>
                    <li className='title-white'>À propos</li>
                    <li title="Description du site - Lien fictif" className=' hover:underline cursor-pointer' >Qui sommes-nous ?</li>
                    <li title="Foire aux questions - Lien fictif" className='hover:underline cursor-pointer' >F.A.Q</li>
                    <li title="Page de contacts - Lien fictif" className='hover:underline cursor-pointer'>Nous contacter</li>
                    <li title="Conditions générales d'utilisation - Lien fictif" className='hover:underline cursor-pointer'>Conditions Générales d'utilitation</li>
                </ul>
            </div>
            <div className='flexStart md:flexCenter w-[50%]' id="internal-links">
                <ul className='flex flex-col justify-center items-start basicText-white'>
                    <li className='title-white'>Liens</li>
                    <li className='hover:underline cursor-pointer' ><Link to='/'>Accueil</Link></li>
                    <li className='hover:underline cursor-pointer' ><Link to='/schedule' state={{userID: user.userID}}>Emploi du temps</Link></li>
                    <li className='hover:underline cursor-pointer'><Link to='/workout' state={{userID: user.userID}}>Sport</Link></li>
                    <li className='hover:underline cursor-pointer'><Link to='/exercice-menu' state={{userID: user.userID}}>-Exercices</Link></li>
                    <li className='hover:underline cursor-pointer'><Link to='/session-menu' state={{userID: user.userID}}>-Sessions</Link></li>
                    <li className='hover:underline cursor-pointer'><Link to='/nutrition' state={{userID: user.userID, mealID: null}}>Nutrition</Link></li>
                    <li className='hover:underline cursor-pointer'><Link to='/signup'>Inscription</Link></li>
                    <li className='hover:underline cursor-pointer'><Link to='/login'>Connexion</Link></li>
                </ul>
            </div>
            <div className='flexStart md:flexCenter w-[50%]' id="social">
                <span className='title-white'>Nous retrouver</span>
                <div title='Github - Code source' className=' flexStart md:flexCenter w-full title-white md:mt-5 cursor-pointer' id="social-medias">
                    <FaGithub onClick={() => window.location.replace("https://github.com/JeanBaptisteRAGUES/my-fit-coach")}/>
                </div>
            </div>
        </div>
        <span className='basicText-white'>© 2022 My Fit Coach - Tous droits réservés</span>
    </div>
    )
}

export default Footer;