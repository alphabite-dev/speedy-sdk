import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { EcontAPIError, EcontAuthenticationError, EcontNetworkError, EcontRateLimitError } from "./errors";
import { DEFAULT_TIMEOUT, SDK_VERSION } from "../constants";

export interface HttpClientConfig {
  baseURL: string;
  username: string;
  password: string;
  timeout?: number;
  maxRetries?: number;
}

export class HttpClient {
  private client: AxiosInstance;

  constructor(config: HttpClientConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || DEFAULT_TIMEOUT,
      auth: {
        username: config.username,
        password: config.password,
      },
      headers: {
        "Content-Type": "application/json",
        "User-Agent": `econt-sdk/${SDK_VERSION}`,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        if (axios.isAxiosError(error)) {
          const statusCode = error.response?.status;

          // Handle specific HTTP status codes
          if (statusCode === 401 || statusCode === 403) {
            throw new EcontAuthenticationError();
          }

          if (statusCode === 429) {
            const retryAfter = error.response?.headers["retry-after"];
            throw new EcontRateLimitError("Rate limit exceeded", retryAfter ? parseInt(retryAfter) : undefined);
          }

          // Handle network errors
          if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
            throw new EcontNetworkError("Request timeout");
          }

          if (!error.response) {
            throw new EcontNetworkError("Network error - no response received");
          }

          // Convert to EcontAPIError
          throw EcontAPIError.fromAxiosError(error);
        }

        throw error;
      }
    );
  }

  async request<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.request<T>(config);
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  async patch<T>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }
}
