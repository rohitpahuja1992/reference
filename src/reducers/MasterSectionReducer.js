import {
  FETCH_MASTERSECTION_COMPLETE,
  FETCH_MASTERSECTION_FAILURE,
  FETCH_MASTERSECTIONBYID_COMPLETE,
  FETCH_MASTERSECTIONBYID_FAILURE,
  ADD_MASTERSECTION_COMPLETE,
  ADD_MASTERSECTION_FAILURE,
  ADD_MASTERSECTION_ERROR,
  UPDATE_MASTERSECTION_COMPLETE,
  UPDATE_MASTERSECTION_FAILURE,
  UPDATE_MASTERSECTION_ERROR,
  DELETE_MASTERSECTION_COMPLETE,
  DELETE_MASTERSECTION_FAILURE,
  DELETE_MASTERSECTION_ERROR,
  RESET_DUPLICATE_ERROR,
  RESET_UPDATE_ERROR,
} from "../utils/AppConstants";

const initState = {
  sectionDetailsList: {
    list: [],
  },
  sectionDetailsById: {
    data: {},
  },
  isSectionAdded: false,
  isSectionDeleted: false,
  isSectionUpdated: false,
  //getByIdError:"",
  getError: "",
  addError: "",
  putError: "",
};

export const MasterSectionReducer = (state = initState, action) => {
  switch (action.type) {
    case FETCH_MASTERSECTION_COMPLETE:
      return {
        ...state,
        sectionDetailsList: { list: [...action.payload] },
        sectionDetailsById: { data: {} },
        getError: "",
        addError: "",
        putError: "",
        isSectionAdded: false,
        isSectionDeleted: false,
        isSectionUpdated: false,
      };

    case FETCH_MASTERSECTION_FAILURE:
      return {
        ...state,
        sectionDetailsList: { list: [] },
        sectionDetailsById: { data: {} },
        getError: action.payload,
        addError: "",
        putError: "",
        isSectionAdded: false,
        isSectionDeleted: false,
        isSectionUpdated: false,
      };
    case FETCH_MASTERSECTIONBYID_COMPLETE:
      return {
        ...state,
        sectionDetailsById: { data: action.payload },
      };
    case FETCH_MASTERSECTIONBYID_FAILURE:
      return {
        ...state,
        sectionDetailsById: { data: {} },
      };
    case ADD_MASTERSECTION_COMPLETE:
      return {
        ...state,
        isSectionAdded: true,
        addError: "",
      };
    case ADD_MASTERSECTION_ERROR:
      return {
        ...state,
        isSectionAdded: false,
        addError: action.payload,
      };

    case ADD_MASTERSECTION_FAILURE:
      return {
        ...state,
        isSectionAdded: false,
        addError: action.payload,
      };
    case UPDATE_MASTERSECTION_COMPLETE:
      return {
        ...state,
        isSectionUpdated: true,
        putError: "",
      };
    case UPDATE_MASTERSECTION_ERROR:
      return {
        ...state,
        isSectionUpdated: false,
        putError: action.payload,
      };

    case UPDATE_MASTERSECTION_FAILURE:
      return {
        ...state,
        isSectionUpdated: false,
        putError: action.payload,
      };
    case DELETE_MASTERSECTION_COMPLETE:
      return {
        ...state,
        isSectionDeleted: true,
      };
    case DELETE_MASTERSECTION_ERROR:
      return {
        ...state,
        isSectionDeleted: false,
      };
    case DELETE_MASTERSECTION_FAILURE:
      return {
        ...state,
        isSectionDeleted: false,
      };
    case RESET_DUPLICATE_ERROR:
      return {
        ...state,
        sectionDetailsById: { data: {} },
        addError: "",
        putError: "",
        isSectionAdded: false,
        isSectionDeleted: false,
        isSectionUpdated: false,
      };
    case RESET_UPDATE_ERROR:
      return {
        ...state,
        //sectionDetailsById:{data: {}},
        addError: "",
        putError: "",
      };
    default:
      return { ...state };
  }
};
