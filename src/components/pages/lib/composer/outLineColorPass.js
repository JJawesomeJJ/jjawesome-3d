import * as THREE from "three";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import BaseShaderPass from "./BaseShaderPass";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";
export default class outlineColorPass extends BaseShaderPass{
  constructor(){
    super();
  }
  getPass(texture) {
    return new ShaderPass(//这个后期处理场将进入次场景的有颜色的物体设置为无色 有颜色的设置为有色
      new THREE.ShaderMaterial({
        uniforms: {
          Texture:{
            value:texture[0]
          }
        },
        side: THREE.DoubleSide,
        vertexShader: `
          varying vec2 vUv;
          void main() {
               vUv = uv;
               gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
          }
          `,
        fragmentShader: `
          uniform sampler2D Texture;
          varying vec2 vUv;
          vec4 color=vec4(1.0,1.0,1.0,1.0);
          float hasColor(vec3 color){
                return ceil((color.x+color.y+color.z)/10.0);
          }
                 vec4 getColor3(float radius,float reduce){
                                radius+=abs(sin(u_time))*radius+(100.0*readHeight());
                                vec4 color=vec4(0.0,0.0,0.0,0.0);
                                vec4 real_color=texture2D(Texture,vec2(vUv.x,vUv.y));
                                float all_long=0.0;
                                float max=max_num(real_color);
                                if(real_color.xyz!=vec3(0.0,0.0,0.0)){
                                    vec3 light_color=real_color.xzy;
                                    //light_color=vec3(pow(light_color.x,2.0),pow(light_color.y,2.0),pow(light_color.z,2.0));
                                    //light_color=vec3(pow(light_color.x,2.0),pow(light_color.y,2.0),pow(light_color.z,2.0));
                                    //light_color=normalize(light_color);
                                    // return vec4(light_color,real_color.w);
                                    float max=light_color.x*light_color.y*light_color.z;
                                    real_color.x+=real_color.x*max;
                                    real_color.y+=real_color.y*max;
                                    real_color.z+=real_color.z*max;
                                    return real_color;
                                }
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
                                return color;
                            }
          void main() {
               vec4 color=texture2D(Texture,vUv);
               realColor=ceil(realColor);
               realColor=abs(1.0-realColor);
               gl_FragColor = color+getColor3(0.01,0.05);
               //gl_FragColor = vec4(realColor,0.0,0.0,0.0);
          }
          `
      }));
  }
}
