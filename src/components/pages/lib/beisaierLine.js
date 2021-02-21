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
      this.pushUv(uv,i-width,1)
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
    let buff=this.computePoint({x:-200,y:0.0,z:50.0},{x:200.0,y:0.0,z:80},{x:160.0,y:300,z:71.0},10)
    bufferGeotry.setAttribute("position",new BufferAttribute(buff[0],3));
    bufferGeotry.setAttribute("uv",new BufferAttribute(buff[1],2))
    console.log(bufferGeotry)
    let plane=new THREE.BoxGeometry(300,10,10,20,40);
    this.magicMaterial = new THREE.ShaderMaterial({
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
          value:new THREE.Color(0x93008F)
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
              float sinData=1.0-ceil(step(PI/2.0,remain(x,PI)));//是否使用sin函数
              float cosData=isSingleNum(floor(x/(PI/2.0)));//是否使用cos函数
              return cosData*abs(cos(x))+sinData*abs(sin(x))+0.05;
          }
          float singleSub(float x){
              x=remain(x,PI*2.0);
              float sinData=1.0-ceil(step(PI/2.0,remain(x,PI)));//是否使用sin函数
              float cosData=isSingleNum(floor(x/(PI/2.0)));//是否使用cos函数
              return (1.0-cosData)*abs(cos(x))+(1.0-sinData)*abs(sin(x));
          }
          void main(){
               vec4 color=texture2D(uTexture,uVu.xy)*step(distance(uVu.xy,vec2(0.5,0.5)),startX);
               color=hasColor(color.xyz)*vec4(uCircleColor,1.0)*circleMin((singleSub((u_time)/4.0)))+color;
               gl_FragColor = color;
          }
        `,
    });
    let mesh=new THREE.Mesh(new THREE.CircleGeometry(30,32), this.magicMaterial);
    mesh.position.set(-200,0.0,55.0)
    mesh.rotateY(Math.PI/2)
    mesh.rotateX(Math.PI/1.5)
    this.scene.add(mesh)
    // this.scene.add(new THREE.Mesh(bufferGeotry,new THREE.MeshBasicMaterial({color:0x2664FC,side:THREE.DoubleSide})))
    var textureLoader = new THREE.TextureLoader();
    let texture=textureLoader.load(star);
    // let fogTexture=new THREE.TextureLoader().load(fog)
    // fogTexture.wrapS = fogTexture.wrapT = THREE.RepeatWrapping;
    this.shader=new THREE.ShaderMaterial({
      transparent:true,
      side:THREE.DoubleSide,
      uniforms: {
        u_Resolution: {
          value: {
            x: window.innerWidth,
            y: window.innerHeight
          }
        },
        resolution:{
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
        },
        uMiddleColor:{
          value:new THREE.Color(0x00A8FF)
        },
        uTriAngleColor:{
          value:new THREE.Color(0x00A8FF)
        },
        // uFog:{
        //   value:fogTexture
        // },
        PI:{
          value:Math.PI
        },
        UfogColor:{
          value:new THREE.Color(0x008EFD)
        },
        time:{
          value:0.0
        },
        shift:{
          value:0.2
        },
        startX:{
          value:0.0
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
        uniform vec3 uMiddleColor;
        uniform vec3 uSecondColor;
        uniform float PI;
        uniform vec3 uThirdColor;
        uniform vec3 uTriAngleColor;
        uniform sampler2D uFog;
        uniform vec3 UfogColor;
        precision mediump float;
        uniform vec2      resolution;
        uniform float     time;
        uniform float     alpha;
        uniform vec2      speed;
        uniform float     shift;
        uniform float startX;
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
        float hasColor(vec3 color){
              return ceil((color.x+color.y+color.z)/10.0);
        }
        //生成随机数
        float rand(vec2 n) {
          //This is just a compounded expression to simulate a random number based on a seed given as n
            return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
        }
        //烟雾噪声
        float noise(vec2 n) {
          //Uses the rand function to generate noise
          const vec2 d = vec2(0.0, 1.0);
          vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
          return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
        }
        //分式布朗运动
        float fbm(vec2 n) {
          //fbm stands for "Fractal Brownian Motion" https://en.wikipedia.org/wiki/Fractional_Brownian_motion
          float total = 0.0, amplitude = 1.0;
          for (int i = 0; i < 4; i++) {
            total += noise(n) * amplitude;
            n += n;
            amplitude *= 0.5;
          }
          return total;
        }
        //是否是奇数
        float isSingleNum(float x){
              return ceil(remain(x,2.0));
        }
        //单调递增函数
        float singleIncrease(float x){
              x=remain(x,PI*2.0);
              float sinData=1.0-ceil(step(PI/2.0,remain(x,PI)));//是否使用sin函数
              float cosData=isSingleNum(floor(x/(PI/2.0)));//是否使用cos函数
              return cosData*abs(cos(x))+sinData*abs(sin(x))+0.05;
        }
        //计算在一个三角的两边画线
        float getAngle(float angle,float x,float y){
              float angle2=angle/2.0;
              float leftWidth=1.0-x;
              return step(abs(tan(angle2)-(-((uVu.x-x)))/abs(uVu.y-y)),0.01);
        }
        vec3 getAngleColor(float x){
             return uTriAngleColor*getAngle(PI/(20.0/abs(singleIncrease((u_time+0.8)/4.0))),singleIncrease(x/4.0),0.5);
        }
        float moreThanColor(vec3 color,float min){
              return step(min,color.x+color.y+color.z);
        }
        vec4 getColor(){
             float num=remain(uVu.x,0.03);
             vec3 color1=uFirstColor*step(0.01,num);
             vec3 color2=uSecondColor*step(0.02,num);
             vec3 color3=uThirdColor*(1.0-ceil(step(0.01,num)));
             vec3 middleColor=uMiddleColor*step(0.45,uVu.y)*(1.0-step(0.55,uVu.y));
             middleColor+=vec3(1.0,1.0,1.0)*0.6*hasColor(middleColor);
             return vec4(middleColor+getAngleColor(0.1+u_time)+getAngleColor(0.4+u_time)+getAngleColor(0.8+u_time),1.0);
        }
        vec4 moreLightColor(float start_x,float length){
             return (1.0-step(start_x,uVu.x))*step(start_x-length,uVu.x)*smoothstep(start_x-length,start_x,uVu.x)*vec4(1.0,1.0,1.0,1.0)*0.6;
        }
        float inMiddle(float per){
              float startY=per/2.0;
              float endY=1.0-per/2.0;
              return step(startY,uVu.y)*(1.0-step(endY,uVu.y));
        }
        void main(){
          vec4 color=texture2D(uTexture,uVu);
          // float beisaierNum=beisaier(vec2(0.0,0.0),vec2(1.0,0.0),vec2(0.4,0.8),sin(u_time),0.02);
          // if(beisaierNum>0.0){
          //  gl_FragColor = vec4(1.0,0.2,0.5,1.0)*beisaierNum;
          // }else{
          // gl_FragColor = vec4(1.0,1.0,1.0,0.0);
          // }
           //gl_FragColor = getColor()*step((uVu.x-sin(u_time)),0.0);
            const vec3 c1 = vec3(126.0/255.0, 0.0/255.0, 97.0/255.0);
            const vec3 c2 = vec3(173.0/255.0, 0.0/255.0, 161.4/255.0);
            const vec3 c3 = vec3(0.2, 0.0, 0.0);
            const vec3 c4 = vec3(164.0/255.0, 1.0/255.0, 214.4/255.0);
            const vec3 c5 = vec3(0.1);
            const vec3 c6 = vec3(0.9);

            //This is how "packed" the smoke is in our area. Try changing 8.0 to 1.0, or something else
            vec2 p = gl_FragCoord.xy * 8.0 / resolution.xx;
            //The fbm function takes p as its seed (so each pixel looks different) and time (so it shifts over time)
            float q = fbm(p - time * 0.1);
            vec2 r = vec2(fbm(p + q + time * speed.x - p.x - p.y), fbm(p + q - time * speed.y));
            vec3 c = mix(c1, c2, fbm(p + r)) + mix(c3, c4, r.x) - mix(c5, c6, r.y);
            float grad = gl_FragCoord.y / resolution.y;
            vec4 lightColor=getColor();
            vec4 resultColor = ceil(1.0-hasColor(lightColor.xyz))*vec4(c * cos(shift * gl_FragCoord.y / resolution.y), 1.0)+lightColor+moreLightColor(singleIncrease((0.8+u_time)/4.0),0.2);
            resultColor=resultColor*inMiddle(0.4)+vec4(uTriAngleColor,0.8)*rand(uVu)*(1.0-inMiddle(0.4))*hasColor(lightColor.xyz);
            gl_FragColor=resultColor*ceil(1.0-step(startX,uVu.x));
            //gl_FragColor.xyz *= 1.0-grad;
           //gl_FragColor = getColor()+moreThanColor(texture2D(uFog,uVu.xy).xyz,1.0+sin(u_time))*vec4(UfogColor,1.0);
        }
      `,
    })
    this.scene.add(new THREE.Mesh(bufferGeotry,this.shader))
    this.composer=new BaseComposer(this.scene,this.camera,this.renderer)
    this.composer.addPass(new blurPass().getPass([this.composer.getComposer().renderTarget2.texture]))
   // this.composer.addPass(new activeShaderPass().getPass(this.composer.getComposer().renderTarget2.texture,this.composer.getComposer().renderTarget2.texture))
    // this.scene.add(new THREE.Mesh(plane,new THREE.MeshBasicMaterial({
    //   color:new THREE.Color(0xfffff),
    //   side:THREE.DoubleSide
    // })))
    //this.scene.add(new THREE.Mesh(plane,this.shader))
  }
  render() {
    // super.render();
    this.composer.getComposer().render();
    this.shader.uniforms.u_time.value+=0.015;
    // this.shader.uniforms.u_time.value+=0.01;
    this.shader.uniforms.time.value+=0.01;
    this.shader.uniforms.startX.value+=0.008;
    this.magicMaterial.uniforms.u_time.value+=0.015;
    this.magicMaterial.uniforms.startX.value+=0.008;
    requestAnimationFrame( this.render.bind(this));
  }
}
