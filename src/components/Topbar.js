import { useNavigate } from "react-router-dom";

export default function Topbar({ setIsOpen }) {

  const navigate = useNavigate();

  const handleLogout = () => {
    // 🔥 remove auth data (adjust based on your app)
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // redirect to login
    navigate("/login");
  };

  return (
    <div className="h-16 bg-white dark:bg-gray-900 shadow flex items-center justify-between px-4 md:ml-64">

      {/* Mobile Menu Button */}
      <button
        className="text-2xl md:hidden"
        onClick={() => setIsOpen(true)}
      >
        ☰
      </button>

      <h1 className="text-lg font-semibold dark:text-white">
        AK Ceramic World
      </h1>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3">

        {/* USER */}
        <span className="hidden md:block text-gray-600 dark:text-gray-300">
          Rafi
        </span>

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg shadow transition"
        >
          Logout
        </button>

      </div>

    </div>
  );
}