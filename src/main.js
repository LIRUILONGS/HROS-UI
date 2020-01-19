/*
 * 入口js，创建vue实例
 * */
import Vue from 'vue'
import App from './App.vue';
import router from "./router";
import store from "./store/index";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.min.css';
import VCharts from 'v-charts'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

//以插件的形式导入
import { postKeyValueRequest } from "./utils/api";
import { putRequest } from "./utils/api";
import { deleteRequest } from "./utils/api";
import { postRequest } from "./utils/api";
import { getRequest } from "./utils/api";
import { initMenu } from "./utils/menus";


Vue.prototype.postKeyValueRequest = postKeyValueRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.getRequest = getRequest;

//阻止启动生产消息，常用作指令。
Vue.config.productionTip = false

Vue.use(VueQuillEditor);
Vue.use(VCharts)
Vue.use(ElementUI);
//类似于过滤器
router.beforeEach((to, from, next) => {
    if (to.name == '/') {
        next();
    } else {
        initMenu(router, store);
        next();
    }

})
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app")