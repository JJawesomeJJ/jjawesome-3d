import * as THREE from "three";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import BaseShaderPass from "./BaseShaderPass";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";
import MathUtil from "../../../../utils/MathUtil";
export default class activeShaderPass extends BaseShaderPass{
  constructor(radius,reduce){
    super();
    this.radius=radius;
    this.reduce=reduce;
  }
  setRadius(value,isChangeOrigin=true){
    this.orginRadius=this.radius;
    this.radius=value;
    if(this.shader){
      this.shader.uniforms.u_weight.value=this.getWeight();
      if(isChangeOrigin){
        this.shader.uniforms.u_radius.value=value;
      }
    }
    if(!isChangeOrigin){
      this.radius=this.orginRadius;
    }
  }
  setReduce(value){
    this.reduce=value;
    if(this.shader){
      this.shader.uniforms.u_weight.value=this.getWeight();
      this.shader.uniforms.u_reduce.value=value;
    }
  }
  getWeight(){
    let weight=new MathUtil().gaoshi(this.radius,this.reduce);
    return new Float32Array(weight);
  }
  getPass(texture,baseTexture) {
    this.shader=new THREE.ShaderMaterial({
      uniforms: {
        Texture: { value: texture },
        u_time:{
          value:1.0,
          type:"f"
        },
        uBaseTexture:{
          value:baseTexture
        },
        u_weight:{
          value:this.getWeight()
        },
        u_radius:{
          value:this.radius
        },
        u_reduce:{
          value:this.reduce
        }
      },
      vertexShader: `
                            varying vec2 vUv;
                            void main() {
                                vUv = uv;
                                vec4 position2=vec4( position, 1.0 );
                                gl_Position = projectionMatrix * modelViewMatrix * position2;
                            }
                        `,
      fragmentShader: `
                            uniform sampler2D Texture;
                            varying vec2 vUv;
                            uniform float u_time;
                            uniform float u_radius;
                            uniform float u_reduce;
                            uniform float u_weight[1000];
                            float move=0.01;
                            uniform sampler2D uBaseTexture;
                            vec4 getColor(){
                                 move+=abs(sin(u_time)*0.002);
                                 vec4 color=texture2D(Texture,vec2(vUv.x,vUv.y));
                                 float whiteColor=ceil((color.x+color.y+color.z)*(color.x+color.y+color.z));
                                 // if(color.xyz!=vec3(0.0,0.0,0.0)){
                                 //    return vec4(0.0,0.0,0.0,0.0);
                                 // }
                                 color+=texture2D(Texture,vec2(vUv.x+move,vUv.y));
                                 color+=texture2D(Texture,vec2(vUv.x-move,vUv.y));
                                 color+=texture2D(Texture,vec2(vUv.x-move,vUv.y+move));
                                 color+=texture2D(Texture,vec2(vUv.x+move,vUv.y+move));
                                 color+=texture2D(Texture,vec2(vUv.x-move,vUv.y-move));
                                 color+=texture2D(Texture,vec2(vUv.x+move,vUv.y+move));
                                 color+=texture2D(Texture,vec2(vUv.x-move,vUv.y+move));
                                 color+=texture2D(Texture,vec2(vUv.x+move,vUv.y-move));
                                 color+=texture2D(Texture,vec2(vUv.x-move,vUv.y-move));
                                 vec4 outColor=texture2D(Texture,vec2(vUv.x+move,vUv.y));
                                 color/=8.0;
                                 return color;
                            }
                            vec4 getColor2(float width,float reduce){
                                 vec4 color=texture2D(Texture,vec2(vUv.x,vUv.y));
                                 float num=0.0;
                                 for(float x=vUv.x+width;x>=vUv.x-width;x=x-reduce){
                                      for(float y=vUv.y+width;y>=vUv.y-width;y=y-reduce){
                                           if(x==vUv.x&&y==vUv.y){
                                              continue;
                                           }
                                           color+=texture2D(Texture,vec2(x,y))/(distance(vec2(x,y),vec2(vUv.x,vUv.y))/reduce);
                                           num+=1.0;
                                      }
                                 }
                                 return color/num;
                            }
                            float max_num(vec4 color){
                                  float max=color.x;
                                  if(color.y>max){
                                     max=color.y;
                                  }
                                  if(color.z>max){
                                     max=color.z;
                                  }
                                  if(color.w>max){
                                     max=color.w;
                                  }
                                  return max;
                            }
                            vec4 getColor3(float radius,float reduce){
                                float sinValue=abs(sin(u_time));
                                radius=sinValue*radius;
                                vec4 color=vec4(0.0,0.0,0.0,0.0);
                                vec4 real_color=texture2D(Texture,vec2(vUv.x,vUv.y));
                                float whiteColor=ceil(real_color.x/10.0+real_color.y/10.0+real_color.z/10.0);
                                int index=0;
                                float num=0.0;
                                for(float x=vUv.x-radius;x<vUv.x+radius;x+=reduce){
                                    for(float y=vUv.y-radius;y<vUv.y+radius;y+=reduce){
                                        //vec4 otherColor=texture2D(Texture,vec2(x,y))*(1.0-distance(vec2(vUv.x,vUv.y),vec2(x,y))/all_long);
                                        vec4 otherColor=texture2D(Texture,vec2(x,y));
                                        color+=otherColor;
                                        index+=1;
                                        num+=1.0;
                                    }
                                }
                               color/=num;
                                //return color+texture2D(uBaseTexture,vec2(vUv.x,vUv.y))+real_color*whiteColor*6.0*pow(inner/max_num,2.0)/60.0;
                                 return whiteColor*real_color+abs(ceil(1.0-whiteColor))*color+texture2D(uBaseTexture,vec2(vUv.x,vUv.y))+whiteColor*vec4(1.0,1.0,1.0,1.0)*sinValue;
                                 return color;
                            }
                            vec4 getColor4(float radius,float reduce){
                                 float max_distance=0.0;
                                 vec4 color=vec4(0.0,0.0,0.0,1.0);
                                 vec4 realColor=texture2D(Texture,vec2(vUv.x,vUv.y));
                                 for(float x=vUv.x-radius;x<=radius+vUv.x;x+=reduce){
                                     max_distance+=abs(x-vUv.x);
                                 }
                                 for(float x=vUv.x-radius;x<=radius+vUv.x;x+=reduce){
                                     color+=texture2D(Texture,vec2(x,vUv.y))*(abs(x-vUv.x)/max_distance);
                                 }
                                 for(float y=vUv.y-radius;y<=radius+vUv.y;y+=reduce){
                                     color+=texture2D(Texture,vec2(vUv.x,y))*(abs(y-vUv.y)/max_distance);
                                 }
                                 return color+realColor;
                            }
                            void main() {
                                gl_FragColor=getColor3(u_radius,u_reduce);
                               // gl_FragColor = getColor();
                            }
                        `,
    });
    return new ShaderPass(this.shader);
  }
}
