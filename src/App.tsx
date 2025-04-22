import { FC, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import PracticesPage from './pages/PracticesPage';
import AdminPage from './pages/AdminPage';
import PracticePage from './pages/PracticePage';
import './App.css';

const App: FC = () => {
  const [skillLevel, setSkillLevel] = useState<string>(() => {
    return localStorage.getItem('skillLevel') || "basics";
  });

  useEffect(() => {
    localStorage.setItem('skillLevel', skillLevel);
  }, [skillLevel]);

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<LandingPage onSkillSelect={setSkillLevel} />} />
          <Route path="/practices" element={<PracticesPage skillLevel={skillLevel} onSkillSelect={setSkillLevel} />} />
          <Route path="/practice/:id" element={<PracticePage skillLevel={skillLevel}  onSkillSelect={setSkillLevel}  />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
