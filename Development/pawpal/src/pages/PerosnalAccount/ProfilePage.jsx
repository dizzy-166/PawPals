import React from 'react';
import profilePhoto from '../../resorce/i (1).webp'; // Замени на путь к реальному фото
import { useNavigate } from 'react-router-dom';

const ProfilePage = ({getOuting}) => {
    const navigate = useNavigate();
    
      const goToMain = () => {
        getOuting()
        navigate('/'); // Убедись, что путь совпадает с маршрутом ProfilePage
      };
  return (
    <div
      className="profile-page"
      style={{
        backgroundColor: '#FFFFFF',
        fontFamily: 'Inter_Dis, sans-serif',
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '40px',
        paddingBottom: '60px', // небольшой нижний отступ от формы
      }}
    >
      <div
        className="formsign"
        style={{
          backgroundColor: '#EFEFEF',
          width: '400px',
          borderRadius: '25px',
          border: '1px solid black',
          padding: '30px 0',
          textAlign: 'center',
        }}
      >
        <h2 className="titleform" style={{ marginBottom: '20px' }}>Личный кабинет</h2>

        <img
          src={profilePhoto}
          alt="Фото профиля"
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            objectFit: 'cover',
            marginBottom: '20px',
            border: '3px solid #ccc',
          }}
        />

        <div className="input-group">
          <input
            className="input-field"
            type="text"
            value="Иванов"
            readOnly
          />
          <input
            className="input-field"
            type="text"
            value="Иван"
            readOnly
          />
          <input
            className="input-field"
            type="email"
            value="ivanov@example.com"
            readOnly
          />
          <input
            className="input-field"
            type="text"
            value="01.01.1990"
            readOnly
          />
        </div>

        <button
          className="button-style"
          style={{
            backgroundColor: '#b80000',
            marginTop: '10px',
            marginBottom: '10px', // небольшой нижний отступ
          }}
          onClick={goToMain}
        >
          Выйти
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;