<template>
  <div id="app">
    <div class="sidebar">
      <card></card>
      <list></list>
    </div>
    <div class="main">
      <message></message>
      <usertext></usertext>
    </div>
  </div>
</template>

<script>
import card from '../../components/chat/card.vue'
import list from '../../components/chat/list.vue'
import message from '../../components/chat/message.vue'
import usertext from '../../components/chat/usertext.vue'

export default {
  name: 'pageChat',
  data () {
    return {

    }
  },
  mounted: function () {
    
    this.$store.dispatch('initData');
    
  },
  components: {
    card,
    list,
    message,
    usertext
  }
}
</script>

<style lang="scss" scoped>
#app {
  /*背景裁剪在背景边框内部*/
  background-clip: padding-box;
  /*// 边框样式*/
  border: 1px solid #eaeaea;
  /*// 边框阴影*/
  box-shadow: 0 0 25px #cac6c6;
  margin: 20px auto;
  width: 1000px;
  height: 600px;
  overflow: hidden;
  border-radius: 10px;

  .sidebar,
  .main {
    height: 100%;
  }
  .sidebar {
    float: left;
    color: #f4f4f4;
    background-color: #2e3238;
    width: 200px;
  }
  .main {
    position: relative;
    overflow: hidden;
    background-color: #fff;
  }
}
</style>