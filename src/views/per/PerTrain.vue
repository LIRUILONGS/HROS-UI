<template>
  <div>
    <template>
      <el-tabs v-model="activeName"
               @tab-click="handleClick">
        <el-tab-pane label="添加培训"
                     name="Addtrain">
          <Addtrain></Addtrain>
        </el-tab-pane>
       
        <el-tab-pane label="培训管理"
                     name="Magtrain">
          <Magtrain></Magtrain>
        </el-tab-pane>
          <el-tab-pane label="添加考评"
                     name="AddAppr">
          <AddAppr></AddAppr>
        </el-tab-pane>
        <el-tab-pane label="考评管理"
                     name="MagAppr">
          <MagAppr></MagAppr>
        </el-tab-pane>
      </el-tabs>
    </template>
  </div>
</template>

<script>
import Addtrain from "../../components/per/train/Addtrain.vue";
import AddAppr from "../../components/per/train/AddAppr.vue";
import Magtrain from "../../components/per/train/Magtrain.vue";
import MagAppr from "../../components/per/train/MagAppr.vue";
export default {
  name: "PerTrain",
  data () {
    return {
      activeName: 'Addtrain',
      data: {},
    }
  },
  methods: {

  },
  components: {
    Addtrain,
    AddAppr,
    Magtrain,
    MagAppr,
  }
}
</script>

<style scoped>
</style>