import axios from "axios";
import { URL_API } from "config/api";

const validateNetworkError = (error) => {
  if (error && error.message === "Network Error") {
    throw new Error("¡Ups! Algo salió mal. Intente mas tarde.");
  }
  throw error;
};

const api = axios.create({
  baseURL: URL_API,
  headers: {
    post: {
      "Content-Type": "application/json",
    },
  },
});

api.interceptors.response.use(null, validateNetworkError);

export default api;
