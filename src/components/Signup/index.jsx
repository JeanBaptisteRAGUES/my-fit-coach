import moment from 'moment';
import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {FirebaseContext} from '../Firebase';
//import './signup.css';

const Signup = (props) => {
    const firebase = useContext(FirebaseContext);
    let navigate = useNavigate();

    const data = {
        username: '',
        email: '',
        age: '',
        height: '',
        weight: '',
        gender: '',
        password: '',
        confirmPassword: ''
    }

    const [loginData, setLoginData] = useState(data);
    const [error, setError] = useState('');

    const handleChange = e => {
        //ex: setLoginData({...loginData, ["username"]: Nico31});
        setLoginData({...loginData, [e.target.id]: e.target.value});
    }

    const createNewUser = (authUser, username, email, age, height, weight, gender) => {
        const formatedDate = moment(Date.now()).format('DD MMM hh:mm a');
        return firebase.user(authUser.user.uid).set({
            id: authUser.user.uid,
            username: username,
            email: email,
            age: age,
            height: height,
            weight: weight,
            gender: gender,
            weightHistory: JSON.stringify([[weight, formatedDate]]),
            eventsIDs: JSON.stringify([]),
            lastCoDate: formatedDate
        });
    }

    const addDisplayNameToCurrentUser = () => {
        firebase.auth.currentUser.updateProfile({
            displayName: username
        });
    }

    const handleSubmit = e => {
        e.preventDefault();
        const {email, password, username, age, height, weight, gender} = loginData;
        firebase.signupUser(email, password)
        .then((authUser) => {
            createNewUser(authUser, username, email, age, height, weight, gender);
        })
        .then(() => {
            setLoginData({...data});
            navigate('/');
            addDisplayNameToCurrentUser();
        })
        .catch(error => {
            setError(error);
            setLoginData({...data});
        });
    }

    const {username, email, age, height, weight, gender, password, confirmPassword} = loginData;

    //gestion erreurs
    const errorMsg = error !== '' && <div className="text-red-600">{error.message}</div>;

    const formPseudo = (
        <div className="w-2/3">
            <label htmlFor="username">Pseudo :</label><br/>
            <input 
                className='input'
                onChange={handleChange} 
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
                onChange={handleChange} 
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
    const formAge = (
        <div className="w-2/3">
            <label htmlFor="age">Age :</label><br/>
            <input 
                className='input'
                onChange={handleChange} 
                value={age} 
                type="text" 
                id="age" 
                autoComplete="off" 
                required 
                placeholder="35"
            />
        </div>
    )

    const formHeight = (
        <div className="w-2/3">
            <label htmlFor="height">Taille (en cm) :</label><br/>
            <input 
                className='input'
                onChange={handleChange} 
                value={height} 
                type="text" 
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
                onChange={handleChange} 
                value={weight} 
                type="text" 
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
            <select className='input' id="gender" name="gender" onChange={handleChange} value={gender}>
                <option value="">Précisez votre sexe</option>
                <option value="male">Homme</option>
                <option value="female">Femme</option>
            </select>
        </div>
    )

    const formPassword = (
        <div className="w-2/3">
            <label htmlFor="password">Mot de passe :</label><br/>
            <input 
                className='input'
                onChange={handleChange} 
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
        <div className="w-2/3">
            <label htmlFor="confirmPassword">Confirmez le mot de passe :</label><br/>
            <input 
                className='input'
                onChange={handleChange} 
                value={confirmPassword} 
                type="password" 
                id="confirmPassword" 
                autoComplete="off" 
                required 
                placeholder="Confirmation mot de passe"
            />
        </div>
    )

    const formSignupBtn = username === '' || email === '' || age === '' || height === '' || weight === '' ||
     gender === '' || password === '' || password !== confirmPassword
    ? <button disabled className="btn-primary opacity-50">Inscription</button> : <button className="btn-primary">Inscription</button>

    const signupForm = (
        <form onSubmit={handleSubmit} className="w-full">
            {formPseudo}
            {formEmail}
            {formAge}
            {formHeight}
            {formWeight}
            {formGender}
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
