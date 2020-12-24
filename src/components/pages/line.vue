<template>
    <div>
      <canvas id="myCanvas" width="800" height="800"
              style="border:1px solid #000000;">
      </canvas>
    </div>
</template>

<script>
  import Line from "./lib/line"
    export default {
        name: "line",
        created() {

        },
        mounted() {
            let line1=new Line();
            var c=document.getElementById("myCanvas");
            var ctx=c.getContext("2d");
            ctx.fillStyle="#FF0000";
            ctx.fillRect(0,0,150,75);
        }
    }
</script>

<style scoped>

</style>
