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
import logo from './resorce/logo.png' 


function App() {
  const [currentUser, setCurrentUser] = useState(null)       // Состояние текущего пользователя
  const [loading, setLoading] = useState(true)               // Флаг загрузки (например, для отображения спиннера)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Получаем текущего пользователя из Supabase
        const { data: { user } } = await supabase.auth.getUser()
        setCurrentUser(user)
      } catch (error) {
        setCurrentUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  // Функция выхода из аккаунта
  const getOuting = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setCurrentUser(null)
    }
  }

  return (
    <Router>
      <CustomHeader
        loading={loading}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        logoPhoto = {logo}
      />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/find-pet" element={<FindPet />} />
        <Route path="/your-pets" element={<YourPets />} />
        <Route path="/meetings" element={<Meetings />} />
        <Route path="/profile" element={<ProfilePage getOuting={getOuting} />} />
      </Routes>
    </Router>
  )
}

export default App
