<template>
  <div class="edit_container">
    <div class="topdstyle">
      <el-input placeholder="请输入标题"
                v-model="mainnotice.title"
                style="width: 790px">
        <template slot="prepend"
                  style="font-family: 站酷庆科黄油体">公告标题</template>
      </el-input>
      <el-button v-loading.fullscreen.lock="loading"
                 element-loading-spinner="fa fa-spinner fa-pulse fa-3x fa-fw"
                 type="primary"
                 class="depBtn"
                 icon="el-icon-plus"
                 style="width: 194px ;margin-left: 10px"
                 @click="saveHtml"> 保存
      </el-button>
    </div>
    <div class="centontstyle">
      <el-scrollbar style="height:100%;width: 1500px">
        <quill-editor v-model="mainnotice.mainbody"
                      ref="myQuillEditor"
                      :options="editorOption"
                      @blur="onEditorBlur($event)"
                      @ready="onEditorReady($event)"
                      @focus="onEditorFocus($event)"
                      @change="onEditorChange($event)">
        </quill-editor>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>


export default {
  inject: ["reload"],
  data () {
    return {
      mainnotice: {
        title: '',
        mainbody: '',
      },
      loading: false,
      content: "",
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
        theme: 'snow', //主题 snow/bubble
        syntax: true, //语法检测
      }
    }
  }, computed: {
    editor () {
      return this.$refs.myQuillEditor.quill;
    },
  }, methods: {
    onEditorReady () { // 准备编辑器
    },
    onEditorBlur () {
    }, // 失去焦点事件
    onEditorFocus () {
    }, // 获得焦点事件
    onEditorChange () {
    }, // 内容改变事件
    saveHtml: function () {
      if (this.mainnotice.mainbody && this.mainnotice.title) {
        this.$notify.success({
          title: '添加公告',
          message: '添 加 添 加 中...',
          showClose: false,
          offset: 100,
          duration: 4000,
          customClass: 'fontclass'
        });
        this.loading = true;

        this.postRequest('/system/cfg/', this.mainnotice).then(resp => {
          this.loading = false;
          if (resp) {
            this.loading = false;
            this.mainnotice = [];
            this.reload();
            this.mainnotice = [];
            this.content = '';
          }
        });
      } else {
        this.$notify({
          title: '添加公告',
          message: '公 告 信 息 不 能 为 空...',
          showClose: false,
          offset: 100,
          duration: 4000,
          customClass: 'fontclass',
          type: 'warning'
        });
      }
    }
  }
}
</script>

<style>
.topdstyle {
  display: flex;
  justify-content: flex-start;
}

.centontstyle {
  display: flex;
  margin-top: 10px;
  height: 690px;
  overflow-x: hidden;
  width: 1000px;
}

.centontstyle .el-scrollbar__wrap {
  overflow-x: hidden;

  background-clip: padding-box;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.editor {
  line-height: normal !important;
}

.ql-snow .ql-tooltip[data-mode="link"]::before {
  content: "请输入链接地址:";
}

.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: "保存";
  padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode="video"]::before {
  content: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: "14px";
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
  content: "10px";
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
  content: "18px";
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
  content: "32px";
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: "文本";
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: "标题1";
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: "标题2";
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: "标题3";
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: "标题4";
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: "标题5";
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: "标题6";
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: "标准字体";
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
  content: "衬线字体";
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
  content: "等宽字体";
}

</style>