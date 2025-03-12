import Footer from "../../component/Footer/Footer";
import Navbar from "../../component/Header/Navbar";
import IntroCard from "../../component/IntroCard/IntroCard";
import Feature from "../../component/Feature/Feature";
import TrustedBy from "../../component/TrustedBy/TrustedBy";
import AOS from "aos";
import "aos/dist/aos.css";
import Lenis from "lenis";
import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import StickyBox from "react-sticky-box";
import { axiosCli } from "../../interceptor/axios";
import { Link } from "react-router-dom";
import { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Home() {
  useEffect(() => {
    AOS.init();
    getDataNews();
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
  // API News
  const [dataNews, setDataNews] = useState([]);
  const getDataNews = async () => {
    await axiosCli()
      .get("news/user-get-news")
      .then((res) => {
        setDataNews(res.data);
      });
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
  };

  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div>
        <Feature />
      </div>
      <div>
        <TrustedBy />
      </div>
      <div>
        <IntroCard />
      </div>
      <div
        className={`flex 
                                    bg-[#f0f6fb] 
                                    min-h-svh 
                                    max-[1200px]:flex-col 
                                    w-[90%] 
                                    m-auto 
                                    rounded-2xl`}>
        <div className="w-1/2 p-4 mt-32 max-[1200px]:mt-8  min-[1200px]:mb-40 max-[1200px]:w-full">
          <StickyBox offsetTop={120} offsetBottom={120}>
            <div className="px-4">
              <h1 className="text-3xl max-[1200px]:text-xl text-red-500 font-Lexend-content mb-4">
                Our Services
              </h1>
              <p className="font-Lexend-title text-[#013A70] leading-tight text-[42px] max-[1200px]:text-3xl">
                Accompanying customers through every step in the journey of
                realizing artistic designs.
              </p>
            </div>
          </StickyBox>
        </div>
        <div className="flex-1 p-10 mt-28 max-[1200px]:mt-4 max-[1200px]:px-4 mb-24 max-[1200px]:mb-0">
          <div
            className="bg-white p-8 rounded-2xl mb-8 m-auto"
            data-aos="fade-up"
            data-aos-duration="1000">
            <h1 className="text-2xl font-Lexend-content mb-4 text-[#013A70]">
              In-depth Consultation
            </h1>
            <ul className="font-Lexend-content text-gray-600">
              <li className="py-2">
                Carefully listening and understanding the needs of customers.
              </li>
              <li className="py-2">
                Providing creative and suitable design solutions.
              </li>
              <li className="py-2">
                Assisting customers in identifying and developing design ideas.
              </li>
              <li className="py-2">
                Offering reliable professional information and knowledge.
              </li>
            </ul>
          </div>
          <div
            className="bg-white p-8 rounded-2xl mb-8 m-auto"
            data-aos="fade-up"
            data-aos-duration="1000">
            <h1 className="text-2xl font-Lexend-content mb-4 text-[#013A70]">
              Close Collaboration
            </h1>
            <ul className="font-Lexend-content text-gray-600">
              <li className="py-2">
                Maintaining an open and positive working relationship.
              </li>
              <li className="py-2">
                Flexibility in changing and adjusting the project according to
                customer requirements.
              </li>
              <li className="py-2">
                Ensuring satisfaction and understanding of project progress.
              </li>
              <li className="py-2">
                Providing quick and effective feedback to all customer opinions
                and requests.
              </li>
            </ul>
          </div>
          <div
            className="bg-white p-8 rounded-2xl mb-8 m-auto"
            data-aos="fade-up"
            data-aos-duration="1000">
            <h1 className="text-2xl font-Lexend-content mb-4 text-[#013A70]">
              Product Quality
            </h1>
            <ul className="font-Lexend-content text-gray-600">
              <li className="py-2">
                Adhering to the strictest quality standards in the design
                process.
              </li>
              <li className="py-2">
                Using the most modern materials and technology.
              </li>
              <li className="py-2">
                Regular and detailed quality checks before delivery.
              </li>
              <li className="py-2">
                Committing to providing top-quality designs that meet all
                customer requirements.
              </li>
            </ul>
          </div>
          <div
            className="bg-white p-8 rounded-2xl mb-8 m-auto"
            data-aos="fade-up"
            data-aos-duration="1000">
            <h1 className="text-2xl font-Lexend-content mb-4 text-[#013A70]">
              Comprehensive Support
            </h1>
            <ul className="font-Lexend-content text-gray-600">
              <li className="py-2">
                Providing comprehensive after-sales services such as
                maintenance, upgrades, and repairs.
              </li>
              <li className="py-2">
                Always ready to support customers in all matters related to
                designs.
              </li>
              <li className="py-2">
                Training and guiding customers on how to use the designs.
              </li>
              <li className="py-2">
                Creating a friendly and supportive working environment to ensure
                maximum customer satisfaction.
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="min-h-svh h-full flex justify-center items-center">
        <div className="">
          <div className="p-8 max-[1200px]:mt-8">
            <h1 className="text-center max-[1200px]:text-center text-3xl font-Lexend-content text-red-500 max-[1200px]:text-xl">
              Why Us ?
            </h1>
            <p className="text-center mt-4 text-4xl font-bold font-Lexend-content text-[#013A70] max-[1200px]:text-3xl">
              Why Customers Always Trust Us
            </p>
          </div>
          <div className="w-full flex max-[1200px]:flex-col my-auto">
            <div className=" min-[1200px]:w-1/2 h-full max-[1200px]:w-full">
              <section className="w-5/6 m-auto">
                <details className="p-4 mb-2 group">
                  <summary className="relative flex cursor-pointer list-none gap-4 pr-8 font-medium text-slate-700 transition-colors duration-300 focus-visible:outline-none group-hover:text-slate-900  [&::-webkit-details-marker]:hidden">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 h-8 shrink-0 stroke-emerald-900 "
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      aria-labelledby="title-ac05 desc-ac05">
                      <title id="title-ac05">Leading icon</title>
                      <desc id="desc-ac05">
                        Icon that describes the summary
                      </desc>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                    <p className="text-[24px] font-Lexend-lead text-[#013A70]">
                      {" "}
                      Design Quality
                    </p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute right-0 w-4 h-4 transition duration-300 top-1 shrink-0 stroke-slate-700 group-open:rotate-45"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      aria-labelledby="title-ac06 desc-ac06">
                      <title id="title-ac06">Open icon</title>
                      <desc id="desc-ac06">
                        icon that represents the state of the summary
                      </desc>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </summary>
                  <p className="mt-4 text-slate-500 font-Lexend-content">
                    We are committed to providing top-quality artistic designs.
                    We not only focus on meeting customer needs but also aim to
                    create the best value and experience for them. We always
                    conduct strict quality checks to ensure that each design
                    meets the highest standards.
                  </p>
                </details>
                <details className="p-4 mb-2 group">
                  <summary className="relative flex cursor-pointer list-none gap-4 pr-8 font-medium text-slate-700 transition-colors duration-300 focus-visible:outline-none group-hover:text-slate-900  [&::-webkit-details-marker]:hidden">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 h-8 shrink-0 stroke-emerald-900 "
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      aria-labelledby="title-ac11 desc-ac11">
                      <title id="title-ac11">Leading icon</title>
                      <desc id="desc-ac11">
                        Icon that describes the summary
                      </desc>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                      />
                    </svg>
                    <p className="why-us-title font-Lexend-lead text-[24px] text-[#013A70]">
                      Commitment to Innovation and Development
                    </p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute right-0 w-4 h-4 transition duration-300 top-1 shrink-0 stroke-slate-700 group-open:rotate-45"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      aria-labelledby="title-ac08 desc-ac08">
                      <title id="title-ac08">Open icon</title>
                      <desc id="desc-ac08">
                        icon that represents the state of the summary
                      </desc>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </summary>
                  <p className="mt-4 text-slate-500 font-Lexend-content">
                    We continuously strive to enhance innovation and development
                    in all areas of our operations. From adopting new
                    technologies to developing new designs, we always seek ways
                    to provide the best solutions and meet the increasingly
                    complex needs of our customers.
                  </p>
                </details>
                <details className="p-4 mb-2 group">
                  <summary className="relative flex cursor-pointer list-none gap-4 pr-8 font-medium text-slate-700 transition-colors duration-300 focus-visible:outline-none group-hover:text-slate-900  [&::-webkit-details-marker]:hidden">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 h-8 shrink-0 stroke-emerald-900 "
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      aria-labelledby="title-ac07 desc-ac07">
                      <title id="title-ac07">Leading icon</title>
                      <desc id="desc-ac07">
                        Icon that describes the summary
                      </desc>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                      />
                    </svg>
                    <p className="why-us-title font-Lexend-lead text-[24px] text-[#013A70]">
                      {" "}
                      Commitment to Customers
                    </p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute right-0 w-4 h-4 transition duration-300 top-1 shrink-0 stroke-slate-700 group-open:rotate-45"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      aria-labelledby="title-ac10 desc-ac10">
                      <title id="title-ac10">Open icon</title>
                      <desc id="desc-ac10">
                        icon that represents the state of the summary
                      </desc>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </summary>
                  <p className="mt-4 text-slate-500 font-Lexend-content">
                    Customers are always our top priority in every decision we
                    make. We not only provide designs but also create a friendly
                    and supportive working environment to ensure maximum
                    customer satisfaction. We always listen to customer feedback
                    and are ready to adjust to meet their desires.
                  </p>
                </details>
                <details className="p-4 mb-2 group">
                  <summary className="relative flex cursor-pointer list-none gap-4 pr-8 font-medium text-slate-700 transition-colors duration-300 focus-visible:outline-none group-hover:text-slate-900  [&::-webkit-details-marker]:hidden">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 h-8 shrink-0 stroke-emerald-900 "
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      aria-labelledby="title-ac11 desc-ac11">
                      <title id="title-ac11">Leading icon</title>
                      <desc id="desc-ac11">
                        Icon that describes the summary
                      </desc>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                      />
                    </svg>
                    <p className="why-us-title font-Lexend-lead text-[24px] text-[#013A70]">
                      Commitment to the Community and Environment
                    </p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute right-0 w-4 h-4 transition duration-300 top-1 shrink-0 stroke-slate-700 group-open:rotate-45"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      aria-labelledby="title-ac12 desc-ac12">
                      <title id="title-ac12">Open icon</title>
                      <desc id="desc-ac12">
                        icon that represents the state of the summary
                      </desc>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </summary>
                  <p className="mt-4 text-slate-500 font-Lexend-content">
                    We are not just a business aiming to make a profit but also
                    have a responsibility to the community and the surrounding
                    environment. We always act as a responsible corporate
                    citizen, participating in social activities and protecting
                    the environment, from reducing waste to using renewable and
                    sustainable resources.
                  </p>
                </details>
              </section>
            </div>
            <div className="overflow-hidden text-center justify-center min-[1200px]:w-1/2 max-[1200px]:mb-16 h-full flex max-[1200px]:px-4">
              <div
                className="min-[1200px]:w-3/4"
                data-aos="fade-up"
                data-aos-duration="2000">
                <img src="./pic1.png" alt="" className="mt-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* New Seller Benefits Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 py-16 flex flex-col items-center m-auto rounded-2xl text-white">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-Lexend-content font-bold">
            Become a Seller
          </h1>
          <p className="mt-4 text-3xl font-Lexend-content">
            Benefits of Selling Your Products
          </p>
        </div>
        <div className="container mx-auto">
          <Slider {...settings}>
            <div className="px-4">
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-gray-800">
                <img
                  src="./dollar.png"
                  alt="Reach a Wider Audience"
                  className="w-full h-48 object-cover rounded-t-2xl mb-4"
                />
                <h2 className="text-2xl font-Lexend-content text-[#013A70] mb-4">
                  Reach a Wider Audience
                </h2>
                <p className="font-Lexend-content">
                  Expand your customer base by showcasing your products to a
                  global audience.
                </p>
              </div>
            </div>
            <div className="px-4">
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-gray-800">
                <img
                  src="./pic1.png"
                  alt="Increase Your Revenue"
                  className="w-full h-48 object-cover rounded-t-2xl mb-4"
                />
                <h2 className="text-2xl font-Lexend-content text-[#013A70] mb-4">
                  Increase Your Revenue
                </h2>
                <p className="font-Lexend-content">
                  Boost your sales and profits by tapping into new markets and
                  customer segments.
                </p>
              </div>
            </div>
            <div className="px-4">
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-gray-800">
                <img
                  src="./pic1.png"
                  alt="Build Your Brand"
                  className="w-full h-48 object-cover rounded-t-2xl mb-4"
                />
                <h2 className="text-2xl font-Lexend-content text-[#013A70] mb-4">
                  Build Your Brand
                </h2>
                <p className="font-Lexend-content">
                  Strengthen your brand presence and reputation by leveraging
                  our platform's credibility.
                </p>
              </div>
            </div>
            {/* Add more cards as needed */}
          </Slider>
          <div className="mt-12 text-center">
            <Link to="/register-seller">
              <Button
                type="primary"
                size="large"
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full transition-transform transform hover:scale-105">
                Register Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
      {/* news */}
      <div className="bg-[#f0f6fb] max-h-svh max-[1200px]:flex-col flex justify-center items-center m-auto rounded-2xl">
        <div className="">
          <div className="max-[1200px]:mt-8 p-8 relative">
            <h1 className="text-center font-Lexend-content text-red-500 text-3xl">
              Blogs
            </h1>
            <p className="mt-4 text-center font-Lexend-content font-bold text-4xl text-[#013A70]">
              News
            </p>
          </div>
          <div className="container mx-auto">
            {dataNews && dataNews.length < 1 ? (
              <div className="text-center">
                {/* Card */}
                <p className="text-Lexend-content text-gray-400 mb-10">
                  Currently, there is no news. Please leave your information{" "}
                  <Link to="/contact-us" className="font-bold text-gray-600">
                    here
                  </Link>{" "}
                  for support.
                </p>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-2 gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 max-[1200px]:px-4">
                  {dataNews.map((dataNews, index) => (
                    <div
                      key={index}
                      className="col-span-4 rounded-xl md:col-span-1 lg:col-span-2 xl:col-span-1 bg-white shadow-md hover:shadow-lg">
                      <div className="relative">
                        <div className="transition duration-300 transform card-container md:h-full flex flex-col justify-center">
                          <Link
                            to={`/news/${dataNews.slug}`}
                            className="w-full">
                            <div className="flex justify-center items-center relative">
                              <div className="relative overflow-hidden w-[600px] h-[250px] max-w-[800px] max-h-[300px]">
                                <img
                                  src={dataNews.img_cover[0].url}
                                  alt={dataNews.img_cover[0].url}
                                  className="object-cover absolute hover:scale-125 duration-300 ease-out w-full h-full"
                                />
                              </div>
                            </div>
                            <div className="p-4">
                              <strong className="font-Lexend-title text-[16px] title-color">
                                {dataNews.title}
                              </strong>
                              <br />
                              <p className="font-Lexend-content text-[14px] line-clamp-4">
                                <span className="overflow-hidden overflow-ellipsis">
                                  {dataNews.sub_content}
                                </span>
                              </p>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-10 mb-10 w-fit m-auto">
                  <Link to={"/all-news"}>
                    <Button
                      type="primary"
                      size="large"
                      className="flex items-center bg-[#007bff] hover:scale-105">
                      View All
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        fill="rgba(255,255,255,1)"
                        className="ml-2 flex items-center">
                        <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                      </svg>
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}
export default Home;
