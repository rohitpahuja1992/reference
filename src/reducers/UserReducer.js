import {
  FETCH_USERS_COMPLETE,
  FETCH_USERS_FAILURE,
  ADD_USER_COMPLETE,
  ADD_USER_ERROR,
  ADD_USER_FAILURE,
  RESET_USER_IS_DONE,
  RESET_ADD_USER_ERROR,
  FETCH_USERS_ERROR,
  FETCH_USER_PROFILE_COMPLETE,
  FETCH_USER_PROFILE_ERROR,
  FETCH_USER_PROFILE_FAILURE,
  FETCH_LOGGED_IN_USER_INFO_COMPLETE,
  FETCH_LOGGED_IN_USER_INFO_ERROR,
  FETCH_LOGGED_IN_USER_INFO_FAILURE,
  UPDATE_USER_PROFILE_COMPLETE,
  UPDATE_USER_PROFILE_ERROR,
  UPDATE_USER_PROFILE_FAILURE,
  RESET_UPDATE_USERAUDIT_IS_DONE,
  DEFAULT_START_INDEX,
  DEFAULT_PAGE_SIZE,
} from "../utils/AppConstants";

const initState = {
  data: {
    isUserAdded: false,
    isFetchCalled: false,
    list: [],
    error: "",
    responseCode: "",
    responseMessage: "",
    totalElements: "",
    totalPages: "",
  },
  page: {
    startIndex: DEFAULT_START_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
  },
  profile: {
    details: "",
    isUpdateCalled: false,
    isAuditUpdated: false,
    responseCode: "",
    responseMessage: "",
    error: "",
    fecthError: "",
  },
  loggedInUser: {
    details: "",
    responseCode: "",
    responseMessage: "",
    error: "",
  },
  features: [],
};

export const UserReducer = (state = initState, action) => {
  switch (action.type) {
    case FETCH_USERS_COMPLETE:
      return {
        ...state,
        data: {
          ...state.data,
          isUserAdded: false,
          list: action.payload.usersInfo.responseObject.users,
          responseCode: action.payload.usersInfo.responseCode,
          responseMessage: action.payload.usersInfo.responseMessage,
          totalElements: action.payload.usersInfo.responseObject.totalElements,
          totalPages: action.payload.usersInfo.responseObject.totalPages,
          error: undefined,
          fecthError: undefined,
        },
        page: {
          startIndex: action.payload.startIndex,
          pageSize: action.payload.pageSize,
        },
      };

    case FETCH_USERS_ERROR:
      return {
        ...state,
        data: {
          ...state.data,
          isFetchCalled: true,
          isUserAdded: false,
          responseCode: action.payload.responseCode,
          responseMessage: action.payload.responseMessage,
          totalElements: "",
          totalPages: "",
          fecthError: action.payload,
          error: undefined,
        },
        page: {
          startIndex: DEFAULT_START_INDEX,
          pageSize: DEFAULT_PAGE_SIZE,
        },
      };

    case FETCH_USERS_FAILURE:
      return {
        ...state,
        data: {
          ...state.data,
          isUserAdded: false,
          list: [],
          responseCode: "",
          responseMessage: "",
          totalElements: "",
          totalPages: "",
          fecthError: action.payload,
          error: undefined,
        },
        page: {
          startIndex: DEFAULT_START_INDEX,
          pageSize: DEFAULT_PAGE_SIZE,
        },
      };

    case ADD_USER_COMPLETE:
      const newUserData = action.payload.responseObject;
      return {
        ...state,
        data: {
          isUserAdded: true,
          responseCode: action.payload.responseCode,
          responseMessage: action.payload.responseMessage,
          list: [newUserData, ...state.data.list],
          error: undefined,
        },
      };

    case ADD_USER_ERROR:
      return {
        ...state,
        data: {
          ...state.data,
          responseCode: action.payload.responseCode,
          responseMessage: action.payload.responseMessage,
          error: action.payload,
        },
      };

    case ADD_USER_FAILURE:
      return {
        ...state,
        data: {
          ...state.data,
          responseCode: "",
          responseMessage: "",
          error: action.payload,
        },
      };

    case RESET_ADD_USER_ERROR:
      return {
        ...state,
        data: { ...state.data, error: undefined },
      };

    case RESET_USER_IS_DONE:
      return {
        ...state,
        data: { ...state.data, isUserAdded: false },
      };

    case FETCH_USER_PROFILE_COMPLETE:
      return {
        ...state,
        profile: {
          details: action.payload.responseObject,
          isFetchCalled: true,
          isUpdateCalled: false,
          isAuditUpdated: false,
          responseCode: action.payload.responseCode,
          responseMessage: action.payload.responseMessage,
          error: undefined,
        },
      };

    case FETCH_USER_PROFILE_ERROR:
      return {
        ...state,
        profile: {
          ...state.profile,
          isFetchCalled: true,
          isUpdateCalled: false,
          isAuditUpdated: false,
          responseCode: action.payload.responseCode,
          responseMessage: action.payload.responseMessage,
          error: action.payload,
        },
      };

    case FETCH_USER_PROFILE_FAILURE:
      return {
        ...state,
        profile: {
          details: "",
          isFetchCalled: true,
          isUpdateCalled: false,
          isAuditUpdated: false,
          responseCode: "",
          responseMessage: "",
          error: action.payload,
        },
      };

    case UPDATE_USER_PROFILE_COMPLETE:
      return {
        ...state,
        profile: {
          details: action.payload.responseObject,
          isUpdateCalled: true,
          isAuditUpdated: true,
          isFetchCalled: false,
          error: undefined,
        },
      };

    case UPDATE_USER_PROFILE_ERROR:
      return {
        ...state,
        profile: {
          ...state.profile,
          isUpdateCalled: true,
          isAuditUpdated: false,
          isFetchCalled: false,
          error: action.payload,
        },
      };

    case UPDATE_USER_PROFILE_FAILURE:
      return {
        ...state,
        profile: {
          details: "",
          isUpdateCalled: true,
          isAuditUpdated: false,
          isFetchCalled: false,
          error: action.payload,
        },
      };

    case FETCH_LOGGED_IN_USER_INFO_COMPLETE:
      return {
        ...state,
        loggedInUser: {
          details: action.payload.Info.responseObject,
          responseCode: action.payload.Info.responseCode,
          responseMessage: action.payload.Info.responseMessage,
          error: undefined,
        },
        features: action.payload.features,
      };

    case FETCH_LOGGED_IN_USER_INFO_ERROR:
      return {
        ...state,
        loggedInUser: {
          ...state.loggedInUser,
          responseCode: action.payload.responseCode,
          responseMessage: action.payload.responseMessage,
          error: action.payload,
        },
        features: [],
      };

    case FETCH_LOGGED_IN_USER_INFO_FAILURE:
      return {
        ...state,
        loggedInUser: {
          details: "",
          responseCode: "",
          responseMessage: "",
          error: action.payload,
        },
        features: [],
      };
    case RESET_UPDATE_USERAUDIT_IS_DONE:
      return {
        ...state,
        profile: {
          ...state.profile,
          isAuditUpdated: false,
        },
      };
    default:
      return { ...state };
  }
};
