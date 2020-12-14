import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import wateruv from '../../../assets/images/timg.jpg'
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
    this.geometry = new THREE.PlaneGeometry(700, 200, 50);
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
        rand:{
          'type':"f",
          'value':1.0,
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
        u_lightColor:{
          value: new THREE.Vector4(1.0,1.0,1.0,1.0)
        },
        Resolution: {
          value: {
            x: window.innerWidth,
            y: window.innerHeight
          }
        },
        u_AmbientLight:{
          value:new THREE.Vector4(1.0,1.0,1.0,1.0)
        },
        u_LightDirection: {
          value: new THREE.Vector3(0.5, 3.0, 4.0)
        }
      },
      vertexShader: `
        uniform float time;
        uniform float rand;
        varying vec2 vUv;
        attribute vec4 a_Position;
        attribute vec2 a_TexCoord;
        varying vec2 v_TexCoord;
        varying float v_time;
        attribute vec4 a_Normal;
        varying vec4 v_Normal;
        float random (in vec2 st) {
                    return fract(sin(dot(st.xy,
                                        vec2(12.9898,78.233)))
                                * 43758.5453123);
                }
         float hash( vec2 p ) {
            float h = dot(p,vec2(127.1,311.7));
            return fract(sin(h)*43758.5453123);
        }
        float noise( in vec2 p ) {
                  vec2 i = floor( p );
                  vec2 f = fract( p );
                  vec2 u = f*f*(3.0-2.0*f);
                  return -1.0+2.0*mix( mix( hash( i + vec2(0.0,0.0) ),
                                   hash( i + vec2(1.0,0.0) ), u.x),
                              mix( hash( i + vec2(0.0,1.0) ),
                                   hash( i + vec2(1.0,1.0) ), u.x), u.y);
        }

        void main(){
            v_time=time;
            vUv = uv;
            vUv.xy += noise(uv)*sin(v_time*5.0)*0.49*0.6;
            float x = position.x;
            v_Normal=a_Normal;
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
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
      fragmentShader:`
         varying vec2 vUv;
         //
         uniform sampler2D uWaterUV;
         uniform vec2 Resolution;
         //法线rgba
         uniform sampler2D uNormalMap;
         uniform vec3 u_DiffuseLight;
         uniform vec3 u_LightDirection;
         uniform vec4 u_AmbientLight;
         uniform vec4 u_lightColor;
         precision mediump float;
         varying vec2 v_TexCoord;
         varying vec4 v_Normal;
         uniform sampler2D uWaterPng;
         float PI=3.1415;
         varying float v_time;
         vec2 dHdxy_fwd() {
                vec2 dSTdx = dFdx( v_TexCoord );
                vec2 dSTdy = dFdy( v_TexCoord );
                float Hll = texture2D( uNormalMap, v_TexCoord ).x;
                float dBx = texture2D( uNormalMap, v_TexCoord + dSTdx ).x - Hll;
                float dBy = texture2D( uNormalMap, v_TexCoord + dSTdy ).x - Hll;
                return vec2( dBx, dBy );
         }
         vec2 random(vec2 p){
            return  -1.0 + 2.0 * fract(
                sin(
                    vec2(
                        dot(p, vec2(127.1,311.7)),
                        dot(p, vec2(269.5,183.3))
                    )
                ) * 43758.5453
            );
         }
         float hash( vec2 p ) {
            float h = dot(p,vec2(127.1,311.7));
            return fract(sin(h)*43758.5453123);
        }
        float noise( in vec2 p ) {
                  vec2 i = floor( p );
                  vec2 f = fract( p );
                  vec2 u = f*f*(3.0-2.0*f);
                  return -1.0+2.0*mix( mix( hash( i + vec2(0.0,0.0) ),
                                   hash( i + vec2(1.0,0.0) ), u.x),
                              mix( hash( i + vec2(0.0,1.0) ),
                                   hash( i + vec2(1.0,1.0) ), u.x), u.y);
        }
         float noise_perlin (vec2 p) {
            vec2 i = floor(p); // 获取当前网格索引i
            vec2 f = fract(p); // 获取当前片元在网格内的相对位置
            // 计算梯度贡献值
            float a = dot(random(i),f); // 梯度向量与距离向量点积运算
            float b = dot(random(i + vec2(1., 0.)),f - vec2(1., 0.));
            float c = dot(random(i + vec2(0., 1.)),f - vec2(0., 1.));
            float d = dot(random(i + vec2(1., 1.)),f - vec2(1., 1.));
            // 平滑插值
            vec2 u = smoothstep(0.,1.,f);
            // 叠加四个梯度贡献值
            return sin(mix(mix(a,b,u.x),mix(c,d,u.x),u.y)+v_time);
        }
         void main(){
                 vec3 LightPost=u_LightDirection;
                 //vec3 specularColor = pow(max(vec3(0,0,0), dot(reflect(normalize(LightPost), normal),viewDir)), vec3(uShininess));
                 LightPost=normalize(LightPost);//归一化
                 vec4 DiffuseColor = normalize(texture2D(uWaterUV, vUv));
                 //vec4 DiffuseColor1 = normalize(texture2D(uWaterPng, vUv));
                 //vec4 DiffuseColor = normalize(vec4(0.0,0.0,0.0,0.0));
                 float x=v_time;
                 //LightPost=LightPost*sin(v_time);
                 LightPost=LightPost*0.6;
                 float des=x-floor(x/(PI+2.0))*(PI+2.0);
                 des=des*0.02;
                 vec2 vuv_buff=vUv;

                 // vuv_buff.y=vUv.y*cos(des);
                 vec3 NormalMap=texture2D(uNormalMap, vuv_buff).rgb;
                 vec3 LightDir = vec3(LightPost.xy - (gl_FragCoord.xy/Resolution.xy), LightPost.z);
                 vec4 lightColor=u_lightColor;
                 //LightDir= LightDir*sin(v_time);
                 lightColor.x *= Resolution.x / Resolution.y;
                 //vec3 Normal = NormalMap.rgb * 2.0 - 1.0;
                 float D = length(LightDir);
                 //解码xyz 归一化
                 vec3 N = normalize(NormalMap* 2.0 - 1.0);
                 // N=N*sin(v_time);
                 vec3 L = normalize(LightDir);
                 //计算漫反射
                 //Cdiffuse=(cughr • mdiffiise)max(O, D. I )   漫反射公式
                 //vec3 Diffuse = vec3(1.0,1.0,1.0) * max(dot(N, L), 0.0);
                  vec3 Diffuse = (lightColor.rgb*lightColor.a) * max(dot(N, L), 0.0);
                 //计算环境光
                 vec3 Ambient = u_AmbientLight.rgb * u_AmbientLight.a;
                 //归一化点光源
                 // vec3 u_LightDirection = normalize(u_LightDirection);
                 // u_LightDirection=u_LightDirection*sin(v_time);
                 //计算光强度
                 vec3 Intensity = Ambient + Diffuse;
                 //最终颜色
                 vec3 FinalColor = DiffuseColor.rgb*Intensity;


                 //FinalColor.b=noise_perlin(vUv);
                 gl_FragColor = vec4(FinalColor,1.0);
                 //gl_FragColor = texture2D(uNormalMap,dHdxy_fwd());
              }
      `,
    }); //材质对象Material
    var material = new THREE.MeshBasicMaterial({
      color: 0x0000ff,
    });
    var mesh = new THREE.Mesh(this.geometry, this.material); //网格模型对象Mesh
    var ambientLight = new THREE.AmbientLight("#ffffff");
    this.scene.add(ambientLight);
    var directionalLight = new THREE.DirectionalLight("#ffffff"); // 平行光
    directionalLight.castShadow = true; // 将平行光产生阴影的属性打开
    this.scene.add(directionalLight);
    this.camera.lookAt(600, 600, 800);
    var point = new THREE.PointLight(0xffffff);
    point.position.set(0, 0, 100); //点光源位置

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
    textureBump.wrapS = textureBump.wrapT = THREE.RepeatWrapping;
    return [texture,textureBump]
  }
  render=()=>{
    this.renderer.render( this.scene, this.camera );
    // console.log("fsdfs")
    this.material.uniforms.time.value+=0.005;
    // this.material.uniforms.rand.value=Math.floor(Math.random()*10000000);
    requestAnimationFrame( this.render.bind(this) );
  }
}
