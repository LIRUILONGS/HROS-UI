<template>
  <div>
    <!-- <div class="top-style">
       <div style="display: flex;justify-content: flex-start;">
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
      </div> 
    </div> -->

    <div class="content-style">
      <el-scrollbar style="height: 100%">
        <div>
          <el-table :data="emps"
                    stripe
                    border
                    max-height="690"
                    v-loading.fullscreen.lock="loading"
                    element-loading-spinner="fa fa-spinner fa-pulse fa-3x fa-fw"
                    :customClass="loadingstyle"
                    style="width: 100%;height: 680px"
                    @selection-change="handleSelectionChange">
            <el-table-column type="selection"
                             width="55">
            </el-table-column>
            <el-table-column prop="name"
                             align="left"
                             label="姓名"
                             width="100">
            </el-table-column>
            <el-table-column prop="workid"
                             label="工号"
                             align="left"
                             width="100">
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
            <el-table-column prop="begindate"
                             width="95"
                             align="left"
                             label="入职日期">
            </el-table-column>
            <el-table-column prop="conversiontime"
                             width="95"
                             align="left"
                             label="转正日期">
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
              <template slot="header" slot-scope="scope"
                        >
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
              <template slot-scope="scope">
                <el-button type="primary"
                           @click="showEditEmpView(scope.row)"
                           style="padding: 3px">添加培训
                </el-button>
              </template>
            </el-table-column>

          </el-table>
        </div>
      </el-scrollbar>
    </div>
    <div class="bottom-style">
      <el-button type="success"
                 style="margin-top: 10px"
                 :disabled="multipleSelection.length==0"
                 @click="addMany">批量培训
      </el-button>
      <el-pagination style="margin-top: 10px"
                     background
                     @current-change="currentChange"
                     @size-change="sizeChange"
                     layout="sizes, prev, pager, next, jumper, ->, total, slot"
                     :total="total"
                     :page-sizes="[13,33,333,,3333]">
      </el-pagination>

    </div>
    <!--添加弹出框-->
    <el-dialog title="添加培训"
               :visible.sync="dialogVisible"
               width="25%"
             
               center>
      <el-form ref="form"
               :model="form"
               label-width="80px">
        <el-form-item label="培训内容">
          <el-input type="textarea"
                    placeholder="请输入培训内容..."
                    v-model="employeetrain.traincontent"
                    maxlength="30"
                    style="width:350px;margin-bottom:10px"
                    show-word-limit>
          </el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea"
                    placeholder="请输入备注..."
                    v-model="employeetrain.remark"
                    maxlength="30"
                    style="width:350px;margin-bottom:10px"
                    show-word-limit>
          </el-input>
        </el-form-item>
        <el-form-item label="培训周期">
          <el-date-picker v-model="beginDateScope"
                          type="daterange"
                          value-format="yyyy-MM-dd"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
          </el-date-picker>

        </el-form-item>

        <el-steps :active="number"
                  :space="200"
                  style="margin-top:20px"
                  align-center
                  finish-status="success">
          <el-step title="添加培训"></el-step>
          <el-step title="进行中"></el-step>
          <el-step title="培训完成"></el-step>
        </el-steps>

      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="doAddEmc">添 加</el-button>
      </span>
    </el-dialog>
   
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
      size: 13,
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
    doAddEmc () {
      this.employeetrain.trainstartdate = this.beginDateScope[0];
      this.employeetrain.trainfinishdate = this.beginDateScope[1];
      this.employeetrain.trainstatus = this.number;
      if (this.employeetrain.trainstatus && (this.employeetrain.eid || this.multipleSelection.length != 0) && this.employeetrain.traincontent && this.employeetrain.remark && this.employeetrain.trainstartdate && this.employeetrain.trainfinishdate) {
        this.number = 2;
        setTimeout(() => { this.dialogVisible = false; }, 1000);
        this.$notify.success({
          title: '添加讯息',
          message: '添 加 培 训 中...',
          showClose: false,
          offset: 100,
          duration: 1500,
          customClass: 'fontclass'
        });


        if (this.multipleSelection.length != 0) {

          let ids = '&';
          this.multipleSelection.forEach(item => {
            ids += 'ids=' + item.id + '&';
          });
          let url = '?trainstartdate=' + this.employeetrain.trainstartdate + "&trainfinishdate="
            + this.employeetrain.trainfinishdate + "&traincontent=" + this.employeetrain.traincontent + "&trainstatus=" + this.employeetrain.trainstatus
            + "&remark=" + this.employeetrain.remark;

          this.getRequest("/personnel/train/addt" + url + ids + "beginDateScope=" + this.beginDateScope).then(resp => {
            if (resp) {
              this.reload();
              this.this.employeetrain = null;
              this.multipleSelection = null;

            }
          })
        } else {
          this.postRequest("/personnel/train/", this.employeetrain).then(resp => {
            if (resp) {
              this.reload();
              this.employeetrain = {};
              this.number = 1;
              // this.reload();
            }
          });
        }
      } else {
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
      let url = '/personnel/train/init?page=' + this.page + '&size=' + this.size;
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
</style>