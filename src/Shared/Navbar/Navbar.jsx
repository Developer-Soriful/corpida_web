import { Link, NavLink } from 'react-router';
import logo from '../../assets/image.png'
import { useAuth } from '../../context/UseAuth';

const Navbar = () => {
  const { user } = useAuth()

  // Role-based dashboard link
  const getDashboardLink = () => {
    if (user?.role === 'teacher') {
      return '/toturdashbord';
    } else if (user?.role === 'student') {
      return '/dashboard';
    }
    return '/admin';
  };

  return (
    <nav className="flex justify-between items-center p-5 px-20  ">
      <div className="logo">
        <img src={logo} alt="Logo" className="w-12" />
      </div>

      <ul className="flex space-x-6">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "font-semibold text-black" : ""
            }
          >
            Home
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/how-it-works"
            className={({ isActive }) =>
              isActive ? "font-semibold text-black" : ""
            }
          >
            How It Works
          </NavLink>
        </li>

        {/* Role-specific navigation */}
        {user?.role === 'student' && (
          <li>
            <NavLink
              to="/find-tutors"
              className={({ isActive }) =>
                isActive ? "font-semibold text-black" : ""
              }
            >
              Find Tutors
            </NavLink>
          </li>
        )}

        <li>
          <NavLink
            to="/student-review"
            className={({ isActive }) =>
              isActive ? "font-semibold text-black" : ""
            }
          >
            Student Review
          </NavLink>
        </li>
      </ul>

      {
        user ? (
          <div className="flex items-center space-x-2">
            <Link to={getDashboardLink()}>
              <img src={user?.avatar || '/uploads/users/user.png'} alt="user" className="w-9 h-9 rounded-full border" />
              <span className="font-medium text-[14px] text-[#585858]">{user.name}</span>
              <span className="text-xs text-gray-500 ml-1">({user.role})</span>
            </Link>
          </div>
        ) : (<div className="auth-links flex space-x-4"><Link to='/login'>
          <button className="bg-gradient-to-r from-[#FFC30B] via-[#9235bd] to-[#8113B5] text-[#FFFFFF] px-4 py-2 rounded-2xl cursor-pointer">
            Login
          </button>

        </Link>
          <Link to="/signup">
            <button className="bg-gradient-to-r from-[#6657E2] via-[#8113B5] to-[#903CD1] text-[#FFFFFF] px-4 py-2 rounded-2xl cursor-pointer">
              Sign Up
            </button>
          </Link>
        </div>)
      }
    </nav>
  );
};

export default Navbar;
