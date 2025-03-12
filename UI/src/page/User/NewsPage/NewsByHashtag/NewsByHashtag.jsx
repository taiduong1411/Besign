import { useParams } from "react-router-dom";
import Lenis from "lenis";
import Navbar from "../../../../component/Header/Navbar";
import Footer from "../../../../component/Footer/Footer";
import { useEffect, useState } from "react";
import { getDataByParams } from "../../../../utils/service";
import { Link } from "react-router-dom";
import { Breadcrumb, Pagination } from "antd";
import { HomeOutlined } from "@ant-design/icons";
function NewsByHashtag() {
  const { query } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dataNews, setDataNews] = useState([]);
  useEffect(() => {
    getNewsByTag();
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
  const getNewsByTag = async () => {
    await getDataByParams(
      `news/user-get-news-by-tag/${query}?page=${currentPage}`
    ).then((res) => {
      setDataNews(res.data.news);
      setTotalPages(res.data.totalItems);
      console.log(res.data.totalItems);
    });
  };
  const handleClickPage = (page) => {
    setCurrentPage(page);
  };
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div className="min-h-svh">
        <div className="container mx-auto mt-8 mb-10 max-[1200px]:px-4">
          <Breadcrumb
            items={[
              {
                href: "/",
                title: <HomeOutlined />,
              },
              {
                title: "tag",
              },
              {
                title: `${query}`,
              },
            ]}
          />
          {dataNews.length === 0 ? (
            <p>No blogs found for this tag.</p>
          ) : (
            <div className="flex mt-10 max-[1200px]:flex-col">
              <div className="w-[80%] max-[1200px]:w-full">
                {dataNews.map((news) => (
                  <div
                    key={news._id}
                    className="transition-transform flex mb-4">
                    <div className="flex w-1/3 max-[1200px]:pr-2 justify-center items-center mr-4">
                      <Link to={`/news/${news.slug}`} className="w-full">
                        <div className="flex justify-left items-center relative">
                          <div className="relative w-[300px] h-[200px] max-w-[380px] max-h-[150px] max-[1200px]:max-h-[100px] max-[1200px]:max-w-[400px] overflow-hidden flex justify-center items-center">
                            <img
                              src={news.img_cover}
                              alt=""
                              className="object-cover absolute hover:scale-125 duration-300 ease-out w-full h-full"
                            />
                          </div>
                        </div>
                        {/* <div className="absolute inset-0 flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-500">
                                                    <span className="text-white text-sm rounded-xl px-2 py-1 bg-red-500">{query}</span>
                                                </div> */}
                      </Link>
                    </div>
                    <div className="w-2/3">
                      <Link to={`/news/${news.slug}`}>
                        <h2 className="text-lg max-[1200px]:text-[14px] font-semibold max-[1200px]:mb-0 mb-2 overflow-hidden font-Lexend-title hover:text-gray-600">
                          {news.title}
                        </h2>
                      </Link>
                      <span className="text-red-500 max-[1200px]:text-[10px] font-Lexend-content flex items-center text-[12px] mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-2"
                          viewBox="0 0 24 24"
                          width="18"
                          height="18"
                          fill="currentColor">
                          <path d="M9 1V3H15V1H17V3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9ZM20 11H4V19H20V11ZM11 13V17H6V13H11ZM7 5H4V9H20V5H17V7H15V5H9V7H7V5Z"></path>
                        </svg>
                        {news.updatedAt}
                      </span>
                      <p className="text-sm max-[1200px]:text-[12px] text-gray-600 overflow-hidden overflow-ellipsis font-Lexend-content line-clamp-2">
                        {news.sub_content}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="mt-4 flex justify-center items-center">
                  <Pagination
                    defaultCurrent={currentPage}
                    total={totalPages}
                    onChange={handleClickPage}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default NewsByHashtag;
