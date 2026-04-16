import { useEffect, useState } from "react";
import api from "../constant/api";
import { motion, AnimatePresence } from "framer-motion";
import { pdf } from "@react-pdf/renderer";
import QuotationPDF from "./QuotationPDF";

export default function Order() {

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [tempSearch, setTempSearch] = useState(""); // ✅ mobile filter fix
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);

  const [fullOrder, setFullOrder] = useState(null);
  const [openId, setOpenId] = useState(null);

  const itemsPerPage = 5;

  // 🔥 FETCH
  useEffect(() => {
    api.get("/order/getAllOrders")
      .then(res => setOrders(res.data.data || []))
      .catch(err => console.log(err));
  }, []);

  // 🔍 SEARCH
  const filteredOrders = orders.filter(o =>
    o.name?.toLowerCase().includes(search.toLowerCase())
  );

  // 📄 PAGINATION
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // 🔥 VIEW MODAL
  const openOrderDetails = (order_id) => {
    api.get(`/order/getFullOrderDetails/${order_id}`)
      .then(res => setFullOrder(res.data))
      .catch(err => console.log(err));
  };

  // 🔥 PDF OPEN (BEST METHOD)
  const handlePrint = async (order_id) => {
    try {
      const res = await api.get(`/order/getFullOrderDetails/${order_id}`);

      const blob = await pdf(
        <QuotationPDF
          order={res.data.order}
          items={res.data.items}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      window.open(url); // ✅ mobile friendly
    } catch (err) {
      console.log(err);
    }
  };

  const getPagination = (currentPage, totalPages) => {
  const pages = [];

  if (totalPages <= 7) {
    // show all pages
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1); // always show first

    if (currentPage > 3) {
      pages.push("...");
    }

    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages); // always show last
  }

  return pages;
};

  return (
    <div className="p-4">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Order List</h1>

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
          placeholder="Search by name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded"
        />
      </div>

      {/* ========================= */}
      {/* DESKTOP TABLE */}
      {/* ========================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full bg-white rounded-xl shadow">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {currentOrders.map((item) => (
              <tr key={item.order_id} className="text-center border-t">

                <td className="p-3">{item.order_id}</td>
                <td>{item.name}</td>
                <td>{item.phone}</td>

                <td>
                  <span className={`px-2 py-1 rounded text-white text-xs
                    ${item.status === "Delivered" ? "bg-green-500" :
                      item.status === "Pending" ? "bg-yellow-500" :
                        "bg-red-500"}
                  `}>
                    {item.status || "Pending"}
                  </span>
                </td>

                <td>{item.created_at?.slice(0, 10)}</td>

                <td className="space-x-2">
                  <button
                    onClick={() => openOrderDetails(item.order_id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    View
                  </button>

                  <button
                    onClick={() => handlePrint(item.order_id)}
                    className="bg-purple-500 text-white px-3 py-1 rounded"
                  >
                    🧾 PDF
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* ========================= */}
      {/* MOBILE CARD UI */}
      {/* ========================= */}
      <div className="md:hidden flex flex-col gap-3">
        {currentOrders.map(item => (
          <div key={item.order_id} className="bg-white p-4 rounded-xl shadow">

            <div className="flex justify-between">
              <h3 className="font-bold">#{item.order_id}</h3>
              <span className={`px-2 py-1 rounded text-white text-xs
                ${item.status === "Delivered" ? "bg-green-500" :
                  item.status === "Pending" ? "bg-yellow-500" :
                    "bg-red-500"}
              `}>
                {item.status || "Pending"}
              </span>
            </div>

            <p className="mt-2">{item.name}</p>
            <p className="text-sm text-gray-500">{item.phone}</p>
            <p className="text-sm">{item.created_at?.slice(0, 10)}</p>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => openOrderDetails(item.order_id)}
                className="flex-1 bg-blue-500 text-white py-1 rounded"
              >
                View
              </button>

              <button
                onClick={() => handlePrint(item.order_id)}
                className="flex-1 bg-purple-500 text-white py-1 rounded"
              >
                PDF
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* PAGINATION */}
       <div className="flex justify-center items-center mt-6 gap-2 flex-wrap">

  {/* PREV */}
  <button
    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    className="px-3 py-2 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-50"
  >
    ◀
  </button>

  {/* PAGE NUMBERS */}
  {getPagination(currentPage, totalPages).map((page, index) => (

    page === "..." ? (
      <span key={index} className="px-2">...</span>
    ) : (
      <button
        key={index}
        onClick={() => setCurrentPage(page)}
        className={`px-3 py-2 rounded-lg border transition ${
          currentPage === page
            ? "bg-blue-500 text-white"
            : "bg-white hover:bg-gray-100"
        }`}
      >
        {page}
      </button>
    )
  ))}

  {/* NEXT */}
  <button
    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
    disabled={currentPage === totalPages}
    className="px-3 py-2 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-50"
  >
    ▶
  </button>

</div>

      {/* ========================= */}
      {/* MOBILE FILTER */}
      {/* ========================= */}
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

      {/* ========================= */}
      {/* ORDER MODAL */}
      {/* ========================= */}
       {/* 🔥 MODAL */}
      <AnimatePresence>
        {fullOrder && fullOrder.order && (

          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999]"
            onClick={() => setFullOrder(null)}
          >

            <motion.div
              className="bg-white w-full max-w-3xl rounded-xl p-5 overflow-y-auto max-h-[90vh] relative"
              onClick={(e) => e.stopPropagation()}
            >

              <button
                className="absolute top-3 right-3 bg-red-500 text-white px-2 rounded"
                onClick={() => setFullOrder(null)}
              >
                ✖
              </button>

              <h2 className="text-xl font-bold mb-3">
                Order #{fullOrder.order.order_id}
              </h2>

              <p><b>{fullOrder.order.name}</b></p>
              <p>{fullOrder.order.phone}</p>
              <p>{fullOrder.order.city}</p>
              <p className="mb-4">₹{fullOrder.order.total_amount}</p>

              {/* ✅ PRINT BUTTON (CORRECT PLACE) */}
              {/* <div className="flex justify-end mb-3">
                <button
                  onClick={() => setShowPrint(true)}
                  className="bg-purple-500 text-white px-4 py-2 rounded"
                >
                  🖨 Print Quotation
                </button>
              </div> */}

              {/* PRODUCTS */}
              {fullOrder.items.map(item => (

                <div key={item.cart_id} className="border rounded-lg p-3 mb-3">

                  <div className="flex gap-3">

                    <img
                      src={
                        item.image
                          ? `https://akceramicworldadmin.unitdtechnologies.com/uploads/${item.image}`
                          : "https://via.placeholder.com/100"
                      }
                      alt={item.product_name}
                      className="w-20 h-20 rounded object-cover"
                    />

                    <div className="flex-1">

                      <h4 className="font-bold">{item.product_name}</h4>
                      <p>₹{item.price}</p>

                      <p className="text-sm">
                        Area: <b>{item.total_area} Sq.ft</b>
                      </p>

                      <button
                        onClick={() =>
                          setOpenId(openId === item.cart_id ? null : item.cart_id)
                        }
                        className="mt-2 text-blue-500 text-sm"
                      >
                        {openId === item.cart_id ? "Hide Details" : "View Details"}
                      </button>

                    </div>

                  </div>

                  {/* HISTORY */}
                  {openId === item.cart_id && (

                    <div className="mt-3 bg-gray-100 p-2 rounded">

                      {item.history.map(h => (

                        <div
                          key={h.order_item_id}
                          className="flex justify-between text-xs border-b py-1"
                        >
                          <span>L:{h.length}</span>
                          <span>W:{h.width}</span>
                          <span>H:{h.height}</span>
                          <span>{h.total_area} Sq.ft</span>
                        </div>

                      ))}

                    </div>

                  )}

                </div>

              ))}

            </motion.div>
          </motion.div>

        )}
      </AnimatePresence>

    </div>
  );
}