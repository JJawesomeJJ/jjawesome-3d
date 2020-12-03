
import * as THREE from 'three'
<template>
  <div>
    three
  </div>
</template>

<script>

  import * as THREE from 'three'
  import water from '../../assets/images/timg.jpg'
    export default {
        name: "water",
      created() {
        var scene = new THREE.Scene();//场景
        var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
        //相机
        var renderer = new THREE.WebGLRenderer();//渲染器
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );

        var geometry = new THREE.BoxGeometry( 10, 5, 0.1 );//物体
        var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );//材料


        camera.position.z = 5;
// TextureLoader创建一个纹理加载器对象，可以加载图片作为几何体纹理
        var textureLoader = new THREE.TextureLoader();
        // 执行load方法，加载纹理贴图成功后，返回一个纹理对象Texture

        textureLoader.load(water, (texture) => {
          this.material = new THREE.MeshBasicMaterial({
            map: texture,//设置颜色贴图属性值
          }); //材质对象Material
          this.mesh = new THREE.Mesh(geometry, this.material);
          this.mesh.rotation.x = -0.2;
          this.cube = new THREE.Mesh( geometry, this.material );
          scene.add( this.cube );
          animate();

          //纹理贴图加载成功后，调用渲染函数执行渲染操作
          // this.render();
        });
        var animate=()=>{
          requestAnimationFrame( animate );
          this.cube.rotation.x += 0.01;
          this.cube.rotation.y += 0.01;

          renderer.render( scene, camera );
        };


      }
    }

</script>

<style scoped>

</style>
