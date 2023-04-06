<template>
  <div id="card">
    <header>
      <img class="avatar"
           v-bind:src="user.userface"
           v-bind:alt="user.name">
      <p class="name">{{ user.name }}</p>
    </header>
    <footer>
      <input class="search"
             type="text"
             v-model="filterKey"
             v-on:change="change()"
             placeholder="search user...">
    </footer>
  </div>
</template>

<script>
import {getRequest} from "@/utils/api";

export default {
  name: 'card',
  data() {
    return {
      filterKey:'',
      user: JSON.parse(window.sessionStorage.getItem("user"))
    }
  },
  methods: {
    change() {
      console.log('initData')
      getRequest("/chat/hrs").then(resp => {
        if (resp) {
          console.log(this.filterKey)
          var myarr = resp;
          if (this.filterKey !== ''){
            myarr = resp.filter(v => v.name === this.filterKey)
          }
          this.$store.commit('INIT_HR', myarr);
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#card {
  padding: 12px;

  .avatar {
    width: 40px;
    height: 40px;
    vertical-align: middle; /*这个是图片和文字居中对齐*/
    border-radius: 5px;
  }

  .name {
    display: inline-block;
    padding: 10px;
    margin-bottom: 15px;
    font-size: 16px;
  }

  .search {
    background: #26292e;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    border: 1px solid #3a3a3a;
    border-radius: 4px;
    outline: none; /*鼠标点击后不会出现蓝色边框*/
    color: #fff;
  }
}
</style>
