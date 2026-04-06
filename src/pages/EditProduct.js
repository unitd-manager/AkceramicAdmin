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

    // ✅ UPDATE PRODUCT
    const formData = new FormData();

    // 🔥 avoid duplicate product_id
    Object.keys(form).forEach(key => {
      if (key !== "product_id") {
        formData.append(key, form[key]);
      }
    });

    // ✅ add only once
    formData.append("product_id", id);

    // 🧪 DEBUG (optional)
    // for (let pair of formData.entries()) {
    //   console.log(pair[0], pair[1]);
    // }

    await api.post("/Product/updateProduct", formData);

    // ✅ ADD MULTIPLE IMAGES
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
              <div>
    <label className="block text-sm font-semibold mb-1 text-gray-700">
      Product Name
    </label>
    <input
      name="product_name"
      value={form.product_name || ""}
      onChange={handleChange}
      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
    />
  </div>
      {/* BRAND */}
  <div>
    <label className="block text-sm font-semibold mb-1 text-gray-700">
      Brand
    </label>
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
  </div>

  {/* PRICE */}
  <div>
    <label className="block text-sm font-semibold mb-1 text-gray-700">
      Price
    </label>
    <input
      name="price"
      value={form.price || ""}
      onChange={handleChange}
      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-400"
    />
  </div>

  {/* MRP */}
  <div>
    <label className="block text-sm font-semibold mb-1 text-gray-700">
      MRP
    </label>
    <input
      name="mrp"
      value={form.mrp || ""}
      onChange={handleChange}
      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-400"
    />
  </div>

  {/* QTY */}
  <div>
    <label className="block text-sm font-semibold mb-1 text-gray-700">
      Quantity
    </label>
    <input
      name="qty"
      value={form.qty || ""}
      onChange={handleChange}
      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-400"
    />
  </div>

  {/* SIZE */}
  <div>
    <label className="block text-sm font-semibold mb-1 text-gray-700">
      Tile Size
    </label>
    <select
      name="size"
      value={form.size || ""}
      onChange={handleChange}
      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-400"
    >
      <option value="">Select Size</option>
      <option value="1200 x 600">1200 x 600</option>
      <option value="600 x 600">600 x 600</option>
      <option value="18 x 12">18 x 12</option>
      <option value="15 x 12">15 x 12</option>
      <option value="1200 x 200">1200 x 200</option>
      <option value="24 x 12">24 x 12</option>
    </select>
  </div>

  {/* FINISH */}
  <div>
    <label className="block text-sm font-semibold mb-1 text-gray-700">
      Tile Finish
    </label>
    <select
      name="finish"
      value={form.finish || ""}
      onChange={handleChange}
      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-400"
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
  </div>         
   <div>
    <label className="block text-sm font-semibold mb-1 text-gray-700">
      Tile category
    </label>
    <select
      name="product_category"
      value={form.product_category || ""}
      onChange={handleChange}
      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-400"
    >
      <option value="">Select Product Category</option>
      <option value="Tiles">Tiles</option>
      <option value="Wall Tiles">Wall Tiles</option>
       <option value="Floar Tiles">Floar Tiles</option>
       <option value="Elivation Tiles">Elivation Tiles</option>
        <option value="Bathroom wall Tiles">Bathroom wall Tiles</option>
         <option value="Bathroom floar Tiles">Bathroom floar Tiles</option>
             <option value="Wooden Tiles">Wooden Tiles</option>
              <option value="Wooden strip">Wooden strip</option>
      <option value="sanitary ware">sanitary ware</option>
      <option value="cp fittings">cp fittings</option>
    </select>
  </div>   
   </div>

        <div className="mt-4">
  <label className="block text-sm font-semibold mb-1 text-gray-700">
    Description
  </label>
  <textarea
    name="description"
    value={form.description || ""}
    onChange={handleChange}
    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-400"
    rows="4"
  />
</div>

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

         <button
  className="w-full mt-6 bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 rounded-lg font-semibold hover:scale-105 transition"
>
  Update Product
</button>

        </form>
      </div>
    </div>
  );
}