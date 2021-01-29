import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import wateruv from '../../../assets/images/timg.jpg'
import waternormal from '../../../assets/images/waternormals.jpg'
import * as THREE from 'three'
import Base3d from './Base3d'
import sichuan from '../../../assets/models/sichuan_fence.obj'
export default class weilan extends Base3d{
  init() {
    super.init();
    let loader=(new OBJLoader());
    loader.load(sichuan,function (obj){

    });
    // let mesh=new THREE.Mesh(sichaun,new THREE.MeshBasicMaterial({color:"0xFFFFF"}));
    // this.scene.add(mesh)
  }
}
