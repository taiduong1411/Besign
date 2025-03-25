import { Link, useNavigate } from "react-router-dom";
// import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { axiosCli } from "../../../interceptor/axios";
import { message } from "antd";
// Import icons
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

function Register() {
  localStorage.removeItem("accessToken");
  const [messageApi, contextHolder] = message.useMessage();
  const { register, handleSubmit } = useForm();
  const nav = useNavigate();
  const key = "updatable";
  const onSubmit = async (data) => {
    if (
      !data["email"] ||
      !data["password"] ||
      !data["phone"] ||
      !data["fullname"] ||
      !data["address"]
    ) {
      return messageApi.open({
        type: "error",
        content: "Vui Lòng Điền Đầy Đủ Thông Tin",
      });
    }
    await axiosCli()
      .post("account/register", data)
      .then((res) => {
        if (res.status == 200) {
          messageApi.open({
            key,
            type: "loading",
            content: "Loading...",
          });
          setTimeout(() => {
            messageApi.open({
              key,
              type: "success",
              content: res.data.msg,
              duration: 2,
            });
          }, 1000);
          setTimeout(() => {
            return nav("/login");
          }, 2000);
        } else {
          messageApi.open({
            type: "error",
            content: res.data.msg,
          });
        }
      });
  };
  return (
    <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-900 min-h-screen font-Lexend-title flex items-center justify-center">
      {/* Fixed width container */}
      <div className="w-[500px] h-auto m-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-[1.01] duration-300 h-full">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-center h-[140px] flex flex-col justify-center">
            <h1 className="text-white text-3xl font-bold mb-2">
              Tạo tài khoản mới
            </h1>
            <p className="text-indigo-100 text-sm">
              Đăng ký để trải nghiệm dịch vụ của chúng tôi
            </p>
          </div>

          <div className="p-8">
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {/* Full Name Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                  type="text"
                  {...register("fullname")}
                  placeholder="Nhập họ và tên..."
                  name="fullname"
                  id="fullname"
                  className="pl-10 w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all duration-200 h-[50px]"
                  required=""
                />
              </div>

              {/* Email Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="Nhập email..."
                  name="email"
                  id="email"
                  className="pl-10 w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all duration-200 h-[50px]"
                  required=""
                />
              </div>

              {/* Address Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMapMarkerAlt className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                  type="text"
                  {...register("address")}
                  placeholder="Nhập địa chỉ..."
                  name="address"
                  id="address"
                  className="pl-10 w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all duration-200 h-[50px]"
                  required=""
                />
              </div>

              {/* Phone Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                  type="text"
                  {...register("phone")}
                  placeholder="Nhập số điện thoại..."
                  name="phone"
                  id="phone"
                  className="pl-10 w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all duration-200 h-[50px]"
                  required=""
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                  type="password"
                  {...register("password")}
                  name="password"
                  id="password"
                  placeholder="Nhập mật khẩu..."
                  className="pl-10 w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all duration-200 h-[50px]"
                  required=""
                />
              </div>

              {/* Register Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 h-[50px] mt-6">
                Đăng Ký
              </button>

              {/* Social Login Divider */}
              <div className="relative flex items-center justify-center mt-8 mb-5">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>

              {/* Login Link */}
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Đã có tài khoản?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200">
                  Đăng nhập
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
      {contextHolder}
    </div>
  );
}

export default Register;
