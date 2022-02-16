import React from 'react';
import { RiCloseLine } from 'react-icons/ri';
import LineChart from './line-chart';

const ChartWindow = ({user, weightData, chartMinDate, chartMaxDate, weightsInterpolation, setChartMinDate, setChartMaxDate, setWeightsInterpolation, getMinDate, getMaxDate, setDisplayChart}) => {
  return (
    <div className='flex flex-row justify-center font-bold text-2xl items-center fixed top-0 z-10 text-white w-full min-h-screen backdrop-blur-md bg-slate-900/50 motion-safe:animate-fall'>
        <div className='window-sport w-full md:w-[70%] h-fit absolute left-0 top-[20%] md:left-[10%] z-10 '>
            <div className='flex flex-col md:flex-row justify-around items-center m-2 gap-2 uhd:gap-5 basicText'>
                <div className='flex flex-row justify-around items-center m-2 gap-2'>
                    <label htmlFor='chartMin'>Début </label>
                    <input className='input' id="chartMin" type="date" name="chart starting date" value={chartMinDate} onChange={(e) => setChartMinDate(e.target.value)} min={getMinDate(user)} max={chartMaxDate} />
                </div>
                <div className='flex flex-row justify-around items-center m-2 gap-2'>
                    <label htmlFor='chartMax'>Fin </label>
                    <input className='input' id="chartMax" type="date" name="chart ending date" value={chartMaxDate} onChange={(e) => setChartMaxDate(e.target.value)} min={chartMinDate} max={getMaxDate(user)} />
                </div>
                <div className='flex flex-row justify-around items-center m-2 gap-2'>
                    <label htmlFor='interpolation'>Interpolation </label>
                    <input className=' uhd:h-12 uhd:w-12' id="interpolation" type="checkbox" name="interpolation" value={weightsInterpolation} onChange={() => setWeightsInterpolation(!weightsInterpolation)} />
                </div>
            </div>
            <div className=' w-[125%] md:w-[90%] h-fit bg-white'>
                <LineChart chartData={weightData} />
            </div>
        </div>
        <div className='flexCenter fixed bottom-[10%] left-[45%] md:top-[7vh] md:left-[5vw] h-10 w-10 uhd:h-32 uhd:w-32 text-white rounded-full text-6xl uhd:text-8xl cursor-pointer bg-slate-400'>
            <RiCloseLine onClick={() => setDisplayChart(false)}></RiCloseLine>
        </div>
    </div>
  )
}

export default ChartWindow