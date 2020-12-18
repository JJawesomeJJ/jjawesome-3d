<template>

</template>

<script>
    import Scan from "./lib/scan";
    export default {
        name: "scan",
        created() {
            // alert("dasdasd");
            let water=new Scan();
            water.render();
        }
    }
</script>
<style scoped>

</style>
