import Base3d from "./Base3d";
import * as THREE from "three";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'


import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import uv from '../../../assets/images/timg.jpg'
import {Matrix4} from "three";
import OutLineShader from "./shaders/outLineShader";
import BaseComposer from "./composer/BaseComposer";
import blurPass from "./composer/blurPass";
//import {EffectComposer} from 'three/examples/js/postprocessing/EffectComposer'


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
    this.geometry = new THREE.BoxGeometry(120, 320, 80);
    this.geometry2 = new THREE.BoxGeometry(100*0.9, 300*0.9, 60*0.9);
    this.geometry3 = new THREE.BoxGeometry(120*1.05, 400*1.05, 400*1.05);
    this.material = new THREE.ShaderMaterial({
      depthWrite: true,
      depthTest: true,
      transparent: true,
      opacity: 0.5,
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
             vec4 position2=vec4(position,1.0);
             //position2.x=cos(3.14/2.0)*position2.x;
             // position2.z+=sin(3.14/2.0)*position2.z;
             float x=position2.x;
             float y=position2.y;
             float z=position2.y;
             float r=sqrt(pow(x,2.0)+pow(y,2.0)+pow(z,2.0));
             //position2.y+=sqrt(pow())
             // position2.z+=sin(3.14/2.0)*position2.z;
             //position2.x=x-r*cos(3.14/-4.0);
             position2.y=y+r*sin(3.14/-4.0);
             //position2.z=z+r*sin(3.14/4.0);
            gl_Position = projectionMatrix * modelViewMatrix * position2;
            w_position=modelViewMatrix*modelMatrix * vec4(position,1.0);
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
        float space=2.0;
        float line_space=0.5;
         if(w_position.y+110.0>=time&&w_position.y+80.0<=time){
             if(remain(w_position.y,space)<=line_space||remain(w_position.x,space)<=line_space){
                gl_FragColor = vec4(0.8,0.0,0.0,1.0);
                }else{
                gl_FragColor = vec4(28.0/225.0,88.0/225.0,107.0/225.0,0.6);
                }
                }
         else{
         gl_FragColor = vec4(28.0/225.0,88.0/225.0,107.0/225.0,0.6);
         }
         //gl_FragColor = vec4(28.0/225.0,88.0/225.0,107.0/225.0,0.6);

        }
      `,
    });

    this.material2 = new THREE.ShaderMaterial({

      depthWrite: true,
      depthTest: false,
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
            w_position=modelMatrix * vec4(position,1.0);
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
        float space=2.0;
        float line_space=0.5;
        if(w_position.y<=0.0){
           gl_FragColor = vec4(1.0,1.0,1.0,0.6);
        }
        else{
           gl_FragColor = vec4(30.0/225.0,95.0/225.0,107.0/225.0,0.6);
        }
        }
      `,
    });
    //this.mesh = new THREE.Mesh(this.geometry, [new THREE.MeshBasicMaterial({color:0x123456}),this.material]);
    //this.mesh = new THREE.Mesh(this.geometry, [new THREE.MeshBasicMaterial({color:0x123456}),this.material]);
    //this.mesh = new THREE.Mesh(this.geometry, [new THREE.MeshBasicMaterial({color:0x123456}),this.material]);
    // this.material2.transparent = false;
    // this.material2.alphaTest = 0.1;
    // this.material2.depthWrite = false;
    this.material.transparent = true;
    this.material.alphaTest = 0.1;
    this.material.depthWrite = false;
    let textureLoder=(new THREE.TextureLoader());
    var texture=textureLoder.load(uv);
    var material3 = new THREE.MeshBasicMaterial( { map: texture } );
    this.mesh=new THREE.Mesh(this.geometry,this.material);
    this.scene.add(this.mesh)
    // this.mesh.renderOrder=1;
    //
    // this.mesh2=new THREE.Mesh(this.geometry2,material3);
    // this.mesh2.renderOrder=0.99;
    // this.scene.add(this.mesh2);
    // let mesh=new THREE.Mesh(this.geometry3,this.initOutDerLineMaterial(THREE.FrontSide,new THREE.Vector4(1.0,0.0,0.0,0.6)));
    // this.compute(mesh)
    // let mesh1=mesh.clone();
    // mesh1.material=this.initOutDerLineMaterial(THREE.BackSide,new THREE.Vector3(1.0,1.0,1.0,0.6));
    // mesh1.material=new OutLineShader().getShader();
    // this.compute(mesh1)
    // this.scene.add(mesh1);
    // this.scene.add(mesh);
    // this.scene.add(this.mesh);
    // console.log(mesh,'mesh')
    this.composer=new BaseComposer(this.scene,this.camera,this.renderer)
    this.blurPass=(new blurPass()).getPass(this.composer.getComposer().renderTarget2.texture);
    this.composer.addComposer(this.blurPass)
  }
  compute(mesh){
    mesh=mesh.clone();
    let matrix=new THREE.Matrix4();
    let camera_matrixWorldInverse=this.camera.clone().matrixWorldInverse.invert();
    let camera_projectionMatrix=this.camera.clone().projectionMatrix.invert();
    console.log((mesh.matrixWorld.invert()).multiply(camera_matrixWorldInverse).multiply(camera_projectionMatrix),'Matrix======>');
     //mesh.material.uniforms.m_ReverseModelViewMatrix.value=new THREE.Matrix4().getInverse(new THREE.Matrix4().multiplyMatrices(this.camera.matrixWorldInverse,mesh.matrixWorld));
    //mesh.material.uniforms.m_ReverseModelViewMatrix.value=(mesh.matrixWorld.invert()).multiply(camera_matrixWorldInverse).multiply(camera_projectionMatrix);
  }
  initOutDerLineMaterial(side,color){
    let modelViewMatrix=new Matrix4();
    let m_ReverseModelViewMatrix=new THREE.Matrix4().getInverse(modelViewMatrix);
    console.log(m_ReverseModelViewMatrix);
    console.log(m_ReverseModelViewMatrix,"reverse");
    return  new THREE.ShaderMaterial({
      depthWrite: true,
      depthTest: true,
      transparent: true,
      side:side,
      uniforms: {
        u_time: {
          'type': "f",
          'value': 0.0,
        },
        u_Resolution: {
          value: {
            x: window.innerWidth,
            y: window.innerHeight
          }
        },
        m_ReverseModelViewMatrix:{
          value:m_ReverseModelViewMatrix
        },
        u_opacity:{
          type:"f",
          value:1.0
        },
        u_outLine:{
          type:'f',
          value:3.0
        },
        u_color:{
          value:color
        }
      },
      vertexShader: `
          uniform float u_time;
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
          varying vec4 w_position;
          uniform float u_opacity;
          uniform float u_outLine;
          //模型视图矩阵的逆转矩阵
          uniform mat4 m_ReverseModelViewMatrix;
          void main(){
              //UNITY_MATRIX_MV 当前模型视图矩阵 ==>modelViewMatrix
              //vPos = uMVMat * aVertexPos;
              // float4 pos = mul (UNITY_MATRIX_MV , position) ;
              vec4 pos=modelViewMatrix * vec4(position,1.0);
              //m_ReverseModelViewMatrix 当前模型矩阵的逆转矩阵
              vec4 newNormal=vec4(normal,0.0);
              newNormal.z=-0.8;
              pos = pos +  normalize(newNormal)*u_outLine;
              gl_Position=projectionMatrix*pos;
          }
        `,
      fragmentShader: `
          uniform float u_time;
          varying vec2 v_Resolution;
          varying vec4 w_position;
          varying vec3 u_position;
          uniform vec4 u_color;
          uniform float u_opacity;
          float remain(float x,float num){
                return x-floor(x/num)*num;
          }
          void main(){
               gl_FragColor = u_color;//建筑变红
          }
        `,
    });
    return this.OutDerLineMaterial;
  }
  Inverse(mesh){
    // console.log(mesh,"before")
    // //mesh.matrixWorld=mesh.matrixWorld.getInverse(mesh.matrixWorld)
    // console.log(mesh,'after')
    // this.camera.matrixWorld.getInverse(this.camera.matrixWorld);
    // this.camera.matrixWorldInverse.getInverse(this.camera.matrixWorldInverse);
    // this.camera.projectionMatrix.getInverse(this.camera.projectionMatrix);
  }
  render=()=>{
    this.renderer.render( this.scene, this.camera );
    // //this.renderer.sortObjects = false;
    // // console.log("fsdfs")
    this.material.uniforms.u_time.value+=1.0;
    this.composer.getComposer().render();
    this.renderer.render( this.scene, this.camera );
    //this.blurPass.uniforms.u_time.value+=0.1;
    //console.log(Math.sin(this.material.uniforms.time.value*10));
    // this.material.uniforms.rand.value=Math.floor(Math.random()*10000000);
    requestAnimationFrame( this.render.bind(this) );
  }
}
