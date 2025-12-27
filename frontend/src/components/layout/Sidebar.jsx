import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiTool,
  FiClipboard,
  FiUsers,
  FiCalendar
} from "react-icons/fi";

const Sidebar = () => {
  const linkClass =
    "flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-700 transition";

  return (
    <aside className="w-64 bg-gray-900 text-white hidden md:flex flex-col">
      <div className="p-4 text-xl font-bold border-b border-gray-700">
        GearGuard
      </div>

      <nav className="flex-1 p-3 space-y-2">
        <NavLink to="/" className={linkClass}>
          <FiHome /> Dashboard
        </NavLink>

        <NavLink to="/equipment" className={linkClass}>
          <FiTool /> Equipment
        </NavLink>

        <NavLink to="/requests" className={linkClass}>
          <FiClipboard /> Requests
        </NavLink>

        <NavLink to="/calendar" className={linkClass}>
          <FiCalendar /> Calendar
        </NavLink>

        <NavLink to="/teams" className={linkClass}>
          <FiUsers /> Teams
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
