import Base3d from "./Base3d";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export default class Scan extends Base3d{
  constructor(props) {
    super()
  }
  init() {
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    //相机
    this.renderer = new THREE.WebGLRenderer();//渲染器
    this.scene = new THREE.Scene();//场景
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( this.renderer.domElement );
    this.camera.position.z = 300;
    let controls = new OrbitControls( this.camera, this.renderer.domElement );
    this.geometry = new THREE.BoxGeometry(100, 300, 60);
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        u_time: {
          'type': "f",
          'value': 0.0,
        },
        u_AmbientLight: {
          value: new THREE.Vector4(1.0, 1.0, 1.0, 1.0)
        },
        u_LightDirection: {
          value: new THREE.Vector3(0.5, 0.3, 0.6)
        },
        u_rand: {
          value: Math.random()
        },
        u_Resolution: {
          value: {
            x: window.innerWidth,
            y: window.innerHeight
          }
        },
      },
      vertexShader: `
        uniform float u_time;
        varying vec2 vUv;
        attribute vec4 a_Position;
        attribute vec2 a_TexCoord;
        varying vec2 v_TexCoord;
        varying float v_time;
        varying vec3 v_position;
        varying vec3 u_position;
        uniform vec2 u_Resolution;
        varying vec2 v_Resolution;
        varying vec3 vPos; 
        varying float v_z;
        uniform mat4 uMVMat;
        uniform mat4 uProjMat;
        varying vec4 w_position;
      
        void main(){
            //vPos = uMVMat * aVertexPos;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
            w_position=modelViewMatrix * vec4(position,1.0);
            v_position=vec3(modelMatrix*a_Position);
            v_z=gl_Position.z;
            u_position=v_position;
            v_Resolution=u_Resolution;
        }
      `
      ,
      fragmentShader:`
        uniform float u_time;
        varying float v_z;
        varying vec2 v_Resolution;
        varying vec4 w_position;
        float max;
        float min;
        varying vec3 u_position;
        float space;
        float remain(float x,float num){
         return x-floor(x/num)*num;
        }
        // vec3 ndcPos;
        // vec4 world(vec4 v,mat4 m){
        // ndcPos.x=gl_FragCoord.x/1920.0*2.0-1.0;
        // ndcPos.y=gl_FragCoord.y/937.02.0-1.0;
        // }
        void main(){
        float time=u_time;
        time=pow(u_time,1.2);
        float space=5.0;
        float line_space=0.5;
         if(w_position.y+100.0>=time&&w_position.y+20.0<=time){
             if(remain(w_position.y,space)<=line_space||remain(w_position.x,space)<=line_space){
                gl_FragColor = vec4(1.0,0.0,0.0,1.0);
                }else{
                gl_FragColor = vec4(1.0,1.0,1.0,1.0);
                }
                }
         else{
          gl_FragColor = vec4(1.0,1.0,1.0,1.0);

         }
       
        }
      `,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }
  render=()=>{
    this.renderer.render( this.scene, this.camera );
    // console.log("fsdfs")
    this.material.uniforms.u_time.value+=1.0;
    //console.log(Math.sin(this.material.uniforms.time.value*10));
    // this.material.uniforms.rand.value=Math.floor(Math.random()*10000000);
    requestAnimationFrame( this.render.bind(this) );
  }
}
