import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import Base3d from "./Base3d";
import baseURL from "../../../config/config";
import Timer from "./until/Timer";
import roadImg from "../../../assets/images/road.png"
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";
import BaseComposer from "./composer/BaseComposer";
import {UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass";
import blurPass from "./composer/blurPass";
export default class road extends Base3d{
  init() {
    this.scene2=new THREE.Scene();
    this.roadLineMaterial=new THREE.ShaderMaterial({
      // depthWrite: true,
      depthTest: true,
      opacity:0.8,
      transparent: true,
      side:THREE.DoubleSide,
      uniforms: {
        uEdgeColor:{
          value:new THREE.Color(0x1545AF)//发光颜色
        },
        uEdgeWidth:{
          value:0.05//路的两边发光长度
        },
        uEdgePointWidth:{
          value:0.005//两端发光长度
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
          uniform float uEdgeWidth;
          uniform float uEdgePointWidth;
          uniform sampler2D utexture;
          float hasColor(vec3 color){
                return ceil((color.x+color.y+color.z)/10.0);
          }
          vec4 getEdgeLightColor(float width){
              return vec4(step(0.5-width,abs(0.5-uVu.y))*uEdgeColor,1.0);
          }
          vec4 getEndPointLightColor(float width){
              return vec4(step(0.5-width,abs(0.5-uVu.x))*uEdgeColor,1.0);
          }
          void main(){
               gl_FragColor= getEdgeLightColor(uEdgeWidth)+getEndPointLightColor(uEdgePointWidth);
               if(hasColor(gl_FragColor.xyz)<=0.0){
                  discard;
               }
          }
        `,
    })
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
        },
        uOnlyShowLight:{
          value:0.0
        },
        uLightColor:{
          value:new THREE.Color(0x2F7EF7)
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
          uniform float uOnlyShowLight;
          uniform float uLightX;
          uniform float uLightRadio;
          uniform vec3 uLightColor;
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
               return step(uStartx-currentX,height)*vec4(uLightColor,1.0)*hasColorEdgeColor;
          }
          void main(){
              vec4 edgeColor=getEdgeLightColor(0.1);
              vec4 firstLightColor=getFirstLightColor(0.05,hasColor(edgeColor.xyz));
              gl_FragColor=edgeColor+getBaseColor(edgeColor);
              gl_FragColor+=getPlusLight();
              gl_FragColor=gl_FragColor*(1.0-uOnlyShowLight)+firstLightColor*uOnlyShowLight;
              gl_FragColor=gl_FragColor*animate();
               gl_FragColor.w*= 0.4;
          }
        `,
    })
    super.init();
    let path=baseURL+"/static/models/SX(1).FBX";
    var loader = new FBXLoader();
    loader.load(path,(obj)=>{
      let objClone=obj.clone();
      obj.rotateX(Math.PI/2)
      obj.scale.set(0.5,0.5,0.5)
      obj.traverse((ele)=>{
        //ele.scale.setY(0.01)
        ele.material=this.roadLineMaterial;
      })
      obj.traverse((ele)=>{
        //ele.scale.setY(0.01)
        ele.material=this.roadLineMaterial;
      })
    })
    let road1=baseURL+"/static/models/HX(2).FBX";
    loader.load(road1,(obj)=>{
      obj.rotateX(Math.PI/2)
      obj.scale.set(0.5,0.5,0.5)
      let objClone1=obj.clone();
      objClone1.position.setZ(-30);
      this.scene.add(objClone1)
      obj.traverse((ele)=>{
        //ele.scale.setY(0.01)
        ele.material=this.roadLineMaterial;
        if(ele.geometry){
          ele.geometry.computeBoundingBox()
          ele.geometry.computeBoundingSphere()
          console.log(ele.geometry.boundingSphere)
        }

      })
      let obj2=obj.clone();
      obj2.traverse((ele)=>{
        //ele.scale.setY(0.01)
        ele.material=new THREE.MeshBasicMaterial({color:0xF60606});
      })
      this.scene2.add(obj2);
      console.log(obj2)
      this.scene.add(obj)
    })
    let mesh=new THREE.Mesh(new THREE.PlaneGeometry(1000,20,30),this.roadMaterial)
    let mesh2=mesh.clone();
    mesh2.material=new THREE.MeshBasicMaterial({map:roadTexture});
    mesh2.position.setZ(-5.0);
    //this.scene.add(mesh2)
    this.baseComposer=new BaseComposer(this.scene2,this.camera,this.renderer);
    this.blurPass=(new blurPass()).getPass([this.baseComposer.getComposer().renderTarget2.texture,this.baseComposer.getComposer().renderTarget2.depthTexture]);
    //this.finalComposer.addPass(new UnrealBloomPass(new THREE.Vector2(3840,1570),20.0,2.0,2.0))
    this.baseComposer.addPass(this.blurPass)
    this.baseComposer.getComposer().renderToScreen=true;
    this.finalComposer=new BaseComposer(this.scene,this.camera,this.renderer)
    this.baseComposer.addPass(new ShaderPass(new THREE.ShaderMaterial({
      uniforms: {
        baseTexture: { value: null },
        lightTexture:{
          value:this.finalComposer.getComposer().renderTarget2.texture
        }
      },
      vertexShader: `
                            varying vec2 vUv;
                            varying float blur_size;
                            void main() {
                                vUv = uv;
                                vec4 position2=vec4( position, 1.0 );
                                gl_Position = projectionMatrix * modelViewMatrix * position2;
                                blur_size=normalize(position2).z;

                            }
                        `,
      fragmentShader: `
                            uniform sampler2D baseTexture;
                            varying vec2 vUv;
                            uniform sampler2D lightTexture;
                            void main() {
                                gl_FragColor=texture2D(baseTexture,vUv)+texture2D(lightTexture,vUv);
                            }
                        `,
    }),'baseTexture'))
  }
  render() {
    if(this.roadMaterial.uniforms.uStartx.value<=2.0){

    }
    this.roadMaterial.uniforms.uStartx.value=Math.abs(this.timer.getOrSetRunTime("roadName",0.001,this.timer.getSin(0.001)))*2.0
    // if(this.roadMaterial.uniforms.uStartx.value>=2.0){
    //   this.timer.stop("roadName")
    // }
    // if (this.roadMaterial.uniforms.uStartx.value<=0.0){
    //   this.timer.restart("roadName")
    // }
    this.renderer.autoClear=false;
    // this.renderer.render( this.scene2, this.camera );
    //super.render()
    this.finalComposer.getComposer().render()
    this.baseComposer.getComposer().render()


    requestAnimationFrame( this.render.bind(this) );
  }
}
