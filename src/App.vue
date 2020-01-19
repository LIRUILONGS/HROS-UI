<template>
  <div id="app">
    <router-view v-if="isRouterAlivee" />
  </div>
</template>
<script>
export default {
  name: 'app',
  provide () {
    return {
      reload: this.reload
    };
  },
  data () {
    return {
      isRouterAlivee: true
    };
  },
  methods: {
    reload () {
      this.isRouterAlivee = false;
      this.$nextTick(function () {
        this.isRouterAlivee = true;
      })
    }
  }
}

</script>
<style >
@import "./common/font/font.css";
</style>


