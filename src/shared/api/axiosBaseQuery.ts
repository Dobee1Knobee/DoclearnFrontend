import type { BaseQueryFn } from "@reduxjs/toolkit/query"
import type { AxiosRequestConfig, AxiosError } from "axios"
import http from "./http"

export interface AxiosBaseQueryArgs {
  url: string
  method?: AxiosRequestConfig["method"]
  data?: AxiosRequestConfig["data"]
  params?: AxiosRequestConfig["params"]
  headers?: AxiosRequestConfig["headers"]
}

export interface AxiosBaseQueryError {
  status?: number
  data?: any
  message?: string
}

export const axiosBaseQuery =
  ({ baseUrl }: { baseUrl?: string } = {}): BaseQueryFn<AxiosBaseQueryArgs, unknown, AxiosBaseQueryError> =>
  async ({ url, method = "GET", data, params, headers }) => {
    try {
      const config: AxiosRequestConfig = {
        url: baseUrl ? `${baseUrl}${url}` : url,
        method,
        data,
        params,
        headers,
      }

      const result = await http(config)
      return { data: result.data }
    } catch (axiosError) {
      const err = axiosError as AxiosError

      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
          message: err.message,
        },
      }
    }
  }
