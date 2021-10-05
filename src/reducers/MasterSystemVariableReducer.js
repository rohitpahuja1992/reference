import {
  FETCH_MASTERSYSVARIABLE_COMPLETE,
  FETCH_MASTERSYSVARIABLE_FAILURE,
  FETCH_MASTERSYSVARIABLEBYID_COMPLETE,
  FETCH_MASTERSYSVARIABLEBYID_FAILURE,
  FETCH_MASTERSYSVARIABLEBYMODULEID_COMPLETE,
  FETCH_MASTERSYSVARIABLEBYMODULEID_FAILURE,
  ADD_MASTERSYSVARIABLE_COMPLETE,
  ADD_MASTERSYSVARIABLE_FAILURE,
  ADD_MASTERSYSVARIABLE_ERROR,
  UPDATE_MASTERSYSVARIABLE_COMPLETE,
  UPDATE_MASTERSYSVARIABLE_FAILURE,
  UPDATE_MASTERSYSVARIABLE_ERROR,
  DELETE_MASTERSYSVARIABLE_COMPLETE,
  DELETE_MASTERSYSVARIABLE_FAILURE,
  DELETE_MASTERSYSVARIABLE_ERROR,
  RESET_MASTERSYSVARIABLE_ADDED,
  RESET_DUPLICATE_ERROR,
  RESET_UPDATE_ERROR,
  DEFAULT_START_INDEX,
  DEFAULT_PAGE_SIZE,
  SET_DEFAULT_STARTINDEX,
} from "../utils/AppConstants";

const initState = {
  systemDetailsList: {
    list: [
      // {
      //   createdByUser: "Vipul Saxena",
      //   createdDate: "2020-10-09T07:16:52.000+0000",
      //   shortDescription: "Allow multiple IRES on a single case",
      //   id: 0,
      //   code: "ALLOW_MULTIPLE_IRES_ON_A_SINGLE_ CASE",
      //   modules: "PROVIDER_DISPUTES",
      //   system: "address_type",
      //   //'uniqueColumn':'tess',
      //   uniqueColumn: {
      //     mapObject: {
      //       fieldName: "CODE",
      //       columnName: "CODE",
      //       fieldLength: 50,
      //       decimalDigits: 0,
      //       dataType: "VARCHAR",
      //       javaDataType: "STRING",
      //       isRequired: true,
      //       isAutoIncrement: false,
      //     },
      //     mapLabel: "System Variable Code",
      //     isPrimary: true,
      //   },
      //   updatedByUser: null,
      //   updatedDate: null,
      // },
      // {
      //   createdByUser: "Vipul Saxena",
      //   createdDate: "2020-10-09T07:16:52.000+0000",
      //   shortDescription: "Allow multiple IRES on a single case",
      //   id: 1,
      //   code: "ALLOW_MULTIPLE_IRES_ON_A_SINGLE_ CASE",
      //   modules: "GRIEVANCE",
      //   system: "address_type",
      //   //'uniqueColumn':'tess',
      //   uniqueColumn: {
      //     mapObject: {
      //       fieldName: "CODE",
      //       columnName: "CODE",
      //       fieldLength: 50,
      //       decimalDigits: 0,
      //       dataType: "VARCHAR",
      //       javaDataType: "STRING",
      //       isRequired: true,
      //       isAutoIncrement: false,
      //     },
      //     mapLabel: "",
      //     isPrimary: false,
      //   },
      //   updatedByUser: null,
      //   updatedDate: null,
      // },
      // {
      //   createdByUser: "Vipul Saxena",
      //   createdDate: "2020-10-09T07:16:52.000+0000",
      //   shortDescription: "Set the label for case manager field",
      //   id: 2,
      //   code: "Set_THE_LABEL_FOR_CASE_MANAGER_FIELD",
      //   modules: "ADHOC",
      //   system: "alert_types",
      //   //'uniqueColumn':'tess',
      //   uniqueColumn: {
      //     mapObject: {
      //       fieldName: "CODE",
      //       columnName: "CODE",
      //       fieldLength: 50,
      //       decimalDigits: 0,
      //       dataType: "VARCHAR",
      //       javaDataType: "STRING",
      //       isRequired: true,
      //       isAutoIncrement: false,
      //     },
      //     mapLabel: "System Variable Code",
      //     isPrimary: true,
      //   },
      //   updatedByUser: null,
      //   updatedDate: null,
      // },
    ],
    totalElements: "",
    totalPages: "",
  },
  reset: false,
  page: {
    startIndex: DEFAULT_START_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
  },
  systemDetailsById: {
    data: {},
  },
  isSystemAdded: false,
  isSystemDeleted: false,
  isSystemUpdated: false,
  //getByIdError:"",
  getError: "",
  addError: "",
  putError: "",
  systemByModule: []
};

