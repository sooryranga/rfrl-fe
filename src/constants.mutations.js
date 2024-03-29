const SET_LOGGED_IN = 'log_in';
const SET_GOOGLE_AUTH = 'google_auth';
const SET_LINKED_IN_AUTH = 'linkedin_auth';
const SET_EMAIL_AUTH = 'default_auth';
const SET_LOGGED_OUT = 'log_out';
const SET_AUTH_ERROR = 'set_auth_error';

const SET_PROFILE = 'set_profile';
const SET_UPDATE_PROFILE = 'set_update_profile';
const SET_PROFILE_IMAGE = 'set_profile_image';
const SET_NAME = 'set_name';
const SET_REFERRED_CLIENTS = 'set_referred_clients';
const SET_EDUCATION = 'set_education';
const SET_ABOUT = 'set_about';
const SET_EMAIL_VERIFICATION = 'set_email_verification';

const SET_ROOMS = 'set_rooms';
const SET_USERS = 'set_users';
const SET_AUTOUPDATEROOMS = 'set_autoUpdateRooms';
const SET_ROOM_LISTENER = 'set_room_listener';

const SET_MESSAGES = 'set_messages';
const SET_MESSAGE_LISTENER = 'set_message_listener';
const SET_LATEST_MESSAGE = 'set_latest_message';
const SET_META = 'set_meta';

const SET_ADD_QUESTION = 'set_add_question';
const SET_QUESTIONS = 'set_questions';
const SET_MORE_QUESTIONS = 'set_more_questions';
const SET_SELECT_QUESTION = 'set_select_question';
const SET_QUESTION_ERROR = 'set_question_error';
const SET_UPDATE_QUESTION = 'set_update_question';
const SET_QUESTION_EDITOR = 'set_question_editor';

const SET_TUTORS = 'set_tutors';
const SET_TUTORS_ERROR = 'set_add_tutor_error';
const SET_TUTOR_PARAMS = 'set_tutor_params';

const SET_ADD_CLIENTS = 'set_add_clients';
const SET_CLIENTS = 'set_clients';
const SET_CLIENTS_ERROR = 'set_add_clients_error';


const SET_COMPANIES = 'set_companies';
const SET_COMPANIES_ERROR = 'set_companies_error';

const SET_RUN_CODE = 'set_run_code';
const SET_CODE_IS_RUNNING = 'set_code_is_running';
const SET_CODE = 'set_code';
const SET_CODE_RESULT_LISTENER = 'set_code_result_listener';
const SET_CODE_RESULT = 'set_code_result';
const SET_RESET_CONFERENCE = 'set_reset_conference';

const SET_REQUIRED_REVIEW = 'set_required_review';

const SET_PENDING_REPORT_CLIENT = 'set_pending_report_client';

const SET_GLOBAL_MODAL = 'set_global_modal';

export {
  // Mutations for authentication
  SET_LOGGED_IN,
  SET_GOOGLE_AUTH,
  SET_LINKED_IN_AUTH,
  SET_EMAIL_AUTH,
  SET_LOGGED_OUT,
  SET_AUTH_ERROR,

  // Mutations for user
  SET_PROFILE,
  SET_PROFILE_IMAGE,
  SET_NAME,
  SET_REFERRED_CLIENTS,
  SET_EDUCATION,
  SET_ABOUT,
  SET_UPDATE_PROFILE,
  SET_EMAIL_VERIFICATION,

  // Mutations for chatRooms
  SET_ROOMS,
  SET_USERS,
  SET_AUTOUPDATEROOMS,
  SET_ROOM_LISTENER,

  // mutations for messages
  SET_MESSAGES,
  SET_MESSAGE_LISTENER,
  SET_LATEST_MESSAGE,
  SET_META,

  // Mutations for questions
  SET_ADD_QUESTION,
  SET_QUESTIONS,
  SET_MORE_QUESTIONS,
  SET_SELECT_QUESTION,
  SET_QUESTION_ERROR,
  SET_UPDATE_QUESTION,
  SET_QUESTION_EDITOR,

  // Multations for tutors
  SET_TUTORS,
  SET_TUTORS_ERROR,
  SET_TUTOR_PARAMS,

  // Mutations for clients
  SET_ADD_CLIENTS,
  SET_CLIENTS,
  SET_CLIENTS_ERROR,

  // Mutations for companies
  SET_COMPANIES,
  SET_COMPANIES_ERROR,

  // Mutations for conference
  SET_RUN_CODE,
  SET_CODE_IS_RUNNING,
  SET_CODE,
  SET_CODE_RESULT,
  SET_CODE_RESULT_LISTENER,
  SET_RESET_CONFERENCE,

  // Mutations for global modal
  SET_GLOBAL_MODAL,

  // Mutations for report client
  SET_PENDING_REPORT_CLIENT,

  // Mutations for tutor review
  SET_REQUIRED_REVIEW,
};

