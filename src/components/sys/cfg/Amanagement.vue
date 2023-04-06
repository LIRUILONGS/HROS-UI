<template>
  <div>
    <div class="top-style">
      <div style="display: flex;justify-content: flex-start;">
        <el-input placeholder="请输入标题进行搜索，可以直接回车搜索..."
                  prefix-icon="el-icon-search"
                  clearable
                  @clear="initmain"
                  style="width: 350px;margin-right: 10px"
                  v-model="keyword"
                  @keydown.enter.native="initmain"></el-input>
        <el-button icon="el-icon-search"
                   type="primary"
                   @click="initmain">
          搜索
        </el-button>
      </div>
    </div>
    <div class="content-styles">
      <el-scrollbar style="height: 100%;">
        <div>
          <el-table :data="mainnotices"
                    border
                    v-loading.fullscreen.lock="loading"
                    element-loading-spinner="fa fa-spinner fa-pulse fa-3x fa-fw"
                  
                    stripe
                    height="660"
                    style="width:100%;height: 645px"
                    @selection-change="handleSelectionChange">
            <el-table-column type="selection"
                             width="55">
            </el-table-column>
            <el-table-column prop="id"
                             label="编号"
                             width="55">
            </el-table-column>
            <el-table-column prop="title"
                             label="公告标题"
                             >
            </el-table-column>
            <el-table-column prop="authon"
                             label="发布人"
                             width="150">
            </el-table-column>
            <el-table-column prop="updateTime"
                             label="更新时间"
                             width="200">
            </el-table-column>
            <el-table-column prop="createTime"
                             label="创建时间"
                             width="200">
            </el-table-column>
            <el-table-column label="操作" width="250">
              <template slot-scope="scope">
                <el-button size="mini"
                           type="success"
                           @click="showView(scope.row)">预览</el-button>
                <el-button size="mini"
                           type="danger"
                           @click="deleteHandler(scope.row)">删除</el-button>
                <el-button size="mini"
                           type="primary"
                           @click="showEditView(scope.row)">修改</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-scrollbar>
    </div>
    <div class="bottom-style">
      <div>
        <el-button type="danger"
                   style="margin-top: 10px"
                   :disabled="multipleSelection.length==0"
                   @click="deleteMany">批量删除
        </el-button>
        <el-button @click="refershMany"
                   type="primary"
                   style="margin-top: 8px">刷 新
        </el-button>
      </div>
      <el-pagination style="margin-top: 10px;margin-right:320px"
                     background
                     @current-change="currentChange"
                     @size-change="sizeChange"
                     layout="sizes, prev, pager, next, jumper, ->, total, slot"
                     :total="total"
                     :page-sizes="[11,22,333,4444]">
      </el-pagination>
    </div>
    <el-drawer :before-close="handleClose"
               :visible.sync="dialog"
               direction="ltr"
               custom-class="drawerstyleleft"
               ref="drawer"
               size="40%">
      <div class="center-right-infinite-list">
        <el-scrollbar style="height: 100%;width:100%">
          <!-- <div v-html="mainnotice.mainbody">  -->
          <quill-editor v-model="mainnotice.mainbody"
                        disabled="value"
                        :options="editorOption">
          </quill-editor>
        </el-scrollbar>
      </div>
    </el-drawer>
    <el-drawer :before-close="handleClose"
               :visible.sync="updatedialog"
               direction="rtl"
               custom-class="drawerstyleright"
               ref="drawer"
               size="40%"
               @close="updatemainnotice">
      <div class="center-right-infinite-list">
        <el-scrollbar style="height: 100%;width:100%">
          <!-- <div v-html="mainnotice.mainbody">  -->
          <quill-editor v-model="mainnotice.mainbody"
                        :options="editorOption">
          </quill-editor>
        </el-scrollbar>
      </div>
    </el-drawer>
  </div>
</template>


<script>

