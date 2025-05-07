import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaSearch,
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
  FaStar,
} from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../../../component/Header/Navbar";
import Footer from "../../../component/Footer/Footer";
import { getItems } from "../../../utils/service";

function Products() {
  const navigate = useNavigate();
  const { category } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    product_category: category || "all",
    product_price: "all",
    rating: "all",
  });
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [ratings, setRatings] = useState([]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getItems("/product/all-products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(
          error.response?.data?.message ||
            "Đã xảy ra lỗi khi tải sản phẩm. Vui lòng thử lại sau."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();

    // Initialize AOS
    AOS.init({
      duration: 800,
      once: true,
      mirror: false,
    });
  }, []);

  // Fetch filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [categories, ratings] = await Promise.all([
          getItems("product/category"),
          getItems("product/rating"),
        ]);

        if (categories.status === 200) {
          setCategories(categories.data);
        }

        if (ratings.status === 200) {
          setRatings(ratings.data);
        }
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };
    fetchFilterOptions();
  }, []);

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.product_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Xử lý trường hợp product_category là mảng hoặc chuỗi
    const matchesCategory =
      filters.product_category === "all" ||
      (Array.isArray(product.product_category)
        ? product.product_category.includes(filters.product_category)
        : product.product_category === filters.product_category);

    // Sử dụng averageRating để filter
    const matchesRating =
      filters.rating === "all" ||
      (product.averageRating || 0) >= parseInt(filters.rating);

    return matchesSearch && matchesCategory && matchesRating;
  });

  // Toggle favorite
  const toggleFavorite = (productId) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Handle category change
  const handleCategoryChange = (selectedCategory) => {
    setFilters({ ...filters, product_category: selectedCategory });
    if (selectedCategory === "all") {
      navigate("/products");
    } else {
      navigate(`/products/category/${selectedCategory}`);
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 animate-pulse">
                <div className="w-full h-48 bg-gray-300 dark:bg-gray-700 rounded-lg mb-4" />
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      {/* {error && <Message type="error" message={error} />} */}

      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-900 dark:to-purple-900">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Khám Phá Tác Phẩm Nghệ Thuật
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Tìm kiếm và sưu tầm những tác phẩm nghệ thuật độc đáo từ các nghệ sĩ
            tài năng trên khắp thế giới
          </p>
        </div>
      </div>

      {/* Filters and Search Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm tác phẩm..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <select
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                value={filters.product_category}
                onChange={(e) => handleCategoryChange(e.target.value)}>
                <option value="all">Tất Cả Danh Mục</option>
                {categories && categories.length > 0 ? (
                  categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    Không có danh mục
                  </option>
                )}
              </select>
              <select
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                value={filters.rating}
                onChange={(e) =>
                  setFilters({ ...filters, rating: e.target.value })
                }>
                <option value="all">Tất Cả Đánh Giá</option>
                {ratings && ratings.length > 0 ? (
                  ratings.map((rating, index) => (
                    <option key={index} value={rating}>
                      {rating} sao
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    Không có đánh giá
                  </option>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              data-aos="fade-up">
              <Link to={`/product/${product._id}`} className="block relative">
                <img
                  src={
                    product.product_image?.[0]?.url || "/placeholder-image.jpg"
                  }
                  alt={product.product_name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder-image.jpg";
                  }}
                />
                <div className="absolute top-4 right-4 z-10">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(product._id);
                    }}
                    className="p-2 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-md hover:bg-white dark:hover:bg-gray-700 transition-colors">
                    {favorites.includes(product._id) ? (
                      <FaHeart className="text-red-500" />
                    ) : (
                      <FaRegHeart className="text-gray-600 dark:text-gray-300" />
                    )}
                  </button>
                </div>
              </Link>

              <div className="p-4">
                <Link to={`/product/${product._id}`}>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {product.product_name}
                  </h3>
                </Link>

                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`w-4 h-4 ${
                          i < (product.averageRating || 0)
                            ? "text-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    ({product.reviewCount || 0} đánh giá)
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                    {(product.product_price || 0).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                  <button
                    className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                    data-tooltip-id="add-to-cart"
                    data-tooltip-content="Thêm vào giỏ hàng">
                    <FaShoppingCart />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && !error && (
          <div className="text-center py-12">
            <FaSearch className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Không tìm thấy sản phẩm
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
            </p>
          </div>
        )}
      </div>

      {/* Tooltips */}
      <Tooltip id="add-to-cart" />
      <Footer />
    </div>
  );
}

export default Products;
