import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getDataByParams } from "../../../../utils/service";
import Navbar from "../../../../component/Header/Navbar";
import Footer from "../../../../component/Footer/Footer";
import { Button, Breadcrumb, Skeleton, Card, Tag } from "antd";
import Lenis from "lenis";
import { useNavigate } from "react-router-dom";
import "./NewsDetail.css";
import {
  HomeOutlined,
  TagOutlined,
  CalendarOutlined,
  ShareAltOutlined,
  ArrowLeftOutlined,
  EyeOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import AOS from "aos";
import "aos/dist/aos.css";

function NewsDetail() {
  const { slug } = useParams();
  const nav = useNavigate();
  const [dataDetail, setDataDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedNews, setRelatedNews] = useState([]);
  const [trendingNews, setTrendingNews] = useState([]);
  const [latestNews, setLatestNews] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    getDataNews();
    AOS.init({
      duration: 800,
      once: true,
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
  }, [slug]);

  const getDataNews = async () => {
    setLoading(true);
    try {
      const res = await getDataByParams(`news/user-get-detail/${slug}`);
      setDataDetail(res.data);

      // Get related news based on tags
      if (res.data.hashtags && res.data.hashtags.length > 0) {
        const relatedRes = await getDataByParams(
          `news/tag/${res.data.hashtags[0]}`
        );
        // Filter out current article
        const filtered = relatedRes.data
          .filter((item) => item.slug !== slug)
          .slice(0, 3);
        setRelatedNews(filtered);
      }

      // Get trending and latest news
      try {
        const allNewsRes = await getDataByParams(`news/user-all-news?page=1`);
        if (allNewsRes.data && allNewsRes.data.news) {
          // Filter out current article from all news
          const otherNews = allNewsRes.data.news.filter(
            (item) => item.slug !== slug
          );

          // Set trending news (random selection of 4 for demo purposes)
          const shuffled = [...otherNews].sort(() => 0.5 - Math.random());
          setTrendingNews(shuffled.slice(0, 4));

          // Set latest news (first 6 excluding current)
          setLatestNews(otherNews.slice(0, 6));
        }
      } catch (error) {
        console.error("Error fetching additional news:", error);
      }

      setTimeout(() => setLoading(false), 300);
    } catch (error) {
      console.error("Error fetching news details:", error);
      setLoading(false);
    }
  };

  const handleClickTag = async (tag) => {
    nav(`/news/tag/${tag}`);
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

  // Estimate reading time
  const getReadingTime = (content) => {
    if (!content) return "5 phút";
    // Strip HTML tags and count words
    const text = content.replace(/<[^>]*>/g, "");
    const words = text.split(/\s+/).length;
    // Average reading speed: 200 words per minute
    const minutes = Math.ceil(words / 200);
    return `${minutes} phút`;
  };

  return (
    <div className="bg-[#f9fafc] min-h-screen">
      <Navbar />

      {loading ? (
        <div className="container mx-auto px-4 py-12">
          <Skeleton active paragraph={{ rows: 1 }} className="mb-4" />
          <Skeleton.Image
            style={{ width: "100%", height: "400px" }}
            className="mb-8"
          />
          <Skeleton active paragraph={{ rows: 12 }} />
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <div className="relative bg-gradient-to-r from-blue-700 to-indigo-700 text-white overflow-hidden">
            {/* Background texture */}
            <div className="absolute inset-0 bg-[url('https://img.freepik.com/free-vector/abstract-background-with-squares_23-2148995948.jpg')] opacity-10 bg-cover bg-center"></div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/70"></div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12 relative z-10">
              <div className="max-w-4xl mx-auto">
                <Link
                  to="/all-news"
                  className="inline-flex items-center text-blue-200 hover:text-white mb-4 transition-colors">
                  <ArrowLeftOutlined className="mr-2" /> Quay lại trang tin tức
                </Link>

                <div
                  className="mb-6 flex items-center space-x-2"
                  data-aos="fade-up">
                  <Breadcrumb
                    items={[
                      {
                        href: "/",
                        title: (
                          <span className="text-blue-200">
                            <HomeOutlined />
                          </span>
                        ),
                      },
                      {
                        href: "/all-news",
                        title: <span className="text-blue-200">Tin tức</span>,
                      },
                      {
                        title: (
                          <span className="text-white">{dataDetail.title}</span>
                        ),
                      },
                    ]}
                  />
                </div>

                <div data-aos="fade-up" data-aos-delay="100">
                  {dataDetail.hashtags?.map((tag, index) => (
                    <Tag
                      key={index}
                      className="bg-white/20 backdrop-blur-sm border-0 text-white mb-4 mr-2"
                      icon={<TagOutlined />}
                      onClick={() => handleClickTag(tag)}>
                      {tag}
                    </Tag>
                  ))}
                </div>

                <h1
                  className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
                  data-aos="fade-up"
                  data-aos-delay="150">
                  {dataDetail.title}
                </h1>

                <div
                  className="flex flex-wrap items-center text-blue-100 text-sm mb-8"
                  data-aos="fade-up"
                  data-aos-delay="200">
                  <div className="flex items-center mr-6">
                    <CalendarOutlined className="mr-2" />
                    <span>{formatDate(dataDetail.updatedAt)}</span>
                  </div>
                  <div className="flex items-center mr-6">
                    <ClockCircleOutlined className="mr-2" />
                    <span>{getReadingTime(dataDetail.content)} đọc</span>
                  </div>
                  <div className="flex items-center">
                    <EyeOutlined className="mr-2" />
                    <span>123 lượt xem</span>
                  </div>
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

          {/* Featured Image */}
          <div className="container mx-auto px-4 -mt-16 relative z-20 mb-12">
            <div className="max-w-4xl mx-auto">
              <div
                className="rounded-xl overflow-hidden shadow-2xl h-[400px] md:h-[500px]"
                data-aos="fade-up">
                <img
                  src={dataDetail.img_cover}
                  alt={dataDetail.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="container mx-auto px-4 mb-16">
            <div className="max-w-4xl mx-auto">
              {/* Article content */}
              <div
                className="bg-white rounded-xl shadow-sm p-8 mb-8 prose prose-lg max-w-none"
                data-aos="fade-up"
                data-aos-delay="100">
                <div
                  className="article-content"
                  dangerouslySetInnerHTML={{ __html: dataDetail.content }}
                />
              </div>

              {/* Tags and sharing */}
              <div
                className="bg-white rounded-xl shadow-sm p-6 mb-12"
                data-aos="fade-up"
                data-aos-delay="150">
                <div className="flex flex-wrap items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-gray-500 text-sm font-medium mb-3">
                      Chủ đề:
                    </h3>
                    <div>
                      {dataDetail.hashtags?.map((tag, index) => (
                        <Button
                          key={index}
                          type="default"
                          shape="round"
                          icon={<TagOutlined />}
                          className="mr-2 mb-2"
                          onClick={() => handleClickTag(tag)}>
                          {tag}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-gray-500 text-sm font-medium mb-3">
                      Chia sẻ bài viết:
                    </h3>
                    <div className="flex space-x-2">
                      <Button
                        type="primary"
                        shape="circle"
                        className="bg-[#1877F2] border-none hover:opacity-90"
                        icon={
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16">
                            <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                          </svg>
                        }
                        onClick={() =>
                          window.open(
                            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                              window.location.href
                            )}`,
                            "_blank"
                          )
                        }
                      />
                      <Button
                        type="primary"
                        shape="circle"
                        className="bg-[#1DA1F2] border-none hover:opacity-90"
                        icon={
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16">
                            <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                          </svg>
                        }
                        onClick={() =>
                          window.open(
                            `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                              window.location.href
                            )}&text=${encodeURIComponent(dataDetail.title)}`,
                            "_blank"
                          )
                        }
                      />
                      <Button
                        type="primary"
                        shape="circle"
                        className="bg-[#0A66C2] border-none hover:opacity-90"
                        icon={
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16">
                            <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                          </svg>
                        }
                        onClick={() =>
                          window.open(
                            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                              window.location.href
                            )}`,
                            "_blank"
                          )
                        }
                      />
                      <Button
                        type="default"
                        shape="circle"
                        icon={<ShareAltOutlined />}
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: dataDetail.title,
                              url: window.location.href,
                            });
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Related Articles */}
              {relatedNews.length > 0 && (
                <div data-aos="fade-up" data-aos-delay="200" className="mb-16">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    Bài viết liên quan
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedNews.map((article, index) => (
                      <Link to={`/news/${article.slug}`} key={index}>
                        <Card
                          hoverable
                          cover={
                            <div className="h-48 overflow-hidden">
                              <img
                                alt={article.title}
                                src={article.img_cover}
                                className="w-full h-full object-cover transition duration-500 hover:scale-110"
                              />
                            </div>
                          }
                          className="h-full">
                          <div className="mb-2">
                            {article.hashtags?.slice(0, 2).map((tag, idx) => (
                              <Tag key={idx} className="mr-1">
                                {tag}
                              </Tag>
                            ))}
                          </div>
                          <Card.Meta
                            title={article.title}
                            description={
                              <p className="line-clamp-2 text-gray-500">
                                {article.sub_content}
                              </p>
                            }
                          />
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* More News Section */}
          <div className="bg-gradient-to-b from-blue-50 to-white py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12" data-aos="fade-up">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Khám phá thêm tin tức
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Cập nhật những thông tin mới nhất và xu hướng từ Besign
                </p>
              </div>

              {/* Trending News */}
              {trendingNews.length > 0 && (
                <div className="mb-16" data-aos="fade-up" data-aos-delay="100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                        Xu hướng
                      </span>
                    </h3>
                    <Link
                      to="/all-news"
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                      Xem tất cả
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {trendingNews.map((article, index) => (
                      <Link to={`/news/${article.slug}`} key={index}>
                        <div
                          className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col"
                          data-aos="fade-up"
                          data-aos-delay={index * 50}>
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={article.img_cover}
                              alt={article.title}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                            />
                            <div className="absolute top-0 left-0 m-3">
                              <span className="inline-block bg-red-500 text-white text-xs px-2 py-1 rounded-md">
                                Hot
                              </span>
                            </div>
                          </div>
                          <div className="p-4 flex-grow">
                            <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                              {article.title}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-2">
                              {article.sub_content}
                            </p>
                          </div>
                          <div className="px-4 pb-4 mt-auto">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-sm text-gray-500">
                                <CalendarOutlined className="mr-1" />
                                {new Date(article.updatedAt).toLocaleDateString(
                                  "vi-VN",
                                  {
                                    day: "numeric",
                                    month: "short",
                                  }
                                )}
                              </div>
                              <div className="flex items-center text-blue-600 text-sm font-medium">
                                Đọc tiếp
                                <svg
                                  className="w-3 h-3 ml-1"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    fillRule="evenodd"
                                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                    clipRule="evenodd"></path>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Latest News + Newsletter */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Latest News */}
                <div
                  className="lg:col-span-2"
                  data-aos="fade-up"
                  data-aos-delay="150">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                        Tin mới nhất
                      </span>
                    </h3>
                    <Link
                      to="/all-news"
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                      Xem tất cả
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </Link>
                  </div>

                  <div className="space-y-6">
                    {latestNews.slice(0, 4).map((article, index) => (
                      <Link
                        to={`/news/${article.slug}`}
                        key={index}
                        className="block">
                        <div
                          className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row"
                          data-aos="fade-up"
                          data-aos-delay={index * 50}>
                          <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden">
                            <img
                              src={article.img_cover}
                              alt={article.title}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                            />
                          </div>
                          <div className="md:w-2/3 p-5">
                            <div className="flex flex-wrap gap-2 mb-2">
                              {article.hashtags?.slice(0, 2).map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center text-xs font-medium bg-blue-50 text-blue-700 rounded-full px-2.5 py-1">
                                  #{tag}
                                </span>
                              ))}
                            </div>

                            <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                              {article.title}
                            </h3>

                            <p className="text-gray-500 line-clamp-2 mb-4">
                              {article.sub_content}
                            </p>

                            <div className="flex items-center justify-between mt-auto">
                              <div className="flex items-center text-sm text-gray-500">
                                <CalendarOutlined className="mr-1" />
                                {new Date(article.updatedAt).toLocaleDateString(
                                  "vi-VN",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </div>
                              <div className="flex items-center text-blue-600 text-sm font-medium">
                                Đọc tiếp
                                <svg
                                  className="w-3 h-3 ml-1"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    fillRule="evenodd"
                                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                    clipRule="evenodd"></path>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Newsletter and Categories */}
                <div className="lg:col-span-1">
                  {/* Newsletter */}
                  <div
                    className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl overflow-hidden shadow-lg mb-8"
                    data-aos="fade-up"
                    data-aos-delay="200">
                    <div className="p-6 text-white">
                      <h3 className="text-xl font-bold mb-4">
                        Đăng ký nhận tin
                      </h3>
                      <p className="text-blue-100 mb-6">
                        Nhận thông báo về các bài viết mới nhất qua email
                      </p>
                      <form className="space-y-3">
                        <div>
                          <input
                            type="text"
                            placeholder="Họ và tên"
                            className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-blue-200 border border-blue-400/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                          />
                        </div>
                        <div>
                          <input
                            type="email"
                            placeholder="Email của bạn"
                            className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-blue-200 border border-blue-400/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                          />
                        </div>
                        <button className="w-full bg-white text-blue-700 font-medium px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors">
                          Đăng ký ngay
                        </button>
                      </form>
                    </div>
                    <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-6 py-4 text-sm text-blue-200">
                      Chúng tôi tôn trọng quyền riêng tư của bạn và cam kết bảo
                      mật thông tin.
                    </div>
                  </div>

                  {/* Popular Categories */}
                  <div
                    className="bg-white rounded-xl shadow-sm p-6"
                    data-aos="fade-up"
                    data-aos-delay="250">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">
                      Chủ đề phổ biến
                    </h3>
                    <div className="space-y-3">
                      {[
                        "Công nghệ",
                        "Thiết kế",
                        "Tin tức",
                        "Sự kiện",
                        "Giáo dục",
                        "Kinh doanh",
                      ].map((category, index) => (
                        <Link
                          key={index}
                          to={`/news/tag/${category}`}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 transition-colors">
                          <span className="font-medium text-gray-700">
                            {category}
                          </span>
                          <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {Math.floor(Math.random() * 20) + 1}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <Footer />

      {/* Custom styles */}
      <style>{`
        .article-content {
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 1.125rem;
          line-height: 1.8;
          color: #374151;
        }
        
        .article-content h1,
        .article-content h2,
        .article-content h3,
        .article-content h4,
        .article-content h5,
        .article-content h6 {
          margin-top: 1.5em;
          margin-bottom: 0.75em;
          font-weight: 700;
          line-height: 1.3;
          color: #111827;
        }
        
        .article-content h2 {
          font-size: 1.875rem;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 0.5rem;
        }
        
        .article-content h3 {
          font-size: 1.5rem;
        }
        
        .article-content p {
          margin-bottom: 1.5rem;
        }
        
        .article-content a {
          color: #2563eb;
          text-decoration: underline;
        }
        
        .article-content img {
          margin: 2rem auto;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .article-content ul,
        .article-content ol {
          margin-left: 1.5rem;
          margin-bottom: 1.5rem;
        }
        
        .article-content li {
          margin-bottom: 0.5rem;
        }
        
        .article-content blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1rem;
          font-style: italic;
          color: #4b5563;
          margin: 1.5rem 0;
          background-color: #f3f4f6;
          padding: 1rem;
          border-radius: 0.25rem;
        }
      `}</style>
    </div>
  );
}

export default NewsDetail;
