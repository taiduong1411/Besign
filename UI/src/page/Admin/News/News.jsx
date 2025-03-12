import SideBar from "../../../component/SideBar/SideBar";
import {
  Layout,
  Table,
  Button,
  Modal,
  Tag,
  Avatar,
  Space,
  Radio,
  theme,
} from "antd";
import StickyBox from "react-sticky-box";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import upload from "../../../utils/upload";
import Message from "../../../component/Message/Message";
import { delById, addItems, getItems } from "../../../utils/service";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import Lenis from "lenis";
const { Content, Header } = Layout;

function News() {
  useEffect(() => {
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
  //
  const [dataContact, setDataContact] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const columns = [
    {
      title: "Tiêu đề",
      width: "30%",
      key: "title",
      render: (record) => {
        return (
          <div>
            <Avatar size={40} src={record.img_cover[0].url} />{" "}
            <strong className="ml-2">{record.title}</strong>
          </div>
        );
      },
    },
    {
      title: "Mô tả ngắn",
      width: "25%",
      key: "sub_content",
      render: (record) => {
        return <div className="line-clamp-3">{record.sub_content}</div>;
      },
    },
    {
      title: "Trạng Thái",
      width: "3%",
      key: "status",
      render: (record) => {
        if (record.status == false) {
          return (
            <div>
              <Tag color="red" className="flex items-center w-fit">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1"
                  viewBox="0 0 24 24"
                  width="12"
                  height="12"
                  fill="rgba(234,46,46,1)">
                  <path d="M19 10H20C20.5523 10 21 10.4477 21 11V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V11C3 10.4477 3.44772 10 4 10H5V9C5 5.13401 8.13401 2 12 2C15.866 2 19 5.13401 19 9V10ZM5 12V20H19V12H5ZM11 14H13V18H11V14ZM17 10V9C17 6.23858 14.7614 4 12 4C9.23858 4 7 6.23858 7 9V10H17Z"></path>
                </svg>
                Private
              </Tag>
            </div>
          );
        } else {
          return (
            <div>
              <Tag color="green" className="flex items-center w-fit">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1"
                  viewBox="0 0 24 24"
                  width="12"
                  height="12"
                  fill="rgba(56,159,27,1)">
                  <path d="M7 10H20C20.5523 10 21 10.4477 21 11V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V11C3 10.4477 3.44772 10 4 10H5V9C5 5.13401 8.13401 2 12 2C14.7405 2 17.1131 3.5748 18.2624 5.86882L16.4731 6.76344C15.6522 5.12486 13.9575 4 12 4C9.23858 4 7 6.23858 7 9V10ZM5 12V20H19V12H5ZM10 15H14V17H10V15Z"></path>
                </svg>
                Public
              </Tag>
            </div>
          );
        }
      },
      // ...getColumnSearchProps('status'),
    },
    {
      title: "",
      render: (record) => {
        return (
          <Space size="small" className="max-[1200px]:hidden">
            <Button
              type="danger"
              className="bg-red-500 text-white"
              data-id={record._id}
              data-title={record.title}
              data-img={record.img_cover[0].url}
              onClick={showDel}>
              Xoá
            </Button>
            <Button
              type="success"
              className="bg-green-800 text-white"
              data-id={record._id}>
              Cập Nhật
            </Button>
          </Space>
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
  //
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
  const { register, handleSubmit } = useForm();
  useEffect(() => {
    getDataNews();
  }, []);
  const [dataNews, setDataNews] = useState([]);
  const getDataNews = async () => {
    await getItems("news/all-news").then((res) => {
      setMsg({
        type: res.status == 200 ? "success" : "error",
        content: res.data != undefined ? res.data.msg : res.error,
        hidden: res.data != undefined ? true : false,
      });
      setDataNews(res.data);
    });
  };

  //
  const [addOpen, setAddOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);

  // handle add news

  const [file, setFile] = useState("");
  // Handle HashTag
  const [inputValue, setInputValue] = useState("");
  const [hashtags, setHashtags] = useState([]);
  const handleInputChange = (e) => {
    // console.log(e.target.value);
    setInputValue(e.target.value);
  };
  const handleAddHashtag = (event) => {
    event.preventDefault();
    setHashtags([...hashtags, inputValue]);
    setInputValue("");
  };
  const removeData = (index) => {
    setHashtags(hashtags.filter((el, i) => i !== index));
  };
  const onAddSubmit = async (data) => {
    if (value == 1) {
      const cloud = await upload(file, "trungduc/news");
      var allData = {
        ...data,
        content: content,
        status: valueStatus,
        hashtags: hashtags,
        img_cover: cloud
          ? { id: cloud.public_id, url: cloud.url }
          : { id: "", url: "/trungduc.png" },
      };
    } else {
      allData = {
        ...data,
        content: content,
        status: valueStatus,
        hashtags: hashtags,
        img_cover: { id: "", url: data["img_url"] },
      };
    }
    await addItems("news/create-news", allData).then(async (res) => {
      await getDataNews();
      setAddOpen(false);
      setMsg({
        type: res.status == 200 ? "success" : "error",
        content: res.data.msg,
        hidden: false,
      });
    });
  };
  // handle del news
  const [newsId, setNewsId] = useState([]);
  const showDel = async (e) => {
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
    await delById(`news/del-news-id/${newsId._id}`).then(async (res) => {
      await getDataNews();
      setDelOpen(false);
      setMsg({
        type: res.status == 200 ? "success" : "error",
        content: res.data.msg,
        hidden: false,
      });
    });
  };
  return (
    <div>
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
              }}>
              <div>
                <div>
                  <form>
                    <div className="relative mb-8">
                      <input
                        type="search"
                        id="default-search"
                        className="block w-full p-4 pl-10 text-sm border border-gray-300 rounded-lg text-black bg-gray-50 focus:ring-blue-500 focus:border-blue-50 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Tìm kiếm tin tức ..."
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
                  <Table columns={columns} dataSource={dataNews}></Table>
                </div>
                <div className="mt-2 mb-10 float-right">
                  <Button
                    className="bg-blue-500
                                         text-white flex justify-center items-center"
                    type="primary"
                    size="large"
                    onClick={() => setAddOpen(true)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2"
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="rgba(255,255,255,1)">
                      <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
                    </svg>
                    Tạo Tin Tức
                  </Button>
                </div>
              </div>
            </Content>
          </Layout>
        </div>
      </div>
      <Modal
        open={addOpen}
        width={1000}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        onCancel={() => setAddOpen(false)}>
        <form onSubmit={handleSubmit(onAddSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block mb-2 text-sm font-bold text-gray-900 dark:text-black">
              Tiêu Đề Chính
            </label>
            <textarea
              rows={4}
              type="text"
              {...register("title")}
              placeholder="Tiêu Đề Chính"
              name="title"
              id="title"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required={true}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="sub_content"
              className="block mb-2 text-sm font-bold text-gray-900 dark:text-black">
              Mô tả ngắn
            </label>
            <textarea
              rows={4}
              type="text"
              {...register("sub_content")}
              placeholder="Tiêu Đề Phụ"
              name="sub_content"
              id="sub_content"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required={true}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="cover"
              className="block mb-2 text-sm font-bold text-gray-900 dark:text-black">
              Ảnh Đại Diện
            </label>
            <Radio.Group onChange={onChange} value={value} className="mb-4">
              <Radio value={1}>Chọn ảnh từ thiết bị</Radio>
              <Radio value={2}>Link</Radio>
            </Radio.Group>
            {value && value == 1 ? (
              <input
                onChange={(e) => setFile(e.target.files[0])}
                type="file"
                name="cover"
                id="cover"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            ) : (
              <input
                type="text"
                {...register("img_url")}
                placeholder="Nhập URL Ảnh"
                name="img_url"
                id="img_url"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required={true}
              />
            )}
          </div>
          {/* Hashtag */}
          <div className="mb-6 flex justify-between items-center">
            <div className="flex">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                className="bg-gray-100 border border-gray-300 text-gray-900 sm:text-sm rounded-l-lg focus:ring-primary-600 focus:border-primary-600 p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Hash Tag"
              />
              <button
                onClick={handleAddHashtag}
                className="bg-blue-500 text-white rounded-r-lg transition duration-300 hover:bg-blue-600 px-4 py-2">
                Add
              </button>
            </div>
            <div className="ml-2">
              {hashtags.map((tag, index) => (
                <span
                  key={index}
                  onClick={() => removeData(index)}
                  className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full mr-2 mb-2">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <label
              htmlFor="sub_content"
              className="block mb-4 text-sm font-bold text-gray-900 dark:text-black">
              Nội Dung
            </label>
            <ReactQuill
              modules={modules}
              value={content}
              onChange={handleContentChange}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="sub_content"
              className="block mb-2 text-sm text-gray-900 dark:text-black font-bold">
              Trạng Thái
            </label>
            <Radio.Group
              onChange={onChangeStatus}
              value={valueStatus}
              className="mb-4">
              <Radio value={false}>Private</Radio>
              <Radio value={true}>Public</Radio>
            </Radio.Group>
          </div>
          <button
            type="submit"
            className="w-full mt-5 text-white bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-800 dark:hover:bg-primary-800 dark:focus:ring-primary-800">
            Gửi
          </button>
        </form>
      </Modal>
      <Modal
        title="Xoá Blog"
        open={delOpen}
        onOk={handleDel}
        okButtonProps={{ style: { backgroundColor: "red" } }}
        onCancel={() => setDelOpen(false)}>
        <div>
          <div className="font-bold mb-4">
            <Avatar src={newsId.img} className="mr-2" />
            {newsId.title}
          </div>
          <div>Sẽ bị xoá và không thể khôi phục</div>
        </div>
      </Modal>
    </div>
  );
}
export default News;
