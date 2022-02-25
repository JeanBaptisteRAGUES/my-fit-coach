import React, { useContext, useState } from 'react';
import { FirebaseContext } from '../Firebase';
import moment from 'moment';

const ProfileUpdate = ({user, setDisplayMode}) => {
    const firebase = useContext(FirebaseContext);
    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email);
    const [birth, setBirth] = useState(user.birth);
    const [height, setHeight] = useState(user.height);
    const [weight, setWeight] = useState(user.weight);
    const [gender, setGender] = useState(user.gender);
    const [goal, setGoal] = useState(user.goal);
    const [nap, setNap] = useState(user.nap);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

      const updateUser = (e) => {
        e.preventDefault();
        const formatedDate = moment().format('YYYY-MM-DD');
        const oldEmail = user.email;
        const oldWeight = user.weight;
        let newWeightHistory = JSON.parse(user.weightHistory);
        if(weight !== oldWeight) newWeightHistory.push([weight, formatedDate]);
        newWeightHistory = JSON.stringify(newWeightHistory);

        firebase.user(user.id).update({
            username,
            email,
            gender,
            birth,
            height,
            weight,
            weightHistory: newWeightHistory,
            nap,
            goal
        })
        .then(() => {
            console.log("Profil correctement mis à jour !");
            if(email !== oldEmail){
                firebase.auth.currentUser.updateEmail(email)
                .then(() => {
                    console.log("Email mis à jour avec succès !");
                })
                .catch((err) => setErrorMsg("Erreur mise à jour email utilisateur : " + err));
            }
            if(password !== ""){
                if(password === confirmPassword){
                    firebase.auth.currentUser.updatePassword(password)
                    .then(() => {
                        console.log("Mot de passe mis à jour avec succès !");
                    })
                    .catch((err) => setErrorMsg("Erreur mise à jour mot de passe utilisateur : " + err));
                }else{
                    setErrorMsg("Mot de passe différent de la confirmation du mot de passe");
                }
            }
            setDisplayMode('normal');
        })
        .catch((err) => setErrorMsg("Erreur mise à jour profil utilisateur : " + err))
      }

      const errorMsgDisplay = errorMsg !== '' && <span className="text-red-600">{errorMsg}</span>;
    
      return (
        <div className='flex flex-col justify-start items-center bg-slate-300 h-screenMinusHeader w-full overflow-auto'>
          <div className='window-sport flex flex-col justify-start items-start gap-5 my-5'>
            <span className='title text-center w-full'>{user.username}</span>
            <form className='flexStart gap-5' onSubmit={(e) => updateUser(e)}>
                <div>
                    <label htmlFor='username' >Pseudo :</label>
                    <input className='input' onChange={(e) => setUsername(e.target.value)} value={username} type="text" id="username" name="username" />
                </div>
                <div>
                    <label htmlFor='email' >Email :</label>
                    <input className='input' onChange={(e) => setEmail(e.target.value)} value={email} type="text" id="email" name="email" />
                </div>
                <div>
                    <label htmlFor='password' >Mot de passe :</label>
                    <input className='input' onChange={(e) => setPassword(e.target.value)} value={password} type="password" id="password" name="password" />
                </div>
                <div>
                    <label htmlFor='confirm-password' >Confirmation mot de passe :</label>
                    <input className='input' onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} type="password" id="confirm-password" name="confirm password" />
                </div>
                <div>
                    <label htmlFor='gender' >Genre :</label>
                    <select className='input' id="gender" name="gender" onChange={(e) => setGender(e.target.value)} value={gender}>
                        <option value="">Précisez votre sexe</option>
                        {gender === "male" ? <option value="male" selected>Homme</option> : <option value="male">Homme</option>}
                        {gender === "female" ? <option value="female" selected>Femme</option> : <option value="female">Femme</option>}
                    </select>
                </div>
                <div>
                    <label htmlFor='birth' >Date de naissance :</label>
                    <input className='input' onChange={(e) => setBirth(e.target.value)} value={birth} type="date" id="birth" name="birth" />
                </div>
                <div>
                    <label htmlFor='height' >Taille :</label>
                    <input className='input' onChange={(e) => setHeight(e.target.value)} value={height} type="text" id="height" name="height" />
                </div>
                <div>
                    <label htmlFor='weight' >Poids :</label>
                    <input className='input' onChange={(e) => setWeight(e.target.value)} value={weight} type="number" step={0.1} id="weight" name="weight" />
                </div>
                <div>
                    <label htmlFor='nap' >Niveau d'activité physique :</label><br/>
                    <select id='nap' onChange={(e) => setNap(e.target.value)}>
                        <option value="">--Choisissez une option--</option>
                        {nap === "sedentary" ? <option value="sedentary" selected>Sédentaire</option> : <option value="sedentary">Sédentaire</option>}
                        {nap === "light" ? <option value="light" selected>Faible</option> : <option value="light">Faible</option>}
                        {nap === "moderate" ? <option value="moderate" selected>Modérée</option> : <option value="moderate">Modérée</option>}
                        {nap === "high" ? <option value="high" selected>Élevée</option> : <option value="high">Élevée</option>}
                    </select>
                </div>
                <div>
                    <label htmlFor='goal' >Objectif :</label><br/>
                    <select id='goal' onChange={(e) => setGoal(e.target.value)}>
                        <option value="">--Choisissez une option--</option>
                        {goal === "maintain" ? <option value="maintain" selected>Maintenir son poids</option> : <option value="maintain">Maintenir son poids</option>}
                        {goal === "lose" ? <option value="lose" selected>Perdre du gras</option> : <option value="lose">Perdre du gras</option>}
                        {goal === "gain" ? <option value="gain" selected>Gagner du muscle</option> : <option value="gain">Gagner du muscle</option>}
                    </select>
                </div>
                <div className='flexCenter w-full'>
                    <button className='btn-primary'>Enregistrer</button>
                </div>
            </form>
            {errorMsgDisplay}
          </div>
        </div>
      );
};

export default ProfileUpdate;