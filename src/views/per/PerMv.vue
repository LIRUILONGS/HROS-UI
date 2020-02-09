<template>
  <div>
    <div class="top-style">
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

      <div style="display: flex;justify-content: flex-end">

        <!--add 弹窗-->
        <el-dialog title="员工调动"
                   center
                   :visible.sync="dialogVisible"
                   width="30%">
          <div>
            <el-form :model="emp"
                     :rules="rules"
                     ref="empForm">

              <el-form-item label="调动职称:"
                            prop="posid">
                <el-select v-model="emp.joblevelid"
                           placeholder="职位"
                           style="width: 150px;">
                  <el-option v-for="item in joblevels"
                             :key="item.id"
                             :label="item.name"
                             :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="调动部门:"
                            prop="departmentid">
                <el-popover placement="right"
                            title="请选择部门"
                            width="200"
                            trigger="manual"
                            v-model="popVisible">
                  <el-tree default-expand-all
                           :data="allDeps"
                           :props="defaultProps"
                           @node-click="handleNodeClick"></el-tree>
                  <div slot="reference"
                       style="width: 150px;display: inline-flex;font-size: 15px;border: 1px solid #dedede;height: 38px;border-radius: 5px;cursor: pointer;align-items: center;box-sizing: border-box;"
                       @click="showDepView1()">{{inputDepName}}
                  </div>
                </el-popover>
              </el-form-item>

              <el-form-item label="调动原因:">
                <el-input type="textarea"
                          placeholder="请输入..."
                          v-model="emp.workstate"
                          maxlength="30"
                          style="width:350px;margin-bottom:10px"
                          show-word-limit>
                </el-input>
              </el-form-item>

            </el-form>
          </div>
          <span slot="footer"
                class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary"
                       @click="doAddEmp">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>

    <div class="content-style">
      <el-scrollbar style="height: 100%">
        <div>
          <el-table :data="emps"
                    stripe
                    border
                    max-height="685"
                    v-loading.fullscreen.lock="loading"
                    element-loading-spinner="fa fa-spinner fa-pulse fa-3x fa-fw"
                    style="width: 100%;height: 695px"
                    @selection-change="handleSelectionChange">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-table :data="props.row.employeeremoveList"
                          style="width: 100%"
                          :row-class-name="tableRowClassName">
                  <el-table-column prop="department.name"
                                   label="调动部门"
                                   width="180">
                  </el-table-column>
                  <el-table-column prop ="jobLevel.name"
                                   label="调动职称"
                                   width="180">
                  </el-table-column>
                  <el-table-column prop="reason"
                                   label="调动原因">
                  </el-table-column>
                  <el-table-column prop="removedate"
                                   label="调动日期">
                  </el-table-column>
                </el-table>
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
            <el-table-column prop="department.name"
                             align="left"
                             label="所属部门">
            </el-table-column>
            <el-table-column prop="position.name"
                             label="职位">
            </el-table-column>
            <el-table-column prop="jobLevel.name"
                             label="职称">
            </el-table-column>
            <el-table-column prop="engageform"
                             align="left"
                             label="聘用形式">
            </el-table-column>
            <el-table-column prop="begindate"
                             align="left"
                             label="入职日期">
            </el-table-column>

            <el-table-column prop="begincontract"
                             align="left"
                             label="合同起始日期">
            </el-table-column>
            <el-table-column prop="endcontract"
                             align="left"
                             label="合同截止日期">
            </el-table-column>
            <el-table-column align="left"
                             label="合同期限">
              <template slot-scope="scope">
                <el-tag size="mini">{{scope.row.contractterm}}</el-tag>
                年
              </template>
            </el-table-column>
            <el-table-column width="200"
                             align="center"
                             label="操作">
              <template slot-scope="scope">
                <el-button type="primary"
                           @click="showEditEmpView(scope.row)"
                           style="padding: 3px">调 动
                </el-button>
              </template>
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
                     :page-sizes="[20,40,60,,80]">
      </el-pagination>

    </div>
    <!--添加弹出框-->

  </div>
</template>

