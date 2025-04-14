import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Image,
  Typography,
  Divider,
  Form,
  Input,
  message,
} from "antd";
import { ArrowLeftOutlined, MailOutlined } from "@ant-design/icons";
import Navbar from "../../../component/Header/Navbar";
import Footer from "../../../component/Footer/Footer";
// import axios from "../../../utils/axios";
import { addItems } from "../../../utils/service";
import { UserContext } from "../../../context/UserContext";
const { Title, Text } = Typography;

function Checkout() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { userData } = useContext(UserContext);

  // Lấy thông tin sản phẩm từ location state
  const { product, quantity = 1 } = location.state || {};

  useEffect(() => {
    if (!product) {
      navigate("/products");
    }
  }, [product, navigate]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      let data = {
        user_id: userData._id,
        email: values.email,
        productId: product._id,
        quantity: quantity,
        totalAmount: product.product_price * quantity,
      };
      // Gửi email lên server
      await addItems("/product/checkout", data).then((res) => {
        if (res.status === 200) {
          message.success(
            "Đã gửi thông tin đơn hàng thành công! Vui lòng chờ xác nhận"
          );
          navigate("/products");
        } else {
          message.error("Có lỗi xảy ra khi gửi thông tin đơn hàng");
        }
      });
    } catch (error) {
      message.error("Có lỗi xảy ra khi gửi thông tin đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          className="mb-6">
          Quay lại
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-lg">
            <div className="flex flex-col gap-6">
              <div className="w-full">
                <Image
                  src={product.product_image?.[0]?.url}
                  alt={product.product_name}
                  className="rounded-lg"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>

              <div>
                <Title level={3}>{product.product_name}</Title>
                <Text className="text-lg block mb-4">
                  {product.product_price.toLocaleString("vi-VN")} đ
                </Text>

                <Divider />

                <div className="mb-4">
                  <Text strong>Số lượng: </Text>
                  <Text>{quantity}</Text>
                </div>

                <div className="mb-4">
                  <Text strong>Tổng tiền: </Text>
                  <Text className="text-red-500 text-xl">
                    {(product.product_price * quantity).toLocaleString("vi-VN")}{" "}
                    đ
                  </Text>
                </div>
              </div>
            </div>
          </Card>

          <Card className="shadow-lg">
            <div className="text-center mb-6">
              <Title level={4}>Quét mã QR để thanh toán</Title>
              <Image
                src="/QR.jpg"
                alt="Mã QR thanh toán"
                className="mx-auto"
                style={{ width: "200px", height: "auto" }}
              />
              <Text className="block mt-2">
                Ngân hàng: Vietcombank
                <br />
                Số tài khoản: 970436 123456789
                <br />
                Chủ tài khoản: Công ty TNHH Firver
              </Text>
            </div>

            <Divider />

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              className="mt-4">
              <Form.Item
                name="email"
                label="Email của bạn"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { type: "email", message: "Email không hợp lệ" },
                ]}>
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Nhập email của bạn"
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700">
                  Xác nhận thanh toán
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Checkout;
