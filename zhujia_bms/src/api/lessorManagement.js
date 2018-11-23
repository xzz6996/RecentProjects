// 用户管理 => 出租人管理
import request from '../utils/request'

// 出租人列表
export function lessorList(params) {
  params = Object.assign({
    pageSize: 20,
    pageNo: 1,
    sort: 'create_time'
  }, params)
  console.log(params)
  return request({
    url: '/borrowUser/userListH5',
    method: 'get',
    params: params
  })
}

// 银行列表
export function bankListH5(params) {
  params = Object.assign({
  }, params)
  console.log(params)
  return request({
    url: '/borrowUser/bankListH5',
    method: 'get',
    params: params
  })
}

// 添加个人出租人
export function addLessor(params) {
  params = Object.assign({
    pageSize: 20,
    pageNo: 1,
    sort: 'create_time',
    userType: 2
  }, params)
  console.log(params)
  return request({
    url: '/borrowUser/createUserH5',
    method: 'post',
    data: params
  })
}

// 添加企业出租人
export function addEnterpriseLessor(params) {
  params = Object.assign({
    pageSize: 20,
    pageNo: 1,
    sort: 'create_time',
    userType: 3
  }, params)
  console.log(params)
  return request({
    url: '/borrowUser/createUserH5',
    method: 'post',
    data: params
  })
}
