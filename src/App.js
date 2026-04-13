import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Order from "./pages/Order"
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Contact from "./pages/Contact"
import Offer from "./pages/Offer";
import 'react-toastify/dist/ReactToastify.css';
import Customers from "./pages/Customer";
// import Login from "./Auth/Login";
// import ProtectedRoute from "./Auth/ProtectedRoute";

function App() {
  return (
    <>
     <ToastContainer position="top-right" autoClose={2000} />
    <BrowserRouter>
      <Routes>
          {/* <Route path="/login" element={<Login />} />

  <Route
    path="/*"
    element={
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    }
  > */}

          <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/Products" element={<Products />} />
            <Route path="/Order" element={<Order />} />
            <Route path= "/Contact" element={<Contact/>}/>
                  <Route path= "/Offer" element={<Offer/>}/>
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />
           <Route path="/Customers" element={<Customers />} />
      </Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;