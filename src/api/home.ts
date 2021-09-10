import axios from '@/config/http';

// 首页现货行情列表查询
export async function homeMarketList() {
  return axios.post('/core/v1/market/public/home_market_list');
}

// 获取操盘手列表
export function operatorFrontLimit() {
  return axios.post('/core/v1/operator/page_front_limit', {
    pageNum: 1,
    pageSize: 3,
  });
}

// app-前端分页条件查询操盘手
export function operatorPageFront(params?: IPageParams) {
  return axios.post('/core/v1/operator/page_front', {
    pageNum: 1,
    pageSize: 10,
    ...params,
  });
}

// 首页社区排行
export async function xstrategyTeamRank() {
  return axios.post('/core/v1/xstrategy_cycle_history/team_rank');
}

// 首页用户排行
export async function xstrategyUserRank() {
  return axios.post('/core/v1/xstrategy_cycle_history/user_rank');
}

// 电子账单
export function getElectronicBill() {
  return axios.post<IElectronicBilling>('/core/v1/xstrategy/electronic_bill');
}
