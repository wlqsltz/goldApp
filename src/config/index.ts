const apiUrl = {
  dev: 'http://m.golddev.hichengdai.com',
  online: 'http://m.xiaoquanzi.io',
};
export const APP_NAME = '小圈子';
export const API_URL = (() => {
  if (__DEV__) {
    return apiUrl.online;
  } else {
    // 打包
    return apiUrl.online;
  }
})();
console.log(API_URL);
