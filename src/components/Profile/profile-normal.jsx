import React from 'react';
import moment from 'moment';

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

  const getMinDate = (user) => {
    return JSON.parse(user.weightHistory)[0][1];
  }

  const getMaxDate = (user) => {
    return JSON.parse(user.weightHistory)[JSON.parse(user.weightHistory).length-1][1];
  }

  console.log(getMinDate(user));
  console.log(getMaxDate(user));

  var getDaysBetweenDates = function(startDate, endDate) {
    var now = startDate.clone(), dates = [];

    while (now.isSameOrBefore(endDate)) {
        dates.push(now.format('YYYY-MM-DD'));
        now.add(1, 'days');
    }
    return dates;
  };

  var startDate = moment(getMinDate(user));
  var endDate = moment(getMaxDate(user));

  var dateList = getDaysBetweenDates(startDate, endDate);
  console.log(dateList);

  return (
    <div className='flex flex-col justify-start items-center bg-slate-300 h-screenMinusHeader w-full overflow-auto'>
      <div className='window-sport flex flex-col justify-start items-start gap-5 my-5'>
        <input className='input' id="testDate" type="date" name="testDate" min={getMinDate(user)} max={getMaxDate(user)} />
        <span className='title text-center w-full'>{user.username}</span>
        <div>
          <label htmlFor='username' >Pseudo :</label>
          <input className='input' value={user.username} type="text" id="username" name="username" readOnly />
        </div>
        <div>
          <label htmlFor='email' >Email :</label>
          <input className='input' value={user.email} type="text" id="email" name="email" readOnly />
        </div>
        <div>
          <label htmlFor='gender' >Genre :</label>
          <input className='input' value={user.gender} type="text" id="gender" name="gender" readOnly />
        </div>
        <div>
          <label htmlFor='age' >Age :</label>
          <input className='input' value={user.age} type="text" id="age" name="age" readOnly />
        </div>
        <div>
          <label htmlFor='height' >Taille :</label>
          <input className='input' value={user.height} type="text" id="height" name="height" readOnly />
        </div>
        <div>
          <label htmlFor='weight' >Poids :</label>
          <input className='input' value={user.weight} type="text" id="weight" name="weight" readOnly />
        </div>
        <div>
          <label htmlFor='nap' >Niveau d'activité physique :</label>
          <input className='input' value={getActivityLevel(user.nap)} type="text" id="nap" name="nap" readOnly />
        </div>
        <div>
          <label htmlFor='goal' >Objectif :</label>
          <input className='input' value={getGoal(user.goal)} type="text" id="goal" name="goal" readOnly />
        </div>
        <div className='flexCenter w-full'>
          <button className='btn-primary' onClick={() => setDisplayMode("update")}>Modifier</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileNormal;
