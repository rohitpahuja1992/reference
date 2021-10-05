import {
  FETCH_CODEVERSION_COMPLETE,
  FETCH_CODEVERSION_FAILURE,
  ADD_CODEVERSION_COMPLETE,
  ADD_CODEVERSION_ERROR,
  ADD_CODEVERSION_FAILURE,
  DELETE_CODEVERSION_COMPLETE,
  DELETE_CODEVERSION_ERROR,
  DELETE_CODEVERSION_FAILURE,
  UNTERM_CODEVERSION_COMPLETE,
  UNTERM_CODEVERSION_ERROR,
  UNTERM_CODEVERSION_FAILURE,
  UPDATE_CODEVERSION_COMPLETE,
  UPDATE_CODEVERSION_ERROR,
  UPDATE_CODEVERSION_FAILURE,
  RESET_DUPLICATE_ERROR,
} from "../utils/AppConstants";

const initState = {
  codeVersionDetailsList: { 
    list: [],
    totalElements: 0,
    totalPages: 0,
    pageSize: 0,
    startIndex: 0,
    reset: false,
   },
  isCodeVersionAdded: false,
  isCodeVersionDeleted: false,
  isCodeVersionUpdated: false,
  getError: "",
  addError: "",
  putError: "",
};

export const CodeVersionReducer = (state = initState, action) => {
  switch (action.type) {
    case FETCH_CODEVERSION_COMPLETE:
      return {
        ...state,
        codeVersionDetailsList: { 
          list: action.payload.oobComponents,
          totalElements: action.payload.totalElements,
          totalPages: action.payload.totalPages,
          pageSize: action.payload.pageSize,
          startIndex:action.payload.startIndex,
         },
        getError: "",
        addError: "",
        putError: "",
        isCodeVersionAdded: false,
        isCodeVersionDeleted: false,
        isCodeVersionUpdated: false,
      };

    case FETCH_CODEVERSION_FAILURE:
      return {
        ...state,
        codeVersionDetailsList: { list: [] },
        getError: action.payload,
        addError: "",
        putError: "",
        isCodeVersionAdded: false,
        isCodeVersionDeleted: false,
        isCodeVersionUpdated: false,
      };
    case ADD_CODEVERSION_COMPLETE:
      return {
        ...state,
        isCodeVersionAdded: true,
        addError: "",
      };
    case ADD_CODEVERSION_ERROR:
      return {
        ...state,
        isCodeVersionAdded: false,
        addError: action.payload,
      };

    case ADD_CODEVERSION_FAILURE:
      return {
        ...state,
        isCodeVersionAdded: false,
        addError: action.payload,
      };
    case DELETE_CODEVERSION_COMPLETE:
      return {
        ...state,
        isCodeVersionDeleted: true,
      };
    case DELETE_CODEVERSION_ERROR:
      return {
        ...state,
        isCodeVersionDeleted: false,
      };
    case DELETE_CODEVERSION_FAILURE:
      return {
        ...state,
        isCodeVersionDeleted: false,
      };
    case UNTERM_CODEVERSION_COMPLETE:
      return {
        ...state,
        isCodeVersionDeleted: true,
      };
    case UNTERM_CODEVERSION_ERROR:
      return {
        ...state,
        isCodeVersionDeleted: false,
      };
    case UNTERM_CODEVERSION_FAILURE:
      return {
        ...state,
        isCodeVersionDeleted: false,
      };
    case UPDATE_CODEVERSION_COMPLETE:
      return {
        ...state,
        isCodeVersionUpdated: true,
        putError: "",
      };
    case UPDATE_CODEVERSION_ERROR:
      return {
        ...state,
        isCodeVersionUpdated: false,
        putError: action.payload,
      };

    case UPDATE_CODEVERSION_FAILURE:
      return {
        ...state,
        isCodeVersionUpdated: false,
        putError: action.payload,
      };
    case RESET_DUPLICATE_ERROR:
      return {
        ...state,
        isCodeVersionUpdated: false,
        addError: "",
        putError:""
      };
    default:
      return { ...state };
  }
};
