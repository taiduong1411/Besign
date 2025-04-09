import { Link } from "react-router-dom";
// import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { axiosCli } from "../../../interceptor/axios";
import { message } from "antd";
import { jwtDecode } from "jwt-decode";
// Import icons
import { FaEnvelope, FaLock, FaGoogle, FaFacebook } from "react-icons/fa";

function Login() {
  localStorage.removeItem("accessToken");
  const [messageApi, contextHolder] = message.useMessage();
  const { register, handleSubmit } = useForm();
  const onSubmit = async (data) => {
    if (!data["email"] || !data["password"]) {
      return messageApi.open({
        type: "error",
        content: "Vui lòng điền đầy đủ thông tin",
      });
    }
    await axiosCli()
      .post("account/login", data)
      .then((res) => {
        if (res.status == 200) {
          localStorage.setItem("accessToken", res.data.token);
          let userInfo = jwtDecode(localStorage.getItem("accessToken"));
          if (userInfo.level == "3")
            return (window.location.href = "/admin/dashboard");
          if (userInfo.level == "2") return (window.location.href = "/");
          if (userInfo.level == "1") return (window.location.href = "/");
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
      {/* Fixed width container (450px) */}
      <div className="w-[550px] h-[750px]  m-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-[1.01] duration-300 h-full">
          {/* Header Section with fixed height */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-center h-[140px] flex flex-col justify-center">
            <h1 className="text-white text-3xl font-bold mb-2">
              Chào mừng trở lại
            </h1>
            <p className="text-indigo-100 text-sm">
              Đăng nhập để truy cập tài khoản của bạn
            </p>
          </div>

          {/* Fixed height for the form container */}
          <div className="p-8 h-[460px]">
            <form
              className="space-y-5 h-full flex flex-col"
              onSubmit={handleSubmit(onSubmit)}>
              {/* Email Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                  type="text"
                  {...register("email")}
                  placeholder="Nhập email..."
                  name="email"
                  id="email"
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
                  placeholder="Nhập Mật Khẩu..."
                  className="pl-10 w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all duration-200 h-[50px]"
                  required=""
                />
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Link
                  to="/verify-email"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200">
                  Quên mật khẩu?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 h-[50px]">
                Đăng Nhập
              </button>

              {/* Social Login Divider */}
              <div className="relative flex items-center justify-center my-4">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                <div className="px-3 bg-white dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400 w-full">
                  hoặc đăng nhập với
                </div>
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>

              {/* Social Login Buttons */}
              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
                  <FaGoogle className="h-5 w-5 text-red-500" />
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
                  <FaFacebook className="h-5 w-5 text-blue-600" />
                </button>
              </div>

              {/* Sign Up Link - auto margins to push it to bottom */}
              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-auto">
                Chưa có tài khoản?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200">
                  Đăng ký tài khoản
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

export default Login;
