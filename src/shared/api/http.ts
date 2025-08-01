import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const API_BASE_URL = "https://api.doclearn.ru";
// https://api.doclearn.ru/auth/register https://dl-back-756832582185.us-east1.run.app

interface RefreshRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const httpRefresh = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let getRefreshToken: () => string | null = () => null;

let onLogout: () => void = () => {};
export function configureHttp(options: {
  getRefreshToken: () => string | null;
  onLogout: () => void;
}) {
  getRefreshToken = options.getRefreshToken;
  onLogout = options.onLogout;
}

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: any) => void; reject: (error: any) => void }> = [];
const processQueue = (error: any) => {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve();
  });
  failedQueue = [];
};

http.interceptors.response.use(
  res => res,
  (err: AxiosError & { config?: RefreshRequestConfig }) => {
    const originalReq = err.config as RefreshRequestConfig;

    if (err.response?.status === 401 && !originalReq._retry) {
      originalReq._retry = true;

      const rt = getRefreshToken();
      if (!rt) {
        onLogout();
        return Promise.reject(err);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => http(originalReq));
      }
      isRefreshing = true;

      return new Promise(async (resolve, reject) => {
        try {
          const { data } = await httpRefresh.post<{ refreshToken?: string }>(
            '/auth/refresh',
            { refreshToken: rt },
            { baseURL: API_BASE_URL, withCredentials: true }
          );
          if (data.refreshToken) {
            localStorage.setItem('refreshToken', data.refreshToken);
          }
          processQueue(null);
          resolve(http(originalReq));
        } catch (refreshError) {
          processQueue(refreshError);
          onLogout();
          reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      });
    }

    return Promise.reject(err);
  }
);

export default http;
