import Vue from 'vue';
import VueRouter from 'vue-router';
import MainLayout from '../layout/MainLayout.vue';

import AppSidebar from '../views/AppSidebar.vue';
import AppFooter from '../views/AppFooter.vue';
import MainContent from '../views/MainContent.vue';
import MainHeader from '../views/MainHeader.vue';

import SelfCenter from '../pages/home/SelfCenter.vue';

import Recommendation from '../pages/system/Recommendation.vue';
import RadioCenter from '../pages/system/RadioCenter.vue';
import VideoCenter from '../pages/system/VideoCenter.vue';
import PhotoCenter from '../pages/system/PhotoCenter.vue';

import MusicSheet from '../pages/sheet/MusicSheet.vue';
import LocalMusic from '../pages/local/LocalMusic.vue';

// sheet info
import SheetDetails from '../pages/sheet/SheetDetails.vue';
import UpdateSheet from '../pages/sheet/UpdateSheet.vue';

Vue.use(VueRouter);

const router = new VueRouter({
  mode   : 'hash',
  base   : __dirname,
  routes : [
    {
      path      : '/',
      name      : '',
      component : MainLayout,
      children  : [
        {
          path       : 'main',
          name       : 'main',
          components : {
            header  : MainHeader,
            sidebar : AppSidebar,
            footer  : AppFooter,
            default : MainContent,
          },
          children : [
            {
              path      : 'recommendation',
              name      : 'recommendation',
              component : Recommendation,
            },
            {
              name      : 'radioCenter',
              path      : 'radioCenter',
              component : RadioCenter,
            },
            {
              name      : 'videoCenter',
              path      : 'videoCenter',
              component : VideoCenter,
            },
            {
              name      : 'photoCenter',
              path      : 'photoCenter',
              component : PhotoCenter,
            },
            {
              name      : 'musicSheet',
              path      : 'musicSheet',
              component : MusicSheet,
            },
            {
              name      : 'localMusic',
              path      : 'localMusic',
              component : LocalMusic,
            },
            {
              name      : 'selfCenter',
              path      : 'selfCenter',
              component : SelfCenter,
            },
            {
              name      : 'sheetDetails',
              path      : 'sheetDetails',
              component : SheetDetails,
            },
            {
              name      : 'updateSheet',
              path      : 'updateSheet',
              component : UpdateSheet,
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
