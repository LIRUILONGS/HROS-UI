<template>
  <div>
    <template>
      <el-tabs v-model="activeName"
               @tab-click="handleClick">

        <el-tab-pane label="培训管理"
                     name="Magtrain">
          <Magtrain :keyword-from="true"></Magtrain>
        </el-tab-pane>
        <el-tab-pane label="考评管理"
                     name="MagAppr">
          <MagAppr :keyword-from="true"></MagAppr>
        </el-tab-pane>
      </el-tabs>
    </template>
  </div>
</template>

<script>
import Magtrain from "../../components/per/train/Magtrain.vue";
import MagAppr from "../../components/per/train/MagAppr.vue";
export default {
  name: "PerTrain2",
  data () {
    return {
      activeName: 'Magtrain',
      data: {},
    }
  },
  methods: {

  },
  components: {
    Magtrain,
    MagAppr,
  }
}
</script>

<style scoped>
</style>
