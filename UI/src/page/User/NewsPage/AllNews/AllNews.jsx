import { Breadcrumb, Pagination } from "antd";
import Footer from "../../../../component/Footer/Footer";
import Navbar from "../../../../component/Header/Navbar";
import { HomeOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getDataByParams } from "../../../../utils/service";
import { Link } from "react-router-dom";
import Lenis from "lenis";
import AOS from "aos";
import "aos/dist/aos.css";
function AllNews() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    getDataNews();
    AOS.init();
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
  }, [currentPage]);
  // const nav = useNavigate();
  const [allDataNews, setAllDataNews] = useState([]);
  const [uniqueHashtags, setUniqueHashtags] = useState([]);
  const getDataNews = async () => {
    await getDataByParams(`news/user-all-news?page=${currentPage}`).then(
      (res) => {
        setAllDataNews(res.data.news);
        // console.log(res.data.news);
        setTotalPages(res.data.totalItems);
        setUniqueHashtags(res.data.uniqueHashtags);
      }
    );
  };
  const handleClickPage = (page) => {
    setCurrentPage(page);
  };
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div className="container mx-auto mt-8 mb-10 max-[1200px]:px-4">
        <div>
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
        <div className="flex mt-10 mb-10">
          <Link to={`/all-news`}>
            <span className="px-3 py-2 bg-blue-500 rounded-3xl text-white font-Lexend-content mr-2">
              Tất Cả
            </span>
          </Link>
          {uniqueHashtags?.map((d, index) => (
            <Link key={index} to={`/news/tag/${d._id}`}>
              <span className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-3xl title-color font-Lexend-content mr-2">
                {d._id}
              </span>
            </Link>
          ))}
        </div>
        <div></div>
        <div className="mt-4 min-h-svh">
          {allDataNews.length === 0 ? (
            <p>No blogs found for this tag.</p>
          ) : (
            <div className="grid grid-cols-2 gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-3 max-[1200px]:px-4">
              {allDataNews &&
                allDataNews?.map((data, index) => (
                  <div
                    key={index}
                    className="col-span-4 md:col-span-1 lg:col-span-2 xl:col-span-1 bg-white shadow-md hover:shadow-lg"
                    data-aos="fade-up"
                    data-aos-duration="1500">
                    <div className="relative">
                      <div className="transition duration-300 transform card-container md:h-full flex flex-col justify-center">
                        <div className="flex justify-center items-center relative">
                          <Link to={`/news/${data.slug}`} className="w-full">
                            <div className="flex justify-center items-center relative">
                              <div className="relative overflow-hidden w-[680px] h-[250px] max-w-[680px] max-h-[300px]">
                                <img
                                  src={data.img_cover}
                                  alt={data.img_cover}
                                  className="object-cover absolute hover:scale-125 duration-300 ease-out w-full h-full"
                                />
                              </div>
                            </div>
                            {/* <div className="absolute inset-0 flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-500 flex-col">
                                                                {data?.hashtags?.map((d, index) => (
                                                                    <div key={index} className="text-white text-sm px-2 py-1 bg-red-500 rounded-xl font-Lexend-content flex-wrap mb-2">
                                                                        {d}
                                                                    </div>
                                                                ))}
                                                            </div> */}
                          </Link>
                        </div>
                        <div className="p-4">
                          <Link to={`/news/${data.slug}`}>
                            <strong className="font-Lexend-title text-[16px] title-color">
                              {data.title}
                            </strong>
                            <div className="flex mt-1">
                              {data?.hashtags?.map((d, index) => (
                                <span
                                  key={index}
                                  className="text-white text-sm px-2 py-1 bg-red-500 rounded-xl font-Lexend-content mr-2 flex">
                                  {d}
                                </span>
                              ))}
                            </div>
                          </Link>
                          <br />
                          <p className="font-Lexend-content text-[14px] max-[1200px]:truncate line-clamp-6">
                            {data.sub_content}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
          <div className="mt-10 flex justify-center items-center">
            <Pagination
              defaultCurrent={currentPage}
              total={totalPages}
              onChange={handleClickPage}
            />
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default AllNews;
