import {
  FETCH_QUEUES_COMPLETE,
  FETCH_QUEUES_FAILURE,
  FETCH_QUEUES_ERROR,
  FETCH_QUEUE_PROFILE_COMPLETE,
  FETCH_QUEUE_PROFILE_FAILURE,
  FETCH_QUEUE_PROFILE_ERROR,
  UPDATE_QUEUES_COMPLETE,
  UPDATE_QUEUES_ERROR,
  UPDATE_QUEUES_FAILURE,
} from "../utils/AppConstants";

const initState = {
  data: {
    list: [
      // { id: 1, name: "Client Queue", internalName: "clientQueue", status: 'ACTIVE', updatedDate: "24/05/2020 08:00 AM", updatedBy: "Chay Levell" },
      // { id: 2, name: "Review Queue", internalName: "reviewQueue", status: 'ACTIVE', updatedDate: "16/05/2020 06:00 PM", updatedBy: "Maggie Cajka" },
      // { id: 3, name: "Product Queue", internalName: "productQueue", status: 'ACTIVE', updatedDate: "04/05/2020 12:30 PM", updatedBy: "Maggie Cajka" },
      // { id: 4, name: "Exception Queue", internalName: "exceptionQueue", status: 'ACTIVE', updatedDate: "24/05/2020 08:00 AM", updatedBy: "Chay Levell" },
      // { id: 5, name: "Config Queue", internalName: "configQueue", status: 'ACTIVE', updatedDate: "16/05/2020 06:00 PM", updatedBy: "Maggie Cajka" },
      // { id: 6, name: "QA Queue", internalName: "qAQueue", status: 'ACTIVE', updatedDate: "24/05/2020 08:00 AM", updatedBy: "Maggie Cajka" },
    ],
    responseCode: "",
    responseMessage: "",
    error: "",
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

export const QueueReducer = (state = initState, action) => {
  switch (action.type) {
    case FETCH_QUEUES_COMPLETE:
      return {
        ...state,
        data: {
          list: action.payload.responseObject,
          responseCode: action.payload.responseCode,
          responseMessage: action.payload.responseMessage,
          error: undefined,
        },
      };

    case FETCH_QUEUES_ERROR:
      return {
        ...state,
        data: {
          ...state.data,
          responseCode: action.payload.responseCode,
          responseMessage: action.payload.responseMessage,
          error: action.payload,
        },
      };

    case FETCH_QUEUES_FAILURE:
      return {
        ...state,
        data: {
          list: [],
          responseCode: "",
          responseMessage: "",
          error: action.payload,
        },
      };

    case FETCH_QUEUE_PROFILE_COMPLETE:
      return {
        ...state,
        profile: {
          details: action.payload.responseObject,
          responseCode: action.payload.responseCode,
          responseMessage: action.payload.responseMessage,
          isUpdateCalled: false,
          isFetchCalled: true,
          error: undefined,
        },
      };

    case FETCH_QUEUE_PROFILE_ERROR:
      return {
        ...state,
        profile: {
          ...state.profile,
          responseCode: action.payload.responseCode,
          responseMessage: action.payload.responseMessage,
          isUpdateCalled: false,
          isFetchCalled: true,
          error: action.payload,
        },
      };

    case FETCH_QUEUE_PROFILE_FAILURE:
      return {
        ...state,
        profile: {
          details: "",
          responseCode: "",
          responseMessage: "",
          isUpdateCalled: false,
          isFetchCalled: true,
          error: action.payload,
        },
      };

    case UPDATE_QUEUES_COMPLETE:
      return {
        ...state,
        profile: {
          details: action.payload.responseObject,
          responseCode: action.payload.responseMessage,
          responseMessage: action.payload.responseCode,
          isUpdateCalled: true,
          isFetchCalled: false,
          error: undefined,
        },
      };

    case UPDATE_QUEUES_ERROR:
      return {
        ...state,
        profile: {
          ...state.profile,
          responseCode: action.payload.responseMessage,
          responseMessage: action.payload.responseCode,
          isUpdateCalled: true,
          isFetchCalled: false,
          error: action.payload,
        },
      };

    case UPDATE_QUEUES_FAILURE:
      return {
        ...state,
        profile: {
          details: "",
          responseCode: "",
          responseMessage: "",
          isUpdateCalled: true,
          isFetchCalled: false,
          error: action.payload,
        },
      };

    default:
      return { ...state };
  }
};
