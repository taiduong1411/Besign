import Footer from "../../../component/Footer/Footer";
import Navbar from "../../../component/Header/Navbar";
import Lenis from "lenis";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { addItems } from "../../../utils/service";
import Message from "../../../component/Message/Message";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaIdCard,
  FaMapMarkerAlt,
  FaCheckCircle,
} from "react-icons/fa";

function RegisterSeller() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "both",
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 1.5,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const [msg, setMsg] = useState({
    type: "",
    content: "",
    hidden: false,
  });

  const [step, setStep] = useState(1);

  const serverMessage = {
    msg,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    // Transform the data for API submission
    const formData = new FormData();

    // Add all text fields
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    try {
      // Change endpoint to the one that registers sellers
      const response = await addItems("user/become-seller", data);
      setMsg({
        type: response.status === 200 ? "success" : "error",
        content: response.data.msg || "Đăng ký thành công!",
        hidden: false,
      });

      if (response.status === 200) {
        setStep(3);
      }
    } catch (error) {
      setMsg({
        type: "error",
        content:
          error.response?.data?.msg || "Có lỗi xảy ra, vui lòng thử lại sau.",
        hidden: false,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Message serverMessage={serverMessage} />
      <Navbar />

      <div className="container mx-auto py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-indigo-800 mb-3">
              Đăng Ký Trở Thành Người Bán
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Bắt đầu hành trình kinh doanh của bạn và kết nối với khách hàng
              trên toàn thế giới
            </p>

            {/* Step progress indicator */}
            <div className="flex items-center justify-center mt-8">
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= 1
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}>
                  1
                </div>
                <div className="text-sm font-medium ml-2">
                  Thông tin cá nhân
                </div>
              </div>
              <div
                className={`w-16 h-1 mx-2 ${
                  step >= 2 ? "bg-indigo-600" : "bg-gray-200"
                }`}></div>
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= 2
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}>
                  2
                </div>
                <div className="text-sm font-medium ml-2">
                  Chi tiết cửa hàng
                </div>
              </div>
              <div
                className={`w-16 h-1 mx-2 ${
                  step >= 3 ? "bg-indigo-600" : "bg-gray-200"
                }`}></div>
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= 3
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}>
                  3
                </div>
                <div className="text-sm font-medium ml-2">Hoàn tất</div>
              </div>
            </div>
          </div>

          {/* Form container */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Step 1: Personal Information */}
              {step === 1 && (
                <div className="p-8 md:p-12">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Thông Tin Cá Nhân
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Họ và tên
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUser className="text-gray-400" />
                        </div>
                        <input
                          {...register("fullName", {
                            required: "Vui lòng nhập họ và tên",
                          })}
                          type="text"
                          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Nguyễn Văn A"
                        />
                      </div>
                      {errors.fullName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaEnvelope className="text-gray-400" />
                        </div>
                        <input
                          {...register("email", {
                            required: "Vui lòng nhập email",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Email không hợp lệ",
                            },
                          })}
                          type="email"
                          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="email@example.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Số điện thoại
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaPhone className="text-gray-400" />
                        </div>
                        <input
                          {...register("phone", {
                            required: "Vui lòng nhập số điện thoại",
                            pattern: {
                              value: /^[0-9]{10,11}$/,
                              message: "Số điện thoại không hợp lệ",
                            },
                          })}
                          type="tel"
                          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="0912345678"
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        CMND/CCCD
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaIdCard className="text-gray-400" />
                        </div>
                        <input
                          {...register("idCardNumber", {
                            required: "Vui lòng nhập số CMND/CCCD",
                            pattern: {
                              value: /^[0-9]{9,12}$/,
                              message: "Số CMND/CCCD không hợp lệ",
                            },
                          })}
                          type="text"
                          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="123456789012"
                        />
                      </div>
                      {errors.idCardNumber && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.idCardNumber.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300">
                      Tiếp theo
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Shop Information */}
              {step === 2 && (
                <div className="p-8 md:p-12">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Thông Tin Cửa Hàng
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Tên cửa hàng
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaBuilding className="text-gray-400" />
                        </div>
                        <input
                          {...register("shopName", {
                            required: "Vui lòng nhập tên cửa hàng",
                          })}
                          type="text"
                          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Cửa hàng ABC"
                        />
                      </div>
                      {errors.shopName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.shopName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Địa chỉ
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaMapMarkerAlt className="text-gray-400" />
                        </div>
                        <input
                          {...register("address", {
                            required: "Vui lòng nhập địa chỉ",
                          })}
                          type="text"
                          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="123 Đường ABC, Quận XYZ, TP. HCM"
                        />
                      </div>
                      {errors.address && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.address.message}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Mô tả cửa hàng
                      </label>
                      <textarea
                        {...register("description", {
                          required: "Vui lòng nhập mô tả cửa hàng",
                        })}
                        rows="4"
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Mô tả về cửa hàng của bạn, sản phẩm bạn bán và các dịch vụ bạn cung cấp..."></textarea>
                      {errors.description && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.description.message}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <div className="flex items-center">
                        <input
                          {...register("agreeTerms", {
                            required: "Bạn phải đồng ý với các điều khoản",
                          })}
                          type="checkbox"
                          id="agreeTerms"
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <label
                          htmlFor="agreeTerms"
                          className="ml-2 block text-sm text-gray-700">
                          Tôi đồng ý với{" "}
                          <span className="text-indigo-600 hover:text-indigo-500">
                            Điều khoản dịch vụ
                          </span>{" "}
                          và{" "}
                          <span className="text-indigo-600 hover:text-indigo-500">
                            Chính sách quyền riêng tư
                          </span>
                        </label>
                      </div>
                      {errors.agreeTerms && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.agreeTerms.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-300">
                      Quay lại
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300">
                      Đăng ký
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Success */}
              {step === 3 && (
                <div className="p-8 md:p-12 text-center">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                    <FaCheckCircle className="text-green-500 text-5xl" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Đăng ký thành công!
                  </h2>
                  <p className="text-gray-600 max-w-md mx-auto mb-8">
                    Cảm ơn bạn đã đăng ký trở thành người bán. Chúng tôi sẽ xem
                    xét đơn đăng ký của bạn và thông báo kết quả trong thời gian
                    sớm nhất.
                  </p>
                  <a
                    href="/"
                    className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300">
                    Trở về trang chủ
                  </a>
                </div>
              )}
            </form>
          </div>

          {/* Benefits section */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
              Lợi ích khi trở thành người bán
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-md transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">
                  Tăng Doanh Thu
                </h4>
                <p className="text-gray-600">
                  Mở rộng kênh bán hàng và tiếp cận hàng triệu khách hàng tiềm
                  năng, giúp tăng doanh thu và lợi nhuận.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">
                  Quản Lý Dễ Dàng
                </h4>
                <p className="text-gray-600">
                  Hệ thống quản lý đơn giản, hiệu quả giúp bạn theo dõi đơn
                  hàng, sản phẩm và khách hàng mọi lúc, mọi nơi.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">
                  Công Cụ Marketing
                </h4>
                <p className="text-gray-600">
                  Tiếp cận các công cụ marketing hiệu quả giúp bạn quảng bá sản
                  phẩm và xây dựng thương hiệu mạnh mẽ.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
}

export default RegisterSeller;
