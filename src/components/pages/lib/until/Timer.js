let obj=null;
export default class Timer{
  static singleTon(){
    if(obj==null){
      obj=new Timer();
    }
    return obj;
  }
  getOrSetRunTime(key,speed=0.01,fun=null,isReset=true){
    this.runningTime();
    if(!this.runTime){
      this.runTime={};
    }
    if(!this.runTime.hasOwnProperty(key)){
      this.runTime[key]={
        value:0,
        time:0,
        startTime:(new Date()).valueOf(),
        currentTime:(new Date()).valueOf(),
        speed:speed,
        fun:fun
      };
    }
    if(!isReset){
      this.runTime[key]={
        value:0,
        time:0,
        startTime:(new Date()).valueOf(),
        currentTime:(new Date()).valueOf(),
        speed:speed,
        fun:fun
      };
    }
    return this.runTime[key].value;
  }
  runningTime(){
    if(!this.runTime){
      return;
    }
    Object.keys(this.runTime).forEach((key)=>{
      let ele=this.runTime[key];
      ele.currentTime=(new Date()).valueOf();
      ele.time = (ele.currentTime-ele.startTime)/100.0;
      if(!ele.fun) {
        ele.value = ele.speed*ele.time;
        this.runTime[key] = ele;
      }else {
        ele.value=ele.fun({value:ele.value,speed:ele.speed,time:ele.time})
      }
    })
  }

  /**
   * 获取一个加速度的计算函数
   * @param a
   * @returns {function(*): number}
   */
  getAspeendFun(a){
    return function (params){
      let value=params.value;
      let speed=params.speed;
      let time=params.time;
      value=speed*time+(1/2)*a*Math.pow(time,2);
      return value;
    }
  }
}
