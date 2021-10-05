import { SELECTED_FIELD_DETAILS,SELECTED_FIELD_PROPERTY, RESET_SELECTED_DATA,
START_SPINNER_ACTION,FETCH_FIELDTYPE_API_URL,FETCH_FIELDTYPE_COMPLETE,FETCH_FIELDTYPE_FAILURE } from "../utils/AppConstants";
import { setRequestHeader, stopLoading } from "../utils/helpers";
import { DEFAULT_ERROR_MSG } from "../utils/Messages";

export const updateFieldData = (componentName,config, moduleIds,column,selectedId,columnData,) => {
  let data = {
    componentName: componentName,
    config:config,
    moduleIds:moduleIds,
    column:column,
    selectedId:selectedId,
    columnData:columnData
  }
  return (dispatch) => {
    dispatch({ type: SELECTED_FIELD_DETAILS, payload: data });
  };
};

export const updateFieldProperty = (fieldProperty, fieldDetails, optionId) => {
  return (dispatch) => {
    dispatch({
      type: SELECTED_FIELD_PROPERTY,
      payload: {
        fieldProperty: fieldProperty,
        fieldDetails: fieldDetails,
        optionId: optionId,
      },
    });
  };
};

export const resetSelectedData = (selectedData) => {
  return (dispatch) => {
    dispatch({ type: RESET_SELECTED_DATA, payload: selectedData});
  };
};

export const fetchFieldType = () => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(FETCH_FIELDTYPE_API_URL, {
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (data && !data.hasOwnProperty("error")) {
            dispatch({ type: FETCH_FIELDTYPE_COMPLETE, payload: data });
          } else {
            dispatch({
              type: FETCH_FIELDTYPE_FAILURE,
              payload: data ? data : { message: DEFAULT_ERROR_MSG },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_FIELDTYPE_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

