<template>
  <div>
    <!--弹性盒子元素在主轴（横轴）方向上的对齐方式。-->
    <div style="display: flex;justify-content: center;margin-top: 10px 10px">
      <el-input class="addPosInput"
                placeholder="请输入用户名进行搜索..."
                prefix-icon="el-icon-search"
                v-model="name"
                @keyup.enter.native="searchname">
      </el-input>
      <el-button icon="el-icon-search"
                 type="primary"
                 @click="searchname">搜索</el-button>
    </div>
    
    <div class="center-right-infinite-lists"
         v-loading.fullscreen.lock="loading"
         element-loading-spinner="fa fa-spinner fa-pulse fa-3x fa-fw"
         style="margin-top: 10px">
      <el-scrollbar style="height: 100%">
        <div class="hr-container">
          <el-card class="box-card"
                   v-for="(hr, index) in hrs"
                   :key="index">
            <div slot="header">
              <span style="font-family: 站酷庆科黄油体;font-size: 25px">{{hr.name}}</span>
              <el-button style="float: right; padding: 3px 0;color: red"
                         type="text"
                         size="mini"
                         icon="el-icon-delete"
                         @click="deletehr(hr)"></el-button>
            </div>
            <div>
              <div class="img-container">
                <el-divider>
                  <el-image :src="hr.userface"
                            :alt="hr.name"
                            :title="hr.name"
                            class="userface-img" />
                </el-divider>
              </div>
              <div style="margin-top: 20px;font-size: 16px;lineHeight:2">
                <div>用户名：{{hr.name}}</div>
                <div>手机号码：{{hr.phone}}</div>
                <div>电话号码：{{hr.telephone}}</div>
                <div>地 址：{{hr.address}}</div>
                <div>用户状态：
                  <el-switch v-model="hr.enabled"
                             active-color="#13ce66"
                             inactive-color="#ff4949"
                             @change="updatenable(hr)"></el-switch>
                </div>
                <div>用户角色：
                  <el-tag v-for="(role,indexj) in hr.roles"
                          size="mini"
                          :key="indexj"
                          type="success"
                          effect="dark"
                          style="margin-right: 5px">
                    {{ role.namezh}}
                  </el-tag>
                  <el-popover @show="showrol(hr)"
                              @after-leave="hiderol(hr)"
                              title="角色列表"
                              width="200"
                              trigger="click">
                              <template>
                    <el-select v-model="selectroles"
                               multiple
                               :popper-append-to-body="false"
                               placeholder="请选择">
                      <el-option v-for="(item, index) in roles"
                                 :key="index"
                                 :label="item.namezh"
                                
                                 :value="item.id">
                      </el-option>
                    </el-select>
                    </template>
                    <el-button icon="el-icon-edit"
                               type="text"
                               slot="reference"></el-button>
                  </el-popover>
                </div>
                <div>备注：{{hr.remark}}</div>
              </div>
            </div>
          </el-card>
        </div>
         <el-backtop target=".center-right-infinite-lists .el-scrollbar__wrap  "></el-backtop>

      </el-scrollbar>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      name: '',
      hrs: [],
      roles: [],
      selectroles: [],
      loading: false,

    }
  },
  mounted () {
    this.inithrs();
    this.initroles()
  },
  methods: {
    deletehr (hr) {
      this.$confirm('此操作将永久删除【' + hr.name + '】用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$notify.success({
          title: '删除讯息',
          message: '删 除 用 户 中...',
          showClose: false,
          offset: 100,
          duration: 4000,
          customClass: 'fontclasssysuser'
        });
        this.deleteRequest("/system/hr/" + hr.id).then(resp => {
          if (resp) {
            this.initrps();
          }
          this.inithrs();
        })
      }).catch(() => {
        this.$notify.info({
          title: '删除讯息',
          message: '以 取 消 删 除 ',
          showClose: false,
          offset: 100,
          duration: 4000,
          customClass: 'fontclasssysuser'
        });
      });
    },
    searchname () {
      if (!this.name) {
        this.$notify({
          title: '搜索讯息',
          message: '搜 索 字 段 为 空!...',
          showClose: false,
          offset: 100,
          duration: 2000,
          customClass: 'fontclasssysuser',
          type: 'warning'
        });
      }
      //   setTimeout(() => {
      //     this.$notify.success({
      //       title: '搜索讯息',
      //       message: '搜 索 职 位 中...',
      //       showClose: false,
      //       offset: 100,
      //       duration: 2000,
      //       customClass: 'fontclasssys'
      //     });
      //   }, 1000);
      this.getRequest("/system/hr/?name=" + this.name).then(resp => {
        if (resp) {
          /*更新数据+清空列表*/
          this.hrs = resp;
          this.name = '';
        }
      });
    },

    updatenable (hr) {
      delete hr.roles;
      delete hr.authorities;
      this.$notify.success({
        title: '修改讯息',
        message: '用 户 信 息 修 改 中...',
        showClose: false,
        offset: 200,
        duration: 2000,
        customClass: 'fontclasssysuser'
      });
      this.putRequest("/system/hr/", hr).then(resp => {
        if (resp) {
          this.inithrs();
        }
      });
    },
    hiderol (hr) {
      let url = "/system/hr/role?" + "hrid=" + hr.id;
      this.selectroles.forEach(id => {
        url += "&rids=" + id;
      })
      url+="&rids";
      this.selectroles = null;
      this.$notify.success({
        title: '修改讯息',
        message: '用 户 信 息 修 改 中...',
        showClose: false,
        offset: 200,
        duration: 2000,
        customClass: 'fontclasssysuser'
      });
      this.putRequest(url).then(resp => {
        if (resp) {
          this.inithrs();
        }
      });
    },
    showrol (hr) {
      //  this.initroles();
      let roles = hr.roles;
      this.selectroles = [];
      roles.forEach(r => {
        this.selectroles.push(r.id);
      })
    },
    initroles () {
      this.getRequest("/system/hr/roles").then(resp => {
        if (resp) {
          this.roles = resp;
        }
      });
    },
    inithrs () {
      setTimeout(() => {
        this.$notify.success({
          title: '系统讯息',
          message: '用 户 信 息 加 载 中...',
          showClose: false,
          offset: 200,
          duration: 2000,
          customClass: 'fontclasssysuser'
        });
      }, 900)
      this.loading = true;
      this.getRequest("/system/hr/?name=" + this.name).then(resp => {
        if (resp) {
          this.hrs = resp;
          this.loading = false;
        }

      });
    }
  },
  watch: {
    hrs: function () {
      if (this.hrs.length == 0) {
        setTimeout(() => {
          this.loading = false;
          this.$notify.info({
            title: '系统讯息',
            message: '没 有 用 户 信 息...',
            showClose: false,
            offset: 100,
            duration: 2000,
            customClass: 'fontclasssysuser'
          });
        }, 1000);
      }
    }
  }}
</script>

<style  >
.fontclasssysuser {
  font-family: 站酷庆科黄油体;
}

.center-right-infinite-lists {
  height: 750px;
  width: 100%;
}

.el-scrollbar__wrap {
  overflow-x: hidden;
}

.img-container {
  width: 100%;
  display: flex;
  /*项目位于容器的中心*/
  justify-content: center;
}

.userface-img {
  width: 72px;
  height: 72px;
  border-radius: 72px;
}

.addPosInput {
  display: flex;
  align-items: center;
  margin-right: 10px;
  width: 500px;
}

.hr-container .box-card {
  width: 300px;
  height: 450px;
  margin: 10px;
}

.hr-container {
  margin-top: 20px;
  display: flex;
  /*水平排练自动换行*/
  flex-wrap: wrap;
  /*目位于各行之前、之间、之后都留有空白的容器内。*/
  justify-content: space-around;
  overflow-x: hidden;
}
</style>