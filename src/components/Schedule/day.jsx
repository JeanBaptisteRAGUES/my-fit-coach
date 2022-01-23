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

const Day = ({dayName, scheduleStart, scheduleEnd, eventsArray, displayEvent, hidden}) => {

    console.log(eventsArray);

    const calcHeight = (start, end) => {
        return Math.round(100*(end-start)/(scheduleEnd-(scheduleStart-1))) + "%";
    }

    const calcTop = (start) => {
        return Math.round(100*(start-(scheduleStart-1))/(scheduleEnd-(scheduleStart-1))) + "%";
    }

    const shortTitle = (title, length) => {
        if(title.length > length) return (title.slice(0, length)).trim() + "..";
        return title;
    }

    /*
    {
        refID: newEventRefID,
        day: newEventDay,
        start: newEventStart,
        end: newEventEnd,
        title: newEventTitle,
        type: newEventType
    }
    */

    const eventColor = (eventType) => {
        if(eventType === "0") return "bg-blue-500";
        return "bg-orange-500";
    }

    const events = (
        eventsArray.filter(event => event.day === dayName).map(dayEvent => (
            <div 
                className={"flexCenter absolute z-10 rounded w-full border border-white " + eventColor(dayEvent.type)} 
                style={{height: calcHeight(dayEvent.start, dayEvent.end), top: calcTop(dayEvent.start)}}
                onClick={displayEvent}
            >
                {shortTitle(dayEvent.title, 7)}
            </div>
        ))
    )

    const isHidden = () => {
        if(hidden) return "hidden";
        return "";
    }

    return (
        <div key={dayName} className={" md:flex basicText relative box-border bg-slate-600 h-full w-full md:w-[14.28%] border border-black min-w-[100px] " + isHidden()} >
            <span className="flexCenter w-full absolute z-10 border-b border-black bg-green-400" style={{height: calcHeight(5, 6), top: calcTop(5)}}>{dayName}</span>
            {events}
        </div>
    )
};

export default Day;
