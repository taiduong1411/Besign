import "./App.css";
// import { FiMail, FiPhone } from 'react-icons/fi';
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Route
import AdminRoute from "./route/AdminRoute";
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
        <Route path="/become-seller/" element={<RegisterSeller />} />
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
