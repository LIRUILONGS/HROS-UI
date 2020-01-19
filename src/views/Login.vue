<template  >
    <div v-loading.fullscreen.lock="loading"
         element-loading-spinner="fa fa-spinner fa-pulse fa-3x fa-fw" >
       <el-form :rules="rules" :model="loginFrom" class="logContainer" ref="loginFrom"  @keydown.enter.native="loginSubmit">
            <h2 class="logtitle">系统登录</h2>
           <el-form-item  prop="username">
               <el-input type="text" v-model="loginFrom.username" placeholder="请输入用户名" auto-complete="off" >
               </el-input>
           </el-form-item>
           <el-form-item  prop="password">
               <el-input type="text" v-model="loginFrom.password" placeholder="请输入密码"  auto-complete="off">
               </el-input>
           </el-form-item>
           <el-checkbox v-model="checked" class="loginRen">记住密码</el-checkbox>
           <el-button  type="primary" style="width: 100%" @click="loginSubmit" >登录</el-button>
       </el-form>
    </div>
</template>

<script>
   // import {postKeyValueRequest} from '../utils/api';
   // 在main.js里以插件形似全局导入
    export default {
        data(){
            return{
                loading:false,
                loginFrom: {
                    username: 'admin',
                    password: '123'
                },
                checked:true,
                rules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 5, max: 25, message: '长度在 5 到 25 个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: blur()},
                        {min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur'}
                    ]
                }
            }
        },
        methods:{
            loginSubmit(){
                //提交前空值校验
                this.$refs.loginFrom.validate((valid) => {
                    if (valid) {
                       // alert('submit!');
                        this.loading = true;
                        this.postKeyValueRequest('/doLogin',this.loginFrom
                        ).then(data=>{
                        this.loading = false;
                            if (data){

                                //方法将 JavaScript 的json对象转换为字符串。
                                //将得到数存储在SessionStorage里
                                window.sessionStorage.setItem("user",JSON.stringify(data.obj))
                                //获取路由对象
                                this.$router.replace('/home')
                            }
                        })
                    } else {
                        this.$message.error('请输入信息');
                        return false;
                    }
                });

            }
        }
    }
</script>

<style >
    .logContainer{
       /* //圆角边框*/
        border-radius: 15px;
        /*背景裁剪在背景边框内部*/
        background-clip: padding-box;
        /*//外边距*/
        margin: 180px auto;
        /*//宽度*/
        width: 350px;
        /*//内边距*/
        padding: 35px 35px 15px 35px;
        /*//背景色*/
        background: #ffffff;
        /*// 边框样式*/
        border: 1px solid #eaeaea;
        /*// 边框阴影*/
        box-shadow: 0 0 25px #cac6c6;

    }
    .logtitle{
        margin: 15px auto 40px auto;
        text-align: center;
        color: #505458;
        font-family: 站酷庆科黄油体;
    }
    .loginRen{
        text-align: center;
        margin: 0px 0px 35px 0px;
    }
    .fontclass{
        font-size: 35px;
        font-family: 站酷庆科黄油体;
    }
</style>