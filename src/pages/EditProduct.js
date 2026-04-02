import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../constant/api";

export default function EditProduct() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({});
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  // 🔥 FETCH
  useEffect(() => {
    api.post("/Product/getProductByid", { product_id: id })
      .then(res => {

        const data = res.data.data[0];

        setForm(data);
        setExistingImages(data.images || []);

      });

  }, [id]);

  // 🔄 INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

   console.log("new image",newImages)

  // 📷 NEW IMAGE
  const handleFile = (e) => {
    console.log(e.target.files)

    const files = Array.from(e.target.files);

    const mapped = files.map(file => ({
      file: file,
      url: URL.createObjectURL(file)
    }));

    setNewImages(prev => [...prev, ...mapped]);
  };

  // ❌ DELETE EXISTING
 const handleDeleteExisting = (img) => {

  if (window.confirm("Are you sure?")) {

    api.delete(`/Product/deleteImage/${img.image_id}`)
      .then(() => {
        setExistingImages(prev =>
          prev.filter(i => i.image_id !== img.image_id)
        );
      });

  }
};

  // ❌ DELETE NEW
  const handleDeleteNew = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  

  // 🚀 SUBMIT

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {

    // ✅ 1. UPDATE PRODUCT
    const formData = new FormData();

    Object.keys(form).forEach(key => {
      formData.append(key, form[key]);
    });

    formData.append("product_id", id);

    await api.post("/Product/updateProduct", formData);

    // ✅ 2. ADD NEW IMAGES (if any)
    if (newImages.length > 0) {

      const imgData = new FormData();

      imgData.append("product_id", id);

      newImages.forEach(img => {
        imgData.append("images", img.file);
      });

      await api.post("/Product/addImages", imgData);
    }

    alert("Updated ✅");
    navigate("/Products");

  } catch (err) {
    console.log(err);
  }
};

  return (
    <div className="max-w-5xl mx-auto p-4">

      <button
        onClick={() => navigate("/Products")}
        className="mb-4 text-blue-600"
      >
        ← Back
      </button>

      <div className="bg-white p-6 rounded-xl shadow">

        <h2 className="text-2xl font-bold mb-6">
          Edit Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="grid md:grid-cols-2 gap-4">

            <input name="product_name" value={form.product_name || ""} onChange={handleChange} placeholder="Name" className="input" />
            <input name="brand" value={form.brand || ""} onChange={handleChange} placeholder="Brand" className="input" />
            <input name="price" value={form.price || ""} onChange={handleChange} placeholder="Price" className="input" />
            <input name="mrp" value={form.mrp || ""} onChange={handleChange} placeholder="MRP" className="input" />
            <input name="qty" value={form.qty || ""} onChange={handleChange} placeholder="Qty" className="input" />
            <input name="size" value={form.size || ""} onChange={handleChange} placeholder="Size" className="input" />
            <input name="finish" value={form.finish || ""} onChange={handleChange} placeholder="Finish" className="input" />

          </div>

          <textarea
            name="description"
            value={form.description || ""}
            onChange={handleChange}
            placeholder="Description"
            className="input w-full"
          />

          {/* 🖼 EXISTING */}
          <h4 className="font-semibold">Existing Images</h4>
          <div className="flex gap-3 flex-wrap">
            {existingImages.map(img => (
              <div key={img.image_id} className="relative">

                <img
                  src={`http://localhost:5000/uploads/${img.image}`}
                  className="w-20 h-20 object-cover rounded"
                />

                <button
                  type="button"
                  onClick={() => handleDeleteExisting(img)}
                  className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
                >
                  ✖
                </button>

              </div>
            ))}
          </div>

          {/* 🖼 NEW */}
          <h4 className="font-semibold mt-4">New Images</h4>
          <div className="flex gap-3 flex-wrap">
            {newImages.map((img, i) => (
              <div key={i} className="relative">

                <img
                  src={img.url}
                  className="w-20 h-20 object-cover rounded"
                />

                <button
                  type="button"
                  onClick={() => handleDeleteNew(i)}
                  className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
                >
                  ✖
                </button>

              </div>
            ))}
          </div>

          <input type="file" multiple onChange={handleFile} />

          <button className="bg-blue-500 text-white px-4 py-2 rounded w-full">
            Update Product
          </button>

        </form>
      </div>
    </div>
  );
}