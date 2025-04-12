import { axiosCli } from "../interceptor/axios";

export const delById = async (url) => {
  const res = await axiosCli().del(url);
  return res;
};
export const addItems = async (url, data) => {
  try {
    console.log(`[AddItems] Bắt đầu gọi API: ${url}`);

    // Get token from localStorage with correct key name
    const token = localStorage.getItem("accessToken");
    console.log(`[AddItems] Token: ${token ? "Có" : "Không"}`);

    // Log thông tin request để debug
    console.log(`[AddItems] Gửi request POST đến ${url}`, {
      hasToken: !!token,
      data: data,
    });

    // Sử dụng trực tiếp method của axiosCli() thay vì tạo client mới
    const response = await axiosCli().post(url, data);

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error(`[AddItems] Lỗi request POST ${url}:`, error);

    // Xử lý lỗi từ server
    if (error.response) {
      return {
        status: error.response.status,
        error: error.response.data,
      };
    } else if (error.request) {
      // Lỗi không nhận được phản hồi từ server
      return {
        status: 400,
        error:
          "Yêu cầu không được gửi đi hoặc không nhận được phản hồi từ server",
      };
    } else {
      // Lỗi không xác định
      return {
        status: 500,
        error: "Có lỗi không xác định",
      };
    }
  }
};
export const getItems = async (url) => {
  try {
    console.log(`[GetItems] Bắt đầu gọi API: ${url}`);

    // Get token from localStorage with correct key name
    const token = localStorage.getItem("accessToken");
    console.log(`[GetItems] Token: ${token ? "Có" : "Không"}`);

    // Thay đổi cách gọi axios, sử dụng axiosCli().get trực tiếp thay vì tạo instance
    console.log(`[GetItems] Gửi request GET đến ${url}`);

    // Sử dụng trực tiếp method của axiosCli thay vì tạo client mới và thiết lập headers
    const startTime = Date.now();
    const response = await axiosCli().get(url);
    const responseTime = Date.now() - startTime;

    console.log(
      `[GetItems] Nhận response từ ${url} sau ${responseTime}ms. Status: ${response.status}`,
      Array.isArray(response.data)
        ? `Số lượng items: ${response.data.length}`
        : "Data không phải là mảng"
    );

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error(`[GetItems] Lỗi request GET ${url}:`, error);

    let errorMessage = "Không xác định";
    let errorStatus = 500;

    // Xử lý lỗi từ server
    if (error.response) {
      console.error(
        `[GetItems] Lỗi server response: ${error.response.status}`,
        error.response.data
      );
      errorStatus = error.response.status;
      errorMessage = JSON.stringify(error.response.data);
      return {
        status: errorStatus,
        error: error.response.data,
      };
    } else if (error.request) {
      // Lỗi không nhận được phản hồi từ server
      console.error(`[GetItems] Không nhận được phản hồi: ${error.message}`);
      if (error.code === "ECONNABORTED") {
        errorMessage =
          "Timeout - Server không phản hồi trong thời gian cho phép";
      } else {
        errorMessage = "Không thể kết nối đến server";
      }
      return {
        status: errorStatus,
        error: errorMessage,
      };
    } else {
      // Lỗi không xác định
      console.error(`[GetItems] Lỗi không xác định: ${error.message}`);
      return {
        status: errorStatus,
        error: errorMessage,
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
export const patchItem = async (url, data) => {
  const res = await axiosCli().patch(url, data);
  return res;
};
