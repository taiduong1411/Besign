import PropTypes from "prop-types";
import { Input, Button, Typography } from "antd";
import "./EmailModal.css"; // Import the custom CSS file
const { TextArea } = Input;
const { Title, Text } = Typography;

const EmailModal = ({
  visible,
  onClose,
  onSend,
  emailContent,
  setEmailContent,
  currentContact,
}) => {
  if (!visible) return null;

  return (
    <div className="email-modal">
      <div className="email-modal-content">
        <div className="email-modal-header">
          <Title level={4} className="email-modal-title">
            Phản hồi khách hàng
          </Title>
          <button className="email-modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="email-modal-body">
          <div className="recipient-container">
            <Text strong>Người nhận: </Text>
            <Text className="recipient-email">{currentContact?.email}</Text>
          </div>

          <div className="email-form">
            <TextArea
              rows={10}
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              placeholder="Nhập nội dung phản hồi..."
              className="email-textarea"
              autoFocus
            />
          </div>
        </div>

        <div className="email-modal-footer">
          <Button onClick={onClose} className="cancel-button">
            Hủy
          </Button>
          <Button
            type="primary"
            onClick={onSend}
            className="send-button"
            disabled={!emailContent?.trim()}>
            Gửi phản hồi
          </Button>
        </div>
      </div>
    </div>
  );
};

EmailModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSend: PropTypes.func.isRequired,
  emailContent: PropTypes.string.isRequired,
  setEmailContent: PropTypes.func.isRequired,
  currentContact: PropTypes.shape({
    email: PropTypes.string,
  }),
};

EmailModal.defaultProps = {
  currentContact: { email: "" },
};

export default EmailModal;
