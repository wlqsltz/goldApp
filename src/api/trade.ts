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
