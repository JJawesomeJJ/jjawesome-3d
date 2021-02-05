<template>

</template>

<script>
  import beisaierLine from "./lib/beisaierLine";
    export default {
        name: "line",
        created() {
        },
        mounted() {
           let line=new beisaierLine();
           line.render();
        }
    }
</script>

<style scoped>

</style>
