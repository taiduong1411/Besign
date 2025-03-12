import { message } from 'antd';
import { useEffect } from 'react';


const Message = ({ serverMessage }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const msg = serverMessage.msg;
    useEffect(() => {
        if (msg.hidden == false) {
            if (msg.type === 'success') {
                messageApi.open({
                    type: 'success',
                    content: msg.content
                })
            } else if (msg.type === 'error') {
                messageApi.open({
                    type: 'error',
                    content: msg.content
                })
            } else if (msg.type === 'warning') {
                messageApi.open({
                    type: 'warning',
                    content: msg.content
                })
            }
        } else {
            messageApi.destroy();
        }
    }, [msg])

    return (
        <div>
            {contextHolder}
        </div>
    );
};

export default Message;