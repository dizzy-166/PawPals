import { Load } from './Load';
import { useEffect, useState } from 'react';
import supabase from '../Domain/Utils/Constant';
import { FormSignInSignUp } from '../pages/FormSignInSignUp/FormSignInSignUp';
import { Link, NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

 export const CustomHeader = ({loading, currentUser, setCurrentUser}) => {

  const [showForm, setShow] = useState(false)
  
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate('/profile'); // Убедись, что путь совпадает с маршрутом ProfilePage
  };

  return (
    <>
    <header>
            <div class="container">
                <div class="logo">
                    <img src="../materials/logo.png" alt="Paw Pals Logo"/>
                    <span>PawPals</span>
                </div>
                <nav>
                    <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Главная</NavLink>
                    <NavLink to="/find-pet" className={({ isActive }) => isActive ? "active" : ""}>Найти питомца</NavLink>
                    <NavLink to="/your-pets" className={({ isActive }) => isActive ? "active" : ""}>Ваши питомцы</NavLink>
                    <NavLink to="/meetings" className={({ isActive }) => isActive ? "active" : ""}>Встречи</NavLink>
                    {!loading && (currentUser ? (<> <a class="no-underline" href="#"> <button onClick={goToProfile}> Личный кабинет</button></a> </>) : (<> <a class="no-underline"> <button onClick={(e) => { setShow(true) }}> Войти</button></a> </>))}
                    {loading && <Load/>}
                </nav>
            </div>
        </header>

        {showForm && (
        <div className="modal-overlay" onClick={(e) => {
          // Закрываем только если кликнули именно на оверлей
          if (e.target === e.currentTarget) {
            setShow(false);
          }}}>
          <FormSignInSignUp setShow = {setShow} updateUser = {setCurrentUser}/>
        </div>
      )}
    </>
  );
};