<template>
  <div>
    <div class="content-style">
      <el-scrollbar style="height: 100%">
        <div>
          <el-table :data="emps"
                    stripe
                    border
                    max-height="760"
                    v-loading.fullscreen.lock="loading"
                    element-loading-spinner="fa fa-spinner fa-pulse fa-3x fa-fw"
                    :customClass="loadingstyle"
                    style="width: 100%;height: 755px"
                    @selection-change="handleSelectionChange">
            <el-table-column type="selection"
                             width="55">
            </el-table-column>
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left"
                         inline
                         class="demo-table-expand">
                  <el-form-item class="tag-group" label="账套名称:"> <span>{{props.row.salary.name}}</span></el-form-item>
                  <el-form-item  class="tag-group" label="基本工资:"> <span>{{props.row.salary.basicsalary}}</span></el-form-item>
                  <el-form-item label="交通补助:"> <span>{{props.row.salary.trafficsalary}}</span></el-form-item>
                  <el-form-item label="午餐补助:"> <span>{{props.row.salary.lunchsalary}}</span></el-form-item>
                  <el-form-item label="奖金:"> <span>{{props.row.salary.bonus}}</span></el-form-item>
                  <el-form-item label="启用时间:"> <span>{{props.row.salary.createdate}}</span></el-form-item>
                  <el-form-item label="养老金比率:"> <span>{{props.row.salary.pensionper}}</span></el-form-item>
                  <el-form-item label="养老金基数:"> <span>{{props.row.salary.pensionbase}}</span></el-form-item>
                  <el-form-item label="医疗保险比率:"> <span>{{props.row.salary.medicalper}}</span></el-form-item>
                  <el-form-item label="医疗保险基数:"> <span>{{props.row.salary.medicalbase}}</span></el-form-item>
                  <el-form-item label="公积金比率:"> <span>{{props.row.salary.accumulationfundper}}</span></el-form-item>
                  <el-form-item label="公积金基数:"> <span>{{props.row.salary.accumulationfundbase}}</span></el-form-item>
                </el-form>
              </template>

            </el-table-column>

            <el-table-column prop="name"
                             align="left"
                             label="姓名"
                             width="100">
            </el-table-column>
            <el-table-column prop="workid"
                             label="工号"
                             align="left"
                             width="85">
            </el-table-column>
            <el-table-column prop="email"
                             width="180"
                             align="left"
                             label="电子邮件">
            </el-table-column>
            <el-table-column prop="phone"
                             width="100"
                             align="left"
                             label="电话号码">
            </el-table-column>
            <el-table-column prop="department.name"
                             width="100"
                             align="left"
                             label="所属部门">
            </el-table-column>
            <el-table-column prop="position.name"
                             width="120"
                             label="职位"
                             :filters="data"
                             :filter-method="filterTag"
                             filter-placement="bottom-end">
            </el-table-column>
            <el-table-column prop="jobLevel.name"
                             width="120"
                             label="职称"
                             :filters="data1"
                             :filter-method="filterTag1"
                             filter-placement="bottom-end">
            </el-table-column>

            <el-table-column prop="begincontract"
                             width="120"
                             align="left"
                             label="合同起始日期">
            </el-table-column>
            <el-table-column prop="endcontract"
                             width="120"
                             align="left"
                             label="合同截止日期">
            </el-table-column>
            <el-table-column align="left"
                             width="120"
                             label="合同期限">
              <template slot-scope="scope">
                <el-tag size="mini">{{scope.row.contractterm}}</el-tag>
                年
              </template>
            </el-table-column>

            <el-table-column align="center">
              <template slot="header"
                        slot-scope="scope">
                <el-input placeholder="请输入员工名进行搜索"
                          prefix-icon="el-icon-search"
                          clearable
                          :value="scope"
                          @clear="initEmps"
                          style="width: 200px;"
                          v-model="keyword"
                          @keydown.enter.native="initEmps"
                          :disabled="showAdvanceSearchView"></el-input>
              </template>
              <el-table-column prop="salary.allsalary"
                               label="工资结算(元)">
              </el-table-column>
            </el-table-column>

          </el-table>
        </div>
      </el-scrollbar>
    </div>
    <div class="bottom-style">

      <el-pagination style="margin-top: 10px"
                     background
                     @current-change="currentChange"
                     @size-change="sizeChange"
                     layout="sizes, prev, pager, next, jumper, ->, total, slot"
                     :total="total"
                     :page-sizes="[20,40,60,70]">
      </el-pagination>

    </div>

  </div>
