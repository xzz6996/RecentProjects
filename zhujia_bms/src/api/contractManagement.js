import request from '../utils/request'
import { UPLOAD_IMAGE_URL } from '@/utils/env'

// 合同列表
export function contractManagement(params) {
  params = Object.assign({
    pageSize: 20,
    pageNo: 1,
    sort: 'create_time',
    content: '',
    contractPicture: '',
    id: '',
    realName: '',
    serialNo: '',
    userId: ''
  }, params)
  console.log(params)
  return request({
    url: '/contract/contractListH5',
    method: 'get',
    params: params
  })
}

// 添加合同页获取借款用户列表
export function getUserList(params) {
  params = Object.assign({
    userType: 2,
    pageSize: 20,
    pageNo: 1,
    sort: 'create_time'
  }, params)
  return request({
    url: '/borrowUser/userListH5',
    method: 'get',
    params: params
  })
}

// 添加合同
export function createContract(params) {
  params = Object.assign({
    pageSize: 20,
    pageNo: 1,
    sort: 'create_time'
  }, params)
  return request({
    url: '/contract/createContract',
    method: 'get',
    params: params
  })
}



/* export function uploadPic(data) {
  var form = new FormData()
  form.append('file', data, data.name)
  return request({
    url: UPLOAD_IMAGE_URL,
    method: 'post',
    data: form,
    headers: {'Content-Type': 'multipart/form-data'}
  })
} */


