import React, { useEffect, useState } from 'react';
import moment from 'moment';
import LineChart from './line-chart';

const ProfileNormal = ({user, setDisplayMode}) => {
  const [displayChart, setDisplayChart] = useState(true);
  const [weightData, setWeightData] = useState(null);
  const [weightsInterpolation, setWeightsInterpolation] = useState(false);

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

  useEffect(() => {
    getWeightData(user);
  }, [weightsInterpolation])

  const getWeightData = (user) => {
    var startDate = moment(getMinDate(user));
    var endDate = moment(getMaxDate(user));

    var dateList = getDaysBetweenDates(startDate, endDate, 1);
    console.log(dateList);

    let weightHistory = fillWeight(JSON.parse(user.weightHistory), dateList);

    const newWeightData = {
      labels: dateList,
      datasets: [{
          label: "Poids",
          data: weightsInterpolation ? interpolate(weightHistory) : weightHistory,
          backgroundColor: "rgb(150, 150, 100)",
          borderColor: "rgb(150, 150, 100)"
      }]
    };

    setWeightData(newWeightData);
  }

  const getMinDate = (user) => {
    return JSON.parse(user.weightHistory)[0][1];
  }

  const getMaxDate = (user) => {
    return JSON.parse(user.weightHistory)[JSON.parse(user.weightHistory).length-1][1];
  }

  console.log(getMinDate(user));
  console.log(getMaxDate(user));

  var getDaysBetweenDates = function(startDate, endDate, step) {
    var now = startDate.clone(), dates = [];

    while (now.isSameOrBefore(endDate)) {
        dates.push(now.format('YYYY-MM-DD'));
        now.add(step, 'days');
    }
    return dates;
  };

  

  const fillWeight = (weightHistory, dateList) => {
    let iDate = 0;
    let iWeight = 0;
    let weight = weightHistory[0][0];
    let weights = [];

    console.log(weightHistory);

    while(iDate < dateList.length){
      while(dateList[iDate] !== weightHistory[iWeight][1]){
        weights.push(weight);
        iDate++;
      }
      weight = weightHistory[iWeight][0];
      weights.push(weight);
      iWeight++;
      iDate++;
    }
    return weights;
  }

  let interpolate = (myArray) => {
    let value = myArray[0];
    let oldIndex = 0;
    let newIndex = 0;
    let tempArray = [];
    let interpolatedArray = [];
    let diffValue = 0;
    let diffIndex = 1;
    let increment = 0;

    while(newIndex < myArray.length){
      while(myArray[newIndex] === value){
        newIndex++;
      }
  
      
      tempArray = myArray.slice(oldIndex, newIndex);
      diffValue = myArray[newIndex] - myArray[oldIndex];
      diffIndex = newIndex - oldIndex;
      increment = diffValue / diffIndex;
  
      interpolatedArray.push(parseFloat(value));
  
      for(let i = 1; i< diffIndex; i++){
        interpolatedArray.push(Math.round((parseFloat(value) + i*increment) * 10)/10);
      }
  
      console.log("Diff Value : " + diffValue);
      console.log("Diff Index : " + diffIndex);
      console.log("Increment : " + increment);
      console.log(interpolatedArray);
      oldIndex = newIndex;
      value = myArray[newIndex];
    }
    return interpolatedArray;
  }

  //interpolate(weightHistory);

  

  const lineChart = displayChart && weightData !== null && (
    <div className='window-sport w-[70%] h-fit absolute top-[20%] left-[10%] z-10 '>
      <div className='flex flex-row justify-around items-center m-2 gap-2'>
        <label htmlFor='interpolation'>Interpolation </label>
        <input id="interpolation" type="checkbox" name="interpolation" value={weightsInterpolation} onChange={() => setWeightsInterpolation(!weightsInterpolation)} />
      </div>
      <div className=' w-[90%] h-fit bg-white'>
          <LineChart chartData={weightData} />
      </div>
    </div>
  )

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
      {lineChart}
    </div>
  );
};

export default ProfileNormal;
