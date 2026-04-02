import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Order from "./pages/Order"
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
// import Login from "./Auth/Login";
// import ProtectedRoute from "./Auth/ProtectedRoute";

function App() {
  return (
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
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />
      </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;