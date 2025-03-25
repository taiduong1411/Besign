import axios from "axios";
// import { API_URL } from "../../config.dev";
export const axiosCli = () => {
  // Create a new axios instance
  const api = axios.create({
    baseURL: "http://localhost:8080/api/",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    validateStatus: function (status) {
      return status <= 500; // Resolve only if the status code is less than 500
    },
  });

  // Add a request interceptor to add the JWT token to the authorization header
  api.interceptors.request.use(
    (config) => {
      const email = localStorage.getItem("accessToken");
      if (email) {
        config.headers.Authorization = email;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  const get = (path) => {
    return api.get(path).then((response) => response);
  };

  const post = (path, data) => {
    return api.post(path, data).then((response) => response);
  };

  const put = (path, data) => {
    return api.put(path, data).then((response) => response);
  };
  const del = (path) => {
    return api.delete(path).then((response) => response);
  };
  return {
    get,
    post,
    put,
    del,
  };
};
