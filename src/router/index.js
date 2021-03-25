import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import water from "../components/pages/water";
import water2 from "../components/pages/water2";
import scan from "../components/pages/scan"
import line from "../components/pages/line";
import outline from "../components/pages/outline";
import weilan from "../components/pages/weilan";
import line2 from "../components/pages/line2";
import road from "../components/pages/road";
import tree from "../components/pages/tree";
import light from "../components/pages/light";
// import reflector from "../components/pages/reflector";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path:'/water',
      name:'water',
      component: water
    },
    {
      path:'/water2',
      name:"water2",
      component:water2
    },
    {
      path:'/scan',
      name:'scan',
      component:scan
    },
    {
      path:'/line',
      name:"line",
      component:line
    },
    {
      path: '/outline',
      name:'outline',
      component: outline
    },
    {
      path: '/weilan',
      name:'weilan',
      component: weilan
    },
    {
      path: '/line2',
      name:'line2',
      component: line2
    },
    {
      path: '/road',
      name:'road',
      component: road
    },
    {
      path: '/tree',
      name:'tree',
      component: tree
    },
    {
      path: '/light',
      name:'light',
      component: light
    },
    // {
    //   path: '/reflector',
    //   name:'reflector',
    //   component:reflector
    // }
  ]
})
