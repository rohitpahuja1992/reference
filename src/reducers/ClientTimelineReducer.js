import {
  FETCH_CLIENT_TIMELINE_COMPLETE,
  FETCH_CLIENT_TIMELINE_ERROR,
  FETCH_CLIENT_TIMELINE_FAILURE
} from "../utils/AppConstants";

const initState = {
  list: [],
  totalElements:0,
  startIndex: 0
};

export const ClientTimelineReducer = (state = initState, action) => {
  switch (action.type) {
    case FETCH_CLIENT_TIMELINE_COMPLETE:
      return {
        ...state,
        list: action.payload.oobcomponents,
        totalElements: action.payload.totalElements,
        startIndex: action.payload.startIndex
      };
    case FETCH_CLIENT_TIMELINE_ERROR:
      return {
        ...state
      };
    case FETCH_CLIENT_TIMELINE_FAILURE:
      return {
        ...state
      };

    default:
      return { ...state };
  }
};
