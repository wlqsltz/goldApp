import Axios, {AxiosRequestConfig, AxiosInstance, Canceler} from 'axios';
import {API_URL} from './index';
import errorHandle from './errorHandle';
import store from '@/config/dva';
import {UserState} from '@/models/user';

const ERR_OK = '200';

const isHttpSuccess = (status: number) => {
  return status >= 200 && status < 300;
};

class HttpRequest {
  pending: {[key: string]: Canceler} = {};
  constructor(private baseUrl: string, private timeout = 10000 /*ms*/) {}

  // 获取axios配置
  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      timeout: this.timeout,
    };
    return config;
  }

  // 设定拦截器
  interceptors(instance: AxiosInstance) {
    // 请求拦截器
    instance.interceptors.request.use(
      config => {
        const userState = store.getState().user as UserState;
        const token = userState.token;
        const apiKeyList = userState.apiKeyList;
        const apiKeyIndex = userState.apiKeyIndex;
        let exchangeNo = '1';
        if (
          Array.isArray(apiKeyList) &&
          apiKeyList.length &&
          apiKeyList[apiKeyIndex]
        ) {
          exchangeNo = apiKeyList[apiKeyIndex].exchangeNo;
        }
        if (typeof config.data.exchangeNo === 'undefined') {
          config.data.exchangeNo = exchangeNo;
        }
        if (token) {
          config.headers.Authorization = token;
        }
        return config;
      },
      err => {
        errorHandle(err);
        return Promise.reject(err);
      },
    );

    // 响应请求的拦截器
    instance.interceptors.response.use(
      response => {
        if (isHttpSuccess(response.status)) {
          const data = response.data;
          if (data.code === ERR_OK) {
            console.log('response', data.data);
            return Promise.resolve(data.data);
          } else {
            errorHandle(response);
            return Promise.reject(response);
          }
        } else {
          errorHandle(response);
          return Promise.reject(response);
        }
      },
      err => {
        errorHandle(err);
        return Promise.reject(err);
      },
    );
  }

  // 创建实例
  request<T>(options: AxiosRequestConfig) {
    const instance = Axios.create();
    const newOptions = Object.assign(this.getInsideConfig(), options);
    this.interceptors(instance);
    return instance(newOptions) as unknown as Promise<T>;
  }

  get = <T>(url: string, data: any = {}) => {
    const options = Object.assign({
      method: 'get',
      url: url,
      params: data,
    });
    return this.request<T>(options);
  };

  post = <T>(url: string, data: any = {}) => {
    return this.request<T>({
      method: 'post',
      url: url,
      data: data,
    });
  };
}

const axios = new HttpRequest(API_URL);

export default axios;
