import Vue from 'vue';
import VueRouter from 'vue-router';
import RequestTutorModal from '@/components/RequestTutorModal.vue';
import CalendarExtension from '@/components/CalendarExtension';
import CalendarEvent from '@/components/CalendarEvent';
import instantMessaging from '@/components/InstantMessaging';
import VideoMessaging from '@/components/VideoMessaging.vue';
import Education from '@/components/profile/Education.vue';
import Documents from '@/components/profile/Documents.vue';
import TutorDashboard from '@/components/profile/TutorDashboard.vue';
import TutorReview from '@/components/profile/TutorReview.vue';
import ProfileAbout from '@/components/profile/About.vue';
import ScheduledTutoring from '@/components/profile/ScheduledTutoring.vue';
import AnsweredQuestions from '@/components/profile/AnsweredQuestions.vue';
import AskedQuestions from '@/components/profile/AskedQuestions.vue';

Vue.component('request-tutor-modal', RequestTutorModal);
Vue.component('calendar-extension', CalendarExtension);
Vue.component('ds-event', CalendarEvent);
Vue.component('instant-messaging', instantMessaging);
Vue.component('video-messaging', VideoMessaging);
Vue.component('education', Education);
Vue.component('documents', Documents);
Vue.component('tutor-dashboard', TutorDashboard);
Vue.component('tutor-review', TutorReview);
Vue.component('profile-about', ProfileAbout);
Vue.component('scheduled-tutoring', ScheduledTutoring);
Vue.component('answered-questions', AnsweredQuestions);
Vue.component('asked-questions', AskedQuestions);

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
    path: '/profile/:userId',
    name: 'profile',
    component: () => import('@/components/profile/Profile.vue'),
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
    path: '/user/:userId/calendar',
    name: 'Calendar',
    component: () => import('@/components/Calendar.vue'),
  },
  {
    path: '/conference/:userId',
    name: 'tutoring-session',
    redirect: (to) => {
      return '/conference/' + to.params.userId +'/code';
    },
    component: () => import('@/components/TutoringSession.vue'),
    children: [
      {
        path: 'code',
        name: 'code',
        component: () => import('@/components/CodeEditor.vue'),
      },
      {
        path: 'text-editor',
        name: 'text-editor',
        component: () => import('@/components/TextEditor.vue'),
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
