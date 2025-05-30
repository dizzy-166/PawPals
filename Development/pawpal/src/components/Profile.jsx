

export const Profile = ({profile, goToMain, profilePhoto}) => {
return (
    <div className="profile-page">
      <div className="formsign">
        <h2 className="titleform">Личный кабинет</h2>

        <img
          src={profilePhoto}
          alt="Фото профиля"
          className="profile-photo"
        />

        <div className="input-group">
          <input className="input-field" type="text" value={profile.lastName} readOnly />
          <input className="input-field" type="text" value={profile.name} readOnly />
          <input className="input-field" type="email" value={profile.email} readOnly />
          <input className="input-field" type="text" value={profile.birthDate} readOnly />
        </div>

        <button className="button-style" onClick={goToMain}>
          Выйти
        </button>
      </div>
    </div>
  );
};