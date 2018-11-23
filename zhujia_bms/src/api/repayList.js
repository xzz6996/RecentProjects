//还款管理
import request from '../utils/request'

//还款中列表
export function repayList(params) {
  params = Object.assign({
    pageSize: 20,
    pageNo: 1,
    sort: 'create_time',
    status:0
  }, params)
  return request({
    url: '/repay/repayList',
    methods: 'get',
    params: params
  })
}

//确认还款
export function affirmRepay(params) {
  params = Object.assign({
    pageSize: 20,
    pageNo: 1,
    sort: 'create_time'
  }, params)
  return request({
    url: '/repay/affirmRepay',
    methods: 'get',
    params: params
  })
}

//收租记录

export function repayRecord(params) {
  params = Object.assign({
    pageSize: 20,
    pageNo: 1,
    sort: 'create_time'
  }, params)
  return request({
    url: '/repay/repayRecord',
    methods: 'get',
    params: params
  })
}

//已结清列表
export function repayListEnd(params) {
  params = Object.assign({
    pageSize: 20,
    pageNo: 1,
    sort: 'create_time',
    status:1
  }, params)
  return request({
    url: '/repay/repayList',
    methods: 'get',
    params: params
  })
}
