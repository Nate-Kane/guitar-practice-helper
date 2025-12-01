import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar: FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-amber-900 text-amber-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2"
            >
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-amber-900">
                  <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"></path>
                  <path d="M15 5.764v15"></path>
                  <path d="M9 3.236v15"></path>
                </svg>
              </div>
              <span className="text-xl font-bold tracking-wide">Map My Guitar</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-amber-700 transition-colors cursor-pointer"
              >
                Home
              </button>
              <button
                onClick={() => navigate('/practice/xsFrdqxeyLbFM2puHGMs')}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-amber-700 transition-colors cursor-pointer"
              >
                Fretboard Mapper
              </button>
              <a
                href="https://www.natekaneofficial.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-amber-700 transition-colors cursor-pointer"
              >
                Meet The Creator
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-amber-50 hover:bg-amber-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <path d="M4 12h16"></path>
                <path d="M4 18h16"></path>
                <path d="M4 6h16"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button
                onClick={() => {
                  navigate('/');
                  setIsMenuOpen(false);
                }}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-amber-700 transition-colors w-full text-left cursor-pointer"
              >
                Home
              </button>
              <button
                onClick={() => {
                  navigate('/practice/xsFrdqxeyLbFM2puHGMs');
                  setIsMenuOpen(false);
                }}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-amber-700 transition-colors w-full text-left cursor-pointer"
              >
                Fretboard Mapper
              </button>
              <a
                href="https://www.natekaneofficial.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-amber-700 transition-colors w-full text-left cursor-pointer"
              >
                Meet The Creator
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;