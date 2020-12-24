
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import Base3d from "./Base3d";
export default class Line extends Base3d {
  constructor(props) {
    super()
  }

  init(){
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    //相机
    this.renderer = new THREE.WebGLRenderer();//渲染器
    this.scene = new THREE.Scene();//场景
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( this.renderer.domElement );
    this.camera.position.z = 300;
    let controls = new OrbitControls( this.camera, this.renderer.domElement );
    this.geometry = new THREE.PlaneGeometry(700, 200, 50);
    this.scene.add(new THREE.Mesh(this.geometry,new THREE.ShaderMaterial({

    })))
  }
  besaier1(p0,p1,t){
    return (1-t)*p0+tp1;
  }
  besaier2(p0,p1,t){
    return Math.pow(1-t,2)*p0+2*t*(1-t)*p1+Math.pow(t)*p2;
  }
  besaier3(p0,p1,p3,t){
    Math.pow(1-t,3)*p0+3*p1*Math.pow(1-t,2)+3*p2*Math.pow(t,2)*(1-t)+p3*Math.pow(t,3);
  }
  drawLine(points){
    let lineList=[];
    for (var i = 0; i <= 1; i+0.1) {
      let x=this.besaier3(points[0].x,points[1].x,points[2].x);
      let y=this.besaier3(points[0].y,points[1].y,points[2].y);
      lineList.push([x,y])
    }
    return lineList;
  }

}
