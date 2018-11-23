// banner管理
import request from '../utils/request'

// 网站banner列表
export function bannerList(params) {
  params = Object.assign({
    pageSize: 20,
    pageNo: 1,
    sort: 'create_time'
  }, params)
  return request({
    url: '/banner/bannerListH5',
    methods: 'get',
    params: params
  })
}

//添加banner
export function addBanner(params) {
  params = Object.assign({
    pageSize: 20,
    pageNo: 1,
    sort: 'create_time'
  }, params)
  return request({
    url: '/banner/createH5',
    methods: 'get',
    params: params
  })
}

//删除banner
export function deleteBanner(params) {
  params = Object.assign({
    pageSize: 20,
    pageNo: 1,
    sort: 'create_time'
  }, params)
  return request({
    url: '/banner/deleteH5',
    methods: 'get',
    params: params
  })
}
//修改banner
export function updateBanner(params) {
  params = Object.assign({
    pageSize: 20,
    pageNo: 1,
    sort: 'create_time'
  }, params)
  return request({
    url: '/banner/updateH5',
    methods: 'get',
    params: params
  })
}
