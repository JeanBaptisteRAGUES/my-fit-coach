import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {FirebaseContext} from '../Firebase';
//import './signup.css';

const Signup = () => {
    const firebase = useContext(FirebaseContext);
    let navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [birth, setBirth] = useState("");
    const [height, setHeight] = useState(0);
    const [weight, setWeight] = useState(0);
    const [gender, setGender] = useState("");
    const [goal, setGoal] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState('');

    const createNewUser = (authUser, userData) => {
        const formatedDate = moment(Date.now()).format('MMMM Do YYYY hh:mm a');
        userData.weightHistory = JSON.stringify([[weight, formatedDate]]);
        userData.registrationDate = formatedDate;
        return firebase.user(authUser.user.uid).set(userData);
    }

    const addDisplayNameToCurrentUser = () => {
        firebase.auth.currentUser.updateProfile({
            displayName: username
        });
    }

    const handleSubmit = e => {
        e.preventDefault();
        firebase.signupUser(email, password)
        .then((authUser) => {
            createNewUser(authUser, {username, email, birth, height, weight, gender, goal});
        })
        .then(() => {
            navigate('/');
            addDisplayNameToCurrentUser();
        })
        .catch(error => {
            setError(error);
        });
    }

    //gestion erreurs
    const errorMsg = error !== '' && <div className="text-red-600">{error.message}</div>;

    const formPseudo = (
        <div className="w-2/3">
            <label htmlFor="username">Pseudo :</label><br/>
            <input 
                className='input'
                onChange={(e) => setUsername(e.target.value)} 
                value={username} 
                type="text" 
                id="username" 
                autoComplete="off" 
                required
                placeholder="toto31" 
            />
        </div>
    )

    const formEmail = (
        <div className="w-2/3">
            <label htmlFor="email">Email :</label><br/>
            <input 
                className='input'
                onChange={(e) => setEmail(e.target.value)} 
                value={email} 
                type="email" 
                id="email" 
                autoComplete="off" 
                required 
                placeholder="toto@exemple.com"
            />
        </div>
    )

    //remplacer par date de naissance
    const formBirth = (
        <div className="w-2/3">
            <label htmlFor="birth">Date de naissance :</label><br/>
            <input 
                className='input'
                onChange={(e) => setBirth(e.target.value)} 
                value={birth} 
                type="date" 
                id="birth" 
                autoComplete="off" 
                required
            />
        </div>
    )

    const formHeight = (
        <div className="w-2/3">
            <label htmlFor="height">Taille (en cm) :</label><br/>
            <input 
                className='input'
                onChange={(e) => setHeight(e.target.value)} 
                value={height} 
                type="number" 
                id="height" 
                autoComplete="off" 
                required 
                placeholder="175"
            />
        </div>
    )

    const formWeight = (
        <div className="w-2/3">
            <label htmlFor="weight">Poids (en kg) :</label><br/>
            <input 
                className='input'
                onChange={(e) => setWeight(e.target.value)} 
                value={weight} 
                type="number" 
                id="weight" 
                autoComplete="off" 
                required 
                placeholder="70"
            />
        </div>
    )

    const formGender = (
        <div className="w-2/3">
            <label htmlFor="gender">Sexe :</label><br/>
            <select className='input' id="gender" name="gender" onChange={(e) => setGender(e.target.value)} value={gender}>
                <option value="">Précisez votre sexe</option>
                <option value="male">Homme</option>
                <option value="female">Femme</option>
            </select>
        </div>
    )

    const formGoal = (
        <div className='w-2/3'>
            <label htmlFor="goal">Objectif :</label><br/>
            <select id='goal' onChange={(e) => setGoal(e.target.value)}>
                <option value="">--Choisissez une option--</option>
                <option value="maintain">Maintenir son poids</option>
                <option value="lose">Perdre du gras</option>
                <option value="gain">Gagner du muscle</option>
            </select>
        </div>
    )

    const formPassword = (
        <div className="min-w-2/3">
            <label htmlFor="password">Mot de passe :</label><br/>
            <input 
                className='input'
                onChange={(e) => setPassword(e.target.value)} 
                value={password} 
                type="password" 
                id="password" 
                autoComplete="off" 
                required 
                placeholder="6 lettres/chiffres minimum"
            />
        </div>
    )

    const formPasswordConfirm = (
        <div className="min-w-2/3">
            <label htmlFor="confirmPassword">Confirmez le mot de passe :</label><br/>
            <input 
                className='input'
                onChange={(e) => setConfirmPassword(e.target.value)} 
                value={confirmPassword} 
                type="password" 
                id="confirmPassword" 
                autoComplete="off" 
                required 
                placeholder="Confirmation mot de passe"
            />
        </div>
    )

    const formSignupBtn = username === '' || email === '' || birth === '' || height === 0 || weight === 0 ||
     gender === '' || goal === '' || password === '' || password !== confirmPassword
    ? <button disabled className="btn-primary opacity-50">Inscription</button> : <button className="btn-primary">Inscription</button>

    const signupForm = (
        <form onSubmit={handleSubmit} className="w-full">
            {formPseudo}
            {formEmail}
            {formBirth}
            {formHeight}
            {formWeight}
            {formGender}
            {formGoal}
            {formPassword}
            {formPasswordConfirm}
            <div className='flex flex-col justify-center items-center my-2'>
                {formSignupBtn}
            </div>
        </form>
    )

    return (
        <div className='flex flex-col justify-center items-center h-screen bg-slate-300 bg-landing-main bg-cover w-full'>
            <div className="window-sport-start w-1/3 text-gray-700 mt-8">
                {errorMsg}
                <div className="text-bold self-center text-xl mb-4">Inscription</div>
                {signupForm}
                <Link className="underline self-center" to="/login">Déjà inscrit ? Connectez vous</Link>
            </div>
        </div>
    );
}

export default Signup;
