import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login'
import Home from './views/Home'
import pageChat from './views/chat/pageChat.vue'



Vue.use(Router)

export default new Router({
    routes:[
        {
          path:'/',
          name:'登录页',
          component:Login,
          hidden:true
        },{
          path: '/home',
          name:'首页',
          component: Home,
          hidden:true,
          children:[
            {
              path:'/chat',
              name:'聊天页',
              component:pageChat,
              hidden:true
            },
          ]
        },
    ]
})