import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Foods from "./pages/Foods";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./route/ProtectedRoute";
import AdminRoute from "./route/AdminRoute";
import AdminOrders from "./admin/AdminOrders";
import AdminFoods from "./admin/AdminFoods";
import AdminFoodTypes from "./admin/AdminFoodTypes";

export default function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<Foods />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
        <Route path="/admin/foods" element={<AdminRoute><AdminFoods /></AdminRoute>} />
        <Route path="/admin/food-types" element={<AdminRoute><AdminFoodTypes /></AdminRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
