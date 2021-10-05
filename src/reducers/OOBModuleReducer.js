import {
  FETCH_OOBMODULE_COMPLETE,
  FETCH_OOBMODULE_FAILURE,
  FETCH_GLOBALMODULE_COMPLETE,
  FETCH_GLOBALMODULE_FAILURE,
  DELETE_OOBMODULE_COMPLETE,
  DELETE_OOBMODULE_FAILURE,
  FETCH_OOBMODULEBYID_COMPLETE,
  FETCH_OOBMODULEBYID_FAILURE,
  FETCH_DEFAULTVERSION_COMPLETE,
  FETCH_DEFAULTVERSION_FAILURE,
  ADD_OOBMODULE_COMPLETE,
  ADD_OOBMODULE_FAILURE,
  UPDATE_OOBMODULE_COMPLETE,
  UPDATE_OOBMODULE_FAILURE,
  RESET_DEFAULTVERSION,
  RESET_ERROR,
  FETCH_COMPARE_VERSION_COMPLETE,
  FETCH_COMPARE_VERSION_FAILURE,
  RESET_FETCH_COMPARE_VERSION,
  DEFAULT_PAGE_SIZE,
  DEFAULT_START_INDEX,
  SET_DEFAULT_STARTINDEX,
  TERM_OOBMODULE_COMPLETE,
  TERM_OOBMODULE_FAILURE,
  UNTERM_OOBMODULE_COMPLETE,
  UNTERM_OOBMODULE_FAILURE,
  RESET_MODULE_DELETED,
} from "../utils/AppConstants";

const initState = {
  OOBModuleDetailsList: {
    data: [],
    totalElements: "",
    totalPages: "",
  },
  GlobalModuleDetailsList: {
    data: [],
  },
  OOBModuleById: {
    data: "",
    totalElements: 0,
  totalPages: 0,
  pageSize: 0,
  startIndex: 0,
  reset: false,
  },
  defaultVersion: {
    data: "",
  },
  compareVersion: {
    data: "",
    error: "",
  },
  page: {
    startIndex: DEFAULT_START_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
  },
  reset: false,
  getError: "",
  getByIdError: "",
  addError: "",
  putError: "",
  getVersionError: "",
  isModuleAdded: false,
  isModuleUpdated: false,
  isModuleDeleted: false,
};

export const OOBModuleReducer = (state = initState, action) => {
  switch (action.type) {
    case FETCH_OOBMODULE_COMPLETE:
      return {
        ...state,
        OOBModuleDetailsList: {
          data: action.payload.pageInfo.modules,
          totalElements: action.payload.pageInfo.totalElements,
          totalPages: action.payload.pageInfo.totalPages,
        },
        //OOBModuleById: { data: "" },
        getError: "",
        getByIdError: "",
        addError: "",
        putError: "",
        getVersionError: "",
        isModuleAdded: false,
        isModuleUpdated: false,
        isModuleDeleted: false,
        page: {
          startIndex: action.payload.startIndex,
          pageSize: action.payload.pageSize,
        },
        reset: false,
      };

    case FETCH_OOBMODULE_FAILURE:
      return {
        ...state,
        OOBModuleDetailsList: { data: [], totalElements: "", totalPages: "" },
        //OOBModuleById: { data: "" },
        getError: action.payload,
        getVersionError: "",
        addError: "",
        putError: "",
        getByIdError: "",
        isModuleAdded: false,
        isModuleUpdated: false,
        isModuleDeleted: false,
        page: { startIndex: DEFAULT_START_INDEX, pageSize: DEFAULT_PAGE_SIZE },
        reset: false,
      };
    case FETCH_GLOBALMODULE_COMPLETE:
      return {
        ...state,
        GlobalModuleDetailsList: { data: action.payload },
      };
    case FETCH_GLOBALMODULE_FAILURE:
      return {
        ...state,
        GlobalModuleDetailsList: { data: [] },
      };
    case FETCH_OOBMODULEBYID_COMPLETE:
      return {
        ...state,
        OOBModuleById: { 
          data: action.payload.oobComponents,
          totalElements: action.payload.totalElements,
          totalPages: action.payload.totalPages,
          pageSize: action.payload.pageSize,
          startIndex:action.payload.startIndex,
           },
        getByIdError: "",
      };

    case FETCH_OOBMODULEBYID_FAILURE:
      return {
        ...state,
        OOBModuleById: { data: [] },
        getByIdError: action.payload,
      };
    case FETCH_DEFAULTVERSION_COMPLETE:
      return {
        ...state,
        defaultVersion: { data: action.payload },
        getVersionError: "",
      };
    case FETCH_DEFAULTVERSION_FAILURE:
      return {
        ...state,
        defaultVersion: { data: {} },
        getVersionError: action.payload,
      };
    case ADD_OOBMODULE_COMPLETE:
      return {
        ...state,
        isModuleAdded: true,
        addError: "",
      };
    case ADD_OOBMODULE_FAILURE:
      return {
        ...state,
        isModuleAdded: false,
        addError: action.payload,
      };
    case UPDATE_OOBMODULE_COMPLETE:
      return {
        ...state,
        isModuleUpdated: true,
        putError: "",
      };
    case UPDATE_OOBMODULE_FAILURE:
      return {
        ...state,
        isModuleUpdated: false,
        putError: action.payload,
      };
    case DELETE_OOBMODULE_COMPLETE:
      return {
        ...state,
        isModuleDeleted: true,
      };
    case DELETE_OOBMODULE_FAILURE:
      return {
        ...state,
        isModuleDeleted: false,
      };
    case TERM_OOBMODULE_COMPLETE:
      return {
        ...state,
        isModuleTermed: true,
      };
    case TERM_OOBMODULE_FAILURE:
      return {
        ...state,
        isModuleTermed: false,
      };
    case UNTERM_OOBMODULE_COMPLETE:
      return {
        ...state,
        isModuleUnTermed: true,
      };
    case UNTERM_OOBMODULE_FAILURE:
      return {
        ...state,
        isModuleUnTermed: false,
      };
    case RESET_DEFAULTVERSION:
      return {
        ...state,
        defaultVersion: { data: "" },
        getVersionError: "",
        OOBModuleById: { data: "" },
        getByIdError: "",
      };
    case RESET_ERROR:
      return {
        ...state,
        addError: "",
        putError: "",
        isModuleAdded: false,
        isModuleUpdated: false,
      };
    case FETCH_COMPARE_VERSION_COMPLETE:
      return {
        ...state,
        compareVersion: {
          data: action.payload,
          error: "",
        },
      };
    case FETCH_COMPARE_VERSION_FAILURE:
      return {
        ...state,
        compareVersion: {
          data: "",
          error: action.payload,
        },
      };
    case RESET_FETCH_COMPARE_VERSION:
      return {
        ...state,
        compareVersion: {
          data: "",
          error: "",
        },
      };
    case SET_DEFAULT_STARTINDEX:
      return {
        ...state,
        reset: true,
      };
    case RESET_MODULE_DELETED:
      return {
        ...state,
        isModuleTermed: false,
        isModuleUnTermed: false,
      };
    default:
      return { ...state };
  }
};
