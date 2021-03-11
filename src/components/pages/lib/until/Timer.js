let obj=null;
export default class Timer{
  static singleTon(){
    if(obj==null){
      obj=new Timer();
    }
    return obj;
  }

  /**
   * 检查某个键是否在正常持续的运行
   * @param key
   * @returns {boolean|boolean|number|jest.Status|string|"rejected"|number|"fulfilled"|*}
   */
  getKeyIsRunning(key){
    if(!this.runTime.hasOwnProperty(key)){
      return false;
    }else {
      return this.runTime[key].status;
    }
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
        fun:fun,
        status:true
      };
    }
    if(!isReset){
      this.runTime[key]={
        value:0,
        time:0,
        startTime:(new Date()).valueOf(),
        currentTime:(new Date()).valueOf(),
        speed:speed,
        fun:fun,
        status:true
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
      if(!ele.status){
        return;
      }
      ele.currentTime=(new Date()).valueOf();
      ele.time = (ele.currentTime-ele.startTime)/100.0;
      if(!ele.fun) {
        ele.value = ele.speed*ele.time;
        this.runTime[key] = ele;
      }else {
        let value=ele.fun({value:ele.value,speed:ele.speed,time:ele.time});
        if(!(value instanceof Object)){
          ele.value=value;
        }else {
          Object.keys(value).forEach((key1)=>{
            ele[key1]=value[key1]
          });
        }
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
      let speed=params.speed;
      let time=params.time;
      let value= speed*time+(1/2)*a*Math.pow(time,2);
      return value;
    }
  }

  /**
   *
   * @param a
   * @param middlevalue 临界值
   * @returns {function(*)}
   */
  getSinValue(a,middlevalue){
    return function (params){

    }
  }
  stop(key){
    this.getOrSetRunTime(key);
    this.runTime[key]["status"]=false;
  }
  getSin(radio=1.0){
    return function (params){
      return Math.sin(params.time*radio);
    }
  }

  /**
   *
   * @param key
   */
  restart(key){
    this.getOrSetRunTime(key);
    this.runTime[key]["status"]=true;
    this.runTime[key]["startTime"]=(new Date()).valueOf();
    this.runTime[key]["currentTime"]=(new Date()).valueOf();
  }
}
