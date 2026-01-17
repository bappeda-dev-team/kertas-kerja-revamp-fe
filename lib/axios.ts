import axios, { 
  AxiosInstance, 
  AxiosRequestConfig, 
  AxiosResponse, 
  AxiosError,
  InternalAxiosRequestConfig 
} from 'axios';

export interface BaseResponse<T = any> {
  status: number;
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface ErrorResponse {
  status: number;
  success: boolean;
  message: string;
  timestamp: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ErrorResponse>) => {
    if (error.response && error.response.data) {
      const apiError = error.response.data;
      console.error(`[API Error] ${apiError.message} (Status: ${apiError.status})`);
      return Promise.reject(apiError);
    }
    return Promise.reject(error);
  }
);

export const api = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<BaseResponse<T>> => {
    const res = await apiClient.get<BaseResponse<T>>(url, config);
    return res.data;
  },

  post: async <T, D = unknown>(url: string, data: D, config?: AxiosRequestConfig): Promise<BaseResponse<T>> => {
    const res = await apiClient.post<BaseResponse<T>>(url, data, config);
    return res.data;
  },

  put: async <T, D = unknown>(url: string, data: D, config?: AxiosRequestConfig): Promise<BaseResponse<T>> => {
    const res = await apiClient.put<BaseResponse<T>>(url, data, config);
    return res.data;
  },

  patch: async <T, D = unknown>(url: string, data: D, config?: AxiosRequestConfig): Promise<BaseResponse<T>> => {
    const res = await apiClient.patch<BaseResponse<T>>(url, data, config);
    return res.data;
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<BaseResponse<T>> => {
    const res = await apiClient.delete<BaseResponse<T>>(url, config);
    return res.data;
  },
};

export default apiClient;