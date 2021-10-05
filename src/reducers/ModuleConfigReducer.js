import {
  FETCH_CONFIG_NAMELIST_COMPLETE,
  FETCH_CONFIG_NAMELIST_FAILURE,
  FETCH_CONFIG_MODULEBYID_COMPLETE,
  FETCH_CONFIG_MODULEBYID_FAILURE,
  FETCH_CONFIG_TABLEFIELD_COMPLETE,
  FETCH_CONFIG_TABLEFIELD_FAILURE,
} from "../utils/AppConstants";

const initState = {
  configModuleList: [],
  getError: "",
  configModuleByIdList: [],
  getByIdError: "",
  configTableNameList: [],
  getTableNameError: "",
};

export const ModuleConfigReducer = (state = initState, action) => {
  switch (action.type) {
    case FETCH_CONFIG_NAMELIST_COMPLETE:
      return {
        ...state,
        configModuleList: action.payload,
        getError: "",
      };

    case FETCH_CONFIG_NAMELIST_FAILURE:
      return {
        ...state,
        configModuleList: [],
        getError: action.payload,
      };
    case FETCH_CONFIG_MODULEBYID_COMPLETE:
      return {
        ...state,
        configModuleByIdList: action.payload,
        getByIdError: "",
      };

    case FETCH_CONFIG_MODULEBYID_FAILURE:
      return {
        ...state,
        configModuleByIdList: [],
        getByIdError: action.payload,
      };
    case FETCH_CONFIG_TABLEFIELD_COMPLETE:
      return {
        ...state,
        configTableNameList: action.payload,
        getTableNameError: "",
      };

    case FETCH_CONFIG_TABLEFIELD_FAILURE:
      return {
        ...state,
        configTableNameList: [],
        getTableNameError: action.payload,
      };
    default:
      return { ...state };
  }
};
