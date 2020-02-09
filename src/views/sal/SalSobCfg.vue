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
      <el-table :data="emps"
                stripe
                border
                max-height="685"
                v-loading.fullscreen.lock="loading"
                element-loading-spinner="fa fa-spinner fa-pulse fa-3x fa-fw"
                :customClass="loadingstyle"
                style="width: 100%;height: 695px"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection"
                         align="left"
                         width="55"></el-table-column>
        <el-table-column prop="name"
                         label="姓名"
                         fixed
                         width="120"
                         align="left"></el-table-column>
        <el-table-column prop="workid"
                         label="工号"
                         width="120"
                         align="left"></el-table-column>
        <el-table-column prop="email"
                         label="电子邮件"
                         width="200"
                         align="left"></el-table-column>
        <el-table-column prop="phone"
                         label="电话号码"
                         width="120"
                         align="left"></el-table-column>
        <el-table-column prop="idcard"
                         label="身份证号"
                         width="190"
                         align="left"></el-table-column>
        <el-table-column prop="department.name"
                         label="所属部门"
                         width="120"
                         align="left"></el-table-column>
        <el-table-column prop="position.name"
                         label="职位"
                         width="120"
                         align="left"></el-table-column>
        <el-table-column prop="jobLevel.name"
                         label="职称"
                         width="120"
                         align="left"></el-table-column>
        <el-table-column prop="engageform"
                         label="聘用形式"
                         width="120"
                         align="left"></el-table-column>
        <el-table-column label="所属套账"
                         align="center">
          <template slot-scope="scope">
            <el-tooltip placement="right"
                        v-if="scope.row.salary">
              <div slot="content">
                <table>
                  <tr>
                    <td>基本工资</td>
                    <td>{{scope.row.salary.basicsalary}}</td>
                  </tr>
                  <tr>
                    <td>交通补助</td>
                    <td>{{scope.row.salary.trafficsalary}}</td>
                  </tr>
                  <tr>
                    <td>午餐补助</td>
                    <td>{{scope.row.salary.lunchsalary}}</td>
                  </tr>
                  <tr>
                    <td>奖金</td>
                    <td>{{scope.row.salary.bonus}}</td>
                  </tr>
                  <tr>
                    <td>养老金比率</td>
                    <td>{{scope.row.salary.pensionper}}</td>
                  </tr>
                  <tr>
                    <td>养老金基数</td>
                    <td>{{scope.row.salary.pensionbase}}</td>
                  </tr>
                  <tr>
                    <td>医疗保险比率</td>
                    <td>{{scope.row.salary.medicalper}}</td>
                  </tr>
                  <tr>
                    <td>医疗保险基数</td>
                    <td>{{scope.row.salary.medicalbase}}</td>
                  </tr>
                  <tr>
                    <td>公积金比率</td>
                    <td>{{scope.row.salary.accumulationfundper}}</td>
                  </tr>
                  <tr>
                    <td>公积金基数</td>
                    <td>{{scope.row.salary.accumulationFundbase}}</td>
                  </tr>
                  <tr>
                    <td>启用时间</td>
                    <td>{{scope.row.salary.createdate}}</td>
                  </tr>
                </table>
              </div>
              <el-tag>{{scope.row.salary.name}}</el-tag>
            </el-tooltip>
            <el-tag v-else>暂未设置</el-tag>
          </template>
        
        </el-table-column>
        <el-table-column label="操作"
                         align="center">
          <template slot-scope="scope">
            <el-popover placement="left"
                        title="修改工资账套"
                        @show="showPop(scope.row.salary)"
                        @hide="hidePop(scope.row)"
                        width="200"
                        style="height: 15px"
                        trigger="click">
              <div>
                <el-select v-model="currentSalary"
                           placeholder="请选择"
                           size="mini">
                  <el-option v-for="item in salaries"
                             :key="item.id"
                             :label="item.name"
                             :value="item.id">
                  </el-option>
                </el-select>
              </div>
              <el-button slot="reference"
                         type="danger"
                         size="mini">修改工资账套</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
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

  </div>
</template>

<script>
export default {
  name: "SalSobCfg",
  data () {
    return {
      emps: [],
      total: 0,
      loading:false,
      size: 15,
      page: 1,
      currentSalary: null,
      salaries: [],
      keyword: '',
      multipleSelection: [],
      loadingstyle: '',
    }
  },
  mounted () {
    this.initEmps();
    this.initSalaries();
  },
  methods: {
    /*分页事件处理*/
    sizeChange (currentSize) {
      this.size = currentSize;
      this.initEmps();
    },
    currentChange (currentPage) {
      this.page = currentPage;
      this.initEmps();
    },
    hidePop (data) {
      if (this.currentSalary) {
           this.$notify.success({
            title: '修改讯息',
            message: ' 修 改 工 资 套 账 中...',
            showClose: false,
            offset: 100,
            duration: 2000,
            customClass: 'fontclass'
          });
        this.putRequest('/salary/sobcfg/?eid=' + data.id + '&sid=' + this.currentSalary).then(resp => {
          if (resp) {
            this.initEmps()
          }
        });
      }
    },
    showPop (data) {
      if (data) {
        this.currentSalary = data.id;
      } else {
        this.currentSalary = null;
      }
    },
    initSalaries () {
      this.getRequest("/salary/sobcfg/salaries").then(resp => {
        if (resp) {
          this.salaries = resp;
        }
      })
    },
    initEmps () {
        setTimeout(() => {
        this.$notify.success({
          title: '系统讯息',
          message: '工 资 套 账 信 息 加 载 中...',
          showClose: false,
          offset: 100,
          duration: 4000,
          customClass: 'fontclass'
        });
      }, 1100);
        this.loading = true;
      this.getRequest("/salary/sobcfg/?page=" + this.page + '&size=' + this.size).then(resp => {
        if (resp) {
          this.emps = resp.data;
          this.total = resp.total;
          this.loading = false;
        }
      })
    }
  }
}
</script>

<style>
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
</style>