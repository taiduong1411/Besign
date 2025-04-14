import SideBar from "../../../component/SideBar/SideBarSeller";
import {
  Layout,
  Table,
  Button,
  Modal,
  Tag,
  Avatar,
  theme,
  Typography,
  Input,
  Card,
  Tooltip,
  Badge,
  Skeleton,
  Dropdown,
  Empty,
  message,
  Divider,
} from "antd";
import StickyBox from "react-sticky-box";
import { useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  ReloadOutlined,
  BellOutlined,
  MoreOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  InfoCircleOutlined,
  DashboardOutlined,
  LineChartOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import Lenis from "lenis";
import { getItems, addItems } from "../../../utils/service";

const { Content, Header } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

function OrderManagerment() {
  useEffect(() => {
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
  }, []);

  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const columns = [
    {
      title: "Mã Đơn Hàng",
      width: "20%",
      key: "order_name",
      render: (record) => {
        return (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-500">
              <InfoCircleOutlined style={{ fontSize: "24px" }} />
            </div>
            <div>
              <div className="font-medium text-gray-800">
                {record.order_name}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <ClockCircleOutlined style={{ fontSize: "10px" }} />
                {new Date(record.createdAt).toLocaleDateString("vi-VN")}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Thông Tin Người Mua",
      width: "25%",
      key: "email",
      render: (record) => {
        return (
          <div className="max-h-24 overflow-y-auto pr-2 text-gray-600 custom-scrollbar">
            <div className="font-medium">{record.user_email}</div>
            <div className="text-sm text-gray-500">{record.email}</div>
          </div>
        );
      },
    },
    {
      title: "Sản Phẩm",
      width: "25%",
      key: "productId",
      render: (record) => {
        return (
          <div className="max-h-24 overflow-y-auto pr-2 text-gray-600 custom-scrollbar">
            <div className="font-medium">{record.product_name}</div>
            <div className="text-sm text-gray-500">
              {record.product_price.toLocaleString("vi-VN")}đ
            </div>
          </div>
        );
      },
    },
    {
      title: "Tổng Tiền",
      width: "15%",
      key: "totalAmount",
      render: (record) => {
        return (
          <div className="text-sm font-medium text-blue-600">
            {record.totalAmount.toLocaleString("vi-VN")}đ
          </div>
        );
      },
    },
    {
      title: "Trạng Thái",
      width: "10%",
      key: "status",
      render: (record) => {
        if (record.status === false) {
          return (
            <Tag
              icon={<ClockCircleOutlined />}
              color="warning"
              className="px-3 py-1 rounded-full text-xs flex items-center w-fit">
              Chờ xác nhận
            </Tag>
          );
        } else {
          return (
            <Tag
              icon={<CheckCircleOutlined />}
              color="success"
              className="px-3 py-1 rounded-full text-xs flex items-center w-fit">
              Đã xác nhận
            </Tag>
          );
        }
      },
    },
    {
      title: "Thao Tác",
      render: (record) => {
        return (
          <div className="flex gap-2">
            {!record.status && (
              <Tooltip title="Xác nhận đơn hàng">
                <Button
                  type="primary"
                  shape="circle"
                  icon={<CheckCircleOutlined />}
                  className="flex items-center justify-center"
                  style={{
                    background: "#52c41a",
                    borderColor: "#52c41a",
                  }}
                  onClick={() => handleConfirmOrder(record)}
                />
              </Tooltip>
            )}
            <Dropdown
              menu={{
                items: [
                  {
                    key: "1",
                    label: "Xem chi tiết",
                    icon: <EyeOutlined />,
                    onClick: () => showPreview(record),
                  },
                ],
              }}
              trigger={["click"]}
              placement="bottomRight">
              <Button
                type="text"
                shape="circle"
                icon={<MoreOutlined />}
                className="flex items-center justify-center"
              />
            </Dropdown>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getDataOrders();
  }, []);

  const [dataOrders, setDataOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);

  // Simulate loading state
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const getDataOrders = async () => {
    setLoading(true);
    await getItems("seller/orders")
      .then((res) => {
        setDataOrders(res.data);
        setFilteredOrders(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        message.error("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      });
  };

  useEffect(() => {
    if (searchValue) {
      let filtered = dataOrders.filter(
        (order) =>
          order.order_name?.toLowerCase().includes(searchValue.toLowerCase()) ||
          order.user_email?.toLowerCase().includes(searchValue.toLowerCase())
      );

      // Apply filter by status if needed
      if (filterStatus === "pending") {
        filtered = filtered.filter((order) => order.status === false);
      } else if (filterStatus === "confirmed") {
        filtered = filtered.filter((order) => order.status === true);
      }

      setFilteredOrders(filtered);
    } else {
      // Only apply status filter when no search
      if (filterStatus === "all") {
        setFilteredOrders(dataOrders);
      } else if (filterStatus === "pending") {
        setFilteredOrders(dataOrders.filter((order) => order.status === false));
      } else if (filterStatus === "confirmed") {
        setFilteredOrders(dataOrders.filter((order) => order.status === true));
      }
    }
  }, [searchValue, dataOrders, filterStatus]);

  const handleConfirmOrder = async (record) => {
    try {
      setLoading(true);
      await addItems(`seller/update-order-status`, {
        orderId: record._id,
        status: true,
      });

      // Update local state
      const updatedData = dataOrders.map((item) =>
        item._id === record._id ? { ...item, status: true } : item
      );

      setDataOrders(updatedData);
      setFilteredOrders(updatedData);
      message.success("Đơn hàng đã được xác nhận thành công");
      setLoading(false);
    } catch (error) {
      console.error("Error confirming order:", error);
      message.error("Không thể xác nhận đơn hàng. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchValue(value);
  };

  const handleFilter = (status) => {
    setFilterStatus(status);
  };

  // Statistics calculations
  const pendingOrdersCount = dataOrders.filter((order) => !order.status).length;
  const confirmedOrdersCount = dataOrders.filter(
    (order) => order.status
  ).length;
  const pendingPercentage =
    dataOrders.length > 0
      ? Math.round((pendingOrdersCount / dataOrders.length) * 100)
      : 0;

  // Handle order preview
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const showPreview = (record) => {
    setSelectedOrder(record);
    setPreviewOpen(true);
  };

  return (
    <div className="bg-[#f5f8ff] min-h-screen">
      <div className="flex">
        <div className="">
          <StickyBox>
            <SideBar
              props={4}
              collapsed={collapsed}
              onCollapse={setCollapsed}
            />
          </StickyBox>
        </div>
        <div className="w-full">
          <Layout className="min-h-svh">
            <Header
              style={{
                padding: 0,
                paddingTop: "12px",
                paddingBottom: "12px",
                background: colorBgContainer,
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
                    icon={
                      collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                    }
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
                        BeSign Seller
                      </span>
                    </Title>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Tooltip title="Làm mới">
                    <Button
                      type="text"
                      shape="circle"
                      icon={<ReloadOutlined />}
                      onClick={() => getDataOrders()}
                      className="flex items-center justify-center hover:bg-blue-50 hover:text-blue-500 text-gray-500"
                    />
                  </Tooltip>

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
                      <Text
                        strong
                        className="text-gray-800 block leading-tight">
                        Seller
                      </Text>
                      <Text className="text-xs text-gray-500 block leading-tight">
                        Trang người bán
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            </Header>

            <Content className="m-6 p-0">
              {/* Page title with breadcrumb */}
              <div className="mb-6">
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                  <a
                    href="/seller/dashboard"
                    className="hover:text-blue-500 transition-colors">
                    Dashboard
                  </a>
                  <span className="px-1">/</span>
                  <span className="text-gray-700">Quản lý đơn hàng</span>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <Title
                      level={3}
                      className="!m-0 !text-gray-800 flex items-center gap-2">
                      <InfoCircleOutlined className="text-blue-500" />
                      Quản Lý Đơn Hàng
                      <Badge
                        count={dataOrders.length}
                        style={{
                          backgroundColor: "#3b82f6",
                          marginLeft: "8px",
                        }}
                        className="ml-2"
                      />
                    </Title>
                    <Text type="secondary">
                      Xem và quản lý các đơn hàng của khách hàng
                    </Text>
                  </div>
                </div>
              </div>

              {/* Analytics cards with animation */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card
                  className="card-stats shadow-md hover:shadow-lg transition-shadow rounded-xl border-none overflow-hidden"
                  bodyStyle={{ padding: "0" }}>
                  <div className="p-6 relative">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 opacity-10 rounded-full -mr-8 -mt-8"></div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-500">
                        <InfoCircleOutlined style={{ fontSize: "24px" }} />
                      </div>
                      <div>
                        <Text className="text-gray-500 text-sm">
                          Tổng đơn hàng
                        </Text>
                        <Title level={3} className="!m-0">
                          {dataOrders.length}
                        </Title>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center text-xs">
                      <Text className="text-green-500 flex items-center">
                        <LineChartOutlined className="mr-1" /> +10%{" "}
                      </Text>
                      <Text className="text-gray-400 ml-1">
                        so với tháng trước
                      </Text>
                    </div>
                  </div>
                </Card>

                <Card
                  className="card-stats shadow-md hover:shadow-lg transition-shadow rounded-xl border-none overflow-hidden"
                  bodyStyle={{ padding: "0" }}>
                  <div className="p-6 relative">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500 opacity-10 rounded-full -mr-8 -mt-8"></div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-500">
                        <ClockCircleOutlined style={{ fontSize: "24px" }} />
                      </div>
                      <div>
                        <Text className="text-gray-500 text-sm">
                          Chờ xác nhận
                        </Text>
                        <Title level={3} className="!m-0">
                          {pendingOrdersCount}
                        </Title>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center text-xs">
                      <Text className="text-amber-500 flex items-center">
                        {pendingPercentage}%{" "}
                      </Text>
                      <Text className="text-gray-400 ml-1">tổng đơn hàng</Text>
                    </div>
                  </div>
                </Card>

                <Card
                  className="card-stats shadow-md hover:shadow-lg transition-shadow rounded-xl border-none overflow-hidden"
                  bodyStyle={{ padding: "0" }}>
                  <div className="p-6 relative">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-500 opacity-10 rounded-full -mr-8 -mt-8"></div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-500">
                        <CheckCircleOutlined style={{ fontSize: "24px" }} />
                      </div>
                      <div>
                        <Text className="text-gray-500 text-sm">
                          Đã xác nhận
                        </Text>
                        <Title level={3} className="!m-0">
                          {confirmedOrdersCount}
                        </Title>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center text-xs">
                      <Text className="text-green-500 flex items-center">
                        {100 - pendingPercentage}%{" "}
                      </Text>
                      <Text className="text-gray-400 ml-1">tổng đơn hàng</Text>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="shadow-md rounded-xl border-none mb-6 overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div className="flex-1 w-full md:max-w-md">
                    <Search
                      placeholder="Tìm kiếm mã đơn hàng, email..."
                      allowClear
                      enterButton={
                        <Button
                          type="primary"
                          className="bg-blue-500 hover:bg-blue-600 border-blue-500">
                          <SearchOutlined className="text-white" />
                        </Button>
                      }
                      size="large"
                      className="w-full news-search"
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-3 items-center">
                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: "all",
                            label: "Tất cả đơn hàng",
                            onClick: () => handleFilter("all"),
                          },
                          {
                            key: "pending",
                            label: "Chờ xác nhận",
                            onClick: () => handleFilter("pending"),
                          },
                          {
                            key: "confirmed",
                            label: "Đã xác nhận",
                            onClick: () => handleFilter("confirmed"),
                          },
                        ],
                      }}>
                      <Button
                        size="large"
                        icon={<FilterOutlined />}
                        className="flex items-center">
                        {filterStatus === "all"
                          ? "Bộ lọc"
                          : filterStatus === "pending"
                          ? "Chờ xác nhận"
                          : "Đã xác nhận"}
                      </Button>
                    </Dropdown>

                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: "1",
                            label: "Mới nhất",
                          },
                          {
                            key: "2",
                            label: "Cũ nhất",
                          },
                        ],
                      }}>
                      <Button
                        size="large"
                        icon={<SortAscendingOutlined />}
                        className="flex items-center">
                        Sắp xếp
                      </Button>
                    </Dropdown>
                  </div>
                </div>

                <Divider style={{ margin: "0 0 24px 0" }} />

                {/* Orders table */}
                {loading ? (
                  <div className="p-4">
                    <Skeleton active paragraph={{ rows: 5 }} />
                  </div>
                ) : (
                  <Table
                    columns={columns}
                    dataSource={filteredOrders}
                    rowKey="_id"
                    pagination={{
                      pageSize: 8,
                      showTotal: (total, range) =>
                        `${range[0]}-${range[1]} của ${total} đơn hàng`,
                      showSizeChanger: true,
                      pageSizeOptions: ["8", "16", "24"],
                    }}
                    className="orders-table"
                    rowClassName={(record, index) =>
                      `${record.status ? "bg-white" : "bg-gray-50"} ${
                        index % 2 === 0 ? "bg-blue-50/30" : ""
                      }`
                    }
                    onRow={() => ({
                      className:
                        "hover:bg-blue-50 transition-colors cursor-pointer",
                    })}
                    locale={{
                      emptyText: (
                        <div className="py-8">
                          <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                              <span className="text-gray-500">
                                Không có đơn hàng nào
                              </span>
                            }
                          />
                        </div>
                      ),
                    }}
                  />
                )}
              </Card>

              <div className="text-center text-gray-500 text-xs mt-6 pb-6">
                <ClockCircleOutlined className="mr-1" />
                Cập nhật lần cuối: {new Date().toLocaleString("vi-VN")}
              </div>
            </Content>
          </Layout>
        </div>
      </div>

      {/* Order Preview Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3 text-blue-600 pb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <EyeOutlined style={{ fontSize: "18px" }} />
            </div>
            <span className="text-lg font-medium">Chi tiết đơn hàng</span>
          </div>
        }
        open={previewOpen}
        width={800}
        onCancel={() => setPreviewOpen(false)}
        footer={null}
        centered
        bodyStyle={{ padding: "24px" }}
        style={{ top: 20 }}
        destroyOnClose
        className="order-preview-modal">
        {selectedOrder && (
          <div className="order-preview-content">
            <div className="grid grid-cols-1 gap-6">
              {/* Order Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Text strong className="block text-gray-500">
                      Mã đơn hàng
                    </Text>
                    <Text className="text-lg">{selectedOrder.order_name}</Text>
                  </div>
                  <div>
                    <Text strong className="block text-gray-500">
                      Ngày tạo
                    </Text>
                    <Text className="text-lg">
                      {new Date(selectedOrder.createdAt).toLocaleString(
                        "vi-VN"
                      )}
                    </Text>
                  </div>
                  <div>
                    <Text strong className="block text-gray-500">
                      Email người mua
                    </Text>
                    <Text className="text-lg">{selectedOrder.email}</Text>
                  </div>
                  <div>
                    <Text strong className="block text-gray-500">
                      Trạng thái
                    </Text>
                    {selectedOrder.status ? (
                      <Tag
                        color="success"
                        icon={<CheckCircleOutlined />}
                        className="px-3 py-1">
                        Đã xác nhận
                      </Tag>
                    ) : (
                      <Tag
                        color="warning"
                        icon={<ClockCircleOutlined />}
                        className="px-3 py-1">
                        Chờ xác nhận
                      </Tag>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Information */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <Text strong className="block text-lg mb-4">
                  Thông tin sản phẩm
                </Text>
                <div className="flex items-center gap-4">
                  <Avatar
                    size={64}
                    src={selectedOrder.product_image?.[0]?.url}
                    shape="square"
                    className="rounded-lg"
                  />
                  <div>
                    <Text strong className="block text-lg">
                      {selectedOrder.product_name}
                    </Text>
                    <Text className="text-gray-500">
                      Giá: {selectedOrder.product_price.toLocaleString("vi-VN")}
                      đ
                    </Text>
                    <Text className="text-gray-500">
                      Số lượng: {selectedOrder.quantity}
                    </Text>
                  </div>
                </div>
              </div>

              {/* Total Amount */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <Text strong className="text-lg">
                    Tổng tiền
                  </Text>
                  <Text strong className="text-xl text-blue-600">
                    {selectedOrder.totalAmount?.toLocaleString("vi-VN")}đ
                  </Text>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Custom CSS */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f5f5f5;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d9d9d9;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #bfbfbf;
        }

        .orders-table .ant-table-thead > tr > th {
          background-color: #f1f5fd !important;
          color: #4b5563 !important;
          font-weight: 600 !important;
          border-bottom: 2px solid #e5e7eb !important;
        }
        
        .orders-table .ant-table {
          border-radius: 8px;
          overflow: hidden;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
          }
          70% {
            box-shadow: 0 0 0 6px rgba(59, 130, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }
        
        .pulse-badge .ant-badge-count {
          animation: pulse 2s infinite;
        }

        /* Color harmonization */
        .bg-[data-color="#f5f8ff"] {
          background-color: #f8faff;
        }
        
        /* Better contrast for card elements */
        .card-stats .text-gray-500 {
          color: #64748b !important;
        }
        
        /* More consistent primary color across elements */
        .bg-blue-500 {
          background-color: #4f46e5 !important;
        }
        
        .text-blue-500 {
          color: #4f46e5 !important;
        }
        
        .hover:bg-blue-50:hover {
          background-color: #eef2ff !important;
        }
        
        .hover:text-blue-500:hover {
          color: #4f46e5 !important;
        }
        
        .from-blue-500 {
          --tw-gradient-from: #4f46e5 !important;
        }
        
        .from-blue-600 {
          --tw-gradient-from: #4338ca !important;
        }
        
        .to-blue-600 {
          --tw-gradient-to: #4338ca !important;
        }
        
        .to-blue-700 {
          --tw-gradient-to: #3730a3 !important;
        }
        
        .bg-blue-100 {
          background-color: #e0e7ff !important;
        }
        
        /* Better contrast for status counters */
        .card-stats:nth-child(1) .w-12.h-12 {
          background-color: #e0e7ff !important;
        }
        
        .card-stats:nth-child(1) .w-12.h-12 .text-blue-500 {
          color: #4f46e5 !important;
        }
        
        .card-stats:nth-child(2) .w-12.h-12 {
          background-color: #fef3c7 !important;
        }
        
        .card-stats:nth-child(2) .w-12.h-12 .text-amber-500 {
          color: #d97706 !important;
        }
        
        .card-stats:nth-child(3) .w-12.h-12 {
          background-color: #dcfce7 !important;
        }
        
        .card-stats:nth-child(3) .w-12.h-12 .text-green-500 {
          color: #16a34a !important;
        }
        
        /* More vibrant gradient for brand identity */
        .bg-gradient-to-r.from-blue-500.to-indigo-600 {
          background-image: linear-gradient(to right, #4f46e5, #4338ca) !important;
        }
      `}</style>
    </div>
  );
}

export default OrderManagerment;
