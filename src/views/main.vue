<template>
  <div style="display: flex;justify-content: space-between; ">
    <div style="width: 300px">
      <el-timeline>
        <!--icon="fa fa-circle-o-notch fa-spin fa-3x fa-fw"-->
        <el-timeline-item placement="top"
                          :type="activity.type"
                          :color="activity.color"
                          :size="activity.size"
                          :timestamp="activity.timestamp">
          <el-card>

            <h4>王小虎 提交于 2018/4/12 20:46</h4>
          </el-card>
        </el-timeline-item>
        <el-timeline-item placement="top"
                          :icon="activity.icon"
                          :type="activity.type"
                          :color="activity.color"
                          :size="activity.size"
                          :timestamp="activity.timestamp">
          <el-card>
            <h4>王小虎 调动 2018/4/12 20:46</h4>
          </el-card>
        </el-timeline-item>
        <el-timeline-item placement="top"
                          :icon="activity.icon"
                          :type="activity.type"
                          :color="activity.color"
                          :size="activity.size"
                          :timestamp="activity.timestamp">
          <el-card>
            <h4>王小虎 离职 2018/4/12 20:46</h4>
          </el-card>
        </el-timeline-item>
        <el-timeline-item placement="top"
                          :icon="activity.icon"
                          :type="activity.type"
                          :color="activity.color"
                          :size="activity.size"
                          :timestamp="activity.timestamp">
          <el-card>
            <h4>王小虎 入职</h4>
          </el-card>
        </el-timeline-item>

      </el-timeline>
    </div>
    <div style="display: flex;margin-right: 10px;flex-wrap: wrap">
   
     <div style="font-size: 30px;display:flex;justify-content: center;font-family:站酷庆科黄油体;width:100%">公 告</div> 

      <div class="center-right-infinite-lists">
          <el-scrollbar style="height:100%;">
            <div class="infinite-list-wrapper"
                 style="overflow:auto;display: flex; align-items: center">

              <ul class="list"
                  style="align-items: center"
                  v-loading.fullscreen.lock="loading"
                  element-loading-spinner="fa fa-spinner fa-pulse fa-3x fa-fw"
                  v-infinite-scroll="load"
                  infinite-scroll-disabled="disabled">

                <li v-for="(mainnotice,index ) in mainnotices"
                    :key="index"
                    class="list-item"
                    :style="{width:rightclass}">
                  <el-card class="box-cards">
                    <div slot="header"
                        
                         style="height:1px;width:100%">
                      <span style="font-family: 站酷庆科黄油体;font-size: 30px;margin-top: 10px; margin-bottom:10px;">TITLE:{{mainnotice.title}}</span>
                      <el-button style="float: right; padding: 3px 0;font-size: 15px;font-family: 站酷庆科黄油体"
                                 type="text">
                        RELEASETIME:{{mainnotice.createTime}}
                      </el-button>
                      <el-button style="float: right;margin-right:15px; padding: 3px 0;font-size: 15px;font-family: 站酷庆科黄油体"
                                 type="text">
                        ISSUER:{{mainnotice.authon}}
                      </el-button>
                    </div>
                    <div class="ql-container ql-snow">
                      <div class="ql-editor">
                        <Xqs class="details_box"
                             v-html="mainnotice.mainbody"></Xqs>
                      </div>
                    </div>
                  </el-card>
                </li>
              </ul>
            </div>
          </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "main",
  data () {
    return {
      mainnotices: [],
      mainnotice: {
        id: '',
        title: '',
        mainbody: '',
        authon: '',
        createtime: '',
        updatetime: '',

      },
      loading: false,
      count: 2,
      activity: {
        content: '支持使用图标',
        timestamp: '2018-04-12 20:46',
        size: 'large',
        type: 'primary',
        icon: 'fa fa-cog fa-spin fa-5x fa-fw',
        color: '#409eff'
      },
      imagesbox: [{
        id: 3,
        idView: require("../common/img/tu3.png")
      }, {
        id: 4,
        idView: require("../common/img/tu4.png")
      }, {
        id: 5,
        idView: require("../common/img/tu5.png")
      },]
    }
  },
  mounted () {
    this.initAmg();
  },
  methods: {

    initAmg () {
      this.loading = true;
      this.getRequest("/body/").then(resp => {
        if (resp) {
          this.loading = false;
          this.mainnotices = resp;
        }
      })
    },
    load () {


    },
  },
  computed: {
    routes () {
      return this.$store.state.routes
    },
    noMore () {
      return this.count >= 25
    },
    disabled () {
      return this.loading || this.noMore
    }

  },
}
</script>

<style >

.box-cards {
  overflow-x: hidden;
}
.center-right-infinite-lists .el-scrollbar__wrap {
  overflow-x: hidden;
}

.infinite-list-wrapper {
  overflow-x: hidden;
}

.center-right-infinite-lists {
  width: 1500px;
  height: 740px;
  overflow-x: hidden;
}
/*如果内容被修剪，则浏览器会显示滚动条以便查看其余的内容。*/
/* overflow: auto;*/
/*如果它溢出了元素的内容区-剪辑div元素的左/右边缘内容：*/
/* overflow-x: hidden;*/

.list-item {
  border-radius: 8px;
  margin-top: 5px;
  margin-bottom: 50px;
  margin-right: 20px;
  /*// 边框阴影*/
  /* box-shadow: 0 0 30px #cac6c6;*/
  /*背景裁剪在背景边框内部*/
  background-clip: padding-box;
  background: #ffffff;
  color: #475669;
  font-size: 25px;
}

.homeWelcome {
  text-align: center;
  font-size: 30px;
  font-family: 站酷庆科黄油体;
  color: #409eff;
  /*display: flex;
        align-items: center;*/
}

</style>