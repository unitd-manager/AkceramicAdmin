import { useEffect, useState } from "react";
import api from "../constant/api";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Products() {

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [zoomStyle, setZoomStyle] = useState({});
  const [showFilter, setShowFilter] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    api.get("/Product/getProduct")
      .then(res => {
        console.log("API DATA:", res.data.data);
        setProducts(res.data.data || []);
      })
      .catch(err => console.log(err));
  }, []);

  // 🔍 FILTER
  let filteredProducts = products.filter((item) =>
    item.product_name?.toLowerCase().includes(search.toLowerCase())
  );

  filteredProducts = filteredProducts.filter((item) => {
    const price = Number(item.price);
    return (
      (minPrice === "" || price >= Number(minPrice)) &&
      (maxPrice === "" || price <= Number(maxPrice))
    );
  });

  // 🔽 SORT
  if (sortOrder === "low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  // 📄 PAGINATION
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // 🔍 ZOOM
  const handleZoom = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({ backgroundPosition: `${x}% ${y}%` });
  };

  const handleToggle = (item) => {
  const newStatus = item.published === 1 ? 0 : 1;

  api.post("/Product/togglePublish", {
    product_id: item.product_id,
    published: newStatus
  })
    .then(() => {

      // 🔥 update UI instantly
      setProducts(prev =>
        prev.map(p =>
          p.product_id === item.product_id
            ? { ...p, published: newStatus }
            : p
        )
      );

    })
    .catch(err => console.log(err));
};

  return (
    <div>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Product List</h1>

        <button
          className="md:hidden bg-gray-800 text-white px-3 py-2 rounded"
          onClick={() => setShowFilter(true)}
        >
          Filter ⚙️
        </button>

        <button
          onClick={() => navigate("/add-product")}
          className="bg-blue-500 text-white px-4 py-2 rounded hidden md:block"
        >
          + Add Product
        </button>
      </div>

      {/* DESKTOP FILTER */}
      <div className="hidden md:flex gap-3 mb-4 flex-wrap">

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded"
        />

        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">Sort</option>
          <option value="low">Low → High</option>
          <option value="high">High → Low</option>
        </select>

      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white dark:bg-gray-800 rounded-xl shadow">

          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-3">ID</th>
              <th>Edit</th>
              <th>Name</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Image</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {currentProducts.map((item, i) => (
              <tr key={i} className="text-center border-t hover:bg-gray-50 dark:hover:bg-gray-700">

                <td className="p-3">{item.product_id}</td>
              <td className="p-3">
  <div className="flex justify-center gap-2">
    <div className="hover:scale-[1.01] transition"></div>

    {/* ✏️ EDIT BUTTON */}
    <button
      onClick={() => navigate(`/edit-product/${item.product_id}`)}
      className="group relative bg-yellow-400 hover:bg-yellow-500 
      text-white p-2 rounded-lg shadow-md transition-all duration-300"
    >
      ✏️

      {/* Tooltip */}
      <span className="absolute bottom-10 left-1/2 -translate-x-1/2 
      bg-black text-white text-xs px-2 py-1 rounded opacity-0 
      group-hover:opacity-100 transition">
        Edit
      </span>
    </button>

  </div>
</td>

                <td>{item.product_name}</td>
                <td>{item.price}</td>
                <td>{item.qty}</td>

                <td>
                  <img
                    src={`http://localhost:5000/uploads/${item.image}`}
                    alt=""
                    className="w-12 mx-auto rounded cursor-pointer"
                    onClick={() => {
                      console.log("CLICKED:", item);

                      if (!filteredProducts.length) return;

                      setSelectedProduct([...filteredProducts]); // FIX
                      setCurrentIndex(indexOfFirst + i);
                    }}
                  />
                </td>
                 <td>
  <div
    onClick={() => handleToggle(item)}
    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition
      ${item.published ? "bg-green-500" : "bg-gray-400"}
    `}
  >
    <div
      className={`bg-white w-4 h-4 rounded-full shadow transform transition
        ${item.published ? "translate-x-6" : ""}
      `}
    />
  </div>
</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center mt-6 gap-2 flex-wrap">

        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg border"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          return (
            <button
              key={i}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg border ${
                currentPage === page
                  ? "bg-blue-500 text-white"
                  : ""
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg border"
        >
          Next
        </button>

      </div>
        <AnimatePresence>
        {showFilter && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-[9998]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilter(false)}
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.35 }}
              className="fixed bottom-0 left-0 w-full bg-white p-4 rounded-t-2xl z-[9999] md:hidden"
            >
              <h2 className="font-bold mb-3">Filters</h2>

              <input placeholder="Search" onChange={(e) => setSearch(e.target.value)} className="border w-full mb-2 p-2" />
              <input placeholder="Min" onChange={(e) => setMinPrice(e.target.value)} className="border w-full mb-2 p-2" />
              <input placeholder="Max" onChange={(e) => setMaxPrice(e.target.value)} className="border w-full mb-2 p-2" />

              <select onChange={(e) => setSortOrder(e.target.value)} className="border w-full mb-3 p-2">
                <option value="">Sort</option>
                <option value="low">Low → High</option>
                <option value="high">High → Low</option>
              </select>

              <button
                onClick={() => {
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

      {/* ✅ IMAGE MODAL (FIXED) */}
      <AnimatePresence>
        {selectedProduct && selectedProduct.length > 0 && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[9999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >

            <motion.div
              className="bg-white p-6 rounded-xl max-w-md w-full relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >

              {/* Close */}
              <button
                className="absolute top-2 right-2 text-xl"
                onClick={() => setSelectedProduct(null)}
              >
                ✖
              </button>

              {/* SAFE CHECK */}
              {selectedProduct[currentIndex] && (
                <>
                  {/* ZOOM IMAGE */}
                  <div
                    onMouseMove={handleZoom}
                    onMouseLeave={() => setZoomStyle({})}
                    className="w-full h-64 rounded overflow-hidden"
                    style={{
                      backgroundImage: `url(http://localhost:5000/uploads/${selectedProduct[currentIndex].image})`,
                      backgroundSize: zoomStyle.backgroundPosition ? "200%" : "contain",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: zoomStyle.backgroundPosition || "center",
                    }}
                  />

                  {/* DETAILS */}
                  <div className="mt-4 text-center">
                    <h2 className="font-bold">
                      {selectedProduct[currentIndex].product_name}
                    </h2>
                    <p>₹{selectedProduct[currentIndex].price}</p>
                    <p>Qty: {selectedProduct[currentIndex].qty}</p>
                  </div>

                  {/* SLIDER */}
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() =>
                        setCurrentIndex(
                          currentIndex === 0
                            ? selectedProduct.length - 1
                            : currentIndex - 1
                        )
                      }
                    >
                      ◀
                    </button>

                    <button
                      onClick={() =>
                        setCurrentIndex(
                          currentIndex === selectedProduct.length - 1
                            ? 0
                            : currentIndex + 1
                        )
                      }
                    >
                      ▶
                    </button>
                  </div>
                </>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}