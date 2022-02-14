import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProfileNormal from './profile-normal';
import ProfileUpdate from './profile-update';
import { FirebaseContext } from '../Firebase';
import moment from 'moment';


const Profile = () => {
    const firebase = useContext(FirebaseContext);
    const location = useLocation();
    let navigate = useNavigate();
    const {userID} = location.state !== null && location.state !== undefined ? location.state : {userID: null};
    const [displayMode, setDisplayMode] = useState("normal");
    const [user, setUser] = useState(null);
    

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
