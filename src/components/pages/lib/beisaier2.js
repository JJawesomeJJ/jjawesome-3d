import Base3d from "./Base3d";
import * as THREE from "three";
import {BufferAttribute, ShaderMaterial} from "three";
import blurPss from "./composer/blurPass";
import BaseComposer from "./composer/BaseComposer";
import blurPass from "./composer/blurPass";
import FlowLightPass from "./composer/FlowLightPass";
import outLinePass from "./composer/outLinePass";
import activeShaderPass from "./composer/activeShaderPass";
import star from '../../../assets/images/star.png'
// import fog from '../../../assets/images/fog.png'
import magic from '../../../assets/images/magic.png'
import beisaier from "./geometryFactory/beisaier";
export default class beisaier2 extends Base3d{
  init() {
    super.init();
    let line=new beisaier().getGeometry({x:-200,y:0.0,z:50.0},{x:200.0,y:0.0,z:80},{x:160.0,y:300,z:71.0},2);
    this.lineMaterial = new THREE.ShaderMaterial({
      // depthWrite: true,
      depthTest: true,
      transparent: true,
      // opacity: 0.3,
      side:THREE.DoubleSide,
      uniforms: {
        u_time: {
          'type': "f",
          'value': 0.0,
        },
        uTexture:{
          value:new THREE.TextureLoader().load(magic)
        },
        PI:{
          value:Math.PI
        },
        startX:{
          value:0.0
        },
        uCircleColor:{
          value:new THREE.Color(0x28F29F)
        },
        uLightColor:{
          value:new THREE.Color(0x23CEFE)
        },
        uLightPercent:{
          value:0.1
        }
      },
      vertexShader: `
          varying vec2 uVu;
          void main(){
              uVu=uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
          }
        `,
      fragmentShader: `
          varying vec2 uVu;
          uniform float u_time;
          uniform float PI;
          uniform float startX;
          uniform sampler2D uTexture;
          uniform vec3 uCircleColor;
          uniform vec3 uLightColor;
          uniform float uLightPercent;
          float remain(float x,float num){
                return x-floor(x/num)*num;
          }
          //是否是奇数
          float isSingleNum(float x){
                return ceil(remain(x,2.0));
          }
          float circleMax(float min){
                return step(min,distance(uVu.xy,vec2(0.5,0.5)));
          }
          float circleMin(float max){
                return step(distance(uVu.xy,vec2(0.5,0.5)),max);
          }
          float hasColor(vec3 color){
                return ceil((color.x+color.y+color.z)/10.0);
          }
          float singleIncrease(float x){
              x=remain(x,PI*2.0);
              float sinData=1.0-ceil(step(PI/2.0,remain(x,PI)));
              float cosData=isSingleNum(floor(x/(PI/2.0)));
              return cosData*abs(cos(x))+sinData*abs(sin(x));
          }
          float singleSub(float x){
              x=remain(x,PI*2.0);
              float sinData=1.0-ceil(step(PI/2.0,remain(x,PI)));
              float cosData=isSingleNum(floor(x/(PI/2.0)));
              return (1.0-cosData)*abs(cos(x))+(1.0-sinData)*abs(sin(x));
          }
          //将某个数分散到固定的区间
          float dispersed(float num,float count){
                float avg=num/count;
                return floor(num/avg);
          }
          //计算高亮系数
          float ellipseRatio(float x,float y,float max,float min){
                float result=pow(uVu.x-x,2.0)/pow(max,2.0)+pow(uVu.y-y,2.0)/pow(min,2.0);
                return step(result,1.0);
          }
          vec4 getLightColor(){
               vec4 lightColor=step(singleIncrease(u_time),uVu.x)*step(uVu.x,singleIncrease(u_time)+uLightPercent)*vec4(uLightColor,1.0);
               float middleX=singleIncrease(u_time)+uLightPercent/2.0;
               lightColor=lightColor*(1.0-abs(middleX-uVu.x)*5.0);
               vec4 HightColor=vec4(1.0,1.0,1.0,1.0)*ellipseRatio(middleX,0.5,0.01,0.5)*(1.0-dispersed(abs(uVu.x-middleX),100.0)/100.0);
               return lightColor+HightColor;
          }
          void main(){
               vec4 lightColor=getLightColor();
               vec4 color=texture2D(uTexture,uVu.xy)*step(distance(uVu.xy,vec2(0.5,0.5)),startX);
               color=hasColor(color.xyz)*vec4(uCircleColor,1.0)*circleMin((singleSub((u_time)/4.0)))+color;
               gl_FragColor = vec4(uCircleColor+vec3(1.0,1.0,1.0)*uVu.x,1.0*(1.0-uVu.x))*(1.0-hasColor(lightColor.xyz))+lightColor;
          }
        `,
    });
    this.scene.add(new THREE.Mesh(line,this.lineMaterial))
  }
  render() {
    super.render();
    this.lineMaterial.uniforms.u_time.value+=0.005;
  }
}
