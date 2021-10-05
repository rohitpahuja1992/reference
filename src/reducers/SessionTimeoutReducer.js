import {
  FETCH_SESSION_TIMEOUT_COMPLETE,
  FETCH_SESSION_TIMEOUT_FAILURE,
  UPDATE_SESSION_TIMEOUT_COMPLETE,
  UPDATE_SESSION_TIMEOUT_FAILURE,
  RESET_DUPLICATE_ERROR,
} from "../utils/AppConstants";

const initState = {
  sessionTimeDetails: {
    list: [],
  },
  isUpdated: false,
  updateError: "",
  getError: "",
};

export const SessionTimeoutReducer = (state = initState, action) => {
  switch (action.type) {
    case FETCH_SESSION_TIMEOUT_COMPLETE:
      return {
        ...state,
        isUpdated: false,
        updateError: "",
        getError: "",
        sessionTimeDetails: {
          list: action.payload,
        },
      };

    case FETCH_SESSION_TIMEOUT_FAILURE:
      return {
        ...state,
        sessionTimeDetails: {
          list: [],
        },
        getError: action.payload,
        isUpdated: false,
        updateError: "",
      };
    case UPDATE_SESSION_TIMEOUT_COMPLETE:
      return {
        ...state,
        isUpdated: true,
        updateError: "",
      };

    case UPDATE_SESSION_TIMEOUT_FAILURE:
      return {
        ...state,
        isUpdated: false,
        updateError: action.payload,
      };
    case RESET_DUPLICATE_ERROR:
      return {
        ...state,
        isUpdated: false,
        updateError: "",
      };
    default:
      return { ...state };
  }
};
