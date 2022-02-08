import React from 'react';

const ProfileNormal = ({setDisplayMode}) => {
  return (
    <div className='flexCenter'>
        <span className='title'>Mode Normal</span>
        <button className='btn-primary' onClick={() => setDisplayMode("update")}>Mode Update</button>
    </div>
  );
};

export default ProfileNormal;
