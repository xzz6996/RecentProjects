// 用户管理 => 用户充值记录
import request from '../utils/request'
import qs from 'qs'

// 用户充值记录列表
export function rechargeRecord(params) {
  params = Object.assign({
    pageSize: 20,
    pageNo: 1,
    sort: 'create_time'
  }, params)
  return request({
    url: '/account/rechargeRecordList',
    method: 'get',
    params: params,
    headers: {
      'Content-Type': 'application/json',
    }
  })
}

// 审核充值
export function AuditRecharge(params) {
  params = {
    id: params,
    status: 1
  }
  return request({
    url: '/account/auditRecharge',
    method: 'get',
    params: params
  })
}