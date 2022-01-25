import React from 'react';

const Day = ({dayName, dayIndex, scheduleStart, scheduleEnd, hoursArray, eventsArray, displayEvent, hidden}) => {

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

    /*
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
    */

    /*
    const events = (
        eventsArray.filter(event => event.day === dayName).map(dayEvent => (
            <div 
                className={`flexCenter text-sm rounded border border-gray-50 box-border col-start-1 col-span-1 z-20 ${eventColor(dayEvent.type)} truncate`}
                style={{gridRow: `${dayEvent.start*12} / span ${(dayEvent.end-dayEvent.start)*12}`}}
            >
                {shortTitle(dayEvent.title, 5)}
            </div>
        ))
    )
    */

    const events = (
        eventsArray.filter(event => event.day === dayName).map(dayEvent => (
            <div 
                className={`relative col-start-1 col-span-1`}
                style={{gridRow: `${dayEvent.start*12} / span ${(dayEvent.end-dayEvent.start)*12}`}}
            >
                <div className={`flexCenter text-sm absolute top-0 w-full h-full rounded border border-gray-50 box-border ${eventColor(dayEvent.type)} truncate`}>
                    {shortTitle(dayEvent.title, 5)}
                </div>
            </div>
        ))
    )

    const testHours = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]

    const grid = (
        testHours.map((h) => (
            <div key={h} className={` text-xs flexCenter col-start-1 col-span-1 row-start-[${h*12 + 1}] row-[span_12_/_span_12] border-b border-slate-400 truncate`}></div>
        ))
    )

    const isHidden = () => {
        if(hidden) return "hidden";
        return "";
    }

    /*
    return (
        <div className={` grid grid-cols-1 grid-rows-[repeat(288,minmax(0,1fr))] col-start-${dayIndex+1} col-span-1 border border-black`}>
            <div className=' col-start-1 col-span-1 row-start-[264] row-[span_24_/_span_24] bg-green-500 w-full'></div>
            <div className=' flexCenter col-start-1 col-span-1 row-start-[264] z-10 row-[span_24_/_span_24] truncate '>{`${dayName} (${dayIndex})`}</div>
        </div>
    )
    */

    /*
        return (
            <div className={` grid grid-cols-1 grid-rows-[repeat(288,minmax(0,1fr))] col-start-${dayIndex+1} col-span-1 border border-black`}>
                <div className={` text-xs flexCenter col-start-1 col-span-1 row-start-[1] row-[span_12_/_span_12] border-b border-slate-400 truncate`}>1</div>
                <div className={` text-xs flexCenter col-start-1 col-span-1 row-start-[13] row-[span_12_/_span_12] border-b border-slate-400 truncate`}>2</div>
                <div className={` text-xs flexCenter col-start-1 col-span-1 row-start-[25] row-[span_12_/_span_12] border-b border-slate-400 truncate`}>3</div>
                <div className={` text-xs flexCenter col-start-1 col-span-1 row-start-[37] row-[span_12_/_span_12] border-b border-slate-400 truncate`}>4</div>
                <div className={` text-xs flexCenter col-start-1 col-span-1 row-start-[49] row-[span_12_/_span_12] border-b border-slate-400 truncate`}>5</div>
                <div className={` text-xs flexCenter col-start-1 col-span-1 row-start-[61] row-[span_12_/_span_12] border-b border-slate-400 truncate`}>6</div>
                <div className={` text-xs flexCenter col-start-1 col-span-1 row-start-[73] row-[span_12_/_span_12] border-b border-slate-400 truncate`}>7</div>
                <div className={` text-xs flexCenter col-start-1 col-span-1 row-start-[85] row-[span_12_/_span_12] border-b border-slate-400 truncate`}>8</div>
                <div className={` text-xs flexCenter col-start-1 col-span-1 row-start-[97] row-[span_12_/_span_12] border-b border-slate-400 truncate`}>9</div>
                <div className={` text-xs flexCenter col-start-1 col-span-1 row-start-[109] row-[span_12_/_span_12] border-b border-slate-400 truncate`}>10</div>
                <div className={` text-xs flexCenter col-start-1 col-span-1 row-start-[121] row-[span_12_/_span_12] border-b border-slate-400 truncate`}>11</div>
                <div className={` text-xs flexCenter col-start-1 col-span-1 row-start-[133] row-[span_12_/_span_12] border-b border-slate-400 truncate`}>12</div>
                <div className={` text-xs flexCenter col-start-1 col-span-1 row-start-[145] row-[span_12_/_span_12] border-b border-slate-400 truncate`}>13</div>
                <div className={` text-xs flexCenter col-start-1 col-span-1 row-start-[157] row-[span_12_/_span_12] border-b border-slate-400 truncate`}>14</div>
                <div className={` text-xs flexCenter col-start-1 col-span-1 row-start-[169] row-[span_12_/_span_12] border-b border-slate-400 truncate`}>15</div>
                <div className={` text-xs flexCenter col-start-1 col-span-1 row-start-[181] row-[span_12_/_span_12] border-b border-slate-400 truncate`}>16</div>
                <div className={` text-xs flexCenter col-start-1 col-span-1 row-start-[193] row-[span_12_/_span_12] border-b border-slate-400 truncate`}>17</div>
                <div className={` text-xs flexCenter col-start-1 col-span-1 row-start-[205] row-[span_12_/_span_12] border-b border-slate-400 truncate`}>18</div>
                <div className={` text-xs flexCenter col-start-1 col-span-1 row-start-[217] row-[span_12_/_span_12] border-b border-slate-400 truncate`}>19</div>
                <div className={` text-xs flexCenter col-start-1 col-span-1 row-start-[229] row-[span_12_/_span_12] border-b border-slate-400 truncate`}>20</div>
                <div className={` text-xs flexCenter col-start-1 col-span-1 row-start-[241] row-[span_12_/_span_12] border-b border-slate-400 truncate`}>21</div>
                <div className={` text-xs flexCenter col-start-1 col-span-1 row-start-[253] row-[span_12_/_span_12] border-b border-slate-400 truncate`}>22</div>
                <div className={` text-xs flexCenter col-start-1 col-span-1 row-start-[265] row-[span_12_/_span_12] border-b border-slate-400 truncate`}>23</div>
                <div className={` text-xs flexCenter col-start-1 col-span-1 row-start-[277] row-[span_12_/_span_12] border-b border-slate-400 truncate`}>24</div>

                <div className={`col-start-1 col-span-1 row-start-[13] z-10 row-[span_24_/_span_24] bg-green-500 w-full`}></div>
                <div className={`flexCenter col-start-1 col-span-1 row-start-[13] z-20 row-[span_24_/_span_24] truncate`}>{`${dayName} (${dayIndex})`}</div>

            </div>
        )
    */

    return (
        <div className={` grid grid-cols-1 grid-rows-[repeat(288,minmax(0,1fr))] col-start-${dayIndex+1} col-span-1 box-border border border-black`}>
            {grid}
            {events}
        </div>
    )
};

export default Day;
