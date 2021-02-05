let data=control.map.getStyle().layers;
let index=0;
let layers=[];
for(let i of data){
  // if(i.source!='szwjjkq_polyline'){
  //   continue;
  // }
  layers.push(i)
}
setInterval(function(){
  let ele=layers[index];
  console.log(ele)
  control.map.setLayoutProperty(ele.id, 'visibility', "none")
  index+=1.0
},1)

for(let i of window.waterFixGroup){

}
