import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProfileNormal from './profile-normal';
import ProfileUpdate from './profile-update';
import { FirebaseContext } from '../Firebase';
import moment from 'moment';
import LineChart from './line-chart';

const Profile = () => {
    const firebase = useContext(FirebaseContext);
    const location = useLocation();
    let navigate = useNavigate();
    const {userID} = location.state !== null && location.state !== undefined ? location.state : {userID: null};
    const [displayMode, setDisplayMode] = useState("normal");
    const [user, setUser] = useState(null);
    const [testData, setTestData] = useState({
        labels: [2016, 2017, 2018, 2019, 2020, 2021, 2022],
        datasets: [{
            label: "Poids",
            data: [75, 77, 79, 80, 81, 80, 85],
            backgroundColor: "rgb(150, 150, 100)",
            borderColor: "rgb(150, 150, 100)"
        }]
    });

    useEffect(() => {
        if(userID === null){navigate('/login'); return};
        firebase.user(userID).get()
        .then((res) => {
            let newUser = res.data();
            newUser.age = moment().diff(newUser.birth, 'years', false);
            newUser.id = userID;
            setUser(newUser);
        })
        .catch((err) => console.log("Erreur récupération utilisateur : " + err));

    }, []);

    const profileNormal = user !== null && displayMode === "normal" && (
        <ProfileNormal user={user} setDisplayMode={setDisplayMode} ></ProfileNormal>
    )

    const profileUpdate = user !== null && displayMode === "update" && (
        <ProfileUpdate user={user} setDisplayMode={setDisplayMode} ></ProfileUpdate>
    )

    /**
     * <div className=' w-[50%] h-[50%] absolute top-[30%] left-[20%] z-10 bg-white'>
            <LineChart chartData={testData} />
        </div>
     */

    return (
        <div className='flexCenter h-screenMinusHeader relative'>
            {profileNormal}
            {profileUpdate}
        </div>
    )
}

export default Profile;
