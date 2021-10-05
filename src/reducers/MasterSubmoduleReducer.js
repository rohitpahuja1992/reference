import {
  FETCH_MASTERSUBMODULE_COMPLETE,
  FETCH_MASTERSUBMODULE_FAILURE,
  FETCH_MASTERSUBMODULEBYID_COMPLETE,
  FETCH_MASTERSUBMODULEBYID_FAILURE,
  ADD_MASTERSUBMODULE_COMPLETE,
  ADD_MASTERSUBMODULE_FAILURE,
  ADD_MASTERSUBMODULE_ERROR,
  UPDATE_MASTERSUBMODULE_COMPLETE,
  UPDATE_MASTERSUBMODULE_FAILURE,
  UPDATE_MASTERSUBMODULE_ERROR,
  DELETE_MASTERSUBMODULE_COMPLETE,
  DELETE_MASTERSUBMODULE_FAILURE,
  DELETE_MASTERSUBMODULE_ERROR,
  FETCH_MASTERCOMPONENTBYMODULE_COMPLETE,
  FETCH_MASTERCOMPONENTBYMODULE_FAILURE,
  RESET_DUPLICATE_ERROR,
  RESET_UPDATE_ERROR,
  DEFAULT_START_INDEX,
  DEFAULT_PAGE_SIZE,
  SET_DEFAULT_STARTINDEX,
} from "../utils/AppConstants";

const initState = {
  submoduleDetailsList: {
    list: [],
    totalElements: "",
    totalPages: "",
  },
  reset: false,
  page: {
    startIndex: DEFAULT_START_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
  },
  submoduleDetailsById: {
    data: {},
  },
  isSubmoduleAdded: false,
  isSubmoduleDeleted: false,
  isSubmoduleUpdated: false,
  //getByIdError:"",
  getError: "",
  addError: "",
  putError: "",
  componentByModule: [],
};

export const MasterSubmoduleReducer = (state = initState, action) => {
  switch (action.type) {
    case FETCH_MASTERSUBMODULE_COMPLETE:
      return {
        ...state,
        submoduleDetailsList: {
          list: action.payload.pageInfo.components,
          totalElements: action.payload.pageInfo.totalElements,
          totalPages: action.payload.pageInfo.totalPages,
        },
        page: {
          startIndex: action.payload.startIndex,
          pageSize: action.payload.pageSize,
        },
        reset: false,
        submoduleDetailsById: { data: {} },
        getError: "",
        addError: "",
        putError: "",
        isSubmoduleAdded: false,
        isSubmoduleDeleted: false,
        isSubmoduleUpdated: false,
      };

    case FETCH_MASTERSUBMODULE_FAILURE:
      return {
        ...state,
        submoduleDetailsList: { list: [], totalElements: "", totalPages: "" },
        page: {
          startIndex: DEFAULT_START_INDEX,
          pageSize: DEFAULT_PAGE_SIZE,
        },
        reset: false,
        submoduleDetailsById: { data: {} },
        getError: action.payload,
        addError: "",
        putError: "",
        isSubmoduleAdded: false,
        isSubmoduleDeleted: false,
        isSubmoduleUpdated: false,
      };
    case FETCH_MASTERSUBMODULEBYID_COMPLETE:
      return {
        ...state,
        submoduleDetailsById: { data: action.payload },
      };
    case FETCH_MASTERSUBMODULEBYID_FAILURE:
      return {
        ...state,
        submoduleDetailsById: { data: {} },
      };
    case ADD_MASTERSUBMODULE_COMPLETE:
      return {
        ...state,
        isSubmoduleAdded: true,
        addError: "",
      };
    case ADD_MASTERSUBMODULE_ERROR:
      return {
        ...state,
        isSubmoduleAdded: false,
        addError: action.payload,
      };

    case ADD_MASTERSUBMODULE_FAILURE:
      return {
        ...state,
        isSubmoduleAdded: false,
        addError: action.payload,
      };
    case UPDATE_MASTERSUBMODULE_COMPLETE:
      return {
        ...state,
        isSubmoduleUpdated: true,
        putError: "",
      };
    case UPDATE_MASTERSUBMODULE_ERROR:
      return {
        ...state,
        isSubmoduleUpdated: false,
        putError: action.payload,
      };

    case UPDATE_MASTERSUBMODULE_FAILURE:
      return {
        ...state,
        isSubmoduleUpdated: false,
        putError: action.payload,
      };
    case DELETE_MASTERSUBMODULE_COMPLETE:
      return {
        ...state,
        isSubmoduleDeleted: true,
      };
    case DELETE_MASTERSUBMODULE_ERROR:
      return {
        ...state,
        isSubmoduleDeleted: false,
      };
    case DELETE_MASTERSUBMODULE_FAILURE:
      return {
        ...state,
        isSubmoduleDeleted: false,
      };
    case RESET_DUPLICATE_ERROR:
      return {
        ...state,
        submoduleDetailsById: { data: {} },
        addError: "",
        putError: "",
        isSubmoduleAdded: false,
        isSubmoduleDeleted: false,
        isSubmoduleUpdated: false,
      };
    case RESET_UPDATE_ERROR:
      return {
        ...state,
        //submoduleDetailsById:{data: {}},
        addError: "",
        putError: "",
      };
    case SET_DEFAULT_STARTINDEX:
      return {
        ...state,
        reset: true,
      };
    case FETCH_MASTERCOMPONENTBYMODULE_COMPLETE:
      return {
        ...state,
        componentByModule: action.payload,
      };
    case FETCH_MASTERCOMPONENTBYMODULE_FAILURE:
      return {
        ...state,
        componentByModule: [],
      };
    default:
      return { ...state };
  }
};
