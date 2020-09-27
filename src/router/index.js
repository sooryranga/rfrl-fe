import Vue from 'vue';
import VueRouter from 'vue-router';
import RequestTutorModal from '@/components/RequestTutorModal.vue';
import CalendarExtension from '@/components/CalendarExtension';
import CalendarEvent from '@/components/CalendarEvent';

Vue.component('request-tutor-modal', RequestTutorModal);
Vue.component('calendar-extension', CalendarExtension);
Vue.component('ds-event', CalendarEvent);

Vue.use(VueRouter);

const routes = [
  {
    path: '/questions',
    name: 'Questions',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('@/components/Questions.vue'),
  },
  {
    path: '/tutors',
    name: 'Tutors',
    component: () => import('@/components/Tutors.vue'),
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('@/components/Home.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/components/About.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/components/Login.vue'),
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: () => import('@/components/SignUp.vue'),
  },
  {
    path: '/user/:user_id/calendar',
    name: 'Calendar',
    component: () => import('@/components/Calendar.vue'),
  },
  {
    path: '/conference/:user_id',
    name: 'VideoConference',
    component: () => import('@/components/videoConference.vue'),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
