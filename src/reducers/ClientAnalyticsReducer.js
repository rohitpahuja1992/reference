import {
  FETCH_CLIENT_ALL_MODULE_ANALYTICS_COMPLETE,
  FETCH_CLIENT_ALL_MODULE_ANALYTICS_FAILURE,
  FETCH_CLIENT_OOB_MODULE_ANALYTICS_COMPLETE,
  FETCH_CLIENT_OOB_MODULE_ANALYTICS_FAILURE,
  FETCH_CLIENT_GLOBAL_MODULE_ANALYTICS_COMPLETE,
  FETCH_CLIENT_GLOBAL_MODULE_ANALYTICS_FAILURE,
  FETCH_CLIENT_SINGLE_MODULE_ANALYTICS_COMPLETE,
  FETCH_CLIENT_SINGLE_MODULE_ANALYTICS_FAILURE,
  FETCH_CLIENT_SINGLE_MODULE_ANALYTICS_COMPLETE_BYFLAG,
  FETCH_CLIENT_SINGLE_MODULE_ANALYTICS_FAILURE_BYFLAG,
} from "../utils/AppConstants";

const initState = {
  AllModuleAnalytics: {
    data: "",
    error: "",
  },
  OobModuleAnalytics: {
    data: "",
    error: "",
  },
  GlobalModuleAnalytics: {
    data: "",
    error: "",
  },
  SingleModuleAnalytics: {
    data: "",
    error: "",
  },
  SingleModuleAnalyticByFlag: {
    data: "",
    error: "",
  },  
};

export const ClientAnalyticsReducer = (state = initState, action) => {
  switch (action.type) {
    case FETCH_CLIENT_ALL_MODULE_ANALYTICS_COMPLETE:
      return {
        ...state,
        AllModuleAnalytics: { data: action.payload, error: "" },
      };
    case FETCH_CLIENT_ALL_MODULE_ANALYTICS_FAILURE:
      return {
        ...state,
        AllModuleAnalytics: { data: "", error: action.payload },
      };

    case FETCH_CLIENT_OOB_MODULE_ANALYTICS_COMPLETE:
      return {
        ...state,
        OobModuleAnalytics: { data: action.payload, error: "" },
      };
    case FETCH_CLIENT_OOB_MODULE_ANALYTICS_FAILURE:
      return {
        ...state,
        OobModuleAnalytics: { data: "", error: action.payload },
      };

    case FETCH_CLIENT_GLOBAL_MODULE_ANALYTICS_COMPLETE:
      return {
        ...state,
        GlobalModuleAnalytics: { data: action.payload, error: "" },
      };
    case FETCH_CLIENT_GLOBAL_MODULE_ANALYTICS_FAILURE:
      return {
        ...state,
        GlobalModuleAnalytics: { data: "", error: action.payload },
      };
      case FETCH_CLIENT_SINGLE_MODULE_ANALYTICS_COMPLETE_BYFLAG:
      return {
        ...state,
        SingleModuleAnalyticByFlag: { data: action.payload, error: "" },
      };
    case FETCH_CLIENT_SINGLE_MODULE_ANALYTICS_FAILURE_BYFLAG:
      return {
        ...state,
        SingleModuleAnalyticByFlag: { data: "", error: action.payload },
      };

    case FETCH_CLIENT_SINGLE_MODULE_ANALYTICS_COMPLETE:
      return {
        ...state,
        SingleModuleAnalytics: { data: action.payload, error: "" },
      };
    case FETCH_CLIENT_SINGLE_MODULE_ANALYTICS_FAILURE:
      return {
        ...state,
        SingleModuleAnalytics: { data: "", error: action.payload },
      };

    default:
      return { ...state };
  }
};
