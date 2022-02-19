import moment from 'moment';
import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {FirebaseContext} from '../Firebase';
//import './login.css';

const Login = (props) => {
    const firebase = useContext(FirebaseContext);
    let navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [btn, setBtn] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if(password.length > 5 && email !== ''){
            setBtn(true);
        }else if (btn === true){
            setBtn(false);
        }
    }, [password, email, btn])

    const handleSubmit = e => {
        e.preventDefault();

        firebase.loginUser(email, password)
        .then(user => {
            setEmail('');
            setPassword('');
            navigate('/');

            let formatedDate = moment(Date.now()).format('DD MMM hh:mm a');
            //firebase.user(uid) ?
            firebase.db.collection('users').doc(user.user.uid).update(
                {
                    lastCoDate: formatedDate
                }
            );
        })
        .catch(error => {
            setError(error);
            setEmail('');
            setPassword('');
        })
    }

    return (
        <div className='flex flex-col justify-center items-center h-screenMinusHeader bg-slate-300 bg-landing-main bg-cover w-full'>
            <div className='window-sport-start w-[90%] md:w-1/3 text-gray-700'>
                {error !== '' && <div className="text-red-600">{error.message}</div>}
                <div className="text-bold self-center text-xl mb-4">Connexion</div>
                <form onSubmit={handleSubmit} className="w-full">
                    <div className="w-[90%] md:w-2/3">
                        <label htmlFor="email">Email :</label><br/>
                        <input className='input' onChange={(e) => setEmail(e.target.value)} value={email} type="email" autoComplete="off" required placeholder="toto@exemple.com"/>
                    </div>
                    <div className="w-[90%] md:w-2/3">
                        <label htmlFor="password">Mot de passe :</label><br/>
                        <input className='input' onChange={(e) => setPassword(e.target.value)} value={password} type="password" autoComplete="off" required placeholder="Au moins 6 caractères"/>
                    </div>
                    <div className='flex flex-col justify-center items-center w-full my-4'>
                        {btn ? <button className="btn-primary">Connexion</button> : <button disabled className="btn-primary opacity-50">Connexion</button>}
                    </div>
                </form>
                <Link className="underline" to="/signup">Vous n'avez pas de compte ? Inscrivez-vous maintenant</Link>
            </div>
        </div>
    );
}

export default Login;