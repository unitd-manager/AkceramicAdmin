import { useEffect, useState } from "react";
import api from "../constant/api";
import { motion, AnimatePresence } from "framer-motion";
import Calendar from "react-calendar";
import moment from "moment";
import "react-calendar/dist/Calendar.css";
import { FaPlus, FaCalendarAlt } from "react-icons/fa";

export default function Customers() {

  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [showAdd, setShowAdd] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const [todayCount, setTodayCount] = useState(0);
  const [reminderList, setReminderList] = useState([]);

  const itemsPerPage = 5;
  const today = moment().format("YYYY-MM-DD");

    const handleCall = (phone) => {
    window.open(`tel:${phone}`);
  };

  const emptyForm = {
    name: "",
    phone: "",
    description: "",
    followup_date: "",
    visit_date: "",
    status: "Pending"
  };

const handleVisitConfirm = async (c) => {
  const current = Number(c.visit_confirm); // ✅ FIX
  const newValue = current === 1 ? 0 : 1;

  try {
    await api.post(`Product/updateVisitConfirm/${c.customer_id}`, {
      visit_confirm: newValue
    });

    // ✅ instant UI update
    setCustomers(prev =>
      prev.map(item =>
        item.customer_id === c.customer_id
          ? { ...item, visit_confirm: newValue }
          : item
      )
    );

  } catch (err) {
    console.log(err);
  }
};

  const [formData, setFormData] = useState(emptyForm);

  // ================= FETCH =================
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    api.get("Product/getCustomers").then(res => {
      const data = res.data.data || [];
      setCustomers(data);

      setTodayCount(data.filter(c => c.visit_date === today).length);
      setReminderList(data.filter(c => c.followup_date === today));
    });
  };

  // ================= SEARCH =================
  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  );

  // ================= PAGINATION =================
  const indexOfLast = currentPage * itemsPerPage;
  const currentData = filtered.slice(indexOfLast - itemsPerPage, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  // ================= FORMAT DATE =================
  const formatDate = (date) => {
    if (!date) return "-";
    return moment(date, ["YYYY-MM-DD", "DD-MM-YYYY"]).format("DD-MM-YYYY");
  };

  // ================= STATUS COLOR =================
const statusColor = (s) =>
  s === "Done" ? "bg-green-500" :
  s === "Missed" ? "bg-red-500" :
  s === "Enquiry" ? "bg-gray-500" :
  "bg-yellow-500";

  const isToday = (d) => d === today;

  // ================= WHATSAPP =================
  const sendWhatsApp = (phone, name) => {
    const msg = `Hello ${name}, Follow-up reminder from AK Ceramic World`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`);
  };

  // ================= ADD =================
  const handleAdd = () => {
    const payload = {
      ...formData,
      followup_date: formData.followup_date,
      visit_date: formData.visit_date
    };

    api.post("Product/addCustomer", payload).then(() => {
      fetchData();
      setShowAdd(false);
      setFormData(emptyForm);
    });
  };

  // ================= EDIT =================
  const openEdit = (c) => {
    setEditCustomer(c);

    setFormData({
      ...c,
      followup_date: c.followup_date
        ? moment(c.followup_date, ["DD-MM-YYYY", "YYYY-MM-DD"]).format("YYYY-MM-DD")
        : "",
      visit_date: c.visit_date
        ? moment(c.visit_date, ["DD-MM-YYYY", "YYYY-MM-DD"]).format("YYYY-MM-DD")
        : ""
    });
  };

  // ================= UPDATE =================
  const handleUpdate = () => {
    const payload = {
      ...formData,
      followup_date: formData.followup_date,
      visit_date: formData.visit_date
    };

    api.post(`Product/updateCustomer/${editCustomer.customer_id}`, payload)
      .then(() => {
        fetchData();
        setEditCustomer(null);
      });
  };

  // ================= CALENDAR MARK =================
  const tileContent = ({ date }) => {
    const d = moment(date).format("YYYY-MM-DD");
    const match = customers.find(c => c.followup_date === d);
    if (match) return <div className="text-red-500 text-xs">🔔</div>;
  };

  return (
    <div className="p-4">

      {/* DASHBOARD */}
      <div className="bg-blue-500 text-white p-4 rounded-xl mb-4 shadow">
        <h2>Today Visits</h2>
        <p className="text-3xl font-bold">{todayCount}</p>
      </div>

      {/* REMINDER */}
      <AnimatePresence>
        {reminderList.length > 0 && (
          <motion.div
            initial={{ y: -80 }}
            animate={{ y: 0 }}
            exit={{ y: -80 }}
            className="bg-yellow-400 p-3 mb-4 rounded shadow"
          >
            🔔 Today Follow-ups: {reminderList.length}
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <input
          placeholder="Search..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="border p-2 rounded w-40 md:w-60"
        />

        <div className="flex gap-2">
          <button
            onClick={()=>setShowCalendar(!showCalendar)}
            className="bg-purple-500 text-white p-2 rounded"
          >
            <FaCalendarAlt />
          </button>

          <button
            onClick={()=>setShowAdd(true)}
            className="hidden md:block bg-blue-500 text-white px-4 py-2 rounded"
          >
            + Add
          </button>
        </div>
      </div>

      {/* CALENDAR */}
      {showCalendar && (
        <div className="bg-white p-4 rounded-xl shadow mb-4">
          <Calendar tileContent={tileContent} />
        </div>
      )}

      {/* DESKTOP TABLE */}
      <div className="hidden md:block">
        <table className="w-full bg-white rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Follow Date</th>
              <th>Status</th>
               <th>Follow Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {currentData.map(c => (
              <tr key={c.customer_id}
                className={`text-center border-t ${
                  isToday(c.followup_date) && "bg-yellow-100 animate-pulse"
                }`}
              >
                <td>{c.name}</td>
                <td>{c.phone}</td>
                <td>{formatDate(c.followup_date)}</td>

                <td>
                  <span className={`text-white px-2 py-1 rounded ${statusColor(c.status)}`}>
                    {c.status}
                  </span>
                </td>
                <td>
                  <span className={`text-xs px-2 py-1 rounded text-white ${
  c.visit_confirm === 1 ? "bg-green-500" : "bg-red-500"
}`}>
  {c.visit_confirm === 1 ? "Visited" : "Not Visited"}
</span>
                </td>
       
                <td className="flex gap-2 justify-center p-2">
                   <button onClick={() => handleCall(c.phone)} className="bg-blue-500 text-white px-2 rounded">📞</button>
                  <button onClick={()=>sendWhatsApp(c.phone,c.name)} className="bg-green-500 px-2 text-white rounded">💬</button>
                  <button onClick={()=>openEdit(c)} className="bg-yellow-500 px-2 text-white rounded">✏️</button>
         <div
  onClick={() => handleVisitConfirm(c)}
  className={`relative w-16 h-7 flex items-center rounded-full px-1 cursor-pointer transition
    ${Number(c.visit_confirm) === 1 ? "bg-green-500" : "bg-gray-300"}
  `}
>
  <span className="absolute left-2 text-[10px] text-white font-semibold">
    {Number(c.visit_confirm) === 1 ? "YES" : ""}
  </span>

  <span className="absolute right-2 text-[10px] text-gray-700 font-semibold">
    {Number(c.visit_confirm) === 1 ? "" : "NO"}
  </span>

  <div
    className={`bg-white w-5 h-5 rounded-full shadow transform transition
      ${Number(c.visit_confirm) === 1 ? "translate-x-9" : ""}
    `}
  />
</div>  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE */}
     <div className="md:hidden flex flex-col gap-3">
  {currentData.map(c => (
    <div
      key={c.customer_id}
      className={`bg-white p-4 rounded-xl shadow ${
        isToday(c.followup_date) && "border-2 border-yellow-400"
      }`}
    >
      {/* NAME */}
      <h3 className="font-bold text-sm">{c.name}</h3>

      {/* PHONE */}
      <p className="text-sm">{c.phone}</p>

      {/* DATE */}
      <p className="text-xs text-gray-500">
        {formatDate(c.followup_date)}
      </p>

      {/* STATUS + VISIT */}
      <div className="flex items-center gap-2 mt-1 flex-wrap">
        <span
          className={`text-white px-2 py-1 rounded text-xs ${statusColor(c.status)}`}
        >
          {c.status}
        </span>

        <span
          className={`text-xs px-2 py-1 rounded text-white ${
            c.visit_confirm === 1 ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {c.visit_confirm === 1 ? "Visited" : "Not Visited"}
        </span>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center justify-between gap-2 mt-3">

        {/* CALL */}
        <button
          onClick={() => handleCall(c.phone)}
          className="bg-blue-500 text-white px-3 py-1 rounded text-xs"
        >
          📞
        </button>

        {/* WHATSAPP */}
        <button
          onClick={() => sendWhatsApp(c.phone, c.name)}
          className="flex-1 bg-green-500 text-white py-1 rounded text-xs"
        >
          WhatsApp
        </button>

        {/* EDIT */}
        <button
          onClick={() => openEdit(c)}
          className="flex-1 bg-yellow-500 text-white py-1 rounded text-xs"
        >
          Edit
        </button>

        {/* 🔥 TOGGLE SWITCH (REPLACED BUTTON) */}
       <div
  onClick={() => handleVisitConfirm(c)}
  className={`relative w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition
    ${Number(c.visit_confirm) === 1 ? "bg-green-500" : "bg-gray-300"}
  `}
>
  <div
    className={`bg-white w-5 h-5 rounded-full shadow transform transition
      ${Number(c.visit_confirm) === 1 ? "translate-x-6" : ""}
    `}
  />
</div>

      </div>
    </div>
  ))}
