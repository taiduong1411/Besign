import SideBar from "../../../component/SideBar/SideBar";
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
import { delById, addItems, getItems } from "../../../utils/service";
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

function News() {
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
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const columns = [
    {
      title: "Tiêu đề",
      width: "30%",
      key: "title",
      render: (record) => {
        return (
          <div className="flex items-center gap-3">
            <Avatar
              size={48}
              src={record.img_cover[0].url}
              shape="square"
              className="rounded-lg border border-gray-200"
            />
            <div>
              <div className="font-medium text-gray-800">{record.title}</div>
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
      key: "sub_content",
      render: (record) => {
        return (
          <div className="max-h-24 overflow-y-auto pr-2 text-gray-600 custom-scrollbar line-clamp-3">
            {record.sub_content}
          </div>
        );
      },
    },
    {
      title: "Hashtags",
      width: "15%",
      key: "hashtags",
      render: (record) => {
        if (!record.hashtags || record.hashtags.length === 0) {
          return (
            <Text type="secondary" className="text-xs">
              Không có hashtag
            </Text>
          );
        }
        return (
          <div className="flex flex-wrap gap-1">
            {record.hashtags.slice(0, 3).map((tag, index) => (
              <Tag key={index} color="blue" className="text-xs">
                {tag}
              </Tag>
            ))}
            {record.hashtags.length > 3 && (
              <Tag color="default" className="text-xs">
                +{record.hashtags.length - 3}
              </Tag>
            )}
          </div>
        );
      },
    },
    {
      title: "Trạng Thái",
      width: "10%",
      key: "status",
      render: (record) => {
        if (record.status == false) {
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
            <Tooltip title="Chỉnh sửa tin tức">
              <Button
                type="primary"
                shape="circle"
                icon={<EditOutlined />}
                className="flex items-center justify-center"
                style={{
                  background: "#4096ff",
                  borderColor: "#4096ff",
                }}
                data-id={record._id}
              />
            </Tooltip>
            <Tooltip title="Xóa tin tức">
              <Button
                danger
                shape="circle"
                icon={<DeleteOutlined />}
                onClick={(e) => showDel(e, record._id)}
                data-id={record._id}
                data-title={record.title}
                data-img={record.img_cover[0].url}
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
                  },
                  {
                    key: "2",
                    label: record.status
                      ? "Đổi sang Private"
                      : "Đổi sang Public",
                    icon: record.status ? <LockOutlined /> : <UnlockOutlined />,
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
    getDataNews();
  }, []);

  const [dataNews, setDataNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);

  // Simulate loading state
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const getDataNews = async () => {
    setLoading(true);
    await getItems("news/all-news")
      .then((res) => {
        setMsg({
          type: res.status == 200 ? "success" : "error",
          content: res.data != undefined ? res.data.msg : res.error,
          hidden: res.data != undefined ? true : false,
        });
        setDataNews(res.data);
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
      const filtered = dataNews.filter(
        (news) =>
          news.title?.toLowerCase().includes(searchValue.toLowerCase()) ||
          news.sub_content?.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredNews(filtered);
    } else {
      setFilteredNews(dataNews);
    }
  }, [searchValue, dataNews]);

  // handle add news
  const [addOpen, setAddOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [file, setFile] = useState("");

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

  const onAddSubmit = async (data) => {
    setLoading(true);
    let allData;

    if (value == 1) {
      const cloud = await upload(file, "trungduc/news");
      allData = {
        ...data,
        content: content,
        status: valueStatus,
        hashtags: hashtags,
        img_cover: cloud
          ? [{ id: cloud.public_id, url: cloud.url }]
          : [{ id: "", url: "/trungduc.png" }],
      };
    } else {
      allData = {
        ...data,
        content: content,
        status: valueStatus,
        hashtags: hashtags,
        img_cover: [{ id: "", url: data["img_url"] }],
      };
    }

    await addItems("news/create-news", allData)
      .then(async (res) => {
        await getDataNews();
        setAddOpen(false);
        setMsg({
          type: res.status == 200 ? "success" : "error",
          content: res.data.msg,
          hidden: false,
        });
        message[res.status == 200 ? "success" : "error"](res.data.msg);
        resetForm();
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        message.error("Không thể tạo tin tức. Vui lòng thử lại sau.");
      });
  };

  const resetForm = () => {
    reset();
    setContent("");
    setHashtags([]);
    setInputValue("");
    setValue(1);
    setValueStatus(false);
    setFile("");
  };

  // handle del news
  const [newsId, setNewsId] = useState({});

  const showDel = async (e) => {
    e.stopPropagation();
    const data = {
      _id: e.currentTarget.dataset.id,
      title: e.currentTarget.dataset.title,
      img: e.currentTarget.dataset.img,
    };

    setNewsId(data);
    setDelOpen(true);
  };

  const handleDel = async () => {
    setDelOpen(false);
    setLoading(true);

    await delById(`news/del-news-id/${newsId._id}`)
      .then(async (res) => {
        await getDataNews();
        setDelOpen(false);
        setMsg({
          type: res.status == 200 ? "success" : "error",
          content: res.data.msg,
          hidden: false,
        });
        message[res.status == 200 ? "success" : "error"](res.data.msg);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        message.error("Không thể xóa tin tức. Vui lòng thử lại sau.");
      });
  };

  const handleSearch = (value) => {
    setSearchValue(value);
  };

  // Statistics calculations
  const publicNewsCount = dataNews.filter((news) => news.status).length;
  const privateNewsCount = dataNews.filter((news) => !news.status).length;
  const publicPercentage =
    dataNews.length > 0
      ? Math.round((publicNewsCount / dataNews.length) * 100)
      : 0;

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
                        BeSign Admin
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
                      onClick={() => getDataNews()}
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

            <Content className="m-6 p-0">
              {/* Page title with breadcrumb */}
              <div className="mb-6">
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                  <a
                    href="/admin"
                    className="hover:text-blue-500 transition-colors">
                    Dashboard
                  </a>
                  <span className="px-1">/</span>
                  <span className="text-gray-700">Quản lý tin tức</span>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <Title
                      level={3}
                      className="!m-0 !text-gray-800 flex items-center gap-2">
                      <FileTextOutlined className="text-blue-500" />
                      Quản Lý Tin Tức
                      <Badge
                        count={dataNews.length}
                        style={{
                          backgroundColor: "#3b82f6",
                          marginLeft: "8px",
                        }}
                        className="ml-2"
                      />
                    </Title>
                    <Text type="secondary">
                      Tạo, cập nhật và quản lý tin tức trên website
                    </Text>
                  </div>

                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    onClick={() => setAddOpen(true)}
                    className="mt-4 md:mt-0 bg-gradient-to-r from-blue-500 to-blue-600 border-none hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all">
                    Tạo Tin Tức
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
                          Tổng tin tức
                        </Text>
                        <Title level={3} className="!m-0">
                          {dataNews.length}
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
                          {publicNewsCount}
                        </Title>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center text-xs">
                      <Text className="text-green-500 flex items-center">
                        {publicPercentage}%{" "}
                      </Text>
                      <Text className="text-gray-400 ml-1">tổng tin tức</Text>
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
                          {privateNewsCount}
                        </Title>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center text-xs">
                      <Text className="text-amber-500 flex items-center">
                        {100 - publicPercentage}%{" "}
                      </Text>
                      <Text className="text-gray-400 ml-1">tổng tin tức</Text>
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
                            key: "1",
                            label: "Tất cả tin tức",
                          },
                          {
                            key: "2",
                            label: "Tin tức public",
                          },
                          {
                            key: "3",
                            label: "Tin tức private",
                          },
                        ],
                      }}>
                      <Button
                        size="large"
                        icon={<FilterOutlined />}
                        className="flex items-center">
                        Bộ lọc
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
                              Thêm tin tức mới
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
            <span className="text-lg font-medium">Tạo tin tức mới</span>
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
                    Tiêu Đề Chính
                  </label>
                  <textarea
                    rows={2}
                    type="text"
                    {...register("title", { required: true })}
                    placeholder="Nhập tiêu đề chính của tin tức"
                    name="title"
                    id="title"
                    className="form-input"
                    required={true}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="form-group">
                  <label htmlFor="sub_content" className="form-label">
                    Mô tả ngắn
                  </label>
                  <textarea
                    rows={3}
                    type="text"
                    {...register("sub_content", { required: true })}
                    placeholder="Nhập mô tả ngắn gọn về tin tức"
                    name="sub_content"
                    id="sub_content"
                    className="form-input"
                    required={true}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="form-group">
                  <label htmlFor="cover" className="form-label">
                    Ảnh Đại Diện
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
                          onChange={(e) => setFile(e.target.files[0])}
                          type="file"
                          accept="image/*"
                          name="cover"
                          id="cover"
                          className="file-input-hidden"
                        />
                        <label htmlFor="cover" className="file-upload-label">
                          <div className="file-upload-content">
                            <FileImageOutlined className="upload-icon" />
                            <div className="upload-text">
                              <span className="upload-title">Chọn ảnh</span>
                              <span className="upload-desc">
                                Hoặc kéo và thả ảnh vào đây
                              </span>
                            </div>
                            <Button
                              type="primary"
                              size="small"
                              className="select-file-btn"
                              icon={<FileImageOutlined />}>
                              Chọn File
                            </Button>
                          </div>
                        </label>
                      </div>
                      <div className="upload-preview">
                        {file ? (
                          <div className="upload-preview-content">
                            <img
                              src={URL.createObjectURL(file)}
                              alt="Preview"
                              className="w-full h-full object-cover rounded-lg"
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
                                onClick={() => setFile("")}
                                className="remove-file-btn"
                              />
                            </div>
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
                    <div className="flex items-center">
                      <Input
                        type="text"
                        {...register("img_url", { required: value === 2 })}
                        placeholder="Nhập URL ảnh đại diện"
                        name="img_url"
                        id="img_url"
                        className="form-input"
                        prefix={<LinkOutlined className="text-gray-400" />}
                        required={value === 2}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Hashtag */}
              <div className="md:col-span-2">
                <div className="form-group">
                  <label htmlFor="hashtags" className="form-label">
                    Hashtags
                  </label>
                  <div className="flex items-center mb-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        className="form-input pr-[100px]"
                        placeholder="Thêm hashtag (không cần dấu #)"
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
                        Chưa có hashtag nào được thêm
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
                      placeholder="Nhập nội dung chi tiết tin tức..."
                      theme="snow"
                    />
                  </div>
                  {content.length < 20 && (
                    <Text
                      type="secondary"
                      className="text-xs italic mt-2 block">
                      <InfoCircleOutlined className="mr-1" /> Nội dung tin tức
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
                Tạo Tin Tức
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Delete News Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-red-500">
            <ExclamationCircleOutlined />
            <span>Xác nhận xóa tin tức</span>
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
              src={newsId.img}
              size={48}
              shape="square"
              className="rounded-lg mr-3"
            />
            <div>
              <Text strong className="block">
                {newsId.title}
              </Text>
              <Text type="secondary" className="text-xs">
                ID: {newsId._id}
              </Text>
            </div>
          </div>
          <p className="text-gray-600">
            Tin tức này sẽ bị xóa vĩnh viễn và không thể khôi phục. Bạn có chắc
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
      `}</style>
    </div>
  );
}

export default News;
