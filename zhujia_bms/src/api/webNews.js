// 平台管理 => 网站新闻
import request from '../utils/request'

// 网站新闻列表
export function webNews(params) {
  params = Object.assign({
    pageSize: 20,
    pageNo: 1,
    sort: 'create_time',
    type: 1
  }, params)
  console.log(params)
  return request({
    url: '/news/newsListH5',
    methods: 'get',
    params: params
  })
}

// 修改新闻
export function upDateNews(params) {
  params = Object.assign({
    pageSize: 20,
    pageNo: 1,
    sort: 'create_time',
    type: 1
  }, params)
  return request({
    url: '/news/updateH5',
    methods: 'get',
    params: params
  })
}

//添加新闻
export function addNews(params) {
  params = Object.assign({
    pageSize: 20,
    pageNo: 1,
    sort: 'create_time',
    type: 1
  }, params)
  return request({
    url: '/news/createH5',
    methods: 'get',
    params: params
  })
}

//删除新闻
export function delectNews(params) {
  params = Object.assign({
    pageSize: 20,
    pageNo: 1,
    sort: 'create_time',
    type: 1
  }, params)
  return request({
    url: '/news/deleteH5',
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
