import {
  FETCH_OOBSUBMODULEBYOOBMODULEID_COMPLETE,
  FETCH_OOBSUBMODULEBYOOBMODULEID_FAILURE,
  DELETE_OOBSUBMODULE_COMPLETE,
  DELETE_OOBSUBMODULE_FAILURE,
  RESET_SUBMODULE,
  // FETCH_OOB_SUBMODULE_COMPLETE,
  // FETCH_OOB_SUBMODULE_FAILURE,
  ADD_OOB_SUBMODULE_COMPLETE,
  ADD_OOB_SUBMODULE_FAILURE,
  RESET_DUPLICATE_ERROR,
  FETCH_OOB_SUBMODULE_BY_ID_COMPLETE,
  FETCH_OOB_SUBMODULE_BY_ID_FAILURE,
  DEFAULT_START_INDEX,
  DEFAULT_PAGE_SIZE,
  SET_DEFAULT_STARTINDEX,
} from "../utils/AppConstants";

const initState = {
  getSubmodules: {
    data: [],
    totalElements: "",
    totalPages: "",
  },
  page: {
    startIndex: DEFAULT_START_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
    moduleId: ''
  },
  reset: false,
  OobSubmoduleById: {
    data: {},
    error: "",
  },
  getError: "",
  addError: "",
  isSubmoduleAdded: false,
  isSubmoduleDeleted: false,
};

export const OOBSubmoduleReducer = (state = initState, action) => {
  switch (action.type) {
    case FETCH_OOBSUBMODULEBYOOBMODULEID_COMPLETE:
      return {
        ...state,
        getSubmodules: {
          data: action.payload.pageInfo.oobComponents,
          totalElements: action.payload.pageInfo.totalElements,
          totalPages: action.payload.pageInfo.totalPages,
        },
        getError: "",
        addError: "",
        isSubmoduleAdded: false,
        isSubmoduleDeleted: false,
        page: {
          startIndex: action.payload.startIndex,
          pageSize: action.payload.pageSize,
          moduleId: action.payload.moduleId
        },
        reset: false,
      };

    case FETCH_OOBSUBMODULEBYOOBMODULEID_FAILURE:
      return {
        ...state,
        getSubmodules: { data: [], totalElements: "", totalPages: "" },
        getError: action.payload,
        addError: "",
        isSubmoduleAdded: false,
        isSubmoduleDeleted: false,
        page: { startIndex: DEFAULT_START_INDEX, pageSize: DEFAULT_PAGE_SIZE, moduleId: '' },
        reset: false,
      };
    case ADD_OOB_SUBMODULE_COMPLETE:
      return {
        ...state,
        isSubmoduleAdded: true,
        addError: "",
      };
    case ADD_OOB_SUBMODULE_FAILURE:
      return {
        ...state,
        isSubmoduleAdded: false,
        addError: action.payload,
      };
    case DELETE_OOBSUBMODULE_COMPLETE:
      return {
        ...state,
        isSubmoduleDeleted: true,
      };
    case DELETE_OOBSUBMODULE_FAILURE:
      return {
        ...state,
        isSubmoduleDeleted: false,
      };
    case RESET_DUPLICATE_ERROR:
      return {
        ...state,
        addError: "",
        getError: "",
        isSubmoduleAdded: false,
      };

    case FETCH_OOB_SUBMODULE_BY_ID_COMPLETE:
      return {
        ...state,
        OobSubmoduleById: {
          data: action.payload,
          error: "",
        },
      };

    case FETCH_OOB_SUBMODULE_BY_ID_FAILURE:
      return {
        ...state,
        OobSubmoduleById: {
          ...state.OobSubmoduleById,
          error: action.payload,
        },
      };
    case SET_DEFAULT_STARTINDEX:
      return {
        ...state,
        reset: true,
      };
    case RESET_SUBMODULE:
      return {
        getSubmodules: {
          data: [],
          totalElements: "",
          totalPages: "",
        },
        page: {
          startIndex: DEFAULT_START_INDEX,
          pageSize: DEFAULT_PAGE_SIZE,
          moduleId: ''
        },
        reset: false,
        OobSubmoduleById: {
          data: {},
          error: "",
        },
        getError: "",
        addError: "",
        isSubmoduleAdded: false,
        isSubmoduleDeleted: false,
      };

    default:
      return { ...state };
  }
};
