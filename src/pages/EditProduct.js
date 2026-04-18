import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../constant/api";
import { motion, AnimatePresence } from "framer-motion";

export default function EditProduct() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({});
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  // const [selectedProduct, setSelectedProduct] = useState(null);
   const [currentIndex, setCurrentIndex] = useState(0);
   const [zoomStyle, setZoomStyle] = useState({});
   const [selectedProduct, setSelectedProduct] = useState([]);

  const [activeTab, setActiveTab] = useState("images");

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
  // const handleFile = (e) => {
  //   console.log(e.target.files)

  //   const files = Array.from(e.target.files);

  //   const mapped = files.map(file => ({
  //     file: file,
  //     url: URL.createObjectURL(file)
  //   }));

  //   setNewImages(prev => [...prev, ...mapped]);
  // };

  const MAX_SIZE = 750 * 1024; // 750 KB

const handleFile = (e) => {
  const files = Array.from(e.target.files);

  const validFiles = [];
  const invalidFiles = [];

  files.forEach(file => {
    if (file.size <= MAX_SIZE) {
      validFiles.push({
        file: file,
        url: URL.createObjectURL(file)
      });
    } else {
      invalidFiles.push(file.name);
    }
  });

  if (invalidFiles.length > 0) {
    toast.error(`These files exceed 750KB: ${invalidFiles.join(", ")}`);
  }

  setNewImages(prev => [...prev, ...validFiles]);
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

    // 🔥 REFRESH DATA AFTER UPDATE
const res = await api.post("/Product/getProductByid", { product_id: id });
setForm(res.data.data[0]);
  
    toast.success("Updated");

  } catch (err) {
    console.log(err);
  }
};

const generate12Labels = (item) => {
  let arr = [];
  for (let i = 0; i < 24; i++) {
    arr.push(item);
  }
  return arr;
};

 const handleZoom = (e) => {
  const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
  const x = ((e.clientX - left) / width) * 100;
  const y = ((e.clientY - top) / height) * 100;

  setZoomStyle({
    backgroundPosition: `${x}% ${y}%`,
  });
};

// 🖨️ PRINT LABEL
const handlePrintQr = (items) => {

  if (!Array.isArray(items)) {
    items = [items]; // safety
  }

  const html = items.map(item => `
    <div class="label">
      <img src="https://akceramicworldadmin.unitdtechnologies.com/${item.qrcode}" class="qr"/>
    </div>
  `).join("");

  const printWindow = window.open("", "_blank");

  printWindow.document.write(`
    <html>
      <head>
        <title>A k Ceramic World</title>

        <style>
          @page {
            size: A4;
            margin: 10mm;
          }

          body {
            font-family: Arial;
          }

          .grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
          }

          .label {
            border: 1px solid #000;
            padding: 5px;
            text-align: center;
            height: 120px;
          }

          .name {
            font-size: 12px;
            font-weight: bold;
          }

          .price {
            font-size: 12px;
          }

          .barcode {
            height: 30px;
          }

          .qr {
            height: 120px;
            width:140px
          }

        </style>

      </head>

      <body>

        <div class="grid">
          ${html}
        </div>

        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = () => window.close();
          }
        </script>

      </body>
    </html>
  `);

  printWindow.document.close();
};

