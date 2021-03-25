import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
export default class Base3d {
  constructor(props) {
    this.init();
  }
  init(){
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 10, 10000 );
    window.camera=this.camera;
    //相机
    this.renderer = new THREE.WebGLRenderer();//渲染器
    this.scene = new THREE.Scene();//场景
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( this.renderer.domElement );
    this.camera.position.z = 300;
    let controls = new OrbitControls( this.camera, this.renderer.domElement );
    this.light = new THREE.AmbientLight( 0xffffff,2.200 );
    this.scene.add(this.light)
    window.controls=controls;
    window.camera=this.camera;
    this.renderer.domElement.addEventListener('click', this.getIntersects.bind(this));
  }
  getIntersects (event) {
    event.preventDefault();
    console.log("event.clientX:" + event.clientX)
    console.log("event.clientY:" + event.clientY)

    // 声明 raycaster 和 mouse 变量
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();

    // 通过鼠标点击位置,计算出 raycaster 所需点的位置,以屏幕为中心点,范围 -1 到 1
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    //通过鼠标点击的位置(二维坐标)和当前相机的矩阵计算出射线位置
    raycaster.setFromCamera(mouse, window.camera);

    // 获取与raycaster射线相交的数组集合，其中的元素按照距离排序，越近的越靠前
    var intersects = raycaster.intersectObjects(this.scene.children);

    //返回选中的对象数组
    console.log(intersects)
    return intersects;
  }
  render(){
    this.renderer.render( this.scene, this.camera );
    requestAnimationFrame( this.render.bind(this) );
  }
}
