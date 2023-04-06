<template>
  <div>
    <div class="top-style" v-show="!keywordFrom" >
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
    </div>

    <div class="content-style">
      <el-scrollbar style="height: 100%">
        <div>
          <el-table :data="emps"
                    stripe
                    border
                    max-height="652"
                    height="690"
                    v-loading.fullscreen.lock="loading"
                    element-loading-spinner="fa fa-spinner fa-pulse fa-3x fa-fw"
                    :customClass="loadingstyle"
                    style="width: 100%;height: 695px"
                    @selection-change="handleSelectionChange">

            <el-table-column prop="name"
                             align="left"
                             label="姓名"
                             width="100">
            </el-table-column>
            <el-table-column prop="workid"
                             fixed
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
            <!--  -->
            <el-table-column prop="employeetrainList.traincontent"
                             align="left"
                             label="培训内容">
            </el-table-column>
            <el-table-column prop="employeetrainList.trainstartdate"
                             align="left"
                             width="110"
                             label="培训开始时间">
            </el-table-column>
            <el-table-column prop="employeetrainList.trainfinishdate"
                             align="left"
                             width="110"
                             label="培训结束时间">
            </el-table-column>
            <el-table-column prop="employeetrainList.remark"
                             align="left"
                             width="150"
                             label="备注">
            </el-table-column>
            <el-table-column prop="employeetrainList.trainstatus"
                             align="left"
                             width="300"
                             label="培训进度">
              <template slot-scope="scope">

                <el-progress :text-inside="true"
                             :stroke-width="15"
                             :percentage="(scope.row.employeetrainList.trainstatus) * 20"
                             status="success"></el-progress>
              </template>
            </el-table-column>
            <el-table-column align="left"
                             width="150"
                             label="操作"  v-if="!keywordFrom">
              <template slot-scope="scope">
                <el-button @click="showEditEmpView(scope.row)"
                           style="padding: 3px">编辑
                </el-button>
                <el-button @click="deletepet(scope.row)"
                           style="padding: 3px"
                           type="danger">
                  取消培训
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
                     :page-sizes="[12,22,33,,44]">
      </el-pagination>

    </div>
    <!--添加弹出框-->
    <el-dialog title="培训修改"
               center
               :visible.sync="dialogVisible"
               width="25%"
              >
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
                          align="right"
                          unlink-panels
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="培训进度">
          <el-slider v-model="number"
                     :step="20"
                     :min="20"
                     :max="100"
                     style="color:#67C23A"
                     show-stops>
          </el-slider>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="updateept">修 改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Magtrain",
  props: {
    //父组件传来的值需定义一下
    keywordFrom: {
      type: Boolean, //类型
      default: false
    },
  },

  data () {

    return {
      data: [],
      value: [],
      textarea: '',
      number: '',
      multipleSelection: [],
      beginDateScope: [],
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
      size: 14,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      employeetrain: {
        id: null,
        eid: '',
        trainstartdate: "",
        trainfinishdate: "",
        traincontent: "",
        trainstatus: '',
        remark: ""
      },
      eid: '',
      id: '',
    }
  },
  mounted () {
    this.initEmps();
    this.initPositions();
  },
  methods: {

    deletepet (data) {

      this.$confirm('此操作将永久删除【' + data.employeetrainList.traincontent + '】, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$notify.success({
          title: '删除讯息',
          message: '删 除 培 训 中...',
          showClose: false,
          offset: 100,
          duration: 1500,
          customClass: 'fontclass'
        });
        this.deleteRequest("/personnel/train/" + data.employeetrainList.eid + "/" + data.employeetrainList.id).then(resp => {
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
    filterTag (value, row) {
      return row.tag === value;
    },

    updateept () {
      this.employeetrain.trainstatus = this.number / 20;
      this.employeetrain.trainstartdate = this.beginDateScope[0];
      this.employeetrain.trainfinishdate = this.beginDateScope[1];
      if (this.employeetrain.trainstatus && this.employeetrain.eid && this.employeetrain.traincontent && this.employeetrain.remark && this.employeetrain.trainstartdate && this.employeetrain.trainfinishdate) {
        this.$notify.success({
          title: '修改讯息',
          message: '修 改 培 训 中...',
          showClose: false,
          offset: 100,
          duration: 1500,
          customClass: 'fontclass'
        });

        this.putRequest("/personnel/train/", this.employeetrain).then(resp => {
          if (resp) {
            this.dialogVisible = false;
            this.employeetrain = {};
            this.initEmps();
          }
        });
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
    showEditEmpView (data) {
      this.employeetrain = data.employeetrainList;
      this.beginDateScope[0] = this.employeetrain.trainstartdate;
      this.beginDateScope[1] = this.employeetrain.trainfinishdate;
      this.number = this.employeetrain.trainstatus * 20;
      this.dialogVisible = true;


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
    initEmps () {
      if (this.keywordFrom){
       let user = JSON.parse(window.sessionStorage.getItem("user"));
        this.keyword = user.name;
      }
      this.loading = true;
      let url = '/personnel/train/?page=' + this.page + '&size=' + this.size;
      if (this.keyword) {
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
        this.$notify.success({
          title: '系统讯息',
          message: ' 培 训 信 息 加 载 中...',
          showClose: false,
          offset: 150,
          duration: 1500,
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
  }
}
</script>

<style scoped>
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
  font-size: 4em;
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
</style>
