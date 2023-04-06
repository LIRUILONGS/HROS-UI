<template>
  <div>
    <div class="top-style">
      <div style="display: flex;justify-content: flex-start;" v-show="!this.keywordFrom">
        <el-input placeholder="请输入员工名进行搜索，可以直接回车搜索..."
                  prefix-icon="el-icon-search"
                  clearable
                  @clear="initEmps"
                  style="width: 350px;margin-right: 10px"
                  v-model="keyword"
                  @keydown.enter.native="initEmps"
                  :disabled="showAdvanceSearchView"></el-input>
        <el-button icon="el-icon-search"
                   type="primary"
                   @click="initEmps"
                   :disabled="showAdvanceSearchView">
          搜索
        </el-button>

        <el-button type="danger" s>{{keyword}}一共出勤{{allDate.length}}天</el-button>

      </div>
    </div>



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
  name: 'Workjc',
  props: {
    //父组件传来的值需定义一下
    keywordFrom: {
      type: Boolean, //类型
      default: false
    },
  },
  data() {
    return {
      wordDate:{
        date:""
      },
      selectedDate: new Date(), // 当前选中日期
      allDate: [],
      calendarData:[ { day: "2023-03-15",status:"pass", },
        { day: "2021-04-06",status:"unpass", },],
      value: [],
      textarea:'',
      multipleSelection: [],
      centerDialogVisible: false,
      showAdvanceSearchView: false,
      title: '',
      allDeps: [],
      emps: [],
      loading: false,
      popVisible: false,
      popVisible1: false,
      dialogVisible: false,
      total: 0,
      page: 1,
      keyword: '',
      size: 12,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      employeeec:{
        eid:'',
        ecdate:"",
        ecreason:'',
        ecpoint:'',
        ectype:'',
        remark:'',
      }
    };
  },
  mounted () {
    this.initrps();
    this.initPositions();
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
    // init(){
    //   this.getRequest("/system/hr/base").then(resp => {
    //     if (resp) {
    //       this.allDate = resp[0].workDate;
    //     }
    //
    //   });
    // },

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
        // console.log(data.day)
        // this.wordDate.date = data.day;
        // this.postRequest("/system/hr/wordDate", this.wordDate).then(resp => {
        //   if (resp) {
        //     this.init();
        //   }
        // });
        this.$notify.warning({
          title: '签到',
          message: '请去个人页面签到',
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
    },

    showEditEmpView (data) {
      this.centerDialogVisible = true;
      this.employeeec.eid = data.id;

    },

    deleteMany () {
      this.$confirm('此操作将永久删除【' + this.multipleSelection.length + '】条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$notify.success({
          title: '删除讯息',
          message: '删 除 员 工 中...',
          showClose: false,
          offset: 100,
          duration: 1500,
          customClass: 'fontclass'
        });
        let ids = '?';
        this.multipleSelection.forEach(item => {
          ids += 'ids=' + item.id + '&';
        })
        this.deleteRequest("/employee/basic/many/" + ids).then(resp => {
          if (resp) {
            this.initEmps();
          }
        })
      }).catch(() => {
        this.$notify.info({
          title: '删除讯息',
          message: '以 取 消 删 除 ',
          showClose: false,
          offset: 100,
          duration: 1500,
          customClass: 'fontclass'
        });
      });
    },
    /**/
    searvhViewHandleNodeClick (data) {
      this.inputDepName = data.name;
      this.searchValue.departmentid = data.id;
      this.popVisible1 = !this.popVisible1
    },
    doAddEmc () {
      this.centerDialogVisible = false;
      if (this.value.length != 0 && this.employeeec.ecreason && this.employeeec.remark) {
        this.$notify.success({
          title: '添加讯息',
          message: '添 加 奖 惩 中...',
          showClose: false,
          offset: 100,
          duration: 1500,
          customClass: 'fontclass'
        });

        let url = "/personnel/ec/?eid=" + this.employeeec.eid +"&ecreason="+ this.employeeec.ecreason +"&remark="+this.employeeec.remark;
        this.value.forEach((id) =>{
          url+="&ids="+id;
        })
        this.getRequest(url).then(resp => {
          if (resp) {

            this.value =[];
            this.employeeec = [];
            this.reload();
          }
        });
      }else{
        this.$notify({
          title: '添加讯息',
          message: '添 加 字 段 为 空!...',
          showClose: false,
          offset: 100,
          duration: 1500,
          customClass: 'fontclass',
          type: 'warning'
        });
      }
    },
    handleNodeClick (data) {
      this.inputDepName = data.name;
      this.emp.departmentid = data.id;
      this.popVisible = !this.popVisible
    },

    /*分页事件处理*/
    sizeChange (currentSize) {
      this.size = currentSize;
      this.initEmps();
    },
    currentChange (currentPage) {
      this.page = currentPage;
      this.initEmps();
    },

    /*初始化搜索处理*/
    initEmps (type) {
      this.loading = true;
      let url = '/personnel/ec/init?page=' + this.page + '&size=' + this.size;
      if (type && type == 'advanced') {
        this.$notify.success({
          title: '搜索讯息',
          message: '搜 索 员 工 中...',
          showClose: false,
          offset: 100,
          duration: 1500,
          customClass: 'fontclass'
        });

      } else if (this.keyword) {
        this.$notify.success({
          title: '搜索讯息',
          message: '搜 索 员 工 中...',
          showClose: false,
          offset: 100,
          duration: 1500,
          customClass: 'fontclass'
        });
        url += "&name=" + this.keyword;
      }
      /*数据 返回*/


      this.getRequest(url).then(resp => {
        this.loading = false;
        if (resp) {
          this.emps = resp.data;
          /*总记录数*/
          this.total = resp.total;
          this.searchValue = [];
          this.allDate = this.emps[0].hr.workDates;
          if (this.allDate == null || this.allDate === 0){
            this.allDate = [];
          }
          console.log(this.allDate)
        }
      });
    },
    initrps () {
      setTimeout(() => {
        this.$notify.success({
          title: '系统讯息',
          message: '奖 罚 规 则 信 息 加 载 中...',
          showClose: false,
          offset: 100,
          duration: 1500,
          customClass: 'fontclass'
        });
      }, 1200)
      this.getRequest("/personnel/ec/rp").then(resp => {
        if (resp) {
          this.generateData(resp);
        }
      });
    },
    generateData (cities) {
      cities.forEach((city) => {
        this.data.push({
          label: city.rpmsg,
          key: city.id,
        });
      });
    }
  },
};
</script>
