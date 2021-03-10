<template>
  <div id="ai_logo">
    <img style="width: 50px;height: 50px;background-size: 100% 100%" :src=ai alt="">
  </div>
</template>

<script>
import beisaier2 from "./lib/beisaier2";
import ai from "../../assets/images/ai.png"
export default {
  name: "line2",
  data:function (){
    return {
      "ai":ai
    }
  },
  mounted() {
    new beisaier2().render();
  }
}
</script>
<style scoped>

</style>
