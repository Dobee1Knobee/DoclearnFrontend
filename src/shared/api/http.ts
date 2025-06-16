import axios, { AxiosError } from 'axios'

// https://dl-back-756832582185.us-east1.run.app/auth/register
// export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const API_BASE_URL ="https://dl-back-756832582185.us-east1.run.app";

const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

http.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    if (err.response?.status === 401) {
      return Promise.reject("Сессия истекла")
    }
    const data = err.response?.data as any
    if (data?.error) return Promise.reject(data.error)
    if (data?.message) {
      return Promise.reject(Array.isArray(data.message) ? data.message.join(", ") : data.message)
    }
    return Promise.reject(err.message || "Сетевая ошибка")
  },
)

export default http



// // src/shared/api/http.ts
// import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
// const API_BASE_URL ="https://dl-back-756832582185.us-east1.run.app";

// export const http = axios.create({
//   baseURL: process.env.API_BASE_URL,
//   withCredentials: true,
//   timeout: 10000,
// });

// // разбор document.cookie (не включает HttpOnly)
// function parseCookies(): Record<string,string> {
//   return document.cookie
//     .split('; ')
//     .filter(Boolean)
//     .reduce((acc, cookie) => {
//       const [name, ...rest] = cookie.split('=');
//       acc[name] = decodeURIComponent(rest.join('='));
//       return acc;
//     }, {} as Record<string,string>);
// }

// // === Request interceptor ===
// http.interceptors.request.use(
//   (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
//     console.groupCollapsed(`→ ${config.method?.toUpperCase()} ${config.url}`);
//     console.log('Request headers:', config.headers);
//     console.log('Request data:', config.data);
//     console.log('Document.cookie:', document.cookie);
//     console.log('Parsed cookies:', parseCookies());
//     console.groupEnd();

//     // пример добавления Authorization (если хранили токен в localStorage):
//     // const token = localStorage.getItem('accessToken');
//     // if (token) {
//     //   config.headers = config.headers || {};
//     //   config.headers.Authorization = `Bearer ${token}`;
//     // }

//     return config;
//   },
//   (error) => {
//     console.error('✖ Request error:', error);
//     return Promise.reject(error);
//   }
// );

// // === Response interceptor ===
// http.interceptors.response.use(
//   (response: AxiosResponse): AxiosResponse => {
//     console.groupCollapsed(`← ${response.status} ${response.config.url}`);
//     console.log('Response headers:', response.headers);
//     console.log('Response data:', response.data);
//     console.log('Document.cookie:', document.cookie);
//     console.log('Parsed cookies:', parseCookies());
//     console.groupEnd();
//     return response;
//   },
//   (error) => {
//     if (error.response) {
//       console.groupCollapsed(`✖ ${error.response.status} ${error.config.url}`);
//       console.log('Error response headers:', error.response.headers);
//       console.log('Error response data:', error.response.data);
//       console.log('Document.cookie:', document.cookie);
//       console.log('Parsed cookies:', parseCookies());
//       console.groupEnd();
//     } else {
//       console.error('✖ Network / CORS error:', error);
//     }
//     return Promise.reject(error);
//   }
// );
