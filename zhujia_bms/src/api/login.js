import request from '../utils/request'

export function login(params) {
  return request({
    url: '/user/loginPost',
    method: 'post',
    data: params
  })
}

// 获取用户信息
export function getUserInfo(token) {
  const params = {
    token
  }
  return request({
    url: '/user/searchToken',
    method: 'post',
    data: params
  })
}

// 获取菜单
export function getMenu(userId) {
  const params = {
    userId
  }
  console.log(params)
  return request({
    url: '/menu/queryLeftMenu',
    method: 'post',
    data: params
  })
}

//修改密码


export function resetPasswd(params) {
  return request({
    url: '/sysUser/resetPasswd',
    method: 'post',
    data: params
  })
}
