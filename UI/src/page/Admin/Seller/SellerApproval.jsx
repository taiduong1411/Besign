import { useState, useEffect } from "react";
import {
  FaSearch,
  FaEye,
  FaSortAmountDown,
  FaSortAmountUp,
  FaCheck,
  FaTimes,
  FaRedo,
  FaBan,
  FaLockOpen,
} from "react-icons/fa";
import { getItems, updateItem } from "../../../utils/service";
import moment from "moment";
import SideBar from "../../../component/SideBar/SideBar";
import {
  Layout,
  Button,
  Modal,
  Avatar,
  Typography,
  Tooltip,
  Badge,
  notification,
} from "antd";
import {
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";

const { Content, Header } = Layout;
const { Title, Text } = Typography;

// Status badge component
const StatusBadge = ({ status }) => {
  if (status === "pending") {
    return (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
        <span className="inline-block w-2 h-2 mr-1 bg-yellow-500 rounded-full"></span>
        Chờ duyệt
      </span>
    );
  } else if (status === "approved") {
    return (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
        <span className="inline-block w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
        Đã duyệt
      </span>
    );
  } else if (status === "rejected") {
    return (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
        <span className="inline-block w-2 h-2 mr-1 bg-red-500 rounded-full"></span>
        Từ chối
      </span>
    );
  }
  return null;
};

// Account status badge component
const AccountStatusBadge = ({ isActive }) => {
  if (isActive) {
    return (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
        <span className="inline-block w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
        Kích hoạt
      </span>
    );
  } else {
    return (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
        <span className="inline-block w-2 h-2 mr-1 bg-red-500 rounded-full"></span>
        Đã khoá
      </span>
    );
  }
};

StatusBadge.propTypes = {
  status: PropTypes.string,
};

AccountStatusBadge.propTypes = {
  isActive: PropTypes.bool,
};

const SellerApproval = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [totalSellers, setTotalSellers] = useState(0);
  const [pending, setPending] = useState(0);
  const [approved, setApproved] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [blocked, setBlocked] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [collapsed, setCollapsed] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getItems("admin/get-sellers");
      if (response && response.status === 200) {
        const data = Array.isArray(response.data) ? response.data : [];
        console.log("Seller data:", data);

        setSellers(data);
        // Calculate statistics correctly
        const total = data.length;
        const pendingCount = data.filter(
          (seller) => seller?.approved === "pending"
        ).length;
        const approvedCount = data.filter(
          (seller) => seller?.approved === "approved"
        ).length;
        const rejectedCount = data.filter(
          (seller) => seller?.approved === "rejected"
        ).length;
        // Blocked is based on isActive, not status
        const blockedCount = data.filter(
          (seller) => seller?.isActive === false
        ).length;

        setTotalSellers(total);
        setPending(pendingCount);
        setApproved(approvedCount);
        setRejected(rejectedCount);
        setBlocked(blockedCount);
      } else {
        console.error("Invalid response format:", response);
        setError("Failed to load seller data: Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching seller information:", error);
      setError(`Failed to load seller data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const handleView = (seller) => {
    setSelectedSeller(seller);
    setIsViewModalOpen(true);
  };

  const showNotification = (type, message, description) => {
    api[type]({
      message,
      description,
      placement: "topRight",
      duration: 4,
      icon:
        type === "success" ? (
          <CheckCircleOutlined style={{ color: "#52c41a" }} />
        ) : (
          <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
        ),
    });
  };

  const handleApprove = async (sellerId) => {
    setActionLoading(true);
    try {
      const response = await updateItem(
        `admin/update-seller-status/${sellerId}`,
        {
          status: "approved",
        }
      );

      if (response && response.status == 200) {
        // Update the seller in the local state
        setSellers(
          sellers.map((seller) =>
            seller._id === sellerId
              ? { ...seller, approved: "approved" }
              : seller
          )
        );

        // Update stats
        setApproved(approved + 1);
        setPending(pending - 1);
        fetchSellers();

        // Show success notification
        showNotification(
          "success",
          "Đã duyệt người bán",
          "Người bán đã được phê duyệt thành công."
        );

        // If the updated seller is currently selected, update that too
        if (selectedSeller && selectedSeller._id === sellerId) {
          setSelectedSeller({ ...selectedSeller, approved: "approved" });
        }
      } else {
        console.error("Failed to update seller status:", response);
        showNotification(
          "error",
          "Thao tác thất bại",
          "Không thể duyệt người bán. Vui lòng thử lại."
        );
      }
    } catch (error) {
      console.error("Error updating seller status:", error);
      showNotification("error", "Thao tác thất bại", `Lỗi: ${error.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (sellerId) => {
    setActionLoading(true);
    try {
      const response = await updateItem(
        `admin/update-seller-status/${sellerId}`,
        {
          status: "rejected",
        }
      );
      console.log(response);

      if (response && response.status == 200) {
        // Update the seller in the local state
        setSellers(
          sellers.map((seller) =>
            seller._id === sellerId
              ? { ...seller, approved: "rejected" }
              : seller
          )
        );

        // Update stats
        setRejected(rejected + 1);
        setPending(pending - 1);
        fetchSellers();

        // Show success notification
        showNotification(
          "success",
          "Đã từ chối người bán",
          "Người bán đã bị từ chối thành công."
        );

        // If the updated seller is currently selected, update that too
        if (selectedSeller && selectedSeller._id === sellerId) {
          setSelectedSeller({ ...selectedSeller, approved: "rejected" });
        }
      } else {
        console.error("Failed to update seller status:", response);
        showNotification(
          "error",
          "Thao tác thất bại",
          "Không thể từ chối người bán. Vui lòng thử lại."
        );
      }
    } catch (error) {
      console.error("Error updating seller status:", error);
      showNotification("error", "Thao tác thất bại", `Lỗi: ${error.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReApprove = async (sellerId) => {
    setActionLoading(true);
    try {
      await updateItem(`admin/update-seller-status/${sellerId}`, {
        status: "approved",
      }).then((response) => {
        console.log(response);

        if (response && response.status == 200) {
          // Update the seller in the local state
          setSellers(
            sellers.map((seller) =>
              seller._id === sellerId
                ? { ...seller, approved: "approved" }
                : seller
            )
          );
          // Update stats
          setApproved(approved + 1);
          setRejected(rejected - 1);
          fetchSellers();

          // Show success notification
          showNotification(
            "success",
            "Đã duyệt lại người bán",
            "Người bán đã được duyệt lại thành công."
          );
          // If the updated seller is currently selected, update that too
          if (selectedSeller && selectedSeller._id === sellerId) {
            setSelectedSeller({ ...selectedSeller, approved: "approved" });
          }
        } else {
          console.error("Failed to update seller status:", response);
          showNotification(
            "error",
            "Thao tác thất bại",
            "Không thể duyệt lại người bán. Vui lòng thử lại."
          );
        }
      });
    } catch (error) {
      console.error("Error updating seller status:", error);
      showNotification("error", "Thao tác thất bại", `Lỗi: ${error.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleBlock = async (sellerId) => {
    setActionLoading(true);
    try {
      console.log("Blocking seller with ID:", sellerId);

      // Check if we have a valid seller ID
      if (!sellerId) {
        console.error("Error: No seller ID provided for blocking");
        showNotification(
          "error",
          "Thao tác thất bại",
          "Không thể xác định người bán để chặn"
        );
        setActionLoading(false);
        return;
      }

      // Make the API call to block the seller - only change isActive, not status
      const response = await updateItem(`admin/block-seller/${sellerId}`, {
        isActive: false,
      });

      console.log("Block seller response:", response);

      if (response && response.status === 200) {
        // Update the seller in the local state
        setSellers(
          sellers.map((seller) =>
            seller._id === sellerId ? { ...seller, isActive: false } : seller
          )
        );

        // Update stats
        setBlocked(blocked + 1);

        // Show success notification
        showNotification(
          "success",
          "Đã chặn người bán",
          "Người bán đã bị chặn thành công."
        );

        // If the updated seller is currently selected, update that too
        if (selectedSeller && selectedSeller._id === sellerId) {
          setSelectedSeller({
            ...selectedSeller,
            isActive: false,
          });
        }

        // Refresh the seller list to ensure UI is updated
        fetchSellers();
      } else {
        console.error("Failed to block seller:", response);
        showNotification(
          "error",
          "Thao tác thất bại",
          `Không thể chặn người bán. Lỗi: ${
            response?.error || "Vui lòng thử lại"
          }`
        );
      }
    } catch (error) {
      console.error("Error blocking seller:", error);
      showNotification("error", "Thao tác thất bại", `Lỗi: ${error.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReactivate = async (sellerId) => {
    setActionLoading(true);
    try {
      console.log("Reactivating seller with ID:", sellerId);

      // Check if we have a valid seller ID
      if (!sellerId) {
        console.error("Error: No seller ID provided for reactivation");
        showNotification(
          "error",
          "Thao tác thất bại",
          "Không thể xác định người bán để kích hoạt lại"
        );
        setActionLoading(false);
        return;
      }

      // Make the API call to reactivate the seller - only change isActive, not status
      const response = await updateItem(`admin/block-seller/${sellerId}`, {
        isActive: true,
      });

      console.log("Reactivate seller response:", response);

      if (response && response.status === 200) {
        // Update the seller in the local state
        setSellers(
          sellers.map((seller) =>
            seller._id === sellerId ? { ...seller, isActive: true } : seller
          )
        );

        // Update stats
        setBlocked(blocked - 1);

        // Show success notification
        showNotification(
          "success",
          "Đã kích hoạt lại người bán",
          "Người bán đã được kích hoạt lại thành công."
        );

        // If the updated seller is currently selected, update that too
        if (selectedSeller && selectedSeller._id === sellerId) {
          setSelectedSeller({
            ...selectedSeller,
            isActive: true,
          });
        }

        // Refresh the seller list to ensure UI is updated
        fetchSellers();
      } else {
        console.error("Failed to reactivate seller:", response);
        showNotification(
          "error",
          "Thao tác thất bại",
          `Không thể kích hoạt lại người bán. Lỗi: ${
            response?.error || "Vui lòng thử lại"
          }`
        );
      }
    } catch (error) {
      console.error("Error reactivating seller:", error);
      showNotification("error", "Thao tác thất bại", `Lỗi: ${error.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Filter and sort sellers
  const filteredSellers = sellers
    .filter((seller) => {
      if (!seller) return false;
      const matchesSearch =
        (seller.fullName &&
          seller.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (seller.email &&
          seller.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (seller.phone && seller.phone.includes(searchTerm)) ||
        (seller.shopName &&
          seller.shopName.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFilter =
        filterStatus === "all" || seller.approved === filterStatus;

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        const dateA = a?.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b?.createdAt ? new Date(b.createdAt) : new Date(0);
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortBy === "name") {
        return sortOrder === "asc"
          ? (a?.fullName || "").localeCompare(b?.fullName || "")
          : (b?.fullName || "").localeCompare(a?.fullName || "");
      } else if (sortBy === "shopName") {
        return sortOrder === "asc"
          ? (a?.shopName || "").localeCompare(b?.shopName || "")
          : (b?.shopName || "").localeCompare(a?.shopName || "");
      }
      return 0;
    });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSellers = filteredSellers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredSellers.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {contextHolder}
      <SideBar
        props={3}
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      />
      <Layout className="site-layout flex-1">
        <Header
          style={{
            padding: 0,
            paddingTop: "12px",
            paddingBottom: "12px",
            background: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            position: "sticky",
            top: 0,
            zIndex: 1,
            width: "100%",
          }}>
          <div className="flex justify-between items-center px-6">
            <div className="flex items-center gap-3">
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "16px",
                  width: 42,
                  height: 42,
                }}
                className="flex items-center justify-center hover:bg-blue-50 hover:text-blue-500"
              />
              <div className="hidden md:block">
                <Title level={4} className="m-0 flex items-center gap-2">
                  <DashboardOutlined className="text-blue-500" />
                  <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent font-bold">
                    BeSign Admin
                  </span>
                </Title>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Tooltip title="Thông báo">
                <Badge count={2} size="small" className="pulse-badge">
                  <Button
                    type="text"
                    shape="circle"
                    icon={<BellOutlined />}
                    className="flex items-center justify-center hover:bg-blue-50 hover:text-blue-500 text-gray-500"
                  />
                </Badge>
              </Tooltip>

              <div className="flex items-center border-l border-gray-200 pl-4 ml-2">
                <Avatar
                  size={36}
                  src="https://i.pravatar.cc/150?img=3"
                  className="border-2 border-white shadow-sm"
                />
                <div className="ml-3 hidden md:block">
                  <Text strong className="text-gray-800 block leading-tight">
                    Admin
                  </Text>
                  <Text className="text-xs text-gray-500 block leading-tight">
                    Quản trị viên
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </Header>
        <Content style={{ margin: "16px", overflow: "auto" }}>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <span className="bg-blue-600 w-2 h-8 rounded-full mr-3"></span>
                Quản Lý Người Bán
              </h1>
              <Tooltip title="Làm mới dữ liệu">
                <Button
                  type="primary"
                  icon={<ReloadOutlined />}
                  onClick={fetchSellers}
                  className="flex items-center bg-blue-600 hover:bg-blue-700 border-0 shadow-md">
                  Làm mới
                </Button>
              </Tooltip>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
              <div className="bg-gradient-to-br from-white to-blue-50 overflow-hidden shadow-lg rounded-xl border border-blue-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="px-6 py-6 sm:p-6 relative">
                  <div className="absolute top-0 right-0 mt-2 mr-2 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-lg">Σ</span>
                  </div>
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Tổng số người bán
                    </dt>
                    <dd className="mt-3 text-3xl font-bold text-gray-900">
                      {totalSellers}
                    </dd>
                    <dd className="mt-2 text-xs text-blue-500">
                      100% người bán
                    </dd>
                  </dl>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-yellow-50 overflow-hidden shadow-lg rounded-xl border border-yellow-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="px-6 py-6 sm:p-6 relative">
                  <div className="absolute top-0 right-0 mt-2 mr-2 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 text-lg">⋯</span>
                  </div>
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Chờ duyệt
                    </dt>
                    <dd className="mt-3 text-3xl font-bold text-yellow-600">
                      {pending}
                    </dd>
                    <dd className="mt-2 text-xs text-yellow-500">
                      {totalSellers > 0
                        ? Math.round((pending / totalSellers) * 100)
                        : 0}
                      % người bán
                    </dd>
                  </dl>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-green-50 overflow-hidden shadow-lg rounded-xl border border-green-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="px-6 py-6 sm:p-6 relative">
                  <div className="absolute top-0 right-0 mt-2 mr-2 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-lg">✓</span>
                  </div>
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Đã duyệt
                    </dt>
                    <dd className="mt-3 text-3xl font-bold text-green-600">
                      {approved}
                    </dd>
                    <dd className="mt-2 text-xs text-green-500">
                      {totalSellers > 0
                        ? Math.round((approved / totalSellers) * 100)
                        : 0}
                      % người bán
                    </dd>
                  </dl>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-red-50 overflow-hidden shadow-lg rounded-xl border border-red-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="px-6 py-6 sm:p-6 relative">
                  <div className="absolute top-0 right-0 mt-2 mr-2 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-lg">✗</span>
                  </div>
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Đã từ chối
                    </dt>
                    <dd className="mt-3 text-3xl font-bold text-red-600">
                      {rejected}
                    </dd>
                    <dd className="mt-2 text-xs text-red-500">
                      {totalSellers > 0
                        ? Math.round((rejected / totalSellers) * 100)
                        : 0}
                      % người bán
                    </dd>
                  </dl>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-orange-50 overflow-hidden shadow-lg rounded-xl border border-orange-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="px-6 py-6 sm:p-6 relative">
                  <div className="absolute top-0 right-0 mt-2 mr-2 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 text-lg">⊗</span>
                  </div>
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Tài khoản bị khoá
                    </dt>
                    <dd className="mt-3 text-3xl font-bold text-orange-600">
                      {blocked}
                    </dd>
                    <dd className="mt-2 text-xs text-orange-500">
                      {totalSellers > 0
                        ? Math.round((blocked / totalSellers) * 100)
                        : 0}
                      % người bán
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="mt-8 bg-white shadow-lg rounded-xl p-5 border border-gray-100">
              <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
                <div className="flex flex-1 md:max-w-xs">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={handleSearch}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white sm:text-sm transition-all duration-200"
                      placeholder="Tìm kiếm theo email, số điện thoại, tên cửa hàng..."
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <div className="inline-flex shadow-sm rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => handleFilterChange("all")}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-all duration-200 ${
                        filterStatus === "all"
                          ? "bg-blue-50 text-blue-700 border-blue-300 z-10"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                      }`}>
                      Tất cả
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFilterChange("pending")}
                      className={`relative inline-flex items-center px-4 py-2 border-t border-b border-r text-sm font-medium transition-all duration-200 ${
                        filterStatus === "pending"
                          ? "bg-yellow-50 text-yellow-700 border-yellow-300 z-10"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                      }`}>
                      Chờ duyệt
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFilterChange("approved")}
                      className={`relative inline-flex items-center px-4 py-2 border-t border-b border-r text-sm font-medium transition-all duration-200 ${
                        filterStatus === "approved"
                          ? "bg-green-50 text-green-700 border-green-300 z-10"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                      }`}>
                      Đã duyệt
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFilterChange("rejected")}
                      className={`relative inline-flex items-center px-4 py-2 border-t border-b border-r text-sm font-medium transition-all duration-200 ${
                        filterStatus === "rejected"
                          ? "bg-red-50 text-red-700 border-red-300 z-10"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                      }`}>
                      Từ chối
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFilterChange("blocked")}
                      className={`relative inline-flex items-center px-4 py-2 border-t border-b border-r text-sm font-medium transition-all duration-200 ${
                        filterStatus === "blocked"
                          ? "bg-orange-50 text-orange-700 border-orange-300 z-10"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                      }`}>
                      Đã chặn
                    </button>
                  </div>

                  <div className="inline-flex shadow-sm rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => handleSort("date")}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-all duration-200 ${
                        sortBy === "date"
                          ? "bg-indigo-50 text-indigo-700 border-indigo-300 z-10"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                      }`}>
                      Ngày{" "}
                      {sortBy === "date" &&
                        (sortOrder === "asc" ? (
                          <FaSortAmountUp className="ml-1" />
                        ) : (
                          <FaSortAmountDown className="ml-1" />
                        ))}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSort("name")}
                      className={`relative inline-flex items-center px-4 py-2 border-t border-b border-r text-sm font-medium transition-all duration-200 ${
                        sortBy === "name"
                          ? "bg-indigo-50 text-indigo-700 border-indigo-300 z-10"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                      }`}>
                      Tên{" "}
                      {sortBy === "name" &&
                        (sortOrder === "asc" ? (
                          <FaSortAmountUp className="ml-1" />
                        ) : (
                          <FaSortAmountDown className="ml-1" />
                        ))}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSort("shopName")}
                      className={`relative inline-flex items-center px-4 py-2 border-t border-b border-r text-sm font-medium transition-all duration-200 ${
                        sortBy === "shopName"
                          ? "bg-indigo-50 text-indigo-700 border-indigo-300 z-10"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                      }`}>
                      Cửa hàng{" "}
                      {sortBy === "shopName" &&
                        (sortOrder === "asc" ? (
                          <FaSortAmountUp className="ml-1" />
                        ) : (
                          <FaSortAmountDown className="ml-1" />
                        ))}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="mt-6 bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
              {loading ? (
                <div className="p-12 text-center">
                  <div className="spinner"></div>
                  <p className="mt-4 text-gray-600 font-medium">
                    Đang tải thông tin người bán...
                  </p>
                </div>
              ) : error ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                    <FaTimes className="text-red-500 text-xl" />
                  </div>
                  <p className="mt-4 text-red-600 font-medium">{error}</p>
                  <button
                    onClick={fetchSellers}
                    className="mt-6 inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                    Thử lại
                  </button>
                </div>
              ) : filteredSellers.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <FaSearch className="text-gray-400 text-xl" />
                  </div>
                  <p className="mt-4 text-gray-600 font-medium">
                    Không tìm thấy thông tin người bán.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 rounded-t-lg overflow-hidden">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tên người bán
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cửa hàng
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ngày đăng ký
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trạng thái phê duyệt
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trạng thái tài khoản
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {loading ? (
                        <tr>
                          <td colSpan="7" className="px-6 py-4 text-center">
                            <div className="flex justify-center">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                            </div>
                            <p className="mt-2 text-sm text-gray-500">
                              Đang tải dữ liệu...
                            </p>
                          </td>
                        </tr>
                      ) : error ? (
                        <tr>
                          <td
                            colSpan="7"
                            className="px-6 py-4 text-center text-red-500">
                            {error}
                          </td>
                        </tr>
                      ) : sellers.length === 0 ? (
                        <tr>
                          <td
                            colSpan="7"
                            className="px-6 py-4 text-center text-gray-500">
                            Không có người bán nào.
                          </td>
                        </tr>
                      ) : (
                        currentSellers.map((seller) => (
                          <tr
                            key={seller._id}
                            className={`hover:bg-gray-50 transition-colors ${
                              !seller.isActive ? "opacity-60" : ""
                            }`}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {seller._id.substring(0, 8)}...
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {seller.fullName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {seller.shopName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(seller.createdAt).toLocaleDateString(
                                "vi-VN"
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <StatusBadge status={seller.approved} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <AccountStatusBadge isActive={seller.isActive} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => handleView(seller)}
                                  className="text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 px-2 py-1 rounded transition-colors duration-150">
                                  <FaEye className="inline mr-1" /> Xem
                                </button>

                                {seller.approved === "pending" &&
                                  seller.isActive && (
                                    <>
                                      <button
                                        onClick={() =>
                                          handleApprove(seller._id)
                                        }
                                        disabled={actionLoading}
                                        className="text-green-600 hover:text-green-900 hover:bg-green-50 px-2 py-1 rounded disabled:opacity-50 transition-colors duration-150">
                                        <FaCheck className="inline mr-1" />{" "}
                                        Duyệt
                                      </button>
                                      <button
                                        onClick={() => handleReject(seller._id)}
                                        disabled={actionLoading}
                                        className="text-red-600 hover:text-red-900 hover:bg-red-50 px-2 py-1 rounded disabled:opacity-50 transition-colors duration-150">
                                        <FaTimes className="inline mr-1" /> Từ
                                        chối
                                      </button>
                                    </>
                                  )}

                                {seller.approved === "rejected" &&
                                  seller.isActive && (
                                    <button
                                      onClick={() =>
                                        handleReApprove(seller._id)
                                      }
                                      disabled={actionLoading}
                                      className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 px-2 py-1 rounded disabled:opacity-50 transition-colors duration-150">
                                      <FaRedo className="inline mr-1" /> Duyệt
                                      lại
                                    </button>
                                  )}

                                {seller.isActive ? (
                                  <button
                                    onClick={() => handleBlock(seller._id)}
                                    disabled={actionLoading}
                                    className="text-orange-600 hover:text-orange-900 hover:bg-orange-50 px-2 py-1 rounded disabled:opacity-50 transition-colors duration-150">
                                    <FaBan className="inline mr-1" /> Chặn
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleReactivate(seller._id)}
                                    disabled={actionLoading}
                                    className="text-purple-600 hover:text-purple-900 hover:bg-purple-50 px-2 py-1 rounded disabled:opacity-50 transition-colors duration-150">
                                    <FaLockOpen className="inline mr-1" /> Kích
                                    hoạt lại
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {!loading && !error && filteredSellers.length > 0 && (
                <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 bg-gray-50">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      } transition-colors duration-150`}>
                      Trước
                    </button>
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      } transition-colors duration-150`}>
                      Sau
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Hiển thị{" "}
                        <span className="font-medium text-gray-900">
                          {indexOfFirstItem + 1}
                        </span>{" "}
                        đến{" "}
                        <span className="font-medium text-gray-900">
                          {Math.min(indexOfLastItem, filteredSellers.length)}
                        </span>{" "}
                        trong{" "}
                        <span className="font-medium text-gray-900">
                          {filteredSellers.length}
                        </span>{" "}
                        kết quả
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => paginate(1)}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === 1
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-gray-500 hover:bg-gray-50"
                          } transition-colors duration-150`}>
                          <span className="sr-only">Đầu tiên</span>
                          <span>&laquo;</span>
                        </button>
                        <button
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === 1
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-gray-500 hover:bg-gray-50"
                          } transition-colors duration-150`}>
                          <span className="sr-only">Trước</span>
                          <span>&lsaquo;</span>
                        </button>

                        {/* Page numbers */}
                        {[...Array(totalPages)].map((_, i) => {
                          const pageNumber = i + 1;
                          // Show active page, and 1 page before and after
                          if (
                            pageNumber === 1 ||
                            pageNumber === totalPages ||
                            (pageNumber >= currentPage - 1 &&
                              pageNumber <= currentPage + 1)
                          ) {
                            return (
                              <button
                                key={pageNumber}
                                onClick={() => paginate(pageNumber)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                  currentPage === pageNumber
                                    ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                } transition-colors duration-150`}>
                                {pageNumber}
                              </button>
                            );
                          }

                          // Show dots for gaps
                          if (
                            (pageNumber === 2 && currentPage > 3) ||
                            (pageNumber === totalPages - 1 &&
                              currentPage < totalPages - 2)
                          ) {
                            return (
                              <span
                                key={pageNumber}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                ...
                              </span>
                            );
                          }

                          return null;
                        })}

                        <button
                          onClick={() => paginate(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === totalPages
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-gray-500 hover:bg-gray-50"
                          } transition-colors duration-150`}>
                          <span className="sr-only">Sau</span>
                          <span>&rsaquo;</span>
                        </button>
                        <button
                          onClick={() => paginate(totalPages)}
                          disabled={currentPage === totalPages}
                          className={`relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === totalPages
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-gray-500 hover:bg-gray-50"
                          } transition-colors duration-150`}>
                          <span className="sr-only">Cuối cùng</span>
                          <span>&raquo;</span>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Content>
      </Layout>

      {/* Detail Modal */}
      <Modal
        open={isViewModalOpen}
        footer={[
          <div
            key="actions"
            className="flex justify-between w-full px-6 py-3 bg-gray-50 rounded-b-lg">
            <div>
              {selectedSeller?.approved === "pending" &&
                selectedSeller?.isActive && (
                  <>
                    <button
                      key="approve"
                      type="button"
                      disabled={actionLoading}
                      className="inline-flex justify-center rounded-lg border border-transparent shadow-sm px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-base font-medium text-white hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 mr-2 transition-all duration-200"
                      onClick={() => {
                        handleApprove(selectedSeller._id);
                        setIsViewModalOpen(false);
                      }}>
                      {actionLoading ? (
                        "Đang xử lý..."
                      ) : (
                        <span className="flex items-center">
                          <FaCheck className="mr-2" /> Duyệt người bán
                        </span>
                      )}
                    </button>
                    <button
                      key="reject"
                      type="button"
                      disabled={actionLoading}
                      className="inline-flex justify-center rounded-lg border border-transparent shadow-sm px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-base font-medium text-white hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 transition-all duration-200"
                      onClick={() => {
                        handleReject(selectedSeller._id);
                        setIsViewModalOpen(false);
                      }}>
                      {actionLoading ? (
                        "Đang xử lý..."
                      ) : (
                        <span className="flex items-center">
                          <FaTimes className="mr-2" /> Từ chối người bán
                        </span>
                      )}
                    </button>
                  </>
                )}

              {selectedSeller?.approved === "rejected" &&
                selectedSeller?.isActive && (
                  <button
                    key="reapprove"
                    type="button"
                    disabled={actionLoading}
                    className="inline-flex justify-center rounded-lg border border-transparent shadow-sm px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-base font-medium text-white hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 transition-all duration-200"
                    onClick={() => {
                      handleReApprove(selectedSeller._id);
                      setIsViewModalOpen(false);
                    }}>
                    {actionLoading ? (
                      "Đang xử lý..."
                    ) : (
                      <span className="flex items-center">
                        <FaRedo className="mr-2" /> Duyệt lại người bán
                      </span>
                    )}
                  </button>
                )}

              {selectedSeller?.isActive ? (
                <button
                  key="block"
                  type="button"
                  disabled={actionLoading}
                  className="inline-flex justify-center rounded-lg border border-transparent shadow-sm px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-base font-medium text-white hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 transition-all duration-200"
                  onClick={() => {
                    handleBlock(selectedSeller._id);
                    setIsViewModalOpen(false);
                  }}>
                  {actionLoading ? (
                    "Đang xử lý..."
                  ) : (
                    <span className="flex items-center">
                      <FaBan className="mr-2" /> Chặn người bán
                    </span>
                  )}
                </button>
              ) : (
                <button
                  key="reactivate"
                  type="button"
                  disabled={actionLoading}
                  className="inline-flex justify-center rounded-lg border border-transparent shadow-sm px-5 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-base font-medium text-white hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 transition-all duration-200"
                  onClick={() => {
                    handleReactivate(selectedSeller._id);
                    setIsViewModalOpen(false);
                  }}>
                  {actionLoading ? (
                    "Đang xử lý..."
                  ) : (
                    <span className="flex items-center">
                      <FaLockOpen className="mr-2" /> Kích hoạt lại người bán
                    </span>
                  )}
                </button>
              )}
            </div>
            <button
              key="close"
              type="button"
              className="inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-5 py-2.5 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200"
              onClick={() => setIsViewModalOpen(false)}>
              <span className="flex items-center">Đóng</span>
            </button>
          </div>,
        ]}
        onCancel={() => setIsViewModalOpen(false)}
        width={800}
        title={
          <div className="mb-2 flex justify-between items-center">
            <h3 className="text-2xl font-bold text-gray-800 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
              {selectedSeller?.shopName}
              <div className="mt-2 flex gap-2">
                <StatusBadge status={selectedSeller?.approved} />
                <AccountStatusBadge isActive={selectedSeller?.isActive} />
              </div>
            </h3>
          </div>
        }
        styles={{
          body: {
            padding: "24px",
            overflowY: "auto",
            maxHeight: "calc(80vh - 120px)",
            backgroundColor: "#fafafa",
          },
          mask: { backgroundColor: "rgba(0, 0, 0, 0.65)" },
          header: {
            borderBottom: "1px solid #f0f0f0",
            padding: "16px 24px",
            background: "linear-gradient(to right, #f0f9ff, #e0f2fe)",
          },
          content: {
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          },
        }}
        centered
        className="seller-detail-modal">
        {selectedSeller && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                <span className="bg-gradient-to-r from-blue-400 to-blue-500 text-white w-8 h-8 rounded-lg flex items-center justify-center mr-2 shadow-md">
                  <span className="text-sm">@</span>
                </span>
                Thông tin liên hệ
              </h4>
              <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-md hover:shadow-lg transition-all duration-300">
                <p className="text-sm text-gray-600 mb-3 flex items-start">
                  <span className="font-medium text-gray-700 min-w-[100px] inline-block">
                    Email:
                  </span>{" "}
                  <span className="bg-blue-50 px-3 py-1 rounded-lg flex-1">
                    {selectedSeller?.email || "N/A"}
                  </span>
                </p>
                <p className="text-sm text-gray-600 mb-3 flex items-start">
                  <span className="font-medium text-gray-700 min-w-[100px] inline-block">
                    Số điện thoại:
                  </span>{" "}
                  <span className="bg-blue-50 px-3 py-1 rounded-lg flex-1">
                    {selectedSeller?.phone || "N/A"}
                  </span>
                </p>
                <p className="text-sm text-gray-600 mb-3 flex items-start">
                  <span className="font-medium text-gray-700 min-w-[100px] inline-block">
                    CMND/CCCD:
                  </span>{" "}
                  <span className="bg-blue-50 px-3 py-1 rounded-lg flex-1">
                    {selectedSeller?.idCardNumber || "N/A"}
                  </span>
                </p>
                <p className="text-sm text-gray-600 flex items-start">
                  <span className="font-medium text-gray-700 min-w-[100px] inline-block">
                    Ngày đăng ký:
                  </span>{" "}
                  <span className="bg-blue-50 px-3 py-1 rounded-lg flex-1">
                    {selectedSeller?.createdAt
                      ? moment(selectedSeller.createdAt).format(
                          "DD/MM/YYYY [lúc] HH:mm"
                        )
                      : "N/A"}
                  </span>
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                <span className="bg-gradient-to-r from-green-400 to-green-500 text-white w-8 h-8 rounded-lg flex items-center justify-center mr-2 shadow-md">
                  <span className="text-sm">S</span>
                </span>
                Thông tin cửa hàng
              </h4>
              <div className="bg-white p-5 rounded-xl border border-green-100 shadow-md hover:shadow-lg transition-all duration-300">
                <p className="text-sm text-gray-600 mb-3 flex items-start">
                  <span className="font-medium text-gray-700 min-w-[100px] inline-block">
                    Tên cửa hàng:
                  </span>{" "}
                  <span className="bg-green-50 px-3 py-1 rounded-lg flex-1">
                    {selectedSeller?.shopName || "N/A"}
                  </span>
                </p>
                <p className="text-sm text-gray-600 mb-3 flex items-start">
                  <span className="font-medium text-gray-700 min-w-[100px] inline-block">
                    Địa chỉ:
                  </span>{" "}
                  <span className="bg-green-50 px-3 py-1 rounded-lg flex-1">
                    {selectedSeller?.address || "N/A"}
                  </span>
                </p>
                <p className="text-sm text-gray-600 mb-3 flex items-start">
                  <span className="font-medium text-gray-700 min-w-[100px] inline-block">
                    Đang hoạt động:
                  </span>{" "}
                  <span
                    className={`px-3 py-1 rounded-lg flex-1 ${
                      selectedSeller?.isActive
                        ? "bg-green-50 text-green-800"
                        : "bg-red-50 text-red-800"
                    }`}>
                    {selectedSeller?.isActive ? "Có" : "Không"}
                  </span>
                </p>
                <p className="text-sm text-gray-600 flex items-start">
                  <span className="font-medium text-gray-700 min-w-[100px] inline-block">
                    Điều khoản:
                  </span>{" "}
                  <span
                    className={`px-3 py-1 rounded-lg flex-1 ${
                      selectedSeller?.agreeTerms
                        ? "bg-green-50 text-green-800"
                        : "bg-red-50 text-red-800"
                    }`}>
                    {selectedSeller?.agreeTerms ? "Đã đồng ý" : "Chưa đồng ý"}
                  </span>
                </p>
              </div>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                <span className="bg-gradient-to-r from-purple-400 to-purple-500 text-white w-8 h-8 rounded-lg flex items-center justify-center mr-2 shadow-md">
                  <span className="text-sm">D</span>
                </span>
                Mô tả cửa hàng
              </h4>
              <div className="bg-white p-5 rounded-xl border border-purple-100 shadow-md hover:shadow-lg transition-all duration-300">
                <p className="text-sm text-gray-600 bg-purple-50 p-4 rounded-lg">
                  {selectedSeller?.description || "Không có mô tả."}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Styles for Modal and other components */}
      <style>{`
        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border-left-color: #3b82f6;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        /* Modal styling improvements */
        .seller-detail-modal .ant-modal-content {
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        
        .seller-detail-modal .ant-modal-header {
          padding: 20px 24px;
          border-bottom: 1px solid #f0f0f0;
          background: linear-gradient(to right, #f0f9ff, #e0f2fe);
        }
        
        .seller-detail-modal .ant-modal-body {
          padding: 24px;
          overflow-y: auto;
          background-color: #fafafa;
        }
        
        .seller-detail-modal .ant-modal-body::-webkit-scrollbar {
          width: 6px;
        }
        
        .seller-detail-modal .ant-modal-body::-webkit-scrollbar-track {
          background: #f5f5f5;
          border-radius: 10px;
        }
        
        .seller-detail-modal .ant-modal-body::-webkit-scrollbar-thumb {
          background: #d9d9d9;
          border-radius: 10px;
        }
        
        .seller-detail-modal .ant-modal-body::-webkit-scrollbar-thumb:hover {
          background: #bfbfbf;
        }
        
        .ant-btn-primary {
          background-color: #3b82f6;
          border-color: #3b82f6;
        }
        
        .ant-btn-primary:hover, .ant-btn-primary:focus {
          background-color: #2563eb;
          border-color: #2563eb;
        }
        
        /* Animation for status badges */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* Apply animation to status badges */
        table tbody tr td:nth-child(4) > span {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SellerApproval;
