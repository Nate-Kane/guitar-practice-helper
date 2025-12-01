import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

const Footer: FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-amber-900 text-amber-50">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6">
            <button
              onClick={() => navigate('/')}
              className="text-amber-200 hover:text-white transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => navigate('/practice/xsFrdqxeyLbFM2puHGMs')}
              className="text-amber-200 hover:text-white transition-colors cursor-pointer"
            >
              Fretboard Mapper
            </button>
            <a
              href="https://www.natekaneofficial.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-200 hover:text-white transition-colors cursor-pointer"
            >
              Meet The Creator
            </a>
          </div>
          <div className="mt-8 md:mt-0">
            <p className="text-center md:text-right text-sm">
              <span className="flex items-center justify-center md:justify-end">
                Made with{' '}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mx-1 text-red-500">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                </svg>{' '}
                for guitarists everywhere
              </span>
              <span className="block mt-1">© 2025 GuitarHelp. All rights reserved.</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;