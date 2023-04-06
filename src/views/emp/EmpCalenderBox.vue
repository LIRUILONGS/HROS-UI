<template>
  <div>
    <el-calendar :first-day-of-week="7">
      <template slot="dateCell" slot-scope="{ data }" >
        {{ data.day.split("-").slice(2).join("-") }}
        <br>
        <el-button type="text" @click="open(data)"  v-if="allDate.indexOf(data.day) === -1">补签</el-button>
        <div v-if="allDate.indexOf(data.day) !== -1  " @click="handleDateChange" style="color: red">
          已签到
        </div>
      </template>
    </el-calendar>


  </div>

</template>
<style>
.is-selected {
  color: #1989FA;
}
</style>
<script>
export default {
  data() {
    return {
      wordDate:{
        date:""
      },
      selectedDate: new Date(), // 当前选中日期
      allDate: [],
      calendarData:[ { day: "2023-03-15",status:"pass", },
        { day: "2021-04-06",status:"unpass", },]
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    isDateGreaterThanToday(date) {
      const today = new Date();
      const select = new Date(date.day);
      return select.getTime() > today.getTime();
    },
    handleDateChange(date) {
      this.$notify.success({
        title: '签到',
        message: '已经签到过了',
        showClose: false,
        offset: 100,
        duration: 1500,
        customClass: 'fontclass'
      });
    },
    init(){
      this.getRequest("/system/hr/base").then(resp => {
        if (resp) {
          this.allDate = resp[0].workDate;
        }

      });
    },

    open(data) {
      if (this.isDateGreaterThanToday(data)){
        this.$notify.error({
          title: '签到',
          message: '对不起! 现在不是签到时间',
          showClose: false,
          offset: 100,
          duration: 1500,
          customClass: 'fontclass'
        });
        return;
      }
      this.$confirm('是否确定签到?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(data.day)
        this.wordDate.date = data.day;
        this.postRequest("/system/hr/wordDate", this.wordDate).then(resp => {
          if (resp) {
             this.init();
          }

        });
        this.$notify.success({
          title: '签到',
          message: '签到成功',
          showClose: false,
          offset: 100,
          duration: 1500,
          customClass: 'fontclass'
        });
      }).catch(() => {
        this.$notify.warning({
          title: '签到',
          message: '已取消签到',
          showClose: false,
          offset: 100,
          duration: 1500,
          customClass: 'fontclass'
        });
      });
    }
  },
};
</script>
