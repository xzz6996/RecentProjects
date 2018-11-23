// 用户管理 => 用户提现记录
import request from '../utils/request'

// 合同列表
export function presentRecord(params) {
  params = Object.assign({
    pageSize: 20,
    pageNo: 1,
    sort: 'create_time'
  }, params)
  return request({
    url: '/account/withdrawalRecordList',
    method: 'get',
    params: params
  })
}

export function AuditWithdrawal(params) {
  params = {
    id: params,
    status: 1 // 1同意 2不同意
  }
  return request({
    url: '/account/auditWithdrawal',
    method: 'get',
    params: params
  })
}