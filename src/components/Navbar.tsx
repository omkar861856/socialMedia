import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, User, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Home className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-semibold">SocialApp</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/profile" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </Link>
                <button 
                  onClick={() => supabase.auth.signOut()} 
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link 
                to="/auth" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;