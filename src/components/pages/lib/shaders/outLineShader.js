import outLineShader from './baseShader'
import baseShader from "./baseShader";
import * as THREE from "three";
export default class OutLineShader extends baseShader{
  constructor(props) {
    super();
  }
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
        void drawLine(vec3 normal,float diffuse,float stroke,float lightDiffuse){
            vec3 newNormal=position+normal;
            newNormal=(modelMatrix*vec4(newNormal,1.0)).xyz-(modelMatrix*vec4(position,1.0)).xyz;
            //对法向量进行归一化
            newNormal=normalize(newNormal);//归一化法向量
            vec3 eye=u_camera-(modelMatrix*vec4(position,1.0)).xyz;
            //计算相机与物体的法向量
            eye=normalize(eye);
            //归一化
            stroke=max(0.0,dot(newNormal,eye));//描边系数??
            vec3 vp=u_lightPosition-(modelMatrix*vec4(position,1.0)).xyz;
            vp=normalize(vp);
            float dotViewPosition=max(0.0,dot(newNormal,vp));
            diffuse=lightDiffuse*dotViewPosition;
            v_diffuse=stroke;
        }
        void main(){
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
            drawLine(normal,.3,.3,1.0);
        }
      `
      ,
      fragmentShader:`
        varying float v_diffuse;
        float remain(float x,float num){
            return x-floor(x/num)*num;
        }
        void main(){
          if(v_diffuse<=0.2){
            gl_FragColor=vec4(1.0,1.0,1.0,0.2);
          }else{
          gl_FragColor = vec4(28.0/225.0,88.0/225.0,107.0/225.0,0.6)*v_diffuse;
          }
        }
      `,
    })
  }
}
