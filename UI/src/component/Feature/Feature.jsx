import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaSearch, FaArrowRight } from "react-icons/fa";

const Featured = () => {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const handleSubmit = () => {
    navigate(`/products/category/${input}`);
  };

  // Popular search categories with icons
  const popularCategories = [
    { name: "Con người", icon: "👤" },
    { name: "Công trình", icon: "🏛️" },
    { name: "Đồ họa", icon: "🎨" },
    { name: "Cách điệu", icon: "✨" },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-700 to-indigo-800 py-20 md:py-28 font-sans">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-10 right-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Column: Text and Search */}
          <div className="w-full lg:w-1/2" data-aos="fade-right">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-white leading-tight">
              Khám phá{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">
                thiết kế nghệ thuật
              </span>{" "}
              độc đáo cho dự án của bạn
            </h1>

            <p className="text-indigo-100 text-lg md:text-xl mb-10 max-w-xl">
              Tìm kiếm và kết nối với những nghệ sĩ tài năng để có được thiết kế
              hoàn hảo cho nhu cầu của bạn.
            </p>

            {/* Search Box */}
            <div className="relative mb-10 max-w-xl">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <FaSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder='Thử "trừu tượng", "minh họa"...'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white text-lg shadow-lg"
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium rounded-xl transition-transform duration-200 hover:-translate-y-1 shadow-lg flex items-center justify-center">
                  <span>Tìm kiếm</span>
                  <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>

            {/* Popular Tags */}
            <div className="mb-8">
              <span className="font-semibold text-lg text-white mb-3 block">
                Phổ biến:
              </span>
              <div className="flex flex-wrap gap-3">
                {popularCategories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInput(category.name);
                      handleSubmit();
                    }}
                    className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition-colors duration-200 text-white flex items-center group">
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 text-white mt-10">
              <div className="text-center">
                <div className="text-3xl font-bold">10k+</div>
                <div className="text-indigo-200 text-sm">Thiết kế</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">1.5k+</div>
                <div className="text-indigo-200 text-sm">Nghệ sĩ</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">95%</div>
                <div className="text-indigo-200 text-sm">Hài lòng</div>
              </div>
            </div>
          </div>

          {/* Right Column: Image */}
          <div
            className="w-full lg:w-1/2"
            data-aos="fade-left"
            data-aos-delay="200">
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-indigo-300 rounded-lg rotate-12 opacity-30 blur-sm"></div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-purple-300 rounded-lg -rotate-12 opacity-30 blur-sm"></div>

              {/* Main image with frame */}
              <div className="relative z-10 bg-white p-3 rounded-2xl shadow-2xl rotate-1 transform transition-transform hover:rotate-0 duration-500">
                <img
                  src="/graphic.png"
                  alt="Art Design Showcase"
                  className="w-full h-auto rounded-xl"
                />

                {/* Floating label */}
                <div className="absolute -bottom-5 -right-5 bg-white dark:bg-gray-800 px-5 py-3 rounded-lg shadow-lg">
                  <div className="flex items-center">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-indigo-${
                            i * 100 + 300
                          }`}>
                          {i === 1 && (
                            <img
                              src="/avatar1.jpg"
                              alt="User"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-bold text-gray-900 dark:text-white">
                        Thiết kế đột phá
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Khám phá ngay
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Featured;
