import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api/v1",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      return Promise.reject({
        status: error.response.status,
        ...error.response.data.error,
      });
    }
    return Promise.reject(error);
  },
);

export interface ApiError {
  status: number;
  code: string;
  message: string;
  details?: { field: string; message: string }[];
}
