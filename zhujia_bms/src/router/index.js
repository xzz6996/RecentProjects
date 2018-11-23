import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/component/HelloWorld'
import login from '@/views/login'
import error from '@/views/error/error'

import layout from '@/views/layout'

// 欢迎页
import welcome from '@/views/welcome'


// 平台管理
import dashboard from '@/views/dashboard/user'
import permission from '@/views/dashboard/permission'

// 网站新闻
import webNewsIndex from '@/views/platformManagement/webNews'
import webNews from '@/views/platformManagement/webNews/webNews'  // 网站新闻
import addNews from '@/views/platformManagement/webNews/addNews' // 添加新闻
import amendNews from '@/views/platformManagement/webNews/amendNews' // 修改新闻

// 平台公告
import platformNoticeIndex from '@/views/platformManagement/platformNotice' // 平台公告
import platformNotice from '@/views/platformManagement/platformNotice/platformNotice' // 平台公告
import addNotice from '@/views/platformManagement/platformNotice/addNotices' // 添加公告


// 广告图片
import adPictureIndex from '@/views/platformManagement/adPicture'
import adPicture from '@/views/platformManagement/adPicture/adPicture' // 广告图片
import addPicture from '@/views/platformManagement/adPicture/addPictures' // 添加广告图片

// 活动消息
import activityMessageIndex from '@/views/platformManagement/activityMessage' // 活动消息
import activityMessage from '@/views/platformManagement/activityMessage/activityMessage' // 活动消息
import addMessage from '@/views/platformManagement/activityMessage/addMessage' // 添加活动消息

// 房源管理
import houseTrialIndex from '@/views/housManagement/houseTrial' // 房源初审
import houseTrial from '@/views/housManagement/houseTrial/houseTrial' // 房源初审
import newAddHouse from '@/views/housManagement/houseTrial/newAddHouse' // 新增房源
import houseDetail from '@/views/housManagement/houseTrial/houseDetail' // 房源详情
import raiseHouse from '@/views/housManagement/raiseHouse' // 募集中房源
import transferHouse from '@/views/housManagement/transferHouse' // 转让房源

import allHouseIndex from '@/views/housManagement/allHouse'
import allHouse from '@/views/housManagement/allHouse/allHouse' // 所有房源
import houseTenantRecord from '@/views/housManagement/allHouse/tenantRecord'

// 合同管理
import contractManagement from '@/views/contractManagement' // 合同管理
import addContract from '@/views/contractManagement/addContract' // 添加合同

// 用户管理
import capitalRecord from '@/views/userManagement/capitalRecord' // 用户资金记录
import accountInformation from '@/views/userManagement/accountInformation' // 用户账户信息
import rechargeRecord from '@/views/userManagement/rechargeRecord' // 用户充值记录
import presentRecord from '@/views/userManagement/presentRecord' // 用户提现记录
import tenantRecord from '@/views/userManagement/tenantRecord' // 用户承租记录

import lessorManagementIndex from '@/views/userManagement/lessorManagement' // 出租人管理
import lessorManagement from '@/views/userManagement/lessorManagement/lessorManagement' // 出租人管理
import addLessor from '@/views/userManagement/lessorManagement/addLessor' // 添加个人出租
import addEnterpriseLessor from '@/views/userManagement/lessorManagement/addEnterpriseLessor' // 添加企业出租

import bankCardManagement from '@/views/userManagement/bankCardManagement' // 用户银行卡管理
import userStatistics from '@/views/userManagement/userStatistics' // 用户统计

// 还款管理
import reimbursementList from '@/views/reimbursementManagement/reimbursementList' // 还款中列表
import hasReimbursementList from '@/views/reimbursementManagement/hasReimbursementList' // 已结清列表

// 数据统计
import dataStatistics from '@/views/dataStatistics' // 未还款还款列表


Vue.use(Router)

export const constRouters = [
  {
    path: '/login',
    component: login
  }, {
    path: '*',
    component: error
  }
]
/**
 * 技术 technology
 * 产品 product
 * 运营 operate
 * 风控 risk
 * 财务 finance
 * 超级管理员 0000
 **/
