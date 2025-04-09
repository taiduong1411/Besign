import SideBar from "../../../component/SideBar/SideBarSeller";
import {
  Layout,
  Card,
  Row,
  Col,
  DatePicker,
  Statistic,
  Button,
  theme,
  Typography,
  Divider,
  Space,
  Tooltip as AntTooltip,
} from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  DollarOutlined,
  ProjectOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CalendarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import moment from "moment";
import CountUp from "react-countup";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Area,
  AreaChart,
} from "recharts";
import Lenis from "lenis";
import StickyBox from "react-sticky-box";

import { useEffect } from "react";
const { Content, Header } = Layout;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

function DashBoardSeller() {
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
    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
    };
  }, []);

  const [dataContact, setDataContact] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Mock data with percentage changes
  const [contacts, setContacts] = useState({
    value: 120,
    change: 12,
    isIncrease: true,
  });
  const [posts, setPosts] = useState({
    value: 45,
    change: -8,
    isIncrease: false,
  });
  const [newUsers, setNewUsers] = useState({
    value: 30,
    change: 24,
    isIncrease: true,
  });
  const [revenue, setRevenue] = useState({
    value: 5000,
    change: 18,
    isIncrease: true,
  });
  const [activeProjects, setActiveProjects] = useState({
    value: 12,
    change: 6,
    isIncrease: true,
  });

  const [dateRange, setDateRange] = useState([
    moment().startOf("month"),
    moment().endOf("month"),
  ]);

  const handleDateChange = (dates) => {
    setDateRange(dates);
    // In real app, fetch and update data based on the selected date range
  };

  // Enhanced mock data for charts
  const data = [
    { name: "Week 1", contacts: 30, posts: 10, revenue: 1000, users: 15 },
    { name: "Week 2", contacts: 20, posts: 15, revenue: 1500, users: 22 },
    { name: "Week 3", contacts: 50, posts: 20, revenue: 2000, users: 28 },
    { name: "Week 4", contacts: 20, posts: 10, revenue: 500, users: 20 },
  ];

  const pieData = [
    { name: "Liên hệ mới", value: 120, color: "#4096ff" },
    { name: "Bài viết", value: 45, color: "#9254de" },
    { name: "Người dùng mới", value: 30, color: "#36cfc9" },
    { name: "Dự án", value: 12, color: "#73d13d" },
  ];

  const formatNumber = (value) => {
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  const gradientOffset = () => {
    const dataMax = Math.max(...data.map((i) => i.revenue));
    const dataMin = Math.min(...data.map((i) => i.revenue));
    if (dataMax <= 0) {
      return 0;
    }
    if (dataMin >= 0) {
      return 1;
    }
    return dataMax / (dataMax - dataMin);
  };

  const off = gradientOffset();

  return (
    <div className="bg-gray-50">
      <div className="flex">
        <div className="">
          <StickyBox>
            <SideBar
              props={1}
              collapsed={collapsed}
              onCollapse={setCollapsed}
            />
          </StickyBox>
        </div>
        <Layout className="min-h-svh">
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              position: "sticky",
              top: 0,
              zIndex: 1,
              width: "100%",
            }}>
            <div className="flex justify-between items-center px-4">
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "16px",
                  width: 48,
                  height: 48,
                }}
              />
              <Title level={4} className="m-0 flex-1 text-center">
                Tổng Quan Hoạt Động
              </Title>
              <div></div> {/* Placeholder for balance */}
            </div>
          </Header>

          <Content
            className="m-6 p-0"
            style={{
              background: "transparent",
            }}>
            <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
              <div className="flex justify-between items-center mb-6">
                <Title level={5} className="m-0">
                  Thống Kê Hoạt Động
                </Title>
                <Space>
                  <CalendarOutlined className="text-gray-500 mr-2" />
                  <RangePicker
                    value={dateRange}
                    onChange={handleDateChange}
                    format="DD/MM/YYYY"
                    className="border-gray-300 rounded-lg"
                    placeholder={["Từ ngày", "Đến ngày"]}
                  />
                </Space>
              </div>

              <Row gutter={16}>
                {/* Stats Card 1: Contacts */}
                <Col xs={24} sm={12} lg={8} className="mb-4">
                  <Card
                    className="h-full hover:shadow-md transition-shadow duration-300 border border-gray-100 rounded-xl"
                    bodyStyle={{ padding: "20px" }}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Text type="secondary" className="text-sm">
                          Số người liên hệ
                        </Text>
                        <div className="flex items-baseline mt-1">
                          <Title level={3} className="m-0 mr-3">
                            <CountUp
                              end={contacts.value}
                              duration={2}
                              separator=","
                            />
                          </Title>
                          <div
                            className={`flex items-center ${
                              contacts.isIncrease
                                ? "text-green-500"
                                : "text-red-500"
                            }`}>
                            {contacts.isIncrease ? (
                              <ArrowUpOutlined />
                            ) : (
                              <ArrowDownOutlined />
                            )}
                            <Text
                              className={`ml-1 ${
                                contacts.isIncrease
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}>
                              {contacts.change}%
                            </Text>
                          </div>
                        </div>
                        <Text type="secondary" className="text-xs">
                          so với tháng trước
                        </Text>
                      </div>
                      <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-blue-50 text-blue-500">
                        <UserOutlined style={{ fontSize: 24 }} />
                      </div>
                    </div>

                    <div className="mt-4">
                      <ResponsiveContainer width="100%" height={60}>
                        <AreaChart
                          data={data}
                          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient
                              id="colorContacts"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1">
                              <stop
                                offset="5%"
                                stopColor="#4096ff"
                                stopOpacity={0.3}
                              />
                              <stop
                                offset="95%"
                                stopColor="#4096ff"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <Area
                            type="monotone"
                            dataKey="contacts"
                            stroke="#4096ff"
                            fillOpacity={1}
                            fill="url(#colorContacts)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </Col>

                {/* Stats Card 2: Posts */}
                <Col xs={24} sm={12} lg={8} className="mb-4">
                  <Card
                    className="h-full hover:shadow-md transition-shadow duration-300 border border-gray-100 rounded-xl"
                    bodyStyle={{ padding: "20px" }}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Text type="secondary" className="text-sm">
                          Số bài viết
                        </Text>
                        <div className="flex items-baseline mt-1">
                          <Title level={3} className="m-0 mr-3">
                            <CountUp
                              end={posts.value}
                              duration={2}
                              separator=","
                            />
                          </Title>
                          <div
                            className={`flex items-center ${
                              posts.isIncrease
                                ? "text-green-500"
                                : "text-red-500"
                            }`}>
                            {posts.isIncrease ? (
                              <ArrowUpOutlined />
                            ) : (
                              <ArrowDownOutlined />
                            )}
                            <Text
                              className={`ml-1 ${
                                posts.isIncrease
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}>
                              {Math.abs(posts.change)}%
                            </Text>
                          </div>
                        </div>
                        <Text type="secondary" className="text-xs">
                          so với tháng trước
                        </Text>
                      </div>
                      <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-purple-50 text-purple-500">
                        <FileTextOutlined style={{ fontSize: 24 }} />
                      </div>
                    </div>

                    <div className="mt-4">
                      <ResponsiveContainer width="100%" height={60}>
                        <AreaChart
                          data={data}
                          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient
                              id="colorPosts"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1">
                              <stop
                                offset="5%"
                                stopColor="#9254de"
                                stopOpacity={0.3}
                              />
                              <stop
                                offset="95%"
                                stopColor="#9254de"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <Area
                            type="monotone"
                            dataKey="posts"
                            stroke="#9254de"
                            fillOpacity={1}
                            fill="url(#colorPosts)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </Col>

                {/* Stats Card 3: New Users */}
                <Col xs={24} sm={12} lg={8} className="mb-4">
                  <Card
                    className="h-full hover:shadow-md transition-shadow duration-300 border border-gray-100 rounded-xl"
                    bodyStyle={{ padding: "20px" }}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Text type="secondary" className="text-sm">
                          Người dùng mới
                        </Text>
                        <div className="flex items-baseline mt-1">
                          <Title level={3} className="m-0 mr-3">
                            <CountUp
                              end={newUsers.value}
                              duration={2}
                              separator=","
                            />
                          </Title>
                          <div
                            className={`flex items-center ${
                              newUsers.isIncrease
                                ? "text-green-500"
                                : "text-red-500"
                            }`}>
                            {newUsers.isIncrease ? (
                              <ArrowUpOutlined />
                            ) : (
                              <ArrowDownOutlined />
                            )}
                            <Text
                              className={`ml-1 ${
                                newUsers.isIncrease
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}>
                              {newUsers.change}%
                            </Text>
                          </div>
                        </div>
                        <Text type="secondary" className="text-xs">
                          so với tháng trước
                        </Text>
                      </div>
                      <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-cyan-50 text-cyan-500">
                        <UserOutlined style={{ fontSize: 24 }} />
                      </div>
                    </div>

                    <div className="mt-4">
                      <ResponsiveContainer width="100%" height={60}>
                        <AreaChart
                          data={data}
                          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient
                              id="colorUsers"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1">
                              <stop
                                offset="5%"
                                stopColor="#36cfc9"
                                stopOpacity={0.3}
                              />
                              <stop
                                offset="95%"
                                stopColor="#36cfc9"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <Area
                            type="monotone"
                            dataKey="users"
                            stroke="#36cfc9"
                            fillOpacity={1}
                            fill="url(#colorUsers)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </Col>

                {/* Stats Card 4: Revenue */}
                <Col xs={24} sm={12} lg={12} className="mb-4">
                  <Card
                    className="h-full hover:shadow-md transition-shadow duration-300 border border-gray-100 rounded-xl"
                    bodyStyle={{ padding: "20px" }}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Text type="secondary" className="text-sm">
                          Tổng doanh thu
                        </Text>
                        <div className="flex items-baseline mt-1">
                          <Title level={3} className="m-0 mr-3">
                            <CountUp
                              end={revenue.value}
                              duration={2}
                              separator=","
                            />{" "}
                            đ
                          </Title>
                          <div
                            className={`flex items-center ${
                              revenue.isIncrease
                                ? "text-green-500"
                                : "text-red-500"
                            }`}>
                            {revenue.isIncrease ? (
                              <ArrowUpOutlined />
                            ) : (
                              <ArrowDownOutlined />
                            )}
                            <Text
                              className={`ml-1 ${
                                revenue.isIncrease
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}>
                              {revenue.change}%
                            </Text>
                          </div>
                        </div>
                        <Text type="secondary" className="text-xs">
                          so với tháng trước
                        </Text>
                      </div>
                      <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-amber-50 text-amber-500">
                        <DollarOutlined style={{ fontSize: 24 }} />
                      </div>
                    </div>

                    <div className="mt-4">
                      <ResponsiveContainer width="100%" height={60}>
                        <AreaChart
                          data={data}
                          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient
                              id="colorRevenue"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1">
                              <stop
                                offset="5%"
                                stopColor="#faad14"
                                stopOpacity={0.3}
                              />
                              <stop
                                offset="95%"
                                stopColor="#faad14"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#faad14"
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </Col>

                {/* Stats Card 5: Active Projects */}
                <Col xs={24} sm={12} lg={12} className="mb-4">
                  <Card
                    className="h-full hover:shadow-md transition-shadow duration-300 border border-gray-100 rounded-xl"
                    bodyStyle={{ padding: "20px" }}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Text type="secondary" className="text-sm">
                          Dự án đang hoạt động
                        </Text>
                        <div className="flex items-baseline mt-1">
                          <Title level={3} className="m-0 mr-3">
                            <CountUp
                              end={activeProjects.value}
                              duration={2}
                              separator=","
                            />
                          </Title>
                          <div
                            className={`flex items-center ${
                              activeProjects.isIncrease
                                ? "text-green-500"
                                : "text-red-500"
                            }`}>
                            {activeProjects.isIncrease ? (
                              <ArrowUpOutlined />
                            ) : (
                              <ArrowDownOutlined />
                            )}
                            <Text
                              className={`ml-1 ${
                                activeProjects.isIncrease
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}>
                              {activeProjects.change}%
                            </Text>
                          </div>
                        </div>
                        <Text type="secondary" className="text-xs">
                          so với tháng trước
                        </Text>
                      </div>
                      <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-green-50 text-green-500">
                        <ProjectOutlined style={{ fontSize: 24 }} />
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between">
                        <div className="text-xs text-gray-500">
                          Tiến độ dự án
                        </div>
                        <div className="text-xs font-semibold">
                          8/12 dự án đang trong tiến độ
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 overflow-hidden">
                        <div
                          className="bg-green-500 h-2.5 rounded-full"
                          style={{ width: "66%" }}></div>
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>

            {/* Charts section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Line Chart */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <Title level={5} className="m-0">
                    Thống Kê Theo Tuần
                  </Title>
                  <AntTooltip title="Biểu đồ thể hiện số liệu theo tuần trong tháng này">
                    <InfoCircleOutlined className="text-gray-400" />
                  </AntTooltip>
                </div>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart
                    data={data}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 10,
                    }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#8c8c8c" />
                    <YAxis stroke="#8c8c8c" />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow:
                          "0 3px 6px -4px rgba(0,0,0,.12), 0 6px 16px 0 rgba(0,0,0,.08)",
                        padding: "10px",
                      }}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Line
                      type="monotone"
                      dataKey="contacts"
                      name="Liên hệ"
                      stroke="#4096ff"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      animationDuration={1500}
                    />
                    <Line
                      type="monotone"
                      dataKey="users"
                      name="Người dùng"
                      stroke="#36cfc9"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      animationDuration={1500}
                    />
                    <Line
                      type="monotone"
                      dataKey="posts"
                      name="Bài viết"
                      stroke="#9254de"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      animationDuration={1500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Bar Chart */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <Title level={5} className="m-0">
                    Doanh Thu Theo Tuần
                  </Title>
                  <AntTooltip title="Biểu đồ thể hiện doanh thu theo tuần trong tháng này">
                    <InfoCircleOutlined className="text-gray-400" />
                  </AntTooltip>
                </div>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={data}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 10,
                    }}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f0f0f0"
                      vertical={false}
                    />
                    <XAxis dataKey="name" stroke="#8c8c8c" />
                    <YAxis stroke="#8c8c8c" />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow:
                          "0 3px 6px -4px rgba(0,0,0,.12), 0 6px 16px 0 rgba(0,0,0,.08)",
                        padding: "10px",
                      }}
                      formatter={(value) => [
                        `${formatNumber(value)} đ`,
                        "Doanh thu",
                      ]}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="#faad14"
                      radius={[4, 4, 0, 0]}
                      name="Doanh thu"
                      animationDuration={1500}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <Title level={5} className="m-0">
                    Phân Bổ Dữ Liệu
                  </Title>
                  <AntTooltip title="Biểu đồ thể hiện tỷ lệ giữa các loại dữ liệu">
                    <InfoCircleOutlined className="text-gray-400" />
                  </AntTooltip>
                </div>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      animationDuration={1500}>
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow:
                          "0 3px 6px -4px rgba(0,0,0,.12), 0 6px 16px 0 rgba(0,0,0,.08)",
                        padding: "10px",
                      }}
                      formatter={(value) => [formatNumber(value), ""]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Recent Activity or Additional Chart */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <Title level={5} className="m-0">
                    Hoạt Động Gần Đây
                  </Title>
                  <Button type="link" size="small">
                    Xem tất cả
                  </Button>
                </div>

                {/* Activity Timeline */}
                <div className="space-y-4">
                  {[
                    {
                      title: "Người dùng mới đăng ký",
                      time: "2 giờ trước",
                      type: "user",
                    },
                    {
                      title: "Bài viết mới được đăng",
                      time: "5 giờ trước",
                      type: "post",
                    },
                    {
                      title: "Liên hệ mới từ khách hàng",
                      time: "Hôm qua, 15:30",
                      type: "contact",
                    },
                    {
                      title: "Dự án mới được khởi tạo",
                      time: "Hôm qua, 10:15",
                      type: "project",
                    },
                    {
                      title: "Hoàn thành thanh toán",
                      time: "2 ngày trước",
                      type: "payment",
                    },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div
                        className={`
                        w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0
                        ${
                          activity.type === "user"
                            ? "bg-blue-100 text-blue-500"
                            : activity.type === "post"
                            ? "bg-purple-100 text-purple-500"
                            : activity.type === "contact"
                            ? "bg-cyan-100 text-cyan-500"
                            : activity.type === "project"
                            ? "bg-green-100 text-green-500"
                            : "bg-amber-100 text-amber-500"
                        }
                      `}>
                        {activity.type === "user" ? (
                          <UserOutlined />
                        ) : activity.type === "post" ? (
                          <FileTextOutlined />
                        ) : activity.type === "project" ? (
                          <ProjectOutlined />
                        ) : activity.type === "payment" ? (
                          <DollarOutlined />
                        ) : (
                          <UserOutlined />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{activity.title}</div>
                        <div className="text-xs text-gray-500">
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Content>
        </Layout>
      </div>
    </div>
  );
}

export default DashBoardSeller;
