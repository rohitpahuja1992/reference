import {
    FETCH_CONTROLAUDIT_COMPLETE,
    FETCH_CONTROLAUDIT_FAILURE,
    RESET_OOBAUDIT
  } from "../utils/AppConstants";
  
  const initState = {
    controlAuditDetails: [],
    totalElements:0,
    getError:""
  };
  
  export const OOBFieldTimelineReducer = (state = initState, action) => {
    switch (action.type) {
      case FETCH_CONTROLAUDIT_COMPLETE:
        return {
          ...state,
          controlAuditDetails: action.payload.oobcomponents,
          totalElements: action.payload.totalElements,
          getError:""
        };
  
      case FETCH_CONTROLAUDIT_FAILURE:
        return {
          ...state,
          controlAuditDetails: [],
          getError:action.payload
        };
        case RESET_OOBAUDIT:
          return {
            ...state,
            controlAuditDetails: [],
            totalElements:0,
            getError: "",
          };
      default:
        return { ...state };
    }
  };
  