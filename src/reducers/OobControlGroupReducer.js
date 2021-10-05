import {
  FETCH_OOB_CONTROL_FIELDS_COMPLETE,
  FETCH_OOB_CONTROL_FIELDS_ERROR,
  FETCH_OOB_CONTROL_FIELDS_FAILED,
  ADD_OOB_CONTROL_FIELD_COMPLETE,
  ADD_OOB_CONTROL_FIELD_ERROR,
  ADD_OOB_CONTROL_FIELD_FAILED,
  RESET_OOB_CONTROL_FIELD_ERROR,
  RESET_OOB_ADD_CONTROL_FIELD_IS_DONE,
} from "../utils/AppConstants";

const initState = {
  data: {
    list: [],
    isFieldAdded: "",
    error: "",
  },
};

export const OobControlGroupReducer = (state = initState, action) => {
  switch (action.type) {
    case FETCH_OOB_CONTROL_FIELDS_COMPLETE:
      return {
        ...state,
        data: {
          list: [...state.data.list, ...action.payload],
          error: undefined,
        },
      };

    case FETCH_OOB_CONTROL_FIELDS_ERROR:
      return {
        ...state,
        data: {
          ...state.data,
          error: action.payload,
        },
      };

    case FETCH_OOB_CONTROL_FIELDS_FAILED:
      return {
        ...state,
        data: {
          list: [],
          error: action.payload,
        },
      };

    case ADD_OOB_CONTROL_FIELD_COMPLETE:
      const newFieldData = {
        id: 2000 + state.data.list.length,
        ...action.payload,
      };
      return {
        ...state,
        data: {
          isFieldAdded: true,
          list: [newFieldData, ...state.data.list],
          error: undefined,
        },
      };

    case ADD_OOB_CONTROL_FIELD_ERROR:
      return {
        ...state,
        data: {
          ...state.data,
          error: action.payload,
        },
      };

    case ADD_OOB_CONTROL_FIELD_FAILED:
      return {
        ...state,
        data: {
          ...state.data,
          error: action.payload,
        },
      };

    case RESET_OOB_CONTROL_FIELD_ERROR:
      return {
        ...state,
        data: { ...state.data, error: undefined },
      };

    case RESET_OOB_ADD_CONTROL_FIELD_IS_DONE:
      return {
        ...state,
        data: { ...state.data, isFieldAdded: false },
      };

    default:
      return { ...state };
  }
};
