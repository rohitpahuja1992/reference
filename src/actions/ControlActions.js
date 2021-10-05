import {
  // UPDATE_CONTROL_COMPLETE,
  ADD_OOB_CONTROL_COMPLETE,
  ADD_OOB_CONTROL_FIELD_COMPLETE,
  FETCH_OOB_CONTROL_COMPLETE,
  FETCH_OOB_CONTROL_FIELDS_COMPLETE,
  ADD_CONTROL_COMPLETE,
  ADD_CONTROL_ERROR,
  //ADD_CONTROL_FAILED,
  MASTER_CONTROL_API_URL,
  START_SPINNER_ACTION,
  SHOW_SNACKBAR_ACTION,
  FETCH_CONTROL_COMPLETE,
  FETCH_CONTROL_ERROR,
  FETCH_CONTROL_FAILED,
  FETCH_INDIVIDUAL_CONTROL_COMPLETE,
  FETCH_INDIVIDUAL_CONTROL_ERROR,
  FETCH_INDIVIDUAL_CONTROL_FAILURE,
  ADD_MASTER_CONTROL_FIELD_COMPLETE,
  ADD_MASTER_CONTROL_FIELD_ERROR,
  ADD_MASTER_CONTROL_FIELD_FAILED,
  DELETE_MASTERCONTROL_COMPLETE,
  DELETE_MASTERCONTROL_FAILURE,
  HIDE_MESSAGE_DIALOG,
  DELETE_CONTROL_PROPERTY_COMPLETE,
  DELETE_CONTROL_PROPERTY_FAILURE,
} from "../utils/AppConstants";
import { setRequestHeader, stopLoading } from "../utils/helpers";
import { handleMasterControlTerm, OBBPropertyTerm, WARNING} from "../utils/Messages";
  //handleAddMasterControl, handleDeleteControlField, handleAddControlField ,handleDeleteMasterControl

export const fetchMasterControl = (startIndex, pageSize, search) => {
  let API_URL = MASTER_CONTROL_API_URL + "?&sortBy=createdDate";
  if (pageSize)
    API_URL = API_URL + "&startIndex=" + startIndex + "&pageSize=" + pageSize;
  if (search) API_URL = API_URL + "&search=" + search.trim();
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(API_URL, {
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            let controls = [];
            if (data.responseObject && data.responseObject.controls) {
              data.responseObject.controls.sort((a, b) =>
                a.createdDate < b.createdDate ? 1 : -1
              );
              controls = data.responseObject.controls.map((control) => {
                if (control.format) {
                  control.format = JSON.parse(control.format);
                }
                return control;
              });
            }

            dispatch({
              type: FETCH_CONTROL_COMPLETE,
              payload: {
                controls: controls,
                pageInfo: data.responseObject,
                startIndex: startIndex,
                pageSize: pageSize,
              },
            });
          } else {
            dispatch({ type: FETCH_CONTROL_ERROR, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_CONTROL_FAILED, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchMasterControlById = (controlId) => {
  const API_URL = `${MASTER_CONTROL_API_URL}/${controlId}`;
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(API_URL, {
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            let controls = "";
            if (data.responseObject && data.responseObject.controls) {
              controls = data.responseObject.controls;
              controls.format = JSON.parse(controls.format);
            }

            dispatch({
              type: FETCH_INDIVIDUAL_CONTROL_COMPLETE,
              payload: controls,
            });
          } else {
            dispatch({ type: FETCH_INDIVIDUAL_CONTROL_ERROR, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_INDIVIDUAL_CONTROL_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const addMasterControl = (fromObj) => {
  let formData = {
    name: fromObj.controlName.trim(),
    // internalName: fromObj.internalName,
    description: fromObj.description,
    type: fromObj.controlType,
    format: fromObj.controlData,
  };
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(MASTER_CONTROL_API_URL, {
      method: "post",
      body: JSON.stringify(formData),
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "201" || data.responseCode === 201)
          ) {
            dispatch({
              type: ADD_CONTROL_COMPLETE,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: `Control ${formData.name} successfully added.`,
                severity: "success",
              },
            });
          } else {
            dispatch({ type: ADD_CONTROL_ERROR, payload: data });
            // dispatch({
            //   type: SHOW_SNACKBAR_ACTION,
            //   payload: {
            //     detail: "An error occurred. Please try again later.",
            //     severity: "error",
            //   },
            // });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: ADD_CONTROL_ERROR, payload: error });
          // dispatch({
          //   type: SHOW_SNACKBAR_ACTION,
          //   payload: {
          //     detail: "An error occurred. Please try again later.",
          //     severity: "error",
          //   },
          // });
          stopLoading(dispatch);
        }
      );
  };
};

export const addControlField = (fromObj) => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(MASTER_CONTROL_API_URL, {
      method: "put",
      body: JSON.stringify(fromObj),
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "201" || data.responseCode === 201)
          ) {
            dispatch({
              type: ADD_MASTER_CONTROL_FIELD_COMPLETE,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: `Property "${
                  fromObj.format[fromObj.format.length - 1].fieldLabel
                }" successfully added.`,
                severity: "success",
              },
            });
          } else {
            dispatch({ type: ADD_MASTER_CONTROL_FIELD_ERROR, payload: data });
            // dispatch({
            //   type: SHOW_SNACKBAR_ACTION,
            //   payload: {
            //     detail: "An error occurred. Please try again later.",
            //     severity: "error",
            //   },
            // });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: ADD_MASTER_CONTROL_FIELD_FAILED, payload: error });
          // dispatch({
          //   type: SHOW_SNACKBAR_ACTION,
          //   payload: {
          //     detail: "An error occurred. Please try again later.",
          //     severity: "error",
          //   },
          // });
          stopLoading(dispatch);
        }
      );
  };
};

export const deleteControlField = (fromObj, propertyName, controlName) => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(MASTER_CONTROL_API_URL, {
      method: "put",
      body: JSON.stringify(fromObj),
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "201" || data.responseCode === 201)
          ) {
            dispatch({
              type: DELETE_CONTROL_PROPERTY_COMPLETE,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: `The property "${propertyName}" successfully termed.`,
                severity: "success",
              },
            });
          } else {
            dispatch({ type: DELETE_CONTROL_PROPERTY_FAILURE, payload: data });
            if (
              data &&
              data.responseCode &&
              data.responseCode === "2054"
            ) {
              dispatch({
                type: SHOW_SNACKBAR_ACTION,
                payload: {
                  detail: OBBPropertyTerm(controlName),
                  severity: WARNING,
                },
              });
            } else {
              dispatch({
                type: SHOW_SNACKBAR_ACTION,
                payload: {
                  detail: "An error occured. Please try again later.",
                  severity: "error",
                },
              });
            }
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: HIDE_MESSAGE_DIALOG, payload: undefined });
          dispatch({ type: DELETE_CONTROL_PROPERTY_FAILURE, payload: error });
          dispatch({
            type: SHOW_SNACKBAR_ACTION,
            payload: {
              detail: "An error occured. Please try again later.",
              severity: "error",
            },
          });
          stopLoading(dispatch);
        }
      );
  };
};

