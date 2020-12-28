<template>

</template>

<script>
import Outline from "./lib/outline";
export default {
name: "outline",
  mounted() {
  let outline=new Outline();
  outline.render();
  }
}
</script>

<style scoped>

</style>
