

import  axios, { type AxiosInstance } from 'axios';
import type { IApiClient } from '../../../core/application/ports/outbound/IApiClient';

export class ApiClient implements IApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = 'http://localhost:3000/api') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
  }

  async get<T>(url: string, params?: any): Promise<T> {
    try {
      const response = await this.client.get<T>(url, { params });
      return response.data;
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  }

  async post<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await this.client.post<T>(url, data);
      return response.data;
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  }

  async put<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await this.client.put<T>(url, data);
      return response.data;
    } catch (error) {
      console.error('API PUT Error:', error);
      throw error;
    }
  }

  async delete<T>(url: string): Promise<T> {
    try {
      const response = await this.client.delete<T>(url);
      return response.data;
    } catch (error) {
      console.error('API DELETE Error:', error);
      throw error;
    }
  }
}
