import baseShader from "./baseShader";
import * as THREE from "three";
export default class sunShader extends baseShader{
  getShader() {
    return new THREE.ShaderMaterial({
      uniforms: {
        u_time: {
          'type': "f",
          'value': 0.0,
        },
        u_AmbientLight: {
          value: new THREE.Vector4(1.0, 1.0, 1.0, 1.0)
        },
        u_LightDirection: {
          value: new THREE.Vector3(0.5, 0.3, 0.6)
        },
        u_rand: {
          value: Math.random()
        },
        u_camera:{
          value:new THREE.Vector3(0.0,0.0,0.0)
        },
        u_lightPosition:{
          value:new THREE.Vector3(2555.0,2555.0,2555.0)
        },
        u_color:{
          value:new THREE.Vector4(250.0/255.0,93.0/255.0,7.0/255.0,255.0/255.0)
        },
        u_Resolution: {
          value: {
            x: window.innerWidth,
            y: window.innerHeight
          }
        },
      },
      vertexShader: `
        uniform float u_time;
        varying vec2 vUv;
        uniform mat4 u_mvpMatrix;//总变换矩阵
        uniform mat4 u_modelMatrix;//
        uniform vec3 u_camera;//相机位置
        uniform vec3 u_lightPosition;//
        attribute vec4 a_Position;
        attribute vec2 a_TexCoord;
        varying vec2 v_TexCoord;
        varying float v_time;
        varying vec3 v_position;
        varying vec3 u_position;
        uniform vec2 u_Resolution;
        varying vec2 v_Resolution;
        varying vec3 vPos;
        varying float v_diffuse;
        void main(){
         gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `
      ,
      fragmentShader:`
        varying float v_diffuse;
        uniform vec4 u_color;
        float remain(float x,float num){
            return x-floor(x/num)*num;
        }
        void main(){
          gl_FragColor = vec4(0.5,0.2,0.5,1.0);
        }
      `,
    })
  }
}
