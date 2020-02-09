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
                   :visible.sync="dialogVisible"
                   width="40%">
          <div>
            <el-form :model="emp"
                     :rules="rules"
                     ref="empForm">
              <el-row>
                <el-col :span="6">
                  <el-form-item label="调动后职位:"
                                prop="posid">
                    <el-select v-model="emp.posid"
                               placeholder="职位"
                               style="width: 150px;">
                      <el-option v-for="item in positions"
                                 :key="item.id"
                                 :label="item.name"
                                 :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              
                <el-col :span="6">
                  <el-form-item label="调动后部门:"
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
                           style="width: 150px;display: inline-flex;font-size: 19px;border: 1px solid #dedede;height: 38px;border-radius: 5px;cursor: pointer;align-items: center;box-sizing: border-box;"
                           @click="showDepView1()">{{inputDepName}}
                      </div>
                    </el-popover>
                  </el-form-item>
                </el-col>
              </el-row>
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
<el-divider></el-divider>
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
                <el-form 
                        label-position="left" inline class="demo-table-expand">
                  <el-form-item label="性别:"
                               >
                    <span>{{ props.row.gender }}</span>
                  </el-form-item>
                  <el-form-item label="出生日期:">
                    <span>{{ props.row.birthday }}</span>
                  </el-form-item>
                  <el-form-item label="身份证号码:">
                    <span>{{ props.row.idcard }}</span>
                  </el-form-item>
                  <el-form-item label="电子邮件:">
                    <span>{{ props.row.email }}</span>
                  </el-form-item>
                  <el-form-item label="电话号码:">
                    <span>{{ props.row.phone }}</span>
                  </el-form-item>
                  <el-form-item label="最高学历:">
                    <span>{{ props.row.tiptopdegree }}</span>
                  </el-form-item>
                  <el-form-item label="专业:">
                    <span>{{ props.row.specialty }}</span>
                  </el-form-item>
                  <el-form-item label="毕业院校:">
                    <span>{{ props.row.school }}</span>
                  </el-form-item>
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
            <el-table-column 
                             align="left"
                             label="合同期限">
              <template slot-scope="scope">
                <el-tag size="mini">{{scope.row.contractterm}}</el-tag>
                年
              </template>
            </el-table-column>
            <el-table-column width="200"
                             label="操作">
              <template slot-scope="scope">
                <el-button type="primary"
                           @click="showEditEmpView(scope.row)"
                           style="padding: 3px">调动
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
                     :page-sizes="[13,33,333,,3333]">
      </el-pagination>

    </div>
    <!--添加弹出框-->

  </div>
</template>

