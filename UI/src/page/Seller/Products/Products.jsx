import SideBar from "../../../component/SideBar/SideBarSeller";
import {
  Layout,
  Table,
  Button,
  Modal,
  Tag,
  Avatar,
  Radio,
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
import { useForm } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import upload from "../../../utils/upload";
import Message from "../../../component/Message/Message";
import {
  delById,
  addItems,
  getItems,
  updateItem,
} from "../../../utils/service";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  LockOutlined,
  UnlockOutlined,
  FileImageOutlined,
  FileTextOutlined,
  TagsOutlined,
  EyeOutlined,
  ReloadOutlined,
  BellOutlined,
  MoreOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  LinkOutlined,
  InfoCircleOutlined,
  FileAddOutlined,
  DashboardOutlined,
  LineChartOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import Lenis from "lenis";
const { Content, Header } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

function Products() {
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

  // Handle message from server
  const [msg, setMsg] = useState({
    type: "",
    content: "",
    hidden: false,
  });
  const serverMessage = {
    msg,
  };

  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const columns = [
    {
      title: "Tên Sản Phẩm",
      width: "20%",
      key: "title",
      render: (record) => {
        return (
          <div className="flex items-center gap-3">
            <Avatar
              size={48}
              src={record.product_image[0].url}
              shape="square"
              className="rounded-lg border border-gray-200"
            />
            <div>
              <div className="font-medium text-gray-800">
                {record.product_name}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <FileTextOutlined style={{ fontSize: "10px" }} />
                {/* This would normally be a timestamp */}
                {new Date().toLocaleDateString("vi-VN")}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Mô tả ngắn",
      width: "30%",
      key: "product_title",
      render: (record) => {
        return (
          <div className="max-h-24 overflow-y-auto pr-2 text-gray-600 custom-scrollbar line-clamp-3">
            {record.product_title}
          </div>
        );
      },
    },
    {
      title: "Category",
      width: "15%",
      key: "product_category",
      render: (record) => {
        if (!record.product_category || record.product_category.length === 0) {
          return (
            <Text type="secondary" className="text-xs">
              Không có category
            </Text>
          );
        }
        return (
          <div className="flex flex-wrap gap-1">
            {record.product_category.slice(0, 3).map((tag, index) => (
              <Tag key={index} color="blue" className="text-xs">
                {tag}
              </Tag>
            ))}
            {record.product_category.length > 3 && (
              <Tag color="default" className="text-xs">
                +{record.product_category.length - 3}
              </Tag>
            )}
          </div>
        );
      },
    },
    {
      title: "Giá sản phẩm",
      width: "15%",
      key: "product_price",
      render: (record) => {
        return (
          <div className="text-xs">
            {record.product_price.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </div>
        );
      },
    },
    {
      title: "Lượt mua",
      width: "15%",
      key: "total_sold",
      render: (record) => {
        return <div className="text-xs">{record.total_sold}</div>;
      },
    },
    {
      title: "Reviews",
      width: "15%",
      key: "review_count",
      render: (record) => {
        return <div className="text-xs">{record.review_count}</div>;
      },
    },
    {
      title: "Trạng Thái",
      width: "10%",
      key: "isPublic",
      render: (record) => {
        if (record.isPublic === false) {
          return (
            <Tag
              icon={<LockOutlined />}
              color="error"
              className="px-3 py-1 rounded-full text-xs flex items-center w-fit">
              Private
            </Tag>
          );
        } else {
          return (
            <Tag
              icon={<UnlockOutlined />}
              color="success"
              className="px-3 py-1 rounded-full text-xs flex items-center w-fit">
              Public
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
            <Tooltip title="Chỉnh sửa sản phẩm">
              <Button
                type="primary"
                shape="circle"
                icon={<EditOutlined />}
                className="flex items-center justify-center"
                style={{
                  background: "#4096ff",
                  borderColor: "#4096ff",
                }}
                onClick={() => handleEditProduct(record)}
              />
            </Tooltip>
            <Tooltip title="Xóa sản phẩm">
              <Button
                danger
                shape="circle"
                icon={<DeleteOutlined />}
                onClick={(e) => showDel(e, record._id)}
                data-id={record._id}
                data-title={record.product_title}
                data-img={record.product_image[0].url}
                className="flex items-center justify-center"
              />
            </Tooltip>
            <Dropdown
              menu={{
                items: [
                  {
                    key: "1",
                    label: "Xem trước",
                    icon: <EyeOutlined />,
                    onClick: () => showPreview(record),
                  },
                  {
                    key: "2",
                    label: record.isPublic
                      ? "Đổi sang Private"
                      : "Đổi sang Public",
                    icon: record.isPublic ? (
                      <LockOutlined />
                    ) : (
                      <UnlockOutlined />
                    ),
                    onClick: () => handleStatusChange(record),
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

  // handle Radio input
  const [value, setValue] = useState(1);
  const onChange = (e) => {
    setValue(e.target.value);
    // Reset files and URLs when switching between upload methods
    setFiles([]);
    setUploadedUrls([]);
  };

  const [valueStatus, setValueStatus] = useState(false);
  const onChangeStatus = (e) => {
    setValueStatus(e.target.value);
  };

  // Editor content
  const [content, setContent] = useState("");
  const handleContentChange = (newContent) => {
    setContent(newContent);
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      ["clean"],
      [
        { align: "" },
        { align: "center" },
        { align: "right" },
        { align: "justify" },
      ],
    ],
  };

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    getDataProducts();
  }, []);

  const [dataProducts, setdataProducts] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);

  // Simulate loading state
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const getDataProducts = async () => {
    setLoading(true);
    await getItems("seller/seller-products")
      .then((res) => {
        setMsg({
          type: res.status == 200 ? "success" : "error",
          content: res.data != undefined ? res.data.msg : res.error,
          hidden: res.data != undefined ? true : false,
        });
        setdataProducts(res.data);
        setFilteredNews(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        message.error("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      });
  };

  useEffect(() => {
    if (searchValue) {
      let filtered = dataProducts.filter(
        (news) =>
          news.product_name
            ?.toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          news.product_title?.toLowerCase().includes(searchValue.toLowerCase())
      );

      // Apply filter by status if needed
      if (filterStatus === "public") {
        filtered = filtered.filter((product) => product.isPublic === true);
      } else if (filterStatus === "private") {
        filtered = filtered.filter((product) => product.isPublic === false);
      }

      setFilteredNews(filtered);
    } else {
      // Only apply status filter when no search
      if (filterStatus === "all") {
        setFilteredNews(dataProducts);
      } else if (filterStatus === "public") {
        setFilteredNews(
          dataProducts.filter((product) => product.isPublic === true)
        );
      } else if (filterStatus === "private") {
        setFilteredNews(
          dataProducts.filter((product) => product.isPublic === false)
        );
      }
    }
  }, [searchValue, dataProducts, filterStatus]);

  // handle add news
  const [addOpen, setAddOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState([]);

  // Handle HashTag
  const [inputValue, setInputValue] = useState("");
  const [hashtags, setHashtags] = useState([]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddHashtag = (event) => {
    event.preventDefault();
    if (inputValue.trim()) {
      setHashtags([...hashtags, inputValue]);
      setInputValue("");
    }
  };

  const removeData = (index) => {
    setHashtags(hashtags.filter((el, i) => i !== index));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  // Remove file from selection
  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  // Handle URL input
  const handleUrlInput = (e) => {
    const urls = e.target.value
      .split(",")
      .map((url) => url.trim())
      .filter((url) => url);
    setUploadedUrls(urls);
  };

  // Add new state for edit mode
  const [editMode, setEditMode] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);

  // Handle edit product
  const handleEditProduct = (record) => {
    setEditMode(true);
    setCurrentProductId(record._id);

    // Populate form with product data
    reset({
      product_name: record.product_name || "",
      product_title: record.product_title || "",
      product_price: record.product_price || 0,
    });

    // Set content - use product_description field from the record
    setContent(record.product_description || "");

    // Set hashtags/categories
    setHashtags(record.product_category || []);

    // Set status
    setValueStatus(record.isPublic);

    // Handle images
    if (record.product_image && record.product_image.length > 0) {
      // If images are from URLs
      const urls = record.product_image.map((img) => img.url);
      setUploadedUrls(urls);
      setValue(2); // Switch to URL mode
    }

    // Open modal
    setAddOpen(true);
  };

  const onAddSubmit = async (data) => {
    setLoading(true);
    let allData;

    try {
      if (value === 1) {
        // Handle multiple file uploads
        const uploadPromises = files.map((file) =>
          upload(file, "Firver/Products")
        );
        const uploadedImages = await Promise.all(uploadPromises);

        const imageData = uploadedImages.map((result) => ({
          id: result.public_id,
          url: result.url,
        }));

        allData = {
          ...data,
          content: content,
          isPublic: valueStatus,
          product_category: hashtags,
          product_image:
            imageData.length > 0
              ? imageData
              : [
                  {
                    id: "default",
                    url: "https://res.cloudinary.com/daqtqvneu/image/upload/v1717214881/placeholder-image_qpqgyd.jpg",
                  },
                ],
        };
      } else {
        // Handle multiple URLs
        const urlData = uploadedUrls.map((url) => ({
          id: "external",
          url: url,
        }));

        allData = {
          ...data,
          content: content,
          isPublic: valueStatus,
          product_category: hashtags,
          product_image:
            urlData.length > 0
              ? urlData
              : [
                  {
                    id: "default",
                    url: "https://res.cloudinary.com/daqtqvneu/image/upload/v1717214881/placeholder-image_qpqgyd.jpg",
                  },
                ],
        };
      }

      // Determine if creating or updating
      if (editMode) {
        // Update existing product
        await updateItem(
          `seller/update-product/${currentProductId}`,
          allData
        ).then(async (res) => {
          await getDataProducts();
          setAddOpen(false);
          setMsg({
            type: res.status === 200 ? "success" : "error",
            content: res.data.msg || "Cập nhật sản phẩm thành công",
            hidden: false,
          });
          message[res.status === 200 ? "success" : "error"](
            res.data.msg || "Cập nhật sản phẩm thành công"
          );
          resetForm();
          setEditMode(false);
          setCurrentProductId(null);
          setLoading(false);
        });
      } else {
        // Create new product
        await addItems("seller/create-product", allData).then(async (res) => {
          await getDataProducts();
          setAddOpen(false);
          setMsg({
            type: res.status === 200 ? "success" : "error",
            content: res.data.msg || "Tạo sản phẩm thành công",
            hidden: false,
          });
          message[res.status === 200 ? "success" : "error"](
            res.data.msg || "Tạo sản phẩm thành công"
          );
          resetForm();
          setLoading(false);
        });
      }
    } catch (error) {
      console.error("Error during submission:", error);
      message.error(
        `Lỗi khi ${editMode ? "cập nhật" : "tạo"} sản phẩm. Vui lòng thử lại.`
      );
      setLoading(false);
    }
  };

  const resetForm = () => {
    reset();
    setContent("");
    setHashtags([]);
    setInputValue("");
    setValue(1);
    setValueStatus(false);
    setFiles([]);
    setUploadedUrls([]);
    setEditMode(false);
    setCurrentProductId(null);
  };

  // handle del products
  const [productID, setproductID] = useState({});

  const showDel = async (e) => {
    e.stopPropagation();
    const data = {
      _id: e.currentTarget.dataset.id,
      title: e.currentTarget.dataset.title,
      img: e.currentTarget.dataset.img,
    };

    setproductID(data);
    setDelOpen(true);
  };

  const handleDel = async () => {
    setDelOpen(false);
    setLoading(true);

    try {
      const response = await delById(`seller/delete-product/${productID._id}`);

      if (response && response.status === 200) {
        // Update local state after deletion
        const updatedData = dataProducts.filter(
          (item) => item._id !== productID._id
        );
        setdataProducts(updatedData);
        setFilteredNews(updatedData);

        message.success(
          response.data?.msg || "Sản phẩm đã được xóa thành công"
        );
      } else {
        throw new Error("Xóa sản phẩm không thành công");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error deleting product:", error);
      message.error("Không thể xóa sản phẩm. Vui lòng thử lại sau.");
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
  const publicProductsCount = dataProducts.filter(
    (product) => product.isPublic
  ).length;
  const privateProductsCount = dataProducts.filter(
    (product) => !product.isPublic
  ).length;
  const publicPercentage =
    dataProducts.length > 0
      ? Math.round((publicProductsCount / dataProducts.length) * 100)
      : 0;

  // Handle product preview
  const showPreview = (record) => {
    setSelectedProduct(record);
    setPreviewOpen(true);
  };

  // Handle status change
  const handleStatusChange = async (record) => {
    try {
      setLoading(true);
      const newStatus = !record.isPublic;

      // Make API call to update status
      await addItems(`seller/update-product-status/${record._id}`, {
        isPublic: newStatus,
      });

      // Update local state
      const updatedData = dataProducts.map((item) =>
        item._id === record._id ? { ...item, isPublic: newStatus } : item
      );

      setdataProducts(updatedData);
      setFilteredNews(updatedData);
      message.success(
        `Sản phẩm đã chuyển sang trạng thái ${newStatus ? "Public" : "Private"}`
      );
      setLoading(false);
    } catch (error) {
      console.error("Error updating status:", error);
      message.error("Không thể cập nhật trạng thái. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f5f8ff] min-h-screen">
      <Message serverMessage={serverMessage} />
      <div className="flex">
        <div className="">
          <StickyBox>
            <SideBar
              props={2}
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
                      onClick={() => getDataProducts()}
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
                  <span className="text-gray-700">Quản lý sản phẩm</span>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <Title
                      level={3}
                      className="!m-0 !text-gray-800 flex items-center gap-2">
                      <FileTextOutlined className="text-blue-500" />
                      Quản Lý Sản Phẩm
                      <Badge
                        count={dataProducts.length}
                        style={{
                          backgroundColor: "#3b82f6",
                          marginLeft: "8px",
                        }}
                        className="ml-2"
                      />
                    </Title>
                    <Text type="secondary">
                      Tạo, cập nhật và quản lý sản phẩm trên website
                    </Text>
                  </div>

                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    onClick={() => setAddOpen(true)}
                    className="mt-4 md:mt-0 bg-gradient-to-r from-blue-500 to-blue-600 border-none hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all">
                    Tạo sản phẩm
                  </Button>
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
                        <FileTextOutlined style={{ fontSize: "24px" }} />
                      </div>
                      <div>
                        <Text className="text-gray-500 text-sm">
                          Tổng sản phẩm
                        </Text>
                        <Title level={3} className="!m-0">
                          {dataProducts.length}
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
                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-500 opacity-10 rounded-full -mr-8 -mt-8"></div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-500">
                        <UnlockOutlined style={{ fontSize: "24px" }} />
                      </div>
                      <div>
                        <Text className="text-gray-500 text-sm">Public</Text>
                        <Title level={3} className="!m-0">
                          {publicProductsCount}
                        </Title>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center text-xs">
                      <Text className="text-green-500 flex items-center">
                        {publicPercentage}%{" "}
                      </Text>
                      <Text className="text-gray-400 ml-1">tổng sản phẩm</Text>
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
                        <LockOutlined style={{ fontSize: "24px" }} />
                      </div>
                      <div>
                        <Text className="text-gray-500 text-sm">Private</Text>
                        <Title level={3} className="!m-0">
                          {privateProductsCount}
                        </Title>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center text-xs">
                      <Text className="text-amber-500 flex items-center">
                        {100 - publicPercentage}%{" "}
                      </Text>
                      <Text className="text-gray-400 ml-1">tổng sản phẩm</Text>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="shadow-md rounded-xl border-none mb-6 overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div className="flex-1 w-full md:max-w-md">
                    <Search
                      placeholder="Tìm kiếm tiêu đề, mô tả..."
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
                            label: "Tất cả sản phẩm",
                            onClick: () => handleFilter("all"),
                          },
                          {
                            key: "public",
                            label: "Sản phẩm public",
                            onClick: () => handleFilter("public"),
                          },
                          {
                            key: "private",
                            label: "Sản phẩm private",
                            onClick: () => handleFilter("private"),
                          },
                        ],
                      }}>
                      <Button
                        size="large"
                        icon={<FilterOutlined />}
                        className="flex items-center">
                        {filterStatus === "all"
                          ? "Bộ lọc"
                          : filterStatus === "public"
                          ? "Public"
                          : "Private"}
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
                          {
                            key: "3",
                            label: "A-Z",
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

                {/* News table */}
                {loading ? (
                  <div className="p-4">
                    <Skeleton active paragraph={{ rows: 5 }} />
                  </div>
                ) : (
                  <Table
                    columns={columns}
                    dataSource={filteredNews}
                    rowKey="_id"
                    pagination={{
                      pageSize: 8,
                      showTotal: (total, range) =>
                        `${range[0]}-${range[1]} của ${total} tin tức`,
                      showSizeChanger: true,
                      pageSizeOptions: ["8", "16", "24"],
                    }}
                    className="news-table"
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
                                Không có tin tức nào
                              </span>
                            }
                          />
                          <div className="text-center mt-4">
                            <Button
                              type="primary"
                              icon={<PlusOutlined />}
                              onClick={() => setAddOpen(true)}
                              className="bg-blue-500">
                              Thêm sản phẩm mới
                            </Button>
                          </div>
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

      {/* Add News Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3 text-blue-600 pb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileTextOutlined style={{ fontSize: "18px" }} />
            </div>
            <span className="text-lg font-medium">
              {editMode ? "Cập nhật sản phẩm" : "Tạo sản phẩm mới"}
            </span>
          </div>
        }
        open={addOpen}
        width={1000}
        onCancel={() => {
          setAddOpen(false);
          resetForm();
        }}
        footer={null}
        centered
        bodyStyle={null}
        style={{ top: 20 }}
        destroyOnClose
        className="add-news-modal">
        <div className="modal-scrollable-content">
          <form onSubmit={handleSubmit(onAddSubmit)} className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="md:col-span-2">
                <div className="form-group">
                  <label htmlFor="title" className="form-label">
                    Tên sản phẩm
                  </label>
                  <textarea
                    rows={2}
                    type="text"
                    {...register("product_name", { required: true })}
                    placeholder="Nhập tên sản phẩm ..."
                    name="product_name"
                    id="product_name"
                    className="form-input"
                    required={true}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="form-group">
                  <label htmlFor="product_title" className="form-label">
                    Mô tả ngắn
                  </label>
                  <textarea
                    rows={3}
                    type="text"
                    {...register("product_title", { required: true })}
                    placeholder="Nhập mô tả sản phẩm ..."
                    name="product_title"
                    id="product_title"
                    className="form-input"
                    required={true}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="form-group">
                  <label htmlFor="product_price" className="form-label">
                    Giá Sản Phẩm
                  </label>
                  <input
                    type="number"
                    {...register("product_price", { required: true })}
                    placeholder="Nhập giá sản phẩm ..."
                    name="product_price"
                    id="product_price"
                    className="form-input"
                    required={true}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="form-group">
                  <label htmlFor="cover" className="form-label">
                    Ảnh Sản Phẩm
                  </label>
                  <Radio.Group
                    onChange={onChange}
                    value={value}
                    className="mb-4 flex flex-wrap gap-4">
                    <Radio value={1} className="radio-card">
                      <div className="radio-card-content">
                        <FileImageOutlined className="text-lg text-blue-500" />
                        <span>Chọn ảnh từ thiết bị</span>
                      </div>
                    </Radio>
                    <Radio value={2} className="radio-card">
                      <div className="radio-card-content">
                        <LinkOutlined className="text-lg text-blue-500" />
                        <span>Dùng URL ảnh</span>
                      </div>
                    </Radio>
                  </Radio.Group>
                  {value === 1 ? (
                    <div className="upload-container">
                      <div className="file-upload-area">
                        <input
                          onChange={handleFileChange}
                          type="file"
                          accept="image/*"
                          name="cover"
                          id="cover"
                          className="file-input-hidden"
                          multiple
                        />
                        <label htmlFor="cover" className="file-upload-label">
                          <div className="file-upload-content">
                            <FileImageOutlined className="upload-icon" />
                            <div className="upload-text">
                              <span className="upload-title">
                                Chọn nhiều ảnh
                              </span>
                              <span className="upload-desc">
                                Hoặc kéo và thả ảnh vào đây
                              </span>
                            </div>
                            <Button
                              type="primary"
                              size="small"
                              className="select-file-btn"
                              icon={<FileImageOutlined />}>
                              Chọn Files
                            </Button>
                          </div>
                        </label>
                      </div>
                      <div className="upload-preview">
                        {files.length > 0 ? (
                          <div className="upload-preview-grid">
                            {files.map((file, index) => (
                              <div key={index} className="preview-item">
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`Preview ${index + 1}`}
                                  className="preview-image"
                                />
                                <div className="preview-info">
                                  <Tooltip title={file.name}>
                                    <Text ellipsis className="file-name">
                                      {file.name}
                                    </Text>
                                  </Tooltip>
                                  <Text className="file-size">
                                    {(file.size / 1024).toFixed(1)} KB
                                  </Text>
                                  <Button
                                    type="text"
                                    danger
                                    size="small"
                                    icon={<DeleteOutlined />}
                                    onClick={() => removeFile(index)}
                                    className="remove-file-btn"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="upload-empty-preview">
                            <FileImageOutlined
                              style={{ fontSize: "32px" }}
                              className="text-gray-300"
                            />
                            <span className="mt-2 text-sm text-gray-400">
                              Xem trước ảnh
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <Input.TextArea
                        rows={3}
                        value={uploadedUrls.join(",")}
                        onChange={handleUrlInput}
                        placeholder="Nhập URLs ảnh, phân cách bằng dấu phẩy"
                        className="form-input"
                      />
                      {uploadedUrls.length > 0 && (
                        <div className="upload-preview-grid">
                          {uploadedUrls.map((url, index) => (
                            <div key={index} className="preview-item">
                              <img
                                src={url}
                                alt={`URL Preview ${index + 1}`}
                                className="preview-image"
                                onError={(e) => {
                                  e.target.src =
                                    "https://res.cloudinary.com/your-cloud-name/image/upload/v1/default-product-image.jpg";
                                }}
                              />
                              <div className="preview-info">
                                <Button
                                  type="text"
                                  danger
                                  size="small"
                                  icon={<DeleteOutlined />}
                                  onClick={() => {
                                    const newUrls = uploadedUrls.filter(
                                      (_, i) => i !== index
                                    );
                                    setUploadedUrls(newUrls);
                                  }}
                                  className="remove-file-btn"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Hashtag */}
              <div className="md:col-span-2">
                <div className="form-group">
                  <label htmlFor="hashtags" className="form-label">
                    Category
                  </label>
                  <div className="flex items-center mb-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        className="form-input pr-[100px]"
                        placeholder="Thêm category (không cần dấu #)"
                      />
                      <button
                        onClick={handleAddHashtag}
                        className="absolute right-1 top-1 bg-blue-500 text-white rounded-lg transition duration-300 hover:bg-blue-600 px-3 py-1.5 text-sm">
                        <TagsOutlined className="mr-1" /> Thêm
                      </button>
                    </div>
                  </div>
                  <div className="hashtag-container">
                    {hashtags.map((tag, index) => (
                      <Tag
                        key={index}
                        closable
                        onClose={() => removeData(index)}
                        className="hashtag-tag">
                        #{tag}
                      </Tag>
                    ))}
                    {hashtags.length === 0 && (
                      <Text type="secondary" className="text-xs italic">
                        Chưa có category nào được thêm
                      </Text>
                    )}
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="form-group">
                  <label htmlFor="content" className="form-label">
                    Nội Dung
                  </label>
                  <div className="editor-container">
                    <ReactQuill
                      modules={modules}
                      value={content}
                      onChange={handleContentChange}
                      className="news-editor"
                      placeholder="Nhập nội dung chi tiết sản phẩm..."
                      theme="snow"
                    />
                  </div>
                  {content.length < 20 && (
                    <Text
                      type="secondary"
                      className="text-xs italic mt-2 block">
                      <InfoCircleOutlined className="mr-1" /> Nội dung sản phẩm
                      nên có ít nhất 20 ký tự
                    </Text>
                  )}
                </div>
              </div>

              <div className="col-span-2">
                <div className="form-group">
                  <label htmlFor="status" className="form-label">
                    Trạng Thái
                  </label>
                  <Radio.Group
                    onChange={onChangeStatus}
                    value={valueStatus}
                    className="flex flex-wrap gap-4">
                    <Radio value={false} className="status-radio private">
                      <div className="radio-card-content">
                        <LockOutlined className="text-lg text-red-500" />
                        <span>Private</span>
                      </div>
                    </Radio>
                    <Radio value={true} className="status-radio public">
                      <div className="radio-card-content">
                        <UnlockOutlined className="text-lg text-green-500" />
                        <span>Public</span>
                      </div>
                    </Radio>
                  </Radio.Group>
                  <Text type="secondary" className="text-xs block mt-2">
                    {valueStatus
                      ? "Tin tức sẽ được hiển thị công khai trên trang web"
                      : "Tin tức sẽ được lưu nháp và không hiển thị cho người dùng"}
                  </Text>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8 pt-4 border-t">
              <Button
                onClick={() => {
                  setAddOpen(false);
                  resetForm();
                }}
                size="large"
                className="cancel-btn">
                Hủy bỏ
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="submit-btn"
                icon={<FileAddOutlined />}
                loading={loading}>
                {editMode ? "Cập nhật sản phẩm" : "Tạo sản phẩm"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Add Product Preview Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3 text-blue-600 pb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <EyeOutlined style={{ fontSize: "18px" }} />
            </div>
            <span className="text-lg font-medium">Chi tiết sản phẩm</span>
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
        className="product-preview-modal">
        {selectedProduct && (
          <div className="product-preview-content">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Images */}
              <div className="product-images">
                <div className="main-image-container mb-4">
                  {selectedProduct.product_image &&
                  selectedProduct.product_image.length > 0 ? (
                    <img
                      src={selectedProduct.product_image[0].url}
                      alt={selectedProduct.product_name}
                      className="w-full h-64 object-contain bg-gray-50 rounded-lg shadow-sm"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-64 bg-gray-50 rounded-lg">
                      <FileImageOutlined
                        style={{ fontSize: "48px", color: "#d9d9d9" }}
                      />
                    </div>
                  )}
                </div>

                {selectedProduct.product_image &&
                  selectedProduct.product_image.length > 1 && (
                    <div className="thumbnail-container grid grid-cols-4 gap-2">
                      {selectedProduct.product_image
                        .slice(0, 4)
                        .map((image, index) => (
                          <div key={index} className="thumbnail-item">
                            <img
                              src={image.url}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-16 object-cover rounded-md border border-gray-200"
                            />
                          </div>
                        ))}
                    </div>
                  )}
              </div>

              {/* Product Details */}
              <div className="product-details">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {selectedProduct.product_name}
                </h2>
                <p className="text-gray-600 mb-4">
                  {selectedProduct.product_title}
                </p>

                <div className="price-tag bg-blue-50 text-blue-700 px-4 py-2 rounded-md inline-block mb-4">
                  <span className="text-lg font-bold">
                    {selectedProduct.product_price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                </div>

                <div className="status-container mb-4">
                  <span className="text-gray-600 mr-2">Trạng thái:</span>
                  {selectedProduct.isPublic ? (
                    <Tag
                      color="success"
                      icon={<UnlockOutlined />}
                      className="px-3 py-1">
                      Public
                    </Tag>
                  ) : (
                    <Tag
                      color="error"
                      icon={<LockOutlined />}
                      className="px-3 py-1">
                      Private
                    </Tag>
                  )}
                </div>

                {selectedProduct.product_category &&
                  selectedProduct.product_category.length > 0 && (
                    <div className="categories-container mb-4">
                      <span className="text-gray-600 block mb-2">
                        Categories:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.product_category.map(
                          (category, index) => (
                            <Tag key={index} color="blue" className="px-3 py-1">
                              #{category}
                            </Tag>
                          )
                        )}
                      </div>
                    </div>
                  )}

                <Divider className="my-4" />

                <div className="actions-container">
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    className="mr-3"
                    onClick={() => {
                      handleEditProduct(selectedProduct);
                      setPreviewOpen(false);
                    }}>
                    Chỉnh sửa
                  </Button>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => {
                      setSelectedProduct(null);
                      setPreviewOpen(false);
                      setproductID({
                        _id: selectedProduct._id,
                        title: selectedProduct.product_name,
                        img: selectedProduct.product_image[0]?.url,
                      });
                      setDelOpen(true);
                    }}>
                    Xóa
                  </Button>
                </div>
              </div>
            </div>

            {/* Product Content */}
            <Divider orientation="left">Chi tiết sản phẩm</Divider>
            <div
              className="product-content mt-4 p-4 bg-white rounded-lg border border-gray-200"
              dangerouslySetInnerHTML={{
                __html: selectedProduct.product_description,
              }}
            />
          </div>
        )}
      </Modal>

      {/* Update Delete Confirmation Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-red-500">
            <ExclamationCircleOutlined />
            <span>Xác nhận xóa sản phẩm</span>
          </div>
        }
        open={delOpen}
        onOk={handleDel}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{
          danger: true,
          style: { backgroundColor: "#ff4d4f", borderColor: "#ff4d4f" },
        }}
        onCancel={() => setDelOpen(false)}
        centered
        className="delete-modal">
        <div className="py-4">
          <div className="flex items-center mb-4">
            <Avatar
              src={productID.img}
              size={48}
              shape="square"
              className="rounded-lg mr-3"
            />
            <div>
              <Text strong className="block">
                {productID.title}
              </Text>
              <Text type="secondary" className="text-xs">
                ID: {productID._id}
              </Text>
            </div>
          </div>
          <p className="text-gray-600">
            Sản phẩm này sẽ bị xóa vĩnh viễn và không thể khôi phục. Bạn có chắc
            chắn muốn tiếp tục?
          </p>
        </div>
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

        .news-table .ant-table-thead > tr > th {
          background-color: #f1f5fd !important;
          color: #4b5563 !important;
          font-weight: 600 !important;
          border-bottom: 2px solid #e5e7eb !important;
        }
        
        .news-table .ant-table {
          border-radius: 8px;
          overflow: hidden;
        }
        
        /* Form Styling */
        .form-group {
          margin-bottom: 22px;
        }
        
        .form-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          color: #374151;
        }
        
        .form-input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background-color: #f9fafb;
          transition: all 0.3s;
          font-size: 0.95rem;
        }
        
        .form-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
          background-color: #fff;
          outline: none;
        }
        
        /* Rich Text Editor */
        .editor-container {
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e5e7eb;
        }
        
        .news-editor {
          background-color: white;
        }
        
        .news-editor .ql-toolbar {
          border-top: none;
          border-left: none;
          border-right: none;
          background-color: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
          padding: 10px;
        }
        
        .news-editor .ql-container {
          font-size: 16px;
          min-height: 250px;
          max-height: 400px;
          font-family: inherit;
          border: none;
        }
        
        /* Radio Card Styling */
        .radio-card {
          margin-right: 0 !important;
        }
        
        .radio-card-content {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 8px;
        }
        
        .status-radio .radio-card-content {
          padding: 8px 16px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          transition: all 0.3s;
        }
        
        .status-radio.private .ant-radio-checked + .radio-card-content {
          background-color: #fff1f2;
          border-color: #fecdd3;
        }
        
        .status-radio.public .ant-radio-checked + .radio-card-content {
          background-color: #f0fdf4;
          border-color: #bbf7d0;
        }
        
        /* Upload Container */
        .upload-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        @media (min-width: 768px) {
          .upload-container {
            flex-direction: row;
            align-items: flex-start;
          }
          
          .file-upload-area {
            flex: 1;
          }
          
          .upload-preview {
            width: 200px;
          }
        }
        
        .file-upload-area {
          position: relative;
          width: 100%;
        }
        
        .file-input-hidden {
          position: absolute;
          width: 0;
          height: 0;
          opacity: 0;
        }
        
        .file-upload-label {
          display: block;
          cursor: pointer;
          width: 100%;
        }
        
        .file-upload-content {
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          background-color: #f9fafb;
          transition: all 0.3s;
        }
        
        .file-upload-content:hover {
          border-color: #3b82f6;
          background-color: #f0f7ff;
        }
        
        .upload-icon {
          font-size: 28px;
          color: #6b7280;
          margin-bottom: 12px;
        }
        
        .upload-text {
          margin-bottom: 16px;
        }
        
        .upload-title {
          display: block;
          font-weight: 600;
          color: #374151;
          margin-bottom: 4px;
        }
        
        .upload-desc {
          color: #6b7280;
          font-size: 0.875rem;
        }
        
        .select-file-btn {
          background: #3b82f6;
          border-color: #3b82f6;
        }
        
        .upload-preview {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
          height: 100%;
          min-height: 160px;
          display: flex;
          flex-direction: column;
        }
        
        .upload-preview-content {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        
        .upload-preview-content img {
          height: 160px;
          object-fit: cover;
        }
        
        .preview-info {
          padding: 8px 12px;
          background-color: #f9fafb;
          border-top: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
        }
        
        .file-name {
          flex: 1;
          color: #374151;
          font-size: 0.875rem;
          max-width: 120px;
        }
        
        .file-size {
          color: #6b7280;
          font-size: 0.75rem;
          margin: 0 8px;
        }
        
        .remove-file-btn {
          padding: 0 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .upload-empty-preview {
          height: 100%;
          min-height: 160px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: #f9fafb;
        }
        
        /* Hashtag Styling */
        .hashtag-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
          min-height: 32px;
          padding: 4px 0;
        }
        
        .hashtag-tag {
          padding: 4px 8px;
          background-color: #eff6ff;
          border-color: #bfdbfe;
          color: #3b82f6;
          font-size: 0.85rem;
          border-radius: 6px;
        }
        
        .hashtag-tag .anticon-close {
          color: #3b82f6;
          font-size: 10px;
        }
        
        /* Button Styling */
        .cancel-btn {
          border-color: #e5e7eb;
          color: #4b5563;
        }
        
        .submit-btn {
          background: #3b82f6;
          border-color: #3b82f6;
        }
        
        .submit-btn:hover {
          background: #2563eb;
          border-color: #2563eb;
        }
        
        /* Modal Styling */
        .add-news-modal .ant-modal-content {
          border-radius: 12px;
          overflow: hidden;
        }
        
        .add-news-modal .ant-modal-header {
          padding: 20px 24px;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .add-news-modal .ant-modal-body {
          padding-right: 20px;
          overflow-y: auto !important;
        }
        
        .add-news-modal .ant-modal-body::-webkit-scrollbar {
          width: 6px;
        }
        
        .add-news-modal .ant-modal-body::-webkit-scrollbar-track {
          background: #f5f5f5;
          border-radius: 10px;
        }
        
        .add-news-modal .ant-modal-body::-webkit-scrollbar-thumb {
          background: #d9d9d9;
          border-radius: 10px;
        }
        
        .add-news-modal .ant-modal-body::-webkit-scrollbar-thumb:hover {
          background: #bfbfbf;
        }
        
        .add-news-modal .ant-modal-content {
          max-height: 90vh;
          display: flex;
          flex-direction: column;
        }
        
        .editor-container {
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e5e7eb;
          height: auto;
        }
        
        .news-editor {
          background-color: white;
        }
        
        .news-editor .ql-container {
          font-size: 16px;
          height: 250px;
          max-height: 250px;
          overflow-y: auto;
          font-family: inherit;
          border: none;
        }
        
        @media (max-height: 800px) {
          .news-editor .ql-container {
            height: 150px;
          }
        }
        
        /* Fix for mobile scrolling */
        @media (max-width: 767px) {
          .add-news-modal .ant-modal-body {
            max-height: 70vh;
          }
          
          .news-editor .ql-container {
            height: 150px;
          }
        }
        
        /* Antd Overrides */
        .ant-radio-wrapper {
          align-items: center;
        }
        
        /* Modal Scrolling Fixes */
        .add-news-modal {
          top: 20px;
        }
        
        .add-news-modal .ant-modal-content {
          max-height: calc(100vh - 40px);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        
        .add-news-modal .ant-modal-body {
          padding: 0;
          flex: 1;
          overflow: hidden;
        }
        
        .modal-scrollable-content {
          height: 100%;
          overflow-y: auto;
          padding: 24px;
          padding-right: 20px;
        }
        
        .modal-scrollable-content::-webkit-scrollbar {
          width: 6px;
        }
        
        .modal-scrollable-content::-webkit-scrollbar-track {
          background: #f5f5f5;
          border-radius: 10px;
        }
        
        .modal-scrollable-content::-webkit-scrollbar-thumb {
          background: #d9d9d9;
          border-radius: 10px;
        }
        
        .modal-scrollable-content::-webkit-scrollbar-thumb:hover {
          background: #bfbfbf;
        }
        
        /* Editor Container */
        .editor-container {
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e5e7eb;
          height: auto;
        }
        
        .news-editor {
          background-color: white;
        }
        
        .news-editor .ql-container {
          height: 180px !important;
          overflow-y: auto;
          font-family: inherit;
          border: none;
          font-size: 15px;
        }
        
        .news-editor .ql-editor {
          min-height: 180px;
        }
        
        .news-editor .ql-toolbar {
          border-top: none;
          border-left: none;
          border-right: none;
          background-color: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
          padding: 10px;
        }
        
        /* UI Enhancement Styles */
        .ant-btn-primary {
          background-color: #3b82f6;
          border-color: #3b82f6;
        }
        
        .ant-btn-primary:hover {
          background-color: #2563eb;
          border-color: #2563eb;
        }
        
        .news-search .ant-input-affix-wrapper {
          border-radius: 8px 0 0 8px;
          border-right: none;
          border-color: #e5e7eb;
        }
        
        .news-search .ant-input-group-addon {
          background-color: #fff;
        }
        
        .news-search .ant-input-search-button {
          border-radius: 0 8px 8px 0 !important;
          overflow: hidden;
        }
        
        .card-stats {
          transition: all 0.3s ease;
        }
        
        .card-stats:hover {
          transform: translateY(-5px);
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
          background-color: #dcfce7 !important;
        }
        
        .card-stats:nth-child(2) .w-12.h-12 .text-green-500 {
          color: #16a34a !important;
        }
        
        .card-stats:nth-child(3) .w-12.h-12 {
          background-color: #fef3c7 !important;
        }
        
        .card-stats:nth-child(3) .w-12.h-12 .text-amber-500 {
          color: #d97706 !important;
        }
        
        /* More vibrant gradient for brand identity */
        .bg-gradient-to-r.from-blue-500.to-indigo-600 {
          background-image: linear-gradient(to right, #4f46e5, #4338ca) !important;
        }

        /* Style improvements for the modal */
        .add-news-modal .ant-modal-header {
          border-bottom: 1px solid #f3f4f6;
          padding-bottom: 16px;
        }
        
        .add-news-modal .form-label {
          color: #4b5563;
          font-weight: 500;
        }
        
        .add-news-modal .form-input:focus {
          border-color: #4f46e5;
          box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
        }

        /* Add these styles to your existing styles */
        .upload-preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 16px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
          max-height: 400px;
          overflow-y: auto;
        }

        .preview-item {
          position: relative;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
          background: white;
        }

        .preview-image {
          width: 100%;
          height: 120px;
          object-fit: cover;
        }

        .preview-info {
          padding: 8px;
          background: white;
          border-top: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .file-name {
          font-size: 12px;
          max-width: 100px;
        }

        .file-size {
          font-size: 10px;
          color: #6b7280;
        }

        .remove-file-btn {
          padding: 2px;
          height: auto;
        }

        /* Product Preview Modal Styles */
        .product-preview-modal .ant-modal-content {
          border-radius: 12px;
          overflow: hidden;
        }
        
        .product-preview-modal .ant-modal-header {
          padding: 20px 24px;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .product-preview-modal .product-content img {
          max-width: 100%;
          height: auto;
          margin: 8px 0;
          border-radius: 4px;
        }
        
        .main-image-container {
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
        }
        
        .main-image-container:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
        }
        
        .thumbnail-item {
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .thumbnail-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .price-tag {
          display: inline-flex;
          align-items: center;
          background: linear-gradient(to right, #e0f2fe, #f0f9ff);
          border-left: 4px solid #0ea5e9;
        }
      `}</style>
    </div>
  );
}

export default Products;
