import {
  FETCH_OOB_CONTROL_COMPLETE,
  FETCH_OOB_CONTROL_ERROR,
  FETCH_OOB_CONTROL_FAILED,
  ADD_OOB_CONTROL_COMPLETE,
  ADD_OOB_CONTROL_ERROR,
  DELETE_OOBCONTROL_COMPLETE,
  DELETE_OOBCONTROL_FAILURE,
  ADD_OOB_CONTROL_FAILED,
  RESET_OOB_CONTROL_ERROR,
  RESET_ADD_OOB_CONTROL_IS_DONE,
  // RESET_OOB_CONTROL_IS_FETCH_DONE,
  FETCH_OOB_CONTROL_BY_ID_COMPLETE,
  FETCH_OOB_CONTROL_BY_ID_ERROR,
  FETCH_OOB_CONTROL_BY_ID_FAILED,
  UPDATE_OOB_CONTROL_COMPLETE,
  UPDATE_OOB_CONTROL_ERROR,
  UPDATE_OOB_CONTROL_FAILED,
  RESET_UPDATE_OOB_CONTROL_IS_DONE,
  DEFAULT_START_INDEX,
  DEFAULT_PAGE_SIZE,
  SET_DEFAULT_STARTINDEX
} from "../utils/AppConstants";

const initState = {
  data: {
    list: [],
    totalElements: "",
    totalPages: "",
    isControlAdded: false,
    addError: "",
    error: "",
    isControlDeleted: false,
  },
  page: {
    startIndex: DEFAULT_START_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
  },
  reset: false,
  individual: {
    details: "",
    fetchError: "",
    updateError: "",
    isControlUpdated: false,
  },
};

export const OobControlReducer = (state = initState, action) => {
  switch (action.type) {
    case FETCH_OOB_CONTROL_COMPLETE:
      return {
        ...state,
        data: {
          list: action.payload.controls,
          totalElements: action.payload.pageInfo.totalElements,
          totalPages: action.payload.pageInfo.totalPages,
          error: undefined,
          addError: "",
          isControlDeleted: false,
          isControlAdded: false,
        },
        page: {
          startIndex: action.payload.startIndex,
          pageSize: action.payload.pageSize,
        },
        reset: false,
      };

    case FETCH_OOB_CONTROL_ERROR:
      return {
        ...state,
        data: {
          ...state.data,
          list: [],
          totalElements: "",
          totalPages: "",
          error: action.payload,
          addError: "",
          isControlDeleted: false,
          isControlAdded: false,
        },
        page: { startIndex: DEFAULT_START_INDEX, pageSize: DEFAULT_PAGE_SIZE },
        reset: false,
      };

    case FETCH_OOB_CONTROL_FAILED:
      return {
        ...state,
        data: {
          list: [],
          totalElements: "",
          totalPages: "",
          error: action.payload,
          addError: "",
          isControlDeleted: false,
          isControlAdded: false,
        },
        page: { startIndex: DEFAULT_START_INDEX, pageSize: DEFAULT_PAGE_SIZE },
        reset: false,
      };
    case DELETE_OOBCONTROL_COMPLETE:
      return {
        ...state,
        data: {
          ...state.data,
          isControlDeleted: true,
        },
      };

    case DELETE_OOBCONTROL_FAILURE:
      return {
        ...state,
        data: {
          ...state.data,
          isControlDeleted: false,
        },
      };

    case ADD_OOB_CONTROL_COMPLETE:
      return {
        ...state,
        data: {
          ...state.data,
          addError: "",
          isControlAdded: true,
          error: undefined,
        },
      };

    case ADD_OOB_CONTROL_ERROR:
      return {
        ...state,
        data: {
          ...state.data,
          addError: action.payload,
          isControlAdded: false,
        },
      };

    case ADD_OOB_CONTROL_FAILED:
      return {
        ...state,
        data: {
          ...state.data,
          addError: action.payload,
          isControlAdded: false,
        },
      };

    case RESET_OOB_CONTROL_ERROR:
      return {
        ...state,
        data: { ...state.data, error: undefined },
      };

    case RESET_ADD_OOB_CONTROL_IS_DONE:
      return {
        ...state,
        data: { ...state.data, addError: "", isControlAdded: false },
      };

    // case RESET_OOB_CONTROL_IS_FETCH_DONE:
    //   return {
    //     ...state,
    //     data: { ...state.data, isFetchDone: false },
    //   };

    case FETCH_OOB_CONTROL_BY_ID_COMPLETE:
      return {
        ...state,
        individual: {
          details: action.payload,
          fetchError: undefined,
        },
      };

    case FETCH_OOB_CONTROL_BY_ID_ERROR:
      return {
        ...state,
        individual: {
          ...state.individual,
          fetchError: action.payload,
        },
      };

    case FETCH_OOB_CONTROL_BY_ID_FAILED:
      return {
        ...state,
        individual: {
          details: "",
          fetchError: action.payload,
        },
      };

    case UPDATE_OOB_CONTROL_COMPLETE:
      return {
        ...state,
        individual: {
          details: action.payload,
          updateError: undefined,
          isControlUpdated: true,
        },
      };

    case UPDATE_OOB_CONTROL_ERROR:
      return {
        ...state,
        individual: {
          ...state.individual,
          updateError: action.payload,
          isControlUpdated: false,
        },
      };

    case UPDATE_OOB_CONTROL_FAILED:
      return {
        ...state,
        individual: {
          ...state.individual,
          updateError: action.payload,
          isControlUpdated: false,
        },
      };

    case RESET_UPDATE_OOB_CONTROL_IS_DONE:
      return {
        ...state,
        individual: {
          ...state.individual,
          updateError: "",
          isControlUpdated: false,
        },
      };
    case SET_DEFAULT_STARTINDEX:
      return {
        ...state,
        reset: true,
      };

    default:
      return { ...state };
  }
};
