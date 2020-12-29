import Base3d from './Base3d'
import OutLineShader from "./shaders/outLineShader";
import outLineShader2 from "./shaders/outLineShader2";
import * as THREE from "three";
import BaseComposer from "./composer/BaseComposer";
import outLinePass from "./composer/outLinePass";
import blurPass from "./composer/blurPass";
export default class Outline extends Base3d{
  constructor() {
    super();
  }
  init() {
    super.init();
    this.shader=new OutLineShader().getShader();
    this.shader.uniforms['u_camera'].value=this.camera.position;
    console.log(this.shader)
    console.log(this.camera);
    this.mesh=new THREE.Mesh(new THREE.SphereGeometry(40,300,100),(new outLineShader2()).getShader());
    this.mesh2=new THREE.Mesh(this.mesh.geometry,new THREE.MeshBasicMaterial());
    this.scene.add(this.mesh)
    this.scene.add(this.mesh2)
    this.composer=new BaseComposer(this.scene,this.camera,this.renderer)
    this.blurPass=(new blurPass()).getPass(this.composer.getComposer().renderTarget1.texture);
    this.composer.addComposer(this.blurPass)
  }
  render() {
    // this.renderer.render( this.scene, this.camera );
    this.composer.getComposer().render();
    this.blurPass.uniforms.u_time.value+=0.1;
    requestAnimationFrame( this.render.bind(this) );
  }
}
