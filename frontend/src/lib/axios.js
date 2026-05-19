import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true, //allows to send cookies to the server
});

export default axiosInstance;
