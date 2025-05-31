import { Load } from './Load';
import { useEffect, useState } from 'react';
import supabase from '../Domain/Utils/Constant';
import { FormSignInSignUp } from '../pages/FormSignInSignUp/FormSignInSignUp';
import { Link, NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


// статичный хедер сайта
// передается метод загрузки пользователя, информация о текущем пользователе (если есть), и состояние загрузки пользователя
 export const CustomHeader = ({loading, currentUser, setCurrentUser}) => {

  const [showForm, setShow] = useState(false) // useState для формы регистрации и авторизации
  
  const navigate = useNavigate(); // использование навигации

  const goToProfile = () => {
    navigate('/profile'); // навигация на профиль пользователя
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

        {/* логика отображения формы регистрации и авторизации */}
        {showForm && (
        <div className="modal-overlay" onClick={(e) => {
          // Закрываем только если кликнули именно на оверлей
          if (e.target === e.currentTarget) {
            setShow(false);
          }}}>
          <FormSignInSignUp setShow = {setShow} updateUser = {setCurrentUser}/> {/* открываем форму и передаем функцию для смены пользователя */}
        </div>
      )}
    </>
  );
};