</template>
<script>
export default {
  name: "Addjc",
  inject: ["reload"],
  data () {
    return {
      data: [],
      datas: null,
      data1: [],
      value: [],
      number: 1,
      textarea: '',
      multipleSelection: [],
      centerDialogVisible: false,
      beginDateScope: [],
      title: '',
      allDeps: [],
      emps: [],
      loading: false,
      popVisible: false,
      popVisible1: false,
      dialogVisible: false,
      dialogVisibles: false,
      positions: [],
      joblevels: [],
      total: 0,
      page: 1,
      keyword: '',
      size: 20,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      employeetrain: {
        eid: '',
        trainstartdate: "",
        trainfinishdate: '',
        traincontent: '',
        trainstatus: '',
        remark: '',
      },
      appraise: {
        id: '',
        eid: '',
        appdate: '',
        appresult: '',
        appcontent: '',
        remark: ''
      },
    }
  },
  mounted () {
    this.initEmps();
    this.initjob();
    this.initPositions();
  },
  methods: {

    addMany () {
      this.dialogVisible = true;
    },
    initjob () {
      this.getRequest('/personnel/train/joblevels').then(resp => {
        if (resp) {
          this.joblevels = resp;
          this.generateData1(this.joblevels)
        }
      })
    },
    initPositions () {
      this.getRequest('/personnel/train/positions').then(resp => {
        if (resp) {
          this.positions = resp;
          this.generateData(this.positions);
        }
      })
    },

    showEditEmpView (data) {
      this.dialogVisible = true;
      this.employeetrain.eid = data.id;

    },
    showEmpView (data) {
      this.appraise.eid = data.id;
      this.dialogVisibles = true;

    },
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },

    /**/
    searvhViewHandleNodeClick (data) {
      this.inputDepName = data.name;
      this.searchValue.departmentid = data.id;
      this.popVisible1 = !this.popVisible1
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
      let url = '/salary/table/?page=' + this.page + '&size=' + this.size;
      if (type && type == 'advanced') {
        this.$notify.success({
          title: '搜索讯息',
          message: '搜 索 员 工 中...',
          showClose: false,
          offset: 100,
          duration: 2000,
          customClass: 'fontclass'
        });

      } else if (this.keyword) {
        this.$notify.success({
          title: '搜索讯息',
          message: '搜 索 员 工 中...',
          showClose: false,
          offset: 100,
          duration: 2000,
          customClass: 'fontclass'
        });
        url += "&name=" + this.keyword;
      }
      /*数据 返回*/
       this.$notify.success({
          title: '系统讯息',
          message: ' 员 工 账 套 工 资 加 载 中...',
          showClose: false,
          offset: 100,
          duration: 2000,
          customClass: 'fontclass'
        });
      this.getRequest(url).then(resp => {
        this.loading = false;
        if (resp) {
          this.emps = resp.data;
          /*总记录数*/
          this.total = resp.total;
          this.searchValue = [];
          this.keyword = '';
        }
      });
    },
    filterTag (value, row) {
      return row.posid === value;
    },
    filterTag1 (value, row) {
      return row.joblevelid === value;
    },
    generateData (cities) {
      cities.forEach((city) => {
        this.data.push({
          text: city.name,
          value: city.id,
        });
      });
    },
    generateData1 (cities) {
      cities.forEach((city) => {
        this.data1.push({
          text: city.name,
          value: city.id,
        });
      });
    },
  }
}
</script>
<style  scoped>
.top-style {
  /*定义弹性布局*/
  display: flex;
  /*分布方式*/
  justify-content: space-between;
}

.content-style {
  margin-top: 10px;
}

.content-style .el-scrollbar__wrap {
  overflow: scroll;
}

.bottom-style {
  display: flex;
  justify-content: space-between;
}

.fontclasssys {
  font-family: 站酷庆科黄油体;
}

.loadingstyle {
  font-family: 站酷庆科黄油体;
  font-size: 25px;
}
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all 0.8s ease;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
