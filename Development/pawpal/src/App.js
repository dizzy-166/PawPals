import { CustomHeader } from './components/CustomHeader';
import { FindPet } from './pages/FindPet/FindPet';
import { MainPage } from './pages/main/MainPage';
import { Meetings } from './pages/Meetings/Meetings';
import ProfilePage from './pages/PerosnalAccount/ProfilePage';
import './pages/styles/MainStyles.css'
import { YourPets } from './pages/YourPets/YourPets';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import supabase from './Domain/Utils/Constant';



function App() {
  

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
    <Router>
      <CustomHeader loading={loading} currentUser={currentUser} setCurrentUser={setCurrentUser}/>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/find-pet" element={<FindPet />} />
        <Route path="/your-pets" element={<YourPets />} />
        <Route path="/meetings" element={<Meetings />} />
        <Route path="/profile" element={<ProfilePage getOuting={getOuting}/>} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
