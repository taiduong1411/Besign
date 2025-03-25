import { axiosCli } from "../interceptor/axios";

export const delById = async (url) => {
  const res = await axiosCli().del(url);
  return res;
};
export const addItems = async (url, data) => {
  try {
    const response = await axiosCli().post(url, data);
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    // Xử lý khi có lỗi từ phía server
    if (error.response) {
      return {
        status: error.response.status,
        error: error.response.data, // Đưa thông tin lỗi từ server vào phản hồi
      };
    } else if (error.request) {
      // Xử lý khi yêu cầu không được gửi đi hoặc không nhận được phản hồi từ server

      return {
        status: 400, // Lỗi từ phía client
        error:
          "Yêu cầu không được gửi đi hoặc không nhận được phản hồi từ server",
      };
    } else {
      // Xử lý khi có lỗi khác xảy ra
      return {
        status: 500, // Lỗi từ phía client
        error: "Có lỗi không xác định",
      };
    }
  }
};
export const getItems = async (url) => {
  try {
    const response = await axiosCli().get(url);
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    // Xử lý khi có lỗi từ phía server
    if (error.response) {
      return {
        status: error.response.status,
        error: error.response.data, // Đưa thông tin lỗi từ server vào phản hồi
      };
    } else if (error.request) {
      // Xử lý khi yêu cầu không được gửi đi hoặc không nhận được phản hồi từ server

      return {
        status: 500, // Lỗi từ phía client
        error:
          "Yêu cầu không được gửi đi hoặc không nhận được phản hồi từ server",
      };
    } else {
      // Xử lý khi có lỗi khác xảy ra
      return {
        status: 500, // Lỗi từ phía client
        error: "Có lỗi không xác định",
      };
    }
  }
};
export const getDataByParams = async (url) => {
  const res = await axiosCli().get(url);
  return res;
};
export const updateItem = async (url, data) => {
  const res = await axiosCli().put(url, data);
  return res;
};
