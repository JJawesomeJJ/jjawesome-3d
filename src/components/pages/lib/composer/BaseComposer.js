import * as THREE from "three";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
import {FilmPass} from "three/examples/jsm/postprocessing/FilmPass";

export default class BaseComposer{
  constructor(scene,camera,renderer){
    this.scene=scene;
    this.camera=camera;
    this.renderer=renderer;
    this.renderPass=new RenderPass(this.scene,this.camera);
    this.effectFilm=new FilmPass(0.8, 0.325, 256, false)
    this.composer=new EffectComposer(this.renderer);
    this.composer.addPass(this.renderPass);
    this.composer.addPass(this.effectFilm);
  }
  getComposer(){
    return this.composer;
  }
  addComposer(pass){
    this.composer.addPass(pass)
  }
}
