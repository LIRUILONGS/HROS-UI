<template>
  <div>
    <template>
      <el-tabs v-model="activeName"
               @tab-click="handleClick">
        <el-tab-pane label="考勤管理"
                     name="Workjc">
          <Workjc></Workjc>
        </el-tab-pane>


      </el-tabs>
    </template>
  </div>
</template>

<script>
import Workjc from "../../components/per/ec/Workjc.vue";
export default {
  name: "PerWork",
  data () {
    return {
      activeName: 'Workjc',
      data: {},
    }
  },
  methods: {

  },
  components: {
    Workjc,
  }
}
</script>

<style scoped>
</style>
