import Footer from "../../component/Footer/Footer";
import Navbar from "../../component/Header/Navbar";
import IntroCard from "../../component/IntroCard/IntroCard";
import Feature from "../../component/Feature/Feature";
import TrustedBy from "../../component/TrustedBy/TrustedBy";
import AOS from "aos";
import "aos/dist/aos.css";
import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "antd";
// import StickyBox from "react-sticky-box";
import { axiosCli } from "../../interceptor/axios";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// Import icons
import {
  FaArrowRight,
  FaCheck,
  FaStar,
  FaCalendarAlt,
  FaUsers,
} from "react-icons/fa";
// Import GSAP and its plugins
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

function Home() {
  // Create a ref for the Lenis instance
  const lenisRef = useRef(null);
  const heroRef = useRef(null);
  const servicesRef = useRef(null);
  const whyUsRef = useRef(null);
  const sellerSectionRef = useRef(null);
  const serviceCardsRef = useRef([]);
  const whyUsImageRef = useRef(null);
  const faqItemsRef = useRef([]);
  const newsGridRef = useRef(null);
  const introSectionRef = useRef(null);
  const newsletterRef = useRef(null);

  // GSAP animations
  useGSAP(() => {
    // Hero section parallax effect
    if (heroRef.current) {
      const heroElement = heroRef.current;

      // Create a parallax effect for the hero section
      gsap.to(heroElement, {
        scrollTrigger: {
          trigger: heroElement,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        y: () => -ScrollTrigger.maxScroll(window) * 0.1,
        ease: "none",
      });

      // Animate hero content in 3D space
      const heroContent = heroElement.querySelector(".hero-content");
      if (heroContent) {
        gsap.from(heroContent, {
          duration: 1.5,
          opacity: 0,
          y: 50,
          rotationX: 15,
          transformPerspective: 1000,
          ease: "power3.out",
        });
      }

      // Enhance the floating particles animation
      const particles = heroElement.querySelectorAll(".absolute.rounded-full");
      particles.forEach((particle) => {
        gsap.to(particle, {
          scrollTrigger: {
            trigger: heroElement,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
          y: `random(-100, 100)`,
          x: `random(-50, 50)`,
          rotation: `random(-45, 45)`,
          scale: `random(0.8, 1.5)`,
          opacity: `random(0.1, 0.3)`,
        });
      });
    }

    // Intro Section animation
    if (introSectionRef.current) {
      const introElement = introSectionRef.current;

      // Create a scroll-triggered background animation
      gsap.fromTo(
        introElement,
        { backgroundPosition: "0% 0%" },
        {
          scrollTrigger: {
            trigger: introElement,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
          backgroundPosition: "100% 100%",
          ease: "none",
        }
      );
    }

    // 3D card animation for service cards
    if (serviceCardsRef.current.length) {
      serviceCardsRef.current.forEach((card, index) => {
        // Initial set
        gsap.set(card, {
          transformStyle: "preserve-3d",
          transformPerspective: 1000,
        });

        // Card reveal animation
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
            toggleActions: "play none none reverse",
          },
          opacity: 0,
          y: 60,
          rotationX: 15,
          rotationY: -5,
          duration: 0.8,
          delay: index * 0.1,
          ease: "power3.out",
        });

        // Card hover effect
        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            rotationY: 5,
            rotationX: -5,
            y: -10,
            scale: 1.02,
            boxShadow: "0 20px 30px rgba(0,0,0,0.1)",
            duration: 0.4,
            ease: "power2.out",
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            rotationY: 0,
            rotationX: 0,
            y: 0,
            scale: 1,
            boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
            duration: 0.4,
            ease: "power2.out",
          });
        });

        // Add subtle continuous animation to the check icons
        const checkIcons = card.querySelectorAll(".text-green-500");
        checkIcons.forEach((icon, i) => {
          gsap.to(icon, {
            y: 3,
            rotation: 5,
            duration: 1.5,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: i * 0.2,
          });
        });
      });
    }

    // Why Us section 3D image animation
    if (whyUsImageRef.current) {
      const imgWrapper = whyUsImageRef.current;

      // Create floating effect
      gsap.to(imgWrapper, {
        y: 20,
        rotation: 1,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });

      // Create scroll-based parallax
      gsap.fromTo(
        imgWrapper,
        { y: 50, opacity: 0.5, scale: 0.9, rotationY: -15 },
        {
          scrollTrigger: {
            trigger: whyUsRef.current,
            start: "top bottom",
            end: "center center",
            scrub: 1,
          },
          y: 0,
          opacity: 1,
          scale: 1,
          rotationY: 0,
          ease: "power2.out",
        }
      );

      // Add animation to the gradient background
      const gradientBg = imgWrapper.querySelector(".absolute");
      if (gradientBg) {
        gsap.to(gradientBg, {
          scrollTrigger: {
            trigger: whyUsRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
          opacity: 0.5,
          scale: 1.1,
          rotation: 10,
          duration: 1,
        });
      }
    }

    // Animate FAQ items with staggered effect
    if (faqItemsRef.current.length) {
      faqItemsRef.current.forEach((faqItem) => {
        const summary = faqItem.querySelector("summary");
        const content = faqItem.querySelector("div");

        // Create click animation for summary
        if (summary) {
          summary.addEventListener("click", () => {
            const isOpen = faqItem.querySelector("details").open;
            if (!isOpen) {
              gsap.from(content, {
                height: 0,
                opacity: 0,
                paddingTop: 0,
                paddingBottom: 0,
                duration: 0.5,
                ease: "power2.out",
              });
            }
          });
        }

        // Create scroll animation
        gsap.fromTo(
          faqItem,
          {
            y: 30,
            opacity: 0,
            transformOrigin: "left center",
            rotationY: -5,
          },
          {
            scrollTrigger: {
              trigger: faqItem,
              start: "top bottom-=50",
              toggleActions: "play none none none",
            },
            y: 0,
            opacity: 1,
            rotationY: 0,
            duration: 0.8,
            ease: "back.out(1.2)",
          }
        );
      });
    }

    // Seller section animation
    if (sellerSectionRef.current) {
      const sellerSection = sellerSectionRef.current;
      const gradient = sellerSection.querySelector(".bg-gradient-to-r");

      if (gradient) {
        // Animate gradient on scroll
        gsap.fromTo(
          gradient,
          { backgroundPosition: "0% 50%" },
          {
            scrollTrigger: {
              trigger: sellerSection,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
            backgroundPosition: "100% 50%",
            ease: "none",
          }
        );

        // Add 3D depth to cards
        const cards = sellerSection.querySelectorAll(
          ".seller-benefits-slider .slick-slide"
        );
        cards.forEach((card) => {
          gsap.set(card, {
            transformStyle: "preserve-3d",
            transformPerspective: 1000,
          });
        });

        // Add wave animation to the spheres
        const spheres = sellerSection.querySelectorAll(
          ".absolute.rounded-full"
        );
        gsap.to(spheres, {
          scrollTrigger: {
            trigger: sellerSection,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
          scale: "random(1, 1.5)",
          x: "random(-30, 30)",
          y: "random(-30, 30)",
          rotation: "random(-15, 15)",
          stagger: 0.1,
          ease: "sine.inOut",
        });
      }
    }

    // News Grid animation with staggered cards
    if (newsGridRef.current) {
      const newsGrid = newsGridRef.current;
      const newsCards = newsGrid.querySelectorAll(".bg-white");

      gsap.from(newsCards, {
        scrollTrigger: {
          trigger: newsGrid,
          start: "top bottom-=100",
          end: "center center",
          toggleActions: "play none none reverse",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        clearProps: "all",
      });
    }

    // Newsletter section animation
    if (newsletterRef.current) {
      const newsletterSection = newsletterRef.current;
      const newsletterCard = newsletterSection.querySelector(".rounded-3xl");

      ScrollTrigger.create({
        trigger: newsletterSection,
        start: "top bottom",
        onEnter: () => {
          gsap.fromTo(
            newsletterCard,
            {
              y: 50,
              opacity: 0.5,
              scale: 0.95,
              boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
            },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
              duration: 1,
              ease: "elastic.out(1, 0.75)",
            }
          );
        },
        once: true,
      });
    }

    // 3D scroll animations for the entire page
    gsap.utils.toArray(".gsap-reveal").forEach((elem, i) => {
      gsap.from(elem, {
        scrollTrigger: {
          trigger: elem,
          start: "top bottom-=100",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 40,
        rotationX: 10,
        transformPerspective: 1000,
        duration: 1,
        delay: i * 0.1,
        ease: "power2.out",
      });
    });

    // Create scroll-based page progress indicator
    gsap.to("body", {
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
        onUpdate: (self) => {
          const progress = self.progress.toFixed(2) * 100;
          document.documentElement.style.setProperty(
            "--scroll-progress",
            `${progress}%`
          );
        },
      },
    });
  }, []);

  useEffect(() => {
    // Initialize AOS with optimized settings
    AOS.init({
      // Using smaller duration for animations to reduce performance impact
      duration: 800,
      // Limiting the number of animations that can run at the same time
      mirror: false,
      once: true, // Only animate elements once
      offset: 100, // Offset (in px) from the original trigger point
      // Disable AOS on mobile devices for better performance
      disable: window.innerWidth < 768,
    });

    getDataNews();

    // Initialize Lenis with optimized settings
    lenisRef.current = new Lenis({
      duration: 1.2, // Reduced from 3 to improve performance
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "both",
      smooth: true,
      smoothTouch: false, // Disable smooth scrolling on touch devices for better performance
      touchMultiplier: 1.5, // Reduced from 2
      wheelMultiplier: 0.8, // Add wheel multiplier to slow down wheel speed
      lerp: 0.1, // Lower values = smoother scrolling but more performance intensive
    });

    // Optimize the RAF loop
    let rafId = null;

    function raf(time) {
      if (lenisRef.current) {
        lenisRef.current.raf(time);
        rafId = requestAnimationFrame(raf);
      }
    }

    rafId = requestAnimationFrame(raf);

    // Clean up function for better memory management
    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  // Lazy loading for news data
  const [dataNews, setDataNews] = useState([]);
  const [isNewsLoaded, setIsNewsLoaded] = useState(false);

  const getDataNews = async () => {
    if (!isNewsLoaded) {
      try {
        const res = await axiosCli().get("news/user-get-news");
        setDataNews(res.data);
        setIsNewsLoaded(true);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    }
  };

  // Optimized slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    lazyLoad: "ondemand", // Add lazy loading for slider images
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="font-sans bg-slate-50 dark:bg-gray-900 text-gray-900 dark:text-white perspective-1000">
      {/* Scroll Progress Indicator */}
      <div className="scroll-progress-bar"></div>

      {/* Navigation */}
      <Navbar />

      {/* Hero Section - Rich gradient with 3D effect */}
      <div
        ref={heroRef}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-900 dark:to-purple-800 relative overflow-hidden">
        <div className="hero-content">
          <Feature />
          <TrustedBy />
        </div>

        {/* 3D floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white opacity-10"
              style={{
                width: `${Math.random() * 30 + 10}px`,
                height: `${Math.random() * 30 + 10}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float-${i % 3} ${
                  Math.random() * 10 + 10
                }s infinite ease-in-out`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Intro Cards - Soft gradient */}
      <div
        ref={introSectionRef}
        className="py-16 bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 gsap-reveal">
        <IntroCard />
      </div>

      {/* Services Section - White with gradient top */}
      <div
        ref={servicesRef}
        className="py-20 px-4 md:px-0 bg-white dark:bg-gray-900 relative">
        <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl w-[90%] mx-auto transform-style-3d">
          <div className="flex flex-col lg:flex-row">
            {/* Left Column - Sticky Content with gradient background */}
            <div className="w-full lg:w-2/5 p-8 lg:p-16 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-purple-900/20 gsap-reveal">
              <div
                className="lg:sticky lg:top-24"
                style={{ height: "fit-content" }}>
                <span className="inline-block px-4 py-1 bg-indigo-600 text-white text-sm font-semibold rounded-full mb-4">
                  Dịch Vụ Của Chúng Tôi
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-indigo-900 dark:text-white leading-tight mb-6">
                  Đồng hành cùng khách hàng trong mọi bước của hành trình hiện
                  thực hóa thiết kế nghệ thuật.
                </h2>
                <div className="mt-8">
                  <Link to="/services">
                    <button className="group flex items-center text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-800 dark:hover:text-indigo-300 transition-all duration-300">
                      Khám phá tất cả dịch vụ
                      <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column - Service Cards */}
            <div className="w-full lg:w-3/5 p-8 lg:p-16 bg-white dark:bg-gray-800 lg:rounded-l-3xl">
              <div className="space-y-8">
                {/* Service Card 1 */}
                <div
                  ref={(el) => (serviceCardsRef.current[0] = el)}
                  className="p-8 rounded-2xl shadow-md bg-white dark:bg-gray-700 hover:shadow-lg transition-all duration-300 border-l-4 border-indigo-500 service-card">
                  <h3 className="text-2xl font-bold text-indigo-800 dark:text-white mb-4">
                    Tư Vấn Chuyên Sâu
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Lắng nghe và hiểu rõ nhu cầu của khách hàng.",
                      "Cung cấp giải pháp thiết kế sáng tạo và phù hợp.",
                      "Hỗ trợ khách hàng xác định và phát triển ý tưởng thiết kế.",
                      "Cung cấp thông tin và kiến thức chuyên môn đáng tin cậy.",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Service Card 2 */}
                <div
                  ref={(el) => (serviceCardsRef.current[1] = el)}
                  className="p-8 rounded-2xl shadow-md bg-white dark:bg-gray-700 hover:shadow-lg transition-all duration-300 border-l-4 border-purple-500 service-card">
                  <h3 className="text-2xl font-bold text-indigo-800 dark:text-white mb-4">
                    Hợp Tác Chặt Chẽ
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Duy trì mối quan hệ làm việc cởi mở và tích cực.",
                      "Linh hoạt trong việc thay đổi và điều chỉnh dự án theo yêu cầu của khách hàng.",
                      "Đảm bảo sự hài lòng và hiểu biết về tiến độ dự án.",
                      "Cung cấp phản hồi nhanh chóng và hiệu quả đối với tất cả ý kiến và yêu cầu của khách hàng.",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Service Card 3 */}
                <div
                  ref={(el) => (serviceCardsRef.current[2] = el)}
                  className="p-8 rounded-2xl shadow-md bg-white dark:bg-gray-700 hover:shadow-lg transition-all duration-300 border-l-4 border-blue-500 service-card">
                  <h3 className="text-2xl font-bold text-indigo-800 dark:text-white mb-4">
                    Chất Lượng Sản Phẩm
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Tuân thủ các tiêu chuẩn chất lượng nghiêm ngặt nhất trong quá trình thiết kế.",
                      "Sử dụng vật liệu và công nghệ hiện đại nhất.",
                      "Kiểm tra chất lượng thường xuyên và chi tiết trước khi giao hàng.",
                      "Cam kết cung cấp các thiết kế chất lượng cao đáp ứng mọi yêu cầu của khách hàng.",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Service Card 4 */}
                <div
                  ref={(el) => (serviceCardsRef.current[3] = el)}
                  className="p-8 rounded-2xl shadow-md bg-white dark:bg-gray-700 hover:shadow-lg transition-all duration-300 border-l-4 border-green-500 service-card">
                  <h3 className="text-2xl font-bold text-indigo-800 dark:text-white mb-4">
                    Hỗ Trợ Toàn Diện
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Cung cấp các dịch vụ hậu mãi toàn diện như bảo trì, nâng cấp và sửa chữa.",
                      "Luôn sẵn sàng hỗ trợ khách hàng trong mọi vấn đề liên quan đến thiết kế.",
                      "Đào tạo và hướng dẫn khách hàng cách sử dụng các thiết kế.",
                      "Tạo môi trường làm việc thân thiện và hỗ trợ để đảm bảo sự hài lòng tối đa của khách hàng.",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Us Section - Subtle gradient */}
      <div
        ref={whyUsRef}
        className="py-20 px-4 md:px-0 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-indigo-100/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 gsap-reveal">
            <span className="inline-block px-4 py-1 bg-indigo-600 text-white text-sm font-semibold rounded-full mb-4">
              Tại Sao Chọn Chúng Tôi?
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-indigo-900 dark:text-white">
              Tại Sao Khách Hàng Luôn Tin Tưởng Chúng Tôi
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/2 p-4">
              <div className="space-y-4">
                {/* Accordion 1 */}
                <details className="group bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                  <summary className="flex items-center justify-between cursor-pointer p-6 focus:outline-none">
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                        <FaStar className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <h3 className="text-xl font-bold text-indigo-900 dark:text-white text-center flex-grow">
                        Chất Lượng Thiết Kế
                      </h3>
                    </div>
                    <svg
                      className="w-5 h-5 text-indigo-500 group-open:rotate-180 transition-transform duration-300 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6 text-gray-700 dark:text-gray-300 text-left">
                    <p>
                      Chúng tôi cam kết cung cấp các thiết kế nghệ thuật chất
                      lượng cao. Chúng tôi không chỉ tập trung vào việc đáp ứng
                      nhu cầu của khách hàng mà còn hướng đến việc tạo ra giá
                      trị và trải nghiệm tốt nhất cho họ. Chúng tôi luôn tiến
                      hành kiểm tra chất lượng nghiêm ngặt để đảm bảo mỗi thiết
                      kế đều đạt tiêu chuẩn cao nhất.
                    </p>
                  </div>
                </details>

                {/* Accordion 2 */}
                <details className="group bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                  <summary className="flex items-center justify-between cursor-pointer p-6 focus:outline-none">
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-purple-600 dark:text-purple-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-indigo-900 dark:text-white text-center flex-grow">
                        Cam Kết Đổi Mới
                      </h3>
                    </div>
                    <svg
                      className="w-5 h-5 text-indigo-500 group-open:rotate-180 transition-transform duration-300 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6 text-gray-700 dark:text-gray-300 text-left">
                    <p>
                      Chúng tôi liên tục nỗ lực tăng cường đổi mới và phát triển
                      trong mọi lĩnh vực hoạt động. Từ việc áp dụng công nghệ
                      mới đến phát triển các thiết kế mới, chúng tôi luôn tìm
                      cách cung cấp các giải pháp tốt nhất và đáp ứng nhu cầu
                      ngày càng phức tạp của khách hàng.
                    </p>
                  </div>
                </details>

                {/* Accordion 3 */}
                <details className="group bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                  <summary className="flex items-center justify-between cursor-pointer p-6 focus:outline-none">
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <FaUsers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-xl font-bold text-indigo-900 dark:text-white text-center flex-grow">
                        Cam Kết Với Khách Hàng
                      </h3>
                    </div>
                    <svg
                      className="w-5 h-5 text-indigo-500 group-open:rotate-180 transition-transform duration-300 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6 text-gray-700 dark:text-gray-300 text-left">
                    <p>
                      Khách hàng luôn là ưu tiên hàng đầu của chúng tôi trong
                      mọi quyết định. Chúng tôi không chỉ cung cấp thiết kế mà
                      còn tạo ra môi trường làm việc thân thiện và hỗ trợ để đảm
                      bảo sự hài lòng tối đa của khách hàng. Chúng tôi luôn lắng
                      nghe phản hồi của khách hàng và sẵn sàng điều chỉnh để đáp
                      ứng mong muốn của họ.
                    </p>
                  </div>
                </details>

                {/* Accordion 4 */}
                <details className="group bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                  <summary className="flex items-center justify-between cursor-pointer p-6 focus:outline-none">
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-green-600 dark:text-green-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-indigo-900 dark:text-white text-center flex-grow">
                        Cam Kết Với Cộng Đồng & Môi Trường
                      </h3>
                    </div>
                    <svg
                      className="w-5 h-5 text-indigo-500 group-open:rotate-180 transition-transform duration-300 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6 text-gray-700 dark:text-gray-300 text-left">
                    <p>
                      Chúng tôi không chỉ là một doanh nghiệp hướng đến lợi
                      nhuận mà còn có trách nhiệm với cộng đồng và môi trường
                      xung quanh. Chúng tôi luôn hành động như một công dân
                      doanh nghiệp có trách nhiệm, tham gia vào các hoạt động xã
                      hội và bảo vệ môi trường, từ việc giảm chất thải đến sử
                      dụng các nguồn tài nguyên tái tạo và bền vững.
                    </p>
                  </div>
                </details>
              </div>
            </div>

            <div className="w-full lg:w-1/2 p-4 flex items-center justify-center">
              <div ref={whyUsImageRef} className="relative transform-style-3d">
                <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
                <img
                  src="./pic1.png"
                  alt="Why choose us"
                  className="relative rounded-xl shadow-2xl max-w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Become a Seller Section - Rich gradient */}
      <div
        ref={sellerSectionRef}
        className="py-20 px-4 md:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden shadow-2xl gsap-reveal">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 dark:from-indigo-800 dark:via-purple-800 dark:to-indigo-900 py-16 px-6 md:px-16 relative">
            {/* 3D spheres background */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white opacity-5"
                  style={{
                    width: `${Math.random() * 300 + 100}px`,
                    height: `${Math.random() * 300 + 100}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    filter: "blur(50px)",
                    transform: `translateZ(${Math.random() * 100}px)`,
                  }}
                />
              ))}
            </div>

            <div className="text-center mb-12 gsap-reveal">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Trở Thành Người Bán
              </h2>
              <p className="text-xl md:text-2xl text-white opacity-90 max-w-2xl mx-auto">
                Tham gia nền tảng của chúng tôi và bắt đầu bán sản phẩm của bạn
                cho khách hàng trên toàn thế giới
              </p>
            </div>

            <div className="max-w-7xl mx-auto">
              <Slider {...settings} className="seller-benefits-slider">
                {/* Benefit Card 1 */}
                <div className="px-4">
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 h-full transform-style-3d">
                    <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                      <img
                        src="./dollar.png"
                        alt="Tiếp cận đối tượng rộng lớn hơn"
                        className="h-32 w-auto object-contain"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        Tiếp Cận Đối Tượng Rộng Lớn Hơn
                      </h3>
                      <p className="text-gray-600">
                        Mở rộng cơ sở khách hàng của bạn bằng cách giới thiệu
                        sản phẩm của bạn đến khách hàng toàn cầu.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Benefit Card 2 */}
                <div className="px-4">
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 h-full">
                    <div className="h-48 bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center">
                      <img
                        src="./pic1.png"
                        alt="Tăng doanh thu của bạn"
                        className="h-32 w-auto object-contain"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        Tăng Doanh Thu Của Bạn
                      </h3>
                      <p className="text-gray-600">
                        Thúc đẩy doanh số và lợi nhuận của bạn bằng cách tiếp
                        cận các thị trường mới và phân khúc khách hàng mới.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Benefit Card 3 */}
                <div className="px-4">
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 h-full">
                    <div className="h-48 bg-gradient-to-r from-pink-400 to-pink-600 flex items-center justify-center">
                      <img
                        src="./pic1.png"
                        alt="Xây dựng thương hiệu của bạn"
                        className="h-32 w-auto object-contain"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        Xây Dựng Thương Hiệu Của Bạn
                      </h3>
                      <p className="text-gray-600">
                        Tăng cường sự hiện diện và uy tín thương hiệu của bạn
                        bằng cách tận dụng uy tín của nền tảng chúng tôi.
                      </p>
                    </div>
                  </div>
                </div>
              </Slider>

              <div className="mt-16 text-center gsap-reveal">
                <Link to="/register-seller">
                  <button className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden seller-button">
                    <span className="relative z-10">Đăng Ký Làm Người Bán</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* News/Blog Section - Clean white */}
      <div className="py-20 px-4 md:px-8 bg-slate-50 dark:bg-gray-900 gsap-reveal">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-indigo-600 text-white text-sm font-semibold rounded-full mb-4">
              Blog
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-indigo-900 dark:text-white">
              Tin Tức Mới Nhất
            </h2>
          </div>

          {dataNews && dataNews.length < 1 ? (
            <div className="text-center bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
              <svg
                className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                Hiện tại, chưa có tin tức nào. Vui lòng để lại thông tin của bạn{" "}
                <Link
                  to="/contact-us"
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                  tại đây
                </Link>{" "}
                để được hỗ trợ.
              </p>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {dataNews.map((news, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:scale-105"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}>
                    <Link to={`/news/${news.slug}`} className="block h-full">
                      <div className="relative overflow-hidden h-48">
                        <img
                          src={news.img_cover[0].url}
                          alt={news.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <FaCalendarAlt className="mr-2" />
                          <span>{new Date().toLocaleDateString()}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                          {news.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                          {news.sub_content}
                        </p>
                        <div className="mt-4 flex items-center text-indigo-600 dark:text-indigo-400 font-medium">
                          Xem thêm
                          <FaArrowRight className="ml-2 h-3 w-3" />
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              <div className="mt-16 text-center">
                <Link to="/all-news">
                  <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg flex items-center mx-auto transition-all duration-300 hover:shadow-lg">
                    Xem Tất Cả Tin Tức
                    <FaArrowRight className="ml-2" />
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FAQ Section - Soft blue */}
      <section className="py-20 px-4 bg-indigo-50/60 dark:bg-gray-800 gsap-reveal">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              Câu Hỏi Thường Gặp
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Tìm câu trả lời cho các câu hỏi phổ biến về thị trường nghệ thuật
              của chúng tôi
            </p>
          </div>

          <div className="space-y-6">
            {/* FAQ Item 1 */}
            <div
              ref={(el) => (faqItemsRef.current[0] = el)}
              className="bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden"
              data-aos="fade-up">
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer p-6 text-lg font-semibold text-gray-900 dark:text-white">
                  Làm thế nào để mua tác phẩm nghệ thuật?
                  <svg
                    className="w-5 h-5 text-indigo-600 dark:text-indigo-400 group-open:rotate-180 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-gray-600 dark:text-gray-300">
                  <p>
                    Mua tác phẩm nghệ thuật rất đơn giản! Duyệt qua thị trường
                    của chúng tôi, chọn thiết kế bạn thích, thêm vào giỏ hàng và
                    tiến hành thanh toán. Sau khi hoàn thành thanh toán, bạn sẽ
                    có thể tải xuống các thiết kế đã mua ngay lập tức từ bảng
                    điều khiển tài khoản của bạn.
                  </p>
                </div>
              </details>
            </div>

            {/* FAQ Item 2 */}
            <div
              ref={(el) => (faqItemsRef.current[1] = el)}
              className="bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden"
              data-aos="fade-up"
              data-aos-delay="100">
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer p-6 text-lg font-semibold text-gray-900 dark:text-white">
                  Có những loại tác phẩm nghệ thuật nào?
                  <svg
                    className="w-5 h-5 text-indigo-600 dark:text-indigo-400 group-open:rotate-180 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-gray-600 dark:text-gray-300">
                  <p>
                    Thị trường của chúng tôi có nhiều loại tác phẩm nghệ thuật
                    kỹ thuật số, bao gồm minh họa, tranh vẽ kỹ thuật số, nhiếp
                    ảnh, mô hình 3D, thiết kế UI/UX, đồ họa vector và nhiều hơn
                    nữa. Chúng tôi liên tục mở rộng danh mục của mình để phù hợp
                    với nhiều phong cách và phương tiện nghệ thuật đa dạng.
                  </p>
                </div>
              </details>
            </div>

            {/* FAQ Item 3 */}
            <div
              ref={(el) => (faqItemsRef.current[2] = el)}
              className="bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden"
              data-aos="fade-up"
              data-aos-delay="200">
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer p-6 text-lg font-semibold text-gray-900 dark:text-white">
                  Làm thế nào để trở thành người bán?
                  <svg
                    className="w-5 h-5 text-indigo-600 dark:text-indigo-400 group-open:rotate-180 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-gray-600 dark:text-gray-300">
                  <p>
                    Để trở thành người bán, hãy tạo một tài khoản và nhấp vào
                    "Trở thành người bán" trong bảng điều khiển của bạn. Hoàn
                    thành hồ sơ của bạn, gửi các mẫu công việc của bạn để xem
                    xét, và sau khi được chấp thuận, bạn có thể bắt đầu tải lên
                    và bán tác phẩm nghệ thuật của mình. Đội ngũ của chúng tôi
                    xem xét các đơn đăng ký để đảm bảo tiêu chuẩn chất lượng.
                  </p>
                </div>
              </details>
            </div>

            {/* FAQ Item 4 */}
            <div
              ref={(el) => (faqItemsRef.current[3] = el)}
              className="bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden"
              data-aos="fade-up"
              data-aos-delay="300">
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer p-6 text-lg font-semibold text-gray-900 dark:text-white">
                  Quyền sử dụng cho tác phẩm nghệ thuật đã mua là gì?
                  <svg
                    className="w-5 h-5 text-indigo-600 dark:text-indigo-400 group-open:rotate-180 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-gray-600 dark:text-gray-300">
                  <p>
                    Mỗi tác phẩm nghệ thuật đi kèm với thông tin giấy phép cụ
                    thể do người bán cung cấp. Hầu hết các thiết kế bao gồm giấy
                    phép tiêu chuẩn để sử dụng cá nhân hoặc thương mại với một
                    số hạn chế. Giấy phép mở rộng có sẵn cho các quyền sử dụng
                    rộng hơn. Luôn kiểm tra chi tiết giấy phép cụ thể trên trang
                    sản phẩm trước khi mua.
                  </p>
                </div>
              </details>
            </div>

            {/* FAQ Item 5 */}
            <div
              ref={(el) => (faqItemsRef.current[4] = el)}
              className="bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden"
              data-aos="fade-up"
              data-aos-delay="400">
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer p-6 text-lg font-semibold text-gray-900 dark:text-white">
                  Thanh toán được xử lý như thế nào?
                  <svg
                    className="w-5 h-5 text-indigo-600 dark:text-indigo-400 group-open:rotate-180 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-gray-600 dark:text-gray-300">
                  <p>
                    Chúng tôi cung cấp xử lý thanh toán an toàn thông qua các
                    thẻ tín dụng chính, PayPal và các phương thức thanh toán
                    khác. Đối với người bán, thu nhập được giữ an toàn và có thể
                    rút về tài khoản ngân hàng hoặc PayPal của bạn sau một thời
                    gian giữ lại ngắn để đảm bảo bảo mật giao dịch.
                  </p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter - White with shadow */}
      <section
        ref={newsletterRef}
        className="py-16 px-4 bg-white dark:bg-gray-900 gsap-reveal">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-10 border border-gray-100 dark:border-gray-700">
            <h2
              className="text-3xl font-bold mb-6 text-gray-900 dark:text-white"
              data-aos="fade-up">
              Luôn Được Truyền Cảm Hứng
            </h2>
            <p
              className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
              data-aos="fade-up"
              data-aos-delay="100">
              Đăng ký bản tin của chúng tôi để nhận được các bộ sưu tập được
              tuyển chọn, các điểm nhấn nghệ sĩ và các chương trình khuyến mãi
              độc quyền
            </p>
            <form
              className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto"
              data-aos="fade-up"
              data-aos-delay="200">
              <input
                type="email"
                placeholder="Nhập địa chỉ email của bạn"
                className="flex-1 px-6 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                required
              />
              <button
                type="submit"
                className="px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors">
                Đăng Ký
              </button>
            </form>
            <p
              className="text-sm text-gray-500 dark:text-gray-400 mt-4"
              data-aos="fade-up"
              data-aos-delay="300">
              Chúng tôi tôn trọng quyền riêng tư của bạn. Hủy đăng ký bất cứ lúc
              nào.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Custom CSS for Sliders and 3D effects */}
      <style>{`
        /* Reduce box-shadow complexity for better performance */
        .shadow-xl {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        /* Optimize transition properties to only animate what's needed */
        .transition-all {
          transition-property: transform, box-shadow, opacity;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Use will-change only where absolutely necessary */
        .hover:scale-105:hover {
          will-change: transform;
        }

        /* Optimize slider dots */
        .seller-benefits-slider .slick-dots li button:before {
          font-size: 12px;
          color: white;
          opacity: 0.5;
        }

        .seller-benefits-slider .slick-dots li.slick-active button:before {
          opacity: 1;
          color: white;
        }

        /* Hide arrows on mobile for better performance */
        @media (max-width: 640px) {
          .seller-benefits-slider .slick-prev,
          .seller-benefits-slider .slick-next {
            display: none !important;
          }
        }

        /* 3D Transforms */
        .perspective-1000 {
          perspective: 1000px;
        }

        .transform-style-3d {
          transform-style: preserve-3d;
        }

        /* Floating animation for hero particles */
        @keyframes float-0 {
          0%, 100% { transform: translateY(0) translateZ(0) rotate(0); }
          50% { transform: translateY(-20px) translateZ(50px) rotate(5deg); }
        }
        
        @keyframes float-1 {
          0%, 100% { transform: translateY(0) translateZ(0) rotate(0); }
          50% { transform: translateY(-15px) translateZ(30px) rotate(-5deg); }
        }
        
        @keyframes float-2 {
          0%, 100% { transform: translateY(0) translateZ(0) rotate(0); }
          50% { transform: translateY(-25px) translateZ(70px) rotate(10deg); }
        }

        /* Button hover effect */
        .seller-button:before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          transition: 0.5s;
        }

        .seller-button:hover:before {
          left: 100%;
        }

        /* Service card 3D effect styles */
        .service-card {
          backface-visibility: hidden;
          transform: translate3d(0, 0, 0);
          will-change: transform, box-shadow;
        }
        
        /* Scroll progress indicator */
        :root {
          --scroll-progress: 0%;
        }
        
        .scroll-progress-bar {
          position: fixed;
          top: 0;
          left: 0;
          height: 4px;
          background: linear-gradient(to right, #6366f1, #a855f7);
          width: var(--scroll-progress);
          z-index: 1000;
        }
      `}</style>
    </div>
  );
}

export default Home;
