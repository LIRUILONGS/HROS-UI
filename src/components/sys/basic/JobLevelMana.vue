<template>
    <div>
        <div style="display: flex;justify-content: flex-start">
            <el-input v-model="jl.name" style="width: 300px;" prefix-icon="el-icon-plus"
                      placeholder="添加职称..."></el-input>
            <el-select v-model="jl.titlelevel" placeholder="职称等级"
                       style="margin-left: 5px;margin-right: 5px">
                <el-option
                        v-for="item in titlelevels"
                        :key="item"
                        :label="item"
                        :value="item">
                </el-option>
            </el-select>
            <el-button    icon="el-icon-plus" type="primary" @click="addJobLevel">添加</el-button>
            <el-input

                    class="addPosInput"
                    placeholder="请输入职称名称进行搜索..."
                    prefix-icon="el-icon-search"
                    v-model="jl.searchname">
            </el-input>
            <el-button    icon="el-icon-search" type="primary" @click="searchname">搜索</el-button>

        </div>
        <div style="margin-top: 10px">
            <el-table
                    :data="jls"
                    border
                    v-loading="loading"
                    element-loading-spinner="el-icon-loading"
                    size="small"
                    stripe
                    style="width:80%"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column prop="id" label="编号" width="55">
                </el-table-column>
                <el-table-column prop="name" label="职称名称" width="150">
                </el-table-column>
                <el-table-column prop="titlelevel" label="职称级别" width="150">
                </el-table-column>
                <el-table-column prop="createdate" label="创建时间" width="200">
                </el-table-column>
                <el-table-column label="是否启用" width="150">
                    <template slot-scope="scope">
                        <el-tag type="success" size="small" v-if="scope.row.enabled">已启用</el-tag>
                        <el-tag type="danger" size="small" v-else>未启用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button    size="mini" @click="showEditView(scope.row)">编辑</el-button>
                        <el-button    size="mini" type="danger" @click="deleteHandler(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="display: flex;justify-content: flex-start">
            <el-button    type="danger" style="margin-top: 10px" :disabled="multipleSelection.length==0"
                       @click="deleteMany">批量删除
            </el-button>
            <el-button    @click="refershMany" type="primary" style="margin-top: 8px">刷 新
            </el-button>
            </div>
        </div>
        <el-dialog title="修改职称" :visible.sync="dialogVisible" width="30%">
            <div>
                <el-form :rules="rules">
                    <el-form-item label="职称名称" prop="updateJl.name">
                        <el-input type="text" class="updatePosInput" size="small" v-model="updateJl.name"/>
                    </el-form-item>
                    <el-form-item label="职称等级" prop="updateJl.titlelevel">
                        <el-select v-model="updateJl.titlelevel" placeholder="职称等级" size="small"
                                   style="margin-left: 5px;margin-right: 5px">
                            <el-option v-for="item in titlelevels" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否启用" prop="updateJl.enabled">
                        <el-switch v-model="updateJl.enabled" style="margin-left: 15px">
                        </el-switch>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button    size="small" @click="outUpdate">取 消</el-button>
    <el-button    size="small" type="primary" @click="doUpdate">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "JobLevelMana",
        data() {
            return {
                dialogVisible: false,
                loading: false,
                multipleSelection: [],
                updateJl: {
                    name: '',
                    titlelevel: '',
                    enabled: false
                },
                jl: {
                    name: '',
                    titlelevel: '',
                    searchname: '',
                },
                jls: [],
                titlelevels: [
                    '正高级',
                    '副高级',
                    '中级',
                    '初级',
                    '员级',
                ]
            }
        },
        mounted() {
            this.initJls();
        },
        methods: {
            refershMany() {
                this.initJls();
            },
            searchname() {
                if (this.jl.searchname) {
                    this.$notify.success({
                        title: '搜索讯息',
                        message: '搜 索 职 位 中...',
                        showClose: false,
                        offset: 100,
                        duration: 1500,
                        customClass: 'fontclass'
                    });
                    this.jl.name = this.jl.searchname;
                    this.postRequest("/system/basic/joblevel/serch/", this.jl).then(resp => {
                        if (resp) {
                            /*更新数据+清空列表*/
                            this.jls = resp;
                            this.jl.searchname = '';
                            this.jl.name = '';
                        }
                    })
                } else {
                    this.$notify({
                        title: '搜索讯息',
                        message: '搜 索 字 段 不 可 以 为 空!...',
                        showClose: false,
                        offset: 100,
                        duration: 1500,
                        customClass: 'fontclass',
                        type: 'warning'
                    });
                }
            },
            deleteMany() {
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
                        message: '删 除 职 位 中...',
                        showClose: false,
                        offset: 100,
                        duration: 1500,
                        customClass: 'fontclass'
                    });
                    this.deleteRequest("/system/basic/joblevel/" + ids).then(resp => {
                        if (resp) {
                            this.initJls();
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
            outUpdate() {
                this.dialogVisible = false;
                this.$notify.info({
                    title: '修改讯息',
                    message: '以 取 消 修 改 职 位 ',
                    showClose: false,
                    offset: 100,
                    duration: 1500,
                    customClass: 'fontclass'
                });
            },
            doUpdate() {
                this.$notify.success({
                    title: '修改讯息',
                    message: ' 修 改 职 位 中...',
                    showClose: false,
                    offset: 100,
                    duration: 1500,
                    customClass: 'fontclass'
                });
                this.putRequest("/system/basic/joblevel/", this.updateJl).then(resp => {
                    if (resp) {
                        this.initJls();
                        this.dialogVisible = false;
                    }
                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            showEditView(data) {
                Object.assign(this.updateJl, data);
                this.dialogVisible = true;
            },
            deleteHandler(data) {
                this.$confirm('此操作将永久【' + data.name + '】职称, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$notify.success({
                        title: '删除讯息',
                        message: '删 除 职 位 中...',
                        showClose: false,
                        offset: 100,
                        duration: 3000,
                        customClass: 'fontclass'
                    });
                    this.deleteRequest("/system/basic/joblevel/" + data.id).then(resp => {
                        if (resp) {
                            this.initJls();
                        }
                    })
                }).catch(() => {
                    this.$notify.info({
                        title: '删除讯息',
                        message: '以 取 消 删 除 ...',
                        showClose: false,
                        offset: 100,
                        duration: 3000,
                        customClass: 'fontclass'
                    });
                });
            },
            addJobLevel() {
                if (this.jl.name && this.jl.titlelevel) {
                    this.$notify.success({
                        title: '添加讯息',
                        message: '添 加 职 位 中...',
                        showClose: false,
                        offset: 100,
                        duration: 1500,
                        customClass: 'fontclass'
                    });
                    this.postRequest("/system/basic/joblevel/", this.jl).then(resp => {
                        if (resp) {
                            this.initJls();
                        }
                    });
                } else {
                    this.$notify({
                        title: '添加讯息',
                        message: '添 加 字 段 不 可 以 为 空...',
                        showClose: false,
                        offset: 100,
                        duration: 1500,
                        customClass: 'fontclass',
                        type: 'warning'
                    });
                }
            },
            /*数据初始化*/
            initJls() {
                setTimeout(() => {
                    this.$notify.success({
                        title: '系统讯息',
                        message: '职 称 信 息 加 载 中...',
                        showClose: false,
                        offset: 100,
                        duration: 1500,
                        customClass: 'fontclass'
                    });
                }, 1000);

                this.loading = true;
                this.getRequest("/system/basic/joblevel/all").then(resp => {
                    this.loading = false;
                    if (resp) {
                      window.sessionStorage.removeItem("joblevels");
                      this.jls = resp;
                        this.jl = {
                            name: '',
                            titleLevel: ''
                        };
                    }
                })
            }
        }
    }
</script>

<style scoped >

    .fontclass {
        font-size: 35px;
        font-family: 站酷庆科黄油体;
    }

</style>