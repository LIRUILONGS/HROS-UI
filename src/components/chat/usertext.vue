<template>
  <div id="uesrtext">

    <textarea placeholder=" Ctrl + Enter 发送"
              v-model="content"
              v-on:keyup="addMessage">
              </textarea>

    <div style="background-color:#fff;float: right;">
      <el-button type="success"
                 size="mini"
                 style="margin:0 20px 10px 10px"
                 @click="send"
                 plain>发送(S)
      </el-button>
    </div>
  </div>

</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'uesrtext',
  data () {
    return {
      content: ''
    }
  },
  computed: {    ...mapState([
      'sessions',
      'currentSession'
    ])  },
  methods: {

    addMessage (e) {
      if (e.ctrlKey && e.keyCode === 13 && this.content.length) {
            this.send ();
      }
    },
    send () {
      if(this.content){
      let msgObj = new Object();
      console.log(this.currentSession);
      //  msgObj.to = "hanyu";
      msgObj.to = this.currentSession.username;
      msgObj.content = this.content;
      console.log(msgObj);
      this.$store.state.stomp.send('/ws/chat', {}, JSON.stringify(msgObj));
      this.$store.commit('addMessage', msgObj);
      this.content = '';
    }else {
        
    }
    }
  }
}
</script>

<style lang="scss" scoped>
#uesrtext {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 30%;
  border-top: solid 1px #ddd;
}
textarea {
  padding: 10px;
  width: 100%;
  height: 65%;
  border: none;
  outline: none;
}
</style>
