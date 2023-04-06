<template>
  <div>
    <div style="margin-top:30px;display:flex ;justify-content: center;">
      <div style="width:1500px">
        <el-carousel indicator-position="outside"
                     height="740px"
                     style="overflow-y: hidden;padding-bottom:30px;">
          <el-carousel-item v-for="(item,index) in datas"
                            :key="index"
                            style="">
            <ve-line :data="item.chartData"
                     :settings="item.chartSettings"
                     height="700px"
                     width="100%"
                     :judge-width="true"></ve-line>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      salaryData: [],
      datas: [
        {
          chartSettings: {
            stack: {'部门名称': ['部门名称', '平均薪资']},
            area: true
          },
          chartData: {
            columns: ['部门名称', '平均薪资'],
            rows: []
          }
        }]
    }

  },
  methods: {
    initpoin() {
      this.loading = true;
      this.$notify.success({
        title: '平均薪资',
        message: '平 均 薪 资 统 计 数 据 加 载 中...',
        showClose: false,
        offset: 100,
        duration: 5000,
        customClass: 'fontclass'
      });
      this.getRequest("/statistics/score/getSalaryData").then(resp => {
        if (resp) {
          // this.datas[0].chartData.columns = ["name", "sum"];
          this.datas[0].chartData.rows = resp;
        }
      });
    },
  },
  mounted() {
    this.initpoin();
  }
}

</script>

<style>
.el-carousel__item div {
  color: #475669;
  opacity: 0.95;
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
