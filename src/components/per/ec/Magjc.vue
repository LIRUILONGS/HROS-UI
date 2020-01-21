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
                    max-height="665"
                    height="650"
                    v-loading.fullscreen.lock="loading"
                    element-loading-spinner="fa fa-spinner fa-pulse fa-3x fa-fw"
                    :customClass="loadingstyle"
                    style="width: 100%;height: 645px"
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
            <el-table-column prop="begincontract"
                             align="left"
                             width="120"
                             label="合同起始日期">
            </el-table-column>
            <el-table-column prop="endcontract"
                             align="left"
                             width="120"
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
            <el-table-column prop="employeeecList"
                             label="奖惩">
              <template slot-scope="scope">
                <el-tag closable
                        v-for=" (item,index) in scope.row.employeeecList"
                        :key="index"
                        size="small"
                        @click="magrp(item)"
                        @close="updatarp(item)"
                        style="margin-right:10px;margin-top:5px"
                        :type="(item.rwardsPunishments.rpsystemId === 1 ? 'danger' : (item.rwardsPunishments.rpsystemId === 3 ?'success':'warning'))">
                  {{item.rwardsPunishments.rpmsg}}
                </el-tag>
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
                     :page-sizes="[100,500,5000,,50000]">
      </el-pagination>

    </div>
    <!--添加弹出框-->

  </div>
</template>

<script>
export default {
  name: "Magjc",

  data () {

    return {
      data: [],
      value: [],
      textarea: '',
      multipleSelection: [],
      centerDialogVisible: false,
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
      size: 100,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      employeeec: {
        eid: '',
        ecdate: "",
        ecreason: '',
        ecpoint: '',
        ectype: '',
        remark: '',
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
    magrp (data) {
      this.$notify({
        title: '奖惩详情',
        dangerouslyUseHTMLString: true,
        message: "" +

          '<p/> <h3>奖惩类型:' + (data.rwardsPunishments.rpsystemId == 5 ? '专项奖励类' : (data.rwardsPunishments.rpsystemId == 3 ? '经济奖惩类' : '行政奖惩类')) + "</h2><p/>" +
          '<p/> <h3>奖惩原因:' + data.ecreason + "</h3>" +
          '<p/><h3>奖惩分值: ' + data.rwardsPunishments.rpiont + "分" + "</h3>" +
          '<p/> <h3>奖惩日期:' + data.ecdate + "</h3>" +
          '<p/><h3>备注: ' + data.remark + "</h3>",
        // type:( data.rwardsPunishments.rpsystemId === 5 ? 'warning' : (data.rwardsPunishments.rpsystemId === 3 ?'success':'success')),
        iconClass: "el-icon-discount",
        offset: 300,
        duration: 4000,
      });

    },

    updatarp (data) {
// alert(JSON.stringify(data));
      this.eid = data.eid;
      this.id = data.id;
     
      this.$confirm('此操作将永久删除【' + data.rwardsPunishments.rpmsg + '】, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$notify.success({
          title: '删除讯息',
          message: '删 除 奖 惩 中...',
          showClose: false,
          offset: 100,
          duration: 4000,
          customClass: 'fontclass'
        });
        this.deleteRequest("/personnel/ec/" + this.eid + "/" + this.id).then(resp => {
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

    showEditEmpView (data) {
      this.centerDialogVisible = true;
      this.employeeec.eid = data.id;

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
    showAddEmpView () {
      this.emptyEmp();
      this.title = '添加员工';
      this.getMaxWordID();
      this.dialogVisible = true;
    },
    /*初始化搜索处理*/
    initEmps (type) {
      this.loading = true;
      let url = '/personnel/ec/ec?page=' + this.page + '&size=' + this.size;
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