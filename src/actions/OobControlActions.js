import {
  ADD_OOB_CONTROL_COMPLETE,
  ADD_OOB_CONTROL_ERROR,
  ADD_OOB_CONTROL_FAILED,
  ADD_OOBCOMPONENT_API_URL,
  FETCH_OOB_CONTROL_COMPLETE,
  FETCH_OOB_CONTROL_ERROR,
  FETCH_OOB_CONTROL_FAILED,
  DELETE_OOBCONTROL_COMPLETE,
  DELETE_OOBCONTROL_FAILURE,
  START_SPINNER_ACTION,
  SHOW_SNACKBAR_ACTION,
  OOB_CONTROL_API_URL,
  FETCH_OOB_CONTROL_BY_ID_COMPLETE,
  FETCH_OOB_CONTROL_BY_ID_ERROR,
  FETCH_OOB_CONTROL_BY_ID_FAILED,
  UPDATE_OOB_CONTROL_COMPLETE,
  UPDATE_OOB_CONTROL_ERROR,
  UPDATE_OOB_CONTROL_FAILED,
  HIDE_MESSAGE_DIALOG,
} from "../utils/AppConstants";
import { setRequestHeader, stopLoading } from "../utils/helpers";
import {
  handleAddOobControl,
  handleUpdateOobControl,
  handleAddOobControlConfigMapping,
  handleDeleteOobControlConfigMapping,
  handleDeleteOOBControl,
} from "../utils/Messages";

