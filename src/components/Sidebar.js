import { NavLink } from "react-router-dom";

export default function Sidebar({ isOpen, setIsOpen }) {
  return (
    <div
      className={`fixed z-50 top-0 left-0 h-full w-64 bg-slate-900 text-white p-6 transform 
      ${isOpen ? "translate-x-0" : "-translate-x-full"} 
      md:translate-x-0 transition-transform duration-300 shadow-2xl`}
    >

      <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>

      <ul className="space-y-4">

        {/* Dashboard */}
        <li>
          <NavLink
            to="/"
            onClick={() => setIsOpen(false)}  // ✅ close sidebar on mobile
            className={({ isActive }) =>
              isActive
                ? "block text-white font-bold"
                : "block text-gray-300 hover:text-white"
            }
          >
            Dashboard
          </NavLink>
        </li>

        {/* Products */}
        <li>
          <NavLink
            to="/products"   // ⚠️ lowercase recommended
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              isActive
                ? "block text-white font-bold"
                : "block text-gray-300 hover:text-white"
            }
          >
            Products
          </NavLink>
        </li>

          <li>
          <NavLink
            to="/Order"   // ⚠️ lowercase recommended
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              isActive
                ? "block text-white font-bold"
                : "block text-gray-300 hover:text-white"
            }
          >
            Order
          </NavLink>
        </li>

         <li>
          <NavLink
            to="/Contact"   // ⚠️ lowercase recommended
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              isActive
                ? "block text-white font-bold"
                : "block text-gray-300 hover:text-white"
            }
          >
            Contact
          </NavLink>
        </li>

          <li>
          <NavLink
            to="/Offer"   // ⚠️ lowercase recommended
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              isActive
                ? "block text-white font-bold"
                : "block text-gray-300 hover:text-white"
            }
          >
            Offers
          </NavLink>
        </li>

      </ul>

    </div>
  );
}