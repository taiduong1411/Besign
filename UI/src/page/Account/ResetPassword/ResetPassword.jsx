import { useForm } from "react-hook-form";
import { axiosCli } from "../../../interceptor/axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
// Import icons
import { FaLock, FaShieldAlt, FaHistory } from "react-icons/fa";

function ResetPassword() {
  const [messageApi, contextHolder] = message.useMessage();
  const key = "updatable";
  const nav = useNavigate();
  const { register, handleSubmit } = useForm();
  const [timeLeft, setTimeLeft] = useState(10); // 10 seconds timer
  const [otpExpired, setOtpExpired] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setOtpExpired(true);
      messageApi.error({
        content: "Mã xác thực đã hết hạn. Vui lòng yêu cầu mã mới.",
      });
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const onSubmit = async (data) => {
    if (!data["password"] || !data["confirmPassword"] || !data["code"]) {
      return messageApi.open({
        type: "error",
        content: "Vui Lòng Điền Đầy Đủ Thông Tin",
      });
    }
    if (data["password"] !== data["confirmPassword"]) {
      return messageApi.error({
        content: "Mật Khẩu Xác Nhận Không Trùng Khớp",
      });
    }
    const allData = {
      ...data,
      email: localStorage.getItem("email"),
    };
    // console.log(allData);
    await axiosCli()
      .post("account/reset-password", allData)
      .then((res) => {
        if (res.status === 200) {
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
          }, 2000);
          setTimeout(() => {
            return nav("/login");
          }, 2000);
        } else {
          messageApi.error({ content: res.data.msg });
        }
      });
  };

  const resendOtp = async () => {
    // Logic to resend OTP
    await axiosCli()
      .post("account/verify-email", { email: localStorage.getItem("email") })
      .then((res) => {
        if (res.status === 200) {
          messageApi.success({
            content: "Mã xác thực mới đã được gửi.",
          });
          setTimeLeft(10); // Reset timer
          setOtpExpired(false); // Reset OTP expired state
        } else {
          messageApi.error({ content: res.data.msg });
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
              Đặt Lại Mật Khẩu
            </h1>
            <p className="text-indigo-100 text-sm">
              Vui lòng nhập mật khẩu mới và mã xác thực
            </p>
          </div>

          <div className="p-8">
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              {/* New Password Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                  type="password"
                  {...register("password")}
                  placeholder="Nhập mật khẩu mới..."
                  name="password"
                  id="password"
                  className="pl-10 w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all duration-200 h-[50px]"
                  required={true}
                />
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                  type="password"
                  {...register("confirmPassword")}
                  placeholder="Nhập lại mật khẩu mới..."
                  name="confirmPassword"
                  id="confirmPassword"
                  className="pl-10 w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all duration-200 h-[50px]"
                  required={true}
                />
              </div>

              {/* Verification Code Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaShieldAlt className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                  type="text"
                  {...register("code")}
                  placeholder="Nhập mã xác thực..."
                  name="code"
                  id="code"
                  className="pl-10 w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all duration-200 h-[50px]"
                  required={true}
                />
              </div>

              {/* Timer Section */}
              {!otpExpired && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 bg-indigo-50 dark:bg-gray-700 p-3 rounded-lg">
                  <FaHistory className="h-4 w-4 text-indigo-500 mr-2" />
                  <span>
                    Mã xác thực sẽ hết hạn sau:{" "}
                    <span className="font-medium text-indigo-600 dark:text-indigo-400">
                      {formatTime(timeLeft)}
                    </span>
                  </span>
                </div>
              )}

              {/* Expired OTP Message */}
              {otpExpired && (
                <div className="flex items-center text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-gray-700 p-3 rounded-lg">
                  <FaHistory className="h-4 w-4 text-red-500 mr-2" />
                  <span>Mã xác thực đã hết hạn. </span>
                  <button
                    type="button"
                    onClick={resendOtp}
                    className="ml-1 font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200">
                    Gửi lại mã
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 mt-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 h-[50px]">
                Xác Nhận
              </button>
            </form>
          </div>
        </div>
      </div>
      {contextHolder}
    </div>
  );
}

export default ResetPassword;
