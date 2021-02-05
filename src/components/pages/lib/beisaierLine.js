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
export default class beisaierLine extends Base3d{
  constructor(props) {
    super();
  }

  /**
   *
   * @param startPoint example {x:0.0,y:0.0,z:0.0}
   * @param endPoint
   * @param heightPoint
   * @param radius
   * @param pointNum
   */
  computePoint(startPoint,endPoint,heightPoint,radius=5.0,pointNum=30){
    let width=1/pointNum;
    var point=[];
    var uv=[];
    let index=0;
    for(var i=0.0;i<=1;i+=width){
      console.log(i)
      let point1 = this.getPoint(startPoint,endPoint,heightPoint,i);
      this.pushUv(uv,i,0)
      let point2= [point1[0],point1[1],point1[2]+radius];
      this.pushUv(uv,i,1)
      i+=width
      let point3=this.getPoint(startPoint,endPoint,heightPoint,i);
      this.pushUv(uv,i,0)
      i-=width
      this.push(point,point1)
      this.push(point,point2)
      this.push(point,point3)
      i+=width;
      let point4=this.getPoint(startPoint,endPoint,heightPoint,i);
      this.pushUv(uv,i,0)
      let point5=[point4[0],point4[1],point4[2]+radius]
      this.pushUv(uv,i,1)
      this.push(point,point4);
      this.push(point,point5);
      this.push(point,point2);
      this.pushUv(uv,i-width,0)
      i-=width;
    }
    return [new Float32Array(point),new Float32Array(uv)];
  }
  pushUv(uvBuff,i,y){
    uvBuff.push(i)
    uvBuff.push(y)
  }
  getPoint(startPoint,endPoint,heightPoint,i){
    return [
      Math.pow(1.0 - i, 2.0) * startPoint.x + 2.0 * i * (1.0 - i) * heightPoint.x + Math.pow(i, 2.0) * endPoint.x,
      Math.pow(1.0 - i, 2.0) * startPoint.y + 2.0 * i * (1.0 - i) * heightPoint.y + Math.pow(i, 2.0) * endPoint.y,
      Math.pow(1.0 - i, 2.0) * startPoint.z + 2.0 * i * (1.0 - i) * heightPoint.z + Math.pow(i, 2.0) * endPoint.z,
    ]
  }
  push(data,push_data){
    for (var i of push_data){
      data.push(i);
    }
    return data;
  }
  init(){
    super.init();
    let bufferGeotry=new THREE.BufferGeometry();
    let buff=this.computePoint({x:-200,y:0.0,z:50.0},{x:200.0,y:0.0,z:80},{x:160.0,y:300,z:71.0},5)
    bufferGeotry.setAttribute("position",new BufferAttribute(buff[0],3));
    bufferGeotry.setAttribute("uv",new BufferAttribute(buff[1],2))
    console.log(bufferGeotry)
    let plane=new THREE.BoxGeometry(300,10,10,20,40);
    // this.scene.add(new THREE.Mesh(bufferGeotry,new THREE.MeshBasicMaterial({color:0x2664FC,side:THREE.DoubleSide})))
    var textureLoader = new THREE.TextureLoader();
    let texture=textureLoader.load(star);
    this.shader=new THREE.ShaderMaterial({
      side:THREE.DoubleSide,
      uniforms: {
        u_Resolution: {
          value: {
            x: window.innerWidth,
            y: window.innerHeight
          }
        },
        u_time:{
          value:0.0,
        },
        uTexture:{
          value:texture
        },
        uFirstColor:{
          value:new THREE.Color(0xEC13AB)
        },
        uSecondColor:{
          value:new THREE.Color(0x1091F5)
        },
        uThirdColor:{
          value:new THREE.Color(0x5C10F5)
        }
      },
      vertexShader: `
        varying vec2 uVu;
        void main(){
         uVu = uv;
         gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `
      ,
      fragmentShader:`
        varying float v_diffuse;
        uniform vec4 u_color;
        varying vec2 uVu;
        uniform float u_time;
        uniform sampler2D uTexture;
        uniform vec3 uFirstColor;
        uniform vec3 uSecondColor;
        uniform vec3 uThirdColor;
        float remain(float x,float num){
            return x-floor(x/num)*num;
        }
        float isBigerThanZero(float value){
              return step(0.0,value);
        }
        float beisaier(vec2 startPoint,vec2 endPoint,vec2 heightPoint,float time,float lineRadius){
              float arr[100];
              // float x=pow(1.0-time,3.0)*startPoint.x+3.0*pow(1.0-time,2.0)*time*heightPoint.x+3.0*(1.0-time)*pow(time,2.0)*endPoint.x
              float x=pow(1.0-time,2.0)*startPoint.x+2.0*time*(1.0-time)*heightPoint.x+pow(time,2.0)*endPoint.x;
              float y=pow(1.0-time,2.0)*startPoint.y+2.0*time*(1.0-time)*heightPoint.y+pow(time,2.0)*endPoint.y;
              return ceil(isBigerThanZero(uVu.x-(x-lineRadius))*isBigerThanZero((x-uVu.x))*(isBigerThanZero(uVu.y-(y-lineRadius)))*isBigerThanZero(y-uVu.y));
        }

        vec4 getColor(){
             float num=remain(uVu.x,0.03);
             vec3 color1=uFirstColor*step(0.01,num);
             vec3 color2=uSecondColor*step(0.02,num);
             vec3 color3=uThirdColor*(1.0-ceil(step(0.01,num)));
             return vec4(color1+color2+color3,1.0);
        }
        void main(){
          vec4 color=texture2D(uTexture,uVu);
          // float beisaierNum=beisaier(vec2(0.0,0.0),vec2(1.0,0.0),vec2(0.4,0.8),sin(u_time),0.02);
          // if(beisaierNum>0.0){
          //  gl_FragColor = vec4(1.0,0.2,0.5,1.0)*beisaierNum;
          // }else{
          // gl_FragColor = vec4(1.0,1.0,1.0,0.0);
          // }
           gl_FragColor = getColor()*step((uVu.x-sin(u_time)),0.0);
           //gl_FragColor = color;
        }
      `,
    })
    this.scene.add(new THREE.Mesh(bufferGeotry,this.shader))
    this.composer=new BaseComposer(this.scene,this.camera,this.renderer)
    this.composer.addPass(new blurPass().getPass([this.composer.getComposer().renderTarget2.texture]))
    //this.composer.addPass(new activeShaderPass().getPass(this.composer.getComposer().renderTarget2.texture,null))
    // this.scene.add(new THREE.Mesh(plane,new THREE.MeshBasicMaterial({
    //   color:new THREE.Color(0xfffff),
    //   side:THREE.DoubleSide
    // })))
    //this.scene.add(new THREE.Mesh(plane,this.shader))
  }
  render() {
  //   //super.render();
    this.composer.getComposer().render();
    this.shader.uniforms.u_time.value+=0.01;
    requestAnimationFrame( this.render.bind(this));
  }
}
