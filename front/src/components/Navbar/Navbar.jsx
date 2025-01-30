import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUser, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaPlusCircle } from 'react-icons/fa';
import { LOGO } from '../../constants/Logo';
import { NAME_APP } from '../../constants/NameApp';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const isAuthenticated = useSelector((state) => !!state.auth.token);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-black">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">
          <NavLink to="/" className="flex items-center text-white">
            <img src={LOGO} alt="Logo" className="w-10 h-10 mr-2" />
            {NAME_APP}
          </NavLink>
        </div>
        <div className="flex items-center">
          {isAuthenticated ? (
            <>
              <NavLink
                to="/createSmasher"
                className={({ isActive }) =>
                        isActive
                          ? "bg-gray-700 text-white  px-5 py-5 flex items-center"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white  px-5 py-5 flex items-center"
                      }
                    >
                <FaUser className="mr-1" />
                Créer Smasher
              </NavLink>
              <NavLink
              to="/connectedUsers"
              className={({ isActive }) =>
                      isActive
                        ? "bg-gray-700 text-white  px-5 py-5 flex items-center"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white  px-5 py-5 flex items-center"
                    }
                  >
                <FaUser className="mr-1" />
                Utilisateurs
              </NavLink> 
              <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive
                  ? "bg-gray-700 text-white px-3 py-3 flex items-center"
                  : "text-gray-300 hover:bg-gray-700 px-3 py-3 flex items-center"
              }
            >
              <img
                src="https://www.francetvinfo.fr/pictures/KI83JKIWxYVA8ng-cUtYxM6l-z8/1200x1200/2016/08/23/shrek-5.jpg"
                alt="Profile"
                className="rounded-full"
                style={{ width: '40px', height: '40px' }}
              />
            </NavLink>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white  px-5 py-5 flex items-center"
              >
                <FaSignOutAlt className="mr-1" />
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive
                    ? "bg-gray-700 text-white  px-5 py-5 flex items-center"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white  px-5 py-5 flex items-center"
                }
              >
                <FaSignInAlt className="mr-1" />
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive
                    ? "bg-gray-700 text-white  px-5 py-5 flex items-center"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white  px-5 py-5 flex items-center"
                }
              >
                <FaUserPlus className="mr-1" />
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}