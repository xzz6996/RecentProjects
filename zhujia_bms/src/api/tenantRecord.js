// 用户管理 => 用户承租记录
import request from '../utils/request'

// 用户承租记录列表
export function tenantRecord(params) {
  params = Object.assign({
    pageSize: 20,
    pageNo: 1,
    sort: 'create_time'
  }, params)
  console.log(params)
  return request({
    url: '/rentUser/rentProjectRecordH5',
    method: 'get',
    params: params
  })
}