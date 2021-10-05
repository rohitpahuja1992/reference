import {
  FETCH_MASTERMODULE_COMPLETE,
  FETCH_MASTERMODULE_FAILURE,
  FETCH_MASTERMODULEBYID_COMPLETE,
  FETCH_MASTERMODULEBYID_FAILURE,
  FETCH_ALLMASTERMODULE_COMPLETE,
  FETCH_ALLMASTERMODULE_FAILURE,
  ADD_MASTERMODULE_COMPLETE,
  ADD_MASTERMODULE_FAILURE,
  ADD_MASTERMODULE_ERROR,
  UPDATE_MASTERMODULE_COMPLETE,
  UPDATE_MASTERMODULE_FAILURE,
  UPDATE_MASTERMODULE_ERROR,
  DELETE_MASTERMODULE_COMPLETE,
  DELETE_MASTERMODULE_FAILURE,
  DELETE_MASTERMODULE_ERROR,
  RESET_DUPLICATE_ERROR,
  RESET_UPDATE_ERROR,
  DEFAULT_START_INDEX, DEFAULT_PAGE_SIZE, SET_DEFAULT_STARTINDEX
} from "../utils/AppConstants";

const initState = {
  moduleDetailsList: {
    list: [],
    totalElements: "",
    totalPages: "",
  },
  allList: [],
  page: {
    startIndex: DEFAULT_START_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
  },
  reset: false,
  moduleDetailsById: {
    data: {},
  },
  isModuleAdded: false,
  isModuleDeleted: false,
  isModuleUpdated: false,
  //getByIdError:"",
  getError: "",
  addError: "",
  putError: "",
};

export const MasterModuleReducer = (state = initState, action) => {
  switch (action.type) {
    case FETCH_MASTERMODULE_COMPLETE:
      return {
        ...state,
        moduleDetailsList: {
          list: action.payload.list,
          totalElements: action.payload.totalElements,
          totalPages: action.payload.totalPages,
        },
        page: {
          startIndex: action.payload.startIndex,
          pageSize: action.payload.pageSize,
        },
        reset: false,
        moduleDetailsById: { data: {} },
        getError: "",
        addError: "",
        putError: "",
        isModuleAdded: false,
        isModuleDeleted: false,
        isModuleUpdated: false,
      };

    case FETCH_MASTERMODULE_FAILURE:
      return {
        ...state,
        moduleDetailsList: { list: [], totalElements: "", totalPages: "" },
        page: {
          startIndex: DEFAULT_START_INDEX,
          pageSize: DEFAULT_PAGE_SIZE,
        },
        reset: false,
        moduleDetailsById: { data: {} },
        getError: action.payload,
        addError: "",
        putError: "",
        isModuleAdded: false,
        isModuleDeleted: false,
        isModuleUpdated: false,
      };

    case FETCH_ALLMASTERMODULE_COMPLETE:
      return {
        ...state,
        allList: action.payload.allList,

      };

    case FETCH_ALLMASTERMODULE_FAILURE:
      return {
        ...state,
         allList: []

      };

    case FETCH_MASTERMODULEBYID_COMPLETE:
      return {
        ...state,
        moduleDetailsById: { data: action.payload },
      };
    case FETCH_MASTERMODULEBYID_FAILURE:
      return {
        ...state,
        moduleDetailsById: { data: {} },
      };
    case ADD_MASTERMODULE_COMPLETE:
      return {
        ...state,
        isModuleAdded: true,
        addError: "",
      };
    case ADD_MASTERMODULE_ERROR:
      return {
        ...state,
        isModuleAdded: false,
        addError: action.payload,
      };

    case ADD_MASTERMODULE_FAILURE:
      return {
        ...state,
        isModuleAdded: false,
        addError: action.payload,
      };
    case UPDATE_MASTERMODULE_COMPLETE:
      return {
        ...state,
        isModuleUpdated: true,
        putError: "",
      };
    case UPDATE_MASTERMODULE_ERROR:
      return {
        ...state,
        isModuleUpdated: false,
        putError: action.payload,
      };

    case UPDATE_MASTERMODULE_FAILURE:
      return {
        ...state,
        isModuleUpdated: false,
        putError: action.payload,
      };
    case DELETE_MASTERMODULE_COMPLETE:
      return {
        ...state,
        isModuleDeleted: true,
      };
    case DELETE_MASTERMODULE_ERROR:
      return {
        ...state,
        isModuleDeleted: false,
      };
    case DELETE_MASTERMODULE_FAILURE:
      return {
        ...state,
        isModuleDeleted: false,
      };
    case RESET_DUPLICATE_ERROR:
      return {
        ...state,
        moduleDetailsById: { data: {} },
        addError: "",
        putError: "",
        isModuleUpdated: false,
        isModuleAdded: false,
        isModuleDeleted: false
      };
    case RESET_UPDATE_ERROR:
      return {
        ...state,
        //moduleDetailsById:{data: {}},
        addError: "",
        putError: "",
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
