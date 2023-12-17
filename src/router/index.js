import Vue from 'vue';
import VueRouter from 'vue-router';
import Education from '@/components/profile/Education.vue';
import Documents from '@/components/Documents.vue';
import TutorDashboard from '@/components/profile/TutorDashboard.vue';
import TutorReview from '@/components/profile/TutorReview.vue';
import ProfileAbout from '@/components/profile/About.vue';
import ScheduledTutoring from '@/components/ScheduledTutoring.vue';
import AnsweredQuestions from '@/components/profile/AnsweredQuestions.vue';

import VueCal from 'vue-cal';

Vue.component('education', Education);
Vue.component('documents', Documents);
Vue.component('tutor-dashboard', TutorDashboard);
Vue.component('tutor-review', TutorReview);
Vue.component('profile-about', ProfileAbout);
Vue.component('scheduled-tutoring', ScheduledTutoring);
Vue.component('answered-questions', AnsweredQuestions);
Vue.component('vue-cal', VueCal);
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: () => import('@/components/Main.vue'),
    redirect: () => {
      return '/home';
    },
    children: [
      {
        path: 'chat/:roomId?',
        name: 'chat',
        component: () => import('@/components/ChatContainer.vue'),
      },
      {
        path: 'questions/:questionId?',
        name: 'questions',
        component: () => import('@/components/questions/Questions.vue'),
      },
      {
        path: 'tutors',
        name: 'Tutors',
        component: () => import('@/components/tutorList//Tutors.vue'),
      },
      {
        path: 'home',
        name: 'home',
        component: () => import('@/components/Home.vue'),
      },
      {
        path: '/profile/:userId',
        name: 'profile',
        component: () => import('@/components/profile/Profile.vue'),
      },
      {
        path: '/about',
        name: 'about',
        component: () => import('@/components/About.vue'),
      },
      {
        path: '/profile/:userId/calendar',
        name: 'profile-calendar',
        props: true,
        component: () => import('@/components/Calendar.vue'),
      },
      {
        path: '/session/:sessionId/calendar',
        name: 'session-calendar',
        props: true,
        component: () => import('@/components/Calendar.vue'),
      },
      {
        path: '/session/:sessionId/info',
        name: 'session-info',
        props: true,
        component: () => import('@/components/SessionInfo/SessionInfo.vue'),
      },
      {
        path: '/session/:sessionId/conference/:conferenceId',
        name: 'session-conference',
        props: true,
        redirect: (to) => {
          const url = [
            '/session/',
            to.params.sessionId,
            '/conference/',
            to.params.conferenceId,
            '/code',
          ];
          return url.join('');
        },
        component: () => import('@/components/SessionConference.vue'),
        children: [
          {
            path: 'code',
            name: 'code',
            props: true,
            component: () => import('@/components/code/Code.vue'),
          },
          {
            path: 'text-editor',
            name: 'text-editor',
            props: true,
            component: () => import('@/components/TextEditor.vue'),
          },
          {
            path: 'screen-share',
            name: 'screen-share',
            props: true,
            component: () => import('@/components/ScreenShare.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('@/components/register/SignUp.vue'),
  },
  {
    path: '/signup/user-info',
    name: 'basicInfo',
    component: () => import('@/components/register/BasicUserInfo.vue'),
  },
  {
    path: '/signup/company-email',
    name: 'companyEmail',
    component: () => import('@/components/register/CompanyEmail.vue'),
  },
  {
    path: '/signup/user-type',
    name: 'typeOfUser',
    component: () => import('@/components/register/TypeOfUser.vue'),
  },
  {
    path: '/signup/documents',
    name: 'registerDocuments',
    component: () => import('@/components/register/RegisterDocuments.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
