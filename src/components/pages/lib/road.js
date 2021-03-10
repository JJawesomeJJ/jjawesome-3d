import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import Base3d from "./Base3d";
import baseURL from "../../../config/config";
import Timer from "./until/Timer";
export default class road extends Base3d{
  init() {
    this.timer=Timer.singleTon();
    this.roadMaterial=new THREE.ShaderMaterial({
      // depthWrite: true,
      depthTest: true,
      polygonOffset: true,
      polygonOffsetFactor: -5.0,
      polygonOffsetUnits: 2.0,
      transparent: true,
      side:THREE.DoubleSide,
      uniforms: {
        uEdgeColor:{
          value:new THREE.Color(0xEBFF8)
        },
        uStartx:{
          value:0.0
        },
        uLightX:{
          value:0.0
        },
        uLightRadio:{
          value:0.0
        }
      },
      vertexShader: `
            varying vec2 uVu;
            varying vec3 aPosition;
            void main(){
            uVu = uv;
            aPosition=position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
        `,
      fragmentShader: `
          varying vec2 uVu;
          varying vec3 aPosition;
          uniform vec3 uEdgeColor;
          uniform float uStartx;
          uniform float uLightX;
          uniform float uLightRadio;
          uniform sampler2D utexture;
          float hasColor(vec3 color){
                return ceil((color.x+color.y+color.z)/10.0);
          }
          vec4 getEdgeLightColor(float width){
              return vec4(step(0.5-width,abs(0.5-uVu.y))*uEdgeColor,1.0);
          }
          vec4 getBaseColor(vec4 lightColor){
              return (1.0-hasColor(lightColor.xyz))*vec4(uEdgeColor,0.1)*0.2;
          }
          float animate(){
              return step(abs(0.5-uVu.x),uStartx);
          }
          float getLightLine(float height){
                getEdgeLightColor(0.1)*step(0.5-height,uStartX-abs(uVu.x-0.5));
          }
          void main(){
              vec4 edgeColor=getEdgeLightColor(0.1);
              gl_FragColor=edgeColor+getBaseColor(edgeColor);
              gl_FragColor=gl_FragColor*animate();
              gl_FragColor+=hasColor(edgeColor.xyz)*step(abs(0.5-uVu.x),uLightX-0.1)*vec4(1.0,1.0,1.0,1.0)*0.2+getLightLine(0.08)*vec4(1.0,0.0,0.0,1.0);
          }
        `,
    })
    super.init();
    let path=baseURL+"/static/models/shixinlu.fbx";
    //var loader = new FBXLoader();
    // loader.load(path,(obj)=>{
    //   obj.traverse((ele)=>{
    //     ele.scale.setY(0.01)
    //     ele.material=
    //   })
    //   this.scene.add(obj)
    // })
    let mesh=new THREE.Mesh(new THREE.PlaneGeometry(1000,20,30),this.roadMaterial)
    this.scene.add(mesh)
  }
  render() {
    this.roadMaterial.uniforms.uStartx.value=this.timer.getOrSetRunTime("roadName",0.001,this.timer.getAspeendFun(0.01));
    this.roadMaterial.uniforms.uLightX.value=this.timer.getOrSetRunTime("roadNameLight",0.001,this.timer.getAspeendFun(0.007));

    super.render();
  }
}
