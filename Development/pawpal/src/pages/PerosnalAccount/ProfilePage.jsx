import profilePhoto from '../../resorce/i (1).webp'; // Замени на путь к реальному фото
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProfilePageVM from './ProfilePageVM';
import { observer } from "mobx-react";
import { Profile } from '../../components/Profile';
import { ActualState } from '../../Domain/States/ActualState';
import { Load } from '../../components/Load';


const ProfilePage = observer(({getOuting}) => {

    useEffect(() => {
        loadCurrentUserProfile();
    }, []);

    const {profile, loadCurrentUserProfile, actualState, messegeError} = ProfilePageVM

    const navigate = useNavigate();
    
      const goToMain = () => {
        getOuting()
        navigate('/'); // Убедись, что путь совпадает с маршрутом ProfilePage
      };
  
      return (
      <>
      {actualState === ActualState.Success && (<Profile profile = {profile} goToMain={goToMain} profilePhoto={profilePhoto}/>)}
      {actualState === ActualState.Loading && (
        <div className="loading-overlay">
            <Load />
            </div>
        )}
      {actualState === ActualState.Error && (
        <div className="loading-overlay">
            <p>{messegeError}</p>
            </div>
        )}  
      </>
       );
});

export default ProfilePage;