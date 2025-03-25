import { Breadcrumb, Pagination, Skeleton, Empty } from "antd";
import Footer from "../../../../component/Footer/Footer";
import Navbar from "../../../../component/Header/Navbar";
import {
  HomeOutlined,
  SearchOutlined,
  TagsOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getDataByParams } from "../../../../utils/service";
import { Link } from "react-router-dom";
import Lenis from "lenis";
import AOS from "aos";
import "aos/dist/aos.css";

function AllNews() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDataNews();
    AOS.init({
      duration: 800,
      once: false,
    });

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

    const rafId = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, [currentPage]);

  const [allDataNews, setAllDataNews] = useState([]);
  const [uniqueHashtags, setUniqueHashtags] = useState([]);
  const [activeTag, setActiveTag] = useState("all");

  const getDataNews = async () => {
    setLoading(true);
    await getDataByParams(`news/user-all-news?page=${currentPage}`)
      .then((res) => {
        setAllDataNews(res.data.news);
        setTotalPages(res.data.totalItems);
        setUniqueHashtags(res.data.uniqueHashtags);
        setTimeout(() => setLoading(false), 500);
      })
      .catch((err) => {
        console.error("Error fetching news:", err);
        setLoading(false);
      });
  };

  const handleClickPage = (page) => {
    setCurrentPage(page);
    // Scroll to top when changing page
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const handleTagClick = (tag) => {
    setActiveTag(tag);
  };

  return (
    <div className="bg-[#f9fafc] min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://img.freepik.com/free-vector/abstract-background-with-squares_23-2148995948.jpg')] opacity-10 bg-cover bg-center"></div>

          {/* Animated shapes */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-10 right-10 w-72 h-72 bg-blue-300 opacity-10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}></div>
          <div
            className="absolute top-40 right-20 w-40 h-40 bg-indigo-400 opacity-10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}></div>

          {/* Small decorative elements */}
          <div className="hidden lg:block absolute top-20 left-[20%] w-2 h-2 bg-blue-300 rounded-full animate-ping"></div>
          <div
            className="hidden lg:block absolute top-40 right-[30%] w-2 h-2 bg-indigo-300 rounded-full animate-ping"
            style={{ animationDelay: "1.5s" }}></div>
          <div
            className="hidden lg:block absolute bottom-32 left-[40%] w-3 h-3 bg-white rounded-full animate-ping"
            style={{ animationDelay: "0.8s" }}></div>
          <div
            className="hidden lg:block absolute top-56 left-[60%] w-2 h-2 bg-blue-200 rounded-full animate-ping"
            style={{ animationDelay: "2.2s" }}></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <span
              className="inline-flex items-center mb-3 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium"
              data-aos="fade-down"
              data-aos-delay="50">
              <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
              Cập nhật mới nhất
            </span>

            <h1
              className="text-4xl md:text-6xl font-bold mb-5 leading-tight tracking-tight"
              data-aos="fade-down"
              data-aos-delay="100">
              Tin Tức & Cập Nhật <span className="text-blue-200">Besign</span>
            </h1>

            <p
              className="text-lg md:text-xl opacity-90 mb-10 max-w-2xl mx-auto leading-relaxed"
              data-aos="fade-up"
              data-aos-delay="200">
              Khám phá những tin tức mới nhất, xu hướng và thông tin hữu ích từ
              chúng tôi
            </p>

            <div
              className="relative max-w-xl mx-auto mb-8"
              data-aos="fade-up"
              data-aos-delay="300">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 blur-xl rounded-full"></div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm tin tức..."
                  className="w-full px-8 py-5 rounded-full text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500/30 shadow-xl text-base font-medium bg-white/95 backdrop-blur-sm"
                />
                <button className="absolute right-3 top-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2.5 rounded-full hover:opacity-90 transition transform hover:scale-105 shadow-lg">
                  <SearchOutlined style={{ fontSize: "18px" }} />
                </button>
              </div>
            </div>

            <div
              className="flex flex-wrap justify-center gap-4 mb-8"
              data-aos="fade-up"
              data-aos-delay="400">
              <a
                href="#news"
                className="px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full text-sm font-medium transition flex items-center">
                <TagsOutlined className="mr-2" /> Tin tức mới nhất
              </a>
              <a
                href="#popular"
                className="px-6 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full text-sm font-medium transition flex items-center">
                <ClockCircleOutlined className="mr-2" /> Bài viết phổ biến
              </a>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 120"
            className="w-full h-auto">
            <path
              fill="#f9fafc"
              fillOpacity="1"
              d="M0,64L80,69.3C160,75,320,85,480,85.3C640,85,800,75,960,69.3C1120,64,1280,64,1360,64L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      <div id="news" className="container mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb
            items={[
              {
                href: "/",
                title: <HomeOutlined />,
              },
              {
                title: "Tin tức",
              },
              {
                title: `Tất cả tin tức`,
              },
            ]}
          />
        </div>

        {/* Tags Filter */}
        <div className="mb-10" data-aos="fade-up">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
            <TagsOutlined className="mr-2" /> Chủ đề
          </h2>
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => handleTagClick("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTag === "all"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}>
              Tất Cả
            </button>

            {uniqueHashtags?.map((d, index) => (
              <button
                key={index}
                onClick={() => handleTagClick(d._id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTag === d._id
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}>
                {d._id}
              </button>
            ))}
          </div>
        </div>

        {/* News Grid */}
        <div className="min-h-[50vh]">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="bg-white rounded-xl shadow-sm p-4">
                  <Skeleton.Image
                    active
                    style={{ width: "100%", height: "200px" }}
                  />
                  <Skeleton active paragraph={{ rows: 3 }} />
                </div>
              ))}
            </div>
          ) : allDataNews.length === 0 ? (
            <Empty
              description="Không có tin tức nào cho chủ đề này"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              className="my-20"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allDataNews?.map((data, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}>
                  <Link to={`/news/${data.slug}`} className="block">
                    <div className="relative overflow-hidden h-[220px]">
                      <img
                        src={data.img_cover}
                        alt={data.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                      <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                        <ClockCircleOutlined className="mr-1" />{" "}
                        {new Date().toLocaleDateString("vi-VN")}
                      </div>
                    </div>
                  </Link>
                  <div className="p-6">
                    <Link to={`/news/${data.slug}`}>
                      <h3 className="font-bold text-lg text-gray-800 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                        {data.title}
                      </h3>
                    </Link>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {data?.hashtags?.map((d, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center text-xs font-medium bg-blue-50 text-blue-700 rounded-full px-2.5 py-1">
                          #{d}
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {data.sub_content}
                    </p>
                    <Link
                      to={`/news/${data.slug}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm">
                      Đọc tiếp
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          fillRule="evenodd"
                          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                          clipRule="evenodd"></path>
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && allDataNews.length > 0 && (
            <div
              className="mt-12 flex justify-center items-center"
              data-aos="fade-up">
              <Pagination
                current={currentPage}
                total={totalPages}
                onChange={handleClickPage}
                showSizeChanger={false}
                className="custom-pagination"
              />
            </div>
          )}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16 mt-16">
        <div className="container mx-auto px-4" data-aos="fade-up">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Đăng ký nhận tin mới
            </h2>
            <p className="text-gray-600 mb-8">
              Nhận thông báo về các tin tức và bài viết mới nhất của chúng tôi
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Email của bạn"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap">
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Custom styles */}
      <style>{`
        .custom-pagination .ant-pagination-item {
          border-radius: 9999px;
          margin: 0 4px;
        }
        
        .custom-pagination .ant-pagination-item-active {
          background-color: #2563eb;
          border-color: #2563eb;
        }
        
        .custom-pagination .ant-pagination-item-active a {
          color: white;
        }
        
        .custom-pagination .ant-pagination-prev button,
        .custom-pagination .ant-pagination-next button {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
        }
      `}</style>
    </div>
  );
}

export default AllNews;
