import {
  ADD_OOB_COMPONENT_COMPLETE,
  ADD_OOB_COMPONENT_ERROR,
  ADD_OOB_COMPONENT_FAILED,
  ADD_OOBCOMPONENT_API_URL,
  FETCH_OOB_COMPONENT_COMPLETE,
  FETCH_OOB_COMPONENT_ERROR,
  FETCH_OOB_COMPONENT_FAILED,
  FETCH_OOBCOMPONENT_API_URL,
  DELETE_OOBCOMPONENT_COMPLETE,
  DELETE_OOBCOMPONENT_FAILURE,
  DELETE_OOBCOMPONENT_API_URL,
  START_SPINNER_ACTION,
  SHOW_SNACKBAR_ACTION,
  OOB_COMPONENT_API_URL,
  FETCH_OOB_COMPONENT_BY_ID_COMPLETE,
  FETCH_OOB_COMPONENT_BY_ID_ERROR,
  FETCH_OOB_COMPONENT_BY_ID_FAILED,
  UPDATE_OOB_COMPONENT_COMPLETE,
  UPDATE_OOB_COMPONENT_ERROR,
  UPDATE_OOB_COMPONENT_FAILED,
  UPDATE_OOBCOMPONENT_API_URL,
  RESET_OOB_DUPLICATE_ERROR,
  FETCH_OOB_CONFIG_COMPONENT_BY_ID_COMPLETE,
  FETCH_OOB_CONFIG_COMPONENT_BY_ID_ERROR,
  FETCH_OOB_CONFIG_COMPONENT_BY_ID_FAILED,
  HIDE_MESSAGE_DIALOG,

} from "../utils/AppConstants";
import { setRequestHeader, stopLoading } from "../utils/helpers";
import {
  handleAddOobControl,
  handleUpdateOobControl,
  handleAddOobControlConfigMapping,
  handleDeleteOobControlConfigMapping,
  handleDeleteOOBControl,
  DEFAULT_ERROR_MSG
} from "../utils/Messages";

