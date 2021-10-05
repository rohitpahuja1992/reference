import {
  FETCH_JIRATICKET_COMPLETE,
  FETCH_JIRATICKET_FAILURE,
  UPDATE_JIRATICKET_COMPLETE,
  UPDATE_JIRATICKET_FAILURE,
  RESET_DUPLICATE_ERROR,
} from "../utils/AppConstants";

const initState = {
  jiraDetails: '',
  isUpdated: false,
  updateError: "",
  getError: "",
};

export const JiraTicketReducer = (state = initState, action) => {
  switch (action.type) {
    case FETCH_JIRATICKET_COMPLETE:
      return {
        ...state,
        isUpdated: false,
        updateError: "",
        getError: "",
        jiraDetails: action.payload,
      };

    case FETCH_JIRATICKET_FAILURE:
      return {
        ...state,
        jiraDetails: action.payload,
        getError: action.payload,
        isUpdated: false,
        updateError: "",
      };
    case UPDATE_JIRATICKET_COMPLETE:
      return {
        ...state,
        jiraDetails: action.payload,
        isUpdated: true,
        updateError: "",
      };

    case UPDATE_JIRATICKET_FAILURE:
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