export const asyncRouters = [
  {
    path: '',
    component: layout,
    redirect: 'welcome',
    meta: {
      name: 'Dashboard',
      icon: 'icon iconfont icon-dashboard',
      roles: ['technology', 'product', 'operate', 'risk', 'finance', 'admin', 'superadmin','0000']
    },
    children: [
      {
        path: 'welcome',
        component: welcome,
        meta: {
          name: '欢迎页面'
        }
      }
    ]
  },
  {
    path: '/systemManagement',
    component: layout,
    meta: {
      name: '系统管理',
      icon: 'icon iconfont icon-shezhi',
      roles: ['technology', 'product', 'admin', 'superadmin','0000']
    },
    children: [
      {
        path: 'dashboard',
        component: dashboard,
        meta: {
          name: '人员管理'
        }
      }, {
        path: 'permission',
        component: permission,
        meta: {
          name: '角色管理'
        }
      }
    ]
  },
  {
    path: '/platformManagement',  // 平台管理
    component: layout,
    meta : {
      name: '平台管理',
      icon: 'icon iconfont icon-diannao',
      roles: ['technology', 'product', 'operate', 'admin', 'superadmin','0000']
    },
    children: [
      {
        path: 'webNews',
        component: webNews,
        meta: {
          name: '网站新闻'
        }
      }, {
        path: 'platformNotice',
        component: platformNotice,
        meta: {
          name: '平台公告'
        }
      }, {
        path: 'adPicture',
        component: adPicture,
        meta: {
          name: '广告图片'
        }
      }, {
        path: 'activityMessage',
        component: activityMessage,
        meta: {
          name: '活动消息'
        }
      }
    ]
  },
  {
    path: '/housManagement',
    component: layout,
    meta: {
      name: '房源管理',
      icon: 'icon iconfont icon-shouye',
      roles: ['technology', 'product', 'operate', 'risk', 'finance', 'admin', 'superadmin','0000']
    },
    children: [
      {
        path: 'houseTrial',
        component: houseTrial,
        meta: {
          name: '房源初审'
        }
      }, {
        path: 'raiseHouse',
        component: raiseHouse,
        meta: {
          name: '募集中房源'
        }
      }, {
        path: 'transferHouse',
        component: transferHouse,
        meta: {
          name: '转让房源'
        }
      }, {
        path: 'allHouse',
        component: allHouse,
        meta: {
          name: '所有房源'
        }
      }
    ]
  },
  {
    path: '/contractManagement',
    component: layout,
    redirect: '/contractManagement/index',
    meta: {
      name: '合同管理',
      icon: 'icon iconfont icon-ziliao',
      roles: ['technology', 'product', 'risk', 'finance', 'admin', 'superadmin','0000']
    },
    children: [
      {
        path: 'index',
        component: contractManagement,
        meta: {
          name: '合同管理'
        }
      }
    ]
  },
  {
    path: '/userManagement',
    component: layout,
    meta: {
      name: '用户管理',
      icon: 'icon iconfont icon-yonghu',
      roles: ['technology', 'product', 'operate', 'risk', 'finance', 'admin', 'superadmin','0000']
    },
    children: [
      {
        path: 'capitalRecord',
        component: capitalRecord,
        meta: {
          name: '用户资金记录'
        }
      }, {
        path: 'accountInformation',
        component: accountInformation,
        meta: {
          name: '用户账户信息'
        }
      }, {
        path: 'rechargeRecord',
        component: rechargeRecord,
        meta: {
          name: '用户充值记录'
        }
      }, {
        path: 'presentRecord',
        component: presentRecord,
        meta: {
          name: '用户提现记录'
        }
      }, {
        path: 'tenantRecord',
        component: tenantRecord,
        meta: {
          name: '用户承租记录'
        }
      }, {
        path: 'lessorManagement',
        component: lessorManagement,
        meta: {
          name: '出租人管理'
        }
      }, {
        path: 'bankCardManagement',
        component: bankCardManagement,
        meta: {
          name: '用户银行卡管理'
        }
      }, {
        path: 'userStatistics',
        component: userStatistics,
        meta: {
          name: '用户统计'
        }
      }
    ]
  },
  {
    path: '/reimbursementManagement',
    component: layout,
    meta: {
      name: '还款管理',
      icon: 'icon iconfont icon-fapiao',
      roles: ['technology', 'product', 'operate', 'risk', 'finance', 'admin', 'superadmin','0000']
    },
    children: [
      {
        path: 'reimbursementList',
        component: reimbursementList,
        meta: {
          name: '还款中列表'
        }
      }, {
        path: 'hasReimbursementList',
        component: hasReimbursementList,
        meta: {
          name: '已结清列表'
        }
      }
    ]
  },
  {
    path: '/dataStatistics',
    component: layout,
    redirect: '/dataStatistics/index',
    meta: {
      name: '数据统计',
      icon: 'icon iconfont icon-shuju',
      roles: ['admin', 'superadmin','0000']
    },
    children: [
      {
        path: 'index',
        component: dataStatistics,
        meta: {
          name: '数据统计'
        }
      }
    ]
  }
]



export default new Router({
  routes: constRouters
})


