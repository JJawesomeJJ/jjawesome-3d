import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import water from "../components/pages/water";
import water2 from "../components/pages/water2";
import scan from "../components/pages/scan"
import line from "../components/pages/line";
import outline from "../components/pages/outline";
import weilan from "../components/pages/weilan";

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
    }
  ]
})
