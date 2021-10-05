import {
  LOGIN_AUTH_COMPLETE,
  LOGIN_AUTH_FAILURE,
  LOGIN_AUTH_ERROR,
  LOGIN_COMPLETE,
  LOGOUT_COMPLETE,
  LOGIN_FAILURE,
  LOGOUT_FAILURE,
  LOGIN_ERROR,
  RESET_LOGIN_IS_DONE,
  RESET_PASSWORD_CODE,
  RESET_PASSWORD_CODE_SUCCESS,
  RESET_PASSWORD_CODE_FAILURE,
  RESET_FORGET_PASSWORD,
  FORGET_PASSWORD_SUCCESS,
  FORGET_PASSWORD_FAILURE,
} from "../utils/AppConstants";

const initState = {
  loginDetails: {
    isDone: false,
    detail: {},
    responseCode: "",
    responseMessage: "",
    error: "",
  },
  loginAuthDetails: {
    isDone: false,
    detail: {},
    responseCode: "",
    responseMessage: "",
    error: "",
  },
  logoutDetails: { isDone: false, detail: {}, error: "" },
  resetPasswordCode: false,
  forgetPassword: false
};

export const loginReducer = (state = initState, action) => {
  switch (action.type) {
    case LOGIN_AUTH_COMPLETE:
      return {
        ...state,
        loginAuthDetails: {
          isDone: true,
          detail: action.payload.responseObject,
          responseCode: action.payload.responseCode,
          responseMessage: action.payload.responseMessage,
          error: undefined,
        },
      };

    case LOGIN_AUTH_ERROR:
      return {
        ...state,
        loginAuthDetails: {
          isDone: false,
          detail: state.loginDetails.detail,
          responseCode: action.payload.responseCode,
          responseMessage: action.payload.responseMessage,
          error: action.payload,
        },
      };

    case LOGIN_AUTH_FAILURE:
      return {
        ...state,
        loginAuthDetails: {
          isDone: false,
          detail: undefined,
          responseCode: "",
          responseMessage: "",
          error: action.payload,
        },
      };
    case LOGIN_COMPLETE:
      return {
        ...state,
        loginDetails: {
          isDone: true,
          detail: action.payload.responseObject,
          responseCode: action.payload.responseCode,
          responseMessage: action.payload.responseMessage,
          error: undefined,
        },
      };

    case LOGIN_ERROR:
      return {
        ...state,
        loginDetails: {
          isDone: false,
          detail: state.loginDetails.detail,
          responseCode: action.payload.responseCode,
          responseMessage: action.payload.responseMessage,
          error: action.payload,
        },
      };

    case LOGIN_FAILURE:
      return {
        ...state,
        loginDetails: {
          isDone: false,
          detail: undefined,
          responseCode: "",
          responseMessage: "",
          error: action.payload,
        },
      };

    case LOGOUT_COMPLETE:
      return {
        ...state,
        logoutDetails: {
          isDone: true,
          detail: action.payload,
          error: undefined,
        },
      };

    case LOGOUT_FAILURE:
      return {
        ...state,
        logoutDetails: {
          isDone: false,
          detail: undefined,
          error: action.payload,
        },
      };

    case RESET_LOGIN_IS_DONE:
      return {
        ...state,
        loginDetails: {
          isDone: false,
          detail: {},
          responseCode: "",
          responseMessage: "",
          error: "",
        },
      };

    case RESET_PASSWORD_CODE_SUCCESS:
      return {
        ...state,
        resetPasswordCode: action.payload,
      };

    case RESET_PASSWORD_CODE_FAILURE:
      return {
        ...state,
        resetPasswordCode: action.payload,
      };

    case RESET_PASSWORD_CODE:
      return {
        ...state,
        resetPasswordCode: false,
      };

    case FORGET_PASSWORD_SUCCESS:
      return {
        ...state,
        forgetPassword: action.payload,
      };

    case FORGET_PASSWORD_FAILURE:
      return {
        ...state,
        forgetPassword: action.payload,
      };

    case RESET_FORGET_PASSWORD:
      return {
        ...state,
        forgetPassword: false,
      };

    default:
      return { ...state };
  }
};
