import {
  FETCH_CONTROL_FIELDS_COMPLETE,
  FETCH_CONTROL_FIELDS_ERROR,
  FETCH_CONTROL_FIELDS_FAILED,
  ADD_CONTROL_FIELD_COMPLETE,
  ADD_CONTROL_FIELD_ERROR,
  ADD_CONTROL_FIELD_FAILED,
  RESET_ADD_CONTROL_FIELD_ERROR,
  RESET_ADD_CONTROL_FIELD_IS_DONE,
} from "../utils/AppConstants";

const initState = {
  data: {
    list: [
      {
        id: 0,
        fieldLabel: "Question Type",
        fieldName: "questionType",
        fieldType: "select",
        isFieldRequired: "Yes",
        status: "ACTIVE",
        controlId: 0,
        options: [
          { key: 0, label: "General Question" },
          { key: 1, label: "Incoming  Question" },
          { key: 2, label: "Incoming Fax  Question" },
          { key: 3, label: "Incoming Mail Question" },
          { key: 4, label: "Incoming Verbal Question" },
          { key: 5, label: "Outgoing Question" },
        ],
      },
      {
        id: 1,
        fieldLabel: "Question",
        fieldName: "question",
        fieldType: "textarea",
        isFieldRequired: "Yes",
        status: "ACTIVE",
        controlId: 0,
      },
      {
        id: 2,
        fieldLabel: "Answer",
        fieldName: "answer",
        fieldType: "textarea",
        isFieldRequired: "Yes",
        status: "ACTIVE",
        controlId: 0,
      },
      {
        id: 3,
        fieldLabel: "Label",
        fieldName: "label",
        fieldType: "textbox",
        isFieldRequired: "Yes",
        status: "ACTIVE",
        controlId: 2,
      },
      {
        id: 4,
        fieldLabel: "Back End Name",
        fieldName: "backEndName",
        fieldType: "textbox",
        isFieldRequired: "Yes",
        status: "ACTIVE",
        controlId: 2,
      },
      {
        id: 5,
        fieldLabel: "Mandatory",
        fieldName: "mandatory",
        fieldType: "select",
        isFieldRequired: "Yes",
        status: "ACTIVE",
        controlId: 2,
        options: [
          { key: 0, label: "Yes" },
          { key: 1, label: "No" },
        ],
      },
      {
        id: 6,
        fieldLabel: "Hidden",
        fieldName: "hidden",
        fieldType: "select",
        isFieldRequired: "Yes",
        status: "ACTIVE",
        controlId: 2,
        options: [
          { key: 0, label: "Yes" },
          { key: 1, label: "No" },
        ],
      },
      {
        id: 7,
        fieldLabel: "Disabled",
        fieldName: "disabled",
        fieldType: "select",
        isFieldRequired: "Yes",
        status: "ACTIVE",
        controlId: 2,
        options: [
          { key: 0, label: "Yes" },
          { key: 1, label: "No" },
        ],
      },
      {
        id: 8,
        fieldLabel: "Options",
        fieldName: "options",
        fieldType: "option",
        isFieldRequired: "Yes",
        status: "ACTIVE",
        controlId: 2,
        options: [],
      },
      {
        id: 9,
        fieldLabel: "Label",
        fieldName: "label",
        fieldType: "textbox",
        isFieldRequired: "Yes",
        status: "ACTIVE",
        controlId: 1,
      },
      {
        id: 10,
        fieldLabel: "Back End Name",
        fieldName: "backEndName",
        fieldType: "textbox",
        isFieldRequired: "Yes",
        status: "ACTIVE",
        controlId: 1,
      },
      {
        id: 11,
        fieldLabel: "Mandatory",
        fieldName: "mandatory",
        fieldType: "select",
        isFieldRequired: "Yes",
        status: "ACTIVE",
        controlId: 1,
        options: [
          { key: 0, label: "Yes" },
          { key: 1, label: "No" },
        ],
      },
      {
        id: 12,
        fieldLabel: "Hidden",
        fieldName: "hidden",
        fieldType: "select",
        isFieldRequired: "Yes",
        status: "ACTIVE",
        controlId: 1,
        options: [
          { key: 0, label: "Yes" },
          { key: 1, label: "No" },
        ],
      },
      {
        id: 13,
        fieldLabel: "Disabled",
        fieldName: "disabled",
        fieldType: "select",
        isFieldRequired: "Yes",
        status: "ACTIVE",
        controlId: 1,
        options: [
          { key: 0, label: "Yes" },
          { key: 1, label: "No" },
        ],
      },
      {
        id: 14,
        fieldLabel: "Template Name",
        fieldName: "templateName",
        fieldType: "textbox",
        isFieldRequired: "Yes",
        status: "ACTIVE",
        controlId: 4,
      },
      {
        id: 15,
        fieldLabel: "Template",
        fieldName: "template",
        fieldType: "textarea",
        isFieldRequired: "Yes",
        status: "ACTIVE",
        controlId: 4,
      },
    ],
    isFieldAdded: "",
    error: "",
  },
};

export const ControlGroupReducer = (state = initState, action) => {
  switch (action.type) {
    case FETCH_CONTROL_FIELDS_COMPLETE:
      return {
        ...state,
        data: {
          list: action.payload,
          error: undefined,
        },
      };

    case FETCH_CONTROL_FIELDS_ERROR:
      return {
        ...state,
        data: {
          ...state.data,
          error: action.payload,
        },
      };

    case FETCH_CONTROL_FIELDS_FAILED:
      return {
        ...state,
        data: {
          list: [],
          error: action.payload,
        },
      };

    case ADD_CONTROL_FIELD_COMPLETE:
      const newFieldData = {
        id: state.data.list.length,
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

    case ADD_CONTROL_FIELD_ERROR:
      return {
        ...state,
        data: {
          ...state.data,
          error: undefined,
        },
      };

    case ADD_CONTROL_FIELD_FAILED:
      return {
        ...state,
        data: {
          ...state.data,
          error: undefined,
        },
      };

    case RESET_ADD_CONTROL_FIELD_ERROR:
      return {
        ...state,
        data: { ...state.data, error: undefined },
      };

    case RESET_ADD_CONTROL_FIELD_IS_DONE:
      return {
        ...state,
        data: { ...state.data, isFieldAdded: false },
      };

    default:
      return { ...state };
  }
};
