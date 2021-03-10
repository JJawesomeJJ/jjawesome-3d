import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
export default class Base3d {
  constructor(props) {
    this.init();
  }
  init(){
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    window.camera=this.camera;
    //相机
    this.renderer = new THREE.WebGLRenderer();//渲染器
    this.scene = new THREE.Scene();//场景
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( this.renderer.domElement );
    this.camera.position.z = 300;
    let controls = new OrbitControls( this.camera, this.renderer.domElement );
    window.controls=controls;
  }
  render(){
    this.renderer.render( this.scene, this.camera );
    requestAnimationFrame( this.render.bind(this) );
  }
}
