// 用户管理 => 用户账户信息
import request from '../utils/request'

// 用户账户信息
export function accountInformation(params) {
  params = Object.assign({
    pageSize: 20,
    pageNo: 1,
    sort: 'create_time'
  }, params)
  console.log(params)
  return request({
    url: '/user/userListH5',
    method: 'get',
    params: params
  })
}

// 删除用户
export function deleteUser(params) {
  params = {
    id: params
  }
  console.log(params)
  return request({
    url: '/user/deleteUserH5',
    method: 'get',
    params: params
  })
}

// 修改信息
export function updateUser(params) {
  console.log(params)
  return request({
    url: '/user/updateUserH5',
    method: 'get',
    params: params
  })
}