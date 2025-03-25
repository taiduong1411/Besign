import {
  Layout,
  Table,
  Button,
  theme,
  Modal,
  Tag,
  notification,
  Input,
  Typography,
  Avatar,
  Tooltip,
  Empty,
  Skeleton,
  Badge,
  Card,
  Select,
  Progress,
  Tabs,
  Dropdown,
  DatePicker,
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  DeleteOutlined,
  MailOutlined,
  ExclamationCircleOutlined,
  PhoneOutlined,
  MailFilled,
  CloseCircleOutlined,
  CheckCircleOutlined,
  ExportOutlined,
  FilterOutlined,
  CalendarOutlined,
  MoreOutlined,
  SortAscendingOutlined,
  RobotOutlined,
  TeamOutlined,
  HistoryOutlined,
  PieChartOutlined,
  UserSwitchOutlined,
  SettingOutlined,
  DownloadOutlined,
  ReloadOutlined,
  BellOutlined,
} from "@ant-design/icons";
import StickyBox from "react-sticky-box";
import Lenis from "lenis";
import SideBar from "../../../component/SideBar/SideBar";
import { useEffect, useState } from "react";
import { delById, addItems, getDataByParams } from "../../../utils/service";
import Message from "../../../component/Message/Message";
import EmailModal from "../../../component/EmailModal/EmailModal";
import "../../../component/EmailModal/EmailModal.css";
const { Content, Header } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

