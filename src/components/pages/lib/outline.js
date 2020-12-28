import Base3d from './Base3d'
import OutLineShader from "./shaders/outLineShader";
import outLineShader2 from "./shaders/outLineShader2";
import * as THREE from "three";
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
    this.mesh=new THREE.Mesh(new THREE.BoxGeometry(300,300,300),(new outLineShader2()).getShader());
    this.mesh2=new THREE.Mesh(this.mesh.geometry,new THREE.MeshBasicMaterial());
    this.scene.add(this.mesh)
    this.scene.add(this.mesh2)
  }
  render() {
    this.renderer.render( this.scene, this.camera );
    requestAnimationFrame( this.render.bind(this) );
  }
}
