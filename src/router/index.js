import Vue from 'vue'
import Router from 'vue-router'
const index = () => import('@/pages/index/index')
const directoryOnChain = () => import('@/pages/dataOnChain/directoryOnChain')
const home = () => import('@/pages/homePage/index')
const entry = () => import('@/pages/homePage/entry')
const login = () => import('@/pages/login/login')
const directoryManagement = () => import('@/pages/dataOnChain/directoryManagement')
const directoryCheckList = () => import('@/pages/dataOnChain/directoryCheckList')
const directoryCheck = () => import('@/pages/dataOnChain/directoryCheck')
const detail = () => import('@/pages/dataOnChain/detail')
const myContract = () => import('@/pages/contractManagement/myContract')
const queryOnline = () => import('@/pages/contractManagement/queryOnline')
const contractCheck = () => import('@/pages/contractManagement/contractCheck')
const contractMonitor = () => import('@/pages/contractManagement/contractMonitor')
const contractStart = () => import('@/pages/contractManagement/contractStart')
const contractLog = () => import('@/pages/contractManagement/contractLog')
const agencyManagement = () => import('@/pages/systemManagement/agencyManagement')
const listManagement = () => import('@/pages/systemManagement/listManagement')
const userManagement = () => import('@/pages/systemManagement/userManagement')
const newsList = () => import('@/pages/myNews/newsList')
const detailPage = () => import('@/pages/dataMarket/detailPage')
const listPage = () => import('@/pages/dataMarket/listPage')
const initiateContract = () => import('@/pages/dataMarket/initiateContract')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/entry',
      name: 'entry',
      component: entry
    },
    {
      path: '/',
      name: 'index',
      component: index,
      redirect: 'home',
      children: [
        {
          path: '/home',
          name: 'home',
          component: home
        },
        {
          path: '/directoryOnChain',
          name: 'directoryOnChain',
          component: directoryOnChain
        },
        {
          path : '/directoryManagement',
          name : 'directoryManagement',
          component: directoryManagement
        },
        {
          path : '/directoryCheckList',
          name : 'directoryCheckList',
          component: directoryCheckList
        },
        {
          path: '/directoryCheck/:id',
          name: 'directoryCheck',
          component: directoryCheck
        },
        {
          path: '/detail',
          name: 'detail',
          component: detail
        },
        {
          path : '/myContract',
          name : 'myContract',
          component: myContract,
        },
        {
          path: 'queryOnline',
          name: 'queryOnline',
          component: queryOnline
        },
        {
          path : '/contractCheck',
          name : 'contractCheck',
          component: contractCheck
        },
        {
          path : '/contractMonitor',
          name : 'contractMonitor',
          component: contractMonitor
        },
        {
          path : '/contractStart',
          name : 'contractStart',
          component: contractStart
        },
        {
          path : '/contractLog',
          name : 'contractLog',
          component: contractLog
        },
        {
          path : '/agencyManagement',
          name : 'agencyManagement',
          component: agencyManagement
        },
        {
          path : '/listManagement',
          name : 'listManagement',
          component: listManagement
        },
        {
          path : '/userManagement',
          name : 'userManagement',
          component: userManagement
        },
        {
          path : '/newsList',
          name : 'newsList',
          component: newsList
        },
        {
          path : '/detailPage/:id',
          name : 'detailPage',
          component: detailPage
        },
        {
          path : '/resourceMall/:id',
          name : 'resourceMall',
          component: listPage
        },
        {
          path : '/initiateContract/:id',
          name : 'initiateContract',
          component: initiateContract
        }
      ]
    },
  ]
})
