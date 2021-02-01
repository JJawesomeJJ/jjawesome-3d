const PI=3.1415;
const result_buff={}
export default class MathUtil{
  constructor() {
  }

  /**
   *
   * @param radius 半径
   * @param reduce 比例
   */
  gaoshi(radius,reduce){
    let key=radius+"_"+reduce;
    if(result_buff.hasOwnProperty(key)){
      return result_buff[key]
    }
    let start=0.0;
    let sgm=1.0;
    let buff=[];
    let max=0.0;
    for (let x=start-radius;x<=start+radius;x+=reduce){
      for (let y=start-radius;y<=start+radius;y+=reduce){
        let important=(1.0/(2.0*PI*sgm))*Math.exp(-(Math.pow(x,2.0)+Math.pow(y,2.0))/(2*sgm*Math.pow(sgm,2.0)));
        buff.push(important)
        max+=important;
      }
    }
    for (let i in buff){
      buff[i]=buff[i]/max
    }
    //result_buff[key]=buff;
    return buff;
  }
}
