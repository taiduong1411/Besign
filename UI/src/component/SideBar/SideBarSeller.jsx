import { Link } from "react-router-dom";
import { Layout, Menu, Typography, Avatar } from "antd";
const { Sider } = Layout;
import {
  LogoutOutlined,
  DashboardOutlined,
  FileTextOutlined,
  FlagOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";

function SideBarSeller({ props, collapsed, onCollapse }) {
  return (
    <div className="h-full">
      <Layout className="min-h-svh">
        <Sider
          collapsed={collapsed}
          onCollapse={onCollapse}
          breakpoint="lg"
          collapsedWidth="0"
          width={250}
          style={{
            boxShadow: "0 1px 15px rgba(0,0,0,0.1)",
            background: "linear-gradient(180deg, #001529 0%, #00182E 100%)",
            zIndex: 1000,
            overflow: "hidden",
          }}
          className="min-h-svh">
          {/* Logo Area */}
          <div
            className={`flex items-center justify-left py-5 px-4 ${
              collapsed ? "mb-0" : "mb-2"
            }`}>
            {!collapsed && (
              <div className="flex items-center justify-center">
                <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center overflow-hidden mr-3">
                  <Avatar
                    style={{
                      backgroundColor: "transparent",
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                    size={36}>
                    B
                  </Avatar>
                </div>
                <div>
                  <Typography.Title
                    level={4}
                    style={{ margin: 0, color: "#fff" }}>
                    Besign
                  </Typography.Title>
                  <Typography.Text
                    style={{ fontSize: "12px", color: "#a3b1cc" }}>
                    Seller Portal
                  </Typography.Text>
                </div>
              </div>
            )}
          </div>
          <div className="px-2">
            <Menu
              theme="dark"
              defaultSelectedKeys={[`${props}`]}
              style={{
                background: "transparent",
                borderRight: "none",
              }}
              className="sidebar-menu"
              items={[
                {
                  key: "1",
                  icon: <DashboardOutlined style={{ fontSize: "18px" }} />,
                  label: (
                    <Link
                      to="/seller/dashboard"
                      rel="noopener noreferrer"
                      className="sidebar-link">
                      Dashboard
                    </Link>
                  ),
                },
                {
                  key: "2",
                  icon: <FileTextOutlined style={{ fontSize: "18px" }} />,
                  label: (
                    <Link
                      to="/seller/products-manager"
                      rel="noopener noreferrer"
                      className="sidebar-link">
                      Quản lý sản phẩm
                    </Link>
                  ),
                },
                {
                  key: "3",
                  icon: <FlagOutlined style={{ fontSize: "18px" }} />,
                  label: (
                    <Link
                      to="/seller/customer-chat"
                      rel="noopener noreferrer"
                      className="sidebar-link">
                      Chăm sóc khách hàng
                    </Link>
                  ),
                },
                // {
                //   key: "4",
                //   icon: (
                //     <Badge count={5} size="small" offset={[5, 0]}>
                //       <TeamOutlined style={{ fontSize: "18px" }} />
                //     </Badge>
                //   ),
                //   label: (
                //     <Link
                //       to="/admin/customer-contact"
                //       rel="noopener noreferrer"
                //       className="sidebar-link">
                //       Khách hàng liên hệ
                //     </Link>
                //   ),
                // },
                {
                  type: "divider",
                  style: {
                    background: "rgba(255,255,255,0.06)",
                    margin: "12px 0",
                  },
                },
                {
                  key: "5",
                  icon: (
                    <LogoutOutlined
                      style={{ fontSize: "18px", color: "#ff4d4f" }}
                    />
                  ),
                  label: (
                    <Link
                      to="/login"
                      rel="noopener noreferrer"
                      className="sidebar-link text-red-400">
                      Logout
                    </Link>
                  ),
                  style: { marginTop: "12px" },
                },
              ]}
            />
          </div>

          {!collapsed && (
            <div className="absolute bottom-4 left-0 right-0 px-6">
              <div className="bg-[#112A45] rounded-lg p-3 text-center">
                <Typography.Text
                  style={{
                    color: "#a3b1cc",
                    fontSize: "12px",
                    display: "block",
                  }}>
                  Cần hỗ trợ?
                </Typography.Text>
                <Link
                  to=""
                  className="text-blue-400 hover:text-blue-300 text-xs font-medium transition">
                  Liên hệ với chúng tôi
                </Link>
              </div>
            </div>
          )}
        </Sider>
      </Layout>

      <style jsx="true">{`
        .sidebar-menu .ant-menu-item {
          margin: 8px 0;
          border-radius: 6px;
          height: 44px;
          line-height: 44px;
        }

        .sidebar-menu .ant-menu-item:hover {
          background-color: rgba(255, 255, 255, 0.08) !important;
        }

        .sidebar-menu .ant-menu-item-selected {
          background: linear-gradient(
            90deg,
            rgba(24, 144, 255, 0.2) 0%,
            rgba(24, 144, 255, 0) 100%
          );
          border-left: 3px solid #1890ff;
        }

        .sidebar-menu .ant-menu-item-selected .sidebar-link {
          color: #fff;
          font-weight: 500;
        }

        .sidebar-link {
          color: #a3b1cc;
          transition: all 0.3s;
        }
      `}</style>
    </div>
  );
}

// Add prop validations
SideBarSeller.propTypes = {
  props: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  collapsed: PropTypes.bool,
  onCollapse: PropTypes.func,
};

export default SideBarSeller;
