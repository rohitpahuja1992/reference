import {
  FETCH_FEATURES_COMPLETE,
  FETCH_FEATURES_FAILURE,
  FETCH_FEATURES_ERROR,
  FETCH_FEATURE_PROFILE_COMPLETE,
  FETCH_FEATURE_PROFILE_FAILURE,
  FETCH_FEATURE_PROFILE_ERROR,
  UPDATE_FEATURE_COMPLETE,
  UPDATE_FEATURE_ERROR,
  UPDATE_FEATURE_FAILURE,
} from "../utils/AppConstants";

const initState = {
  data: {
    list: [
      // { id: 1, name: "Master List of Clients to Access", internalName: "clientListAccess", createdOn: "24/05/2020 08:00 AM", createdBy: "Chay Levell" },
      // { id: 2, name: "Client Specific Dashboards", internalName: "clientDashboard", createdOn: "16/05/2020 06:00 PM", createdBy: "Maggie Cajka" },
      // { id: 3, name: "Update Field Configuration Options", internalName: "updateFieldConfiguration", createdOn: "04/05/2020 12:30 PM", createdBy: "Maggie Cajka" },
      // { id: 4, name: "Approve Requirements", internalName: "approveRequirements", createdOn: "24/05/2020 08:00 AM", createdBy: "Chay Levell" },
      // { id: 5, name: "Remove Client Sign Off", internalName: "removeClientSignOff", createdOn: "16/05/2020 06:00 PM", createdBy: "Maggie Cajka" },
      // { id: 6, name: "Add Comments", internalName: "addComments", createdOn: "24/05/2020 08:00 AM", createdBy: "Maggie Cajka" },
      // { id: 7, name: "Mark as Exception", internalName: "markAsException", createdOn: "16/05/2020 06:00 PM", createdBy: "Chay Levell" },
      // { id: 8, name: "Mark Field for Review", internalName: "markFieldForReview", createdOn: "24/05/2020 08:00 AM", createdBy: "Maggie Cajka" },
      // { id: 9, name: "User Provisioning", internalName: "userProvisioning", createdOn: "16/05/2020 06:00 PM", createdBy: "Maggie Cajka" },
      // { id: 10, name: "Add/Edit/Term Clients", internalName: "addEditTermClients", createdOn: "24/05/2020 08:00 AM", createdBy: "Chay Levell" },
      // { id: 11, name: "Hierarchy File Load", internalName: "hierarchyFileLoad", createdOn: "16/05/2020 06:00 PM", createdBy: "Chay Levell" },
      // { id: 12, name: "Module/OOB Editing Screen", internalName: "moduleOobEditingScreen", createdOn: "16/05/2020 06:00 PM", createdBy: "Maggie Cajka" },
      // { id: 13, name: "Pass/Fail", internalName: "passFail", createdOn: "24/05/2020 08:00 AM", createdBy: "Chay Levell" },
      // { id: 14, name: "Add Comments when marking Pass or Fail", internalName: "addPassFailComments", createdOn: "16/05/2020 06:00 PM", createdBy: "Maggie Cajka" }
    ],
    error: "",
    totalElements: 0,
  totalPages: 0,
  pageSize: 0,
  startIndex: 0,
  reset: false,
  },
  profile: {
    details: "",
    responseCode: "",
    responseMessage: "",
    isUpdateCalled: false,
    isFetchCalled: false,
    error: "",
  },
};

export const FeatureReducer = (state = initState, action) => {
  switch (action.type) {
    case FETCH_FEATURES_COMPLETE:
      return {
        ...state,
        data: { 
          list: action.payload.oobComponents,
          totalElements: action.payload.totalElements,
          totalPages: action.payload.totalPages,
          pageSize: action.payload.pageSize,
          startIndex:action.payload.startIndex,
          error: undefined },
      };

    case FETCH_FEATURES_ERROR:
      return {
        ...state,
        data: {
          ...state.data,
          list: state.data.list,
          error: action.payload,
        },
      };

    case FETCH_FEATURES_FAILURE:
      return {
        ...state,
        data: { list: [], error: action.payload },
      };

    case FETCH_FEATURE_PROFILE_COMPLETE:
      return {
        ...state,
        profile: {
          details: action.payload.responseObject,
          isFetchCalled: true,
          isUpdateCalled: false,
          error: undefined,
        },
      };

    case FETCH_FEATURE_PROFILE_ERROR:
      return {
        ...state,
        profile: {
          ...state.profile,
          isFetchCalled: true,
          isUpdateCalled: false,
          error: action.payload,
        },
      };

    case FETCH_FEATURE_PROFILE_FAILURE:
      return {
        ...state,
        profile: {
          details: "",
          isFetchCalled: true,
          isUpdateCalled: false,
          error: action.payload,
        },
      };

    case UPDATE_FEATURE_COMPLETE:
      return {
        ...state,
        profile: {
          details: action.payload.responseObject,
          responseCode: action.payload.responseCode,
          responseMessage: action.payload.responseMessage,
          isUpdateCalled: true,
          isFetchCalled: false,
          error: undefined,
        },
      };

    case UPDATE_FEATURE_ERROR:
      return {
        ...state,
        profile: {
          ...state.profile,
          isUpdateCalled: true,
          isFetchCalled: false,
          error: action.payload,
        },
      };

    case UPDATE_FEATURE_FAILURE:
      return {
        ...state,
        profile: {
          details: "",
          isUpdateCalled: true,
          isFetchCalled: false,
          error: action.payload,
        },
      };
    default:
      return { ...state };
  }
};
