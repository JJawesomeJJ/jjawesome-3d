<template>

</template>

<script>
  import Water from "./lib/water";

  import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
  import * as THREE from 'three'
    export default {
        name: "water2",
        created() {
          // alert("dasdasd");
            let water=new Water();
            water.render();
        }
    }
</script>

<style scoped>

</style>
