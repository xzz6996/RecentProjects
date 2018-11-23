// 平台管理 => 平台公告
import request from '../utils/request'

// 平台公告列表
export function platformNotice(params) {
  params = Object.assign({
    pageSize: 20,
    pageNo: 1,
    sort: 'create_time'
  }, params)
  console.log(params)
  return request({
    url: 'adminNotice/noticeListH5',
    methods: 'get',
    params: params
  })
}

//添加公告

export function addNotice(params) {
  params = Object.assign({
    pageSize: 20,
    pageNo: 1,
    sort: 'create_time'
  }, params)
  return request({
    url: '/adminNotice/createNoticeH5',
    methods: 'get',
    params: params
  })
}

//修改公告
export function updateNotice(params) {
  params = Object.assign({
    pageSize: 20,
    pageNo: 1,
    sort: 'create_time'
  }, params)
  return request({
    url: '/adminNotice/updateNoticeH5',
    methods: 'get',
    params: params
  })
}

//删除公告
export function delectNotice(params) {
  params = Object.assign({
    pageSize: 20,
    pageNo: 1,
    sort: 'create_time'
  }, params)
  return request({
    url: 'adminNotice/deleteNoticeH5',
    methods: 'get',
    params: params
  })
}


// 承租记录
export function houseTenantRecord(params) {
  return request({
    url: '/tender/tenderRecordListH5',
    methods: 'get',
    params: params
  })
}
