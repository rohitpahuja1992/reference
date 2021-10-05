import {
  FETCH_CONTROL_COMPLETE,
  FETCH_CONTROL_ERROR,
  FETCH_CONTROL_FAILED,
  ADD_CONTROL_COMPLETE,
  ADD_CONTROL_ERROR,
  DELETE_MASTERCONTROL_COMPLETE,
  DELETE_MASTERCONTROL_FAILURE,
  DELETE_CONTROL_PROPERTY_COMPLETE,
  DELETE_CONTROL_PROPERTY_FAILURE,
  //ADD_CONTROL_FAILED,
  RESET_ADD_CONTROL_ERROR,
  RESET_ADD_CONTROL_IS_DONE,
  UPDATE_CONTROL_COMPLETE,
  UPDATE_CONTROL_ERROR,
  UPDATE_CONTROL_FAILED,
  RESET_UPDATE_CONTROL_ERROR,
  RESET_UPDATE_CONTROL_IS_DONE,
  FETCH_INDIVIDUAL_CONTROL_COMPLETE,
  FETCH_INDIVIDUAL_CONTROL_ERROR,
  FETCH_INDIVIDUAL_CONTROL_FAILURE,
  ADD_MASTER_CONTROL_FIELD_COMPLETE,
  ADD_MASTER_CONTROL_FIELD_ERROR,
  ADD_MASTER_CONTROL_FIELD_FAILED,
  RESET_ADD_MASTER_CONTROL_FIELD_ERROR,
  RESET_ADD_MASTER_CONTROL_FIELD_IS_DONE,
  DEFAULT_START_INDEX,
  DEFAULT_PAGE_SIZE,
  SET_DEFAULT_STARTINDEX
} from "../utils/AppConstants";

const initState = {
  data: {
    list: [],
    totalElements: "",
    totalPages: "",
    isControlAdded: false,
    isControlDeleted: false,
    isPropertyDeleted: false,
    getError: "",
    addError: "",
    error: "",
    isControlUpdated: false,
    updateError: "",
    isFieldAdded: false,
    fieldAddError: "",
  },
  page: {
    startIndex: DEFAULT_START_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
  },
  reset: false,
  individual: {
    details: "",
    error: "",
  },
};

