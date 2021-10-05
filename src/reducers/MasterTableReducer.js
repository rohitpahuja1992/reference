import {
  FETCH_MASTERTABLE_COMPLETE,
  FETCH_MASTERTABLE_FAILURE,
  FETCH_ALL_MASTERTABLE_COMPLETE,
  FETCH_ALL_MASTERTABLE_FAILURE,
  FETCH_MASTERTABLEBYID_COMPLETE,
  FETCH_MASTERTABLEBYID_FAILURE,
  FETCH_CHILD_TABLE_COMPLETE,
  FETCH_CHILD_TABLE_FAILURE,
  ADD_MASTERTABLE_COMPLETE,
  ADD_MASTERTABLE_FAILURE,
  ADD_MASTERTABLE_ERROR,
  UPDATE_MASTERTABLE_COMPLETE,
  UPDATE_MASTERTABLE_FAILURE,
  UPDATE_MASTERTABLE_ERROR,
  DELETE_MASTERTABLE_COMPLETE,
  DELETE_MASTERTABLE_FAILURE,
  DELETE_MASTERTABLE_ERROR,
  FETCH_MASTERTABLEBYMODULE_COMPLETE,
  FETCH_MASTERTABLEBYMODULE_FAILURE,
  RESET_DUPLICATE_ERROR,
  RESET_UPDATE_ERROR,
  DEFAULT_START_INDEX,
  DEFAULT_PAGE_SIZE,
  SET_DEFAULT_STARTINDEX,
  FETCH_COLUMN_LIST_COMPLETE,
  FETCH_COLUMN_LIST_FAILURE,
} from "../utils/AppConstants";

