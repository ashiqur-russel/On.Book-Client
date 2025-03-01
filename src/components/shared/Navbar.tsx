import { useState } from "react";
import {
  AiOutlineSearch,
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineLock,
  AiOutlineLogout,
} from "react-icons/ai";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { logOut, selectCurrentUser } from "../../redux/features/auth/authSlice";
import { ShoppingBag } from "lucide-react";
import { selectCurrentStore } from "@/redux/features/product/productSlice";
import { toggleCart } from "@/redux/features/global/globalSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logOut());
    navigate("/signin");
  };

  const openCartHandler = () => {
    dispatch(toggleCart());
  };

  const { cart } = useAppSelector(selectCurrentStore);
  const totalItems = cart.length | 0;

  return (
    <nav className="fixed bg-black z-40 w-full px-3 md:px-10 lg:px-24 py-4">
      <div className="flex items-center justify-between w-full">
        {/* Logo & Desktop Navigation */}
        <div className="flex items-center space-x-8">
          <h1 className="text-3xl font-bold text-white">
            <NavLink to={"/"} className="hover:text-gray-300">
              On.Book
            </NavLink>
          </h1>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6">
            <NavLink
              to="/products"
              className="text-white font-medium hover:text-gray-300 transition"
            >
              Books
            </NavLink>

            {user && (
              <NavLink
                to={`/dashboard/${user.role}`}
                className="text-white font-medium hover:text-gray-300 transition"
              >
                Dashboard
              </NavLink>
            )}
          </div>
        </div>

        <div className="hidden lg:flex items-center space-x-6">
          {/* Search Bar */}
          <div className="relative flex items-center">
            <AiOutlineSearch className="hidden text-white w-5 h-5 absolute left-2" />
            <input
              disabled
              type="text"
              placeholder="Search book..."
              className="border-b w-0 hidden border-gray-300 pl-8 pr-4 py-1 text-sm text-white focus:outline-none focus:border-gray-500"
            />
          </div>

          {/* Login / Logout Button */}
          {user ? (
            <>
              <div
                onClick={openCartHandler}
                className="relative cursor-pointer text-white hover:text-gray-300 transition"
              >
                <ShoppingBag width={18} />
                {totalItems > 0 && (
                  <span className="absolute inline-flex size-3 -top-3 bg-amber-100 text-amber-700 -right-2 rounded-full text-center items-center p-2 justify-center text-sm">
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-white hover:text-gray-300 font-medium transition"
              >
                <AiOutlineLogout className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="flex gap-4">
              <div
                onClick={openCartHandler}
                className="relative cursor-pointer text-white hover:text-gray-300 transition"
              >
                <ShoppingBag width={18} />
                {totalItems > 0 && (
                  <span className="absolute inline-flex size-3 -top-3 bg-amber-100 text-amber-700 -right-2 rounded-full text-center items-center p-2 justify-center text-sm">
                    {totalItems}
                  </span>
                )}
              </div>

              <NavLink
                to={"/signin"}
                className="flex items-center space-x-1 text-white hover:text-gray-300 font-medium transition"
              >
                <AiOutlineLock className="w-5 h-5" />
                <span>Login</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <AiOutlineClose className="w-6 h-6" />
          ) : (
            <AiOutlineMenu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 z-30 h-full w-64 bg-black shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          <span className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">Menu</h2>
            <ShoppingBag size={18} className="text-white" />
          </span>
          <button
            className="text-white focus:outline-none hover:text-gray-300"
            onClick={() => setMenuOpen(false)}
          >
            <AiOutlineClose className="w-6 h-6" />
          </button>
        </div>
        <ul className="p-4 space-y-4">
          <li>
            <NavLink
              to="/products"
              className="text-white hover:text-gray-300 transition"
              onClick={() => setMenuOpen(false)}
            >
              Books
            </NavLink>
          </li>

          {user && (
            <li>
              <NavLink
                to={`/dashboard/${user.role}`}
                className="text-white hover:text-gray-300 transition"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </NavLink>
            </li>
          )}

          {/* Login / Logout Button */}
          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-white hover:text-gray-300 font-medium transition"
            >
              <AiOutlineLogout className="w-5 h-5" />
              <span>Logout</span>
            </button>
          ) : (
            <>
              <NavLink
                to={"/signin"}
                className="flex items-center space-x-1 text-white hover:text-gray-300 font-medium transition"
              >
                <AiOutlineLock className="w-5 h-5" />
                <span>Login</span>
              </NavLink>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
