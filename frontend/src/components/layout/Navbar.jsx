import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="h-14 bg-white border-b flex items-center justify-between px-4">
      <h1 className="text-lg font-semibold">GearGuard</h1>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {user?.name || "User"}
        </span>

        <button
          onClick={logout}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
