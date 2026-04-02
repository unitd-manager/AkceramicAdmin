import { useState } from "react";
import api from "../constant/api";

export default function AddProduct() {

  const [form, setForm] = useState({
    product_name: "",
    description: "",
    price: "",
    qty: "",
    mrp: "",
    size: "",
    brand: "",
    finish: ""
  });

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);

  // 🔄 INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 📷 FILE SELECT
  const handleFile = (e) => {
    const files = Array.from(e.target.files);

    setImages(prev => [...prev, ...files]);

    const urls = files.map(file => URL.createObjectURL(file));
    setPreview(prev => [...prev, ...urls]);
    
  };

  // 📥 DRAG DROP
  const handleDrop = (e) => {
    e.preventDefault();

    const files = Array.from(e.dataTransfer.files);

    setImages(prev => [...prev, ...files]);

    const urls = files.map(file => URL.createObjectURL(file));
    setPreview(prev => [...prev, ...urls]);
  };

  // ❌ REMOVE IMAGE
  const removeImage = (index) => {
    const newPreview = preview.filter((_, i) => i !== index);
    const newImages = images.filter((_, i) => i !== index);

    setPreview(newPreview);
    setImages(newImages);
  };

  // 🚀 SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(form).forEach(key => {
      formData.append(key, form[key]);
    });

    images.forEach(file => {
      formData.append("images", file); // 🔥 IMPORTANT
    });

    api.post("/Product/insertProduct", formData)
      .then(() => {
        alert("Product Added ✅");
        setForm({});
        setImages([]);
        setPreview([]);
      })
      .catch(err => console.log(err));
  };

  
  return (
    <div className="max-w-4xl mx-auto p-4">

      <div className="bg-white p-6 rounded-xl shadow">

        <h2 className="text-2xl font-bold mb-6">
          Add Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <input name="product_name" onChange={handleChange} placeholder="Product Name" className="input" />
            <input name="brand" onChange={handleChange} placeholder="Brand" className="input" />

            <input name="price" onChange={handleChange} placeholder="Price" className="input" />
            <input name="mrp" onChange={handleChange} placeholder="MRP" className="input" />

            <input name="qty" onChange={handleChange} placeholder="Qty" className="input" />
            <input name="size" onChange={handleChange} placeholder="Size" className="input" />

            <input name="finish" onChange={handleChange} placeholder="Finish" className="input" />

          </div>

          {/* DESCRIPTION */}
          <textarea
            name="description"
            onChange={handleChange}
            placeholder="Description"
            className="input w-full"
          />

          {/* DRAG DROP BOX */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed p-6 text-center rounded-xl cursor-pointer bg-gray-50"
          >
            <p className="text-gray-500">
              Drag & Drop Images OR Click Below
            </p>

            <input
              type="file"
              multiple
              onChange={handleFile}
              className="mt-3"
            />
          </div>

          {/* PREVIEW GRID */}
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">

            {preview.map((img, i) => (
              <div key={i} className="relative">

                <img
                  src={img}
                  className="w-full h-24 object-cover rounded"
                />

                {/* DELETE BTN */}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded"
                >
                  ✖
                </button>

              </div>
            ))}

          </div>

          {/* SUBMIT */}
          <button className="bg-green-500 text-white px-6 py-2 rounded w-full">
            Submit
          </button>

        </form>

      </div>
    </div>
  );
}