

export const Profile = ({profile, goToMain, profilePhoto}) => {
return (
    <div className="profile-page">
      <div className="formprofile">
        <h2 className="titleformforProfile">Личный кабинет</h2>

        <img
          src={profilePhoto}
          alt="Фото профиля"
          className="profile-photo"
        />

        <div className="input-fieldforProf">
          <input className="input-groupforProf" type="text" value={profile.lastName} readOnly />
          <input className="input-groupforProf" type="text" value={profile.name} readOnly />
          <input className="input-groupforProf" type="email" value={profile.email} readOnly />
          <input className="input-groupforProf" type="text" value={profile.birthDate} readOnly />
        </div>

        <button className="button-styleforProfile" onClick={goToMain}>
          Выйти
        </button>
      </div>
    </div>
  );
};