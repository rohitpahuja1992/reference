import {
    FETCH_INDICATORS_COMPLETE,
    FETCH_INDICATORS_FAILURE,
    FETCH_INDICATORS_ERROR,
    ADD_INDICATORS_COMPLETE,
    //ADD_INDICATORS_FAILURE,
    ADD_INDICATORS_ERROR,
    DELETE_INDICATORS_COMPLETE,
    //DELETE_INDICATORS_ERROR,
    DELETE_INDICATORS_FAILURE,
    UPDATE_INDICATORS_COMPLETE,
    UPDATE_INDICATORS_FAILURE,
    UPDATE_INDICATORS_ERROR,
  
    FETCH_INDIVIDUAL_INDICATORS_COMPLETE,
    FETCH_INDIVIDUAL_INDICATORS_ERROR,
    FETCH_INDIVIDUAL_INDICATORS_FAILURE,
    FETCH_INDICATORBYID_COMPLETE,
    FETCH_INDICATORBYID_FAILURE,
    
    DEFAULT_START_INDEX,
    DEFAULT_PAGE_SIZE,
    SET_DEFAULT_STARTINDEX
  } from "../utils/LettersAppConstant";

  import {
    RESET_DUPLICATE_ERROR,
    RESET_UPDATE_ERROR,
    RESET_ADD_TAG_ERROR,
    RESET_ADD_TAG_IS_DONE,
  } from "../utils/AppConstants";
  
  const initState = {
    data: {
        list: [],
        totalElements: "",
        totalPages: "",
        isTagAdded: false,
        isTagDeleted: false,
        isPropertyDeleted: false,
        getError: "",
        addError: "",
        error: "",
        isTagUpdated: false,
        updateError: "",
        isFieldAdded: false,
        fieldAddError: "",
      },
    page: {
      startIndex: DEFAULT_START_INDEX,
      pageSize: DEFAULT_PAGE_SIZE,
    },
    reset: false,
    individual: {
      details: "",
      error: "",
    },
  };
  
  export const TagReducer = (state = initState, action) => {
    switch (action.type) {
      case FETCH_INDICATORS_COMPLETE:
        return {
          ...state,
          data: {
            list: action.payload.filesInfo,
            totalElements: action.payload.pageInfo.totalElements,
            totalPages: action.payload.pageInfo.totalPages,
            isControlDeleted: false,
            getError: "",
            addError: "",
            error: undefined,
          },
          page: {
            startIndex: action.payload.startIndex,
            pageSize: action.payload.pageSize,
          },
          reset: false,
        };

      case FETCH_INDICATORS_ERROR:
        return {
          ...state,
          data: {
            list: [],
            totalElements: "",
            totalPages: "",
            getError: action.payload,
            addError: "",
            error: action.payload,
          },
          page: {
            startIndex: DEFAULT_START_INDEX,
            pageSize: DEFAULT_PAGE_SIZE,
          },
          reset: false,
        };

      case FETCH_INDICATORS_FAILURE:
        return {
          ...state,
          data: {
            list: [],
            totalElements: "",
            totalPages: "",
            getError: action.payload,
            addError: "",
            error: action.payload,
          },
          page: {
            startIndex: DEFAULT_START_INDEX,
            pageSize: DEFAULT_PAGE_SIZE,
          },
          reset: false,
        };

      case ADD_INDICATORS_COMPLETE:
        return {
          ...state,
          data: {
            ...state.data,
            isTagAdded: true,
            addError: "",
            error: undefined,
          },
        };

      case ADD_INDICATORS_ERROR:
        return {
          ...state,
          data: {
            ...state.data,
            addError: action.payload,
            error: action.payload,
          },
        };

      case DELETE_INDICATORS_COMPLETE:
        return {
          ...state,
          data: {
            ...state.data,
            isTagDeleted: true,
          },
        };

      case DELETE_INDICATORS_FAILURE:
        return {
          ...state,
          data: {
            ...state.data,
            isTagDeleted: false,
          },
        };

        case RESET_ADD_TAG_ERROR:
          return {
            ...state,
            data: { ...state.data, addError: "", error: undefined },
          };

        case RESET_ADD_TAG_IS_DONE:
          return {
            ...state,
            data: { ...state.data, isControlAdded: false },
          };

      case FETCH_INDIVIDUAL_INDICATORS_COMPLETE:
        return {
          ...state,
          data: {
            ...state.data,
            isPropertyDeleted: false,
          },
          individual: {
            details: action.payload,
            error: undefined,
          },
        };

      case FETCH_INDIVIDUAL_INDICATORS_ERROR:
        return {
          ...state,
          individual: {
            ...state.individual,
            error: action.payload,
          },
        };

      case FETCH_INDIVIDUAL_INDICATORS_FAILURE:
        return {
          ...state,
          individual: {
            details: "",
            error: action.payload,
          },
        };

      case UPDATE_INDICATORS_COMPLETE:
        return {
            ...state,
            data: {
                ...state.data,
                isTagUpdated: true,
            },           
            putError: "",
          };

      case UPDATE_INDICATORS_ERROR:
        return {
            ...state,
            data: {
                ...state.data,
                isTagUpdated: false,
            },   
            putError: action.payload,
          };

      case UPDATE_INDICATORS_FAILURE:
        return {
            ...state,
            data: {
                ...state.data,
                isTagUpdated: false,
            }, 
            putError: action.payload,
          };

      //   case RESET_UPDATE_INDICATORS_ERROR:
      //     return {
      //       ...state,
      //       data: { ...state.data, updateError: undefined },
      //     };

      //   case RESET_UPDATE_INDICATORS_IS_DONE:
      //     return {
      //       ...state,
      //       data: { ...state.data, isControlUpdated: false },
      //     };
      case FETCH_INDICATORBYID_COMPLETE:
        return {
          ...state,
          tagDetailsById: action.payload,
        };
      case FETCH_INDICATORBYID_FAILURE:
        return {
          ...state,
          tagDetailsById: { data: {} },
        };
      case SET_DEFAULT_STARTINDEX:
        return {
          ...state,
          reset: true,
        };
      case RESET_DUPLICATE_ERROR:
        return {
          ...state,
          tagDetailsById: { data: {} },
          addError: "",
          putError: "",
          isTagAdded: false,
          isTagDeleted: false,
          isTagUpdated: false,
        };
      case RESET_UPDATE_ERROR:
        return {
          ...state,
          addError: "",
          putError: "",
        };
      default:
        return { ...state };
    }
  };
  