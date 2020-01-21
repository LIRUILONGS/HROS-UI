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

            <el-table-column prop="appraise.appcontent"
                             align="left"
                             label="考评内容">
            </el-table-column>
            <el-table-column prop="appraise.appdate"
                             align="left"
                             width="110"
                             label="考评时间">
            </el-table-column>
            <el-table-column prop="appraise.remark"
                             align="left"
                             width="150"
                             label="备注">
            </el-table-column>
            <el-table-column prop="appraise.appresult"
                             align="left"
                             width="250"
                             label="考评结果">
              <template slot-scope="scope">
                <el-rate v-model="scope.row.appraise.appresult"
                         show-text
                         disabled
                         >
                </el-rate>
              </template>
            </el-table-column>
            <el-table-column align="left"
                             width="150"
                             label="操作">
              <template slot-scope="scope">
                <el-button @click="showEditEmpView(scope.row)"
                           style="padding: 3px">编辑
                </el-button>
                <el-button @click="deletepet(scope.row)"
                           style="padding: 3px"
                           type="danger">
                  取消考评
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
    <el-dialog title="考评修改"
               center
               :visible.sync="dialogVisible"
               width="25%">
      <el-form ref="form"
               :model="form"
               label-width="80px">
        <el-form-item label="考评内容">
          <el-input type="textarea"
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
        <el-form-item label="备注">
          <el-input type="textarea"
                    placeholder="请输入备注..."
                    v-model="appraise.remark"
                    maxlength="30"
                    style="width:350px;margin-bottom:10px"
                    show-word-limit>
          </el-input>
        </el-form-item>
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
      size: 12,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      appraise: {
        id: '',
        eid: '',
        appdate: '',
        appresult: '',
        appcontent: '',
        remark: ''
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

      this.$confirm('此操作将永久删除【' + data.appraise.appcontent + '】, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$notify.success({
          title: '删除讯息',
          message: '删 除 培 训 中...',
          showClose: false,
          offset: 100,
          duration: 4000,
          customClass: 'fontclass'
        });
        this.deleteRequest("/personnel/train/app/" + data.appraise.eid + "/" + data.appraise.id).then(resp => {
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
    filterTag (value, row) {
      return row.tag === value;
    },

    updateept () {

      if (this.appraise.appdate && this.appraise.eid && this.appraise.appcontent && this.appraise.remark && this.appraise.appresult) {
        this.$notify.success({
          title: '修改讯息',
          message: '修 改 考 评 中...',
          showClose: false,
          offset: 100,
          duration: 4000,
          customClass: 'fontclass'
        });

        this.putRequest("/personnel/train/app", this.appraise).then(resp => {
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
          duration: 2000,
          customClass: 'fontclass',
          type: 'warning'
        });
      }
    },
    showEditEmpView (data) {
      this.appraise = data.appraise;
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
      this.loading = true;
      let url = '/personnel/train/initapp?page=' + this.page + '&size=' + this.size;
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
          message: ' 考 评 信 息 加 载 中...',
          showClose: false,
          offset: 200,
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