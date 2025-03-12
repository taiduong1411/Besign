import Footer from "../../../component/Footer/Footer";
import Navbar from "../../../component/Header/Navbar";
import Lenis from "lenis";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { addItems } from "../../../utils/service";
import Message from "../../../component/Message/Message";
function ContactUs() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "both",
      smooth: true,
      smoothTouch: true,
      touchMultiplier: 2,
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
  const serverMessage = {
    msg,
  };
  const { register, handleSubmit } = useForm();
  const onSubmit = async (data) => {
    await addItems("contact/contact-us", data).then((res) => {
      setMsg({
        type: res.status == 200 ? "success" : "error",
        content: res.data.msg,
        hidden: false,
      });
    });
  };
  return (
    <div>
      <Message serverMessage={serverMessage} />
      <div>
        <Navbar />
      </div>
      <div className="min-h-svh h-full flex justify-center items-center max-[1200px]:mb-8">
        <div className="w-full flex max-[1200px]:flex-col px-12 max-[1200px]:px-4">
          <div className="w-1/2 max-[1200px]:w-full mb-8">
            <div className="max-[1200px]:mt-8">
              <h1 className="max-[1200px]:text-center text-3xl font-Lexend-content text-red-500 max-[1200px]:text-xl">
                Contact Us ?
              </h1>
              <p className="max-[1200px]:text-center mt-4 text-4xl font-bold font-Lexend-content text-[#013A70] max-[1200px]:text-3xl">
                Liên Hệ Với Chúng Tôi
              </p>
              <p className="font-Lexend-content text-gray-500 mt-4 w-3/4 max-[1200px]:hidden">
                Hãy liên hệ với chúng tôi để chia sẻ ý tưởng, nhận báo giá và
                tìm hiểu thêm về sản phẩm của chúng tôi. Đội ngũ của chúng tôi
                luôn sẵn lòng lắng nghe và hỗ trợ bạn trong mọi yêu cầu. Đừng
                ngần ngại gửi email, điện thoại hoặc đến trực tiếp văn phòng của
                chúng tôi để bắt đầu hành trình sáng tạo cùng Besign.
              </p>
            </div>
          </div>
          <div className="overflow-hidden flex justify-center w-1/2 max-[1200px]:w-full bg-white shadow-sm border rounded-2xl font-Lexend-content ">
            <div className="w-full p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-Lexend-content text-red-500 py-2">
                  Get in touch
                </h1>
                <p className="title-color">
                  Liên hệ với chúng tôi để được hỗ trợ nhanh chóng
                </p>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-6">
                  <label
                    htmlFor="fullname"
                    className="block mb-2 text-sm text-gray-900 ">
                    Họ Và Tên
                  </label>
                  <input
                    type="text"
                    {...register("fullname")}
                    placeholder="Nhập họ và tên ..."
                    id="fullname"
                    className="border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm text-gray-900 ">
                    Địa Chỉ Email
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="Nhập địa chỉ email ..."
                    id="email"
                    name="email"
                    className="border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5"
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="phone"
                    className="block mb-2 text-sm text-gray-900 ">
                    Số Điện Thoại
                  </label>
                  <input
                    type="text"
                    {...register("phone")}
                    placeholder="Nhập số điện thoại ..."
                    id="phone"
                    className="border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="message"
                    className="block mb-2 text-sm text-gray-900 ">
                    Lời Nhắn
                  </label>
                  <textarea
                    rows={4}
                    type="text"
                    {...register("message")}
                    placeholder="Hãy để lại lời nhắn cho chúng tôi ..."
                    name="message"
                    id="message"
                    className="border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="text-white mb-4 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center flex items-center">
                  <div className="flex items-center text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="currentColor">
                      <path d="M1.94607 9.31543C1.42353 9.14125 1.4194 8.86022 1.95682 8.68108L21.043 2.31901C21.5715 2.14285 21.8746 2.43866 21.7265 2.95694L16.2733 22.0432C16.1223 22.5716 15.8177 22.59 15.5944 22.0876L11.9999 14L17.9999 6.00005L9.99992 12L1.94607 9.31543Z"></path>
                    </svg>
                    <span className="ml-2 text-center">Gửi</span>
                  </div>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default ContactUs;
