import axios from "axios";
// import { API_URL } from "../../config.dev";
export const axiosCli = () => {
  const api = axios.create({
    baseURL: "http://localhost:8080/api/",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    timeout: 20000, // Tăng timeout lên 20 giây
    validateStatus: function (status) {
      return status <= 500; // Resolve only if the status code is less than 500
    },
  });

  // Add a request interceptor to add the JWT token to the authorization header
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accessToken");

      if (token) {
        // Send token directly without Bearer prefix
        config.headers.Authorization = token;
        console.log("[AxiosCli] Added token to request headers");
      } else {
        console.log("[AxiosCli] No token found to add to headers");
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor for debugging
  api.interceptors.response.use(
    (response) => {
      console.log(
        `[AxiosCli] Response from ${response.config.url}: Status ${response.status}`
      );
      return response;
    },
    (error) => {
      if (error.response) {
        console.error(
          `[AxiosCli] Response error: ${error.response.status} from ${
            error.config?.url || "unknown URL"
          }`
        );
      } else if (error.request) {
        console.error(
          `[AxiosCli] No response received for request to ${
            error.config?.url || "unknown URL"
          }`
        );
      } else {
        console.error(`[AxiosCli] Error setting up request: ${error.message}`);
      }
      return Promise.reject(error);
    }
  );

  const get = (path, config = {}) => {
    console.log(`[AxiosCli] GET request to: ${path}`);
    return api.get(path, config).then((response) => response);
  };

  const post = (path, data, config = {}) => {
    console.log(`[AxiosCli] POST request to: ${path}`);
    return api.post(path, data, config).then((response) => response);
  };

  const put = (path, data, config = {}) => {
    console.log(`[AxiosCli] PUT request to: ${path}`);
    return api.put(path, data, config).then((response) => response);
  };

  const del = (path, config = {}) => {
    console.log(`[AxiosCli] DELETE request to: ${path}`);
    return api.delete(path, config).then((response) => response);
  };

  const patch = (path, data, config = {}) => {
    console.log(`[AxiosCli] PATCH request to: ${path}`);
    return api.patch(path, data, config).then((response) => response);
  };

  return {
    get,
    post,
    put,
    del,
    patch,
  };
};
