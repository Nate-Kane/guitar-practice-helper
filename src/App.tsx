import { FC, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import LandingPage from './pages/LandingPage';
import PracticesPage from './pages/PracticesPage';
import AdminPage from './pages/AdminPage';
import PracticePage from './pages/PracticePage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './tailwind.css';

const App: FC = () => {
  const [skillLevel, setSkillLevel] = useState<string>(() => {
    return localStorage.getItem('skillLevel') || "basics";
  });

  useEffect(() => {
    localStorage.setItem('skillLevel', skillLevel);
  }, [skillLevel]);

  return (
    <Router>
      <div className="min-h-screen bg-amber-50 flex flex-col">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<PracticesPage skillLevel={skillLevel} onSkillSelect={setSkillLevel} />} />
            <Route path="/practices" element={<PracticesPage skillLevel={skillLevel} onSkillSelect={setSkillLevel} />} />
            <Route path="/practice/:id" element={<PracticePage skillLevel={skillLevel} onSkillSelect={setSkillLevel} />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
