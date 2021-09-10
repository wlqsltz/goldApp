import axios from '@/config/http';

// 一键已读
export function smsReadNotice() {
  return axios.post('/core/v1/mySms/read_all');
}

// APP未读数
export function smsNoticeNumber() {
  return axios.post('/core/v1/mySms/public/unreadCount');
}

// 分页条件查询系统公告
export function smsPageFront(params = {}) {
  return axios.post('/core/v1/mySms/public/page', {
    status: '1',
    pageSize: 20,
    ...params,
  });
}

// 托管邀约消息
export function getTgSmsList() {
  return axios.post('/core/v1/sms/invitation_sms');
}

// 详情查公告
export function noticeDetail(id: string) {
  return axios.post('/core/v1/mySms/public/detail', {id});
}

// 查询托管合同
export function entrustContractDetailFront(id: string) {
  return axios.post(`/core/v1/entrust_contract/detail_front/${id}`);
}

// app-查询用户发送托管意向
export function intentionRecordDetail(id: string) {
  return axios.post(`/core/v1/intention_record/detail_front/${id}`);
}

// app-处理合同授权
export function entrustContractHandle(params: {id: string; status: string}) {
  return axios.post('/core/v1/entrust_contract/handle', params);
}

// 发送托管意向
export function createTg(params = {}) {
  return axios.post('/core/v1/entrust_contract/create_app_tg', params);
}
