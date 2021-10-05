import {
  FETCH_NEW_CONFIG_COMPLETE,
  FETCH_NEW_CONFIG_ERROR,
  FETCH_NEW_CONFIG_FAILURE,
  ADD_NEW_CONFIG_COMPLETE,
  ADD_NEW_CONFIG_ERROR,
  ADD_NEW_CONFIG_FAILURE,
  UPDATE_DEPLOYED_BIT
} from "../utils/AppConstants";

const initState = {
  list: [],
  isDeployed: false,
  deployedStatusList: {},
  addError: ''
};

export const NewConfigReducer = (state = initState, action) => {
  switch (action.type) {
    case FETCH_NEW_CONFIG_COMPLETE:
      return {
        ...state,
        list: action.payload
      };
    case FETCH_NEW_CONFIG_ERROR:
      return {
        ...state
      };
    case FETCH_NEW_CONFIG_FAILURE:
      return {
        ...state
      };
      case ADD_NEW_CONFIG_COMPLETE:
        return {
          ...state,
          isDeployed: true,
          deployedStatusList: action.payload,
          addError: "",
        };
      case ADD_NEW_CONFIG_ERROR:
        return {
          ...state,
          isDeployed: false,
          deployedStatusList: {},
          addError: action.payload,
        };
  
      case ADD_NEW_CONFIG_FAILURE:
        return {
          ...state,
          isDeployed: false,
          deployedStatusList: {},
          addError: action.payload,
        };
      case UPDATE_DEPLOYED_BIT:
        return {
          ...state,
          isDeployed: false,
        };
    default:
      return { ...state };
  }
};
