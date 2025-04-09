import { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import "./header.css";
import { Dropdown, Avatar, Menu, Modal, message } from "antd";
import {
  DownOutlined,
  UserOutlined,
  LogoutOutlined,
  HistoryOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { UserContext } from "../../context/UserContext";
import { useForm } from "react-hook-form";
import upload from "../../utils/upload";
import "./form.css";
import { addItems } from "../../utils/service";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { userData } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [navScroll, setNav] = useState(false);
  const [updateProfileModal, setUpdateProfileModal] = useState(false);
  const [file, setFile] = useState("");
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const openUpdateProfileModal = () => setUpdateProfileModal(true);
  const closeUpdateProfileModal = () => setUpdateProfileModal(false);

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        setNav(window.scrollY >= 100);
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (dataForm) => {
    if (dataForm.password !== dataForm.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Mật khẩu không khớp",
      });
      return;
    }

    try {
      const cloud = await upload(file, "Firver/avatar");
      const data = {
        fullname: dataForm.fullname,
        phone: dataForm.phone,
        address: dataForm.address,
        avatar: cloud ? cloud.url : userData.avatar,
        password: dataForm.password ? dataForm.password : userData.password,
      };
      console.log(data);
      const response = await addItems(
        `account/update-information/${userData._id}`,
        data
      );
      if (response.status === 200) {
        closeUpdateProfileModal();
        // Show success notification
      } else {
        console.log(response.error);
        // Show error notification
        message.error(response.error);
      }
    } catch (error) {
      console.error("Update failed:", error);
      // Show error notification
    }
  };

  const menuItems = [
    {
      key: "0",
      icon: userData && userData.level == "1" ? <HistoryOutlined /> : "",
      label:
        userData && userData.level == "1" ? (
          <Link to="/become-seller">Trở thành người bán</Link>
        ) : (
          <Link to=""></Link>
        ),
    },
    {
      key: "1",
      icon: <ShopOutlined />,
      label:
        userData && userData.level == "1" ? (
          <Link to="/become-seller">Trở thành người bán</Link>
        ) : (
          <Link to="/seller/dashboard">Quản lý cửa hàng</Link>
        ),
    },
    {
      key: "2",
      icon: <UserOutlined />,
      label: <div onClick={openUpdateProfileModal}>Thông tin cá nhân</div>,
    },
    {
      key: "3",
      icon: <LogoutOutlined />,
      label: <Link to="/login">Đăng xuất</Link>,
    },
  ];

  const navLinks = [
    { path: "/", label: "Về Chúng Tôi" },
    { path: "/all-news", label: "Tin Tức" },
    { path: "/contact-us", label: "Liên Hệ" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={`${
        navScroll
          ? "fixed top-0 w-full z-50 bg-white shadow-lg transition-all duration-500 py-3"
          : "bg-gradient-to-r from-blue-900 to-indigo-900 py-4 transition-all duration-500"
      }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <div className="relative h-10 w-10 mr-2 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
            <span className="text-white text-xl font-bold">B</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </div>
          <div>
            <span
              className={`text-2xl font-extrabold ${
                navScroll ? "text-gray-800" : "text-white"
              } transition-colors duration-300`}>
              Besign
            </span>
            <span className="text-3xl font-bold text-blue-500 ml-0.5">.</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center">
          <ul className="flex space-x-1">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`px-4 py-2 mx-1 rounded-lg relative font-medium transition-all duration-300 ${
                    navScroll
                      ? isActive(link.path)
                        ? "text-blue-600"
                        : "text-gray-700 hover:text-blue-600"
                      : isActive(link.path)
                      ? "text-white"
                      : "text-gray-200 hover:text-white"
                  }`}>
                  {link.label}
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                        navScroll ? "bg-blue-600" : "bg-white"
                      }`}
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Auth Button or User Menu */}
          <div className="ml-6">
            {userData ? (
              <Dropdown
                overlay={
                  <Menu
                    items={menuItems}
                    className="mt-2 rounded-xl overflow-hidden border border-gray-200 shadow-xl py-1"
                  />
                }
                trigger={["click"]}
                placement="bottomRight">
                <div className="flex items-center cursor-pointer group">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-transparent group-hover:border-blue-500 transition-all duration-300">
                    <Avatar
                      size={40}
                      src={userData?.avatar}
                      icon={!userData?.avatar && <UserOutlined />}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div
                    className={`ml-2 ${
                      navScroll ? "text-gray-700" : "text-white"
                    }`}>
                    <DownOutlined
                      style={{ fontSize: "12px" }}
                      className="ml-1 opacity-70"
                    />
                  </div>
                </div>
              </Dropdown>
            ) : (
              <Link
                to="/login"
                className={`
                  px-6 py-2.5 rounded-lg font-medium transition-all duration-300
                  ${
                    navScroll
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:from-blue-700 hover:to-indigo-700"
                      : "bg-white bg-opacity-10 backdrop-blur-sm text-white hover:bg-opacity-20"
                  }
                `}>
                Đăng Nhập
              </Link>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden z-50 relative w-10 h-10 flex items-center justify-center"
          onClick={toggleMenu}
          aria-label="Toggle menu">
          <div className="relative">
            <span
              className={`block w-6 h-0.5 rounded-full transition-all duration-300 ${
                navScroll ? "bg-gray-800" : "bg-white"
              } ${isOpen ? "rotate-45 translate-y-1.5" : ""}`}></span>
            <span
              className={`block w-6 h-0.5 rounded-full transition-all duration-300 mt-1.5 ${
                navScroll ? "bg-gray-800" : "bg-white"
              } ${isOpen ? "opacity-0" : ""}`}></span>
            <span
              className={`block w-6 h-0.5 rounded-full transition-all duration-300 mt-1.5 ${
                navScroll ? "bg-gray-800" : "bg-white"
              } ${isOpen ? "-rotate-45 -translate-y-1.5" : ""}`}></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-y-0 right-0 w-4/5 max-w-sm bg-white shadow-2xl z-40 flex flex-col">
            <div className="flex justify-end p-4">
              <div className="w-14 h-14"></div> {/* Spacer for menu button */}
            </div>

            <div className="flex-1 flex flex-col justify-between px-6 py-8">
              {userData && (
                <div className="mb-8 flex items-center">
                  <Avatar
                    size={50}
                    src={userData?.avatar}
                    icon={!userData?.avatar && <UserOutlined />}
                    className="border-2 border-blue-100"
                  />
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">
                      {userData?.fullname || "Người dùng"}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {userData?.email || ""}
                    </p>
                  </div>
                </div>
              )}

              <nav className="flex-1">
                <ul className="space-y-1">
                  {navLinks.map((link) => (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className={`block px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                          isActive(link.path)
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-800 hover:bg-gray-50"
                        }`}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-8 pt-8 border-t border-gray-200">
                {userData ? (
                  <div className="space-y-3">
                    {menuItems.map((item) => (
                      <div
                        key={item.key}
                        onClick={
                          item.key === "2" ? openUpdateProfileModal : undefined
                        }
                        className="flex items-center text-gray-700 hover:text-blue-600 cursor-pointer p-2">
                        <span className="mr-3">{item.icon}</span>
                        {item.key === "3" ? (
                          <Link to="/login" className="w-full">
                            Đăng xuất
                          </Link>
                        ) : item.key === "0" ? (
                          <Link to="/login" className="w-full">
                            Lịch sử đơn hàng
                          </Link>
                        ) : item.key === "1" ? (
                          <Link to="/become-seller" className="w-full">
                            Trở thành người bán
                          </Link>
                        ) : (
                          <span>Thông tin cá nhân</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="w-full block text-center px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    Đăng Nhập
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black z-30"
            onClick={toggleMenu}></motion.div>
        )}
      </AnimatePresence>

      {/* Profile Update Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-3 px-2 py-1">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <UserOutlined />
            </div>
            <h3 className="text-lg font-medium">Thông tin cá nhân</h3>
          </div>
        }
        open={updateProfileModal}
        onCancel={closeUpdateProfileModal}
        footer={null}
        className="profile-modal"
        width={480}
        centered>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <div className="space-y-5">
            <div className="form-group">
              <label
                htmlFor="fullname"
                className="block mb-2 text-sm font-medium text-gray-700">
                Họ Và Tên
              </label>
              <input
                type="text"
                {...register("fullname", {
                  required: "Vui lòng nhập họ và tên",
                })}
                placeholder="Nhập họ và tên..."
                defaultValue={userData?.fullname}
                id="fullname"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              {errors.fullname && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.fullname.message}
                </p>
              )}
            </div>

            <div className="form-group">
              <label
                htmlFor="phone"
                className="block mb-2 text-sm font-medium text-gray-700">
                Số Điện Thoại
              </label>
              <input
                type="text"
                {...register("phone", {
                  required: "Vui lòng nhập số điện thoại",
                })}
                placeholder="Nhập số điện thoại..."
                id="phone"
                defaultValue={userData?.phone}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="form-group">
              <label
                htmlFor="address"
                className="block mb-2 text-sm font-medium text-gray-700">
                Địa Chỉ
              </label>
              <input
                type="text"
                {...register("address", { required: "Vui lòng nhập địa chỉ" })}
                placeholder="Nhập địa chỉ của bạn..."
                id="address"
                defaultValue={userData?.address}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className="form-group">
              <label
                htmlFor="avatar"
                className="block mb-2 text-sm font-medium text-gray-700">
                Ảnh Đại Diện
              </label>
              <div className="flex items-center space-x-4">
                <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gray-100 border border-gray-300">
                  {file ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Avatar preview"
                      className="h-full w-full object-cover"
                    />
                  ) : userData?.avatar ? (
                    <img
                      src={userData.avatar}
                      alt="Current avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                      <UserOutlined style={{ fontSize: "24px" }} />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="avatar-upload"
                    className="px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 inline-block">
                    Chọn ảnh
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                    accept="image/*"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    JPG, PNG hoặc GIF. Tối đa 1MB.
                  </p>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-700">
                Mật Khẩu Mới (không bắt buộc)
              </label>
              <input
                type="password"
                {...register("password")}
                placeholder="Nhập mật khẩu mới nếu muốn thay đổi..."
                id="password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="confirmPassword"
                className="block mb-2 text-sm font-medium text-gray-700">
                Xác Nhận Mật Khẩu Mới
              </label>
              <input
                type="password"
                {...register("confirmPassword")}
                placeholder="Xác nhận mật khẩu mới..."
                id="confirmPassword"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={closeUpdateProfileModal}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg mr-3 hover:bg-gray-50 transition-colors font-medium">
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium flex items-center">
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="mr-2">
                  <path d="M1.94607 9.31543C1.42353 9.14125 1.4194 8.86022 1.95682 8.68108L21.043 2.31901C21.5715 2.14285 21.8746 2.43866 21.7265 2.95694L16.2733 22.0432C16.1223 22.5716 15.8177 22.59 15.5944 22.0876L11.9999 14L17.9999 6.00005L9.99992 12L1.94607 9.31543Z"></path>
                </svg>
              )}
              {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
            </button>
          </div>
        </form>
      </Modal>
    </header>
  );
};

export default Navbar;