function Contact() {
  // Handle message from server
  const [msg] = useState({
    type: "",
    content: "",
    hidden: false,
  });
  const serverMessage = {
    msg,
  };

  const [sendEmail, setSendEmail] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [dataContact, setDataContact] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // Simulate loading state
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const onTabChange = (key) => {
    setActiveTab(key);
    if (key === "all") {
      setFilteredContacts(dataContact);
    } else if (key === "replied") {
      setFilteredContacts(dataContact.filter((contact) => contact.status));
    } else if (key === "pending") {
      setFilteredContacts(dataContact.filter((contact) => !contact.status));
    }
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  const getStringAvatar = (name) => {
    if (!name) return "";
    const nameParts = name.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`;
    }
    return name[0];
  };

  const columns = [
    {
      title: "Người Liên Hệ",
      render: (record) => {
        return (
          <div className="flex items-center gap-3">
            <Avatar
              size={40}
              style={{
                background: record.status
                  ? "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)"
                  : "linear-gradient(to right, #f78ca0 0%, #f9748f 19%, #fd868c 60%, #fe9a8b 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
              {getStringAvatar(record.fullname)}
            </Avatar>
            <div>
              <div className="font-medium text-gray-800">{record.fullname}</div>
              <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <CalendarOutlined style={{ fontSize: "10px" }} />
                {/* This is a placeholder - in a real app, you'd display the actual date */}
                {new Date().toLocaleDateString("vi-VN")}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Thông Tin Liên Hệ",
      render: (record) => {
        return (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <MailFilled
                className="text-blue-500"
                style={{ fontSize: "12px" }}
              />
              <Text className="text-gray-600">{record.email}</Text>
            </div>
            <div className="flex items-center gap-2">
              <PhoneOutlined
                className="text-green-500"
                style={{ fontSize: "12px" }}
              />
              <Text className="text-gray-600">{record.phone}</Text>
            </div>
          </div>
        );
      },
    },
    {
      title: "Lời Nhắn",
      width: "30%",
      render: (record) => {
        return (
          <div className="max-h-24 overflow-y-auto pr-2 text-gray-600 custom-scrollbar">
            {record.message}
          </div>
        );
      },
    },
    {
      title: "Trạng Thái",
      render: (record) => {
        if (record.status == true) {
          return (
            <Tag
              icon={<CheckCircleOutlined />}
              color="success"
              className="px-3 py-1 rounded-full text-xs flex items-center w-fit">
              Đã phản hồi
            </Tag>
          );
        } else {
          return (
            <Tag
              icon={<CloseCircleOutlined />}
              color="error"
              className="px-3 py-1 rounded-full text-xs flex items-center w-fit">
              Chưa phản hồi
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
            <Tooltip title="Gửi email phản hồi">
              <Button
                type="primary"
                shape="circle"
                icon={<MailOutlined />}
                onClick={() => showEmailModal(record)}
                className="flex items-center justify-center"
                style={{
                  background: record.status ? "#52c41a" : "#4096ff",
                  borderColor: record.status ? "#52c41a" : "#4096ff",
                }}
              />
            </Tooltip>
            <Tooltip title="Xóa liên hệ">
              <Button
                danger
                shape="circle"
                icon={<DeleteOutlined />}
                onClick={(e) => showDel(e, record._id)}
                className="flex items-center justify-center"
              />
            </Tooltip>
            <Dropdown
              menu={{
                items: [
                  {
                    key: "1",
                    label: "Chi tiết liên hệ",
                    icon: <UserSwitchOutlined />,
                  },
                  {
                    key: "2",
                    label: "Đánh dấu đã phản hồi",
                    icon: <CheckCircleOutlined />,
                    disabled: record.status,
                  },
                  {
                    key: "3",
                    label: "Đánh dấu chưa phản hồi",
                    icon: <CloseCircleOutlined />,
                    disabled: !record.status,
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
    getDataContact();
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
  }, [sendEmail]);

  useEffect(() => {
    if (searchValue) {
      let filtered = [];
      if (activeTab === "all") {
        filtered = dataContact.filter(
          (contact) =>
            contact.fullname
              ?.toLowerCase()
              .includes(searchValue.toLowerCase()) ||
            contact.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
            contact.phone?.includes(searchValue)
        );
      } else if (activeTab === "replied") {
        filtered = dataContact.filter(
          (contact) =>
            contact.status &&
            (contact.fullname
              ?.toLowerCase()
              .includes(searchValue.toLowerCase()) ||
              contact.email
                ?.toLowerCase()
                .includes(searchValue.toLowerCase()) ||
              contact.phone?.includes(searchValue))
        );
      } else if (activeTab === "pending") {
        filtered = dataContact.filter(
          (contact) =>
            !contact.status &&
            (contact.fullname
              ?.toLowerCase()
              .includes(searchValue.toLowerCase()) ||
              contact.email
                ?.toLowerCase()
                .includes(searchValue.toLowerCase()) ||
              contact.phone?.includes(searchValue))
        );
      }

      setFilteredContacts(filtered);
    } else {
      if (activeTab === "all") {
        setFilteredContacts(dataContact);
      } else if (activeTab === "replied") {
        setFilteredContacts(dataContact.filter((contact) => contact.status));
      } else if (activeTab === "pending") {
        setFilteredContacts(dataContact.filter((contact) => !contact.status));
      }
    }
  }, [searchValue, dataContact, activeTab]);

  const getDataContact = async () => {
    setLoading(true);
    await getDataByParams("contact/all-contact")
      .then((res) => {
        console.log(res.data);
        setDataContact(res.data);
        setFilteredContacts(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        notification.error({
          message: "Lỗi",
          description: "Không thể tải dữ liệu liên hệ. Vui lòng thử lại sau.",
        });
      });
  };

  // Delete Contact
  const [contactId, setContactId] = useState("");
  const [delOpen, setDelOpen] = useState(false);

  const showDel = async (e, id) => {
    e.stopPropagation();
    setContactId(id);
    setDelOpen(true);
  };

  const handleDel = async () => {
    setDelOpen(false);
    setLoading(true);

    await delById(`contact/delete-contact/${contactId}`)
      .then(async (res) => {
        await getDataContact();
        notification[res.status == 200 ? "success" : "error"]({
          message: res.status == 200 ? "Thành công" : "Lỗi",
          description: res.data.msg,
        });
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        notification.error({
          message: "Lỗi",
          description: "Không thể xóa liên hệ. Vui lòng thử lại sau.",
        });
      });
  };

  // Email Modal
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [emailContent, setEmailContent] = useState("");
  const [currentContact, setCurrentContact] = useState(null);
  const [sendingEmail, setSendingEmail] = useState(false);

  const showEmailModal = (record) => {
    setCurrentContact(record);
    setEmailModalVisible(true);
  };

  const handleSendEmail = async () => {
    if (!currentContact) return;
    setSendingEmail(true);

    const emailData = {
      to: currentContact.email,
      subject: "Phản hồi khách hàng từ Admin Besign.",
      text: emailContent,
    };

    await addItems("admin/reply-customer-email", emailData)
      .then(() => {
        setEmailModalVisible(false);
        setEmailContent("");
        notification.success({
          message: "Thành công",
          description: "Email phản hồi đã được gửi thành công.",
          icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
        });
        setSendEmail(!sendEmail);
        setSendingEmail(false);
      })
      .catch(() => {
        setSendingEmail(false);
        notification.error({
          message: "Lỗi",
          description: "Không thể gửi email. Vui lòng thử lại sau.",
          icon: <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
        });
      });
  };

  const handleSearch = (value) => {
    setSearchValue(value);
  };

  // Interactive progress value calculations
  const repliedPercentage =
    dataContact.length > 0
      ? Math.round(
          (dataContact.filter((contact) => contact.status).length /
            dataContact.length) *
            100
        )
      : 0;

  const pendingPercentage = 100 - repliedPercentage;

  // Time period options for filter
  const timeOptions = [
    { value: "today", label: "Hôm nay" },
    { value: "week", label: "Tuần này" },
    { value: "month", label: "Tháng này" },
    { value: "all", label: "Tất cả" },
  ];

  return (
    <div className="bg-[#f5f8ff] min-h-screen">
      <Message serverMessage={serverMessage} />
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
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                position: "sticky",
                top: 0,
                zIndex: 1,
                width: "100%",
              }}>
              <div className="flex justify-between items-center px-4">
                <div className="flex items-center">
                  <Button
                    type="text"
                    icon={
                      collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                    }
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                      fontSize: "16px",
                      width: 48,
                      height: 48,
                    }}
                  />
                  <Title level={4} className="m-0 ml-4 hidden md:block">
                    <span className="text-blue-500">Be</span>sign Admin
                  </Title>
                </div>

                <div className="flex items-center gap-4">
                  <Tooltip title="Làm mới">
                    <Button
                      type="text"
                      shape="circle"
                      icon={<ReloadOutlined />}
                      onClick={() => getDataContact()}
                      className="flex items-center justify-center"
                    />
                  </Tooltip>

                  <Tooltip title="Thông báo">
                    <Badge count={3} size="small">
                      <Button
                        type="text"
                        shape="circle"
                        icon={<BellOutlined />}
                        className="flex items-center justify-center"
                      />
                    </Badge>
                  </Tooltip>

                  <div className="flex items-center">
                    <Avatar
                      size="small"
                      src="https://i.pravatar.cc/150?img=3"
                    />
                    <Text className="ml-2 text-xs text-gray-500 hidden md:block">
                      Admin
                    </Text>
                  </div>
                </div>
              </div>
            </Header>

            <Content className="m-6 p-0">
              {/* Page title */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <Title level={3} className="!m-0 !text-gray-800">
                    Quản Lý Liên Hệ
                  </Title>
                  <Text type="secondary">
                    Quản lý và phản hồi các liên hệ từ khách hàng
                  </Text>
                </div>

                <div className="mt-4 md:mt-0 flex gap-3">
                  <Select
                    defaultValue="month"
                    style={{ width: 120 }}
                    options={timeOptions}
                    className="text-sm"
                  />

                  <RangePicker
                    format="DD/MM/YYYY"
                    className="text-sm"
                    placeholder={["Từ ngày", "Đến ngày"]}
                  />
                </div>
              </div>

              {/* Analytics cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card
                  className="shadow-sm hover:shadow-md transition-shadow rounded-xl border-none"
                  bodyStyle={{ padding: "20px" }}>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-500 mr-4">
                      <TeamOutlined style={{ fontSize: "24px" }} />
                    </div>
                    <div>
                      <Text className="text-gray-500 text-sm">
                        Tổng liên hệ
                      </Text>
                      <Title level={3} className="!m-0">
                        {dataContact.length}
                      </Title>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-xs">
                    <Text className="text-green-500">+12% </Text>
                    <Text className="text-gray-400 ml-1">
                      so với tuần trước
                    </Text>
                  </div>
                </Card>

                <Card
                  className="shadow-sm hover:shadow-md transition-shadow rounded-xl border-none"
                  bodyStyle={{ padding: "20px" }}>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-500 mr-4">
                      <CheckCircleOutlined style={{ fontSize: "24px" }} />
                    </div>
                    <div>
                      <Text className="text-gray-500 text-sm">Đã phản hồi</Text>
                      <Title level={3} className="!m-0">
                        {dataContact.filter((contact) => contact.status).length}
                      </Title>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-xs">
                    <Text className="text-green-500">
                      +{repliedPercentage}%{" "}
                    </Text>
                    <Text className="text-gray-400 ml-1">tỷ lệ phản hồi</Text>
                  </div>
                </Card>

                <Card
                  className="shadow-sm hover:shadow-md transition-shadow rounded-xl border-none"
                  bodyStyle={{ padding: "20px" }}>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-red-500 mr-4">
                      <CloseCircleOutlined style={{ fontSize: "24px" }} />
                    </div>
                    <div>
                      <Text className="text-gray-500 text-sm">
                        Chưa phản hồi
                      </Text>
                      <Title level={3} className="!m-0">
                        {
                          dataContact.filter((contact) => !contact.status)
                            .length
                        }
                      </Title>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-xs">
                    <Text
                      className={
                        pendingPercentage > 30
                          ? "text-red-500"
                          : "text-gray-500"
                      }>
                      {pendingPercentage}%{" "}
                    </Text>
                    <Text className="text-gray-400 ml-1">cần xử lý</Text>
                  </div>
                </Card>

                <Card
                  className="shadow-sm hover:shadow-md transition-shadow rounded-xl border-none"
                  bodyStyle={{ padding: "20px" }}>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-500 mr-4">
                      <HistoryOutlined style={{ fontSize: "24px" }} />
                    </div>
                    <div>
                      <Text className="text-gray-500 text-sm">
                        Thời gian phản hồi
                      </Text>
                      <Title level={3} className="!m-0">
                        2.4h
                      </Title>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-xs">
                    <Text className="text-green-500">-15% </Text>
                    <Text className="text-gray-400 ml-1">
                      so với tuần trước
                    </Text>
                  </div>
                </Card>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
                {/* Tab Navigation */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <Tabs
                    activeKey={activeTab}
                    onChange={onTabChange}
                    className="contact-tabs">
                    <TabPane tab={`Tất cả (${dataContact.length})`} key="all" />
                    <TabPane
                      tab={`Đã phản hồi (${
                        dataContact.filter((contact) => contact.status).length
                      })`}
                      key="replied"
                    />
                    <TabPane
                      tab={`Chưa phản hồi (${
                        dataContact.filter((contact) => !contact.status).length
                      })`}
                      key="pending"
                    />
                  </Tabs>

                  <div className="flex gap-3 items-center w-full md:w-auto">
                    <Search
                      placeholder="Tìm kiếm tên, email, số điện thoại..."
                      allowClear
                      enterButton={<SearchOutlined className="text-white" />}
                      size="middle"
                      className="max-w-96"
                      onChange={(e) => handleSearch(e.target.value)}
                    />

                    <Tooltip title="Lọc danh sách">
                      <Button
                        icon={<FilterOutlined />}
                        size="middle"
                        className="flex items-center justify-center"
                      />
                    </Tooltip>

                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: "1",
                            label: "Xuất tất cả dữ liệu",
                            icon: <DownloadOutlined />,
                          },
                          {
                            key: "2",
                            label: "Xuất dữ liệu đã chọn",
                            icon: <CheckCircleOutlined />,
                            disabled: !hasSelected,
                          },
                        ],
                      }}>
                      <Button
                        icon={<ExportOutlined />}
                        size="middle"
                        className="flex items-center justify-center">
                        Xuất
                      </Button>
                    </Dropdown>
                  </div>
                </div>

                {/* Response progress */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <Text className="text-gray-500">Tiến độ phản hồi</Text>
                    <Text className="text-gray-500">{repliedPercentage}%</Text>
                  </div>
                  <Progress
                    percent={repliedPercentage}
                    strokeColor="#52c41a"
                    showInfo={false}
                    className="contact-progress"
                  />
                </div>

                {/* Table actions */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    {hasSelected && (
                      <div className="flex items-center space-x-2">
                        <Text>{`Đã chọn ${selectedRowKeys.length} mục`}</Text>
                        <Button
                          type="link"
                          size="small"
                          onClick={() => setSelectedRowKeys([])}>
                          Bỏ chọn
                        </Button>
                        <Button danger size="small" icon={<DeleteOutlined />}>
                          Xóa
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Text className="text-gray-500 text-sm">Sắp xếp:</Text>
                    <Button
                      type="text"
                      icon={<SortAscendingOutlined />}
                      size="small">
                      Mới nhất
                    </Button>
                  </div>
                </div>

                {loading ? (
                  <div className="p-4">
                    <Skeleton active paragraph={{ rows: 5 }} />
                  </div>
                ) : (
                  <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={filteredContacts}
                    rowKey="_id"
                    pagination={{
                      pageSize: 8,
                      showTotal: (total, range) =>
                        `${range[0]}-${range[1]} của ${total} liên hệ`,
                      showSizeChanger: true,
                      pageSizeOptions: ["8", "16", "24"],
                    }}
                    className="contact-table"
                    rowClassName={(record) =>
                      record.status ? "bg-white" : "bg-gray-50"
                    }
                    onRow={() => ({
                      className:
                        "hover:bg-blue-50 transition-colors cursor-pointer",
                    })}
                    locale={{
                      emptyText: (
                        <Empty
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          description="Không có liên hệ nào"
                        />
                      ),
                    }}
                  />
                )}
              </div>

              {/* Quick stats cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card
                  title={
                    <div className="flex items-center gap-2">
                      <PieChartOutlined className="text-blue-500" />
                      <span>Top Liên Hệ</span>
                    </div>
                  }
                  className="shadow-sm rounded-xl border-none"
                  extra={<Button type="text" icon={<MoreOutlined />} />}>
                  {dataContact.slice(0, 3).map((contact, index) => (
                    <div
                      key={index}
                      className="flex items-center py-2 border-b last:border-b-0">
                      <Avatar
                        size={32}
                        style={{
                          background: contact.status
                            ? "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)"
                            : "linear-gradient(to right, #f78ca0 0%, #f9748f 19%, #fd868c 60%, #fe9a8b 100%)",
                        }}>
                        {getStringAvatar(contact.fullname)}
                      </Avatar>
                      <div className="ml-3">
                        <Text className="block text-sm">
                          {contact.fullname}
                        </Text>
                        <Text className="text-xs text-gray-500">
                          {contact.email}
                        </Text>
                      </div>
                      <Tag
                        color={contact.status ? "success" : "error"}
                        className="ml-auto text-xs">
                        {contact.status ? "Đã phản hồi" : "Chưa phản hồi"}
                      </Tag>
                    </div>
                  ))}
                </Card>

                <Card
                  title={
                    <div className="flex items-center gap-2">
                      <RobotOutlined className="text-purple-500" />
                      <span>Phân Tích Phản Hồi</span>
                    </div>
                  }
                  className="shadow-sm rounded-xl border-none"
                  extra={<Button type="text" icon={<MoreOutlined />} />}>
                  <div className="py-2 mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Email phản hồi</span>
                      <span className="font-medium">
                        {Math.round(repliedPercentage)}%
                      </span>
                    </div>
                    <Progress
                      percent={repliedPercentage}
                      strokeColor="#4096ff"
                      size="small"
                    />
                  </div>

                  <div className="py-2 mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Liên hệ đang chờ</span>
                      <span className="font-medium">{pendingPercentage}%</span>
                    </div>
                    <Progress
                      percent={pendingPercentage}
                      strokeColor="#ff4d4f"
                      size="small"
                    />
                  </div>

                  <div className="py-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Tỷ lệ chuyển đổi</span>
                      <span className="font-medium">76%</span>
                    </div>
                    <Progress percent={76} strokeColor="#52c41a" size="small" />
                  </div>
                </Card>

                <Card
                  title={
                    <div className="flex items-center gap-2">
                      <SettingOutlined className="text-orange-500" />
                      <span>Tác Vụ Nhanh</span>
                    </div>
                  }
                  className="shadow-sm rounded-xl border-none">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="default"
                      icon={<MailOutlined />}
                      className="flex items-center justify-center"
                      block>
                      Email hàng loạt
                    </Button>

                    <Button
                      type="default"
                      icon={<UserSwitchOutlined />}
                      className="flex items-center justify-center"
                      block>
                      Phân loại
                    </Button>

                    <Button
                      type="default"
                      icon={<ExportOutlined />}
                      className="flex items-center justify-center"
                      block>
                      Xuất dữ liệu
                    </Button>

                    <Button
                      type="default"
                      icon={<SettingOutlined />}
                      className="flex items-center justify-center"
                      block>
                      Cài đặt
                    </Button>
                  </div>
                </Card>
              </div>
            </Content>
          </Layout>
        </div>
      </div>

      {/* Delete Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-red-500">
            <ExclamationCircleOutlined />
            <span>Xác nhận xóa liên hệ</span>
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
          <p className="text-gray-600">
            Thông tin liên hệ sẽ bị xóa và không thể khôi phục. Bạn có chắc chắn
            muốn tiếp tục?
          </p>
        </div>
      </Modal>

      {/* Email Modal - You'd need to update your EmailModal component separately */}
      <EmailModal
        visible={emailModalVisible}
        onClose={() => setEmailModalVisible(false)}
        onSend={handleSendEmail}
        emailContent={emailContent}
        setEmailContent={setEmailContent}
        currentContact={currentContact}
        sendingEmail={sendingEmail}
      />

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

        .contact-table .ant-table-thead > tr > th {
          background-color: #f9fafb;
          color: #4b5563;
          font-weight: 600;
        }
        
        .contact-table .ant-table {
          border-radius: 12px;
          overflow: hidden;
        }
        
        .contact-tabs .ant-tabs-tab {
          transition: all 0.3s;
          padding: 8px 16px;
          margin: 0 8px 0 0;
        }
        
        .contact-tabs .ant-tabs-tab-active {
          background-color: rgba(24, 144, 255, 0.1);
          border-radius: 6px;
        }
        
        .contact-tabs .ant-tabs-ink-bar {
          display: none;
        }
        
        .contact-progress .ant-progress-bg {
          height: 8px !important;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}

export default Contact;