export const MasterSystemVariableReducer = (state = initState, action) => {
  switch (action.type) {
    case FETCH_MASTERSYSVARIABLE_COMPLETE:
      return {
        ...state,
        systemDetailsList: {
          list: action.payload.pageInfo.configTableRecord,
          totalElements: action.payload.pageInfo.totalElements,
          totalPages: action.payload.pageInfo.totalPages,
        },
        page: {
          startIndex: action.payload.startIndex,
          pageSize: action.payload.pageSize,
        },
        reset: false,
        systemDetailsById: { data: {} },
        getError: "",
        addError: "",
        putError: "",
        isSystemAdded: false,
        isSystemDeleted: false,
        isSystemUpdated: false,
      };

    case FETCH_MASTERSYSVARIABLE_FAILURE:
      return {
        ...state,
        systemDetailsList: { list: [], totalElements: "", totalPages: "" },
        page: {
          startIndex: DEFAULT_START_INDEX,
          pageSize: DEFAULT_PAGE_SIZE,
        },
        reset: false,
        systemDetailsById: { data: {} },
        getError: action.payload,
        addError: "",
        putError: "",
        isSystemAdded: false,
        isSystemDeleted: false,
        isSystemUpdated: false,
      };
    case FETCH_MASTERSYSVARIABLEBYID_COMPLETE:
      return {
        ...state,
        systemDetailsById: { data: action.payload },
      };
    case FETCH_MASTERSYSVARIABLEBYID_FAILURE:
      return {
        ...state,
        systemDetailsById: { data: {} },
      };
    case ADD_MASTERSYSVARIABLE_COMPLETE:
      return {
        ...state,
        isSystemAdded: true,
        addError: "",
      };
    case ADD_MASTERSYSVARIABLE_ERROR:
      return {
        ...state,
        isSystemAdded: false,
        addError: action.payload,
      };

    case ADD_MASTERSYSVARIABLE_FAILURE:
      return {
        ...state,
        isSystemAdded: false,
        addError: action.payload,
      };
    case UPDATE_MASTERSYSVARIABLE_COMPLETE:
      return {
        ...state,
        isSystemUpdated: true,
        putError: "",
      };
    case RESET_MASTERSYSVARIABLE_ADDED:
      return {
        ...state,
        isSystemAdded: false,
        putError: "",
      };
    case UPDATE_MASTERSYSVARIABLE_ERROR:
      return {
        ...state,
        isSystemUpdated: false,
        putError: action.payload,
      };

    case UPDATE_MASTERSYSVARIABLE_FAILURE:
      return {
        ...state,
        isSystemUpdated: false,
        putError: action.payload,
      };
    case DELETE_MASTERSYSVARIABLE_COMPLETE:
      return {
        ...state,
        isSystemDeleted: true,
      };
    case DELETE_MASTERSYSVARIABLE_ERROR:
      return {
        ...state,
        isSystemDeleted: false,
      };
    case DELETE_MASTERSYSVARIABLE_FAILURE:
      return {
        ...state,
        isSystemDeleted: false,
      };
    case RESET_DUPLICATE_ERROR:
      return {
        ...state,
        systemDetailsById: { data: {} },
        addError: "",
        putError: "",
        isSystemAdded: false,
        isSystemDeleted: false,
        isSystemUpdated: false,
      };
    case RESET_UPDATE_ERROR:
      return {
        ...state,
        //systemDetailsById:{data: {}},
        addError: "",
        putError: "",
      };
    case SET_DEFAULT_STARTINDEX:
      return {
        ...state,
        reset: true,
      };
    case FETCH_MASTERSYSVARIABLEBYMODULEID_COMPLETE:
      return {
        ...state,
        systemByModule: action.payload
      };
    case FETCH_MASTERSYSVARIABLEBYMODULEID_FAILURE:
      return {
        ...state,
        systemByModule: []
      };
    default:
      return { ...state };
  }
};
