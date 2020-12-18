import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import water from "../components/pages/water";
import water2 from "../components/pages/water2";
import scan from "../components/pages/scan"

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
    }
  ]
})
