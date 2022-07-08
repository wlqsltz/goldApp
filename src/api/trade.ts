import axios from '@/config/http';

// 前端列表条件查询可选币对行情
export function marketListAdd(params = {}) {
  return axios.post('/core/v1/market/list_add', params);
}

// 查询区块链充值地址
export function xaddressChargeAddress(
  accountNumber: string,
  chainType = 'TRC20',
) {
  return axios.post('/core/v1/xaddress/charge_address', {
    accountNumber,
    chainType,
  });
}

// 查询提币手续费
export function withdrawRuleFee(params = {}) {
  return axios.post('/core/v1/withdraw_rule/detail_fee', params);
}

// 提币申请
export function turnOutApply(params = {}) {
  return axios.post('/core/v1/turn_out/apply', params);
}

// 分页查询我的提币订单
export function turnOutMyPage(params: IPageParams) {
  return axios.post('/core/v1/turn_out/my_page', {
    pageSize: 20,
    ...params,
  });
}

// 分页查询我的划转订单
export function transferOrderMyPage(params: IPageParams) {
  return axios.post('/core/v1/transfer_order/my_page', {
    pageSize: 20,
    ...params,
  });
}

// 转账
export function transferOrder(params = {}) {
  return axios.post('/core/v1/transfer_order/transfer', params);
}

// app-策略我的权益
export function xstrategyXstrategyHead(params = {}) {
  return axios.post('/core/v1/xstrategy/xstrategy_head', params);
}

// 前端列表条件查询X策略
export function xstrategyListFront(params = {}) {
  return axios.post('/core/v1/xstrategy/list_front', params);
}

// app-设置止损
export function xstrategyCycleSetStop(params = {}) {
  return axios.post('/core/v1/xstrategy_cycle/set_stop_ratio', params);
}

// 一键清仓-Tested
export function xstrategyClearList(params = {}) {
  return axios.post('/core/v1/xstrategy/clearList', params);
}

// 今日盈利和累计盈利
export function xstrategyDayIncome() {
  return axios.post('/core/v1/xstrategy_cycle_history/day_income');
}

// 前端分页条件查询X策略历史循环
export function xstrategyCycleHisPage(params: IPageParams) {
  return axios.post('/core/v1/xstrategy_cycle_history/page_front', {
    pageSize: 20,
    pageNum: 1,
    ...params,
  });
}

// 累计盈利列表分页查询
export function xstrategyCycleIncomePage(params: IPageParams) {
  return axios.post('/core/v1/xstrategy_cycle_history/page_income_front', {
    pageSize: 20,
    pageNum: 1,
    ...params,
  });
}

// 前端分页条件查询委托指令（执行日志）
export function enstrustCommandFront(params: IPageParams) {
  return axios.post('/core/v1/enstrust_command/page_front', {
    pageSize: 20,
    pageNum: 1,
    ...params,
  });
}

// 前端查询委托指令 (日志详情)
export function enstrustCommandDetail(id: string) {
  return axios.post(`/core/v1/enstrust_command/detail_front/${id}`);
}