</div>

      {/* FLOAT BUTTON */}
      <button
        onClick={()=>setShowAdd(true)}
        className="fixed bottom-6 right-5 bg-blue-500 text-white w-14 h-14 flex items-center justify-center rounded-full shadow-xl md:hidden"
      >
        <FaPlus />
      </button>

      {/* PAGINATION */}
      <div className="flex justify-center mt-4 gap-2">
        {[...Array(totalPages)].map((_,i)=>(
          <button key={i}
            onClick={()=>setCurrentPage(i+1)}
            className={`px-3 py-1 border ${
              currentPage===i+1 ? "bg-blue-500 text-white": ""
            }`}
          >
            {i+1}
          </button>
        ))}
      </div>

      {/* ================= ADD MODAL ================= */}
      <AnimatePresence>
        {showAdd && (
          <>
            <motion.div className="fixed inset-0 bg-black bg-opacity-50"
              onClick={()=>setShowAdd(false)} />

            <motion.div className="fixed inset-0 flex justify-center items-center">
              <div className="bg-white p-5 rounded-xl w-full max-w-md">

                <h2 className="text-xl mb-3">Add Customer</h2>

                <input className="input" placeholder="Name"
                  value={formData.name}
                  onChange={e=>setFormData({...formData,name:e.target.value})} />

                <input className="input" placeholder="Phone"
                  value={formData.phone}
                  onChange={e=>setFormData({...formData,phone:e.target.value})} />

                <textarea className="input" placeholder="Description"
                  value={formData.description}
                  onChange={e=>setFormData({...formData,description:e.target.value})} />

                <input type="date" className="input"
                  value={formData.followup_date || ""}
                  onChange={e=>setFormData({...formData,followup_date:e.target.value})} />

                <div className="flex gap-2 mt-3">
                  <button onClick={handleAdd}
                    className="flex-1 bg-green-500 text-white py-2 rounded">
                    Save
                  </button>

                  <button onClick={()=>setShowAdd(false)}
                    className="flex-1 bg-gray-400 text-white py-2 rounded">
                    Cancel
                  </button>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ================= EDIT MODAL ================= */}
      <AnimatePresence>
        {editCustomer && (
          <>
            <motion.div className="fixed inset-0 bg-black bg-opacity-50"
              onClick={()=>setEditCustomer(null)} />

            <motion.div className="fixed inset-0 flex justify-center items-center">
              <div className="bg-white p-5 rounded-xl w-full max-w-md">

                <h2 className="text-xl mb-3">Edit Customer</h2>

                <input className="input" placeholder="Name"
                  value={formData.name}
                  onChange={e=>setFormData({...formData,name:e.target.value})} />

                <input className="input" placeholder="Phone"
                  value={formData.phone}
                  onChange={e=>setFormData({...formData,phone:e.target.value})} />

                <textarea className="input" placeholder="Description"
                  value={formData.description}
                  onChange={e=>setFormData({...formData,description:e.target.value})} />

                <input type="date" className="input"
                  value={formData.followup_date || ""}
                  onChange={e=>setFormData({...formData,followup_date:e.target.value})} />
                    <select className="input"
                  value={formData.status}
                  onChange={e=>setFormData({...formData,status:e.target.value})}>
                  <option>Pending</option>
                  <option>Done</option>
                  <option>Missed</option>
                  <option>Enquiry</option>
                </select>

                <div className="flex gap-2 mt-3">
                  <button onClick={handleUpdate}
                    className="flex-1 bg-green-500 text-white py-2 rounded">
                    Update
                  </button>

                  <button onClick={()=>setEditCustomer(null)}
                    className="flex-1 bg-gray-400 text-white py-2 rounded">
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