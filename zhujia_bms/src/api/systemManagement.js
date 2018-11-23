// 系统管理

//人员管理
import request from '../utils/request'

// 保存用户
export function saveSysUser(params) {
  return request({
    url: '/sysUser/saveSysUser',
    method: 'post',
    data: params
  })
}
// 删除用户
export function deleteSysUser(params) {
  return request({
    url: '/sysUser/deleteSysUser',
    method: 'post',
    data: params
  })
}











// 用户列表
export function querySysUserList(params) {
  return request({
    url: '/sysUser/querySysUserList',
    method: 'post',
    data: params
  })
}


//角色管理

//角色 列表查询
export function roleList(params) {
  params = {
    pageSize: 20,
    pageNo: 1,
    sort: 'create_time'
  }
  return request({
    url: '/role/queryRoleList',
    method: 'post',
    data: params
  })
}
//保存角色
export function saveRole(params) {
  return request({
    url: '/role/saveRole',
    method: 'post',
    data: params
  })
}
//删除角色
export function deleteRole(params) {
  return request({
    url: '/role/deleteRole',
    method: 'post',
    data: params
  })
}
//开启/禁用角色
export function stopRole(params) {
  return request({
    url: '/role/saveRole',
    method: 'post',
    data: params
  })
}




