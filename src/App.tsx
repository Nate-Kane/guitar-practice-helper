import { FC } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PracticesPage from './pages/PracticesPage';
import AdminPage from './pages/AdminPage';
import PracticePage from './pages/PracticePage';
import GuidedLessonsPage from './pages/GuidedLessonsPage';
import MandolinPage from './pages/MandolinPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './tailwind.css';

const App: FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-stone-50 flex flex-col">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<PracticesPage />} />
            <Route path="/practices" element={<PracticesPage />} />
            <Route path="/practice/:slugOrId" element={<PracticePage />} />
            <Route path="/guided-lessons" element={<GuidedLessonsPage />} />
            <Route path="/mandolin" element={<MandolinPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
