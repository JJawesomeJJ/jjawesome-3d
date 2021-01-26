import * as THREE from "three";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import BaseShaderPass from "./BaseShaderPass";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";
export default class activeShaderPass extends BaseShaderPass{
  constructor(){
    super();
  }
  getPass(texture) {
    return new ShaderPass(new THREE.ShaderMaterial({
      uniforms: {
        Texture: { value: texture },
        u_time:{
          value:1.0,
          type:"f"
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
                            float move=0.01;
                            vec4 getColor(){
                                 move+=abs(sin(vUv.x*vUv.y)*0.002);
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
                                radius+=abs(sin(u_time))*radius;
                                vec4 color=vec4(0.0,0.0,0.0,0.0);
                                vec4 real_color=texture2D(Texture,vec2(vUv.x,vUv.y));
                                float whiteColor=ceil((real_color.x+real_color.y+real_color.z)*(real_color.x+real_color.y+real_color.z));
                                float all_long=0.0;
                                float max=max_num(real_color);
                                // if(real_color.xyz!=vec3(0.0,0.0,0.0)){
                                //     vec3 light_color=real_color.xzy;
                                //     //light_color=vec3(pow(light_color.x,2.0),pow(light_color.y,2.0),pow(light_color.z,2.0));
                                //     //light_color=vec3(pow(light_color.x,2.0),pow(light_color.y,2.0),pow(light_color.z,2.0));
                                //     //light_color=normalize(light_color);
                                //     // return vec4(light_color,real_color.w);
                                //     float max=light_color.x*light_color.y*light_color.z*abs(sin(u_time))*15.0;
                                //     real_color.x+=real_color.x*max;
                                //     real_color.y+=real_color.y*max;
                                //     real_color.z+=real_color.z*max;
                                //     return real_color;
                                // }
                                for(float x=vUv.x-radius;x<vUv.x+radius;x+=reduce){
                                    for(float y=vUv.y-radius;y<vUv.y+radius;y+=reduce){
                                        all_long+=distance(vec2(vUv.x,vUv.y),vec2(x,y));
                                    }
                                }
                                for(float x=vUv.x-radius;x<vUv.x+radius;x+=reduce){
                                    for(float y=vUv.y-radius;y<vUv.y+radius;y+=reduce){
                                        color+=texture2D(Texture,vec2(x,y))*(distance(vec2(vUv.x,vUv.y),vec2(x,y))/all_long);
                                    }
                                }
                                return color+color*whiteColor;
                            }
                            void main() {
                                gl_FragColor=getColor3(0.002,0.001);
                               // gl_FragColor = getColor();
                            }
                        `,
    }))
  }
}
