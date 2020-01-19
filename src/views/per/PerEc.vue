<template>
  <div>
    <template>
      <el-tabs v-model="activeName"
               @tab-click="handleClick">
        <el-tab-pane label="添加奖惩"
                     name="Addjc">
          <Addjc></Addjc>
        </el-tab-pane>
        <el-tab-pane label="奖惩管理"
                     name="Magjc">
          <Magjc></Magjc>
        </el-tab-pane>
      </el-tabs>
    </template>
  </div>
</template>

<script>
import Addjc from "../../components/per/ec/Addjc.vue";
import Magjc from "../../components/per/ec/Magjc.vue";
export default {
  name: "PerEc",
  data () {
    return {
      activeName: 'Addjc',
      data: {},
    }
  },
  methods: {

  },
  components: {
    Addjc,
    Magjc,
  }
}
</script>

<style scoped>
</style>