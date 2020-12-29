import * as THREE from "three";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import BaseShaderPass from "./BaseShaderPass";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";
export default class OutLinePass extends BaseShaderPass{
  constructor(){
    super();
  }
  getPass(texture) {
    return new ShaderPass(new THREE.ShaderMaterial({
          uniforms: {
            Texture: { value: texture }
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
                            void main() {
                                gl_FragColor = texture2D(Texture,vUv);
                            }
                        `,
    }))
  }
}
