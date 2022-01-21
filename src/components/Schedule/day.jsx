import React from 'react';

/*
{
    eventsArray.filter(e => e.day === dayName).map(eJour => (
        <span 
            key={dayName+eJour.title} 
            className="flexCenter absolute bg-orange-400 opacity-80 w-full" 
            style={{top: getEventTop(eJour), height: getEventHeight(eJour)}}
            onClick={() => displayEvent(eJour)}
            >
                {shortTitle(eJour.title, 20)}
        </span>
    ))
}
*/

const Day = ({dayName, scheduleStart, scheduleEnd, eventsArray, displayEvent}) => {

    const calcHeight = (start, end) => {
        return Math.round(100*(end-start)/(scheduleEnd-(scheduleStart-1))) + "%";
    }

    const calcTop = (start) => {
        return Math.round(100*(start-(scheduleStart-1))/(scheduleEnd-(scheduleStart-1))) + "%";
    }

    const test = (h, x) => {
        return "h-[" + (h*x).toString() + "%]";
    }

    return (
    <div key={dayName} className="basicText relative box-border bg-slate-600 h-[80%] w-1/2 md:w-[10%]">
        <span className="flexCenter w-full absolute z-10 border border-black bg-green-400" style={{height: calcHeight(5, 6), top: calcTop(5)}}>{dayName}</span>
        <div className="flexCenter absolute z-10 rounded bg-orange-400 w-full" style={{height: calcHeight(6, 7), top: calcTop(6)}}>Déjeuner</div>
        <div className="flexCenter absolute z-10 rounded bg-orange-400 w-full" style={{height: calcHeight(12, 14), top: calcTop(12)}}>Repas</div>
        <div className="flexCenter absolute z-10 rounded bg-sky-400 w-full" style={{height: calcHeight(15.5, 18), top: calcTop(15.5)}}>Muscu</div>
        <div className="flexCenter absolute z-10 rounded bg-orange-400 w-full" style={{height: calcHeight(22, 23), top: calcTop(22)}}>Souper</div>
    </div>
    )
};

export default Day;
