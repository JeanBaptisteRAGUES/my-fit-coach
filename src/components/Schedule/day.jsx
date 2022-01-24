import React from 'react';

const Day = ({dayName, scheduleStart, scheduleEnd, eventsArray, displayEvent, hidden}) => {

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

    //console.log(Array.from('x'.repeat(scheduleEnd-scheduleStart)));

    const eventColor = (eventType) => {
        if(eventType === "0") return "bg-blue-500";
        return "bg-orange-500";
    }

    const events = (
        eventsArray.filter(event => event.day === dayName).map(dayEvent => (
            <div 
                className={"flexCenter cursor-pointer absolute z-10 rounded w-full border border-white " + eventColor(dayEvent.type)} 
                style={{height: calcHeight(dayEvent.start, dayEvent.end), top: calcTop(dayEvent.start)}}
                onClick={() => displayEvent(dayEvent)}
            >
                {shortTitle(dayEvent.title, 7)}
            </div>
        ))
    )

    const grid = (
        <div className='flexCenter w-full'>
            {
                Array.from('x'.repeat(1+scheduleEnd-scheduleStart)).map((v,i) => (
                    <div key={i} className=' w-full z-10 border border-red-700 box-border' style={{height: calcHeight(0, 1)}}>{v}</div>
                ))
            }
        </div>
    )

    const isHidden = () => {
        if(hidden) return "hidden";
        return "";
    }

    return (
        <div key={dayName} className={" md:flex basicText relative box-border bg-slate-600 h-full w-full md:w-[14.28%] border border-black min-w-[100px] " + isHidden()} >
            <span className="flexCenter w-full absolute z-10 border-b border-black bg-green-400" style={{height: calcHeight(0, 1), top: calcTop(scheduleStart-1)}}>{dayName}</span>
            {grid}
            {events}
        </div>
    )
};

export default Day;
