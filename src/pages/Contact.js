import { useEffect, useState } from "react";
import api from "../constant/api";
import { motion, AnimatePresence } from "framer-motion";

export default function Contact() {

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [tempSearch, setTempSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);


  const [editUser, setEditUser] = useState(null);
const [formData, setFormData] = useState({
  name: "",
  email: "",
  phone: "",
  address_area: "",
  address_city: "",
  pincode: "",
  published: 1
});

const openEdit = (user) => {
  setEditUser(user);
  setFormData({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    address_area: user.address_area || "",
    address_city: user.address_city || "",
    pincode: user.pincode || "",
    published: user.published || 1
  });
};

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
};

const handleUpdate = () => {
  api.post(`/Ecom/updateUser/${editUser.user_id}`, formData)
    .then(() => {

      // 🔥 update UI instantly
      setUsers(prev =>
        prev.map(u =>
          u.user_id === editUser.user_id ? { ...u, ...formData } : u
        )
      );

      setEditUser(null);

    })
    .catch(err => console.log(err));
};

  const itemsPerPage = 5;

  // 🔥 FETCH USERS
  useEffect(() => {
    api.get("/Ecom/getAllUsers")
      .then(res => setUsers(res.data.data || []))
      .catch(err => console.log(err));
  }, []);

    const handleCall = (phone) => {
    window.open(`tel:${phone}`);
  };

  // 💬 WHATSAPP
  const handleWhatsApp = (phone) => {
    window.open(`https://wa.me/${phone}`);
  };

  // ✉️ EMAIL
  const handleEmail = (email) => {
    window.open(`mailto:${email}`);
  };

  // 🔍 SEARCH
  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.phone?.includes(search)
  );

  // 📄 PAGINATION
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <div className="p-4">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Contact List</h1>

        <button
          className="md:hidden bg-gray-800 text-white px-3 py-2 rounded"
          onClick={() => setShowFilter(true)}
        >
          Filter ⚙️
        </button>
      </div>

      {/* DESKTOP SEARCH */}
      <div className="hidden md:flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Search name / phone..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded w-72"
        />
      </div>

      {/* ===================== */}
      {/* DESKTOP TABLE */}
      {/* ===================== */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full bg-white rounded-xl shadow">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Created</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {currentUsers.map(user => (
              <tr key={user.user_id} className="text-center border-t hover:bg-gray-50">

                <td className="p-3">{user.user_id}</td>
                <td>{user.name}</td>
                <td>{user.email || "-"}</td>
                <td>{user.phone}</td>
                <td>{user.created_at?.slice(0, 10)}</td>
                
                <td className="flex justify-center gap-2 p-2">

                  <button onClick={() => handleCall(user.phone)} className="bg-blue-500 text-white px-2 rounded">📞</button>

                  <button onClick={() => handleWhatsApp(user.phone)} className="bg-green-500 text-white px-2 rounded">💬</button>

                  <button onClick={() => handleEmail(user.email)} className="bg-purple-500 text-white px-2 rounded">✉️</button>
                  <button
  onClick={() => openEdit(user)}
  className="bg-yellow-500 text-white px-2 rounded"
>
  ✏️
</button>

                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* ===================== */}
      {/* MOBILE CARD UI */}
      {/* ===================== */}
      <div className="md:hidden flex flex-col gap-3">
        {currentUsers.map(user => (
          <div key={user.user_id} className="bg-white p-4 rounded-xl shadow">

            <div className="flex justify-between">
              <h3 className="font-bold">#{user.user_id}</h3>
            </div>

            <p className="mt-2 font-semibold">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email || "-"}</p>
            <p className="text-sm">{user.phone}</p>

            <p className="text-xs text-gray-400 mt-1">
              {user.created_at?.slice(0, 10)}
            </p>
              <div className="flex gap-2 mt-2">

              <button onClick={() => handleCall(user.phone)} className="flex-1 bg-blue-500 text-white py-1 rounded">Call</button>

              <button onClick={() => handleWhatsApp(user.phone)} className="flex-1 bg-green-500 text-white py-1 rounded">WhatsApp</button>

              <button onClick={() => handleEmail(user.email)} className="flex-1 bg-purple-500 text-white py-1 rounded">Email</button>
               <button
  onClick={() => openEdit(user)}
  className="flex-1 bg-yellow-500 text-white py-1 rounded"
>
  ✏️
</button>
            </div>
          </div>
        ))}
      </div>

      {/* ===================== */}
      {/* PAGINATION */}
      {/* ===================== */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          onClick={() => setCurrentPage(p => p - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1 ? "bg-blue-500 text-white" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage(p => p + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded"
        >
          Next
        </button>
      </div>

      {/* ===================== */}
      {/* MOBILE FILTER */}
      {/* ===================== */}
      <AnimatePresence>
        {showFilter && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-[9998]"
              onClick={() => setShowFilter(false)}
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="fixed bottom-0 left-0 w-full bg-white p-4 rounded-t-2xl z-[9999]"
            >
              <input
                placeholder="Search"
                value={tempSearch}
                onChange={(e) => setTempSearch(e.target.value)}
                className="border w-full mb-3 p-2"
              />

              <button
                onClick={() => {
                  setSearch(tempSearch);
                  setShowFilter(false);
                  setCurrentPage(1);
                }}
                className="bg-blue-500 text-white w-full py-2 rounded"
              >
                Apply
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
  {editUser && (
    <>
      {/* BACKDROP */}
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 z-[9998]"
        onClick={() => setEditUser(null)}
      />

      {/* MODAL */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center z-[9999]"
      >
        <div className="bg-white w-full max-w-md p-5 rounded-xl shadow-lg">

          <h2 className="text-xl font-bold mb-4">Edit Contact</h2>

          {/* INPUTS */}
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="border w-full mb-3 p-2 rounded"
          />

          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="border w-full mb-3 p-2 rounded"
          />

          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="border w-full mb-3 p-2 rounded"
          />
           <input
            name="address_area"
            value={formData.address_area}
            onChange={handleChange}
            placeholder="Address 1"
            className="border w-full mb-3 p-2 rounded"
          />
           <input
            name="address_city"
            value={formData.address_city}
            onChange={handleChange}
            placeholder="Address 2"
            className="border w-full mb-3 p-2 rounded"
          />
           <input
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            placeholder="Pincode"
            className="border w-full mb-3 p-2 rounded"
          />

          {/* ACTION */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleUpdate}
              className="flex-1 bg-green-500 text-white py-2 rounded"
            >
              Update
            </button>

            <button
              onClick={() => setEditUser(null)}
              className="flex-1 bg-gray-400 text-white py-2 rounded"
            >
              Cancel
            </button>
          </div>

        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>

    </div>
  );
}