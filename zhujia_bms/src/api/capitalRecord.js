// 用户管理 => 用户资金记录
import request from '../utils/request'

// 用户资金列表
export function capitalRecord(params) {
  params = Object.assign({
    pageSize: 20,
    pageNo: 1,
    sort: 'create_time'
  }, params)
  console.log(params)
  return request({
    url: '/account/accountLogList?time=' + new Date().getTime(),
    method: 'get',
    params: params
  })
}

// 导出表格
export function exportEXCEL(params) {
  params = Object.assign({
    pageSize: 20,
    pageNo: 1,
    sort: 'create_time'
  }, params)
  console.log(params)
  return request({
    url: '/account/exceptAccountLogList?time=' + new Date().getTime(),
    method: 'get',
    params: params
  })
}

