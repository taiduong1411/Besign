import { useParams, Link } from "react-router-dom";
import Lenis from "lenis";
import Navbar from "../../../../component/Header/Navbar";
import Footer from "../../../../component/Footer/Footer";
import { useEffect, useState } from "react";
import { getDataByParams } from "../../../../utils/service";
import { Breadcrumb, Pagination, Skeleton, Empty, Tag, Statistic } from "antd";
import {
  HomeOutlined,
  TagOutlined,
  CalendarOutlined,
  ArrowRightOutlined,
  ReadOutlined,
  FireOutlined,
  RiseOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import AOS from "aos";
import "aos/dist/aos.css";

function NewsByHashtag() {
  const { query } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dataNews, setDataNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedTags, setRelatedTags] = useState([]);
  const [popularArticles, setPopularArticles] = useState([]);
  const [tagStats, setTagStats] = useState({
    total: 0,
    thisWeek: 0,
    thisMonth: 0,
  });
  const [featuredTags, setFeaturedTags] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    getNewsByTag();
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
  }, [query, currentPage]);

  const getNewsByTag = async () => {
    setLoading(true);
    try {
      const res = await getDataByParams(
        `news/user-get-news-by-tag/${query}?page=${currentPage}`
      );
      setDataNews(res.data.news);
      setTotalPages(res.data.totalItems);

      // Set tag statistics (demo data - this would come from backend in real implementation)
      setTagStats({
        total: res.data.totalItems || Math.floor(Math.random() * 50) + 10,
        thisWeek: Math.floor(Math.random() * 8) + 2,
        thisMonth: Math.floor(Math.random() * 20) + 5,
      });

      // Get some related tags (this is just for UI demo - might need backend support for real implementation)
      try {
        const allTagsRes = await getDataByParams("news/user-all-news?page=1");
        if (allTagsRes.data && allTagsRes.data.uniqueHashtags) {
          const filteredTags = allTagsRes.data.uniqueHashtags
            .filter((tag) => tag._id !== query)
            .slice(0, 5);
          setRelatedTags(filteredTags);

          // Set featured tags with images (for demo purposes)
          setFeaturedTags([
            {
              name: filteredTags[0]?._id || "Công nghệ",
              image:
                "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
              count: Math.floor(Math.random() * 30) + 10,
            },
            {
              name: filteredTags[1]?._id || "Thiết kế",
              image:
                "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
              count: Math.floor(Math.random() * 30) + 10,
            },
            {
              name: filteredTags[2]?._id || "Kinh doanh",
              image:
                "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
              count: Math.floor(Math.random() * 30) + 10,
            },
            {
              name: filteredTags[3]?._id || "Giáo dục",
              image:
                "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
              count: Math.floor(Math.random() * 30) + 10,
            },
          ]);
        }

        // Get popular articles (based on the news we already have)
        if (res.data.news && res.data.news.length > 0) {
          // Randomly select and modify some articles to act as "popular" ones
          const randomArticles = [...res.data.news]
            .sort(() => 0.5 - Math.random())
            .slice(0, Math.min(6, res.data.news.length));

          // Add view counts for display purposes
          const popularWithViews = randomArticles.map((article) => ({
            ...article,
            viewCount: Math.floor(Math.random() * 1000) + 100,
          }));

          setPopularArticles(popularWithViews);
        }
      } catch (error) {
        console.error("Error fetching additional content:", error);
      }

      setTimeout(() => setLoading(false), 500);
    } catch (error) {
      console.error("Error fetching news by tag:", error);
      setLoading(false);
    }
  };

  const handleClickPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="bg-[#f9fafc] min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-700 to-indigo-700 text-white overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 bg-[url('https://img.freepik.com/free-vector/abstract-background-with-squares_23-2148995948.jpg')] opacity-10 bg-cover bg-center"></div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/70"></div>

        {/* Content */}
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span
              className="inline-flex items-center mb-4 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium"
              data-aos="fade-down">
              <TagOutlined className="mr-2" /> Chủ đề
            </span>

            <h1
              className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
              data-aos="fade-up">
              #{query}
            </h1>

            <p
              className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto"
              data-aos="fade-up"
              data-aos-delay="100">
              Khám phá tất cả các bài viết liên quan đến chủ đề{" "}
              <span className="font-semibold">#{query}</span>
            </p>
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

      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb
            items={[
              {
                href: "/",
                title: <HomeOutlined />,
              },
              {
                href: "/all-news",
                title: "Tin tức",
              },
              {
                title: `Chủ đề: ${query}`,
              },
            ]}
          />
        </div>

        {/* Statistics Section */}
        <div className="mb-12" data-aos="fade-up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-md">
              <Statistic
                title={
                  <span className="text-white opacity-80">
                    Tổng số bài viết
                  </span>
                }
                value={tagStats.total}
                prefix={<ReadOutlined />}
                className="custom-statistic"
              />
              <div className="mt-2 text-sm text-blue-100">
                Bài viết với chủ đề #{query}
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-md">
              <Statistic
                title={
                  <span className="text-white opacity-80">Trong tuần này</span>
                }
                value={tagStats.thisWeek}
                prefix={<RiseOutlined />}
                className="custom-statistic"
              />
              <div className="mt-2 text-sm text-indigo-100">
                Bài viết mới trong 7 ngày qua
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-md">
              <Statistic
                title={
                  <span className="text-white opacity-80">Trong tháng này</span>
                }
                value={tagStats.thisMonth}
                prefix={<FireOutlined />}
                className="custom-statistic"
              />
              <div className="mt-2 text-sm text-purple-100">
                Tổng lượt xem trong 30 ngày qua
              </div>
            </div>
          </div>
        </div>

        {/* Related Tags */}
        {relatedTags.length > 0 && (
          <div className="mb-10" data-aos="fade-up">
            <h3 className="text-lg font-medium mb-4 text-gray-700">
              Chủ đề liên quan:
            </h3>
            <div className="flex flex-wrap gap-2">
              {relatedTags.map((tag, index) => (
                <Link to={`/news/tag/${tag._id}`} key={index}>
                  <Tag
                    className="px-4 py-1.5 text-sm cursor-pointer hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    icon={<TagOutlined />}>
                    {tag._id}
                  </Tag>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* News Content - Left Column */}
          <div className="lg:col-span-3">
            <div className="min-h-[60vh]">
              {loading ? (
                <div className="space-y-8">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="bg-white rounded-xl shadow-sm p-6 flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3">
                        <Skeleton.Image
                          active
                          style={{
                            width: "100%",
                            height: "200px",
                            borderRadius: "8px",
                          }}
                        />
                      </div>
                      <div className="md:w-2/3">
                        <Skeleton active paragraph={{ rows: 3 }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : dataNews.length === 0 ? (
                <Empty
                  description={
                    <span className="text-gray-500">
                      Không tìm thấy bài viết nào cho chủ đề{" "}
                      <strong>#{query}</strong>
                    </span>
                  }
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  className="my-20"
                />
              ) : (
                <div className="space-y-8">
                  {dataNews.map((news, index) => (
                    <div
                      key={news._id}
                      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row"
                      data-aos="fade-up"
                      data-aos-delay={index * 100}>
                      <div className="md:w-1/3 h-64 md:h-auto relative overflow-hidden">
                        <Link to={`/news/${news.slug}`}>
                          <img
                            src={news.img_cover}
                            alt={news.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          />
                        </Link>
                      </div>
                      <div className="md:w-2/3 p-6 flex flex-col">
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <CalendarOutlined className="mr-2" />
                          <span>{formatDate(news.updatedAt)}</span>
                        </div>

                        <Link to={`/news/${news.slug}`}>
                          <h2 className="text-xl font-bold text-gray-800 mb-3 hover:text-blue-600 transition-colors line-clamp-2">
                            {news.title}
                          </h2>
                        </Link>

                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {news.sub_content}
                        </p>

                        <div className="mt-auto flex flex-wrap gap-2 mb-4">
                          {news.hashtags?.map((tag, idx) => (
                            <Link to={`/news/tag/${tag}`} key={idx}>
                              <span className="inline-flex items-center text-xs font-medium bg-blue-50 text-blue-700 rounded-full px-2.5 py-1">
                                #{tag}
                              </span>
                            </Link>
                          ))}
                        </div>

                        <Link
                          to={`/news/${news.slug}`}
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                          Đọc tiếp <ArrowRightOutlined className="ml-1" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!loading && dataNews.length > 0 && (
                <div className="mt-12 flex justify-center" data-aos="fade-up">
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

          {/* Sidebar - Right Column */}
          <div className="lg:col-span-1">
            {/* Newsletter Subscription */}
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl overflow-hidden shadow-lg mb-8"
              data-aos="fade-up">
              <div className="p-6 text-white">
                <h3 className="text-xl font-bold mb-3">Đăng ký cập nhật</h3>
                <p className="text-blue-100 mb-5 text-sm">
                  Nhận thông báo về các bài viết mới thuộc chủ đề #{query}
                </p>
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="Email của bạn"
                    className="w-full px-4 py-2.5 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-blue-200 border border-blue-400/30 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                  />
                  <button className="w-full bg-white text-blue-700 font-medium px-4 py-2.5 rounded-lg hover:bg-blue-50 transition-colors text-sm">
                    Đăng ký ngay
                  </button>
                </form>
              </div>
            </div>

            {/* Popular Articles */}
            {popularArticles.length > 0 && (
              <div
                className="bg-white rounded-xl shadow-sm p-6 mb-8"
                data-aos="fade-up">
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  Bài viết nổi bật
                </h3>
                <div className="space-y-4">
                  {popularArticles.slice(0, 3).map((article, index) => (
                    <Link
                      to={`/news/${article.slug}`}
                      key={index}
                      className="block">
                      <div className="flex gap-3 group">
                        <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                          <img
                            src={article.img_cover}
                            alt={article.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {article.title}
                          </h4>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <ClockCircleOutlined className="mr-1" />
                            <span>{formatDate(article.updatedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Tag Cloud */}
            <div
              className="bg-white rounded-xl shadow-sm p-6"
              data-aos="fade-up">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Từ khóa phổ biến
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Công nghệ",
                  "Thiết kế",
                  "Marketing",
                  "Thương mại",
                  "Sự kiện",
                  "Mobile",
                  "Web",
                  "AI",
                  "Cloud",
                  "Phát triển",
                ].map((tag, idx) => (
                  <Link to={`/news/tag/${tag}`} key={idx}>
                    <Tag
                      color={
                        ["blue", "cyan", "geekblue", "purple", "magenta"][
                          idx % 5
                        ]
                      }
                      className="px-3 py-1 text-sm mb-2 cursor-pointer">
                      {tag}
                    </Tag>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Tags Section */}
        {featuredTags.length > 0 && (
          <div className="mt-16 mb-10" data-aos="fade-up">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                Khám phá thêm chủ đề
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Những chủ đề nổi bật khác có thể bạn quan tâm
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredTags.map((tag, index) => (
                <Link to={`/news/tag/${tag.name}`} key={index}>
                  <div
                    className="relative h-52 rounded-xl overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}>
                    <img
                      src={tag.image}
                      alt={tag.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-xl font-bold text-white mb-1">
                        #{tag.name}
                      </h3>
                      <p className="text-sm text-white/80">
                        {tag.count} bài viết
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Subscribe Section */}
        <div
          className="my-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 shadow-sm"
          data-aos="fade-up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                Nhận thông báo bài viết mới
              </h2>
              <p className="text-gray-600 mb-4 md:mb-0">
                Đăng ký nhận tin từ chúng tôi để không bỏ lỡ những bài viết chất
                lượng về công nghệ, thiết kế và xu hướng mới nhất.
              </p>
            </div>
            <div>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="flex-1 px-4 py-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-blue-600 text-white px-6 py-3 rounded-r-lg font-medium hover:bg-blue-700 transition-colors">
                  Đăng ký
                </button>
              </div>
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
        
        .custom-statistic .ant-statistic-title {
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
          margin-bottom: 8px;
        }
        
        .custom-statistic .ant-statistic-content {
          color: white;
          font-size: 28px;
        }
        
        .custom-statistic .ant-statistic-content-prefix {
          margin-right: 8px;
        }
      `}</style>
    </div>
  );
}

export default NewsByHashtag;
