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
                    v-loading.fullscreen.lock="loading"
                    element-loading-spinner="fa fa-spinner fa-pulse fa-3x fa-fw"
                    :customClass="loadingstyle"
                    style="width: 100%;height: 645px"
                    @selection-change="handleSelectionChange">

            <el-table-column
                             prop="name"
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
                             width="100"
                             label="职位">
            </el-table-column>
            <el-table-column prop="jobLevel.name"
                             width="100"
                             label="职称">
            </el-table-column>
            <el-table-column prop="begindate"

                             align="left"
                             label="入职日期">
            </el-table-column>
            <el-table-column prop="conversiontime"

                             align="left"
                             label="转正日期">
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
            <el-table-column  align="center"
                             label="操作"
                               >
              <template slot-scope="scope">
                <el-button
                           type="primary"
                           @click="showEditEmpView(scope.row)"
                           style="padding: 3px">添加奖惩
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
    <el-dialog title="添加奖惩"
               :visible.sync="centerDialogVisible"
               width="36.42%"
               center>
      <el-transfer v-model="value"
                   :titles="['奖惩类型', '奖惩类型']"
                   :button-texts="['删除', '添加']"
                   :data="data">
      </el-transfer>

      <el-input type="textarea"
                placeholder="奖惩原因描述"
                v-model="employeeec.ecreason"
                maxlength="100"
                :autosize="{ minRows: 4, maxRows: 6}"
                show-word-limit
                style="margin-top: 20px"
                >
      </el-input>
      <el-input type="textarea"
                placeholder="备注"
                v-model="employeeec.remark"
                maxlength="30"
                show-word-limit
                style="margin-top: 20px"
                >
      </el-input>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="doAddEmc">确 定</el-button>
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
      value: [],
      textarea:'',
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
    }
  },
  mounted () {
    this.initEmps();
    this.initrps();
    this.initPositions();
  },
  methods: {

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
          this.keyword = '';
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

.slide-fade-enter, .slide-fade-leave-to{
  transform: translateX(10px);
  opacity: 0;
}
</style>
