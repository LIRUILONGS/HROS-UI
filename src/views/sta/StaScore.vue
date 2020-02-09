<template>
  <div>
    <div style="margin-top:30px;display:flex ;justify-content: center;"
         v-loading.fullscreen.lock="loading"
         element-loading-spinner="fa fa-spinner fa-pulse fa-3x fa-fw">
      <div style="width:1500px;height:840">
            <div style="display:felx;;color:#000000;text-align: center;font-size:35px;font-family: 站酷庆科黄油体">  积 分 统 计</div>

       <ve-bar :data="chartData"
                 :settings="chartSettings" :extend="extend"
                 height="740px"
                 width="100%"
                 :judge-width="true">

                 </ve-bar>

      </div>
    </div>
  </div>
  
</template>

<script>
export default {
  name: "StaScore",
  data () {
    this.extend = {
      'xAxis.0.axisLabel.rotate': 45,
    }
    return {
      loading: false,
      chartSettings: {
        showDataZoom: true,
       
        labelMap: {
          "name": "工号",
          "sum": "积分",
        },
      },

      chartData: {
        columns: [],
        rows: []
      }
    }
  },
  mounted () {
    this.initpoin();
  },
  methods: {
    initpoin () {
      this.loading = true;
      this.$notify.success({
        title: '系统讯息',
        message: '积 分 统 计 数 据 加 载 中...',
        showClose: false,
        offset: 100,
        duration: 5000,
        customClass: 'fontclass'
      });
      this.getRequest("/statistics/score/").then(resp => {
        if (resp) {
          this.chartData.columns = ["name", "sum"];
          this.chartData.rows = resp;
          this.loading = false;

        }
      });
    },
  }
}
</script>

<style >
.fontclass {
  font-size: 35px;
  font-family: 站酷庆科黄油体;
}
</style>