export const fetchOobComponent = (
  oobSubmoduleId,
  startIndex,
  pageSize,
  search
) => {
  let API_URL = `${FETCH_OOBCOMPONENT_API_URL}/${oobSubmoduleId}`;
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
            //let component = [];
            // if (data.responseObject && data.responseObject) {

            //   component = data.responseObject.component.map((data) => {
            //     if (data.controlData) {
            //       data.controlData = JSON.parse(data.controlData);
            //     }
            //     return component;
            //   });
            // }

            dispatch({
              type: FETCH_OOB_COMPONENT_COMPLETE,
              payload: {
                data: data.responseObject.oobComponentData,
                totalElements: data.responseObject.totalElements,
                totalPages: data.responseObject.totalPages,
                startIndex: startIndex,
                pageSize: pageSize,
                oobSubmoduleId: oobSubmoduleId
              }
            });
          } else {
            dispatch({ type: FETCH_OOB_COMPONENT_ERROR, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_OOB_COMPONENT_FAILED, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const resetOobError = () => {
  return {
    type: RESET_OOB_DUPLICATE_ERROR,
    payload: undefined,
  };
};

export const addOobComponent = (fromObj, id, primaryField, viewOrder) => {
  let formData = {
    mapFields: [JSON.stringify(fromObj)],
    oobComponentId: id,
    viewOrder: viewOrder,
    primaryField: primaryField,
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
              type: ADD_OOB_COMPONENT_COMPLETE,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleAddOobControl("", data.responseCode).message,
                severity: handleAddOobControl("", data.responseCode)
                  .messageType,
              },
            });
          }
          else if(data.responseCode == "2259") {
            dispatch({ type: ADD_OOB_COMPONENT_ERROR, payload: data });
          }
          else {
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: data.responseMessage || DEFAULT_ERROR_MSG,
                severity: "warning"
              },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: ADD_OOB_COMPONENT_FAILED, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchOobConfigComponentById = (oobComponentId, oobFieldId) => {
  const API_URL = `${FETCH_OOBCOMPONENT_API_URL}/${oobComponentId}/${oobFieldId}`;
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

            dispatch({
              type: FETCH_OOB_CONFIG_COMPONENT_BY_ID_COMPLETE,
              payload: {
                data: data.responseObject,
              }
            });
          } else {
            dispatch({ type: FETCH_OOB_CONFIG_COMPONENT_BY_ID_ERROR, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_OOB_CONFIG_COMPONENT_BY_ID_FAILED, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchOobComponentById = (oobComponentId, oobFieldId) => {
  const API_URL = `${FETCH_OOBCOMPONENT_API_URL}/${oobComponentId}/${oobFieldId}`;
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

            dispatch({
              type: FETCH_OOB_COMPONENT_BY_ID_COMPLETE,
              payload: {
                data: data.responseObject,
              }
            });
          } else {
            dispatch({ type: FETCH_OOB_COMPONENT_BY_ID_ERROR, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_OOB_COMPONENT_BY_ID_FAILED, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const updateOobComponent = (fieldId, formData, config, primaryVal) => {
  let formObj = {
    "id": fieldId,
    "mapField": JSON.stringify(formData),
    "mapConfig": JSON.stringify(config),
    "primaryField": primaryVal,
  }
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(UPDATE_OOBCOMPONENT_API_URL, {
      method: "put",
      body: JSON.stringify(formObj),
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            // let controlByIdData = "";
            // if (data.responseObject && data.responseObject.controls) {
            //   controlByIdData = data.responseObject.controls;
            //   controlByIdData.control.format = JSON.parse(
            //     controlByIdData.control.format
            //   );
            //   controlByIdData.controlData = JSON.parse(
            //     controlByIdData.controlData
            //   );
            // }
            dispatch({
              type: UPDATE_OOB_COMPONENT_COMPLETE,
              payload: data.responseObject,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleUpdateOobControl(data.responseCode).message,
                severity: handleUpdateOobControl(data.responseCode).messageType,
              },
            });
          } else {
            dispatch({ type: UPDATE_OOB_COMPONENT_ERROR, payload: data });
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
          dispatch({ type: UPDATE_OOB_COMPONENT_FAILED, payload: error });
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

export const AddOobComponentConfigMapping = (fromObj, fieldProperty) => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(OOB_COMPONENT_API_URL, {
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
              type: UPDATE_OOB_COMPONENT_COMPLETE,
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
            dispatch({ type: UPDATE_OOB_COMPONENT_ERROR, payload: data });
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
          dispatch({ type: UPDATE_OOB_COMPONENT_FAILED, payload: error });
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

export const deleteOOBComponentByIdConfigMapping = (fromObj, fieldProperty) => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(OOB_COMPONENT_API_URL, {
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
              type: UPDATE_OOB_COMPONENT_COMPLETE,
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
            dispatch({ type: UPDATE_OOB_COMPONENT_ERROR, payload: data });
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
          dispatch({ type: UPDATE_OOB_COMPONENT_FAILED, payload: error });
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

export const deleteOOBComponentById = (id, name) => {
  let API_URL = DELETE_OOBCOMPONENT_API_URL + "/" + id;
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
              type: DELETE_OOBCOMPONENT_COMPLETE,
              //payload: moduleData.list,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleDeleteOOBControl(name, data.responseCode)
                  .message,
                severity: handleDeleteOOBControl(name, data.responseCode)
                  .messageType,
              },
            });
          }
          else if (data.responseCode === "2263" || data.responseCode === 2263) {
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: "Module Version is labeled",
                severity: "warning",
              },
            });
          }
          else {
            dispatch({ type: DELETE_OOBCOMPONENT_FAILURE, payload: data });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleDeleteOOBControl(name, data.responseCode)
                  .message,
                severity: handleDeleteOOBControl(name, data.responseCode)
                  .messageType,
              },
            });
          }
          stopLoading(dispatch);
          dispatch({ type: HIDE_MESSAGE_DIALOG, payload: undefined });
        },
        (error) => {
          dispatch({ type: DELETE_OOBCOMPONENT_FAILURE, payload: error });
          stopLoading(dispatch);
          dispatch({ type: HIDE_MESSAGE_DIALOG, payload: undefined });
          dispatch({
            type: SHOW_SNACKBAR_ACTION,
            payload: {
              detail: handleDeleteOOBControl(name, "").message,
              severity: handleDeleteOOBControl(name, "").messageType,
            },
          });
        }
      );
  };
};
