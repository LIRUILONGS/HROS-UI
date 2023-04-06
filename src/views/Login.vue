<template style="width: 100%;height: 100%;" >
  <div v-loading.fullscreen.lock="loading"
       class="login"
       element-loading-spinner="fa fa-spinner fa-pulse fa-3x fa-fw">
    <el-form :rules="rules"
             :model="loginFrom"
             class="logContainer"
             ref="loginFrom"
             @keydown.enter.native="loginSubmit">
      <h2 class="logtitle"><i class="fa fa-magnet fa-2x"
             style="color: #505458" />智 慧&nbsp;人 事 管 理</h2>
      <el-form-item prop="username">
        <el-input type="text"
                  v-model="loginFrom.username"
                  placeholder="请输入用户名"
                  auto-complete="off">
          <i slot="prefix"
             class="el-icon-user"></i>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password"
                  v-model="loginFrom.password"
                  placeholder="请输入密码"
                  auto-complete="off">
          <i slot="prefix"
             class="el-icon-lock"></i>
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="loginFrom.code"
                  auto-complete="off"
                  placeholder="验证码"
                  style="width: 63%"
                  @keyup.enter.native="loginSubmit">
          <i slot="prefix"
             class="el-icon-view"></i>
        </el-input>
        <div class="login-code">
          <img :src="codeUrl"
               @click="getCode">
        </div>
      </el-form-item>
      <el-checkbox v-model="loginFrom.rememberMe"
                   style="margin:0 0 25px 0;">
        记住我
      </el-checkbox>
      <el-button type="primary"
                 style="width: 100%"
                 @click="loginSubmit">登录</el-button>
    </el-form>
  </div>
</template>

<script>
// import {postKeyValueRequest} from '../utils/api';
// 在main.js里以插件形似全局导入

export default {
  data () {
    return {
      codeUrl: '',
      cookiePass: '',
      loading: false,
      redirect: undefined,
      loginFrom: {
        username: 'admin',
        password: '123',
        code: '',
        rememberMe:''
      },
      checked: true,
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: blur() },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        code: [{ required: true, trigger: 'change', message: '验证码不能为空' }]
      }
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created () {
    this.getCode()

  },
  methods: {

    getCode () {
      this.getRequest("/auth/code").then(resp => {
          if(resp){
          console.log(resp)
        this.codeUrl = resp.img;
        this.loginForm.uuid = resp.uuid;
        console.log(this.codeUrl );
        }
      });
    },
    loginSubmit () {
      //提交前空值校验
      this.$refs.loginFrom.validate((valid) => {
        if (valid) {
          // alert('submit!');
          this.loading = true;
          this.postKeyValueRequest('/doLogin', this.loginFrom
          ).then(data => {
            this.loading = false;
            if (data) {

              //方法将 JavaScript 的json对象转换为字符串。
              //将得到数存储在SessionStorage里
              window.sessionStorage.setItem("user", JSON.stringify(data.obj))
              //获取路由对象
              this.$router.replace('/home')
            }
          })
        } else {
          this.$notify.info({
            title: '系 统 讯 息',
            message: '输入框信息不完整哦!',
            showClose: false,
            offset: 100,
            duration: 5000,
            customClass: 'fontclass'
          });
        }
      });

    }
  }
}
</script>

<style >
.fontclass {
  font-size: 35px;
  font-family: 站酷庆科黄油体;
}

.login {
  background-size: 100% 100%;
    width: 100%;
    height: 100%;
    position: fixed;
   background-image: url(../assets/images/timg.jpg);
}
.logContainer {
  /* //圆角边框*/
  border-radius: 15px;
  /*背景裁剪在背景边框内部*/
  background-clip: padding-box;
  /*//外边距*/
  margin: 250px auto;
  /*//宽度*/
  width: 350px;
  /*//内边距*/
  padding: 35px 35px 15px 35px;
  /*//背景色*/
  background: transparent;
  background-image: radial-gradient(#ffffff, transparent);
  /*// 边框样式*/
  border: 1px solid #eaeaea;
  /*// 边框阴影*/
  box-shadow: 0 0 25px #cac6c6;
}
.logtitle {
  margin: 0px auto 20px auto;
  text-align: center;
  color: #505458;
  font-family: 站酷庆科黄油体;
}
.loginRen {
  text-align: center;
  margin: 0px 0px 35px 0px;
}
.fontclass {
  font-size: 35px;
  font-family: 站酷庆科黄油体;
}
.login-code {
  width: 33%;
  display: inline-block;
  height: 38px;
  float: right;
}
.login-code img {
  cursor: pointer;
  vertical-align: middle;
}
</style>
