<template>
  <div>
    <template>
      <el-tabs v-model="activeName"
               @tab-click="handleClick">

        <el-tab-pane label="奖惩管理"
                     name="Magjc">
          <Magjc :keyword-from="true"></Magjc>
        </el-tab-pane>
      </el-tabs>
    </template>
  </div>
</template>

<script>
import Magjc from "../../components/per/ec/Magjc.vue";
export default {
  name: "PerEc2",
  data () {
    return {
      activeName: 'Magjc',
      data: {},
    }
  },
  methods: {

  },
  components: {
    Magjc,
  }
}
</script>

<style scoped>
</style>
