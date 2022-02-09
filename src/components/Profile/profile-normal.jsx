import React from 'react';

const ProfileNormal = ({user, setDisplayMode}) => {
  const getActivityLevel = (nap) => {
    switch (nap) {
      case "sedentary":
        return "Sédentaire";
      case "light":
        return "Faible";
      case "moderate":
        return "Modérée";
      case "high":
        return "Élevée";
    
      default:
        return "Inconnue";
    }
  }

  const getGoal = (goal) => {
    switch (goal) {
      case "lose":
        return "Perdre du gras";
      case "maintain":
        return "Maintenir son poids";
      case "gain":
        return "Gagner du muscle";
      default:
        return "Inconnu";
    }
  }

  return (
    <div className='flex flex-col justify-start items-center bg-slate-300 h-screenMinusHeader w-full overflow-auto'>
      <div className='window-sport flex flex-col justify-start items-start gap-5 my-5'>
        <span className='title text-center w-full'>{user.username}</span>
        <div>
          <label htmlFor='username' >Pseudo :</label>
          <input className='input' value={user.username} type="text" id="username" name="username" />
        </div>
        <div>
          <label htmlFor='email' >Email :</label>
          <input className='input' value={user.email} type="text" id="email" name="email" />
        </div>
        <div>
          <label htmlFor='gender' >Genre :</label>
          <input className='input' value={user.gender} type="text" id="gender" name="gender" />
        </div>
        <div>
          <label htmlFor='age' >Age :</label>
          <input className='input' value={user.age} type="text" id="age" name="age" />
        </div>
        <div>
          <label htmlFor='height' >Taille :</label>
          <input className='input' value={user.height} type="text" id="height" name="height" />
        </div>
        <div>
          <label htmlFor='weight' >Poids :</label>
          <input className='input' value={user.weight} type="text" id="weight" name="weight" />
        </div>
        <div>
          <label htmlFor='nap' >Niveau d'activité physique :</label>
          <input className='input' value={getActivityLevel(user.nap)} type="text" id="nap" name="nap" />
        </div>
        <div>
          <label htmlFor='goal' >Objectif :</label>
          <input className='input' value={getGoal(user.goal)} type="text" id="goal" name="goal" />
        </div>
        <div className='flexCenter w-full'>
          <button className='btn-primary' onClick={() => setDisplayMode("update")}>Modifier</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileNormal;
