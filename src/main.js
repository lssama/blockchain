// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex';
import axios from 'axios'
import lodash from 'lodash'
import { Button, Select, Option, Input, Message ,Loading ,Menu, MenuItem, MenuItemGroup, Submenu, Breadcrumb, BreadcrumbItem, Collapse, 
  CollapseItem, Dropdown, DropdownItem, DropdownMenu, Form, FormItem, Transfer, Radio, Row , Col, DatePicker , Table, TableColumn, CheckboxGroup, Checkbox,
  Tabs, TabPane, Upload, Badge, Dialog, Tooltip, Tag, InputNumber, MessageBox, RadioGroup, Cascader, Pagination, Tree} from 'element-ui';
import 'babel-polyfill';
  // import 'element-ui/lib/theme-chalk/index.css';
import './assets/iconfont/iconfont'
import './assets/css/element/index.css';
import App from './App'
import router from './router'
import store from './store'
// 引入V-charts
import Vehistogram from 'v-charts/lib/histogram'
import Vebar from 'v-charts/lib/bar'
import Vepie from 'v-charts/lib/pie'
import Vering from 'v-charts/lib/ring'

Vue.component(Vehistogram.name, Vehistogram)
Vue.component(Vebar.name, Vebar)
Vue.component(Vepie.name, Vepie)
Vue.component(Vering.name, Vering)

Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 };
Vue.use(Button)
Vue.use(Select)
Vue.use(Option)
Vue.use(Input)
Vue.use(Loading)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Submenu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Dropdown)
Vue.use(DropdownItem)
Vue.use(DropdownMenu)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Transfer)
Vue.use(Radio)
Vue.use(Row)
Vue.use(Col)
Vue.use(DatePicker)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Upload)
Vue.use(Badge)
Vue.use(Dialog)
Vue.use(Tooltip)
Vue.use(Tag)
Vue.use(InputNumber)
Vue.use(RadioGroup)
Vue.use(Cascader)
Vue.use(Pagination)
Vue.use(Tree)

Vue.use(Vuex);
Vue.config.productionTip = false
Vue.prototype.$axios = axios;
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype._ = lodash;



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
