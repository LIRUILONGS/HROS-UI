<template>
  <div>
    <div style="margin-top:30px;display:flex ;justify-content: center;"
         v-loading.fullscreen.lock="loading"
         element-loading-spinner="fa fa-spinner fa-pulse fa-3x fa-fw">
      <div style="width:100%;color:#E6A23C">
        <el-carousel indicator-position="outside"
                     height="740px"
                     type="card"
                     :interval="4000"
                     style="border-radius: 15px;overflow-y: hidden;padding-bottom:30px;">
          <el-carousel-item v-for="(item,index) in datas"
                            :key="index"
                            style="border-radius: 15px;border: 1px solid #eaeaea; box-shadow: 0 0 25px #EBEEF5;">
<div style="display:felx;text-align: center;font-size:35px;font-size:35px;font-family: 站酷庆科黄油体;margin: 0px;padding:0px;height:30px"> {{item.title}}</div>            

            <ve-histogram :data="item.chartData"
                          :settings="item.chartSettings"
                          height="700px"
                          width="100%"
                          :judge-width="true">
                          </ve-histogram>

          </el-carousel-item>

        </el-carousel>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StaRecord",
  data () {
    return {
      datas: [
        {
          title: "部门人事分析",
          chartSettings: {

            showLine: ['aDouble',],
            yAxisName: ['人数', '比率'],
            xAxis: {
              axisLabel: {
                rotate: 45,
              }
            },
            label: { show: true, position: "left" },
            labelMap: {
              "dimission": "离职人数",
              "entrant": "入职人数",
              "aDouble": "离职率"
            },

          },

          chartData: {
            columns: [],
            rows: [

            ]
          }
        },
        {
          title: "职位人事分析",
          chartSettings: {
            showLine: ['entrant', 'dimission'],
            yAxisName: ['人数', '比率'],
            xAxis: {
              axisLabel: {
                rotate: 45,
              }
            },
            label: { show: true, position: "top" },
            labelMap: {
              "dimission": "离职人数",
              "entrant": "入职人数",
              "aDouble": "离职率",
              "sum": "平均离职工龄",
            },
          },
          chartData: {
            columns: [],
            rows: []

          }
        },
        {
          title: "职称人事分析",
          chartSettings: {
            showLine: ['entrant', 'aDouble'],
            yAxisName: ['人数', '比率'],
            xAxis: {
              axisLabel: {
                rotate: 45,
              }
            },
            label: { show: true, position: "top" },
            labelMap: {
              "dimission": "离职人数",
              "entrant": "入职人数",
              "aDouble": "离职率",
              "sum": "平均离职年龄",
            },
          },
          chartData: {
            columns: [],
            rows: []

          }
        },
      ],
      loading: false,
    }
  },
  mounted () {
    this.initpoin();
    this.initpin();
    this.initJop();
  },
  methods: {
    initpoin () {
      this.loading = true;
      this.$notify.success({
        title: '系统讯息',
        message: '人 事 记 录 统 计 数 据 加 载 中...',
        showClose: false,
        offset: 100,
        duration: 5000,
        customClass: 'fontclass'
      });
      this.getRequest("/statistics/recored/department").then(resp => {
        if (resp) {
          this.datas[0].chartData.columns = ["name", "entrant", "dimission", "aDouble"];
          this.datas[0].chartData.rows = resp;

        }
      });
    },
    initpin () {
      this.getRequest("/statistics/recored/workAge").then(resp => {
        if (resp) {
          this.datas[1].chartData.columns = ["name", "entrant", "dimission", "aDouble", "sum"];
          this.datas[1].chartData.rows = resp;

        }
      });
    },
    initJop () {
      this.getRequest("/statistics/recored/JobLevel").then(resp => {
        if (resp) {
          this.datas[2].chartData.columns = ["name", "entrant", "dimission", "aDouble", "sum"];
          this.datas[2].chartData.rows = resp;
          this.loading = false;
        }
      });
    }
  }
}
</script>
<style scoped>
.el-carousel__item {
  font-size: 18px;
  opacity: 0.85;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #F2F6FC;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #F2F6FC;
}
</style>