const initState = {
  tableDetailsList: { list: [], totalElements: "", totalPages: "" },
  allList: [],
  // tableDetailsList: {
  //   list: [
  //     {
  //       id: 0,
  //       module: "PROVIDER_DISPUTES",
  //       name: "address_type",
  //       createdByUser: "Vipul Saxena",
  //       createdDate: "2020-10-09T07:16:52.000+0000",
  //       updatedByUser: null,
  //       updatedDate: null,
  //       isFrequent: false,
  //       columns: [
  //         {
  //           mapObject: {
  //             id: 0,
  //             fieldName: "ID",
  //             columnName: "ID",
  //             fieldLength: 10,
  //             decimalDigits: 0,
  //             minValue: 0.0,
  //             maxValue: 4.294967295e9,
  //             dataType: "INT UNSIGNED",
  //             javaDataType: "INTEGER",
  //             isRequired: false,
  //             isAutoIncrement: true,
  //           },
  //           mapLabel: "ID",
  //           isPrimary: false,
  //         },
  //         {
  //           mapObject: {
  //             id: 1,
  //             fieldName: "CODE",
  //             columnName: "CODE",
  //             fieldLength: 50,
  //             decimalDigits: 0,
  //             dataType: "VARCHAR",
  //             javaDataType: "STRING",
  //             isRequired: true,
  //             isAutoIncrement: false,
  //           },
  //           mapLabel: "System Variable Code",
  //           isPrimary: true,
  //         },
  //         {
  //           mapObject: {
  //             id: 2,
  //             fieldName: "DESCRIPTION",
  //             columnName: "DESCRIPTION",
  //             fieldLength: 100,
  //             decimalDigits: 0,
  //             dataType: "VARCHAR",
  //             javaDataType: "STRING",
  //             isRequired: false,
  //             isAutoIncrement: false,
  //           },
  //           mapLabel: "Description",
  //           isPrimary: false,
  //         },
  //         {
  //           mapObject: {
  //             id: 3,
  //             fieldName: "str_value",
  //             columnName: "str_value",
  //             fieldLength: 2147483647,
  //             decimalDigits: 0,
  //             dataType: "LONGTEXT",
  //             javaDataType: "LONGTEXT",
  //             isRequired: false,
  //             isAutoIncrement: false,
  //           },
  //           mapLabel: "String Value",
  //           isPrimary: false,
  //         },
  //         {
  //           mapObject: {
  //             id: 4,
  //             fieldName: "INT_VALUE",
  //             columnName: "INT_VALUE",
  //             fieldLength: 10,
  //             decimalDigits: 0,
  //             minValue: 0.0,
  //             maxValue: 4.294967295e9,
  //             dataType: "INT UNSIGNED",
  //             javaDataType: "INTEGER",
  //             isRequired: false,
  //             isAutoIncrement: false,
  //           },
  //           mapLabel: "",
  //           isPrimary: false,
  //         },
  //       ],
  //     },
  //     {
  //       id: 1,
  //       module: "GRIEVANCE",
  //       name: "alert_types",
  //       createdByUser: "Vipul Saxena",
  //       createdDate: "2020-10-09T07:16:52.000+0000",
  //       updatedByUser: null,
  //       updatedDate: null,
  //       isFrequent: false,
  //       columns: [
  //         {
  //           mapObject: {
  //             id: 4,
  //             fieldName: "INT_VALUE",
  //             columnName: "INT_VALUE",
  //             fieldLength: 10,
  //             decimalDigits: 0,
  //             minValue: 0.0,
  //             maxValue: 4.294967295e9,
  //             dataType: "INT UNSIGNED",
  //             javaDataType: "INTEGER",
  //             isRequired: false,
  //             isAutoIncrement: false,
  //           },
  //           mapLabel: "",
  //           isPrimary: false,
  //         },
  //         {
  //           mapObject: {
  //             id: 0,
  //             fieldName: "ID",
  //             columnName: "ID",
  //             fieldLength: 10,
  //             decimalDigits: 0,
  //             minValue: 0.0,
  //             maxValue: 4.294967295e9,
  //             dataType: "INT UNSIGNED",
  //             javaDataType: "INTEGER",
  //             isRequired: false,
  //             isAutoIncrement: true,
  //           },
  //           mapLabel: "ID",
  //           isPrimary: false,
  //         },
  //         {
  //           mapObject: {
  //             id: 1,
  //             fieldName: "CODE",
  //             columnName: "CODE",
  //             fieldLength: 50,
  //             decimalDigits: 0,
  //             dataType: "VARCHAR",
  //             javaDataType: "STRING",
  //             isRequired: true,
  //             isAutoIncrement: false,
  //           },
  //           mapLabel: "",
  //           isPrimary: true,
  //         },
  //         {
  //           mapObject: {
  //             id: 2,
  //             fieldName: "DESCRIPTION",
  //             columnName: "DESCRIPTION",
  //             fieldLength: 100,
  //             decimalDigits: 0,
  //             dataType: "VARCHAR",
  //             javaDataType: "STRING",
  //             isRequired: false,
  //             isAutoIncrement: false,
  //           },
  //           mapLabel: "Description",
  //           isPrimary: false,
  //         },
  //         {
  //           mapObject: {
  //             id: 3,
  //             fieldName: "str_value",
  //             columnName: "str_value",
  //             fieldLength: 2147483647,
  //             decimalDigits: 0,
  //             dataType: "LONGTEXT",
  //             javaDataType: "LONGTEXT",
  //             isRequired: false,
  //             isAutoIncrement: false,
  //           },
  //           mapLabel: "String Value",
  //           isPrimary: false,
  //         },
  //       ],
  //     },
  //     {
  //       id: 2,
  //       module: "GRIEVANCE",
  //       name: "company",
  //       createdByUser: "Vipul Saxena",
  //       createdDate: "2020-10-09T07:16:52.000+0000",
  //       updatedByUser: null,
  //       updatedDate: null,
  //       isFrequent: false,
  //       columns: [
  //         {
  //           mapObject: {
  //             id: 0,
  //             fieldName: "ID",
  //             columnName: "ID",
  //             fieldLength: 10,
  //             decimalDigits: 0,
  //             minValue: 0.0,
  //             maxValue: 4.294967295e9,
  //             dataType: "INT UNSIGNED",
  //             javaDataType: "INTEGER",
  //             isRequired: false,
  //             isAutoIncrement: true,
  //           },
  //           mapLabel: "ID",
  //           isPrimary: false,
  //         },
  //         {
  //           mapObject: {
  //             id: 1,
  //             fieldName: "CODE",
  //             columnName: "CODE",
  //             fieldLength: 50,
  //             decimalDigits: 0,
  //             dataType: "VARCHAR",
  //             javaDataType: "STRING",
  //             isRequired: true,
  //             isAutoIncrement: false,
  //           },
  //           mapLabel: "System Variable Code",
  //           isPrimary: true,
  //         },
  //         {
  //           mapObject: {
  //             id: 2,
  //             fieldName: "DESCRIPTION",
  //             columnName: "DESCRIPTION",
  //             fieldLength: 100,
  //             decimalDigits: 0,
  //             dataType: "VARCHAR",
  //             javaDataType: "STRING",
  //             isRequired: false,
  //             isAutoIncrement: false,
  //           },
  //           mapLabel: "Description",
  //           isPrimary: false,
  //         },
  //         {
  //           mapObject: {
  //             id: 3,
  //             fieldName: "str_value",
  //             columnName: "str_value",
  //             fieldLength: 2147483647,
  //             decimalDigits: 0,
  //             dataType: "LONGTEXT",
  //             javaDataType: "LONGTEXT",
  //             isRequired: false,
  //             isAutoIncrement: false,
  //           },
  //           mapLabel: "String Value",
  //           isPrimary: false,
  //         },
  //         {
  //           mapObject: {
  //             id: 4,
  //             fieldName: "INT_VALUE",
  //             columnName: "INT_VALUE",
  //             fieldLength: 10,
  //             decimalDigits: 0,
  //             minValue: 0.0,
  //             maxValue: 4.294967295e9,
  //             dataType: "INT UNSIGNED",
  //             javaDataType: "INTEGER",
  //             isRequired: false,
  //             isAutoIncrement: false,
  //           },
  //           mapLabel: "",
  //           isPrimary: false,
  //         },
  //       ],
  //     },
  //   ],
  //   totalElements: "",
  //   totalPages: "",
  // },
  columnList: [],
  // [
  //   {
  //     id: 0,
  //     fieldName: "ID",
  //     columnName: "ID",
  //     fieldLength: 10,
  //     decimalDigits: 0,
  //     minValue: 0.0,
  //     maxValue: 4.294967295e9,
  //     dataType: "INT UNSIGNED",
  //     javaDataType: "INTEGER",
  //     isRequired: false,
  //     isAutoIncrement: true,
  //   },
  //   {
  //     id: 1,
  //     fieldName: "CODE",
  //     columnName: "CODE",
  //     fieldLength: 50,
  //     decimalDigits: 0,
  //     dataType: "VARCHAR",
  //     javaDataType: "STRING",
  //     isRequired: true,
  //     isAutoIncrement: false,
  //   },
  //   {
  //     id: 2,
  //     fieldName: "DESCRIPTION",
  //     columnName: "DESCRIPTION",
  //     fieldLength: 100,
  //     decimalDigits: 0,
  //     dataType: "VARCHAR",
  //     javaDataType: "STRING",
  //     isRequired: false,
  //     isAutoIncrement: false,
  //   },
  //   {
  //     id: 3,
  //     fieldName: "str_value",
  //     columnName: "str_value",
  //     fieldLength: 2147483647,
  //     decimalDigits: 0,
  //     dataType: "LONGTEXT",
  //     javaDataType: "LONGTEXT",
  //     isRequired: false,
  //     isAutoIncrement: false,
  //   },
  //   {
  //     id: 4,
  //     fieldName: "INT_VALUE",
  //     columnName: "INT_VALUE",
  //     fieldLength: 10,
  //     decimalDigits: 0,
  //     minValue: 0.0,
  //     maxValue: 4.294967295e9,
  //     dataType: "INT UNSIGNED",
  //     javaDataType: "INTEGER",
  //     isRequired: false,
  //     isAutoIncrement: false,
  //   },
  //   {
  //     id: 5,
  //     fieldName: "LONG_VALUE",
  //     columnName: "LONG_VALUE",
  //     fieldLength: 20,
  //     decimalDigits: 0,
  //     minValue: 0.0,
  //     maxValue: 1.7976931348623157e308,
  //     dataType: "BIGINT UNSIGNED",
  //     javaDataType: "INTEGER",
  //     isRequired: false,
  //     isAutoIncrement: false,
  //   },
  //   {
  //     id: 6,
  //     fieldName: "list_value_id",
  //     columnName: "list_value_id",
  //     fieldLength: 10,
  //     decimalDigits: 0,
  //     minValue: 0.0,
  //     maxValue: 4.294967295e9,
  //     dataType: "INT UNSIGNED",
  //     javaDataType: "INTEGER",
  //     isRequired: false,
  //     isAutoIncrement: false,
  //   },
  //   {
  //     id: 7,
  //     fieldName: "list_category_id",
  //     columnName: "list_category_id",
  //     fieldLength: 10,
  //     decimalDigits: 0,
  //     minValue: 0.0,
  //     maxValue: 4.294967295e9,
  //     dataType: "INT UNSIGNED",
  //     javaDataType: "STRING",
  //     isRequired: false,
  //     isAutoIncrement: false,
  //   },
  //   {
  //     id: 8,
  //     fieldName: "client",
  //     columnName: "client",
  //     fieldLength: 0,
  //     decimalDigits: 0,
  //     minValue: -128.0,
  //     maxValue: 127.0,
  //     dataType: "BIT",
  //     javaDataType: "INTEGER",
  //     isRequired: true,
  //     isAutoIncrement: false,
  //   },
  //   {
  //     id: 9,
  //     fieldName: "version",
  //     columnName: "version",
  //     fieldLength: 10,
  //     decimalDigits: 0,
  //     minValue: 0.0,
  //     maxValue: 4.294967295e9,
  //     dataType: "INT UNSIGNED",
  //     javaDataType: "INTEGER",
  //     isRequired: true,
  //     isAutoIncrement: false,
  //   },
  //   {
  //     id: 10,
  //     fieldName: "client_context",
  //     columnName: "client_context",
  //     fieldLength: 15,
  //     decimalDigits: 0,
  //     dataType: "VARCHAR",
  //     javaDataType: "STRING",
  //     isRequired: false,
  //     isAutoIncrement: false,
  //   },
  //   {
  //     id: 11,
  //     fieldName: "base_variable",
  //     columnName: "base_variable",
  //     fieldLength: 0,
  //     decimalDigits: 0,
  //     minValue: -128.0,
  //     maxValue: 127.0,
  //     dataType: "BIT",
  //     javaDataType: "INTEGER",
  //     isRequired: false,
  //     isAutoIncrement: false,
  //   },
  //   {
  //     id: 12,
  //     fieldName: "insert_userid",
  //     columnName: "insert_userid",
  //     fieldLength: 45,
  //     decimalDigits: 0,
  //     dataType: "VARCHAR",
  //     javaDataType: "STRING",
  //     isRequired: false,
  //     isAutoIncrement: false,
  //   },
  //   {
  //     id: 13,
  //     fieldName: "update_userid",
  //     columnName: "update_userid",
  //     fieldLength: 45,
  //     decimalDigits: 0,
  //     dataType: "VARCHAR",
  //     javaDataType: "STRING",
  //     isRequired: false,
  //     isAutoIncrement: false,
  //   },
  //   {
  //     id: 14,
  //     fieldName: "insert_datetime",
  //     columnName: "insert_datetime",
  //     fieldLength: 19,
  //     decimalDigits: 0,
  //     dataType: "DATETIME",
  //     javaDataType: "DATE",
  //     defaultValue: "select sysdate()",
  //     isRequired: false,
  //     isAutoIncrement: false,
  //   },
  //   {
  //     id: 15,
  //     fieldName: "update_datetime",
  //     columnName: "update_datetime",
  //     fieldLength: 19,
  //     decimalDigits: 0,
  //     dataType: "DATETIME",
  //     javaDataType: "DATE",
  //     defaultValue: "select sysdate()",
  //     isRequired: false,
  //     isAutoIncrement: false,
  //   },
  //   {
  //     id: 16,
  //     fieldName: "is_locked",
  //     columnName: "is_locked",
  //     fieldLength: 0,
  //     decimalDigits: 0,
  //     minValue: -128.0,
  //     maxValue: 127.0,
  //     dataType: "BIT",
  //     javaDataType: "INTEGER",
  //     isRequired: true,
  //     isAutoIncrement: false,
  //   },
  // ],
  reset: false,
  page: {
    startIndex: DEFAULT_START_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
  },
  tableDetailsById: {
    data: {},
  },
  childTableList: {},
  isTableAdded: false,
  isTableDeleted: false,
  isTableUpdated: false,
  //getByIdError:"",
  getError: "",
  addError: "",
  putError: "",
  tableByModule: [],
};

