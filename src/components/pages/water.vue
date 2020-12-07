
import * as THREE from 'three'
<template>
  <div>
    three
  </div>
</template>

<script>

  import * as THREE from 'three'
  import water from '../../assets/images/timg.jpg'

  import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
  // import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
    export default {
        name: "water",
      created() {
        var vertex=`
            uniform float time;

        void main(){
            float x = position.x;
            float y = position.y;
            float PI = 3.141592653589;

            float sz = 0.0;
            float ti = 0.06;
            float index = 1.0;
            vec2 dir;//波的方向
            //四条正弦波相加
            for(int i = 0;i<4;i++){
                ti = ti + 0.0005;
                index = index + 0.1;
                if(mod(index,2.0)==0.0){
                    dir = vec2(1.0,ti);
                }else{
                    dir = vec2(-1.0,ti);
                }
                float l1 = 2.0 * PI / (0.5);//波长
                float s1 = 10.0 * 2.0 / l1;//速度
                float z1 = 1.0 * sin(dot(normalize(dir),vec2(x,y)) * l1 + time * s1);//正弦波方程式
                sz +=z1;
            }
            gl_Position = projectionMatrix * modelViewMatrix * vec4(x,y,sin(sz) * 10.0,1.0);
        }
        `;
        var fragmentShader=`
            void main(){
                gl_FragColor = vec4(90./255.,160./255.,248./255.,1.0);
            }
        `;
        var scene = new THREE.Scene();//场景

        var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
        //相机
        var renderer = new THREE.WebGLRenderer();//渲染器
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );

        var geometry = new THREE.PlaneGeometry( 500,500,100,20);//物体
        camera.position.z = 5;
// TextureLoader创建一个纹理加载器对象，可以加载图片作为几何体纹理
        var textureLoader = new THREE.TextureLoader();
        // 执行load方法，加载纹理贴图成功后，返回一个纹理对象Texture

        textureLoader.load(water, (texture) => {
          this.material = new THREE.ShaderMaterial({
            map: texture,//设置颜色贴图属性值
            uniforms: {
              delta: { type: 'f', value: 0.1 },
              time:{type:'f',value:0.1}
            },
            varyings:{
              v_g: { type: 'f', value: 0.1 }
            },
            vertexShader:  vertex,
            fragmentShader:fragmentShader,
            //
            // program: function(context) {
            //   context.beginPath();
            //   context.arc(0, 0, 1, 0, PI2, true);
            //   context.fill();
            // }

          }); //材质对象Material
          this.mesh = new THREE.Mesh(geometry, this.material);
          this.mesh.rotation.x = -0.2;
          this.cube = new THREE.Mesh( geometry, this.material );
          scene.add( this.mesh );
          animate();

          //纹理贴图加载成功后，调用渲染函数执行渲染操作
          // this.render();
        });
        // var value=0.0;
        let controls = new OrbitControls( camera, renderer.domElement );
        var animate=()=>{

          // value=value+0.2;
          // // console.log(value)
          this.mesh.material.uniforms['delta'].value+=0.1;    // console.log(value).delta.value=value
          // this.cube.rotation.x += 0.01;
          // this.cube.rotation.y += 0.01;
          // console.log(value)
          // console.log(this.mesh.material.uniforms['delta'].value)
          this.mesh.material.uniforms['time'].value+=0.03;
          renderer.render( scene, camera );
          requestAnimationFrame( animate );
        };


      }
    }

</script>
<style scoped>

</style>
