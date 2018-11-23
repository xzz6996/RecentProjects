// 用户管理 => 用户统计
import request from '../utils/request'

// 用户列表
export function getBankcardListH5(params) {
  params = Object.assign({
    pageSize: 20,
    pageNo: 1,
    sort: 'create_time'
  }, params)
  console.log(params)
  return request({
    url: '/user/bankcardListH5',
    method: 'get',
    params: params
  })
}
