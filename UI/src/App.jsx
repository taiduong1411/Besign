import "./App.css";
// import { FiMail, FiPhone } from 'react-icons/fi';
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Route
import AdminRoute from "./route/AdminRoute";
import SellerRoute from "./route/SellerRoute";
// import UserRoute from "./route/UserRoute";
// Page
import Home from "./page/Home/Home";
import ContactUs from "./page/User/ContactUs/ContactUs";
import Login from "./page/Account/Login/Login";
import DashBoard from "./page/Admin/DashBoard/Dashboard";
import Register from "./page/Account/Register/Register";
import PageNotFound from "./page/404/PageNotFound";
import News from "./page/Admin/News/News";
import NewsDetail from "./page/User/NewsPage/NewsDetail/NewsDetail";
import NewsByHashtag from "./page/User/NewsPage/NewsByHashtag/NewsByHashtag";
import AllNews from "./page/User/NewsPage/AllNews/AllNews";
import Contact from "./page/Admin/Contact/Contact";
import VerifyEmail from "./page/Account/VerifyEmail/VeriyEmail";
import ResetPassword from "./page/Account/ResetPassword/ResetPassword";
import UpdateProfile from "./page/Account/UpdateInfomation/UpdateProfile";
import RegisterSeller from "./page/User/RegisterSeller/RegisterSeller";
import SellerApproval from "./page/Admin/Seller/SellerApproval";
import DashBoardSeller from "./page/Seller/Dashboard/DashboardSeller";
import Products from "./page/Product/Products/Products";
import SellerProducts from "./page/Seller/Products/Products";
import CustomerChat from "./page/Seller/Customer/CustomerChat";
import ProductDetail from "./page/Product/ProductDetail/ProductDetail";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<PageNotFound />} />
        <Route path="/" element={<Home />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/news/:slug" element={<NewsDetail />} />
        <Route path="/news/tag/:query" element={<NewsByHashtag />} />
        <Route path="/all-news/" element={<AllNews />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/products" element={<Products />} />

        <Route path="/become-seller/" element={<RegisterSeller />} />
        {/* Only Seller */}
        <Route exact path="/" element={<SellerRoute />}>
          <Route path="seller/dashboard" element={<DashBoardSeller />} />
          <Route path="seller/products-manager" element={<SellerProducts />} />
          <Route path="seller/customer-chat" element={<CustomerChat />} />
        </Route>
        {/* Only Admin */}
        <Route exact path="/" element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<DashBoard />} />
          <Route path="/admin/news-manager" element={<News />} />
          <Route path="/admin/customer-contact" element={<Contact />} />
          <Route path="/admin/seller-approval" element={<SellerApproval />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
