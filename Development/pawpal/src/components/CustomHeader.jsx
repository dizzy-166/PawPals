import React from 'react';
import { Load } from './Load';
import { useEffect, useState } from 'react';
import supabase from '../Domain/Utils/Constant';
import { FormSignInSignUp } from '../pages/FormSignInSignUp/FormSignInSignUp';
import { Link, NavLink } from 'react-router-dom';

 export const CustomHeader = () => {

    const [currentUser, setCurrentUser] = useState(null); // Начальное значение `null`
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      // Асинхронная функция внутри useEffect
      const fetchUser = async () => {
        try {
          // Получаем текущую сессию (если пользователь авторизован)
          const { data: { user } } = await supabase.auth.getUser();
          setCurrentUser(user); // Обновляем состояние
        } catch (error) {
          setCurrentUser(null); // Если ошибка, сбрасываем пользователя
        }
        finally {
          setLoading(false);
        }
      };
  
      fetchUser(); // Вызываем функцию
    }, []);
  
    const [showForm, setShow] = useState(false)
  
    const getOuting = async () =>{
      const {error} = supabase.auth.signOut()
      if(error){
        return
      }
      else{
        setCurrentUser(null)
      }
    }

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
                    {!loading && (currentUser ? (<> <a class="no-underline"> <button onClick={getOuting}> Выйти</button></a> </>) : (<> <a class="no-underline"> <button onClick={(e) => { setShow(true) }}> Войти</button></a> </>))}
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
          (<FormSignInSignUp setShow = {setShow} updateUser = {setCurrentUser}/>)
        </div>
      )}
    </>
  );
};