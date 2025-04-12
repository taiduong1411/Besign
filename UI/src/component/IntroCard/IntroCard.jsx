import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getItems } from "../../utils/service";
import { Tag, Tooltip, Skeleton, Empty, Button } from "antd";
import {
  EyeOutlined,
  ShoppingCartOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

// Thêm dữ liệu mẫu để hiển thị khi không có dữ liệu từ API
const FALLBACK_PRODUCTS = [
  {
    _id: "fallback-1",
    product_name: "Tranh Phong Cảnh Đẹp",
    product_title: "Bức tranh phong cảnh thiên nhiên tuyệt đẹp",
    product_description: "Đây là mô tả chi tiết về bức tranh phong cảnh",
    product_price: 1500000,
    product_image: [
      {
        url: "https://res.cloudinary.com/daqtqvneu/image/upload/v1717214881/placeholder-image_qpqgyd.jpg",
      },
    ],
    product_category: ["Tranh phong cảnh"],
    isPublic: true,
  },
  {
    _id: "fallback-2",
    product_name: "Tượng Nghệ Thuật",
    product_title: "Tượng nghệ thuật hiện đại phong cách minimal",
    product_description: "Đây là mô tả chi tiết về tượng nghệ thuật",
    product_price: 2500000,
    product_image: [
      {
        url: "https://res.cloudinary.com/daqtqvneu/image/upload/v1717214881/placeholder-image_qpqgyd.jpg",
      },
    ],
    product_category: ["Điêu khắc"],
    isPublic: true,
  },
  {
    _id: "fallback-3",
    product_name: "Tranh Trừu Tượng",
    product_title: "Tranh nghệ thuật trừu tượng với các mảng màu sắc",
    product_description: "Đây là mô tả chi tiết về tranh trừu tượng",
    product_price: 1800000,
    product_image: [
      {
        url: "https://res.cloudinary.com/daqtqvneu/image/upload/v1717214881/placeholder-image_qpqgyd.jpg",
      },
    ],
    product_category: ["Tranh trừu tượng"],
    isPublic: true,
  },
  {
    _id: "fallback-4",
    product_name: "Tranh Chân Dung",
    product_title: "Tranh chân dung nghệ thuật phong cách cổ điển",
    product_description: "Đây là mô tả chi tiết về tranh chân dung",
    product_price: 2000000,
    product_image: [
      {
        url: "https://res.cloudinary.com/daqtqvneu/image/upload/v1717214881/placeholder-image_qpqgyd.jpg",
      },
    ],
    product_category: ["Tranh chân dung"],
    isPublic: true,
  },
];

function IntroCard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    AOS.init();
    fetchProducts();
  }, []);

  // Thêm một hàm để sử dụng dữ liệu mẫu khi cần
  const setFallbackData = () => {
    console.log(
      "Sử dụng dữ liệu mẫu do không thể kết nối hoặc không có dữ liệu"
    );
    setProducts(FALLBACK_PRODUCTS);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);

      // Gọi API để lấy tất cả sản phẩm
      const response = await getItems("seller/all-products");
      console.log("API Response:", response);

      if (response.status === 200) {
        if (!response.data || !Array.isArray(response.data)) {
          console.error("Dữ liệu trả về không phải là mảng:", response.data);
          setFallbackData();
          setLoading(false);
          return;
        }

        // Log số lượng sản phẩm nhận được
        console.log("Số lượng sản phẩm từ API:", response.data.length);

        // Filter only public products
        const publicProducts = response.data.filter((product) => {
          if (!product) {
            console.warn(
              "Sản phẩm không hợp lệ (undefined/null) trong danh sách"
            );
            return false;
          }

          const isPublicProduct = product && product.isPublic === true;
          if (!isPublicProduct) {
            console.log("Sản phẩm không public:", product._id);
          }
          return isPublicProduct;
        });

        console.log("Số lượng sản phẩm public:", publicProducts.length);
        // Create a map to store unique products by ID
        const uniqueProductsMap = new Map();
        publicProducts.forEach((product) => {
          if (product && product._id) {
            uniqueProductsMap.set(product._id, product);
          } else {
            console.warn("Sản phẩm thiếu ID:", product);
          }
        });

        // Convert map values back to array
        const uniqueProducts = Array.from(uniqueProductsMap.values());
        console.log("Số lượng sản phẩm unique:", uniqueProducts.length);

        // Kiểm tra dữ liệu sản phẩm
        if (uniqueProducts.length > 0) {
          console.log("Sản phẩm đầu tiên:", uniqueProducts[0]);
          setProducts(uniqueProducts);
        } else {
          console.log("Không có sản phẩm hiển thị, sử dụng dữ liệu mẫu");
          setFallbackData();
        }
      } else {
        console.error("Lỗi từ API:", response);
        setFallbackData();
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setFallbackData();
      setLoading(false);
    }
  };

  // Settings for slider
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
        },
      },
    ],
  };

  return (
    <div className="our-designs-section py-14 px-4 md:px-8">
      <div className="container mx-auto">
        <div
          className="product-slider-container"
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="300">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-xl overflow-hidden shadow-md p-4">
                  <Skeleton.Image
                    active
                    style={{ width: "100%", height: 160 }}
                  />
                  <Skeleton active paragraph={{ rows: 2 }} />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <Slider {...settings}>
              {products.map((product) => (
                <div key={product._id} className="px-2">
                  <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                    <div className="relative overflow-hidden group">
                      <img
                        src={
                          product.product_image[0]?.url ||
                          "https://res.cloudinary.com/daqtqvneu/image/upload/v1717214881/placeholder-image_qpqgyd.jpg"
                        }
                        alt={product.product_name}
                        className="w-full h-[160px] object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Always visible gradient overlay for better visibility on dark backgrounds */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40"></div>

                      {/* Category tag overlaid on image */}
                      <div className="absolute top-2 left-2 z-10">
                        {product.product_category &&
                          product.product_category[0] && (
                            <Tag
                              color="blue"
                              className="text-xs font-medium px-2 py-0.5 shadow-sm">
                              {product.product_category[0]}
                            </Tag>
                          )}
                      </div>

                      {/* Interactive hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
                        <div className="flex gap-2 p-3 w-full justify-center mb-2">
                          <Tooltip title="Xem chi tiết">
                            <Link to={`/product/${product._id}`}>
                              <button className="bg-white text-blue-600 p-2 rounded-full hover:bg-blue-500 hover:text-white transition-colors shadow-md">
                                <EyeOutlined />
                              </button>
                            </Link>
                          </Tooltip>
                          <Tooltip title="Thêm vào giỏ hàng">
                            <button className="bg-white text-blue-600 p-2 rounded-full hover:bg-blue-500 hover:text-white transition-colors shadow-md">
                              <ShoppingCartOutlined />
                            </button>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-2 min-h-[2.5rem]">
                        {product.product_name}
                      </h3>
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2 min-h-[2rem]">
                        {product.product_title}
                      </p>
                      <div className="mt-auto pt-2 border-t border-gray-100">
                        <div className="text-base font-bold text-blue-600">
                          {product.product_price.toLocaleString("vi-VN")} đ
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <Empty
              description={
                <div>
                  <p className="text-gray-500">
                    Không có sản phẩm nào hiển thị.
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Tất cả sản phẩm public sẽ xuất hiện ở đây
                  </p>
                  <Button
                    icon={<ReloadOutlined />}
                    size="small"
                    onClick={fetchProducts}
                    className="mt-4">
                    Tải lại
                  </Button>
                </div>
              }
            />
          )}
        </div>

        <div
          className="text-center mt-10"
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="600">
          <Link to="/products">
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-xl transition-colors shadow-md hover:shadow-lg">
              Xem tất cả sản phẩm
            </button>
          </Link>
        </div>
      </div>

      <style>{`
        /* Improve contrast for dark backgrounds */
        .product-slider-container {
          margin: 0 auto;
          position: relative;
          padding-bottom: 50px; /* Add space for dots */
          width: 100%;
        }
        
        /* Enhance card appearance on dark backgrounds */
        .bg-white {
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .bg-white:hover {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
        }
        
        .slick-dots {
          bottom: -40px;
        }
        
        .slick-dots li button:before {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.8);
          opacity: 0.5;
          text-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
        }
        
        .slick-dots li.slick-active button:before {
          color: #3b82f6;
          opacity: 1;
          font-size: 14px;
          text-shadow: 0 0 4px rgba(59, 130, 246, 0.5);
        }
        
        .slick-prev,
        .slick-next {
          width: 44px;
          height: 44px;
          z-index: 10;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 50%;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
        }
        
        .slick-prev:hover,
        .slick-next:hover {
          background: #3b82f6;
          transform: scale(1.1);
        }
        
        .slick-prev:hover:before,
        .slick-next:hover:before {
          color: white;
        }
        
        .slick-prev:before,
        .slick-next:before {
          font-size: 22px;
          color: #3b82f6;
          transition: color 0.3s ease;
          line-height: 1;
          opacity: 1;
        }
        
        .slick-prev {
          left: -22px;
        }
        
        .slick-next {
          right: -22px;
        }
        
        @media (max-width: 768px) {
          .slick-prev {
            left: -10px;
          }
          .slick-next {
            right: -10px;
          }
        }
        
        /* Fix card height issues */
        .slick-track {
          display: flex !important;
        }
        
        .slick-slide {
          height: inherit !important;
          display: flex !important;
          justify-content: center;
          align-items: stretch;
          padding: 0 4px;
        }
        
        .slick-slide > div {
          height: 100%;
          width: 100%;
        }
        
        /* Minimize text to fit smaller cards */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </div>
  );
}

export default IntroCard;
