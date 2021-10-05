import {
  FETCH_ROLES_COMPLETE,
  FETCH_ROLES_FAILURE,
  FETCH_ROLES_ERROR,
  FETCH_ROLE_PROFILE_COMPLETE,
  FETCH_ROLE_PROFILE_ERROR,
  FETCH_ROLE_PROFILE_FAILURE,
  UPDATE_ROLE_COMPLETE,
  UPDATE_ROLE_ERROR,
  UPDATE_ROLE_FAILURE,
} from "../utils/AppConstants";

const initState = {
  data: {
    list: [],
    responseCode: "",
    responseMessage: "",
    error: "",
  },
  profile: {
    details: "",
    responseCode: "",
    responseMessage: "",
    isUpdateCalled: false,
    isFetchCalled: false,
    error: "",
  },
};

export const RoleReducer = (state = initState, action) => {
  switch (action.type) {
    case FETCH_ROLES_COMPLETE:
      return {
        ...state,
        data: {
          list: action.payload.responseObject,
          responseCode: action.payload.responseCode,
          responseMessage: action.payload.responseMessage,
          error: undefined,
        },
      };

    case FETCH_ROLES_ERROR:
      return {
        ...state,
        data: {
          ...state.data,
          list: state.data.list,
          responseCode: action.payload.responseCode,
          responseMessage: action.payload.responseMessage,
          error: action.payload,
        },
      };

    case FETCH_ROLES_FAILURE:
      return {
        ...state,
        data: {
          list: [],
          responseCode: "",
          responseMessage: "",
          error: action.payload,
        },
      };

    case FETCH_ROLE_PROFILE_COMPLETE:
      return {
        ...state,
        profile: {
          details: action.payload.responseObject,
          responseCode: action.payload.responseCode,
          responseMessage: action.payload.responseMessage,
          isFetchCalled: true,
          isUpdateCalled: false,
          error: undefined,
        },
      };

    case FETCH_ROLE_PROFILE_ERROR:
      return {
        ...state,
        profile: {
          ...state.profile,
          responseCode: action.payload.responseCode,
          responseMessage: action.payload.responseMessage,
          isFetchCalled: true,
          isUpdateCalled: false,
          error: action.payload,
        },
      };

    case FETCH_ROLE_PROFILE_FAILURE:
      return {
        ...state,
        profile: {
          details: "",
          responseCode: "",
          responseMessage: "",
          isFetchCalled: true,
          isUpdateCalled: false,
          error: action.payload,
        },
      };

    case UPDATE_ROLE_COMPLETE:
      return {
        ...state,
        profile: {
          details: action.payload.responseObject,
          responseCode: action.payload.responseCode,
          responseMessage: action.payload.responseMessage,
          isFetchCalled: false,
          isUpdateCalled: true,
          error: undefined,
        },
      };

    case UPDATE_ROLE_ERROR:
      return {
        ...state,
        profile: {
          ...state.profile,
          responseCode: action.payload.responseCode,
          responseMessage: action.payload.responseMessage,
          isFetchCalled: false,
          isUpdateCalled: true,
          error: action.payload,
        },
      };

    case UPDATE_ROLE_FAILURE:
      return {
        ...state,
        profile: {
          details: "",
          responseCode: "",
          responseMessage: "",
          isFetchCalled: false,
          isUpdateCalled: true,
          error: action.payload,
        },
      };
    default:
      return { ...state };
  }
};