<script>
export default {
  name: "PerMv",
  data () {
    return {
      multipleSelection: [],
      searchValue: {
        politicid: null,
        nationid: null,
        joblevelid: null,
        posid: null,
        engageform: null,
        departmentid: null,
        beginDateScope: null
      },
      title: '',
      importDataBtnText: '导入数据',
      importDataBtnIcon: 'el-icon-upload2',
      importDataDisabled: false,
      showAdvanceSearchView: false,
      allDeps: [],
      emps: [],
      loading: false,
      popVisible: false,
      popVisible1: false,
      dialogVisible: false,
      total: 0,
      page: 1,
      keyword: '',
      size: 20,
      nations: [],
      joblevels: [],
      politicsstatus: [],
      positions: [],
      tiptopDegrees: ['本科', '大专', '硕士', '博士', '高中', '初中', '小学', '其他'],
      options: [{
        value: '',
        label: ''
      }],
      inputDepName: '所属部门',
      emp: {
        id: '',
        name: "小明",
        gender: "男",
        birthday: "1995-10-08",
        idcard: "610122199001011256",
        wedlock: "已婚",
        nationid: 1,
        nativeplace: "内蒙古",
        politicid: 13,
        email: "1224965096@qq.com",
        phone: "18565558897",
        address: "内蒙古呼和浩特",
        departmentid: 29,
        joblevelid: 9,
        posid: 29,
        engageform: "劳务合同",
        tiptopdegree: "本科",
        specialty: "信息与计算科学",
        school: "集宁师范学院",
        begindate: "2017-12-31",
        workstate: "",
        workid: "",
        contractterm: 2,
        conversiontime: "2018-03-31",
        notworkdate: null,
        begincontract: "2017-12-31",
        endcontract: "2019-12-31",
        workage: null
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      rules: {


      }
    }
  },
  mounted () {
    this.initEmps();
    this.initData();
    this.initPositions();
  },
  methods: {

tableRowClassName({row, rowIndex}) {
        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
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

    filert (ids) {
      return this.joblevels.filter(item => {
        if (item.id === ids) {
              return item.name;
        }      });

    },
    emptyEmp () {
      this.emp = {
        id: '',
        name: "小明",
        gender: "男",
        birthday: "1995-10-08",
        idcard: "610122199001011256",
        wedlock: "已婚",
        nationid: 1,
        nativeplace: "内蒙古",
        politicid: 13,
        email: "1224965096@qq.com",
        phone: "18565558897",
        address: "内蒙古呼和浩特",
        departmentid: 8,
        joblevelid: 9,
        posid: 29,
        engageform: "劳务合同",
        tiptopdegree: "本科",
        specialty: "信息与计算科学",
        school: "集宁师范学院",
        begindate: "2017-12-31",
        workstate: "",
        workid: "",
        contractterm: 2,
        conversiontime: "2018-03-31",
        notworkdate: null,
        begincontract: "2017-12-31",
        endcontract: "2019-12-31",
        workage: null
      }
      this.inputDepName = '';
    },
    showEditEmpView (data) {
      this.initPositions();
      this.emp.workstate = "";
      this.emp = data;
      this.emp.workstate = null;
      this.inputDepName = data.department.name;
      this.dialogVisible = true;

    },

    doAddEmp () {
      if (this.emp.id) {
        this.$refs['empForm'].validate(valid => {
          if (valid) {
            this.$notify.success({
              title: '调动讯息',
              message: ' 调 动 员 工 中...',
              showClose: false,
              offset: 100,
              duration: 2000,
              customClass: 'fontclass'
            });
            this.putRequest("/personnel/remove/", this.emp).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.initEmps();
              }
            })
          }
        });
      }

    },

    handleNodeClick (data) {
      this.inputDepName = data.name;
      this.emp.departmentid = data.id;
      this.popVisible = !this.popVisible
    },
    /*部门初始化*/
    showDepView () {
      this.popVisible1 = !this.popVisible1
    },
    showDepView1 () {
      this.popVisible = !this.popVisible
    },
    /**/
    initPositions () {
      this.getRequest('/personnel/remove/positions').then(resp => {
        if (resp) {
          this.positions = resp;
          window.sessionStorage.setItem("positions", JSON.stringify(resp));
        }
      })
    },

    /*添加员工数据预加载*/
    initData () {
      /*如果缓存了在缓存里取*/
      if (!window.sessionStorage.getItem("positions")) {
        this.initPositions();
      } else {
        this.positions = JSON.parse(window.sessionStorage.getItem("positions"))
      }
      /*所在部门*/
      if (!window.sessionStorage.getItem("deps")) {
        this.getRequest('/personnel/remove/deps').then(resp => {
          if (resp) {
            this.allDeps = resp;
            window.sessionStorage.setItem("deps", JSON.stringify(resp));
          }
        })
      } else {
        this.allDeps = JSON.parse(window.sessionStorage.getItem("deps"));
      }
      if (!window.sessionStorage.getItem("joblevels")) {
        this.getRequest('/employee/basic/joblevels').then(resp => {
          if (resp) {
            this.joblevels = resp;
            window.sessionStorage.setItem("joblevels", JSON.stringify(resp));
          }
        })
      } else {
        this.joblevels = JSON.parse(window.sessionStorage.getItem("joblevels"));
      }
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
    showAddEmpView () {
      this.emptyEmp();
      this.title = '添加员工';
      this.getMaxWordID();
      this.dialogVisible = true;
    },
    /*初始化搜索处理*/
    initEmps () {
      this.loading = true;
      let url = '/personnel/remove/?page=' + this.page + '&size=' + this.size;
      if (this.keyword) {
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
              message: ' 调 动 信 息 加 载 中...',
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
    }
  }
}
</script>

<style  >
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

.slide-fade-enter, .slide-fade-leave-to
        /* .slide-fade-leave-active for below version 2.1.8 */
 {
  transform: translateX(10px);
  opacity: 0;
}
.demo-table-expand {
  font-size: 0;
}
 .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
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
