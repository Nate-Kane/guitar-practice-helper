import { FC } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import PracticesPage from './pages/PracticesPage';
import './App.css';

const App: FC = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/practices" element={<PracticesPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
