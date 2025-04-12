import { useState, useEffect } from "react";
import {
  List,
  Avatar,
  Rate,
  Divider,
  Button,
  Skeleton,
  Empty,
  Tag,
  message,
} from "antd";
import { LikeOutlined, LikeFilled } from "@ant-design/icons";
import PropTypes from "prop-types";
import { getItems } from "../../utils/service";
import moment from "moment";
import "moment/locale/vi"; // Import Vietnamese locale

function ReviewList({ productId, refreshTrigger }) {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({
    average: 0,
    total: 0,
    distribution: {},
  });
  const [loading, setLoading] = useState(true);
  const [likedReviews, setLikedReviews] = useState([]);
  const [showImageReviews, setShowImageReviews] = useState(false);

  // Set moment to use Vietnamese locale
  moment.locale("vi");

  useEffect(() => {
    fetchReviews();
  }, [productId, refreshTrigger]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await getItems(`reviews/product/${productId}`);

      if (response.status === 200) {
        setReviews(response.data.reviews);
        setSummary(response.data.summary);

        // Load liked reviews from local storage
        const storedLikes = localStorage.getItem("likedReviews");
        if (storedLikes) {
          setLikedReviews(JSON.parse(storedLikes));
        }
      } else {
        console.error("Failed to fetch reviews:", response.error);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeReview = async (reviewId) => {
    // Check if already liked
    if (likedReviews.includes(reviewId)) {
      return;
    }

    try {
      const response = await getItems(`reviews/like/${reviewId}`);

      if (response.status === 200) {
        // Update local state
        const updatedReviews = reviews.map((review) =>
          review._id === reviewId
            ? { ...review, likes: (review.likes || 0) + 1 }
            : review
        );
        setReviews(updatedReviews);

        // Save to localStorage
        const newLikedReviews = [...likedReviews, reviewId];
        setLikedReviews(newLikedReviews);
        localStorage.setItem("likedReviews", JSON.stringify(newLikedReviews));

        message.success("Cảm ơn bạn đã đánh giá");
      }
    } catch (error) {
      console.error("Error liking review:", error);
    }
  };

  const filteredReviews = showImageReviews
    ? reviews.filter((review) => review.images && review.images.length > 0)
    : reviews;

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "green";
    if (rating >= 3.5) return "cyan";
    if (rating >= 2.5) return "blue";
    if (rating >= 1.5) return "orange";
    return "red";
  };

  // Generate initial avatar
  const getInitialAvatar = (email) => {
    if (!email) return "?";
    const username = email.split("@")[0];
    return username.charAt(0).toUpperCase();
  };

  // Generate random background color
  const getAvatarColor = (email) => {
    if (!email) return "#1890ff";
    const colors = [
      "#f56a00",
      "#7265e6",
      "#ffbf00",
      "#00a2ae",
      "#1890ff",
      "#52c41a",
      "#722ed1",
      "#eb2f96",
      "#faad14",
      "#13c2c2",
    ];
    const hashCode = email
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hashCode % colors.length];
  };

  if (loading) {
    return (
      <div className="reviews-loading">
        <Skeleton active avatar paragraph={{ rows: 3 }} />
        <Divider />
        <Skeleton active avatar paragraph={{ rows: 2 }} />
        <Divider />
        <Skeleton active avatar paragraph={{ rows: 3 }} />
      </div>
    );
  }

  return (
    <div className="reviews-container">
      {/* Rating Summary */}
      <div className="rating-summary bg-white p-5 rounded-lg shadow-sm mb-6">
        <div className="flex items-center mb-4">
          <div className="text-center mr-8">
            <div className="text-4xl font-bold">
              {summary.average.toFixed(1)}
            </div>
            <Rate
              disabled
              value={summary.average}
              allowHalf
              className="text-sm"
            />
            <div className="text-gray-500 mt-1">{summary.total} đánh giá</div>
          </div>

          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center mb-1">
                <div className="w-16 text-sm">{star} sao</div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="bg-yellow-400 h-full"
                    style={{
                      width: `${
                        summary.total > 0
                          ? (summary.distribution[star] / summary.total) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <div className="w-12 text-sm text-right">
                  {summary.total > 0
                    ? Math.round(
                        (summary.distribution[star] / summary.total) * 100
                      )
                    : 0}
                  %
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {filteredReviews.length > 0 ? (
        <List
          className="bg-white rounded-lg shadow-sm"
          itemLayout="vertical"
          dataSource={filteredReviews}
          renderItem={(review) => (
            <List.Item
              key={review._id}
              actions={[
                <Button
                  key="like"
                  type="text"
                  icon={
                    likedReviews.includes(review._id) ? (
                      <LikeFilled />
                    ) : (
                      <LikeOutlined />
                    )
                  }
                  onClick={() => handleLikeReview(review._id)}
                  disabled={likedReviews.includes(review._id)}>
                  {review.likes || 0} Hữu ích
                </Button>,
              ]}>
              <List.Item.Meta
                avatar={
                  <Avatar
                    style={{
                      backgroundColor: getAvatarColor(review.email),
                    }}>
                    {getInitialAvatar(review.email)}
                  </Avatar>
                }
                title={
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">
                        {review.email.split("@")[0]}
                      </span>
                      {review.is_verified_purchase && (
                        <Tag color="green" className="ml-2 text-xs">
                          Đã mua hàng
                        </Tag>
                      )}
                    </div>
                    <span className="text-gray-500 text-sm">
                      {moment(review.createdAt).format("DD/MM/YYYY")}
                    </span>
                  </div>
                }
                description={
                  <div>
                    <Rate disabled value={review.rating} className="text-sm" />
                    <Tag color={getRatingColor(review.rating)} className="ml-2">
                      {review.rating.toFixed(1)}
                    </Tag>
                  </div>
                }
              />

              {review.review_title && (
                <h4 className="font-medium mt-2 mb-1">{review.review_title}</h4>
              )}

              <p className="text-gray-700 whitespace-pre-line">
                {review.review_content}
              </p>
            </List.Item>
          )}
          pagination={{
            pageSize: 5,
            size: "small",
            showTotal: (total) => `${total} đánh giá`,
          }}
        />
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            showImageReviews
              ? "Không có đánh giá nào kèm hình ảnh"
              : "Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!"
          }
        />
      )}
    </div>
  );
}

ReviewList.propTypes = {
  productId: PropTypes.string.isRequired,
  refreshTrigger: PropTypes.number,
};

export default ReviewList;