export const addOobControl = (fromObj) => {
  let formData = {
    name: fromObj.controlName,
    internalName: fromObj.internalName,
    noOfFields: 0,
    description: fromObj.description,
    status: "ACTIVE",
  };
  return (dispatch) => {
    dispatch({ type: ADD_OOB_CONTROL_COMPLETE, payload: formData });
  };
};

export const addOobControlField = (fromObj) => {
  return (dispatch) => {
    dispatch({ type: ADD_OOB_CONTROL_FIELD_COMPLETE, payload: fromObj });
  };
};

export const ImportControl = (controlsData, fieldsData) => {
  return (dispatch) => {
    dispatch({ type: FETCH_OOB_CONTROL_COMPLETE, payload: controlsData });
    dispatch({ type: FETCH_OOB_CONTROL_FIELDS_COMPLETE, payload: fieldsData });
  };
};

export const deleteMasterControl = (controlId, controlName) => {
  let API_URL = MASTER_CONTROL_API_URL + "/" + controlId;
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(API_URL, {
      method: "delete",
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            dispatch({
              type: DELETE_MASTERCONTROL_COMPLETE,
              //payload: moduleData.list,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: "Control " + controlName + " successfully termed.",
                severity: "success",
              },
            });
          } else {
            dispatch({ type: DELETE_MASTERCONTROL_FAILURE, payload: data });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleMasterControlTerm(controlName, data.responseCode)
                  .message,
                severity: handleMasterControlTerm(
                  controlName,
                  data.responseCode
                ).messageType,
              },
            });
          }
          stopLoading(dispatch);
          dispatch({ type: HIDE_MESSAGE_DIALOG, payload: undefined });
        },
        (error) => {
          dispatch({ type: DELETE_MASTERCONTROL_FAILURE, payload: error });
          stopLoading(dispatch);
          dispatch({ type: HIDE_MESSAGE_DIALOG, payload: undefined });
          dispatch({
            type: SHOW_SNACKBAR_ACTION,
            payload: {
              detail: handleMasterControlTerm(controlName, "", error).message,
              severity: handleMasterControlTerm(controlName, "", error)
                .messageType,
            },
          });
        }
      );
  };
};
