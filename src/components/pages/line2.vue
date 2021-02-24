<template>
  <div>
    <img :src=ai alt="">
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
