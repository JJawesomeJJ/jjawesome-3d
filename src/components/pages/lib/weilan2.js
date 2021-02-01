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
export default class weilan2 extends Base3d{
  init() {
    super.init();
    let loader=new OBJLoader();
    this.shader=new ShaderMaterial({
      side:THREE.DoubleSide,
      uniforms:{
        u_color:{
          value:new THREE.Color(0xDCFCFF)
        },
        uFirstColor:{
          value:new THREE.Color(0xA95FF)
        },
        uSecondColor:{
          value:new THREE.Color(0xA2D58)
        },
        uThirdColor:{
          value:new THREE.Color(0xA95FF)
        }
      },
      vertexShader:`
        varying vec2 vUv;
        varying vec3 v_position;
        void main(){
         vUv=uv;
         v_position=position;
         //v_position.z*=2.0;
         gl_Position = projectionMatrix * modelViewMatrix * vec4(v_position,1.0);
        }
      `,
      fragmentShader:`
        varying float v_diffuse;
        uniform vec3 u_color;
        varying vec2 vUv;
        uniform float u_time;
        uniform vec3 uFirstColor;
        uniform vec3 uSecondColor;
        uniform vec3 uThirdColor;
        varying vec3 v_position;
        float remain(float x,float num){
            return x-floor(x/num)*num;
        }
        void main(){
          vec3 positionN=normalize(v_position);
          float value=1.0/3.0;
          float first=ceil(1.0-step(value,vUv.x));
          float second=step(value,vUv.x)*ceil(1.0-step(value*2.0,vUv.x));
          float third=step(value*2.0,vUv.x);
          vec4 color=vec4(uFirstColor,1.0)*first+vec4(uSecondColor,1.0)*second+vec4(uThirdColor,1.0)*third;
          color*=abs(sin(abs(positionN.x)));
          gl_FragColor=color;
          //gl_FragColor = vec4(vUv.x,vUv.y*sin(u_time),0.5,1.0);
          // gl_FragColor = vec4(0.5,0.2,0.5,1.0)*v_position.z;
        }
      `
    })
    loader.load(baseURL+"/static/models/sichuan_fence.obj",(obj)=>{
      // console.log(obj);
      // return
      // let mesh=new THREE.Mesh(obj,new THREE.MeshBasicMaterial({color:"0xFFFFF"}));
      console.log(obj);
      //obj.children[0].material=new THREE.MeshBasicMaterial({color:0x0D559E,side:THREE.DoubleSide});
      obj.children[0].material=this.shader;
      this.scene.add(obj)
      obj.position.setX(obj.position.x-500)
      obj.position.setY(obj.position.y+200)
      //obj.position.setY(obj.position.z+5552)
      obj.scale.set(0.0005,0.0005,0.005)
      obj.rotateY(Math.PI)
    });
  }
}
