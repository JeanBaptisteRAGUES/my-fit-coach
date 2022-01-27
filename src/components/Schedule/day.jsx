import React from 'react';
import { BsFillFileBarGraphFill, BsFileBarGraph } from 'react-icons/bs';

const Day = ({dayName, dayIndex, scheduleStart, scheduleEnd, hoursArray, eventsArray, displayEvent, hidden}) => {

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
                className={`relative col-start-1 col-span-1`}
                style={{gridRow: `${(dayEvent.start-scheduleStart)*12 + 12} / span ${(dayEvent.end-dayEvent.start)*12}`}}
            >
                <div 
                    className={`flexCenter text-sm absolute top-[1px] w-full h-full rounded border border-gray-50 box-border ${eventColor(dayEvent.type)} cursor-pointer truncate`}
                    onClick={() => displayEvent(dayEvent)}
                >
                    {shortTitle(dayEvent.title, 20)}
                </div>
            </div>
        ))
    )

    //const testHours = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];

    const grid = (
        hoursArray.slice(0, hoursArray.length-1).map((h, i) => (
            <div key={h} className={` text-xs flexCenter col-start-1 col-span-1 row-start-[${i*12 + 1}] row-[span_12_/_span_12] border-b border-slate-400 truncate`}></div>
        ))
    )

    return (
        <div className={` md:grid grid-cols-1 col-start-1 col-span-7 md:col-start-${dayIndex+1} md:col-span-1 box-border border border-black ${hidden ? 'hidden' : 'grid'}`} style={{gridTemplateRows: `repeat(${(hoursArray.length)*12},minmax(0,1fr))`}}>
            {grid}
            <div className={`relative col-start-1 col-span-1 row-start-1 row-[span_12_/_span_12]`}>
                <div className={`grid grid-cols-6 text-sm absolute top-0 w-full h-full bg-slate-200 border-b border-slate-700 truncate`}>
                    <div className='relative col-start-2 col-span-4'>
                        <div className='flexCenter absolute top-0 w-full h-full'>
                            {dayName}
                        </div>
                    </div>
                    <div className='relative col-start-6 col-span-1'>
                        <BsFileBarGraph className='flexCenter absolute top-0 w-full h-full cursor-pointer text-green-500' onClick={() => alert("Valeurs nutritionnelles")}/>
                    </div>
                </div>
            </div>
            {events}
        </div>
    )
};

export default Day;
