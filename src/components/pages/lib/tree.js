import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import Base3d from "./Base3d";
import baseURL from "../../../config/config";
import tree1 from "../../../../static/texture/tree1.png"
export default class tree extends Base3d{
  init() {
    let treePath = baseURL + "/static/models/01/01shu.FBX";
    var loader = new FBXLoader();

    loader.load(treePath, (obj) => {
      this.add();
      this.tree=obj;
    })
    super.init();

  }
  add(){
    const lod = new THREE.LOD();

//Create spheres with 3 levels of detail and create new LOD levels for them
    for (let i = 0; i < 3; i++) {

      const geometry = new THREE.IcosahedronGeometry(10, 3 - i);
      let color = 0xffffff;
      switch (i) {
        case 0:
          color = 0x102827;
          break;
        case 1:
          color = 0x281021;
          break;
        default:
          color = 0x281021;
          break;
      }
      const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: color}));
      for(let index=-20;index<20;index++){
        let plan=null;
        if(i!=0){
          plan=this.getTreeMode();
        }else {
          plan=this.tree;
        }

        plan.position.set(index*50*i,index*50*i,0)
         lod.addLevel(plan,i * 75)
        // this.scene.add(plan)
      }



      //lod.addLevel(mesh, i * 75);

    }
    this.scene.add(lod)
  }
  getTreeMode(){
    let map=new THREE.TextureLoader().load(tree1)
    map.wrapS = map.wrapT = map.RepeatWrapping;
    return new THREE.Mesh(new THREE.PlaneGeometry(50,50,50),new THREE.MeshStandardMaterial({map:map,side:THREE.DoubleSide}))
  }
}
