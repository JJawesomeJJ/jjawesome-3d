import Base3d from './Base3d'
import OutLineShader from "./shaders/outLineShader";
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
    this.mesh=new THREE.Mesh(new THREE.SphereGeometry(50,30,20),this.shader);
    this.scene.add(this.mesh)
  }
  render() {
    this.renderer.render( this.scene, this.camera );
    requestAnimationFrame( this.render.bind(this) );
  }
}