export default {

  name: "Amanagement",
  data () {
    return {
      editorOption: {
        modules: {
          toolbar: [

            ["link", "image", "video"],// 链接、图片、视频
            ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
            ["blockquote", "code-block"], // 引用  代码块
            [{ header: 1 }, { header: 2 }], // 1、2 级标题
            [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表
            [{ script: "sub" }, { script: "super" }], // 上标/下标
            [{ indent: "-1" }, { indent: "+1" }], // 缩进
            [{ size: ["small", false, "large", "huge"] }], // 字体大小
            [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
            [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
            [{ align: [] }], // 对齐方式
            ["clean"], // 清除文本格式
          ], //工具菜单栏配置
        },
        placeholder: '请在这里添加公告讯息哦，选中文字改变样式！', //提示
        readyOnly: false, //是否只读
        theme: 'bubble', //主题 snow/bubble
        syntax: true, //语法检测
      },
      mainnotice: {
        id: '',
        title: '',
        mainbody: '',

      },
      total: 0,
      page: 1,
      keyword: '',
      size: 11,
      loading: false,
      dialog: false,
      updatedialog: false,
      mainnotices: [],
      multipleSelection: [],
    }
  },
  mounted () { this.initmain(); },
  methods: {

    showEditView (data) {
      this.updatedialog = true;
      this.mainnotice = data;
    },
    showView (data) {
      this.dialog = true;
      this.mainnotice = data;
    },
    /*批量删除的添加回调*/
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    updatemainnotice () {
      this.$notify.success({
        title: '修改讯息',
        message: ' 修 改 公 告 中...',
        showClose: false,
        offset: 100,
        duration: 1500,
        customClass: 'fontclass'
      });
      this.putRequest("/system/cfg/", this.mainnotice).then(resp => {
        if (resp) {
          this.initmain();

        }
      })
    },
    deleteMany () {
      this.$confirm('此操作将永久删除【' + this.multipleSelection.length + '】条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = '?';
        this.multipleSelection.forEach(item => {
          ids += 'ids=' + item.id + '&';
        })
        this.$notify.success({
          title: '删除讯息',
          message: '删 除 公 告 中...',
          showClose: false,
          offset: 100,
          duration: 1500,
          customClass: 'fontclass'
        });
        this.deleteRequest("/system/cfg/" + ids).then(resp => {
          if (resp) {
            this.initmain();
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
    refershMany () {
      this.initmain();
    },
    deleteHandler (data) {
      this.$confirm('此操作将永久删除【' + data.title + '】公告, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$notify.success({
          title: '删除讯息',
          message: '删 除 公 告 中...',
          showClose: false,
          offset: 100,
          duration: 1500,
          customClass: 'fontclass'
        });
        this.deleteRequest("/system/cfg/" + data.id).then(resp => {
          if (resp) {
            this.keyword = '';
            this.initmain();
          }

        });
      }).catch(() => {
        this.$notify.info({
          title: '删除讯息',
          message: '删 除 取 消',
          showClose: false,
          offset: 100,
          duration: 1500,
          customClass: 'fontclass'
        });
      });

    },
    initmain () {
      this.loading = true;
      this.getRequest("/system/cfg/?page=" + this.page + "&size=" + this.size + "&keyword=" + this.keyword).then(resp => {
        if (resp) {
          this.loading = false;
          this.mainnotices = resp.data;
          this.total = resp.total;
          this.keyword = '';
        }
      })

    },
    /*分页事件处理*/
    sizeChange (currentSize) {
      this.size = currentSize;
      this.initmain();
    },
    currentChange (currentPage) {
      this.page = currentPage;
      this.initmain();
    },
  },

}
</script>

<style>
.center-right-infinite-list {
  width: 750px;
  height: 740px;
}
.center-right-infinite-list .el-scrollbar__wrap {
  overflow-x: hidden;
}

.fontclass {
  font-family: 站酷庆科黄油体;
}

.el-drawer.drawerstyleleft {
  border-radius: 0px 15px 15px 0px;
  box-shadow: dodgerblue;
}
.el-drawer .drawerstyleright {
  border-radius: 15px 0px 0px 15px;
  box-shadow: dodgerblue;
}
.top-style {
  /*定义弹性布局*/
  display: flex;
  /*分布方式*/
  justify-content:flex-start;
  
}

.content-styles {
  margin-top: 10px;
}

.content-styles .el-scrollbar__wrap {
  overflow-x: hidden;
}

.bottom-style {
  display: flex;
  justify-content: space-between;
}

.fontclasssys {
  font-family: 站酷庆科黄油体;
}
.editor {
  line-height: normal !important;
}
.ql-bubble .ql-tooltip[data-mode="link"]::before {
  content: "请输入链接地址:";
}

.ql-bubble .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: "保存";
  padding-right: 0px;
}

.ql-bubble .ql-tooltip[data-mode="video"]::before {
  content: "请输入视频地址:";
}

.ql-bubble .ql-picker.ql-size .ql-picker-label::before,
.ql-bubble .ql-picker.ql-size .ql-picker-item::before {
  content: "14px";
}

.ql-bubble .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
.ql-bubble .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
  content: "10px";
}

.ql-bubble .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
.ql-bubble .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
  content: "18px";
}

.ql-bubble .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
.ql-bubble .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
  content: "32px";
}

.ql-bubble .ql-picker.ql-header .ql-picker-label::before,
.ql-bubble .ql-picker.ql-header .ql-picker-item::before {
  content: "文本";
}

.ql-bubble .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: "标题1";
}

.ql-bubble .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: "标题2";
}

.ql-bubble .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: "标题3";
}

.ql-bubble .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: "标题4";
}

.ql-bubble .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: "标题5";
}

.ql-bubble .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: "标题6";
}

.ql-bubble .ql-picker.ql-font .ql-picker-label::before,
.ql-bubble .ql-picker.ql-font .ql-picker-item::before {
  content: "标准字体";
}

.ql-bubble .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
.ql-bubble .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
  content: "衬线字体";
}

.ql-bubble .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
.ql-bubble .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
  content: "等宽字体";
}
</style>