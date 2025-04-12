import { useState, useEffect } from "react";
import { Form, Input, Button, Rate, message } from "antd";
import { StarFilled } from "@ant-design/icons";
import PropTypes from "prop-types";
import { addItems } from "../../utils/service";

const { TextArea } = Input;

function ReviewForm({ productId, onSuccess }) {
  const [form] = Form.useForm();

  const [submitting, setSubmitting] = useState(false);

  // Thêm useEffect để kiểm tra token khi component mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.warn("Không tìm thấy accessToken đăng nhập trong localStorage");
    }
  }, []);

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      const response = await addItems("reviews/create", {
        product_id: productId,
        rating: values.rating,
        review_title: values.title,
        review_content: values.content,
      });
      if (response.status === 200) {
        message.success("Đánh giá sản phẩm thành công!");
        form.resetFields();
        if (onSuccess) {
          onSuccess(response.data.review);
        }
      } else if (response.status === 401) {
        message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      } else {
        message.error(response.error?.msg || "Đã xảy ra lỗi khi gửi đánh giá");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      message.error("Có lỗi xảy ra, vui lòng thử lại sau");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="review-form-container bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Đánh giá sản phẩm</h3>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          rating: 5,
        }}>
        <Form.Item
          name="rating"
          label="Đánh giá của bạn"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn số sao đánh giá",
            },
          ]}>
          <Rate character={<StarFilled />} allowHalf />
        </Form.Item>

        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tiêu đề đánh giá",
            },
          ]}>
          <Input placeholder="Nhập tiêu đề ngắn gọn về trải nghiệm của bạn" />
        </Form.Item>

        <Form.Item
          name="content"
          label="Nội dung đánh giá"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập nội dung đánh giá",
            },
          ]}>
          <TextArea
            rows={4}
            placeholder="Chia sẻ chi tiết trải nghiệm của bạn về sản phẩm này"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
            className="bg-blue-600 hover:bg-blue-700">
            Gửi đánh giá
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

ReviewForm.propTypes = {
  productId: PropTypes.string.isRequired,
  onSuccess: PropTypes.func,
};

export default ReviewForm;
