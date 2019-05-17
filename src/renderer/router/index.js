import Vue from 'vue';
import VueRouter from 'vue-router';
import MainLayout from '../layout/MainLayout.vue';

import AppSidebar from '../views/AppSidebar.vue';
import AppFooter from '../views/AppFooter.vue';
import MainContent from '../views/MainContent.vue';
import MainHeader from '../views/MainHeader.vue';

import SelfCenter from '../components/SelfCenter.vue';

import Recommendation from '../components/system/Recommendation.vue';
import RadioCenter from '../components/system/RadioCenter.vue';
import VideoCenter from '../components/system/VideoCenter.vue';
import PhotoCenter from '../components/system/PhotoCenter.vue';

import MusicSheet from '../components/sheet/MusicSheet.vue';
import LocalMusic from '../components/local/LocalMusic.vue';

Vue.use(VueRouter);

const router = new VueRouter({
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

if (process.env.NODE_ENV === 'development') {
  window.router = router;
}

export default router;
