import Base3d from "./Base3d";
import * as THREE from "three";
import waternormal from "../../../assets/images/waternormals2.jpg"
import BaseComposer from "./composer/BaseComposer";
import {UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass";
import blurPss from "./composer/blurPass";
import exportTextureUtil from "../../../utils/exportTextureUtil";
export default class lightCircle extends Base3d{
  init() {
    super.init();
    let waterTexture=(new THREE.TextureLoader()).load(waternormal);
    waterTexture.wrapS=waterTexture.wrapT=THREE.RepeatWrapping
    this.shaderMaterial=new THREE.ShaderMaterial({
      side:THREE.DoubleSide,
      transparent:true,
      uniforms: {
        u_time: {
          'type': "f",
          'value': 0.0,
        },
        u_color:{
          value:new THREE.Color(0x008BFF)
        },
        uNormal: {
          value: waterTexture
        },
        uLight:{
          value:0.0
        }
      },
      vertexShader: `

        varying vec2 vUv;
        varying vec3 v_position;
        void main(){
         vUv=uv;
         v_position=normalize(vec4(position,1.0)).xyz;
         gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `
      ,
      fragmentShader:`
        varying float v_diffuse;
        uniform vec3 u_color;
        varying vec2 vUv;
        uniform float u_time;
        uniform float uLight;
        varying vec3 v_position;
        uniform sampler2D uNormal;
        float remain(float x,float num){
            return x-floor(x/num)*num;
        }
        float hasColor(vec4 color){
            return ceil((color.x+color.y+color.z)/10.0)*step(0.01,color.w);
        }
        float getAnimal(){
              vec2 uv2=vUv;
              uv2.x-=u_time;
              uv2.x=remain(uv2.x,1.0);
              return texture2D(uNormal,uv2).x;
        }
        void main(){
          float op=getAnimal();
          gl_FragColor=vec4(u_color,op*0.9)*step(0.01,v_position.y)*step(v_position.y,0.2)*uLight*8.0*(1.0-vUv.y)*(1.0-vUv.y);
          if(hasColor(gl_FragColor.xyzw)==0.0){
              discard;
          }
        }
      `,
    })
    this.floorShaderMaterial=new THREE.ShaderMaterial({
      side:THREE.DoubleSide,
      transparent:true,
      uniforms: {
        u_time: {
          'type': "f",
          'value': 0.0,
        },
        u_color:{
          value:new THREE.Color(0x008BFF)
        },
        uNormal: {
          value: waterTexture
        },
        uLight:{
          value:0.0
        }
      },
      vertexShader: `

        varying vec2 vUv;
        varying vec3 v_position;
        void main(){
         vUv=uv;
         v_position=normalize(vec4(position,1.0)).xyz;
         gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `
      ,
      fragmentShader:`
        varying float v_diffuse;
        uniform vec3 u_color;
        varying vec2 vUv;
        uniform float u_time;
        uniform float uLight;
        varying vec3 v_position;
        uniform sampler2D uNormal;
        float remain(float x,float num){
            return x-floor(x/num)*num;
        }
        float hasColor(vec4 color){
            return ceil((color.x+color.y+color.z)/10.0)*step(0.1,color.w);
        }
        float getAnimal(float startX,float width){
              vec2 uv=vUv;
              uv.x=abs(uv.x-0.5);
              uv.y=abs(uv.y-0.5);
              startX+=u_time;
              startX=remain(startX,1.0);
              float opX=smoothstep(0.0,width*3.0,(uv.x+width-startX));
              float opY=smoothstep(0.0,width*3.0,(uv.y+width-startX));
              return (step(uv.x,startX)*step(startX-width,uv.x)*step(uv.y,startX)*opX+step(uv.y,startX)*step(startX-width,uv.y)*step(uv.x,startX)*opY)*3.0;
        }
        vec4 getAllAnimal(){
              return vec4(u_color,1.0)*getAnimal(0.1,0.05)+vec4(u_color,1.0)*getAnimal(0.25,0.05)+getAnimal(0.45,0.05)*vec4(u_color,1.0);
        }
        void main(){
          gl_FragColor=getAllAnimal();
          if(hasColor(gl_FragColor.xyzw)==0.0){
              discard;
          }
        }
      `,
    })
    const geometry = new THREE.CylinderGeometry(100, 100 ,50 ,40 ,80)
    const cylinder = new THREE.Mesh( geometry, this.shaderMaterial );
    const plan=new THREE.CircleGeometry(100,100,100)
    const floor=new THREE.Mesh(plan,this.floorShaderMaterial)
    floor.rotateX(Math.PI/2.0)
    this.scene.add(floor)
    this.scene.add(cylinder)
    this.composer=new BaseComposer(this.scene,this.camera,this.renderer)
    this.composer.addPass(new blurPss().getPass([this.composer.getComposer().renderTarget2.texture]));
    window.composer=this.composer.getComposer();
    let self=this;
    window.runFun=function (){
      let imageStream=new exportTextureUtil().threePixelStream(self.renderer,self.composer.getComposer().renderTarget1)
    }
  }
  render() {
    requestAnimationFrame( this.render.bind(this) );
    this.composer.getComposer().render()
    this.shaderMaterial.uniforms.u_time.value+=0.01;
    this.floorShaderMaterial.uniforms.u_time.value+=0.005;
    if(this.shaderMaterial.uniforms.uLight.value<=1.0){
      this.shaderMaterial.uniforms.uLight.value+=0.01;
    }
    //super.render();
  }
}
