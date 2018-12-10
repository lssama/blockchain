// 修改用户信息
export const fullRules = {
  name: [
    { required: true, message: "请输入信息资源名称", trigger: "blur" },
    { min: 1, max: 20, message: "长度在1-20个字符", trigger: "blur" }
  ],
  region: [
    { required: true, message: "请选择活动区域", trigger: "change" }
  ],
  cataPermission: [
    {
      type: "array",
      required: true,
      message: "请至少选择一种共享方式",
      trigger: "change"
    }
  ],
  cataType: [
    { required: true, message: "请选择资源类型", trigger: "change" }
  ],
  openType: [
    { required: true, message: "请选择开放类型", trigger: "change" }
  ],
  isSecret: [
    { required: true, message: "请选择是否涉密", trigger: "change" }
  ],
  resourceFormat: [
    { required: true, message: "请选择信息提供方式", trigger: "change" }
  ],
  updatePeriod: [
    { required: true, message: "请选择信息提供方式", trigger: "change" }
  ],
  cataCode: [
    { required: true, message: "请输入信息资源代码", trigger: "blur" },
    { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" }
  ],
  openType: [
    { required: true, message: "请选择开放类型", trigger: "change" }
  ],
  shareType: [
    { required: true, message: "请选择开共享类型", trigger: "change" }
  ],
  openCommunity: [
    { required: true, message: "请选择是否向社会开放", trigger: "change" }
  ],
  openCondition: [
    { required: true, message: "请输入开放条件", trigger: "blur" },
    {
      min: 1,
      max: 200,
      message: "长度在 1 到 200 个字符",
      trigger: "blur"
    }
  ],
  resourceDescription: [
    { required: true, message: "请输入信息资源摘要", trigger: "blur" },
    {
      min: 1,
      max: 200,
      message: "长度在 1 到 200 个字符",
      trigger: "blur"
    }
  ],
  address: [
    { required: true, message: "请输入信息资源地址", trigger: "blur" },
    { min: 1, message: "信息资源地址不能为空", trigger: "blur" }
  ],
  requestMethod: [
    {
      type: "array",
      required: true,
      message: "请至少选择一种请求方式",
      trigger: "change"
    }
  ],
  // useInfo: [
  //   {
  //     type: "array",
  //     required: true,
  //     message: "请至少选择一种用途",
  //     trigger: "change"
  //   }
  // ],
  responseFormat: [
    { required: true, message: "请选择返回格式", trigger: "change" }
  ],
  infoValues: [
    {
      type: "array",
      required: true,
      message: "请选择目录分类",
      trigger: "change"
    }
  ],
  resourceType: [
    {
      required: true,
      message: "请选择资源类别",
      trigger: "change"
    }
  ],
  addressFirst: [
    {
      required: true,
      message: "请选择信息资源地址",
      trigger: "change"
    }
  ],
  addressSecond: [
    {
      required: true,
      message: "请选择信息资源地址",
      trigger: "change"
    }
  ],
  isEncrypt: [
    {
      required: true,
      message: "请选择是否加密",
      trigger: "change"
    }
  ],
};