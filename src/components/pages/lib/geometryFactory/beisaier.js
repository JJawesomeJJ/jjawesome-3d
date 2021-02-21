import * as THREE from "three";
import {BufferAttribute} from "three";

export default class beisaier{
  /**
   *
   * @param startPoint example {x:0.0,y:0.0,z:0.0}
   * @param endPoint
   * @param heightPoint
   * @param radius the geometry width
   * @param pointNum the geometry faceNum
   */
  getGeometry(startPoint,endPoint,heightPoint,radius=5.0,pointNum=30){
    let width=1/pointNum;
    var point=[];
    var uv=[];
    let index=0;
    for(var i=0.0;i<=1;i+=width){
      console.log(i)
      let point1 = this.getPoint(startPoint,endPoint,heightPoint,i);
      this.pushUv(uv,i,0)
      let point2= [point1[0],point1[1],point1[2]+radius];
      this.pushUv(uv,i,1)
      i+=width
      let point3=this.getPoint(startPoint,endPoint,heightPoint,i);
      this.pushUv(uv,i,0)
      i-=width
      this.push(point,point1)
      this.push(point,point2)
      this.push(point,point3)
      i+=width;
      let point4=this.getPoint(startPoint,endPoint,heightPoint,i);
      this.pushUv(uv,i,0)
      let point5=[point4[0],point4[1],point4[2]+radius]
      this.pushUv(uv,i,1)
      this.push(point,point4);
      this.push(point,point5);
      this.push(point,point2);
      this.pushUv(uv,i-width,1)
      i-=width;
    }
    let buff=[new Float32Array(point),new Float32Array(uv)];
    let bufferGeotry=new THREE.BufferGeometry();
    bufferGeotry.setAttribute("position",new BufferAttribute(buff[0],3));
    bufferGeotry.setAttribute("uv",new BufferAttribute(buff[1],2));
    return bufferGeotry;
  }
  pushUv(uvBuff,i,y){
    uvBuff.push(i)
    uvBuff.push(y)
  }
  getPoint(startPoint,endPoint,heightPoint,i){
    return [
      Math.pow(1.0 - i, 2.0) * startPoint.x + 2.0 * i * (1.0 - i) * heightPoint.x + Math.pow(i, 2.0) * endPoint.x,
      Math.pow(1.0 - i, 2.0) * startPoint.y + 2.0 * i * (1.0 - i) * heightPoint.y + Math.pow(i, 2.0) * endPoint.y,
      Math.pow(1.0 - i, 2.0) * startPoint.z + 2.0 * i * (1.0 - i) * heightPoint.z + Math.pow(i, 2.0) * endPoint.z,
    ]
  }
  push(data,push_data){
    for (var i of push_data){
      data.push(i);
    }
    return data;
  }
}
