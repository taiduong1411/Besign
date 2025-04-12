import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  Rate,
  InputNumber,
  Button,
  Tabs,
  Skeleton,
  Tag,
  Divider,
  message,
  notification,
  Tooltip,
  Watermark,
} from "antd";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  ShareAltOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getItems } from "../../../utils/service";
import Footer from "../../../component/Footer/Footer";
import Navbar from "../../../component/Header/Navbar";
import ReviewList from "../../../component/ReviewList/ReviewList";
import ReviewForm from "../../../component/ReviewForm/ReviewForm";
import ChatPopup from "../../../component/Chat/ChatPopup";

const { TabPane } = Tabs;

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [refreshReviews, setRefreshReviews] = useState(0);

  // Image gallery navigation
  const [activeIndex, setActiveIndex] = useState(0);
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);

  // Add new state for ratings
  const [ratingData, setRatingData] = useState({ average: 0, total: 0 });

  // Add state for login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Change chatModalVisible to showChat
  const [showChat, setShowChat] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);

  useEffect(() => {
    fetchProductDetail();
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Cải thiện cách kiểm tra đăng nhập
    checkLoginStatus();
  }, [id]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      const response = await getItems(`seller/product/${id}`);

      if (response.status === 200) {
        setProduct(response.data);

        // Set rating data from the product's reviews field
        if (response.data.reviews) {
          setRatingData({
            average: response.data.reviews.averageRating,
            total: response.data.reviews.totalReviews,
          });
        }

        if (
          response.data.product_image &&
          response.data.product_image.length > 0
        ) {
          // No need to set mainImage as we're using the slider
        }

        // Fetch related products based on category
        if (
          response.data.product_category &&
          response.data.product_category.length > 0
        ) {
          fetchRelatedProducts(
            response.data.product_category[0],
            response.data._id
          );
        }
      } else {
        notification.error({
          message: "Lỗi",
          description:
            "Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.",
        });
        navigate("/products");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching product details:", error);
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra khi tải sản phẩm. Vui lòng thử lại sau.",
      });
      setLoading(false);
      navigate("/products");
    }
  };

  const fetchRelatedProducts = async (category, currentProductId) => {
    try {
      const response = await getItems("seller/all-products");
      if (response.status === 200) {
        // Filter products by category and exclude current product
        const filteredProducts = response.data
          .filter(
            (product) =>
              product.isPublic === true &&
              product._id !== currentProductId &&
              product.product_category.includes(category)
          )
          .slice(0, 4); // Limit to 4 related products

        setRelatedProducts(filteredProducts);
      }
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };

  const handleAddToCart = () => {
    // Implementation for adding to cart would go here
    message.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
  };

  const handleBuyNow = () => {
    // Implementation for direct checkout would go here
    message.info("Chức năng thanh toán đang được phát triển");
  };

  const handleQuantityChange = (value) => {
    setQuantity(value);
  };

  // Settings for the main image slider
  const mainSliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    beforeChange: (current, next) => setActiveIndex(next),
  };

  // Settings for the thumbnail slider
  const thumbnailSliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    focusOnSelect: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  };

  // Settings for related products slider
  const relatedProductsSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // Thêm hàm kiểm tra đăng nhập riêng
  const checkLoginStatus = () => {
    const token = localStorage.getItem("accessToken");
    console.log(
      "Checking login status, accessToken:",
      token ? "Found" : "Not found"
    );
    setIsLoggedIn(!!token);
  };

  const handleOpenChat = () => {
    if (!isLoggedIn) {
      notification.info({
        message: "Thông báo",
        description: (
          <div>
            <p>Vui lòng đăng nhập để chat với người bán</p>
            <Link
              to="/login"
              className="text-blue-500 hover:text-blue-600 mt-2 inline-block">
              Đăng nhập ngay
            </Link>
          </div>
        ),
      });
      return;
    }

    if (!product || !product.seller_email) {
      notification.error({
        message: "Lỗi",
        description: "Không thể tìm thấy thông tin người bán",
      });
      return;
    }

    // Tạo thông tin seller từ email
    const sellerEmail = product.seller_email;

    setSelectedSeller(sellerEmail);
    setShowChat(true); // Change this from setChatModalVisible
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Skeleton.Image
                    style={{ width: "100%", height: 400 }}
                    active
                  />
                  <div className="mt-4 flex space-x-2">
                    {[1, 2, 3, 4].map((item) => (
                      <Skeleton.Image
                        key={item}
                        style={{ width: 80, height: 80 }}
                        active
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <Skeleton active paragraph={{ rows: 2 }} />
                  <Skeleton active paragraph={{ rows: 1 }} />
                  <Skeleton active paragraph={{ rows: 3 }} />
                  <div className="mt-4">
                    <Skeleton.Button
                      active
                      size="large"
                      shape="default"
                      style={{ width: 150 }}
                    />
                    <Skeleton.Button
                      active
                      size="large"
                      shape="default"
                      style={{ width: 150, marginLeft: 12 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              Không tìm thấy sản phẩm
            </h2>
            <p className="text-gray-500 mb-6">
              Sản phẩm này không tồn tại hoặc đã bị xóa
            </p>
            <Link
              to="/products"
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Quay lại danh sách sản phẩm
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <Breadcrumb.Item href="/">
            <HomeOutlined /> Trang chủ
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/products">Sản phẩm</Breadcrumb.Item>
          {product.product_category && product.product_category[0] && (
            <Breadcrumb.Item>{product.product_category[0]}</Breadcrumb.Item>
          )}
          <Breadcrumb.Item>{product.product_name}</Breadcrumb.Item>
        </Breadcrumb>

        {/* Product Details */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div className="product-images-container">
              {/* Main Image */}
              <div className="main-image-container mb-4 overflow-hidden rounded-lg border border-gray-200">
                {product.product_image && product.product_image.length > 0 ? (
                  <Watermark content="Besign.">
                    <Slider
                      {...mainSliderSettings}
                      asNavFor={nav2}
                      ref={(slider) => setNav1(slider)}>
                      {product.product_image.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image.url}
                            alt={`${product.product_name} - Image ${index + 1}`}
                            className="w-full h-[400px] object-contain bg-white"
                          />
                        </div>
                      ))}
                    </Slider>
                  </Watermark>
                ) : (
                  <div className="flex items-center justify-center w-full h-[400px] bg-gray-100 rounded-lg">
                    <p className="text-gray-400">No image available</p>
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.product_image && product.product_image.length > 1 && (
                <div className="thumbnail-slider-container px-1">
                  <Slider
                    {...thumbnailSliderSettings}
                    asNavFor={nav1}
                    ref={(slider) => setNav2(slider)}>
                    {product.product_image.map((image, index) => (
                      <div
                        key={index}
                        className={`thumbnail-item p-1 cursor-pointer`}>
                        <div
                          className={`border rounded-md overflow-hidden ${
                            activeIndex === index
                              ? "border-blue-500 ring-2 ring-blue-200"
                              : "border-gray-200"
                          }`}>
                          <img
                            src={image.url}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-20 object-cover"
                          />
                        </div>
                      </div>
                    ))}
                  </Slider>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="product-info">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                {product.product_name}
              </h1>

              {/* Category */}
              <div className="mb-4">
                {product.product_category &&
                  product.product_category.map((category, index) => (
                    <Tag key={index} color="blue" className="mr-2">
                      {category}
                    </Tag>
                  ))}
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <Rate disabled value={ratingData.average} allowHalf />
                <span className="ml-2 text-gray-500">
                  ({ratingData.average.toFixed(1)}/5 - {ratingData.total} đánh
                  giá)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <p className="text-3xl font-bold text-blue-600">
                  {product.product_price.toLocaleString("vi-VN")} đ
                </p>
                {/* Optional: Display original price for discounted items */}
                {/* <p className="text-gray-500 line-through">
                  {(product.product_price * 1.2).toLocaleString("vi-VN")} đ
                </p> */}
              </div>

              {/* Description */}
              <div className="mb-6">
                <p className="text-gray-600">{product.product_title}</p>
              </div>

              {/* Availability */}
              <div className="mb-6">
                <p className="flex items-center text-green-600">
                  <CheckCircleOutlined className="mr-2" />
                  Còn hàng
                </p>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <p className="mb-2 font-medium">Số lượng:</p>
                <InputNumber
                  min={1}
                  max={99}
                  defaultValue={1}
                  onChange={handleQuantityChange}
                  className="mr-4"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  onClick={handleAddToCart}
                  className="bg-blue-600 hover:bg-blue-700 flex items-center">
                  Thêm vào giỏ
                </Button>
                <Button
                  size="large"
                  onClick={handleBuyNow}
                  className="border-blue-600 text-blue-600 hover:text-blue-700 hover:border-blue-700">
                  Mua ngay
                </Button>
                <Tooltip title="Chat với người bán">
                  <Button
                    icon={<MessageOutlined />}
                    size="large"
                    onClick={handleOpenChat}
                    className="border-blue-600 text-blue-600 hover:text-blue-700 hover:border-blue-700">
                    Chat ngay
                  </Button>
                </Tooltip>
                <Tooltip title="Lưu vào danh sách yêu thích">
                  <Button
                    icon={<HeartOutlined />}
                    size="large"
                    className="border-gray-300"
                  />
                </Tooltip>
                <Tooltip title="Chia sẻ sản phẩm">
                  <Button
                    icon={<ShareAltOutlined />}
                    size="large"
                    className="border-gray-300"
                  />
                </Tooltip>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-10">
          <Tabs defaultActiveKey="1" className="p-6">
            <TabPane tab="Mô tả chi tiết" key="1">
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-4">
                  Thông tin sản phẩm
                </h3>
                <div className="whitespace-pre-line">
                  {product.product_description ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: product.product_description,
                      }}
                    />
                  ) : (
                    <p className="text-gray-500">
                      Chưa có thông tin chi tiết về sản phẩm này.
                    </p>
                  )}
                </div>
              </div>
            </TabPane>
            <TabPane tab="Thông số kỹ thuật" key="2">
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-4">
                  Thông số kỹ thuật
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Kích thước</h4>
                    <p className="text-gray-700">Tùy chỉnh theo yêu cầu</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Chất liệu</h4>
                    <p className="text-gray-700">Cao cấp, bền bỉ</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Xuất xứ</h4>
                    <p className="text-gray-700">Việt Nam</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Thời gian sản xuất</h4>
                    <p className="text-gray-700">3-5 ngày làm việc</p>
                  </div>
                </div>
              </div>
            </TabPane>
            <TabPane tab="Đánh giá sản phẩm" key="3">
              <div className="prose max-w-none">
                <ReviewList productId={id} refreshTrigger={refreshReviews} />

                <Divider>
                  <span className="text-gray-500">Viết đánh giá của bạn</span>
                </Divider>

                {isLoggedIn ? (
                  <ReviewForm
                    productId={id}
                    onSuccess={() => setRefreshReviews((prev) => prev + 1)}
                  />
                ) : (
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 mb-4">
                      Bạn cần đăng nhập để viết đánh giá
                    </p>
                    <Link
                      to="/login"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                      Đăng nhập
                    </Link>
                  </div>
                )}
              </div>
            </TabPane>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Sản phẩm liên quan
            </h2>

            <div className="related-products-slider">
              <Slider {...relatedProductsSettings}>
                {relatedProducts.map((product) => (
                  <div key={product._id} className="px-2">
                    <Link to={`/product/${product._id}`}>
                      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                        <div className="relative overflow-hidden">
                          <img
                            src={
                              product.product_image[0]?.url ||
                              "https://res.cloudinary.com/daqtqvneu/image/upload/v1717214881/placeholder-image_qpqgyd.jpg"
                            }
                            alt={product.product_name}
                            className="w-full h-[180px] object-cover object-center transition-transform duration-500 hover:scale-105"
                          />
                          {/* Category tag */}
                          {product.product_category &&
                            product.product_category[0] && (
                              <div className="absolute top-2 left-2">
                                <Tag
                                  color="blue"
                                  className="text-xs px-2 py-0.5">
                                  {product.product_category[0]}
                                </Tag>
                              </div>
                            )}
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                          <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-2 min-h-[2.5rem]">
                            {product.product_name}
                          </h3>
                          <p className="text-xs text-gray-600 mb-3 line-clamp-2 min-h-[2rem]">
                            {product.product_title}
                          </p>
                          <div className="mt-auto">
                            <div className="text-base font-bold text-blue-600">
                              {product.product_price.toLocaleString("vi-VN")} đ
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        )}
      </div>

      <Footer />

      {/* Replace Chat Modal with ChatPopup */}
      {showChat && selectedSeller && (
        <ChatPopup
          initialSeller={selectedSeller}
          onClose={() => setShowChat(false)}
        />
      )}

      {/* Custom CSS as an object with proper React style syntax */}
      <style>{`
        /* Thumbnail slider styles */
        .thumbnail-slider-container .slick-track {
          display: flex;
          gap: 8px;
        }
        
        .thumbnail-slider-container .slick-slide {
          opacity: 0.7;
          transition: all 0.3s ease;
        }
        
        .thumbnail-slider-container .slick-current {
          opacity: 1;
        }

        /* Hide next/prev arrows on small screens */
        @media (max-width: 640px) {
          .thumbnail-slider-container .slick-arrow {
            display: none !important;
          }
        }

        /* Product tabs styles */
        .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #2563eb;
        }

        .ant-tabs-ink-bar {
          background-color: #2563eb;
        }

        /* Enhance nav arrows */
        .slick-prev,
        .slick-next {
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          z-index: 10;
        }

        .slick-prev:before,
        .slick-next:before {
          color: #2563eb;
          font-size: 18px;
        }

        .slick-prev:hover,
        .slick-next:hover {
          background: #2563eb;
        }

        .slick-prev:hover:before,
        .slick-next:hover:before {
          color: white;
        }

        /* Make the line-clamp work properly */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default ProductDetail;
