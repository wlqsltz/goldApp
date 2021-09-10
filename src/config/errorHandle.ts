// import { message } from 'antd';
import store from '@/config/dva';
import {toast} from '../utils';
// import { StoreToken } from './storage';

// 接口返回的errorCode是否表示超时
const isTimeout = (errorCode: string) => {
  // timeout
  if (errorCode === '4') {
    return true;
  }
  // token 过期
  if (errorCode === 'A50003') {
    return true;
  }
  // token 错误
  if (errorCode === '300000') {
    return true;
  }
  // 用户认证失败
  if (errorCode === 'A50004') {
    return true;
  }
};

const _goLoginPage = (() => {
  // 跳转到登录页面
  let flag = false;
  return (msg?: string) => {
    if (msg) {
      toast(msg);
    }
    // 因为可能同时多个接口报登录失效，跳转登录页。这里增加flag变量和500ms的延迟，防止连续多次跳转登录页
    if (flag) {
      return;
    }
    store.dispatch({
      type: 'user/logout',
    });
    flag = true;
    setTimeout(() => {
      flag = false;
    }, 500);
  };
})();

const errorHandle = (error: any) => {
  if (__DEV__) {
    console.error('error', error.config.url, error);
  }
  if ('statusCode' in error && error.statusCode === 401) {
    _goLoginPage();
  } else {
    let msg = '';
    if (error.data) {
      const data = error.data;
      const timeout = isTimeout(data.errorCode);
      if (timeout) {
        const token = store.getState().user.token;
        if (token) {
          msg = '登录超时';
        }
        _goLoginPage(msg);
      } else {
        msg = data.errorMsg ? data.errorMsg : '网络异常';
        if (msg.includes('Authorization')) {
          _goLoginPage('登录超时');
        } else {
          toast(msg);
        }
      }
    } else if (error.errMsg) {
      toast(error.errMsg);
    } else {
      toast('网络异常');
    }
  }
};

export default errorHandle;
