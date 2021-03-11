import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import Base3d from "./Base3d";
import baseURL from "../../../config/config";
import Timer from "./until/Timer";
import roadImg from "../../../assets/images/road.png"
export default class road extends Base3d{
  init() {
    let roadTexture = new THREE.TextureLoader().load(roadImg);
    roadTexture.wrapS = roadTexture.wrapT = THREE.RepeatWrapping;
    this.timer=Timer.singleTon();
    this.roadMaterial=new THREE.ShaderMaterial({
      // depthWrite: true,
      depthTest: true,
      opacity:0.8,
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
          float getLightLine(float height,vec4 edgeColor){
               return hasColor(edgeColor.xyz)*animate();
          }
          vec4 getPlusLight(){
               return step(1.0,uStartx)*step(abs(0.5-uVu.y),(uStartx-1.0)*3.0)*vec4(1.0,1.0,1.0,1.0)*0.2;
          }
          vec4 getFirstLightColor(float height,float hasColorEdgeColor){
               float currentX=abs(0.5-uVu.x);
               return step(uStartx-currentX,height)*vec4(1.0,0.0,0.0,1.0)*hasColorEdgeColor;
          }
          void main(){
              vec4 edgeColor=getEdgeLightColor(0.1);
              vec4 firstLightColor=getFirstLightColor(0.05,hasColor(edgeColor.xyz));
              gl_FragColor=edgeColor+getBaseColor(edgeColor);
              gl_FragColor+=getPlusLight();
              gl_FragColor=gl_FragColor*(1.0-hasColor(firstLightColor.xyz))+firstLightColor;
              gl_FragColor=gl_FragColor*animate();
               gl_FragColor.w*= 0.7;
          }
        `,
    })
    super.init();
    let path=baseURL+"/static/models/HX1(1).FBX";
    var loader = new FBXLoader();
    loader.load(path,(obj)=>{
      let objClone=obj.clone();
      obj.rotateX(Math.PI/2)
      obj.scale.set(0.5,0.5,0.5)
      obj.traverse((ele)=>{
        //ele.scale.setY(0.01)
        ele.material=this.roadMaterial;
      })
      obj.traverse((ele)=>{
        //ele.scale.setY(0.01)
        ele.material=this.roadMaterial;
      })

      this.scene.add(obj,obj.clone())
    })
    let mesh=new THREE.Mesh(new THREE.PlaneGeometry(1000,20,30),this.roadMaterial)
    let mesh2=mesh.clone();
    mesh2.material=new THREE.MeshBasicMaterial({map:roadTexture});
    mesh2.position.setZ(-5.0);
    this.scene.add(mesh,mesh2)
  }
  render() {
    if(this.roadMaterial.uniforms.uStartx.value<=2.0){

    }
    this.roadMaterial.uniforms.uStartx.value=Math.abs(this.timer.getOrSetRunTime("roadName",0.001,this.timer.getSin(0.02)));
    // if(this.roadMaterial.uniforms.uStartx.value>=2.0){
    //   this.timer.stop("roadName")
    // }
    // if (this.roadMaterial.uniforms.uStartx.value<=0.0){
    //   this.timer.restart("roadName")
    // }
    super.render();
  }
}
