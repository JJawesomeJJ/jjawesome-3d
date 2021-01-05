import Base3d from './Base3d'
import OutLineShader from "./shaders/outLineShader";
import outLineShader2 from "./shaders/outLineShader2";
import * as THREE from "three";
import BaseComposer from "./composer/BaseComposer";
import outLinePass from "./composer/outLinePass";
import blurPass from "./composer/blurPass";
import sun from "../../../assets/images/sun.jpg";
import uv from '../../../assets/images/timg.jpg'
import sunShader from "./shaders/sunShader";
import sunvu from "../../../assets/images/sun2.png"
export default class Outline extends Base3d{
  constructor() {
    super();
  }
  init() {
    super.init();
    let textloader=new THREE.TextureLoader();
    let sun=textloader.load(uv,(texture)=>{
      let uv_=textloader.load(uv);
      let sun_uv=textloader.load(sunvu);
      this.shader=new OutLineShader().getShader();
      this.shader.uniforms['u_camera'].value=this.camera.position;
      console.log(this.shader)
      console.log(this.camera);
      this.mesh=new THREE.Mesh(new THREE.SphereGeometry(50,300,100),(new outLineShader2()).getShader());
      this.mesh2=new THREE.Mesh(this.mesh.geometry,new THREE.MeshBasicMaterial({
        map:texture
      }));
      this.sunMesh=new THREE.Mesh(new THREE.SphereGeometry(80,300,100),new THREE.MeshBasicMaterial({
        map:sun_uv
      }));
      this.mesh2=new THREE.Mesh(this.mesh.geometry,new THREE.MeshBasicMaterial( { map: texture } ));

      this.scene.add(this.mesh2)
      let position=this.mesh2.position.clone();
      this.mesh2.position.set(position.x+100.0,position.y+300.0,position.z+300.0);
      this.scene.add(this.sunMesh);
      console.log(this.mesh2,"sunMesh");
    });

    this.composer2=new BaseComposer(this.scene,this.camera,this.renderer)
    this.composer=new BaseComposer(this.scene,this.camera,this.renderer)
    this.blurPass=(new blurPass()).getPass(this.composer.getComposer().renderTarget2.texture);
    this.composer.addPass(this.blurPass)
  }
  render() {

    // this.blurPass.uniforms.u_time.value+=0.1;
    requestAnimationFrame( this.render.bind(this) );
    this.renderer.autoClear = false;
    this.renderer.render(this.scene,this.camera );
    this.composer2.getComposer().render();
    this.blurPass.uniforms['u_time'].value+=0.05;
    this.composer.getComposer().render();
  }
}
