import { useEffect, useState } from "react";
import api from "../constant/api";
import { motion, AnimatePresence } from "framer-motion";

export default function OfferAdmin() {

  const [offers, setOffers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [editOffer, setEditOffer] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    video: null,
    published: 1
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);

  const itemsPerPage = 6;

  // 🔥 FETCH
  useEffect(() => {
    api.get("/offer/getAllOffers")
      .then(res => setOffers(res.data.data || []))
      .catch(err => console.log(err));
  }, []);

  // 🔍 SEARCH
  const filtered = offers.filter(o =>
    o.title?.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLast = currentPage * itemsPerPage;
  const current = filtered.slice(indexOfLast - itemsPerPage, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  // 🔥 INPUT CHANGE
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];

      setFormData({ ...formData, [name]: file });

      if (name === "image") {
        setPreviewImage(URL.createObjectURL(file));
      }

      if (name === "video") {
        setPreviewVideo(URL.createObjectURL(file));
      }

    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // 🔥 DRAG DROP
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];

    if (file.type.startsWith("image")) {
      setFormData({ ...formData, image: file });
      setPreviewImage(URL.createObjectURL(file));
    } else if (file.type.startsWith("video")) {
      setFormData({ ...formData, video: file });
      setPreviewVideo(URL.createObjectURL(file));
    }
  };

  // 🔥 OPEN EDIT
  const openEdit = (item) => {
    setEditOffer(item);
    setShowAdd(false);

    setFormData({
      title: item.title,
      description: item.description,
      image: null,
      video: null,
      published: item.published
    });

    setPreviewImage(`https://akceramicworldadmin.unitdtechnologies.com/uploadoffers/${item.image}`);
    setPreviewVideo(item.video ? `https://akceramicworldadmin.unitdtechnologies.com/uploadoffers/${item.video}` : null);
  };

  // 🔥 OPEN ADD
  const openAdd = () => {
    setShowAdd(true);
    setEditOffer(null);

    setFormData({
      title: "",
      description: "",
      image: null,
      video: null,
      published: 1
    });

    setPreviewImage(null);
    setPreviewVideo(null);
  };

  // 🔥 SAVE
  const handleSubmit = async () => {
    const data = new FormData();

    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });

    try {
      if (editOffer) {
        await api.post(`/offer/updateOffer/${editOffer.offer_id}`, data);

        setOffers(prev =>
          prev.map(o =>
            o.offer_id === editOffer.offer_id
              ? { ...o, ...formData }
              : o
          )
        );

      } else {
        const res = await api.post("/offer/addOffer", data);
        setOffers([res.data.data, ...offers]);
      }

      setEditOffer(null);
      setShowAdd(false);

    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this offer?")) return;

    await api.delete(`/offer/deleteOffer/${id}`);
    setOffers(prev => prev.filter(o => o.offer_id !== id));
  };

  // 🔥 TOGGLE
  const togglePublish = async (item) => {
    await api.post("/offer/toggleOfferPublish", {
      offer_id: item.offer_id,
      published: item.published ? 0 : 1
    });

    setOffers(prev =>
      prev.map(o =>
        o.offer_id === item.offer_id
          ? { ...o, published: o.published ? 0 : 1 }
          : o
      )
    );
  };

  return (
    <div className="p-4">

      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">🎉 Offer Management</h1>

        <button
          onClick={openAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Add Offer
        </button>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 mb-4 rounded w-full md:w-72"
      />

      {/* GRID */}
      <div className="grid md:grid-cols-3 gap-4">

        {current.map(item => (
          <motion.div
            key={item.offer_id}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-xl shadow-md p-2"
          >

            {/* ✅ IMAGE / VIDEO SAME SIZE */}
            {item.video ? (
              <video
                className="w-full h-48 object-contain bg-black rounded"
                controls
              >
                <source src={`https://akceramicworldadmin.unitdtechnologies.com/uploadoffers/${item.video}`} />
              </video>
            ) : (
              <img
                src={`https://akceramicworldadmin.unitdtechnologies.com/uploadoffers/${item.image}`}
                className="w-full h-48 object-contain bg-gray-100 rounded"
              />
            )}

            <h3 className="font-bold mt-2">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.description}</p>

            {/* TOGGLE */}
            <div className="flex justify-between items-center mt-2">

              <div
                onClick={() => togglePublish(item)}
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
                  item.published ? "bg-green-500" : "bg-gray-400"
                }`}
              >
                <div className={`bg-white w-4 h-4 rounded-full transform ${
                  item.published ? "translate-x-6" : ""
                }`} />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(item)}
                  className="text-yellow-500"
                >
                  ✏️
                </button>

                <button
                  onClick={() => handleDelete(item.offer_id)}
                  className="text-red-500"
                >
                  🗑
                </button>
              </div>

            </div>

          </motion.div>
        ))}

      </div>

      {/* PAGINATION */}
      <div className="flex justify-center mt-6 gap-2">
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
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {(editOffer || showAdd) && (
          <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">

            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="bg-white p-5 rounded-xl w-full max-w-md"
            >

              <h2 className="text-xl font-bold mb-3">
                {editOffer ? "Edit Offer" : "Add Offer"}
              </h2>

              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Title"
                className="border w-full mb-2 p-2"
              />

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                className="border w-full mb-2 p-2"
              />

              <input type="file" name="image" onChange={handleChange} />

              {previewImage && (
                <img
                  src={previewImage}
                  className="w-full h-32 mt-2 object-contain bg-gray-100 rounded"
                />
              )}

              <input type="file" name="video" onChange={handleChange} />

              {previewVideo && (
                <video
                  src={previewVideo}
                  controls
                  className="w-full h-32 mt-2 object-contain bg-black rounded"
                />
              )}

              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-green-500 text-white py-2 rounded"
                >
                  Save
                </button>

                <button
                  onClick={() => {
                    setEditOffer(null);
                    setShowAdd(false);
                  }}
                  className="flex-1 bg-gray-400 text-white py-2 rounded"
                >
                  Cancel
                </button>
              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}