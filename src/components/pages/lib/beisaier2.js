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
               vec4 HightColor=vec4(1.0,1.0,1.0,1.0)*ellipseRatio(middleX,0.5,0.01,0.5);
               HightColor+=(1.0-hasColor(HightColor.xyz))*(1.0-dispersed(abs(uVu.x-middleX),100.0)/100.0);
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
    this.scene.add(new THREE.Mesh(line,this.lineMaterial));
    this.magicMaterial= new THREE.ShaderMaterial({
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
          value:new THREE.Color(0x4CD09A)
        },
        uBaseLightColor:{
          value:new THREE.Color(0x00A84A)
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
          uniform vec3 uBaseLightColor;
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
          vec4 getCircleColor(float baseTimeAdd,float width){
                return (vec4(uCircleColor,1.0)+(vec4(1.0,1.0,1.0,1.0))*0.2)*circleMin(singleIncrease((u_time+baseTimeAdd)/4.0)*0.5)*circleMax(singleIncrease((u_time+baseTimeAdd-width)/4.0)*0.5)*(0.8-distance(vec2(uVu),vec2(0.5,0.5)));
          }
          vec4 getCircleColorFixed(float min,float max){
                return (vec4(uCircleColor,1.0))*circleMin(min)*circleMax(max);
          }

          vec4 getLightColor(){
               vec4 lightColor = vec4(uBaseLightColor,0.4-distance(vec2(uVu),vec2(0.5,0.5)));
               lightColor+=hasColor(lightColor.xyz)*vec4(1.0,1.0,1.0,1.0)*(0.4-distance(vec2(uVu),vec2(0.5,0.5)))*0.5;
               return lightColor;
          }
          void main(){
               vec4 color=texture2D(uTexture,uVu.xy)*step(distance(uVu.xy,vec2(0.5,0.5)),startX);
               color=hasColor(color.xyz)*vec4(uCircleColor,1.0)*circleMin((singleSub((u_time)/4.0)))+color;
               gl_FragColor = getCircleColor(0.0,0.1)+getCircleColor(0.5,0.1)+getCircleColor(1.0,0.1)+getCircleColor(1.5,0.1)
                              +getCircleColorFixed(0.2,0.18)+getLightColor()
               ;
          }
        `,
    });
    let mesh=new THREE.Mesh(new THREE.CircleGeometry(30,32), this.magicMaterial);
    this.fireMaterial = new THREE.ShaderMaterial({
      // depthWrite: true,
      depthTest: true,
      transparent: true,
      opacity: 0.9,
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
          value:new THREE.Color(0x4CD09A)
        },
        uBaseLightColor:{
          value:new THREE.Color(0x00A84A)
        },
        uBaseFireColor:{
          value:new THREE.Color(0x2D9D74)
        },
        uInnnerColor:{
          value:new THREE.Color(0X80F1D0)
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
         precision mediump float;
        uniform sampler2D u_Sampler;
        uniform float u_time;
        varying vec2 uVu;
        uniform vec3 uBaseFireColor;
        uniform float PI;
        uniform vec3 uInnnerColor;
        float remain(float x,float num){
                return x-floor(x/num)*num;
        }
        float noise(vec3 p){
            vec3 i = floor(p);
            vec4 a = dot(i, vec3(1., 57., 21.)) + vec4(0., 57., 21., 78.);
            vec3 f = cos((p-i)*acos(-1.))*(-.5)+.5;
            a = mix(sin(cos(a)*a),sin(cos(1.+a)*(1.+a)), f.x);
            a.xy = mix(a.xz, a.yw, f.y);
            return mix(a.x, a.y, f.z);
        }

        float sphere(vec3 p, vec4 spr){
            return length(spr.xyz-p) - spr.w;
        }

        float flame(vec3 p){
            float d = sphere(p*vec3(1.,.5,1.), vec4(.0,-1.,.0,1.));
            return d + (noise(p+vec3(.0,u_time*2.,.0)) + noise(p*3.)*.5)*.25*(p.y) ;
        }
        float scene(vec3 p){
            return min(100.-length(p) , abs(flame(p)) );
        }

        vec4 raymarch(vec3 org, vec3 dir){
            float d = 0.0, glow = 0.0, eps = 0.02;
            vec3  p = org;
            bool glowed = false;

            for(int i=0; i<64; i++)
            {
                d = scene(p) + eps;
                p += d * dir;
                if( d>eps )
                {
                    if(flame(p) < .0)
                        glowed=true;
                    if(glowed)
                        glow = float(i)/64.;
                }
            }
            return vec4(p,glow);
        }
        float hasColor(vec3 color){
              return ceil((color.x+color.z+color.z)/10.0);
        }

          float ellipseRatio(float x,float y,float max,float min){
                float result=pow(uVu.x-x,2.0)/pow(max,2.0)+pow(uVu.y-y,2.0)/pow(min,2.0);
                return step(result,1.0);
          }
           float isSingleNum(float x){
                return ceil(remain(x,2.0));
          }
          float singleIncrease(float x){
              x=remain(x,PI*2.0);
              float sinData=1.0-ceil(step(PI/2.0,remain(x,PI)));//是否使用sin函数
              float cosData=isSingleNum(floor(x/(PI/2.0)));//是否使用cos函数
              return cosData*abs(cos(x))+sinData*abs(sin(x))+0.05;
          }
           //计算光柱外边
          vec4 outFireColor(float y,float max){
              y=y+singleIncrease(u_time);
              // if(uVu.y>=0.8){
              //max=max*(1.0-y);
              // }
              max+=0.03*(1.0-uVu.y);
              return ellipseRatio(0.5,y,max,0.2)*vec4(uBaseFireColor,0.3);
          }
          vec4 getOutFireColor(){
              vec4 color=outFireColor(0.1,0.1)+outFireColor(0.4,0.09)+outFireColor(0.8,0.11)+outFireColor(-0.1,0.06)+outFireColor(-0.4,0.05)+outFireColor(-0.5,0.055)+outFireColor(-0.6,0.055)+outFireColor(-0.9,0.07);
              return hasColor(color.xyz)*vec4(uBaseFireColor,(1.0-abs(uVu.x-0.5))*0.8*(1.0-abs(uVu.y-0.1))*0.9);
          }
          vec4 getInnerFireCore(vec4 color){
               return vec4(1.0,1.0,1.0,1.0)*(color.x+color.y+color.z+color.w)/(1.0*4.0);
          }
          vec4 lightColor(float width,float y){
               return step(abs(uVu.y-singleIncrease(u_time+y)),width)*vec4(1.0,1.0,1.0,0.9)*step(abs(uVu.x-0.5),0.007);
          }
          vec4 getLightColor(){
               return lightColor(0.008,0.1)+lightColor(0.006,0.15)+lightColor(0.002,0.16)+lightColor(0.003,0.17)+lightColor(0.003,0.2)+lightColor(0.001,0.6);
          }
        void main() {
            vec2 v = -1.5 + 3. * vec2(uVu.x,uVu.y+0.2);

            vec3 org = vec3(0., -2., 4.);
            vec3 dir = normalize(vec3(v.x*1.6, -v.y, -1.5));

            vec4 p = raymarch(org, dir);
            float glow = p.w;

            vec4 col = mix(vec4(1.,.5,.1,1.), vec4(0.1,.5,1.,1.), p.y*.02+.4);
            vec4 innerFireColor=mix(vec4(0.), col, pow(glow*2.,4.));
            gl_FragColor = getInnerFireCore(innerFireColor)+getOutFireColor()+getLightColor();
            if(hasColor(gl_FragColor.xyz)<=0.0){
                discard;
            }
        }`,
    });
    this.particleMaterial=new THREE.ShaderMaterial({
      // depthWrite: true,
      depthTest: true,
      transparent: true,
      opacity: 0.6,
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
          value:new THREE.Color(0x4CD09A)
        },
        uBaseLightColor:{
          value:new THREE.Color(0x00A84A)
        }
      },
      vertexShader: `
          varying vec2 uVu;
          varying vec3 vPosition;
          void main(){
              uVu=uv;
              vPosition=position;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
          }
        `,
      fragmentShader: `
          varying vec2 uVu;
          uniform float u_time;
          varying vec3 vPosition;
          uniform float PI;
          uniform float startX;
          uniform sampler2D uTexture;
          uniform vec3 uCircleColor;
          uniform vec3 uBaseLightColor;
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
          float noise(vec3 p){
                vec3 i = floor(p);
                vec4 a = dot(i, vec3(1., 57., 21.)) + vec4(0., 57., 21., 78.);
                vec3 f = cos((p-i)*acos(-1.))*(-.5)+.5;
                a = mix(sin(cos(a)*a),sin(cos(1.+a)*(1.+a)), f.x);
                a.xy = mix(a.xz, a.yw, f.y);
                return mix(a.x, a.y, f.z);
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
          vec4 getCircleColor(float baseTimeAdd,float width){
                return (vec4(uCircleColor,1.0)+(vec4(1.0,1.0,1.0,1.0))*0.2)*circleMin(singleIncrease((u_time+baseTimeAdd)/4.0)*0.5)*circleMax(singleIncrease((u_time+baseTimeAdd-width)/4.0)*0.5)*(0.8-distance(vec2(uVu),vec2(0.5,0.5)));
          }
          vec4 getCircleColorFixed(float min,float max){
                return (vec4(uCircleColor,1.0))*circleMin(min)*circleMax(max);
          }
           float rand(vec2 n) {
            return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
          }
          vec4 lightColor(float width,float y,float x_){
               float x=uVu.x+singleIncrease(u_time+y)+x_;
               return step(abs(uVu.y-singleIncrease(u_time+y)),width)*vec4(uCircleColor,0.9)*step(abs(uVu.x-x_),0.007);
          }
          vec4 getLightColor(){
               vec3 vPosition1=normalize(vPosition);
               vec4 color=vec4(0.0,0.0,0.0,0.0);
               for(float i=0.0;i<=1.0;i+=0.08){
                  for(float x=0.0;x<=1.0;x+=0.2){
                    color+=lightColor(0.002,0.1+i+x,i);
                    color+=lightColor(0.002,0.1-i-x,-i);
                  }
               }
               return color*step(vPosition1.y,0.95);
          }
          void main(){
               vec4 color=getLightColor();
               gl_FragColor=getLightColor();
               if(hasColor(gl_FragColor.xyz)<=0.0){
                discard;
              }
          }
        `,
    });
    let particle=new THREE.Mesh(new THREE.CylinderGeometry( 15, 6, 140, 32 ),this.particleMaterial)
    let fire = new THREE.Mesh( new THREE.PlaneGeometry( 60, 120, 6 ), this.fireMaterial );
    this.scene.add( fire );
    this.scene.add(particle)
    particle.position.set(-200,65.1,55.0)
    fire.position.set(-200,55.0,55.0)
    mesh.position.set(-200,0.0,55.0)
    mesh.rotation.set(2.150,-3.580,0.0)
    this.scene.add(mesh)
    this.composer=new BaseComposer(this.scene,this.camera,this.renderer)
    this.composer.addPass(new blurPass().getPass([this.composer.getComposer().renderTarget2.texture]))
  }
  render() {
   // requestAnimationFrame( this.render.bind(this));
    //this.composer.getComposer().render();
     super.render();
    this.magicMaterial.uniforms.u_time.value+=0.015;
    this.magicMaterial.uniforms.startX.value+=0.008;
    this.lineMaterial.uniforms.u_time.value+=0.005;
    this.fireMaterial.uniforms.u_time.value+=0.06;
    this.particleMaterial.uniforms.u_time.value+=0.01;
  }
}
