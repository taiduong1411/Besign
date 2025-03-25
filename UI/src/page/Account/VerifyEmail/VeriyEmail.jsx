import { Link } from "react-router-dom";
// import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
// import { axiosCli } from "../../../interceptor/axios";
import { message } from "antd";
import { axiosCli } from "../../../interceptor/axios";
import { useNavigate } from "react-router-dom";
// Import icons
import { FaEnvelope, FaArrowRight } from "react-icons/fa";

function VerifyEmail() {
  const [messageApi, contextHolder] = message.useMessage();
  const nav = useNavigate();
  const { register, handleSubmit } = useForm();
  const onSubmit = async (data) => {
    if (!data["email"]) {
      return messageApi.open({
        type: "error",
        content: "Vui lòng điền đầy đủ thông tin",
      });
    }
    axiosCli()
      .post("account/verify-email", data)
      .then((res) => {
        if (res.status == 200) {
          localStorage.setItem("email", data["email"]);
          setTimeout(() => {
            return nav("/reset-password");
          }, 3000);
          return messageApi.open({
            type: "success",
            content: res.data.msg,
          });
        } else {
          return messageApi.open({
            type: "error",
            content: res.data.msg,
          });
        }
      });
  };
  return (
    <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-900 min-h-screen font-Lexend-title flex items-center justify-center">
      {/* Fixed width container */}
      <div className="w-[450px] h-auto m-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-[1.01] duration-300 h-full">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-center h-[140px] flex flex-col justify-center">
            <h1 className="text-white text-3xl font-bold mb-2">
              Xác Thực Email
            </h1>
            <p className="text-indigo-100 text-sm">
              Nhập email của bạn để nhận mã xác thực
            </p>
          </div>

          <div className="p-8">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Email Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="Vui lòng nhập email..."
                  name="email"
                  id="email"
                  className="pl-10 w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all duration-200 h-[50px]"
                  required="true"
                />
              </div>

              {/* Information Card */}
              <div className="bg-indigo-50 dark:bg-gray-700 p-4 rounded-lg border-l-4 border-indigo-500">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Chúng tôi sẽ gửi mã xác thực đến email của bạn. Vui lòng kiểm
                  tra hộp thư đến sau khi gửi yêu cầu.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 h-[50px] flex items-center justify-center">
                <span>Gửi Mã Xác Thực</span>
                <FaArrowRight className="ml-2 h-4 w-4" />
              </button>

              {/* Links Section */}
              <div className="space-y-3 mt-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 flex justify-center">
                  <Link
                    to="/login"
                    className="font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200 flex items-center">
                    <span>Quay lại đăng nhập</span>
                  </Link>
                </p>

                <div className="relative flex items-center justify-center my-4">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>

                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Chưa có tài khoản?{" "}
                  <Link
                    to="/register"
                    className="font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200">
                    Đăng ký tài khoản
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      {contextHolder}
    </div>
  );
}

export default VerifyEmail;
