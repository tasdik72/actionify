import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/logo.svg" 
              alt="Actionify Logo" 
              className="w-10 h-10"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Actionify</h1>
              <p className="text-xs text-gray-500">Meeting Analysis</p>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/features" 
              className={`font-medium transition-colors ${
                isActive('/features') 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Features
            </Link>
            <Link 
              to="/pricing" 
              className={`font-medium transition-colors ${
                isActive('/pricing') 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Pricing
            </Link>
            <Link 
              to="/about" 
              className={`font-medium transition-colors ${
                isActive('/about') 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              About
            </Link>
            <Link 
              to="/actionify" 
              className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-all duration-200"
            >
              Get Started
            </Link>
          </nav>
          
          <button className="md:hidden p-2 text-gray-600">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;