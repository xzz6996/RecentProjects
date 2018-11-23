import request from '../utils/request'

// 房源初审、募集中的房源
export function houseTrial(params) {
  params = Object.assign({
    pageSize: 20,
    pageNo: 1,
    sort: 'create_time',
    status: 0
  }, params)
  console.log(params)
  return request({
    url: '/project/projectListH5',
    method: 'get',
    params: params
  })
}

// 查看详情
export function getProjectInfo(params) {
  params = Object.assign({
    pageSize: 20,
    pageNo: 1,
    sort: 'create_time'
  }, params)
  console.log(params)
  return request({
    url: '/project/projectInfo',
    method: 'get',
    params: params
  })
}

// 审核房源
export function AuditProject(params) {
  params = {
    pageSize: 20,
    pageNo: 1,
    sort: 'create_time',
    projectId: params,
    type: 1
  }
  return request({
    url: '/project/auditProject',
    method: 'get',
    params: params
  })
}

// 撤回房源
export function CancelProject(params) {
  params = {
    projectId: params,
    type: 1,
    pageSize: 20,
    pageNo: 1,
    sort: 'create_time'
  }
  return request({
    url: '/project/cancelProject',
    method: 'get',
    params: params
  })
}

// 转让房源列表
export function transferHouse(params) {
  params = Object.assign({
    pageSize: 20,
    pageNo: 1,
    sort: 'create_time'
  }, params)
  console.log(params)
  return request({
    url: '/project/transferProjectListH5',
    method: 'get',
    params: params
  })
}


// 取消转让
export function CancelTransfer(params) {
  params = {
    id: params
  }
  return request({
    url: '/project/cancelTransfer',
    method: 'get',
    params: params
  })
}



// 所有房源列表
// 因为无法展示所有状态 status要传一个默认值
export function allHouse(params) {
  params = Object.assign({
    pageSize: 20,
    pageNo: 1,
    status: 0,
    sort: 'create_time'
  }, params)
  console.log(params)
  return request({
    url: '/project/allProjectListH5',
    method: 'get',
    params: params
  })
}

// 承租记录
export function houseTenantRecord(params) {
  return request({
    url: '/tender/tenderRecordListH5',
    method: 'get',
    params: params
  })
}


// 添加房源 => 获取用户列表
export function getUserList(params) {
  params = Object.assign({
  }, params)
  return request({
    url: '/user/borrowUserList',
    method: 'get',
    params: params
  })
}

// 添加房源
export function createProject(params) {
  params = Object.assign({
    pageSize: 20,
    pageNo: 1,
    sort: 'create_time'
  }, params)
  console.log(params)
  return request({
    url: '/project/createProject',
    method: 'post',
    data: params
  })
}