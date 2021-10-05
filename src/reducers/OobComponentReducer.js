import {
  FETCH_OOB_COMPONENT_COMPLETE,
  FETCH_OOB_COMPONENT_ERROR,
  FETCH_OOB_COMPONENT_FAILED,
  ADD_OOB_COMPONENT_COMPLETE,
  ADD_OOB_COMPONENT_ERROR,
  DELETE_OOBCOMPONENT_COMPLETE,
  DELETE_OOBCOMPONENT_FAILURE,
  ADD_OOB_COMPONENT_FAILED,
  RESET_OOB_COMPONENT_ERROR,
  RESET_ADD_OOB_COMPONENT_IS_DONE,
  FETCH_OOB_COMPONENT_BY_ID_COMPLETE,
  FETCH_OOB_COMPONENT_BY_ID_ERROR,
  FETCH_OOB_COMPONENT_BY_ID_FAILED,
  UPDATE_OOB_COMPONENT_COMPLETE,
  UPDATE_OOB_COMPONENT_ERROR,
  UPDATE_OOB_COMPONENT_FAILED,
  RESET_UPDATE_OOB_COMPONENT_IS_DONE,
  DEFAULT_START_INDEX,
  DEFAULT_PAGE_SIZE,
  SET_DEFAULT_STARTINDEX,
  RESET_OOB_DUPLICATE_ERROR,
  FETCH_OOB_CONFIG_COMPONENT_BY_ID_COMPLETE,
  FETCH_OOB_CONFIG_COMPONENT_BY_ID_ERROR,
  FETCH_OOB_CONFIG_COMPONENT_BY_ID_FAILED
} from "../utils/AppConstants";

const initState = {
  data: {
    list: [],
    totalElements: "",
    totalPages: "",
    isComponentAdded: false,
    addError: "",
    error: "",
    isComponentUpdated:false,
    isComponentDeleted: false,
    updateError: "",
    oobSubmoduleId: ""
  },
  page: {
    startIndex: DEFAULT_START_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
  },
  reset: false,
  individual: {
    details: "",
    configDetails:"",
    fetchError: "",
    updateError: "",
  },
};

export const OobComponentReducer = (state = initState, action) => {
  switch (action.type) {
    case FETCH_OOB_COMPONENT_COMPLETE:
      return {
        ...state,
        data: {
          ...state.data,
          list: action.payload.data,
          totalElements: action.payload.totalElements,
          totalPages: action.payload.totalPages,
          error: undefined,
          addError: "",
          isComponentDeleted: false,
          isComponentAdded: false,
          oobSubmoduleId: action.payload.oobSubmoduleId
        },
        page: {
          startIndex: action.payload.startIndex,
          pageSize: action.payload.pageSize,
        },
        reset: false,
      };

    case FETCH_OOB_COMPONENT_ERROR:
      return {
        ...state,
        data: {
          ...state.data,
          list: [],
          totalElements: "",
          totalPages: "",
          error: action.payload,
          addError: "",
          isComponentDeleted: false,
          isComponentAdded: false,
        },
        page: { startIndex: DEFAULT_START_INDEX, pageSize: DEFAULT_PAGE_SIZE },
        reset: false,
      };

    case FETCH_OOB_COMPONENT_FAILED:
      return {
        ...state,
        data: {
          ...state.data,
          list: [],
          totalElements: "",
          totalPages: "",
          error: action.payload,
          addError: "",
          isComponentDeleted: false,
          isComponentAdded: false,
        },
        page: { startIndex: DEFAULT_START_INDEX, pageSize: DEFAULT_PAGE_SIZE },
        reset: false,
      };
    case DELETE_OOBCOMPONENT_COMPLETE:
      return {
        ...state,
        data: {
          ...state.data,
          isComponentDeleted: true,
        },
      };

    case DELETE_OOBCOMPONENT_FAILURE:
      return {
        ...state,
        data: {
          ...state.data,
          isComponentDeleted: false,
        },
      };
      case RESET_OOB_DUPLICATE_ERROR:
        return {
          ...state,
          data: {
            ...state.data,
            addError: "",
            updateError: "",
            isComponentAdded: false,
            error: undefined,
          }
        };
    case ADD_OOB_COMPONENT_COMPLETE:
      return {
        ...state,
        data: {
          ...state.data,
          addError: "",
          isComponentAdded: true,
          error: undefined,
        },
      };

    case ADD_OOB_COMPONENT_ERROR:
      return {
        ...state,
        data: {
          ...state.data,
          addError: action.payload,
          isComponentAdded: false,
        },
      };

    case ADD_OOB_COMPONENT_FAILED:
      return {
        ...state,
        data: {
          ...state.data,
          addError: action.payload,
          isComponentAdded: false,
        },
      };

    case RESET_OOB_COMPONENT_ERROR:
      return {
        ...state,
        data: { ...state.data, error: undefined },
      };

    case RESET_ADD_OOB_COMPONENT_IS_DONE:
      return {
        ...state,
        data: { ...state.data, addError: "", isComponentAdded: false },
      };

    // case RESET_OOB_CONTROL_IS_FETCH_DONE:
    //   return {
    //     ...state,
    //     data: { ...state.data, isFetchDone: false },
    //   };

    case FETCH_OOB_COMPONENT_BY_ID_COMPLETE:
      return {
        ...state,
        individual: {
          details: action.payload.data,
          fetchError: undefined,
        },
      };


    case FETCH_OOB_COMPONENT_BY_ID_ERROR:
      return {
        ...state,
        individual: {
          ...state.individual,
          fetchError: action.payload,
        },
      };

    case FETCH_OOB_COMPONENT_BY_ID_FAILED:
      return {
        ...state,
        individual: {
          details: "",
          fetchError: action.payload,
        },
      };

      
      case FETCH_OOB_CONFIG_COMPONENT_BY_ID_COMPLETE:
      return {
        ...state,
        individual: {
          configDetails: action.payload.data,
          fetchError: undefined,
        },
      };

      case FETCH_OOB_CONFIG_COMPONENT_BY_ID_ERROR:
        return {
          ...state,
          individual: {
            ...state.individual,
            fetchError: action.payload,
          },
        };
  
      case FETCH_OOB_CONFIG_COMPONENT_BY_ID_FAILED:
        return {
          ...state,
          individual: {
            configDetails: "",
            fetchError: action.payload,
          },
        };
  

    case UPDATE_OOB_COMPONENT_COMPLETE:
      return {
        ...state,
        data: {
          ...state.data,
          // details: action.payload,
          updateError: undefined,
          isComponentUpdated: true,
        },
      };

    case UPDATE_OOB_COMPONENT_ERROR:
      return {
        ...state,
        data: {
          ...state.data,
          updateError: action.payload,
          isComponentUpdated: false,
        },
      };

    case UPDATE_OOB_COMPONENT_FAILED:
      return {
        ...state,
        data: {
          ...state.data,
          updateError: action.payload,
          isComponentUpdated: false,
        },
      };

    case RESET_UPDATE_OOB_COMPONENT_IS_DONE:
      return {
        ...state,
        data: {
          ...state.data,
          updateError: "",
          isComponentUpdated: false,
        },
        individual: {
          details: "",
          fetchError: action.payload,
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
