import * as THREE from "three";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import BaseShaderPass from "./BaseShaderPass";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";
export default class OutLinePass extends BaseShaderPass{
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
          void main() {
               vec4 color=texture2D(Texture,vUv);
               float Thresholdcolor=0.0;//颜色阈值
               float realColor=(color.x+color.y+color.z)/10.0;//真实颜色的rgba
               realColor=ceil(realColor);
               realColor=abs(1.0-realColor);
               gl_FragColor = vec4(realColor,0.0,0.0,0.0);
          }
          `
      }));
  }
}