export const fetchOobControl = (
  oobSubmoduleId,
  startIndex,
  pageSize,
  search
) => {
  let API_URL = `${OOB_CONTROL_API_URL}/${oobSubmoduleId}`;
  if (pageSize)
    API_URL = API_URL + "?&startIndex=" + startIndex + "&pageSize=" + pageSize;
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
                a.createdDate < b.createdDate ? -1 : 1
              );
              controls = data.responseObject.controls.map((control) => {
                if (control.controlData) {
                  control.controlData = JSON.parse(control.controlData);
                }
                return control;
              });
            }

            dispatch({
              type: FETCH_OOB_CONTROL_COMPLETE,
              payload: {
                controls: controls,
                pageInfo: data.responseObject,
                startIndex: startIndex,
                pageSize: pageSize,
              },
            });
          } else {
            dispatch({ type: FETCH_OOB_CONTROL_ERROR, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_OOB_CONTROL_FAILED, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const addOobControl = (fromObj,id) => {
  let formData = {
    mapFields: [JSON.stringify(fromObj)],
    oobComponentId:id
  }
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(ADD_OOBCOMPONENT_API_URL, {
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
              type: ADD_OOB_CONTROL_COMPLETE,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleAddOobControl("", data.responseCode).message,
                severity: handleAddOobControl("", data.responseCode)
                  .messageType,
              },
            });
          } else {
            dispatch({ type: ADD_OOB_CONTROL_ERROR, payload: data });
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
          dispatch({ type: ADD_OOB_CONTROL_FAILED, payload: error });
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

export const fetchOobControlById = (oobControlId) => {
  const API_URL = `${OOB_CONTROL_API_URL}/controlById/${oobControlId}`;
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
            let controlByIdData = "";

            if (data.responseObject) {
              controlByIdData = data.responseObject;
              controlByIdData.control.format = JSON.parse(
                controlByIdData.control.format
              );
              controlByIdData.controlData = JSON.parse(
                controlByIdData.controlData
              );
            }
            dispatch({
              type: FETCH_OOB_CONTROL_BY_ID_COMPLETE,
              payload: controlByIdData,
            });
          } else {
            dispatch({ type: FETCH_OOB_CONTROL_BY_ID_ERROR, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_OOB_CONTROL_BY_ID_FAILED, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const updateOobControl = (fromObj) => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(OOB_CONTROL_API_URL, {
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
            let controlByIdData = "";
            if (data.responseObject && data.responseObject.controls) {
              controlByIdData = data.responseObject.controls;
              controlByIdData.control.format = JSON.parse(
                controlByIdData.control.format
              );
              controlByIdData.controlData = JSON.parse(
                controlByIdData.controlData
              );
            }
            dispatch({
              type: UPDATE_OOB_CONTROL_COMPLETE,
              payload: controlByIdData,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleUpdateOobControl(data.responseCode).message,
                severity: handleUpdateOobControl(data.responseCode).messageType,
              },
            });
          } else {
            dispatch({ type: UPDATE_OOB_CONTROL_ERROR, payload: data });
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
          dispatch({ type: UPDATE_OOB_CONTROL_FAILED, payload: error });
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

export const AddOobControlConfigMapping = (fromObj, fieldProperty) => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(OOB_CONTROL_API_URL, {
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
            let controlByIdData = "";
            if (data.responseObject && data.responseObject.controls) {
              controlByIdData = data.responseObject.controls;
              controlByIdData.control.format = JSON.parse(
                controlByIdData.control.format
              );
              controlByIdData.controlData = JSON.parse(
                controlByIdData.controlData
              );
            }
            dispatch({
              type: UPDATE_OOB_CONTROL_COMPLETE,
              payload: controlByIdData,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleAddOobControlConfigMapping(
                  fieldProperty,
                  data.responseCode
                ).message,
                severity: handleAddOobControlConfigMapping(
                  fieldProperty,
                  data.responseCode
                ).messageType,
              },
            });
          } else {
            dispatch({ type: UPDATE_OOB_CONTROL_ERROR, payload: data });
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
          dispatch({ type: UPDATE_OOB_CONTROL_FAILED, payload: error });
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

export const deleteOobControlConfigMapping = (fromObj, fieldProperty) => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(OOB_CONTROL_API_URL, {
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
            let controlByIdData = "";
            if (data.responseObject && data.responseObject.controls) {
              controlByIdData = data.responseObject.controls;
              controlByIdData.control.format = JSON.parse(
                controlByIdData.control.format
              );
              controlByIdData.controlData = JSON.parse(
                controlByIdData.controlData
              );
            }
            dispatch({
              type: UPDATE_OOB_CONTROL_COMPLETE,
              payload: controlByIdData,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleDeleteOobControlConfigMapping(
                  fieldProperty,
                  data.responseCode
                ).message,
                severity: handleDeleteOobControlConfigMapping(
                  fieldProperty,
                  data.responseCode
                ).messageType,
              },
            });
          } else {
            dispatch({ type: UPDATE_OOB_CONTROL_ERROR, payload: data });
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
          dispatch({ type: UPDATE_OOB_CONTROL_FAILED, payload: error });
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

export const deleteOOBControl = (controlId, controlName) => {
  let API_URL = OOB_CONTROL_API_URL + "/" + controlId;
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
              type: DELETE_OOBCONTROL_COMPLETE,
              //payload: moduleData.list,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleDeleteOOBControl(controlName, data.responseCode)
                  .message,
                severity: handleDeleteOOBControl(controlName, data.responseCode)
                  .messageType,
              },
            });
          } else {
            dispatch({ type: DELETE_OOBCONTROL_FAILURE, payload: data });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleDeleteOOBControl(controlName, data.responseCode)
                  .message,
                severity: handleDeleteOOBControl(controlName, data.responseCode)
                  .messageType,
              },
            });
          }
          stopLoading(dispatch);
          dispatch({ type: HIDE_MESSAGE_DIALOG, payload: undefined });
        },
        (error) => {
          dispatch({ type: DELETE_OOBCONTROL_FAILURE, payload: error });
          stopLoading(dispatch);
          dispatch({ type: HIDE_MESSAGE_DIALOG, payload: undefined });
          dispatch({
            type: SHOW_SNACKBAR_ACTION,
            payload: {
              detail: handleDeleteOOBControl(controlName, "").message,
              severity: handleDeleteOOBControl(controlName, "").messageType,
            },
          });
        }
      );
  };
};
