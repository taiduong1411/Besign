import SideBar from "../../../component/SideBar/SideBar";
import {
  Layout,
  Card,
  Row,
  Col,
  DatePicker,
  Statistic,
  Button,
  theme,
} from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  DollarOutlined,
  ProjectOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
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
} from "recharts";
import Lenis from "lenis";
import StickyBox from "react-sticky-box";

import { useEffect } from "react";
const { Content, Header } = Layout;
const { RangePicker } = DatePicker;

function DashBoard() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "both",
      smooth: true,
      smoothTouch: true,
      touchMultiplier: 2,
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

  //
  const [dataContact, setDataContact] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  //
  const [contacts, setContacts] = useState(120); // Mock data for contacts
  const [posts, setPosts] = useState(45); // Mock data for posts
  const [newUsers, setNewUsers] = useState(30); // Mock data for new users
  const [revenue, setRevenue] = useState(5000); // Mock data for revenue
  const [activeProjects, setActiveProjects] = useState(12); // Mock data for active projects
  const [dateRange, setDateRange] = useState([
    moment().startOf("month"),
    moment().endOf("month"),
  ]);

  const handleDateChange = (dates) => {
    setDateRange(dates);
    // Fetch and update data based on the selected date range
    // For now, we'll just use mock data
    setContacts(120); // Update with actual data
    setPosts(45); // Update with actual data
    setNewUsers(30); // Update with actual data
    setRevenue(5000); // Update with actual data
    setActiveProjects(12); // Update with actual data
  };

  // Mock data for charts
  const data = [
    { name: "Week 1", contacts: 30, posts: 10, revenue: 1000 },
    { name: "Week 2", contacts: 20, posts: 15, revenue: 1500 },
    { name: "Week 3", contacts: 50, posts: 20, revenue: 2000 },
    { name: "Week 4", contacts: 20, posts: 10, revenue: 500 },
  ];

  const pieData = [
    { name: "Contacts", value: 120 },
    { name: "Posts", value: 45 },
    { name: "New Users", value: 30 },
    { name: "Revenue", value: 5000 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div>
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
            }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
          </Header>
          <Content
            style={{
              margin: "24px 16px 0",
              padding: 24,
              background: "#fff",
            }}>
            <div>
              <div style={{ marginBottom: 16 }}>
                <RangePicker
                  value={dateRange}
                  onChange={handleDateChange}
                  format="YYYY-MM-DD"
                />
              </div>
              <Row gutter={16}>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title="Số người liên hệ"
                      value={contacts}
                      valueStyle={{ color: "#3f8600" }}
                      prefix={<UserOutlined />}
                      suffix="người"
                      formatter={(value) => (
                        <CountUp end={value} duration={2} />
                      )}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title="Số bài viết trong tháng"
                      value={posts}
                      valueStyle={{ color: "#cf1322" }}
                      prefix={<FileTextOutlined />}
                      suffix="bài"
                      formatter={(value) => (
                        <CountUp end={value} duration={2} />
                      )}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title="Người dùng mới"
                      value={newUsers}
                      valueStyle={{ color: "#1890ff" }}
                      prefix={<UserOutlined />}
                      suffix="người"
                      formatter={(value) => (
                        <CountUp end={value} duration={2} />
                      )}
                    />
                  </Card>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={12}>
                  <Card>
                    <Statistic
                      title="Tổng doanh thu"
                      value={revenue}
                      valueStyle={{ color: "#faad14" }}
                      prefix={<DollarOutlined />}
                      formatter={(value) => (
                        <CountUp end={value} duration={2} />
                      )}
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card>
                    <Statistic
                      title="Dự án đang hoạt động"
                      value={activeProjects}
                      valueStyle={{ color: "#722ed1" }}
                      prefix={<ProjectOutlined />}
                      suffix="dự án"
                      formatter={(value) => (
                        <CountUp end={value} duration={2} />
                      )}
                    />
                  </Card>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={24}>
                  <Card title="Biểu đồ liên hệ và bài viết">
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart
                        data={data}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="contacts"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                          animationDuration={2000}
                        />
                        <Line
                          type="monotone"
                          dataKey="posts"
                          stroke="#82ca9d"
                          animationDuration={2000}
                        />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="#faad14"
                          animationDuration={2000}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={12}>
                  <Card title="Biểu đồ tròn">
                    <ResponsiveContainer width="100%" height={400}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                          animationDuration={2000}>
                          {pieData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="Biểu đồ cột">
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart
                        data={data}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="contacts"
                          fill="#8884d8"
                          animationDuration={2000}
                        />
                        <Bar
                          dataKey="posts"
                          fill="#82ca9d"
                          animationDuration={2000}
                        />
                        <Bar
                          dataKey="revenue"
                          fill="#faad14"
                          animationDuration={2000}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
              </Row>
            </div>
          </Content>
        </Layout>
      </div>
    </div>
  );
}

export default DashBoard;
