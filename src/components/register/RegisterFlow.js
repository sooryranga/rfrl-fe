import {Auth} from '@/api';

export const typeOfUser = 'TypeOfUser';
export const basicInfo = 'BasicInfo';
export const companyEmail = 'CompanyEmail';
export const registerDocuments = 'RegisterDocuments';
export const doneSignUp = 'DoneSignUp';

const studentFlow = [typeOfUser, basicInfo, registerDocuments, doneSignUp];
const tutorFlow = [
  typeOfUser, basicInfo, registerDocuments, companyEmail, doneSignUp,
];

const routeToStep = {
  [typeOfUser]: (router) => {
    router.push({name: 'typeOfUser'});
  },
  [basicInfo]: (router) => {
    router.push({name: 'basicInfo'});
  },
  [companyEmail]: (router) => {
    router.push({name: 'companyEmail'});
  },
  [registerDocuments]: (router) => {
    router.push({name: 'registerDocuments'});
  },
  [doneSignUp]: (router, {profileId}) => {
    router.push({name: 'workInProgress', params: {userId: profileId}});
  },
};

export const flowToNextStep = async (
    {currentStep, isTutor, router, params},
) => {
  const flow = isTutor ? tutorFlow : studentFlow;

  const i = flow.indexOf(currentStep);
  const nextStep = flow[Math.min(i+1, flow.length-1)];
  await Auth.AuthService.updateSignUpFlow({stage: nextStep});

  routeToStep[nextStep](router, params);
};

export const flowToStep = ({currentStep, router, params}) => {
  routeToStep[currentStep](router, params);
};
