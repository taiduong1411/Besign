import { useForm } from "react-hook-form";
import { axiosCli } from "../../../interceptor/axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function ResetPassword() {
  const [messageApi, contextHolder] = message.useMessage();
  const key = "updatable";
  const nav = useNavigate();
  const { register, handleSubmit } = useForm();
  const [timeLeft, setTimeLeft] = useState(10); // 5 minutes in seconds
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
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Đặt Lại Mật Khẩu
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label
                  htmlFor="newPassword"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Mật Khẩu Mới
                </label>
                <input
                  type="password"
                  {...register("password")}
                  placeholder="Nhập mật khẩu mới..."
                  name="password"
                  id="password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required={true}
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Xác Nhận Mật Khẩu
                </label>
                <input
                  type="password"
                  {...register("confirmPassword")}
                  placeholder="Nhập lại mật khẩu mới..."
                  name="confirmPassword"
                  id="confirmPassword"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required={true}
                />
              </div>
              <div>
                <label
                  htmlFor="code"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Mã Xác Thực
                </label>
                <input
                  type="text"
                  {...register("code")}
                  placeholder="Nhập mã xác thực..."
                  name="code"
                  id="code"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required={true}
                />
              </div>
              {!otpExpired && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Mã xác thực sẽ hết hạn sau: {formatTime(timeLeft)}
                </div>
              )}
              {otpExpired && (
                <div className="text-sm text-red-500 dark:text-red-400">
                  Mã xác thực đã hết hạn.{" "}
                  <button
                    type="button"
                    onClick={resendOtp}
                    className="text-blue-500 hover:underline">
                    Gửi lại mã
                  </button>
                </div>
              )}
              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                Gửi
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
