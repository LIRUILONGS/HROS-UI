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
                           @click="showEmpView(scope.row)"
                           style="padding: 3px">添加考评
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
                 @click="addMany">批量考评
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
    
    <el-dialog title="添加考评"
               :visible.sync="dialogVisibles"
               width="25%"
               center>
      <el-form ref="form"
               :model="form"
               label-width="80px">
        <el-form-item label="考评内容">
          <el-input type="appraise.appcontent"
                    placeholder="请输入考评内容..."
                    v-model="appraise.appcontent"
                    maxlength="30"
                    style="width:350px;margin-bottom:10px"
                    show-word-limit>
          </el-input>
        </el-form-item>
        <el-form-item label="考评日期">
          <el-date-picker v-model="appraise.appdate"
                          type="date"
                           value-format="yyyy-MM-dd"
                          placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="考评备注">
          <el-input type="textarea"
                    placeholder="请输入备注..."
                    v-model="appraise.remark"
                    maxlength="30"
                    style="width:350px;margin-bottom:10px"
                    show-word-limit>
          </el-input>
        </el-form-item>
        <!-- <el-form-item label="考评结果" style="width:350px;margin-bottom:10px;padding-top:20px"> -->
        <div style="display: flex;justify-content: flex-start;margin-right:10px;margin-left:10px">
          <div style="margin-right:10px">
            考评结果:
          </div>
          <el-rate v-model="appraise.appresult"
                   show-text>
          </el-rate>
        </div>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisibles = false">取 消</el-button>
        <el-button type="primary"
                   @click="doAddrp">添 加</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "AddAppr",
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
    doAddrp () {
      this.dialogVisibles = false;
      
      this.doAddEmc();


    },
    addMany () {
      this.dialogVisibles = true;
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

      if (this.appraise.appdate && (this.appraise.eid || this.multipleSelection.length != 0) && this.appraise.appresult && this.appraise.remark && this.appraise.appcontent) {
        this.$notify.success({
          title: '添加讯息',
          message: '添 加 考 评 中...',
          showClose: false,
          offset: 100,
          duration: 4000,
          customClass: 'fontclass'
        });
        if (this.multipleSelection.length != 0) {

          let ids = '&';
          this.multipleSelection.forEach(item => {
            ids += 'ids=' + item.id + '&';
          });
          let url = '?appdate=' + this.appraise.appdate + "&appresult="
            + this.appraise.appresult + "&remark=" + this.appraise.remark + "&appcontent=" + this.appraise.appcontent;
          this.getRequest("/personnel/train/adda" + url + ids).then(resp => {
            if (resp) {
              this.reload();
              this.this.appraise = null;
              this.multipleSelection = null;

            }
          })
        } else {
          this.postRequest("/personnel/train/add", this.appraise).then(resp => {
            if (resp) {
              this.reload();
              this.appraise = {};
            }
          });
        }
      } else {
        this.$notify({
          title: '添加讯息',
          message: '添 加 字 段 为 空!...',
          showClose: false,
          offset: 100,
          duration: 2000,
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
      let url = '/personnel/train/inia?page=' + this.page + '&size=' + this.size;
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
          message: ' 员 工 信 息 加 载 中...',
          showClose: false,
          offset: 50,
          duration: 4000,
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
</style>