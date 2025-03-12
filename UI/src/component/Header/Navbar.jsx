import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "./header.css";
import {
  Dropdown,
  Space,
  Avatar,
  Menu,
  Modal,
  Button,
  Input,
  Upload,
} from "antd";
import { DownOutlined, UploadOutlined } from "@ant-design/icons";
import { UserContext } from "../../context/UserContext";
import { useForm } from "react-hook-form";
import "./form.css"; // Import the new CSS file for form styling

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const [navScroll, setNav] = useState(false);
  const { userData } = useContext(UserContext);

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        setNav(window.scrollY >= 200);
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const [updateProfileModal, setUpdateProfileModal] = useState(false);
  const openUpdateProfileModal = () => {
    setUpdateProfileModal(true);
  };
  const closeUpdateProfileModal = () => {
    setUpdateProfileModal(false);
  };
  const menuItems = [
    {
      label: <Link to="/login">Lịch sử đơn hàng</Link>,
      key: "0",
    },
    {
      label: <Link to="/register-seller">Trở thành người bán</Link>,
      key: "1",
    },
    {
      label: <div onClick={openUpdateProfileModal}>Thông tin cá nhân</div>,
      key: "2",
    },
    {
      label: <Link to="/login">Đăng xuất</Link>,
      key: "3",
    },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError, // Add setError to handle manual errors
  } = useForm();
  const onSubmit = (data) => {
    if (data.password !== data.confirmPassword) {
      // Set an error for confirmPassword if passwords do not match
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return; // Prevent closing the modal if passwords do not match
    }
    console.log(data);
    closeUpdateProfileModal();
  };

  const password = watch("password");

  return (
    <header
      className={`${
        navScroll
          ? "fixed top-0 w-full z-50 bg-[#F1F5F9] p-2 transition-colors duration-500 ease"
          : "bg-gray-800 p-3"
      }`}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="logo text-4xl p-2 font-bold">
          <Link to="/" className="link">
            <span
              className={`${
                navScroll ? "text text-black" : "text text-white"
              }`}>
              Besign
            </span>
          </Link>
          <span className="dot font-bold ml-2 text-blue-700">.</span>
        </div>
        <div className="md:hidden">
          <button
            className={`${
              navScroll
                ? "text-black focus:outline-none"
                : "text-black focus:outline-none"
            }`}
            onClick={toggleMenu}>
            <svg
              className="h-6 w-6 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24">
              {isOpen ? (
                ""
              ) : (
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4 6a1 1 0 0 1 1-1h14a1 1 0 0 1 0 2H5a1 1 0 0 1-1-1zm0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 0 2H5a1 1 0 0 1-1-1zm0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 0 2H5a1 1 0 0 1-1-1z"
                />
              )}
            </svg>
          </button>
        </div>
        <div className={`md:flex md:items-center ${isOpen ? "" : "hidden"}`}>
          <ul
            className={`${
              navScroll
                ? "md:flex md:space-x-4 font-Lexend-title text"
                : "md:flex md:space-x-4 font-Lexend-title text"
            }`}>
            <li>
              <Link
                to="/"
                className={`block py-2 px-4 relative ${
                  navScroll ? "text-black" : "text-white"
                } hover:text-gray-300 transition duration-300`}>
                Về Chúng Tôi
              </Link>
            </li>
            <li className="relative">
              <div className="block py-1.5 px-4 text-black transition duration-300">
                <Link to={`/all-news`}>
                  <div
                    className={`${
                      navScroll
                        ? "flex items-center hover:text-gray-300 text-black"
                        : "flex items-center hover:text-gray-300 text-white"
                    }`}>
                    Tin Tức
                  </div>
                </Link>
              </div>
            </li>
            <li>
              <Link
                to="/contact-us"
                className={`block py-2 px-4 ${
                  navScroll ? "text-black" : "text-white"
                } hover:text-gray-300 transition duration-300`}>
                Liên Hệ
              </Link>
            </li>
            <li>
              {userData ? (
                <Dropdown
                  overlay={<Menu items={menuItems} />}
                  trigger={["click"]}>
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      <Avatar size={38} src={userData && userData.avatar} />
                      <DownOutlined
                        className={`${
                          navScroll ? "text-black none" : "text-white"
                        }`}
                        style={{ fontSize: "0px" }}
                      />
                    </Space>
                  </a>
                </Dropdown>
              ) : (
                <Link
                  to="/login"
                  className="block py-2 px-4 bg-blue-500 text-white hover:bg-blue-600 transition duration-300">
                  Đăng Nhập
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? "" : "hidden"}`}>
        <div
          className="fixed inset-0 z-50 bg-black opacity-70"
          onClick={toggleMenu}></div>
        <div className="fixed inset-y-0 right-0 z-50 w-64 bg-white">
          <ul className="py-4 text-center font-Lexend-title">
            <li className="mb-2 p-4">
              <a href="/">Trang Chủ</a>
            </li>
            <li className="mb-2 p-4">
              <a href="/all-news">Tin Tức</a>
            </li>
            <li className="mb-2 p-4">
              <a href="/contact-us">Liên Hệ</a>
            </li>
          </ul>
        </div>
      </div>
      <Modal
        title="Thông tin cá nhân"
        visible={updateProfileModal}
        onCancel={closeUpdateProfileModal}
        footer={null}>
        <form onSubmit={handleSubmit(onSubmit)} className="form-container">
          <div className="form-group">
            <label>Fullname</label>
            <Input {...register("fullname")} className="form-input" />
            {errors.fullname && (
              <p className="form-error">{errors.fullname.message}</p>
            )}
          </div>
          <div className="form-group">
            <label>Password</label>
            <Input.Password {...register("password")} className="form-input" />
            {errors.password && (
              <p className="form-error">{errors.password.message}</p>
            )}
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <Input.Password
              {...register("confirmPassword", {
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              className="form-input"
            />
            {errors.confirmPassword && (
              <p className="form-error">{errors.confirmPassword.message}</p>
            )}
          </div>
          <div className="form-group">
            <label>Avatar</label>
            <Upload {...register("avatar")} className="form-upload">
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </div>
          <Button type="primary" htmlType="submit" className="form-submit">
            Submit
          </Button>
        </form>
      </Modal>
    </header>
  );
};

export default Navbar;