const handlePrintBar = (items) => {

  if (!Array.isArray(items)) {
    items = [items]; // safety
  }

  const html = items.map(item => `
    <div class="label">
      <img src="https://akceramicworldadmin.unitdtechnologies.com/${item.barcode}" class="qr"/>
    </div>
  `).join("");

  const printWindow = window.open("", "_blank");

  printWindow.document.write(`
    <html>
      <head>
        <title>A k Ceramic World</title>

        <style>
          @page {
            size: A4;
            margin: 10mm;
          }

          body {
            font-family: Arial;
          }

          .grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
          }

          .label {
            border: 1px solid #000;
            padding: 5px;
            text-align: center;
            height: 120px;
          }

          .name {
            font-size: 12px;
            font-weight: bold;
          }

          .price {
            font-size: 12px;
          }

          .barcode {
            height: 30px;
          }

          .qr {
            height: 110px;
            width:170px
          }

        </style>

      </head>

      <body>

        <div class="grid">
          ${html}
        </div>

        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = () => window.close();
          }
        </script>

      </body>
    </html>
  `);

  printWindow.document.close();
};
  return (
    <div className="max-w-5xl mx-auto p-4">

      <button
        onClick={() => navigate("/Products")}
        className="mb-4 text-blue-600"
      >
        ← Back List
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
      name="pic"
      value={form.pic || ""}
      onChange={handleChange}
      placeholder="Pic"
      className="input w-1/2"
    />

  </div>
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

<div className="flex border-b mb-4">
            <button type="button" onClick={() => setActiveTab("images")}
              className={`flex-1 py-2 ${activeTab === "images" ? "border-b-2 border-red-500 text-red-500" : ""}`}>
              Images
            </button>

            <button type="button" onClick={() => setActiveTab("codes")}
              className={`flex-1 py-2 ${activeTab === "codes" ? "border-b-2 border-red-500 text-red-500" : ""}`}>
              QR / Barcode
            </button>
          </div>

            {/* 🖼 TAB 1 */}
          {activeTab === "images" && (
            <>

          {/* 🖼 EXISTING */}
          <h4 className="font-semibold">Existing Images</h4>
          <div className="flex gap-3 flex-wrap">
            {existingImages.map(img => (
              <div key={img.image_id} className="relative">

              <img
  src={`https://akceramicworldadmin.unitdtechnologies.com/uploads/${img.image}`}
  className="w-20 h-20 object-cover rounded cursor-pointer"
  onClick={() => {
    setSelectedProduct(existingImages); // pass full array
    setCurrentIndex(existingImages.findIndex(i => i.image_id === img.image_id));
  }}
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
          <h4 className="font-semibold mt-4">New Images exceed 750KB</h4>
          <div className="flex gap-3 flex-wrap">
            {newImages.map((img, i) => (
              <div key={i} className="relative">

                <img
  src={img.url}
  className="w-20 h-20 object-cover rounded cursor-pointer"
  onClick={() => {
    setSelectedProduct(newImages.map(n => ({ image: n.url })));
    setCurrentIndex(i);
  }}
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
            </>
          )}

             {/* 🔳 TAB 2 */}
          {activeTab === "codes" && (
            <>

          {/* 🔳 BARCODE + QR */}
<h4 className="font-semibold mt-6">Barcode / QR</h4>

<div className="flex gap-6 flex-wrap">

  {/* BARCODE */}
  {form.barcode && (
    <div>
      <img
        src={`https://akceramicworldadmin.unitdtechnologies.com/${form.barcode}`}
        className="h-20 border p-1 rounded"
      />
    </div>
  )}

  {/* QR */}
  {form.qrcode && (
    <div>
      <img
        src={`https://akceramicworldadmin.unitdtechnologies.com/${form.qrcode}`}
        className="h-24 border p-1 rounded"
      />
    </div>
  )}

</div>
<div className="grid grid-cols-2 gap-2 mt-2">

  <button
    type="button"
    onClick={() => handlePrintQr(generate12Labels(form))}
    className="w-full bg-green-500 hover:bg-green-600 transition text-white py-2 rounded-lg shadow"
  >
    🧾 QR Code
  </button>

  <button
    type="button"
    onClick={() => handlePrintBar(generate12Labels(form))}
   className="w-full bg-green-500 hover:bg-green-600 transition text-white py-2 rounded-lg shadow"
  >
    🧾 Barcode
  </button>

</div>
 </>
          )}
         <button
  className="w-full mt-6 bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 rounded-lg font-semibold hover:scale-105 transition"
>
  Update Product
</button>

        </form>
      </div>
        {/* ✅ IMAGE MODAL (FIXED) */}
 <AnimatePresence>
  {selectedProduct.length > 0 && (
    <motion.div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl w-[900px] max-w-[95%] p-5 relative shadow-2xl flex gap-4"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >

        {/* ❌ CLOSE */}
        <button
          className="absolute top-3 right-3 text-xl"
          onClick={() => setSelectedProduct([])}
        >
          ✖
        </button>

        {/* 🔹 LEFT SIDE THUMBNAILS */}
        <div className="flex flex-col gap-3 overflow-y-auto max-h-[450px] pr-2">
          {selectedProduct.map((img, index) => {
            const src = img.image?.startsWith("blob")
              ? img.image
              : `https://akceramicworldadmin.unitdtechnologies.com/uploads/${img.image}`;

            return (
              <img
                key={index}
                src={src}
                onClick={() => setCurrentIndex(index)}
                className={`w-20 h-20 object-cover rounded cursor-pointer border-2 transition
                  ${currentIndex === index
                    ? "border-red-500 scale-105"
                    : "border-gray-300"
                  }
                `}
              />
            );
          })}
        </div>

        {/* 🔹 MAIN IMAGE + ZOOM */}
        <div className="flex-1 flex flex-col items-center">

          {/* 🔍 ZOOM CONTAINER */}
          <div
            onMouseMove={handleZoom}
            onMouseLeave={() => setZoomStyle({})}
            className="w-full h-[450px] border rounded overflow-hidden relative"
          >
            <div
              style={{
                backgroundImage: `url(${
                  selectedProduct[currentIndex]?.image?.startsWith("blob")
                    ? selectedProduct[currentIndex].image
                    : `https://akceramicworldadmin.unitdtechnologies.com/uploads/${selectedProduct[currentIndex]?.image}`
                })`,
                backgroundSize: zoomStyle.backgroundPosition ? "200%" : "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: zoomStyle.backgroundPosition || "center",
                width: "100%",
                height: "100%",
              }}
            />
          </div>

          {/* 🔁 NAV */}
          <div className="flex justify-between w-full mt-3">
            <button
              className="bg-gray-200 px-4 py-1 rounded"
              onClick={() =>
                setCurrentIndex(
                  currentIndex === 0
                    ? selectedProduct.length - 1
                    : currentIndex - 1
                )
              }
            >
              ◀ Prev
            </button>

            <button
              className="bg-gray-200 px-4 py-1 rounded"
              onClick={() =>
                setCurrentIndex(
                  currentIndex === selectedProduct.length - 1
                    ? 0
                    : currentIndex + 1
                )
              }
            >
              Next ▶
            </button>
          </div>

          {/* 🧾 DETAILS */}
          <div className="mt-3 text-center">
            <h2 className="text-xl font-bold">{form.product_name}</h2>
            <p className="text-gray-600 text-lg">₹{form.price}</p>
          </div>

        </div>

      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </div>
  );
}