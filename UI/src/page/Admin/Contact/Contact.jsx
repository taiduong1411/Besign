import { Layout, Table, Button, theme, Modal, Tag, notification } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import StickyBox from "react-sticky-box";
import Lenis from "lenis";
import SideBar from "../../../component/SideBar/SideBar";
import { useEffect, useState } from "react";
import { delById, addItems, getDataByParams } from "../../../utils/service";
import Message from "../../../component/Message/Message";
import EmailModal from "../../../component/EmailModal/EmailModal";
import "../../../component/EmailModal/EmailModal.css"; // Import the custom CSS file
const { Content, Header } = Layout;

function Contact() {
  // Handle message from server
  const [msg, setMsg] = useState({
    type: "",
    content: "",
    hidden: false,
  });
  const serverMessage = {
    msg,
  };
  // thay doi trang thai stuts khi gui email
  const [sendEmail, setSendEmail] = useState(false);
  //
  const [dataContact, setDataContact] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const columns = [
    {
      title: "Họ và Tên",
      render: (record) => {
        return <div className="font-bold">{record.fullname}</div>;
      },
    },
    {
      title: "Email",
      render: (record) => {
        return <div className="font-bold">{record.email}</div>;
      },
    },
    {
      title: "Phone",
      render: (record) => {
        return <div className="font-bold">{record.phone}</div>;
      },
    },
    {
      title: "Lời Nhắn",
      width: "30%",
      dataIndex: "message",
    },
    {
      title: "",
      render: (record) => {
        return (
          <div>
            <button className="p-2" onClick={showDel} data-id={record._id}>
              <img src="/icon-delete.png" alt="" width={20} height={20} />
            </button>
            <button className="p-2" onClick={() => showEmailModal(record)}>
              <img src="/icon-message.png" alt="" width={20} height={20} />
            </button>
          </div>
        );
      },
    },
    {
      title: "Status",
      render: (record) => {
        if (record.status == true) {
          return <Tag color="green">Đã phản hồi</Tag>;
        } else {
          return <Tag color="red">Chưa phản hồi</Tag>;
        }
      },
    },
  ];
  useEffect(() => {
    getDataContact();
    const lenis = new Lenis({
      duration: 3,
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
  }, [sendEmail]);
  const getDataContact = async () => {
    await getDataByParams("contact/all-contact").then((res) => {
      setDataContact(res.data);
    });
  };

  // Delete Contact
  const [contactId, setContactId] = useState([]);
  const [delOpen, setDelOpen] = useState(false);
  const showDel = async (e) => {
    const _id = e.currentTarget.dataset.id;
    setContactId(_id);
    setDelOpen(true);
  };
  const handleDel = async () => {
    setDelOpen(false);
    await delById(`contact/delete-contact/${contactId}`).then(async (res) => {
      await getDataContact();
      setMsg({
        type: res.status == 200 ? "success" : "error",
        content: res.data.msg,
        hidden: false,
      });
    });
  };

  // Email Modal
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [emailContent, setEmailContent] = useState("");
  const [currentContact, setCurrentContact] = useState(null);

  const showEmailModal = (record) => {
    setCurrentContact(record);
    setEmailModalVisible(true);
  };

  const handleSendEmail = async () => {
    // if (!currentContact) return;
    const emailData = {
      to: currentContact.email,
      subject: "Phản hồi khách hàng từ Admin Besign.",
      text: emailContent,
    };
    await addItems("admin/reply-customer-email", emailData).then((res) => {
      setEmailModalVisible(false);
      setEmailContent("");
      notification.success({
        message: "Email đã được gửi thành công",
        description: "Phản hồi của bạn đã được gửi thành công.",
      });
      setSendEmail(!sendEmail);
    });
  };

  return (
    <div>
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
                minHeight: 280,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}>
              <div>
                <div>
                  <form>
                    <div className="relative mb-8">
                      <input
                        type="search"
                        id="default-search"
                        className="block w-full p-4 pl-10 text-sm border border-gray-300 rounded-lg text-black bg-gray-50 focus:ring-blue-500 focus:border-blue-50 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Nhập tên / email / sđt để tìm kiếm"
                        required
                      />
                      <button
                        type="submit"
                        className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Search
                      </button>
                    </div>
                  </form>
                </div>
                <div>
                  <Table columns={columns} dataSource={dataContact}></Table>
                </div>
              </div>
            </Content>
          </Layout>
        </div>
      </div>
      <Modal
        title="Xoá Liên Hệ"
        open={delOpen}
        onOk={handleDel}
        okButtonProps={{ style: { backgroundColor: "red" } }}
        onCancel={() => setDelOpen(false)}>
        <div>
          <div>
            Thông tin liên hệ sẽ bị xoá và không thể khôi phục. Nhấn OK để hoàn
            thành
          </div>
        </div>
      </Modal>
      <EmailModal
        visible={emailModalVisible}
        onClose={() => setEmailModalVisible(false)}
        onSend={handleSendEmail}
        emailContent={emailContent}
        setEmailContent={setEmailContent}
        currentContact={currentContact}
      />
    </div>
  );
}

export default Contact;
