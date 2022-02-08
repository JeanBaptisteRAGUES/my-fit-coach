import React from 'react';

const ProfileUpdate = ({userID, setDisplayMode}) => {
    

    return (
        <div className='flexCenter'>
            <span className='title'>Mode Update</span>
            <button className='btn-primary' onClick={() => setDisplayMode("normal")}>Mode Normal</button>
        </div>
    );
};

export default ProfileUpdate;