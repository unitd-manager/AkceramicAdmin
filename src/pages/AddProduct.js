import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../constant/api";

export default function AddProduct() {
  const navigate = useNavigate();

  const MAX_SIZE = 2 * 1024 * 1024; // ✅ 2MB

  const [form, setForm] = useState({
    product_name: "",
    description: "",
    price: "",
    qty: "",
    pic: "",
    mrp: "",
    size: "",
    brand: "",
    finish: ""
  });

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [errors, setErrors] = useState({});

  // 🔄 INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 📷 FILE SELECT + SIZE VALIDATION
  const handleFile = (e) => {
    const files = Array.from(e.target.files);

    let validFiles = [];
    let errorMsg = "";

    files.forEach(file => {
      if (!file.type.startsWith("image/")) {
        errorMsg = "Only image files allowed";
      } else if (file.size > MAX_SIZE) {
        errorMsg = "Each image must be less than 2MB";
      } else {
        validFiles.push(file);
      }
    });

    if (errorMsg) {
      setErrors(prev => ({ ...prev, images: errorMsg }));
    } else {
      setErrors(prev => ({ ...prev, images: "" }));
    }

    setImages(prev => [...prev, ...validFiles]);

    const urls = validFiles.map(file => URL.createObjectURL(file));
    setPreview(prev => [...prev, ...urls]);
  };

  // 📥 DRAG DROP + SIZE VALIDATION
  const handleDrop = (e) => {
    e.preventDefault();

    const files = Array.from(e.dataTransfer.files);

    let validFiles = [];
    let errorMsg = "";

    files.forEach(file => {
      if (!file.type.startsWith("image/")) {
        errorMsg = "Only image files allowed";
      } else if (file.size > MAX_SIZE) {
        errorMsg = "Each image must be less than 2MB";
      } else {
        validFiles.push(file);
      }
    });

    if (errorMsg) {
      setErrors(prev => ({ ...prev, images: errorMsg }));
    } else {
      setErrors(prev => ({ ...prev, images: "" }));
    }

    setImages(prev => [...prev, ...validFiles]);

    const urls = validFiles.map(file => URL.createObjectURL(file));
    setPreview(prev => [...prev, ...urls]);
  };

  // ❌ REMOVE IMAGE
  const removeImage = (index) => {
    const newPreview = preview.filter((_, i) => i !== index);
    const newImages = images.filter((_, i) => i !== index);

    setPreview(newPreview);
    setImages(newImages);
  };

  // ✅ VALIDATION
  const validate = () => {
    let newErrors = {};

    if (!form.product_name.trim()) {
      newErrors.product_name = "Product name is required";
    }

    if (!form.brand) {
  newErrors.brand = "Please select a brand";
}

    if (!form.price) {
      newErrors.price = "Price is required";
    } else if (isNaN(form.price)) {
      newErrors.price = "Price must be a number";
    }

    if (!form.qty) {
      newErrors.qty = "Quantity is required";
    } else if (isNaN(form.qty)) {
      newErrors.qty = "Quantity must be a number";
    }
    if (!form.finish) {
  newErrors.finish = "Please select finish";
}

    if (images.length === 0) {
      newErrors.images = "At least one image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🚀 SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const formData = new FormData();

    formData.append("product_name", form.product_name);
    formData.append("description", form.description || "");
    formData.append("price", form.price || 0);
    formData.append("qty", form.qty || 0);
      formData.append(
  "pic",
  form.pic ? `${form.pic} pcs` : "0 pcs"
);
    formData.append("mrp", form.mrp || 0);
    formData.append("size", form.size || "");
    formData.append("brand", form.brand || "");
    formData.append("finish", form.finish || "");

    images.forEach(file => {
      formData.append("images", file);
    });

    api.post("/Product/insertProduct", formData)
      .then(() => {
        alert("Product Added ✅");

        setForm({
          product_name: "",
          description: "",
          price: "",
          qty: "",
          pic: "",
          mrp: "",
          size: "",
          brand: "",
          finish: ""
        });

        setImages([]);
        setPreview([]);
        setErrors({});

        navigate("/Products");
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button
        onClick={() => navigate("/Products")}
        className="mb-4 text-blue-600"
      >
        ← Back List
      </button>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-6">Add Product</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block mb-1 font-medium">Product Name *</label>
              <input
                name="product_name"
                value={form.product_name}
                onChange={handleChange}
                className="input w-full"
              />
              {errors.product_name && <p className="text-red-500 text-sm">{errors.product_name}</p>}
            </div>

            <div>
  <label className="block mb-1 font-medium">Brand</label>

  <select
    name="brand"
    value={form.brand || ""}
    onChange={handleChange}
    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
  >
    <option value="">Select Brand</option>
    <option value="Varmora">Varmora</option>
    <option value="Bonzer7">Bonzer 7</option>
    <option value="Hindware">Hindware</option>
    <option value="Somany">Somany</option>
    <option value="Sunheart">Sunheart</option>
    <option value="Bluezone">Bluezone</option>
    <option value="Active">Active</option>
    <option value="BX">BX</option>
    <option value="Simpolo">Simpolo</option>
    <option value="Captiva">Captiva</option>
    <option value="RJM">RJM</option>
    <option value="LIJO">LIJO</option>
  </select>
  {errors.brand && <p className="text-red-500 text-sm">{errors.brand}</p>}
</div>

            <div>
              <label className="block mb-1 font-medium">Price *</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="input w-full"
              />
              {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
            </div>

            <div>
              <label className="block mb-1 font-medium">MRP</label>
              <input
                type="number"
                name="mrp"
                value={form.mrp}
                onChange={handleChange}
                className="input w-full"
              />
            </div>

            {/* <div>
              <label className="block mb-1 font-medium">Quantity *</label>
              <input
                type="number"
                name="qty"
                value={form.qty}
                onChange={handleChange}
                className="input w-full"
              />
               <input
                type="number"
                name="pic"
                value={form.pic}
                onChange={handleChange}
                className="input w-full"
              />
              {errors.qty && <p className="text-red-500 text-sm">{errors.qty}</p>}
            </div> */}
            <div>
  <label className="block mb-1 font-medium">Quantity*</label>

  <div className="flex gap-2">

    <input
      type="number"
      name="qty"
      value={form.qty || ""}
      onChange={handleChange}
      placeholder="Box"
      className="input w-1/2"
    />

    <input
      type="number"
      name="pic"
      value={form.pic || ""}
      onChange={handleChange}
      placeholder="Pic"
      className="input w-1/2"
    />

  </div>

  {errors.qty && <p className="text-red-500 text-sm">{errors.qty}</p>}
</div>

            <div>
  <label className="block mb-1 font-medium text-gray-700">
    Tile Size
  </label>

  <select
    name="size"
    value={form.size || ""}
    onChange={handleChange}
    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
  >
    <option value="">Select Size</option>
    <option value="1200 x 600">1200 x 600</option>
    <option value="600 x 600">600 x 600</option>
    <option value="300 x 450">300 x 450</option>
    <option value="15 x 10">15 x 10</option>
    <option value="1200 x 200">1200 x 200</option>
    <option value="300 x 600">300 x 600</option>
    <option value="2400 x 1200">2400 x 1200</option>
    <option value="300 x 300">300 x 300</option>
    <option value="400 x 400">400 x 400</option>
    <option value="200 x 200">200 x 200</option>
    <option value="800 x 1600">800 x 1600</option>
    <option value="1200 x 1800">1200 x 1800</option>
    <option value="800 x 2400">800 x 2400</option>
  </select>
</div>

            <div>
  <label className="block mb-1 font-medium text-gray-700">
    Tile Finish
  </label>

  <select
    name="finish"
    value={form.finish || ""}
    onChange={handleChange}
    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
  >
    <option value="">Select Finish</option>
    <option value="Glossy">Glossy</option>
    <option value="Matt">Matt</option>
    <option value="High Gloss">High Gloss</option>
    <option value="Polished">Polished</option>
    <option value="Carving">Carving</option>
    <option value="3D Elevation">3D Elevation</option>
    <option value="Rustic">Rustic</option>
    <option value="Wood">Wood</option>
    <option value="Stone">Stone</option>
    <option value="Anti Skid">Anti Skid</option>
  </select>
  {errors.finish && <p className="text-red-500 text-sm">{errors.finish}</p>}
</div>

          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="input w-full"
            />
          </div>

          {/* IMAGE UPLOAD */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed p-6 text-center rounded-xl cursor-pointer bg-gray-50"
          >
        <div className="border-2 border-dashed p-6 text-center rounded-xl bg-gray-50">

  <p className="text-gray-500">
    Drag & Drop Images OR Click Below
  </p>

  {/* Custom Button */}
  <label className="block mt-3 cursor-pointer">
    <span className="bg-blue-500 text-white px-4 py-2 rounded inline-block">
      Choose Images
    </span>

    <input
      type="file"
      multiple
      onChange={handleFile}
      className="hidden"
    />
  </label>

  {/* File Count */}
  <p className="text-sm text-gray-500 mt-2">
    {images.length > 0
      ? `${images.length} image(s) selected`
      : "No images selected"}
  </p>

  <p className="text-xs text-gray-400 mt-1">
    Max image size: 2MB | Only images allowed
  </p>

</div>
          </div>

          {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}

          {/* PREVIEW */}
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {preview.map((img, i) => (
              <div key={i} className="relative">
                <img src={img} className="w-full h-24 object-cover rounded" />
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