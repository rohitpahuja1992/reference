import {
  FETCH_LISTBYPAGE_COMPLETE,
  FETCH_LISTBYPAGE_FAILURE,
  RESET_PAGINATION_DATA,
  SET_DEFAULT_STARTINDEX,
} from "../utils/AppConstants";

const initState = {
  DetailsList: {
    list: [],
    totalElements: "",
    totalPages: "",
  },
  page: {
    url: "",
    startIndex: 0,
    pageSize: 10,
    entityName: "",
  },
  getError: "",
  reset: false,
};

export const PaginationReducer = (state = initState, action) => {
  switch (action.type) {
    case FETCH_LISTBYPAGE_COMPLETE:
      return {
        ...state,
        DetailsList: {
          list: [...action.payload.list],
          totalElements: action.payload.totalElements,
          totalPages: action.payload.totalPages,
        },
        page: {
          url: action.payload.url,
          startIndex: action.payload.startIndex,
          pageSize: action.payload.pageSize,
          entityName: action.payload.entityName,
        },
        reset: false,
        getError: "",
      };
    case FETCH_LISTBYPAGE_FAILURE:
      return {
        ...state,
        DetailsList: { list: [], totalElements: "", totalPages: "" },
        page: { url: "", startIndex: 0, pageSize: 10, entityName: "" },
        reset: false,
        getError: action.payload,
      };
    case RESET_PAGINATION_DATA:
      return {
        ...state,
        DetailsList: { list: [], totalElements: "", totalPages: "" },
        page: { url: "", startIndex: 0, pageSize: 10, entityName: "" },
        reset: false,
        getError: "",
      };
    case SET_DEFAULT_STARTINDEX:
      return {
        ...state,
        reset: action.payload,
      };
    default:
      return { ...state };
  }
};
