import axios from '@/config/http';

// 服务器是否在升级
export function getUpdateConfigs() {
  return axios.post('/core/v1/config/public/get_update_configs');
}

// 根据key获取系统参数
export function getSystemParams(key: string) {
  return axios.post('/core/v1/config/public/list', {key});
}

// 根据type获取系统参数
export function getSystemType(type: string) {
  return axios.post('/core/v1/config/public/list', {type});
}

// 列表查寻数据字典
export function getDictList(parentKey: string) {
  return axios.post('/core/v1/dict/public/list', {parentKey});
}

// app分页条件查询文章列表
export function articlePublicPage(params: IPageParams) {
  return axios.post('/core/v1/article/public/page_front', {
    pageNum: 1,
    pageSize: 10,
    ...params,
  });
}

// 获取验证码
export function getSmsCaptcha(params: {bizType: string; mobile: string}) {
  return axios.post('/core/v1/sms_out/permission_none/sms_code', params);
}

// 前端列表条件查询导航
export function cnavigateList(location: string) {
  return axios.post('/core/v1/cnavigate/public/list_front', {
    location,
  });
}

// 前端列表查询公告
export function smsListFront(type = '1') {
  return axios.post('/core/v1/sms/public/list', {
    type,
    status: '1',
  });
}

// 前端列表条件查询交易所
export async function exchangeListFront() {
  return axios.post<IExchange[]>('/core/v1/exchange/list_front', {status: 1});
}

// 列表条件查询文章类型
export function getArticleTypeList(location?: string) {
  return axios.post('/core/v1/article_type/list', {location});
}

// 列表条件查询文章
export function getArticleList(typeId: string) {
  return axios.post('/core/v1/article/list', {
    status: '1',
    typeId,
  });
}

// 前端分页条件查询版本日志
export function getVersionLogPage(params: IPageParams) {
  return axios.post('/core/v1/version_log/page_front', {
    pageSize: 20,
    ...params,
  });
}
