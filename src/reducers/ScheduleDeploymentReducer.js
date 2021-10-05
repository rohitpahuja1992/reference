import {
  FETCH_SCHEDULE_DEPLOYMENT_COMPLETE,
  FETCH_SCHEDULE_DEPLOYMENT_FAILURE,
  FETCH_SCHEDULE_DEPLOYMENT_ERROR,
  ADD_SCHEDULE_DEPLOYMENT_COMPLETE,
  ADD_SCHEDULE_DEPLOYMENT_ERROR,
  ADD_SCHEDULE_DEPLOYMENT_FAILURE,
  DELETE_SCHEDULE_DEPLOYMENT_COMPLETE,
  DELETE_SCHEDULE_DEPLOYMENT_ERROR,
  DELETE_SCHEDULE_DEPLOYMENT_FAILURE,
  FETCH_SCHEDULEDBYID_COMPLETE,
  RESET_SCHEDULEBYID_COMPLETE,
  RESET_DUPLICATE_ERROR,
  UPDATE_SCHEDULE_DEPLOYMENT_COMPLETE,
  UPDATE_SCHEDULE_DEPLOYMENT_ERROR,
  UPDATE_SCHEDULE_DEPLOYMENT_FAILURE,
} from "../utils/AppConstants";

const initState = {
  scheduledDetailsList: {
    list: [],
    totalElements: 0,
  totalPages: 0,
  pageSize: 0,
  startIndex: 0,
  reset: false,
    responseCode: "",
    responseMessage: "",
    error: "",
  },
  isScheduledAdded: false,
  isScheduledDeleted: false,
  scheduleById:{},
  getError: "",
  addError: "",
};

export const ScheduleDeploymentReducer = (state = initState, action) => {
  switch (action.type) {
    case FETCH_SCHEDULE_DEPLOYMENT_COMPLETE:
      return {
        ...state,
        scheduledDetailsList: {
          list: action.payload.oobComponents,
          totalElements: action.payload.totalElements,
          totalPages: action.payload.totalPages,
          pageSize: action.payload.pageSize,
          startIndex:action.payload.startIndex,
          error: undefined,
        },
        getError: "",
        addError: "",
        isScheduledAdded: false,
        isScheduledDeleted: false,
      };

      case FETCH_SCHEDULE_DEPLOYMENT_ERROR:
        return {
          ...state,
          scheduledDetailsList: {
            ...state.data,
            list: [],
            error: action.payload,
          },
        };

    case FETCH_SCHEDULE_DEPLOYMENT_FAILURE:
      return {
        ...state,
        scheduledDetailsList: { 
          list: [],
          responseCode: "",
          responseMessage: "",
          error: action.payload,
         },
        getError: action.payload,
        addError: "",
        isScheduledAdded: false,
        isScheduledDeleted: false,
      };

      case UPDATE_SCHEDULE_DEPLOYMENT_COMPLETE:
        return {
          ...state,
        scheduledDetailsList: {
          list: state.scheduledDetailsList.list,
          responseCode: action.payload.responseCode,
          responseMessage: action.payload.responseMessage,
          error: undefined,
        },
        getError: "",
        addError: "",
        isScheduledAdded: false,
        isScheduledDeleted: false,
        };
  
      case UPDATE_SCHEDULE_DEPLOYMENT_ERROR:
        return {
          ...state,
          scheduledDetailsList: {
            ...state.data,
            list: state.scheduledDetailsList.list,
            responseCode: "",
            responseMessage: "",
            error: action.payload,
          },
        };
  
      case UPDATE_SCHEDULE_DEPLOYMENT_FAILURE:
        return {
          ...state,
          scheduledDetailsList: { 
            list: state.scheduledDetailsList.list,
            responseCode: "",
            responseMessage: "",
            error: action.payload,
           },
          getError: action.payload,
          addError: "",
          isScheduledAdded: false,
          isScheduledDeleted: false,
        };

    case ADD_SCHEDULE_DEPLOYMENT_COMPLETE:
      return {
        ...state,
        isScheduledAdded: true,
        addError: "",
      };
    case ADD_SCHEDULE_DEPLOYMENT_ERROR:
      return {
        ...state,
        isScheduledAdded: false,
        addError: action.payload,
      };

    case ADD_SCHEDULE_DEPLOYMENT_FAILURE:
      return {
        ...state,
        isScheduledAdded: false,
        addError: action.payload,
      };
    case DELETE_SCHEDULE_DEPLOYMENT_COMPLETE:
      return {
        ...state,
        isScheduledDeleted: true,
      };
    case DELETE_SCHEDULE_DEPLOYMENT_ERROR:
      return {
        ...state,
        isScheduledDeleted: false,
      };

    case DELETE_SCHEDULE_DEPLOYMENT_FAILURE:
      return {
        ...state,
        isScheduledDeleted: false,
      };
    case RESET_DUPLICATE_ERROR:
      return {
        ...state,
        addError: "",
      };
    case FETCH_SCHEDULEDBYID_COMPLETE:
      return {
        ...state,
        scheduleById:action.payload
      }
    case RESET_SCHEDULEBYID_COMPLETE:
      return {
        ...state,
        scheduleById:{}
      }
    default:
      return { ...state };
  }
};
