import {
  FETCH_COMPANY_LIST_SUCCESS,
  FETCH_COMPANY_LIST_FAILURE,
  FETCH_BUSINESS_LINE_SUCCESS,
  FETCH_BUSINESS_LINE_FAILURE,
  FETCH_ELIGIBILITY_PLAN_SUCCESS,
  FETCH_ELIGIBILITY_PLAN_FAILURE,
  FETCH_ELIGIBILITY_GROUP_SUCCESS,
  FETCH_ELIGIBILITY_GROUP_FAILURE,
  DELETE_HIERARCHYBYID_COMPLETE,
  DELETE_HIERARCHYBYID_ERROR,
  DELETE_HIERARCHYBYID_FAILURE,
  UPLOAD_HIERARCHYBYID_COMPLETE,
  UPLOAD_HIERARCHYBYID_ERROR,
  UPLOAD_HIERARCHYBYID_FAILURE,
  RESET_HIERARCHY_ERROR,
  RESET_HIERARCHY_DETAILS,
} from "../utils/AppConstants";
const initState = {
  companyList: {
    list: [],
    error: "",
  },
  businessLineList: {
    list: [],
    error: "",
  },
  eligibilityPlanList: {
    list: [],
    error: "",
  },
  eligibilityGroupList: {
    list: [],
    error: "",
  },
  deleteHierarchy: {
    isDone: false,
    error: "",
  },
  uploadHierarchy: {
    isDone: false,
    error: "",
  },
};

export const ClientHierarchyReducer = (state = initState, action) => {
  switch (action.type) {
    case FETCH_COMPANY_LIST_SUCCESS:
      return {
        ...state,
        companyList: { list: [...action.payload], error: "" },
        deleteHierarchy: {
          isDone: false,
          error: "",
        },
        uploadHierarchy: {
          isDone: false,
          error: "",
        },
      };
    case FETCH_COMPANY_LIST_FAILURE:
      return {
        ...state,
        companyList: { list: [], error: action.payload },
        deleteHierarchy: {
          isDone: false,
          error: "",
        },
        uploadHierarchy: {
          isDone: false,
          error: "",
        },
      };
    case FETCH_BUSINESS_LINE_SUCCESS:
      return {
        ...state,
        businessLineList: { list: [...action.payload], error: "" },
      };
    case FETCH_BUSINESS_LINE_FAILURE:
      return {
        ...state,
        businessLineList: { list: [], error: action.payload },
      };
    case FETCH_ELIGIBILITY_PLAN_SUCCESS:
      return {
        ...state,
        eligibilityPlanList: { list: [...action.payload], error: "" },
      };
    case FETCH_ELIGIBILITY_PLAN_FAILURE:
      return {
        ...state,
        eligibilityPlanList: { list: [], error: action.payload },
      };
    case FETCH_ELIGIBILITY_GROUP_SUCCESS:
      return {
        ...state,
        eligibilityGroupList: { list: [...action.payload], error: "" },
      };
    case FETCH_ELIGIBILITY_GROUP_FAILURE:
      return {
        ...state,
        eligibilityGroupList: { list: [], error: action.payload },
      };
    case DELETE_HIERARCHYBYID_COMPLETE:
      return {
        ...state,
        deleteHierarchy: {
          isDone: true,
          error: "",
        },
      };
    case DELETE_HIERARCHYBYID_ERROR:
      return {
        ...state,
        deleteHierarchy: {
          isDone: false,
          error: action.payload,
        },
      };
    case DELETE_HIERARCHYBYID_FAILURE:
      return {
        ...state,
        deleteHierarchy: {
          isDone: false,
          error: action.payload,
        },
      };
    case UPLOAD_HIERARCHYBYID_COMPLETE:
      return {
        ...state,
        uploadHierarchy: {
          isDone: true,
          error: "",
        },
      };
    case UPLOAD_HIERARCHYBYID_ERROR:
      return {
        ...state,
        uploadHierarchy: {
          isDone: false,
          error: action.payload,
        },
      };
    case UPLOAD_HIERARCHYBYID_FAILURE:
      return {
        ...state,
        uploadHierarchy: {
          isDone: false,
          error: action.payload,
        },
      };
    case RESET_HIERARCHY_ERROR:
      return {
        ...state,
        uploadHierarchy: {
          isDone: false,
          error: "",
        },
      };
    case RESET_HIERARCHY_DETAILS:
      return {
        ...state,
        companyList: {
          list: [],
          error: "",
        },
        businessLineList: {
          list: [],
          error: "",
        },
        eligibilityPlanList: {
          list: [],
          error: "",
        },
        eligibilityGroupList: {
          list: [],
          error: "",
        },
      };
    // case START_SPINNER_ACTION:
    //   const newList = state.spinner.map((obj) =>
    //     obj.List === action.payload ? { ...obj, status: true } : obj
    //   );
    //   return {
    //     ...state,
    //     spinner: newList,
    //   };
    // case STOP_SPINNER_ACTION:
    //   const newListStop = state.spinner.map((obj) =>
    //     obj.List === action.payload ? { ...obj, status: false } : obj
    //   );
    // return {
    //   ...state,
    //   spinner: newListStop,
    // };
    default:
      return { ...state };
  }
};
