import './pages/styles/MainStyles.css'
import { useEffect, useState } from 'react';
import { FormSignInSignUp } from './pages/FormSignInSignUp/FormSignInSignUp';
import supabase from './Domain/Utils/Constant';
import { Load } from './components/Load';


function App() {
  // let component
  // switch(window.location.pathname){
  //   case "/":
  //     component = <SignIn/>
  //     break
  //   case "/registr":
  //     component = <SignUp/>
  //     break
  // }

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
                <a href="" class="active">Главная</a>
                <a href="">Найти питомца</a>
                <a href="">Ваши питомцы</a>
                <a href="">Встречи</a>
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
}

export default App;
