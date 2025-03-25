import { useState, useEffect, useRef } from "react";
import Footer from "../../../component/Footer/Footer";
import Navbar from "../../../component/Header/Navbar";
import Lenis from "lenis";
import { useForm } from "react-hook-form";
import { addItems } from "../../../utils/service";
import Message from "../../../component/Message/Message";
import { motion } from "framer-motion";

function ContactUs() {
  const formRef = useRef(null);
  const [formStatus, setFormStatus] = useState("idle"); // idle, submitting, success, error
  const [msg, setMsg] = useState({
    type: "",
    content: "",
    hidden: false,
  });

  const serverMessage = { msg };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

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

  const onSubmit = async (data) => {
    setFormStatus("submitting");
    try {
      const res = await addItems("contact/contact-us", data);
      setMsg({
        type: res.status === 200 ? "success" : "error",
        content: res.data.msg,
        hidden: false,
      });
      setFormStatus(res.status === 200 ? "success" : "error");
      if (res.status === 200) {
        reset();
        setTimeout(() => {
          setFormStatus("idle");
        }, 3000);
      }
    } catch (error) {
      setFormStatus("error");
      setMsg({
        type: "error",
        content: "Có lỗi xảy ra. Vui lòng thử lại sau.",
        hidden: false,
      });
    }
  };

  const contactInfo = [
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
        </svg>
      ),
      title: "Điện thoại",
      content: "+84 33 66 200 23",
      action: "tel:+84336620023",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
        </svg>
      ),
      title: "Email",
      content: "trungducevent@gmail.com",
      action: "mailto:trungducevent@gmail.com",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
      ),
      title: "Trụ sở chính",
      content: "17B, Lê Thị Hồng Gấm, Phường 6, TP. Mỹ Tho, Tiền Giang",
      action: "https://maps.app.goo.gl/gnsN9U5N13P5wJZh6",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      title: "Giờ làm việc",
      content: "Thứ 2 - Thứ 6: 8:00 - 17:00",
      action: null,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Message serverMessage={serverMessage} />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-0 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-[10%] w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-[10%] w-72 h-72 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-24 left-[20%] w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 pt-10 pb-20 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium inline-block mb-4">
                Contact Us
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Hãy Kết Nối Với Chúng Tôi
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Chúng tôi luôn sẵn sàng lắng nghe, tư vấn và hỗ trợ bạn để mang
                đến những thiết kế đẹp mắt và chuyên nghiệp nhất.
              </p>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-stretch">
            {/* Left Column - Contact Info */}
            <motion.div
              className="lg:col-span-2 order-2 lg:order-1 flex flex-col h-full"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full flex flex-col">
                <div className="p-8 md:p-10 flex-grow flex flex-col">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Thông Tin Liên Hệ
                  </h2>

                  <div className="space-y-6 mb-auto">
                    {contactInfo.map((item, index) => (
                      <motion.a
                        key={index}
                        href={item.action}
                        target={
                          item.action && item.action.startsWith("http")
                            ? "_blank"
                            : undefined
                        }
                        rel={
                          item.action && item.action.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className={`flex items-start p-4 rounded-xl hover:bg-blue-50 transition-all duration-300 ${
                          !item.action ? "pointer-events-none" : ""
                        }`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.3 + index * 0.1,
                        }}>
                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-lg">
                          {item.icon}
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">
                            {item.title}
                          </h3>
                          <p className="mt-1 text-gray-600">{item.content}</p>
                        </div>
                      </motion.a>
                    ))}
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Kết Nối Với Chúng Tôi
                    </h3>
                    <div className="flex space-x-4">
                      {[
                        {
                          icon: "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z",
                          name: "Facebook",
                        },
                        {
                          icon: "M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z",
                          name: "Instagram",
                        },
                        {
                          icon: "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84",
                          name: "Twitter",
                        },
                        {
                          icon: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z",
                          name: "LinkedIn",
                        },
                      ].map((social, index) => (
                        <motion.a
                          key={index}
                          href="#"
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-all duration-300"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            duration: 0.3,
                            delay: 0.7 + index * 0.1,
                          }}
                          whileHover={{ scale: 1.1 }}>
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24">
                            <path d={social.icon} />
                          </svg>
                        </motion.a>
                      ))}
                    </div>
                  </div>

                  {/* Visit us card - this replaces the map */}
                  <div className="mt-8 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                      <svg
                        className="w-6 h-6 mr-2 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      Ghé Thăm Văn Phòng
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Chúng tôi rất vui được đón tiếp bạn tại trụ sở chính. Vui
                      lòng đặt lịch hẹn trước để được phục vụ tốt nhất.
                    </p>
                    <a
                      href="https://maps.app.goo.gl/gnsN9U5N13P5wJZh6"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
                      <span>Xem chỉ đường</span>
                      <svg
                        className="w-5 h-5 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Contact Form */}
            <motion.div
              className="lg:col-span-3 order-1 lg:order-2 h-full"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              ref={formRef}>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden relative h-full flex flex-col">
                {/* Success overlay */}
                {formStatus === "success" && (
                  <motion.div
                    className="absolute inset-0 bg-white bg-opacity-95 flex flex-col items-center justify-center z-10 px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Cảm ơn bạn đã liên hệ!
                    </h3>
                    <p className="text-gray-600 text-center max-w-sm">
                      Chúng tôi đã nhận được thông tin và sẽ liên hệ lại với bạn
                      trong thời gian sớm nhất.
                    </p>
                  </motion.div>
                )}

                <div className="p-8 md:p-10 flex-grow">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Gửi Thông Tin Liên Hệ
                    </h2>
                    <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-medium">
                      24/7 Support
                    </span>
                  </div>

                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6 h-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="form-group">
                        <label
                          htmlFor="fullname"
                          className="block mb-2 text-sm font-medium text-gray-900">
                          Họ Và Tên <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                          </div>
                          <input
                            type="text"
                            id="fullname"
                            placeholder="Nhập họ và tên của bạn"
                            {...register("fullname", {
                              required: "Vui lòng nhập họ và tên",
                            })}
                            className={`pl-12 pr-4 py-3.5 w-full rounded-lg border ${
                              errors.fullname
                                ? "border-red-300 focus:ring-red-500"
                                : "border-gray-300 focus:ring-blue-500"
                            } focus:border-transparent focus:ring-2 transition-all duration-200`}
                          />
                        </div>
                        {errors.fullname && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.fullname.message}
                          </p>
                        )}
                      </div>

                      <div className="form-group">
                        <label
                          htmlFor="email"
                          className="block mb-2 text-sm font-medium text-gray-900">
                          Địa Chỉ Email
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                          </div>
                          <input
                            type="email"
                            id="email"
                            placeholder="tên@example.com"
                            {...register("email", {
                              pattern: {
                                value:
                                  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Địa chỉ email không hợp lệ",
                              },
                            })}
                            className={`pl-12 pr-4 py-3.5 w-full rounded-lg border ${
                              errors.email
                                ? "border-red-300 focus:ring-red-500"
                                : "border-gray-300 focus:ring-blue-500"
                            } focus:border-transparent focus:ring-2 transition-all duration-200`}
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="form-group">
                      <label
                        htmlFor="phone"
                        className="block mb-2 text-sm font-medium text-gray-900">
                        Số Điện Thoại <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                          </svg>
                        </div>
                        <input
                          type="tel"
                          id="phone"
                          placeholder="Nhập số điện thoại của bạn"
                          {...register("phone", {
                            required: "Vui lòng nhập số điện thoại",
                          })}
                          className={`pl-12 pr-4 py-3.5 w-full rounded-lg border ${
                            errors.phone
                              ? "border-red-300 focus:ring-red-500"
                              : "border-gray-300 focus:ring-blue-500"
                          } focus:border-transparent focus:ring-2 transition-all duration-200`}
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div className="form-group">
                      <label
                        htmlFor="message"
                        className="block mb-2 text-sm font-medium text-gray-900">
                        Lời Nhắn <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <textarea
                          id="message"
                          rows={5}
                          placeholder="Hãy để lại lời nhắn cho chúng tôi..."
                          {...register("message", {
                            required: "Vui lòng nhập lời nhắn",
                          })}
                          className={`px-4 py-3.5 w-full rounded-lg border ${
                            errors.message
                              ? "border-red-300 focus:ring-red-500"
                              : "border-gray-300 focus:ring-blue-500"
                          } focus:border-transparent focus:ring-2 transition-all duration-200`}></textarea>
                      </div>
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="terms"
                          type="checkbox"
                          {...register("terms", {
                            required: "Vui lòng đồng ý với điều khoản",
                          })}
                          className="w-4 h-4 border-gray-300 rounded focus:ring-blue-500 text-blue-600"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="terms" className="text-gray-600">
                          Tôi đồng ý với{" "}
                          <a href="#" className="text-blue-600 hover:underline">
                            Điều khoản dịch vụ
                          </a>{" "}
                          và{" "}
                          <a href="#" className="text-blue-600 hover:underline">
                            Chính sách bảo mật
                          </a>
                        </label>
                        {errors.terms && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.terms.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={formStatus === "submitting"}
                      className={`w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center ${
                        formStatus === "submitting"
                          ? "opacity-70 cursor-not-allowed"
                          : "hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg"
                      }`}>
                      {formStatus === "submitting" ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Đang gửi...
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="18"
                            height="18"
                            fill="currentColor"
                            className="mr-2">
                            <path d="M1.94607 9.31543C1.42353 9.14125 1.4194 8.86022 1.95682 8.68108L21.043 2.31901C21.5715 2.14285 21.8746 2.43866 21.7265 2.95694L16.2733 22.0432C16.1223 22.5716 15.8177 22.59 15.5944 22.0876L11.9999 14L17.9999 6.00005L9.99992 12L1.94607 9.31543Z"></path>
                          </svg>
                          Gửi Thông Tin
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to action section */}
      <section className="py-16 mt-10">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl overflow-hidden shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between px-6 py-10 md:px-10 md:py-12">
              <div className="text-center md:text-left mb-8 md:mb-0">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Còn bất kỳ thắc mắc nào?
                </h2>
                <p className="text-blue-100 text-lg max-w-lg">
                  Đội ngũ tư vấn của chúng tôi luôn sẵn sàng giải đáp mọi thắc
                  mắc của bạn 24/7.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="tel:+84336620023"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-colors duration-300">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  Gọi Ngay
                </a>
                <a
                  href="https://zalo.me/duongtrongtai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-800 text-white font-medium rounded-lg hover:bg-blue-900 transition-colors duration-300">
                  <img
                    src="https://res.cloudinary.com/dljdvysp7/image/upload/v1715174867/trungduc/Footer/icon/iuhzk4vylm414yl48xbu.png"
                    alt="Zalo"
                    className="w-5 h-5 mr-2"
                  />
                  Chat Zalo
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium inline-block mb-4">
              FAQ
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Câu Hỏi Thường Gặp
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Những thắc mắc phổ biến của khách hàng về dịch vụ thiết kế của
              chúng tôi
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {[
              {
                question: "Thời gian để hoàn thành một thiết kế là bao lâu?",
                answer:
                  "Thời gian hoàn thành thiết kế phụ thuộc vào độ phức tạp của sản phẩm. Thông thường, chúng tôi cần từ 3-5 ngày làm việc cho các thiết kế đơn giản và 7-14 ngày cho các dự án phức tạp. Chúng tôi luôn cung cấp thời gian dự kiến cụ thể khi tiếp nhận yêu cầu từ khách hàng.",
              },
              {
                question:
                  "Tôi có được chỉnh sửa thiết kế sau khi nhận bàn giao không?",
                answer:
                  "Có, chúng tôi cung cấp dịch vụ chỉnh sửa miễn phí trong vòng 7 ngày sau khi bàn giao sản phẩm. Mỗi gói thiết kế đều bao gồm 2-3 lần chỉnh sửa tùy theo gói dịch vụ. Nếu có yêu cầu chỉnh sửa thêm, chúng tôi sẽ tính phí bổ sung một cách hợp lý.",
              },
              {
                question:
                  "Làm thế nào để tôi nhận được bản thiết kế cuối cùng?",
                answer:
                  "Sau khi hoàn thành và được khách hàng chấp thuận, chúng tôi sẽ gửi các file thiết kế thông qua email hoặc dịch vụ lưu trữ đám mây như Google Drive, Dropbox. Đối với các file có dung lượng lớn, chúng tôi sẽ sử dụng các nền tảng chia sẻ file chuyên dụng và đảm bảo bạn nhận được đầy đủ các định dạng file cần thiết.",
              },
              {
                question: "Các hình thức thanh toán được chấp nhận là gì?",
                answer:
                  "Chúng tôi chấp nhận nhiều hình thức thanh toán khác nhau bao gồm chuyển khoản ngân hàng, ví điện tử (MoMo, ZaloPay, VNPay), và thẻ tín dụng/ghi nợ quốc tế. Đối với các dự án lớn, chúng tôi thường yêu cầu thanh toán theo đợt: 50% khi bắt đầu dự án và 50% sau khi hoàn thành.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="mb-5">
                <details className="group bg-white rounded-xl shadow-sm overflow-hidden">
                  <summary className="flex justify-between items-center p-6 cursor-pointer list-none font-medium text-gray-900">
                    <span>{faq.question}</span>
                    <span className="transition-transform duration-300 group-open:rotate-180">
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-gray-600">{faq.answer}</div>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-sm font-medium inline-block mb-4">
              Đánh Giá
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Khách Hàng Nói Gì Về Chúng Tôi
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Những phản hồi chân thực từ khách hàng đã sử dụng dịch vụ thiết kế
              của chúng tôi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Nguyễn Văn A",
                role: "CEO, Công ty ABC",
                image: "https://randomuser.me/api/portraits/men/32.jpg",
                content:
                  "Tôi rất hài lòng với dịch vụ thiết kế của Besign. Họ không chỉ hiểu rõ yêu cầu mà còn đưa ra những ý tưởng sáng tạo vượt trội so với mong đợi của tôi. Thời gian làm việc nhanh chóng và chuyên nghiệp.",
              },
              {
                name: "Trần Thị B",
                role: "Marketing Manager, Startup XYZ",
                image: "https://randomuser.me/api/portraits/women/44.jpg",
                content:
                  "Đội ngũ thiết kế rất tận tâm và sáng tạo. Họ luôn lắng nghe ý kiến và điều chỉnh theo yêu cầu của tôi. Sản phẩm cuối cùng đã nhận được nhiều phản hồi tích cực từ khách hàng của chúng tôi.",
              },
              {
                name: "Lê Văn C",
                role: "Chủ cửa hàng",
                image: "https://randomuser.me/api/portraits/men/55.jpg",
                content:
                  "Tôi đã thử nhiều đơn vị thiết kế khác nhau nhưng Besign là lựa chọn tốt nhất. Họ hiểu rõ thương hiệu của tôi và tạo ra những thiết kế phù hợp với đối tượng khách hàng. Tôi sẽ tiếp tục sử dụng dịch vụ của họ.",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-purple-100"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400 inline-block"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600">{testimonial.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
              <div className="mb-8 md:mb-0 md:mr-8 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Đăng Ký Nhận Thông Tin
                </h2>
                <p className="text-indigo-100 max-w-md">
                  Nhận những thông tin mới nhất về thiết kế, xu hướng và khuyến
                  mãi đặc biệt từ chúng tôi.
                </p>
              </div>
              <div className="w-full md:w-auto">
                <form className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Email của bạn"
                    className="px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white flex-grow min-w-0"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors duration-300 whitespace-nowrap">
                    Đăng Ký
                  </button>
                </form>
                <p className="text-xs text-indigo-200 mt-3 text-center sm:text-left">
                  Chúng tôi tôn trọng quyền riêng tư của bạn. Bạn có thể hủy
                  đăng ký bất cứ lúc nào.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default ContactUs;
