import React from "react";
import { Input, Button } from "antd";
import "./EmailModal.css"; // Import the custom CSS file
const { TextArea } = Input;

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
          <span className="email-modal-title">Phản hồi khách hàng</span>
          <button className="email-modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="email-modal-body">
          <p>
            <strong>To: </strong> {currentContact?.email}
          </p>
          <div className="mt-8">
            <TextArea
              rows={8}
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              placeholder="Nhập nội dung phản hồi..."
            />
          </div>
        </div>
        <div className="email-modal-footer">
          <Button type="primary" onClick={onSend} className="bg-blue-600">
            Gửi
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmailModal;
