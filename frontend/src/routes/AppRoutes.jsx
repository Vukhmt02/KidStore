import { Route, Routes } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import MainLayout from "../layouts/MainLayout";
import AdminCategories from "../pages/admin/AdminCategories";
import AdminCustomers from "../pages/admin/AdminCustomers";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminNews from "../pages/admin/AdminNews";
import AdminOrders from "../pages/admin/AdminOrders";
import AdminProducts from "../pages/admin/AdminProducts";
import Account from "../pages/Account";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import News from "../pages/News";
import NewsDetail from "../pages/NewsDetail";
import OrderSuccess from "../pages/OrderSuccess";
import ProductDetail from "../pages/ProductDetail";
import ProductList from "../pages/ProductList";
import Register from "../pages/Register";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="news" element={<AdminNews />} />
      </Route>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:slug" element={<NewsDetail />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/account" element={<Account />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
