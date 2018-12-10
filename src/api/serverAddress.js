const ServerAddress = {
    // 注册
    'register': '/account/register',
    //登录
    'login': '/account/login',

    //算法
    'algorithmList': '/algorithm/list',
    //算力
    'computeList': '/compute/list',

    //dashbord
    //合约执行数据统计
    'getContractExecTop': '/index/getContractExecTop',
    //合约数量统计
    'getContractTop': '/index/getContractTop',
    //合约目录统计
    'getMyResourceAndContract': '/index/getMyResourceAndContract',
    //目录主题统计
    'getResourceByTheme': '/index/getResourceByTheme',
    //目录上链统计
    'getResourceTop': '/index/getResourceTop',


    //dimension
    //分类菜单
    'sortMenu': '/dimension/getCataCategoryByPid',
    //所有分类菜单
    'allMenu': '/dimension/getCataCategoryList',
    //部门菜单
    'departmentMenu': '/dimension/getOrganizationByPid',
    //所有部门
    'departmentList': '/dimension/getOrganizationList',
    //修改部门
    'updateMenu': '/dimension/updateCataCategory',
    //修改机构
    'updateOrganization': '/dimension/updateOrganization',
    //删除部门
    'deleteMenu': '/dimension/deleteCataCategory',
    //删除机构
    'deleteOrganization': '/dimension/deleteOrganization',
    //添加部门
    'addMenu': '/dimension/addCataCategorySubNode',
    //添加机构
    'addOrganizationSubNode': '/dimension/addOrganizationSubNode',

    //contract
    //
    'contractAdd': '/contract/add',
    //
    'contractAudit': '/contract/audit',
    //
    'contractDetail': '/contract/detail',
    //
    'contractIssuer': '/contract/issuer',
    //
    'contractList': '/contract/list',
    //
    'contractSearch': '/contract/search',
    //
    'contractStatus': '/contract/status',
    // 重新申请
    'contractUpdate': '/contract/update',
    // 日志
    'orderTrack': '/order/trackpage',
    // 合约审核-同意
    'orderAdd': '/order/add',
    // 
    'getApi': '/contract/getApi',
    // 合约监控
    'contractMonitor': '/contract/monitor',
    // 合约执行
    'orderExec': '/order/exec',
    'getExecResult': '/order/getExecResult',

    //message
    //
    'messageCount': '/message/count',
    //
    'messageList': '/message/list',
    //搜索列表
    'messageSearch': '/message/search',
    //
    'messageUpdateStatus': '/message/updateStatus',

    //resource
    //提交审核
    'resourceAdd': '/resource/add',
    //修改
    'resourceUpdate': '/resource/update',
    //审核
    'resourceAudit': '/resource/audit',
    //数据广场详情
    'resourceDetail': '/resource/detail',
    //
    'resourceIssuer': '/resource/issuer',
    //数据广场列表
    'resourceList': '/resource/list',
    //
    'resourceSearch': '/resource/search',
    //
    'resourceStatus': '/resource/status',
    //
    'resourceAudit': '/resource/audit',
    //
    'resourceAddChain': '/resource/addChain',
    //
    'algorithmAdd': '/algorithm/add',
    //
    'computeAdd': '/compute/add',
    // 
    'translateGetUrl': '/translate/getUrl',
    'apiDataUrl': '/api/dataUrl',

    //审核列表
    'resourceAuditList': '/resource/auditList',

    //user
    //
    'userAdd': '/user/add',
    'accountRegister':'/account/register',
    //
    'userDelete': '/user/delete',
    //
    'userDetail': '/user/detail',
    //
    'userList': '/user/list',
    //
    'login': '/user/login',
    //
    'userRoleList': '/user/roleList',
    //
    'userUpdate': '/user/update',

    //data agent
    //新上链
    'dataAdd': '/data/add',
    //上下架
    'dataOnOffShelf': '/data/onOffShelf',
    // 关系图
    'indexGetRelation': '/index/getRelation',

    //中心化目录上链
    'createCatalogs': '/engine/createcatalogs',
    // 发起中心化合约 
    'createcontract': '/engine/createcontract',
    //执行中心化合约
    'execcontract': '/engine/execcontract'
}
export default ServerAddress