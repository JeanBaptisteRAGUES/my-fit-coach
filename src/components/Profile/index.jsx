import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProfileNormal from './profile-normal';
import ProfileUpdate from './profile-update';

const Profile = () => {
    const location = useLocation();
    let navigate = useNavigate();
    const {userID} = location.state !== null && location.state !== undefined ? location.state : {userID: null};
    const [displayMode, setDisplayMode] = useState("normal");

    useEffect(() => {
        if(userID === null){navigate('/login'); return};
    }, []);

    const profileNormal = displayMode === "normal" && (
        <ProfileNormal setDisplayMode={setDisplayMode} ></ProfileNormal>
    )

    const profileUpdate = displayMode === "update" && (
        <ProfileUpdate setDisplayMode={setDisplayMode} ></ProfileUpdate>
    )

    return (
        <div className='flexCenter'>
            {profileNormal}
            {profileUpdate}
        </div>
    )
}

export default Profile;
