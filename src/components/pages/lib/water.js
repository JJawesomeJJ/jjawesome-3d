import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import wateruv from '../../../assets/images/wateruv.png'
import waternormal from '../../../assets/images/waternormals.jpg'
import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import water_png from '../../../assets/images/timg.jpg'
export default class Water{

  constructor() {
    this.initBase();//初始化相机 渲染器 场景
    this.init();
  }
  initLight(){

  }
  initBase(){
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    //相机
    this.renderer = new THREE.WebGLRenderer();//渲染器
    this.scene = new THREE.Scene();//场景
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( this.renderer.domElement );
    this.camera.position.z = 300;
    let controls = new OrbitControls( this.camera, this.renderer.domElement );


  }
  init(){
    this.geometry = new THREE.PlaneGeometry(700, 200, 20);
    let texture=this.loadTexture();
    var textureLoader = new THREE.TextureLoader();
    var water_png=textureLoader.load(water_png);
    this.material = new THREE.ShaderMaterial({
      map: texture[0],// 普通纹理贴图
      bumpMap:texture[1],//凹凸贴图
      bumpScale:3,//设置凹凸高度，默认值1。
      side:THREE.DoubleSide,
      uniforms:{
        time:{
          'type':"f",
          'value':0.0,
        },
        uWaterPng:{
          value:water_png
        },
        uWaterUV:{
          value:texture[0]
        },
        uNormalMap: {
          value: texture[1]
        },
      },
      vertexShader: `
        uniform float time;
        varying vec2 vUv;
        attribute vec4 a_Position;
        attribute vec2 a_TexCoord;
        varying vec2 v_TexCoord;
         float random (in vec2 st) {
                    return fract(sin(dot(st.xy,
                                        vec2(12.9898,78.233)))
                                * 43758.5453123);
                }
        void main(){
            vUv = uv;
            float x = position.x;
            float y = position.y;
            float PI = 3.141592653589;

            float sx = 0.0;
            float sy = 0.0;
            float sz = 0.0;

            float ti = 0.0;
            float index = 1.0;
            vec2 dir;//水波方向
            for(int i = 0;i<3;i++){
                ti = ti + 0.0005;
                index +=1.0;
                if(mod(index,2.0)==0.0){
                    dir = vec2(1.0,ti);
                }else{
                    dir = vec2(-1.0,ti);
                }
                float l1 = 2.0 * PI / (0.5 + ti);//波长
                float s1 = 20.0 * 2.0 / l1;//速度
                float x1 = 1.0 * dir.x * sin(dot(normalize(dir),vec2(x,y)) * l1 + time * s1);
                float y1 = 1.0 * dir.y * sin(dot(normalize(dir),vec2(x,y)) * l1 + time * s1);
                float z1 = 1.0 * sin(dot(normalize(dir),vec2(x,y)) * l1 + time * s1);
                sx +=x1;
                sy +=y1;
                sz +=z1;
            }
            sx = x + sx;
            sy = y + sy;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(sx,sy,sin(sz) * 10.0,1.0);
        }
      `,
      fragmentShader:`
         varying vec2 vUv;
         uniform sampler2D uWaterUV;
         uniform sampler2D uNormalMap;
         precision mediump float;
         varying vec2 v_TexCoord;
         uniform sampler2D uWaterPng;

         void main(){
                 gl_FragColor = texture2D(uNormalMap,vUv);
              }
      `,
    }); //材质对象Material
    var material = new THREE.MeshBasicMaterial({
      color: 0x0000ff,
    });
    var mesh = new THREE.Mesh(this.geometry, this.material); //网格模型对象Mesh
    var ambientLight = new THREE.AmbientLight(0x523318);
    this.scene.add(ambientLight);
    var directionalLight = new THREE.DirectionalLight("#ffffff"); // 平行光
    directionalLight.castShadow = true; // 将平行光产生阴影的属性打开
    this.scene.add(directionalLight);
    this.camera.lookAt(600, 600, 800);
    var point = new THREE.PointLight(0xffffff);
    point.position.set(600, 600, 800); //点光源位置

    this.scene.add(point);
    this.scene.add(mesh); //网格模型添加到场景中
  }

  /**
   * 加载贴图
   * @returns {Texture[]}
   */
  loadTexture(){
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load(wateruv);
    // 加载凹凸贴图
    var textureBump = textureLoader.load(waternormal);
    return [texture,textureBump]
  }
  render=()=>{
    this.renderer.render( this.scene, this.camera );
    // console.log("fsdfs")
    this.material.uniforms.time.value+=0.02;
    requestAnimationFrame( this.render.bind(this) );
  }
}
