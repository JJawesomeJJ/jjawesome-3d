<template>
<div></div>
</template>

<script>
import weilan from "./lib/weilan";
export default {
name: "weilan",
  mounted() {
    (new weilan()).render();
  }
}
</script>
<style scoped>

</style>
