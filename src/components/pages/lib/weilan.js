import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import wateruv from '../../../assets/images/timg.jpg'
import waternormal from '../../../assets/images/waternormals.jpg'
import * as THREE from 'three'
import Base3d from './Base3d'
import {FileLoader, Mesh, MeshBasicMaterial, PlaneGeometry, ShaderMaterial, TextureLoader} from "three";
import objloader from "../../../utils/loaders/objloader";
import baseURL from "../../../config/config";
import BaseComposer from "./composer/BaseComposer";
import activeShaderPass from "./composer/activeShaderPass";
import outlineColorPass from "./composer/outLineColorPass";
import blurPss from "./composer/blurPass";
import night from '../../../assets/images/night.png'

import MathUtil from "../../../utils/MathUtil";
export default class weilan extends Base3d{
  init() {
    super.init();
    let loader=new OBJLoader();
    this.shaderMaterial=new THREE.ShaderMaterial({
      side:THREE.DoubleSide,
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
        u_camera:{
          value:new THREE.Vector3(0.0,0.0,0.0)
        },
        u_lightPosition:{
          value:new THREE.Vector3(2555.0,2555.0,2555.0)
        },
        u_Resolution: {
          value: {
            x: window.innerWidth,
            y: window.innerHeight
          }
        },
        u_color:{
          value:new THREE.Color(0xDCFCFF)
        }
      },
      vertexShader: `

        varying vec2 vUv;
        varying vec3 v_position;
        void main(){
         vUv=uv;
         v_position=position;
         v_position.z*=2.0;
         gl_Position = projectionMatrix * modelViewMatrix * vec4(v_position,1.0);
        }
      `
      ,
      fragmentShader:`
        varying float v_diffuse;
        uniform vec3 u_color;
        varying vec2 vUv;
        uniform float u_time;
        varying vec3 v_position;
        float remain(float x,float num){
            return x-floor(x/num)*num;
        }
        void main(){
          float z_step=normalize(v_position).z/3.0;
          gl_FragColor=vec4(u_color,1.0);
          //gl_FragColor = vec4(vUv.x,vUv.y*sin(u_time),0.5,1.0);
          // gl_FragColor = vec4(0.5,0.2,0.5,1.0)*v_position.z;
        }
      `,
    })
    // loader.load(baseURL+"/static/models/wj_height_60.obj",(obj)=>{
    //   // console.log(obj);
    //   // return
    //   // let mesh=new THREE.Mesh(obj,new THREE.MeshBasicMaterial({color:"0xFFFFF"}));
    //   console.log(obj);
    //   obj.children[0].material=this.shaderMaterial
    //   this.scene.add(obj)
    //   obj.position.setX(obj.position.x+150)
    //   obj.position.setY(obj.position.y+50)
    //   obj.scale.set(0.02,0.02,0.05)
    //   obj.rotateY(Math.PI)
    // });
    loader.load(baseURL+"/static/models/wj_height_60.obj",(obj)=>{
      // console.log(obj);
      // return
      // let mesh=new THREE.Mesh(obj,new THREE.MeshBasicMaterial({color:"0xFFFFF"}));
      console.log(obj);
      obj.children[0].material=new THREE.MeshBasicMaterial({color:0x0D559E,side:THREE.DoubleSide});
      this.scene.add(obj)
      obj.position.setX(obj.position.x+150)
      obj.position.setY(obj.position.y+50)
      obj.position.setY(obj.position.z+52)
      obj.scale.set(0.02,0.02,0.05)
      obj.rotateY(Math.PI)
    });
    let textureLoader=new TextureLoader()
    let scene=new THREE.Scene();
    let geo=new PlaneGeometry(window.innerWidth/2,window.innerHeight/2,20);
    // this.scene.add()
    scene.add(new Mesh(geo,new MeshBasicMaterial({map:textureLoader.load(night)})))
    this.composer=new BaseComposer(this.scene,this.camera,this.renderer)
    this.composer2=new BaseComposer(scene,this.camera,this.renderer)
    this.shaderPass=new activeShaderPass(0.01,0.001);
    this.shaderPass.setRadius(0.05)
    this.shaderPass.setReduce(0.005)
    this.composer.addPass(this.shaderPass.getPass(this.composer.getComposer().renderTarget2.texture,this.composer2.getComposer().renderTarget2.texture))
  }
  render() {
    //this.composer2.getComposer();
    this.composer2.getComposer().render();
    this.composer.getComposer().render() ;
    requestAnimationFrame( this.render.bind(this) );
    this.shaderPass.shader.uniforms.u_time.value+=0.01;
    this.shaderPass.setRadius(this.shaderPass.radius*Math.abs(Math.sin(this.shaderPass.shader.uniforms.u_time.value)),false)
    //this.shaderMaterial.uniforms.u_time.value+=0.05;
  }
}
