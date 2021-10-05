import {
  FETCH_ENVIRONMENT_STATUS_COMPLETE,
  FETCH_ENVIRONMENT_STATUS_ERROR,
  FETCH_ENVIRONMENT_STATUS_FAILURE
} from "../utils/AppConstants";

const initState = {
  list: [],
    totalElements: 0,
  totalPages: 0,
  pageSize: 0,
  startIndex: 0,
  reset: false,
};

export const EnvironmentStatusReducer = (state = initState, action) => {
  switch (action.type) {
    case FETCH_ENVIRONMENT_STATUS_COMPLETE:
      return {
        ...state,
        list: action.payload.oobComponents,
        totalElements: action.payload.totalElements,
        totalPages: action.payload.totalPages,
        pageSize: action.payload.pageSize,
        startIndex:action.payload.startIndex,
      };
    case FETCH_ENVIRONMENT_STATUS_ERROR:
      return {
        ...state
      };
    case FETCH_ENVIRONMENT_STATUS_FAILURE:
      return {
        ...state
      };

    default:
      return { ...state };
  }
};
