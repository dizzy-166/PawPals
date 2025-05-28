
import { CustomHeader } from './components/CustomHeader';
import { FindPet } from './pages/FindPet/FindPet';
import { Main } from './pages/main/Main';
import { Meetings } from './pages/Meetings/Meetings';
import './pages/styles/MainStyles.css'
import { YourPets } from './pages/YourPets/YourPets';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';


function App() {
  

  

  return (
    <>
    <Router>
      <CustomHeader/>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/find-pet" element={<FindPet />} />
        <Route path="/your-pets" element={<YourPets />} />
        <Route path="/meetings" element={<Meetings />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
