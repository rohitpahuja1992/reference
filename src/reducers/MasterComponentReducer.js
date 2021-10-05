import {
  SELECTED_FIELD_DETAILS,
  RESET_FIELD_DETAILS,
  SELECTED_FIELD_PROPERTY,
  RESET_FIELD_PROPERTY,
  RESET_SELECTED_DATA,
  // FETCH_FIELDTYPE_COMPLETE,
  // FETCH_FIELDTYPE_FAILURE
} from "../utils/AppConstants";

const initState = {
  data: {
    componentName: "",
    moduleIds: [],
    config:false,
    column: [
      {
        id: 1,
        primary: true,
        visibility: false,
        label: "",
        fieldType: "",
        limit: {},
        defaultVal: "",
        // config: {
        //   Section: { value: "" },
        //   Label: {
        //     value: "",
        //     mapping: {
        //       method: "Message Constant",
        //       description: {},
        //       oob: false,
        //       property: [],
        //       functionLabel: false,
        //     },
        //   },
        //   Hidden: {
        //     value: "",
        //     mapping: {
        //       method: "System Variable",
        //       description: {},
        //       oob: false,
        //       property: [],
        //       functionLabel: false,
        //     },
        //   },
        //   Mandatory: {
        //     value: "",
        //     mapping: {
        //       method: "System Variable",
        //       description: {},
        //       oob: false,
        //       property: [],
        //       functionLabel: false,
        //     },
        //   },
        //   Disabled: {
        //     value: "",
        //     mapping: {
        //       method: "System Variable",
        //       description: {},
        //       oob: false,
        //       property: [],
        //       functionLabel: false,
        //     },
        //   },
        //   Other: [
        //     {
        //       id: 1,
        //       value: "",
        //       mapping: {
        //         method: "System Variable",
        //         description: {},
        //         property: [],
        //         functionLabel: false,
        //       },
        //     },
        //   ],
        // },
      },
    ],
    selectedFieldId: "",
    selectedOptionId: "",
    selectedData: [],
    selectedFieldProperty: "",
    selectedFieldMapping: {},
  },
};

export const MasterComponentReducer = (state = initState, action) => {
  switch (action.type) {
    case SELECTED_FIELD_DETAILS:
      return {
        ...state,
        data: {
          componentName: action.payload.componentName,
          moduleIds: action.payload.moduleIds,
          config:action.payload.config,
          column: action.payload.column,
          selectedFieldId: action.payload.selectedId,
          selectedData: action.payload.columnData,
          selectedFieldProperty: "",
          selectedFieldMapping: {},
          selectedOptionId: "",
        },
      };
    case RESET_FIELD_DETAILS:
      return {
        ...state,
        data: {
          componentName: "",
          moduleIds: [],
          config:false,
          column: [
            {
              id: 1,
              primary: true,
              visibility: false,
              label: "",
              fieldType: "",
              limit: {},
              defaultVal: "",
              // config: {
              //   Section: { value: "" },
              //   Label: {
              //     value: "",
              //     mapping: {
              //       method: "Message Constant",
              //       description: {},
              //       oob: false,
              //       property: [],
              //       functionLabel: false,
              //     },
              //   },
              //   Hidden: {
              //     value: "",
              //     mapping: {
              //       method: "System Variable",
              //       description: {},
              //       oob: false,
              //       property: [],
              //       functionLabel: false,
              //     },
              //   },
              //   Mandatory: {
              //     value: "",
              //     mapping: {
              //       method: "System Variable",
              //       description: {},
              //       oob: false,
              //       property: [],
              //       functionLabel: false,
              //     },
              //   },
              //   Disabled: {
              //     value: "",
              //     mapping: {
              //       method: "System Variable",
              //       description: {},
              //       oob: false,
              //       property: [],
              //       functionLabel: false,
              //     },
              //   },
              //   Other: [
              //     {
              //       id: 1,
              //       value: "",
              //       mapping: {
              //         method: "System Variable",
              //         description: {},
              //         property: [],
              //         functionLabel: false,
              //       },
              //     },
              //   ],
              // },
            },
          ],
          selectedFieldId: "",
          selectedData: [],
          selectedFieldProperty: "",
          selectedFieldMapping: {},
          selectedOptionId: "",
        },
      };
    case SELECTED_FIELD_PROPERTY:
      return {
        ...state,
        data: {
          ...state.data,
          selectedFieldProperty: action.payload.fieldProperty,
          selectedFieldMapping: action.payload.fieldDetails,
          selectedOptionId: action.payload.optionId,
        },
      };
    case RESET_FIELD_PROPERTY:
      return {
        ...state,
        data: {
          ...state.data,
          selectedFieldProperty: "",
          selectedFieldMapping: {},
          selectedOptionId: "",
        },
      };
    case RESET_SELECTED_DATA:
      return {
        ...state,
        data: {
          ...state.data,
          selectedData: action.payload,
        },
      };
    default:
      return { ...state };
  }
};
