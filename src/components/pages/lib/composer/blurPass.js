import * as THREE from "three";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import BaseShaderPass from "./BaseShaderPass";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";
export default class blurPss extends BaseShaderPass{
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
                                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                            }
                        `,
      fragmentShader: `
                            uniform sampler2D Texture;
                            varying vec2 vUv;
                            uniform float u_time;
                            float move=0.01;
                            vec4 getColor(){
                                 move=abs(sin(u_time))*0.005;
                                 vec4 color=texture2D(Texture,vec2(vUv.x,vUv.y));
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
                            void main() {
                                gl_FragColor = getColor();
                            }
                        `,
    }))
  }
}
