import { FC, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";
import { adminPaths } from "../../routes/admin.route";
import { userPaths } from "../../routes/user.route";
import { useAppDispatch } from "@/redux/hooks";
import { logOut } from "@/redux/features/auth/authSlice";
import { useGetMeQuery } from "@/redux/features/user/registerApi";

type UserRole = "admin" | "user";

interface SidebarProps {
  role: UserRole;
}

const Sidebar: FC<SidebarProps> = ({ role }) => {
  const dispatch = useAppDispatch();
  const { data: myData } = useGetMeQuery("");

  // ✅ Ensure Sidebar starts closed on mobile & open on larger screens
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 1024); // Open sidebar only for large screens
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const user = myData?.[0] || null;
  const menuItems = role === "admin" ? adminPaths : userPaths;

  const handleLogout = () => {
    dispatch(logOut());
  };

  return (
    <>
      {/* Burger Icon - Mobile Only */}
      {!isOpen && (
        <button
          className="fixed top-4 left-4 z-50 text-gray-700 text-2xl lg:hidden"
          onClick={() => setIsOpen(true)}
        >
          <FaBars />
        </button>
      )}

      {/* Sidebar Overlay - Only on Mobile */}
      {isOpen && window.innerWidth < 1024 && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar Container */}
      <div
        className={`fixed top-0 left-0 h-screen bg-white shadow-lg z-50 w-64 p-4 transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0 lg:w-64`}
      >
        {/* Close Icon - Mobile Only */}
        {window.innerWidth < 1024 && (
          <button
            className="absolute top-4 right-4 text-gray-700 text-2xl lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <FaTimes />
          </button>
        )}

        {/* Sidebar Header */}
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Dashboard - v1.0
        </h2>

        {/* Navigation Links */}
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.path}
              to={`/dashboard/${role}/${item.path}`}
              label={item.name}
              icon={item.icon}
            />
          ))}
        </nav>

        {/* User Profile and Actions */}
        <div className="mt-auto border-t pt-4 flex items-center justify-between absolute bottom-0 w-55 mb-2">
          <div className="flex items-center space-x-3">
            <FaUserCircle size={34} className="text-gray-600" />
            <div>
              {user ? (
                <>
                  <p className="text-gray-900 font-medium">{user.name}</p>
                  <p className="text-gray-500 text-sm capitalize">{role}</p>
                </>
              ) : (
                <p className="text-gray-500">Guest</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleLogout}
              className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition flex items-center justify-center"
            >
              <FaSignOutAlt size={18} />
            </button>
            <NavLink to="/">
              <button className="p-2 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition flex items-center justify-center">
                <FaHome size={18} />
              </button>
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

// Sidebar Item Component
interface SidebarItemProps {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const SidebarItem: FC<SidebarItemProps> = ({ to, label, icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-200 transition ${
        isActive ? "bg-gray-300" : ""
      }`
    }
  >
    {icon}
    <span className="ml-3">{label}</span>
  </NavLink>
);

export default Sidebar;