export const ControlReducer = (state = initState, action) => {
  switch (action.type) {
    case FETCH_CONTROL_COMPLETE:
      return {
        ...state,
        data: {
          list: action.payload.controls,
          totalElements: action.payload.pageInfo.totalElements,
          totalPages: action.payload.pageInfo.totalPages,
          isControlDeleted: false,
          getError: "",
          addError: "",
          error: undefined,
        },
        page: {
          startIndex: action.payload.startIndex,
          pageSize: action.payload.pageSize,
        },
        reset: false,
      };

    case FETCH_CONTROL_ERROR:
      return {
        ...state,
        data: {
          list: [],
          totalElements: "",
          totalPages: "",
          getError: action.payload,
          addError: "",
          error: action.payload,
        },
        page: { startIndex: DEFAULT_START_INDEX, pageSize: DEFAULT_PAGE_SIZE },
        reset: false,
      };

    case FETCH_CONTROL_FAILED:
      return {
        ...state,
        data: {
          list: [],
          totalElements: "",
          totalPages: "",
          getError: action.payload,
          addError: "",
          error: action.payload,
        },
        page: { startIndex: DEFAULT_START_INDEX, pageSize: DEFAULT_PAGE_SIZE },
        reset: false,
      };

    case ADD_CONTROL_COMPLETE:
      // const newControlData = {
      //   id: state.data.list.length,
      //   ...action.payload,
      // };
      return {
        ...state,
        data: {
          ...state.data,
          isControlAdded: true,
          addError: "",
          // list: [...state.data.list, newControlData],
          error: undefined,
        },
      };

    case ADD_CONTROL_ERROR:
      return {
        ...state,
        data: {
          ...state.data,
          addError: action.payload,
          error: action.payload,
        },
      };

    case DELETE_MASTERCONTROL_COMPLETE:
      return {
        ...state,
        data: {
          ...state.data,
          isControlDeleted: true,
        },
      };

    case DELETE_MASTERCONTROL_FAILURE:
      return {
        ...state,
        data: {
          ...state.data,
          isControlDeleted: false,
        },
      };

    case DELETE_CONTROL_PROPERTY_COMPLETE:
      return {
        ...state,
        data: {
          ...state.data,
          isPropertyDeleted: true,
        },
      };

    case DELETE_CONTROL_PROPERTY_FAILURE:
      return {
        ...state,
        data: {
          ...state.data,
          isPropertyDeleted: false,
        },
      };

    // case ADD_CONTROL_FAILED:
    //   return {
    //     ...state,
    //     data: {
    //       ...state.data,
    //       error: action.payload,
    //     },
    //   };

    case RESET_ADD_CONTROL_ERROR:
      return {
        ...state,
        data: { ...state.data, addError: "", error: undefined },
      };

    case RESET_ADD_CONTROL_IS_DONE:
      return {
        ...state,
        data: { ...state.data, isControlAdded: false },
      };

    case FETCH_INDIVIDUAL_CONTROL_COMPLETE:
      return {
        ...state,
        data: {
          ...state.data,
          isPropertyDeleted: false,
        },
        individual: {
          details: action.payload,
          error: undefined,
        },
      };

    case FETCH_INDIVIDUAL_CONTROL_ERROR:
      return {
        ...state,
        individual: {
          ...state.individual,
          error: action.payload,
        },
      };

    case FETCH_INDIVIDUAL_CONTROL_FAILURE:
      return {
        ...state,
        individual: {
          details: "",
          error: action.payload,
        },
      };

    case ADD_MASTER_CONTROL_FIELD_COMPLETE:
      return {
        ...state,
        data: {
          ...state.data,
          isFieldAdded: true,
          fieldAddError: "",
        },
      };

    case ADD_MASTER_CONTROL_FIELD_ERROR:
      return {
        ...state,
        data: {
          ...state.data,
          fieldAddError: action.payload,
        },
      };

    case ADD_MASTER_CONTROL_FIELD_FAILED:
      return {
        ...state,
        data: {
          ...state.data,
          fieldAddError: action.payload,
        },
      };

    case RESET_ADD_MASTER_CONTROL_FIELD_ERROR:
      return {
        ...state,
        data: { ...state.data, fieldAddError: undefined },
      };

    case RESET_ADD_MASTER_CONTROL_FIELD_IS_DONE:
      return {
        ...state,
        data: { ...state.data, isFieldAdded: false },
      };

    case UPDATE_CONTROL_COMPLETE:
      const updatedData = state.data.list.map((data) => {
        if (data.id === action.payload.controlId) {
          data.controlFormat.push(action.payload.fieldData);
        }
        return data;
      });

      return {
        ...state,
        data: {
          isControlUpdated: true,
          list: updatedData,
          updateError: undefined,
        },
      };

    case UPDATE_CONTROL_ERROR:
      return {
        ...state,
        data: {
          ...state.data,
          updateError: action.payload,
        },
      };

    case UPDATE_CONTROL_FAILED:
      return {
        ...state,
        data: {
          ...state.data,
          updateError: action.payload,
        },
      };

    case RESET_UPDATE_CONTROL_ERROR:
      return {
        ...state,
        data: { ...state.data, updateError: undefined },
      };

    case RESET_UPDATE_CONTROL_IS_DONE:
      return {
        ...state,
        data: { ...state.data, isControlUpdated: false },
      };
    case SET_DEFAULT_STARTINDEX:
      return {
        ...state,
        reset: true,
      };

    default:
      return { ...state };
  }
};
