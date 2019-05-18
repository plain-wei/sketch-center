import Vue from 'vue';
import VueRouter from 'vue-router';
import MainLayout from '../layout/MainLayout.vue';

import AppSidebar from '../views/AppSidebar.vue';
import AppFooter from '../views/AppFooter.vue';
import MainContent from '../views/MainContent.vue';
import MainHeader from '../views/MainHeader.vue';

import SelfCenter from '../pages/SelfCenter.vue';

import Recommendation from '../pages/system/Recommendation.vue';
import RadioCenter from '../pages/system/RadioCenter.vue';
import VideoCenter from '../pages/system/VideoCenter.vue';
import PhotoCenter from '../pages/system/PhotoCenter.vue';

import MusicSheet from '../pages/sheet/MusicSheet.vue';
import LocalMusic from '../pages/local/LocalMusic.vue';

Vue.use(VueRouter);

const router = new VueRouter({
  mode   : 'history',
  base   : __dirname,
  routes : [
    {
      path      : '/',
      component : MainLayout,
      children  : [
        {
          path       : 'main',
          components : {
            header  : MainHeader,
            sidebar : AppSidebar,
            footer  : AppFooter,
            default : MainContent,
          },
          children : [
            {
              path      : 'recommendation',
              component : Recommendation,
            },
            {
              path      : 'radioCenter',
              component : RadioCenter,
            },
            {
              path      : 'videoCenter',
              component : VideoCenter,
            },
            {
              path      : 'photoCenter',
              component : PhotoCenter,
            },
            {
              path      : 'musicSheet',
              component : MusicSheet,
            },
            {
              path      : 'localMusic',
              component : LocalMusic,
            },
            {
              path      : 'selfCenter',
              component : SelfCenter,
            },
          ],
        },
      ],
    },
    {
      path     : '*',
      redirect : '/main/recommendation',
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.fullPath === '/') {
    return next('/main/recommendation');
  }
  next();
});

if (process.env.NODE_ENV === 'development') {
  window.router = router;
}

export default router;
