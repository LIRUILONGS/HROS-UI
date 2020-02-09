<template>
    <div>
        
        <template>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="公告管理" name="Amanagement"><Amanagement></Amanagement></el-tab-pane>
                <el-tab-pane label="公告编辑" name="Announcementtoedit"><Announcementtoedit></Announcementtoedit></el-tab-pane>
                
            </el-tabs>
        </template>
    </div>
</template>

<script>
    import Amanagement from "../../components/sys/cfg/Amanagement";
    import Announcementtoedit from "../../components/sys/cfg/Announcementtoedit";
    export default {
        name: "SysCfg",
        data(){
            return{
                activeName: 'Amanagement',
                data:{},
            }
        },
        methods:{
      
        },
        components:{
            Amanagement,
            Announcementtoedit,
        }
    }
</script>

<style scoped>

</style>