export const MasterTableReducer = (state = initState, action) => {
  switch (action.type) {
    case FETCH_ALL_MASTERTABLE_COMPLETE:
      return {
        ...state,
        allList: action.payload.allList
      };

    case FETCH_ALL_MASTERTABLE_FAILURE:
      return {
        ...state,
        allList: []
      };
    case FETCH_MASTERTABLE_COMPLETE:
      return {
        ...state,
        tableDetailsList: {
          list: action.payload.list,
          totalElements: action.payload.totalElements,
          totalPages: action.payload.totalPages,
        },
        page: {
          startIndex: action.payload.startIndex,
          pageSize: action.payload.pageSize,
        },
        reset: false,
        tableDetailsById: { data: {} },
        getError: "",
        addError: "",
        putError: "",
        isTableAdded: false,
        isTableDeleted: false,
        isTableUpdated: false,
      };

    case FETCH_MASTERTABLE_FAILURE:
      return {
        ...state,
        tableDetailsList: { list: [], totalElements: "", totalPages: "" },
        page: {
          startIndex: DEFAULT_START_INDEX,
          pageSize: DEFAULT_PAGE_SIZE,
        },
        reset: false,
        tableDetailsById: { data: {} },
        getError: action.payload,
        addError: "",
        putError: "",
        isTableAdded: false,
        isTableDeleted: false,
        isTableUpdated: false,
      };
    case FETCH_MASTERTABLEBYID_COMPLETE:
      return {
        ...state,
        tableDetailsById: { data: action.payload },
      };
    case FETCH_MASTERTABLEBYID_FAILURE:
      return {
        ...state,
        tableDetailsById: { data: {} },
      };
    case FETCH_COLUMN_LIST_COMPLETE:
      return {
        ...state,
        columnList: action.payload,
      };
    case FETCH_COLUMN_LIST_FAILURE:
      return {
        ...state,
        columnList: [],
      };
    case ADD_MASTERTABLE_COMPLETE:
      return {
        ...state,
        tableDetailsList: {
          ...state.tableDetailsList,
          list: [...state.tableDetailsList.list, action.payload],
        },
        isTableAdded: true,
        addError: "",
      };
    case ADD_MASTERTABLE_ERROR:
      return {
        ...state,
        isTableAdded: false,
        addError: action.payload,
      };

    case ADD_MASTERTABLE_FAILURE:
      return {
        ...state,
        isTableAdded: false,
        addError: action.payload,
      };
    case UPDATE_MASTERTABLE_COMPLETE:
      return {
        ...state,
        isTableUpdated: true,
        putError: "",
      };
    case UPDATE_MASTERTABLE_ERROR:
      return {
        ...state,
        isTableUpdated: false,
        putError: action.payload,
      };

    case UPDATE_MASTERTABLE_FAILURE:
      return {
        ...state,
        isTableUpdated: false,
        putError: action.payload,
      };
    case DELETE_MASTERTABLE_COMPLETE:
      return {
        ...state,
        isTableDeleted: true,
      };
    case DELETE_MASTERTABLE_ERROR:
      return {
        ...state,
        isTableDeleted: false,
      };
    case DELETE_MASTERTABLE_FAILURE:
      return {
        ...state,
        isTableDeleted: false,
      };
    case FETCH_CHILD_TABLE_COMPLETE:
      return {
        ...state,
        childTableList: action.payload,
      };
    case FETCH_CHILD_TABLE_FAILURE:
      return {
        ...state,
        childTableList: {},
      };
    case RESET_DUPLICATE_ERROR:
      return {
        ...state,
        tableDetailsById: { data: {} },
        addError: "",
        putError: "",
        isTableAdded: false,
        isTableDeleted: false,
        isTableUpdated: false,
      };
    case RESET_UPDATE_ERROR:
      return {
        ...state,
        //tableDetailsById:{data: {}},
        //childTableList: {},
        addError: "",
        putError: "",
      };
    case SET_DEFAULT_STARTINDEX:
      return {
        ...state,
        reset: true,
      };
    case FETCH_MASTERTABLEBYMODULE_COMPLETE:
      return {
        ...state,
        tableByModule: action.payload,
      };
    case FETCH_MASTERTABLEBYMODULE_FAILURE:
      return {
        ...state,
        tableByModule: [],
      };
    default:
      return { ...state };
  }
};
