import {
  FETCH_ENVIRONMENT_COMPLETE,
  FETCH_ENVIRONMENT_FAILURE,
  ADD_ENVIRONMENT_COMPLETE,
  ADD_ENVIRONMENT_ERROR,
  ADD_ENVIRONMENT_FAILURE,
  DELETE_ENVIRONMENT_COMPLETE,
  DELETE_ENVIRONMENT_ERROR,
  DELETE_ENVIRONMENT_FAILURE,
  UNTERM_ENVIRONMENT_COMPLETE,
  UNTERM_ENVIRONMENT_ERROR,
  UNTERM_ENVIRONMENT_FAILURE,
  RESET_DUPLICATE_ERROR,
} from "../utils/AppConstants";

const initState = {
  environmentDetailsList: {
    list: [],
    totalElements: 0,
    totalPages: 0,
    pageSize: 0,
    startIndex: 0,
    reset: false, },
  isEnvironmentAdded: false,
  isEnvironmentDeleted: false,
  getError: "",
  addError: "",
};

export const EnvironmentReducer = (state = initState, action) => {
  switch (action.type) {
    case FETCH_ENVIRONMENT_COMPLETE:
      return {
        ...state,
        environmentDetailsList: {
          list: action.payload.oobComponents,
          totalElements: action.payload.totalElements,
          totalPages: action.payload.totalPages,
          pageSize: action.payload.pageSize,
          startIndex:action.payload.startIndex,
        },
        getError: "",
        addError: "",
        isEnvironmentAdded: false,
        isEnvironmentDeleted: false,
      };

    case FETCH_ENVIRONMENT_FAILURE:
      return {
        ...state,
        environmentDetailsList: { 
          list: [],
          totalElements: 0,
          totalPages: 0,
          pageSize: 0,
          startIndex: 0,
          reset: false, },
        getError: action.payload,
        addError: "",
        isEnvironmentAdded: false,
        isEnvironmentDeleted: false,
      };
    case ADD_ENVIRONMENT_COMPLETE:
      return {
        ...state,
        isEnvironmentAdded: true,
        addError: "",
      };
    case ADD_ENVIRONMENT_ERROR:
      return {
        ...state,
        isEnvironmentAdded: false,
        addError: action.payload,
      };

    case ADD_ENVIRONMENT_FAILURE:
      return {
        ...state,
        isEnvironmentAdded: false,
        addError: action.payload,
      };
    case DELETE_ENVIRONMENT_COMPLETE:
      return {
        ...state,
        isEnvironmentDeleted: true,
      };
    case DELETE_ENVIRONMENT_ERROR:
      return {
        ...state,
        isEnvironmentDeleted: false,
      };

    case DELETE_ENVIRONMENT_FAILURE:
      return {
        ...state,
        isEnvironmentDeleted: false,
      };
    case UNTERM_ENVIRONMENT_COMPLETE:
      return {
        ...state,
        isEnvironmentDeleted: true,
      };
    case UNTERM_ENVIRONMENT_ERROR:
      return {
        ...state,
        isEnvironmentDeleted: false,
      };

    case UNTERM_ENVIRONMENT_FAILURE:
      return {
        ...state,
        isEnvironmentDeleted: false,
      };
    case RESET_DUPLICATE_ERROR:
      return {
        ...state,
        addError: "",
      };
    default:
      return { ...state };
  }
};
