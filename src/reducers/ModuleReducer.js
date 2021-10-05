import {
  FETCH_MODULE_COMPLETE,
  FETCH_MODULE_FAILURE,
  ADD_MODULE_COMPLETE,
  ADD_MODULE_FAILURE,
  ADD_MODULE_ERROR,
  DELETE_MODULE_COMPLETE,
  DELETE_MODULE_FAILURE,
  DELETE_MODULE_ERROR,
  UPDATE_MODULE_COMPLETE,
  UPDATE_MODULE_FAILURE,
  UPDATE_MODULE_ERROR,
  UPDATE_MODULE_DIALOG,
  RESET_DUPLICATE_ERROR,
} from "../utils/AppConstants";

const initState = {
  moduleDetailsList: {
    list: [],
  },
  isModuleAdded: false,
  isModuleDeleted: false,
  isModuleUpdated: false,
  getError: "",
  addError: "",
  putError: "",
};

export const ModuleReducer = (state = initState, action) => {
  switch (action.type) {
    case FETCH_MODULE_COMPLETE:
      return {
        ...state,
        moduleDetailsList: { list: [...action.payload] },
        getError: "",
        addError: "",
        putError: "",
        isModuleAdded: false,
        isModuleDeleted: false,
        isModuleUpdated: false,
      };

    case FETCH_MODULE_FAILURE:
      return {
        ...state,
        moduleDetailsList: { list: [] },
        getError: action.payload,
        addError: "",
        putError: "",
        isModuleAdded: false,
        isModuleDeleted: false,
        isModuleUpdated: false,
      };
    case ADD_MODULE_COMPLETE:
      return {
        ...state,
        isModuleAdded: true,
        addError: "",
      };
    case ADD_MODULE_ERROR:
      return {
        ...state,
        isModuleAdded: false,
        addError: action.payload,
      };

    case ADD_MODULE_FAILURE:
      return {
        ...state,
        isModuleAdded: false,
        addError: action.payload,
      };
    case DELETE_MODULE_COMPLETE:
      return {
        ...state,
        isModuleDeleted: true,
      };
    case DELETE_MODULE_ERROR:
      return {
        ...state,
        isModuleDeleted: false,
      };

    case DELETE_MODULE_FAILURE:
      return {
        ...state,
        isModuleDeleted: false,
      };
    case UPDATE_MODULE_COMPLETE:
      return {
        ...state,
        isModuleUpdated: true,
        putError: "",
        //updated: true,
      };
    case UPDATE_MODULE_ERROR:
      return {
        ...state,
        isModuleUpdated: false,
        putError: action.payload,
      };

    case UPDATE_MODULE_FAILURE:
      return {
        ...state,
        isModuleUpdated: false,
        putError: action.payload,
      };
    case UPDATE_MODULE_DIALOG:
      return {
        ...state,
        moduleDetailsList: { list: [...state.moduleDetailsList.list] },
        isModuleUpdated: action.payload,
        putError: "",
      };
    case RESET_DUPLICATE_ERROR:
      return {
        ...state,
        addError: "",
        putError: "",
      };
    default:
      return { ...state };
  }
};
