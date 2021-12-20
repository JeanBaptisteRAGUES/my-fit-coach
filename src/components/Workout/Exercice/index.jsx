import moment from 'moment';
import React, { useContext } from 'react';
import './exercice.css';
import { FirebaseContext } from '../../Firebase';

const Exercice = (props) => {
    const firebase = useContext(FirebaseContext);

    return (
        <div className='E_container'>
            Exercice
        </div>
    )
}

export default Exercice;
