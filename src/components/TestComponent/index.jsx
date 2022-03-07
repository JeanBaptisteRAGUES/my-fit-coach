import React, { Fragment } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HiShoppingCart } from 'react-icons/hi';
import './test-component.css';

const TestComponent = () => {

    const removeDuplicatesFromArray = () => {
        const arrayDuplicates = [[1,2], [3], [4,5], [2,1], [3], [1,2], [1,2,3]];
        const noDuplicates = [...new Set(arrayDuplicates.map(elem => JSON.stringify(elem)))].map(elem => JSON.parse(elem));
        console.log(noDuplicates);
    }


    return (
        <div className='container-sport h-screenMinusHeader'>
            <div className='flex flex-row justify-center font-bold text-2xl items-center fixed top-[5vh] z-10 w-full h-screen backdrop-blur-md bg-slate-900/50 motion-safe:animate-fall'>
                <div className=' w-1/2 h-fit bg-sky-300 max-h-[50%] overflow-y-auto col-start-3 col-span-4 row-start-2'>
                    <button onClick={() => removeDuplicatesFromArray()}>Test</button>
                </div>
            </div>
        </div>
    )
}

export default TestComponent;
