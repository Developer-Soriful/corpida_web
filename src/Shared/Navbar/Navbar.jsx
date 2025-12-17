import { Link, NavLink } from 'react-router';
import logo from '../../assets/image.png'
import { useAuth } from '../../context/UseAuth';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Role-based dashboard link
  const getDashboardLink = () => {
    if (user?.role === 'teacher') {
      return '/toturdashbord';
    } else if (user?.role === 'student') {
      return '/dashboard';
    }
    return '/admin';
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="relative flex justify-between items-center py-5 px-4 lg:px-20 ">
      <div className="logo z-50">
        <Link to="/">
          <img src={logo} alt="Logo" className="w-12" />
        </Link>
      </div>

      {/* Desktop Navigation */}
      <ul className="hidden lg:flex space-x-6">
        <li>
          <a
            href="/#home"
            className="text-gray-600 hover:text-black transition-colors"
          >
            Home
          </a>
        </li>

        <li>
          <a
            href="/#work"
            className="text-gray-600 hover:text-black transition-colors"
          >
            How It Works
          </a>
        </li>

        {/* Role-specific navigation */}
        {user?.role === 'student' && (
          <li>
            <NavLink
              to="/dashboard/findtutors"
              className={({ isActive }) =>
                isActive ? "font-semibold text-black" : "text-gray-600 hover:text-black transition-colors"
              }
            >
              Find Tutors
            </NavLink>
          </li>
        )}

        <li>
          <a
            href="/#testimonial"
            className="text-gray-600 hover:text-black transition-colors"
          >
            Student Review
          </a>
        </li>
      </ul>

      {/* Desktop Auth/Profile */}
      <div className="hidden lg:block">
        {
          user ? (
            <div className="flex items-center space-x-2">
              <Link to={getDashboardLink()} className="flex items-center gap-2">
                <img src={user?.avatar || '/uploads/users/user.png'} alt="user" className="w-9 h-9 rounded-full border object-cover" />
                <div className="flex flex-col leading-tight">
                  <span className="font-medium text-[14px] text-[#585858]">{user.name}</span>
                  <span className="text-xs text-gray-500">({user.role})</span>
                </div>
              </Link>
            </div>
          ) : (<div className="auth-links flex space-x-4">
            <Link to='/login'>
              <button className="bg-gradient-to-r from-[#FFC30B] via-[#9235bd] to-[#8113B5] text-[#FFFFFF] px-4 py-2 rounded-2xl cursor-pointer hover:shadow-lg transition-transform active:scale-95">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="bg-gradient-to-r from-[#6657E2] via-[#8113B5] to-[#903CD1] text-[#FFFFFF] px-4 py-2 rounded-2xl cursor-pointer hover:shadow-lg transition-transform active:scale-95">
                Sign Up
              </button>
            </Link>
          </div>)
        }
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="lg:hidden z-50 p-2 rounded-md hover:bg-gray-100 transition-colors"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-white z-40 lg:hidden flex flex-col items-center justify-center space-y-8 transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-full invisible'
        }`}>
        <ul className="flex flex-col items-center space-y-6 text-xl">
          <li>
            <a href="/#home" onClick={toggleMenu} className="text-gray-700">
              Home
            </a>
          </li>
          <li>
            <a href="/#work" onClick={toggleMenu} className="text-gray-700">
              How It Works
            </a>
          </li>
          {user?.role === 'student' && (
            <li>
              <NavLink to="/dashboard/findtutors" onClick={toggleMenu} className={({ isActive }) => isActive ? "font-bold text-[#8113B5]" : "text-gray-700"}>
                Find Tutors
              </NavLink>
            </li>
          )}
          <li>
            <a href="/#testimonial" onClick={toggleMenu} className="text-gray-700">
              Student Review
            </a>
          </li>
        </ul>

        {/* Mobile Auth/Profile */}
        <div className="flex flex-col items-center gap-4">
          {user ? (
            <Link to={getDashboardLink()} onClick={toggleMenu} className="flex flex-col items-center gap-2">
              <img src={user?.avatar || '/uploads/users/user.png'} alt="user" className="w-16 h-16 rounded-full border-2 border-[#8113B5] object-cover" />
              <span className="font-semibold text-lg text-gray-800">{user.name}</span>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-wide">{user.role}</span>
            </Link>
          ) : (
            <div className="flex flex-col gap-4 w-full">
              <Link to='/login' onClick={toggleMenu}>
                <button className="w-full min-w-[200px] bg-gradient-to-r from-[#FFC30B] via-[#9235bd] to-[#8113B5] text-[#FFFFFF] px-6 py-3 rounded-full font-semibold shadow-md active:scale-95 transition-all">
                  Login
                </button>
              </Link>
              <Link to="/signup" onClick={toggleMenu}>
                <button className="w-full min-w-[200px] bg-gradient-to-r from-[#6657E2] via-[#8113B5] to-[#903CD1] text-[#FFFFFF] px-6 py-3 rounded-full font-semibold shadow-md active:scale-95 transition-all">
                  Sign Up
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
