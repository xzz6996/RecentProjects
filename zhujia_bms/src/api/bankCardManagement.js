// 用户管理 => 用户银行卡管理
import request from '../utils/request'

// 银行卡列表
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


export function DeleteBankcard(params) {
  params = Object.assign({
    pageSize: 20,
    pageNo: 1,
    sort: 'create_time'
  }, params)
  console.log(params)
  return request({
    url: '/user/deleteBankcardH5',
    method: 'get',
    params: params
  })
}
