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
const SET_TUTORED_STUDENTS = 'set_tutored_students';
const SET_DOCUMENTS = 'set_documents';
const SET_EDUCATION = 'set_education';
const SET_TUTOR_REVIEW = 'set_tutor_review';
const SET_DOCUMENT = 'set_document';
const SET_NEW_DOCUMENT = 'set_new_document';
const SET_ABOUT = 'set_about';
const SET_EDUCATIONS = 'set_educations';

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

const SET_ADD_TUTORS = 'set_add_tutors';
const SET_TUTORS_ERROR = 'set_add_tutor_error';

const SET_COMPANIES = 'set_companies';
const SET_COMPANIES_ERROR = 'set_companies_error';

const SET_CODE_IS_RUNNING = 'set_code_is_running';
const SET_CODE = 'set_code';
const SET_CODE_RESULT_LISTENER = 'set_code_result_listener';
const SET_CODE_RESULT = 'set_code_result';
const SET_RESET_CONFERENCE = 'set_reset_conference';

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
  SET_TUTORED_STUDENTS,
  SET_DOCUMENTS,
  SET_EDUCATION,
  SET_TUTOR_REVIEW,
  SET_DOCUMENT,
  SET_NEW_DOCUMENT,
  SET_ABOUT,
  SET_EDUCATIONS,
  SET_UPDATE_PROFILE,

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
  SET_ADD_TUTORS,
  SET_TUTORS_ERROR,

  // Mutations for companies
  SET_COMPANIES,
  SET_COMPANIES_ERROR,

  // Mutations for conference
  SET_CODE_IS_RUNNING,
  SET_CODE,
  SET_CODE_RESULT,
  SET_CODE_RESULT_LISTENER,
  SET_RESET_CONFERENCE,
};
