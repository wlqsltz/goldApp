import axios from '@/config/http';

// 登录
export function login(params: object) {
  return axios.post('/core/v1/cuser/public/login', params);
}
// 注册
export function register(params: object) {
  return axios.post('/core/v1/cuser/public/register', params);
}
// 重置密码
export function resetPwd(params: object) {
  return axios.post('/core/v1/user/forget_loginPwd', params);
}
// 修改手机
export async function editMobile(params: object) {
  return axios.post('/core/v1/user/modify_mobile', params);
}
//设置/修改 交易密码
export function editTradePwd(params: {
  tradePwd: string;
  smsCaptcha: string;
  userId?: string; // 传人userId表示修改
}) {
  return axios.post('/core/v1/user/bind_tradePwd', params);
}
// 用户详情
export function getUserDetail() {
  return axios.post('/core/v1/cuser/my');
}
// 获取用户绑定的交易所
export function apiKeyListLoadData() {
  return axios.post('/core/v1/api_key/list_front');
}
// API授权-导入
export async function createApiKeyLoadData(params: {
  accessKey: string;
  secretKey: string;
  exchangeNoFlag: string;
}) {
  return axios.post('/core/v1/api_key/create', params);
}
// API授权-修改
export async function modifyApiKeyLoadData(params: {
  accessKey: string;
  secretKey: string;
  id: string;
  exchangeNoFlag: string;
}) {
  return axios.post('/core/v1/api_key/modify', params);
}
// 删除apikey 配置
export async function unbundlingApiKey(id: string) {
  return axios.post('/core/v1/api_key/unbundling', {id});
}

// 我的社区-头部
export function myCommunityHead() {
  return axios.post('/core/v1/cuser/my_community_head');
}

// 我的社区-分页
export function getMyCommunityList(params: IPageParams) {
  return axios.post('/core/v1/cuser/my_community', {
    pageNum: 1,
    pageSize: 10,
    ...params,
  });
}

// 分页查询我的账户流水
export function jourMyPage(params: IPageParams) {
  return axios.post('/core/v1/jour/my/page', {
    pageSize: 20,
    ...params,
  });
}

// App-根据用户查询账户对象
export function accountDetailByUser(currency: string) {
  return axios.post('/core/v1/account/detailByUser', {currency});
}
