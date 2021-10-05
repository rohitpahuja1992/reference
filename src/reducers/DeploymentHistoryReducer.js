import {
  FETCH_DEPLOYMENT_HISTORY_COMPLETE,
  FETCH_DEPLOYMENT_HISTORY_ERROR,
  FETCH_DEPLOYMENT_HISTORY_FAILURE,
} from "../utils/AppConstants";

const initState = {
  list: [],
  totalElements: 0,
  totalPages: 0,
  pageSize: 0,
  startIndex: 0,
  reset: false,
};

export const DeploymentHistoryReducer = (state = initState, action) => {
  switch (action.type) {
    case FETCH_DEPLOYMENT_HISTORY_COMPLETE:
      return {
        ...state,
        list: action.payload.oobComponents,
        totalElements: action.payload.totalElements,
        totalPages: action.payload.totalPages,
        pageSize: action.payload.pageSize,
        startIndex:action.payload.startIndex,
      };
    case FETCH_DEPLOYMENT_HISTORY_ERROR:
      return {
        ...state
      };
    case FETCH_DEPLOYMENT_HISTORY_FAILURE:
      return {
        ...state
      };

    default:
      return { ...state };
  }
};
