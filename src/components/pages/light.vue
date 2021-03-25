<template>

</template>

<script>
import lightCircle from "./lib/lightCircle";
export default {
  name: "light",
  mounted() {
    new lightCircle().render();
  }
}
</script>

<style scoped>

</style>
