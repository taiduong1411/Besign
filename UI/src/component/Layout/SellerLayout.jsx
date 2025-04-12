import React from "react";
import { Link } from "react-router-dom";
import { MessageOutlined } from "@ant-design/icons";

const SellerLayout = () => {
  // Thêm menu item cho Chat Management
  const chatMenuItem = {
    key: "/seller/chat",
    icon: <MessageOutlined />,
    label: <Link to="/seller/chat">Quản lý tin nhắn</Link>,
  };

  return <div>{/* Render your layout components here */}</div>;
};

export default SellerLayout;
