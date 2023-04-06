<template>
  <div>
    <div style="margin-top:30px; "
         v-loading.fullscreen.lock="loading"
         element-loading-spinner="fa fa-spinner fa-pulse fa-3x fa-fw">
      <el-carousel type="card"
                   :interval="2000"
                   height="740px"
                   style="overflow-y: hidden;padding-bottom:30px">
        <el-carousel-item v-for="(item,index) in datas"
                          style="border-radius: 15px;border: 1px solid #eaeaea; box-shadow: 0 0 25px #EBEEF5;"
                          :key="index">
          <div>
            <ve-pie :data="item.chartData"
                    height="700px"
                    width="800px"
                    :tooltip-visible="false"
                    :judge-width="true"
                    :settings="item.chartSettings"></ve-pie>
            <div style="display:felx;;color:#000000;text-align: center;font-size:35px;font-family: 站酷庆科黄油体"> {{item.title}}</div>
          </div>

        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>



<script>
export default {
  name: "StaPers",
  data () {
    return {
      loading: false,
      datas: [
        {
          title: "职位分布",
          chartSettings: {
            radius: 200,
            offsetY: 350,

          },

          chartData: {
            columns: [],
            rows: []
          }
        },
        {
          title: "职称分布",
          chartSettings: {
            roseType: 'radius',
            radius: 200,
            offsetY: 350,
          },
          chartData: {
            columns: [],
            rows: []
          }
        },
        {
          title: "部门员工分布",
          chartSettings: {
            radius: 200,
            offsetY: 350,
          },
          chartData: {
            columns: [],
            rows: [
            ]
          }

        },
        {
          title: "学历分布",
          chartSettings: {
            roseType: 'radius',
            radius: 200,
            offsetY: 350,
             label: { show: true, position: "top" },
          },
          chartData: {
            columns: [],
            rows: []
          }
        },
        {
          title: "所在高校分布",
          chartSettings: {
            roseType: 'radius',
            radius: 200,
            offsetY: 350,
             label: { show: true,position: "top" },
          },
          chartData: {
            columns: [],
            rows: []
          }
        },
        {
          // title: "民族分布",
          // chartSettings: {
          //   radius: 200,
          //   offsetY: 350,
          // },
          // chartData: {
          //   columns: ["name", "sum"],
          //   rows: []
          // }
        },
        {
          title: "党派分布",
          chartSettings: {
            roseType: 'radius',
            radius: 200,
            offsetY: 350,
          },
          chartData: {
            columns: ["name", "sum"],
            rows: []
          }
        }
      ],

    }
  },
  mounted () {

    this.initpoin();
    this.initjob();
    this.initdep();
    this.inittip();
    this.initsch();
    this.initnation();
    this.initpins();
  },
  methods: {
    initpoin () {
      this.loading = true;
      this.$notify.success({
        title: '系统讯息',
        message: '人 事 信 息 统 计 数 据 加 载 中...',
        showClose: false,
        offset: 100,
        duration: 5000,
        customClass: 'fontclass'
      });
      this.getRequest("/statistics/personnel/Position").then(resp => {
        if (resp) {
          this.datas[0].chartData.columns = ["name", "sum"];
          this.datas[0].chartData.rows = resp;
        }
      });
    },
    initjob () {
      this.getRequest("/statistics/personnel/JobLevel").then(resp => {
        if (resp) {
          this.datas[1].chartData.columns = ["name", "sum"];
          this.datas[1].chartData.rows = resp;
        }
      });
    },
    initdep () {
      this.getRequest("/statistics/personnel/Department").then(resp => {
        if (resp) {
          this.datas[2].chartData.columns = ["name", "sum"];
          this.datas[2].chartData.rows = resp;
        }
      });
    },
    inittip () {
      this.getRequest("/statistics/personnel/tiptopdegree").then(resp => {
        if (resp) {
          this.datas[3].chartData.columns = ["name", "sum"];
          this.datas[3].chartData.rows = resp;
        }
      });
    },
    initsch () {

      this.getRequest("/statistics/personnel/school").then(resp => {
        if (resp) {
          this.datas[4].chartData.columns = ["name", "sum"];
          this.datas[4].chartData.rows = resp;

        }
      });
    },
    initnation () {
      // this.getRequest("/statistics/personnel/nation").then(resp => {
      //   if (resp) {
      //     this.datas[5].chartData.columns = ["name", "sum"];
      //     this.datas[5].chartData.rows = resp;
      //
      //   }
      // });
    },
    initpins () {
      this.getRequest("/statistics/personnel/politicsstatus").then(resp => {
        if (resp) {
          this.datas[6].chartData.columns = ["name", "sum"];
          this.datas[6].chartData.rows = resp;
          this.loading = false;
        }
      });
    },
  }
}
</script>

<style scoped>
.fontclass {
  font-size: 35px;
  font-family: 站酷庆科黄油体;
}
.el-carousel__item div {
  color: #475669;
  opacity: 1;
}
.el-carousel__item {
}

.el-carousel__item:nth-child(2n) {
  /* background-color: #ebeef5; */
}

.el-carousel__item:nth-child(2n + 1) {
  /* background-color: #f2f6fc; */
}
</style>