<script>
export default {
  name: "PerSalary",
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
      size: 13,
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
        workstate: "在职",
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
        name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        gender: [{ required: true, message: '请输入性别', trigger: 'blur' }],
        birthday: [{ required: true, message: '请输入出生日期', trigger: 'blur' }],
        idcard: [{ required: true, message: '请输入身份证号码', trigger: 'blur' }, {
          pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
          message: '身份证号码格式不正确',
          trigger: 'blur'
        }],
        wedlock: [{ required: true, message: '请输入婚姻状况', trigger: 'blur' }],
        nationid: [{ required: true, message: '请输入民族', trigger: 'blur' }],
        nativePlace: [{ required: true, message: '请输入籍贯', trigger: 'blur' }],
        politicId: [{ required: true, message: '请输入政治面貌', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱地址', trigger: 'blur' }, {
          type: 'email',
          message: '邮箱格式不正确',
          trigger: 'blur'
        }],
        phone: [{ required: true, message: '请输入电话号码', trigger: 'blur' }],
        address: [{ required: true, message: '请输入员工地址', trigger: 'blur' }],
        departmentid: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
        joblevelid: [{ required: true, message: '请输入职称', trigger: 'blur' }],
        posid: [{ required: true, message: '请输入职位', trigger: 'blur' }],
        engageform: [{ required: true, message: '请输入聘用形式', trigger: 'blur' }],
        tiptopdegree: [{ required: true, message: '请输入学历', trigger: 'blur' }],
        specialty: [{ required: true, message: '请输入专业', trigger: 'blur' }],
        school: [{ required: true, message: '请输入毕业院校', trigger: 'blur' }],
        begindate: [{ required: true, message: '请输入入职日期', trigger: 'blur' }],
        workstate: [{ required: true, message: '请输入工作状态', trigger: 'blur' }],
        workid: [{ required: true, message: '请输入工号', trigger: 'blur' }],
        contractterm: [{ required: true, message: '请输入合同期限', trigger: 'blur' }],
        conversiontime: [{ required: true, message: '请输入转正日期', trigger: 'blur' }],
        notworkdate: [{ required: true, message: '请输入离职日期', trigger: 'blur' }],
        begincontract: [{ required: true, message: '请输入合同起始日期', trigger: 'blur' }],
        endcontract: [{ required: true, message: '请输入合同结束日期', trigger: 'blur' }],
        workage: [{ required: true, message: '请输入工龄', trigger: 'blur' }],
      }
    }
  },
  mounted () {
    this.initEmps();
    this.initData();
    this.initPositions();
  },
  methods: {
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
          duration: 4000,
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
          duration: 4000,
          customClass: 'fontclass'
        });
      });
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
    /*上传失败*/
    onError () {
      this.importDataBtnText = '导入数据';
      this.importDataBtnIcon = 'el-icon-upload2';
      this.importDataDisabled = false;
    },
    /*上传成功*/
    onSuccess () {
      this.importDataBtnText = '导入数据';
      this.importDataBtnIcon = 'el-icon-upload2';
      this.importDataDisabled = false;
      this.initEmps();
    },
    /*上传中*/
    beforeUpload () {
      this.importDataBtnText = '正在导入';
      this.importDataBtnIcon = 'fa fa-circle-o-notch fa-spin  fa-fw';
      this.importDataDisabled = true;
    },
    exportData () {
      window.open('/employee/basic/export', '_parent');
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
        workstate: "在职",
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
      this.title = '编辑员工信息';
      this.emp = data;
      this.inputDepName = data.department.name;
      this.dialogVisible = true;
    },
    deleteEmp (data) {
      this.$confirm('此操作将永久删除【' + data.name + '】, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$notify.success({
          title: '删除讯息',
          message: '删 除 员 工 中...',
          showClose: false,
          offset: 100,
          duration: 4000,
          customClass: 'fontclass'
        });
        this.deleteRequest("/employee/basic/" + data.id).then(resp => {
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
          duration: 4000,
          customClass: 'fontclass'
        });
      });
    },
    doAddEmp () {
      if (this.emp.id) {
        this.$refs['empForm'].validate(valid => {
          if (valid) {
            this.$notify.success({
              title: '修改讯息',
              message: ' 修 改 员 工 中...',
              showClose: false,
              offset: 100,
              duration: 2000,
              customClass: 'fontclass'
            });
            this.putRequest("/employee/basic/", this.emp).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.initEmps();
              }
            })
          }
        });
      } else {
        this.$refs['empForm'].validate(valid => {
          if (valid) {
            this.$notify.success({
              title: '添加讯息',
              message: '添 加 员 工 中...',
              showClose: false,
              offset: 100,
              duration: 4000,
              customClass: 'fontclass'
            });
            this.postRequest("/employee/basic/", this.emp).then(resp => {
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
      this.getRequest('/employee/basic/positions').then(resp => {
        if (resp) {
          this.positions = resp;
        }
      })
    },
    getMaxWordID () {
      this.getRequest("/employee/basic/maxWorkID").then(resp => {
        if (resp) {
          this.emp.workid = resp.obj;
        }
      })
    },
    /*添加员工数据预加载*/
    initData () {
      /*如果缓存了在缓存里取*/
      /*民族*/
      if (!window.sessionStorage.getItem("nations")) {
        this.getRequest('/employee/basic/nations').then(resp => {
          if (resp) {
            this.nations = resp;
            window.sessionStorage.setItem("nations", JSON.stringify(resp));
          }
        })
      } else {
        this.nations = JSON.parse(window.sessionStorage.getItem("nations"));
      }
      /*职称*/
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
      /*政治面貌*/
      if (!window.sessionStorage.getItem("politicsstatus")) {
        this.getRequest('/employee/basic/politicsstatus').then(resp => {
          if (resp) {
            this.politicsstatus = resp;
            window.sessionStorage.setItem("politicsstatus", JSON.stringify(resp));
          }
        })
      } else {
        this.politicsstatus = JSON.parse(window.sessionStorage.getItem("politicsstatus"));
      }
      /*所在部门*/
      if (!window.sessionStorage.getItem("deps")) {
        this.getRequest('/employee/basic/deps').then(resp => {
          if (resp) {
            this.allDeps = resp;
            window.sessionStorage.setItem("deps", JSON.stringify(resp));
          }
        })
      } else {
        this.allDeps = JSON.parse(window.sessionStorage.getItem("deps"));
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
    initEmps (type) {
      this.loading = true;
      let url = '/employee/basic/?page=' + this.page + '&size=' + this.size;
      if (type && type == 'advanced') {
        this.$notify.success({
          title: '搜索讯息',
          message: '搜 索 员 工 中...',
          showClose: false,
          offset: 100,
          duration: 2000,
          customClass: 'fontclass'
        });
        if (this.searchValue.politicid) {
          url += '&politicid=' + this.searchValue.politicid;
        }
        if (this.searchValue.nationid) {
          url += '&nationid=' + this.searchValue.nationid;
        }
        if (this.searchValue.joblevelid) {
          url += '&joblevelid=' + this.searchValue.joblevelid;
        }
        if (this.searchValue.posid) {
          url += '&posid=' + this.searchValue.posid;
        }
        if (this.searchValue.engageform) {
          url += '&engageform=' + this.searchValue.engageform;
        }
        if (this.searchValue.departmentid) {
          url += '&departmentid=' + this.searchValue.departmentid;
        }
        if (this.searchValue.beginDateScope) {
          url += '&beginDateScope=' + this.searchValue.beginDateScope;
        }
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

