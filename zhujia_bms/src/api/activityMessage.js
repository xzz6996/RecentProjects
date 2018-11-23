// 平台管理 --->活动消息
import request from '../utils/request'

// 活动消息列表
export function activityMessage(params) {
  params = Object.assign({
    pageSize: 20,
    pageNo: 1,
    sort: 'create_time',
    type:4
  }, params)
  return request({
    url: '/active/activeListH5',
    methods: 'get',
    params: params
  })
}
// 添加活动
export function addMessage(params) {
  params = Object.assign({
    pageSize: 20,
    pageNo: 1,
    sort: 'create_time',
    type:4
  }, params)
  return request({
    url: '/active/createH5',
    methods: 'get',
    params: params
  })
}

// 修改消息
export function updateMessage(params) {
  params = Object.assign({
    pageSize: 20,
    pageNo: 1,
    sort: 'create_time',
    type:4
  }, params)
  return request({
    url: '/active/updateH5',
    methods: 'get',
    params: params
  })
}


// 删除消息
export function deleteMessage(params) {
  params = Object.assign({
    pageSize: 20,
    pageNo: 1,
    sort: 'create_time',
    type:4
  }, params)
  return request({
    url: '/active/deleteH5',
    methods: 'get',
    params: params
  })
}

// 查询消息
/*export function queryMessage(params) {
  params = Object.assign({
    pageSize: 20,
    pageNo: 1,
    sort: 'create_time',
    type:4
  }, params)
  return request({
    url: '/active/activeListH5',
    methods: 'get',
    params: params
  })
}*/
