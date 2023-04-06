<template>
    <div>
        <div class="permissManaTool">
            <el-input placeholder="请输入角色英文名" v-model="role.name">
                <template slot="prepend">ROLE_</template>
            </el-input>
            <el-input placeholder="请输入角色中文名" v-model="role.namezh"
                      @keydown.enter.native="doAddRole"></el-input>
            <el-button   type="primary" icon="el-icon-plus" @click="doAddRole" style="margin-right: 120px">添加角色</el-button>
            <el-tooltip content="角色权限预览" placement="right" effect="light">
                <el-button   type="success" icon="el-icon-picture-outline-round" @click="table = true" circle>
                </el-button>
            </el-tooltip>

        </div>
        <div class="permissManaMain">
            <el-collapse v-model="activeName"
                         accordion
                         @change="change">
                <el-collapse-item :title="r.namezh" :name="r.id" v-for="(r,index) in roles" :key="index">
                    <el-card class="box-card" shadow="hover">
                        <div slot="header" class="clearfix" style="height: 1px;font-family: 站酷庆科黄油体">
                            <span class="el-icon-s-flag" style="font-size: 20px;color: #409eff">权限树</span>
                            <el-tooltip content="删除角色" placement="right" effect="light">
                                <el-button style="float: right; padding: 0 0;color: #ff0000;font-size: 20px"
                                           icon="el-icon-delete"
                                           type="text" @click="deleteRole(r)"></el-button>
                            </el-tooltip>
                        </div>
                        <div>
                            <el-tree
                                    accordion
                                    show-checkbox
                                    node-key="id"
                                    ref="tree"
                                    :key="index"
                                    :default-checked-keys="selectedMenus"
                                    :data="allmenus" :props="defaultProps"></el-tree>
                            <div style="display: flex;justify-content: flex-end">
                                <el-button   @click="cancelUpdate">取消修改</el-button>
                                <el-button   type="primary" @click="doUpdate(r.id,index)">确认修改</el-button>
                            </div>
                        </div>
                    </el-card>
                </el-collapse-item>
            </el-collapse>
        </div>
        <el-drawer size="50%" direction="btt" custom-class="drawerstyle" :modal="false"
                   :visible.sync="table">
            <ve-tree :data="chartData" :settings="chartSettings"></ve-tree>
           
        </el-drawer>
    </div>
</template>

<script>

    export default {
        data() {
            this.chartSettings = {
                seriesMap: {
                    tree1: {
                        /*layout: 'radial',*/
                        height: '100%',
                        roam: true,
                        top: "10",
                        bottom: "10",
                        initialTreeDepth: 3,
                        lineStyle:{//正常情况显示
                            color: '#67C23A',
                            width: 1,
                        },
                    }
                }
            }
            return {
                chartData: {
                    columns: ['name', 'value'],
                    rows: [
                        {
                            name: 'tree1',
                            value: this.allmenus
                        }
                    ]
                },
                role: {
                    name: '',
                    namezh: ''
                },
                allmenus: [],
                activeName: -1,
                selectedMenus: [],
                roles: [],
                loading: false,
                globalLoading: false,
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                table: false,
            }
        },
        mounted() {
            this.initRoles();
            this.initAllMenus();

        },
        methods: {
            deleteRole(role) {
                this.$confirm('此操作将永久删除【' + role.namezh + '】角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$notify.success({
                        title: '删除讯息',
                        message: '删 除 角 色 中...',
                        showClose: false,
                        offset: 100,
                        duration: 1500,
                        customClass: 'fontclass'
                    });
                    this.deleteRequest("/system/basic/permiss/role/" + role.id).then(resp => {

                        if (resp) {
                            this.initRoles();
                        }
                    })
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
            doAddRole() {
                if (this.role.name && this.role.namezh) {
                    this.$notify.success({
                        title: '添加讯息',
                        message: '添 加 角 色 中...',
                        showClose: false,
                        offset: 100,
                        duration: 1500,
                        customClass: 'fontclass'
                    });
                    this.postRequest("/system/basic/permiss/role/", this.role).then(resp => {
                        if (resp) {
                            this.role.name = '';
                            this.role.namezh = '';
                            this.initRoles();
                        }
                    })
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
            cancelUpdate() {
                //面版关闭
                this.activeName = -1;
                this.$notify.info({
                    title: '修改讯息',
                    message: ' 修 改 取 消',
                    showClose: false,
                    offset: 100,
                    duration: 1500,
                    customClass: 'fontclass'
                });
            },
            doUpdate(rid, index) {
                this.$notify.success({
                    title: '修改讯息',
                    message: ' 修 改 角 色 中...',
                    showClose: false,
                    offset: 100,
                    duration: 1500,
                    customClass: 'fontclass'
                });
                let tree = this.$refs.tree[index];
                /*只接受叶子节点的值*/
                let selectedKeys = tree.getCheckedKeys(true);
                let url = '/system/basic/permiss/?rid=' + rid;
                selectedKeys.forEach(key => {
                    url += '&mids=' + key;
                })
                this.putRequest(url).then(resp => {
                    if (resp) {
                        this.activeName = -1;
                    }
                })
            },
            change(rid) {
                if (rid) {
                    this.initSelectedMenus(rid);
                }
            },
            /*加载当前角色的菜单栏*/
            initSelectedMenus(rid) {
                this.getRequest("/system/basic/permiss/mids/" + rid).then(resp => {
                    if (resp) {
                        this.selectedMenus = resp;
                    }
                });
            },
            /*加载菜单树*/
            initAllMenus() {

                this.getRequest("/system/basic/permiss/menus").then(resp => {
                    if (resp) {
                        this.allmenus = resp;
                        this.chartData.rows[0].value = this.allmenus;
                    }
                })

            },
            initRoles() {
                setTimeout(() => {
                    this.$notify.success({
                        title: '系统讯息',
                        message: '角 色 权 限 信 息 加 载 中...',
                        showClose: false,
                        offset: 100,
                        duration: 1500,
                        customClass: 'fontclass'
                    });
                }, 1100);
                this.loading = true;
                this.getRequest("/system/basic/permiss/").then(resp => {
                    this.loading = false;
                    if (resp) {
                        this.roles = resp;
                    }
                })
            }
        }
    }
</script>

<style>
.fontclass {
        font-family: 站酷庆科黄油体;
    }

    .box-card{
        width: 850px;
    }

    .el-drawer.drawerstyle {
        border-radius: 15px 0px 0px 15px;
        box-shadow: dodgerblue;
        background: Transparent

    }

    .permissManaTool {
        display: flex;
        justify-content: flex-start;
    }

    .permissManaTool .el-input {
        width: 300px;
        margin-right: 6px;
    }

    .permissManaMain {
        margin-top: 10px;
        width: 900px;
    }

    .clearfix {
        /*// 边框阴影*/
        box-shadow: 0 0 30px #cac6c6;
        /*背景裁剪在背景边框内部*/
        background-clip: padding-box;
        background: #ffffff;
        height: 20px;
    }
</style>