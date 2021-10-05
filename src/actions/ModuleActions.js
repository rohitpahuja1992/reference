import {
  FETCHMODULE_API_URL,
  FETCH_MODULE_COMPLETE,
  FETCH_MODULE_FAILURE,
  UPDATE_MODULE_DIALOG,
  ADDMODULE_API_URL,
  ADD_MODULE_COMPLETE,
  ADD_MODULE_FAILURE,
  ADD_MODULE_ERROR,
  DELETEMODULE_API_URL,
  DELETE_MODULE_COMPLETE,
  DELETE_MODULE_FAILURE,
  DELETE_MODULE_ERROR,
  UPDATEMODULE_API_URL,
  UPDATE_MODULE_COMPLETE,
  UPDATE_MODULE_ERROR,
  UPDATE_MODULE_FAILURE,
  SHOW_SNACKBAR_ACTION,
  START_SPINNER_ACTION,
  HIDE_MESSAGE_DIALOG,
  RESET_DUPLICATE_ERROR,
} from "../utils/AppConstants";
import { setRequestHeader, stopLoading } from "../utils/helpers";
import {
  handleAddModule,
  handleDeleteModule,
  handleUpdateModule,
} from "../utils/Messages";
export const fetchModule = () => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(FETCHMODULE_API_URL, {
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            data.responseObject.sort((a, b) => (a.id < b.id ? 1 : -1));
            dispatch({
              type: FETCH_MODULE_COMPLETE,
              payload: data.responseObject,
            });
          } else {
            dispatch({ type: FETCH_MODULE_FAILURE, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_MODULE_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const addModule = (formData) => {
  let addModuleFormData = {
    moduleName: formData.moduleName.trim(),
    description: formData.description,
  };
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(ADDMODULE_API_URL, {
      method: "post",
      body: JSON.stringify(addModuleFormData),
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
              type: ADD_MODULE_COMPLETE,
              //payload: data.responseObject,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleAddModule(
                  addModuleFormData.moduleName,
                  data.responseCode
                ).message,
                severity: handleAddModule(
                  addModuleFormData.moduleName,
                  data.responseCode
                ).messageType,
              },
            });
          } else {
            dispatch({ type: ADD_MODULE_ERROR, payload: data });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleAddModule(
                  addModuleFormData.moduleName,
                  data.responseCode
                ).message,
                severity: handleAddModule(
                  addModuleFormData.moduleName,
                  data.responseCode
                ).messageType,
              },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: ADD_MODULE_FAILURE, payload: error });
          dispatch({
            type: SHOW_SNACKBAR_ACTION,
            payload: {
              detail: handleAddModule(addModuleFormData.moduleName, "").message,
              severity: handleAddModule(addModuleFormData.moduleName, "")
                .messageType,
            },
          });
          stopLoading(dispatch);
        }
      );
  };
};

export const deleteModule = (moduleId, moduleName) => {
  let DELETE_MODULE_API = DELETEMODULE_API_URL + moduleId;
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(DELETE_MODULE_API, {
      method: "put",
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            // var foundIndex = moduleData.list.findIndex(
            //   (x) => x.id === moduleId
            // );
            // moduleData.list[foundIndex] = data.responseObject;
            dispatch({
              type: DELETE_MODULE_COMPLETE,
              //payload: moduleData.list,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleDeleteModule(moduleName, data.responseCode)
                  .message,
                severity: handleDeleteModule(moduleName, data.responseCode)
                  .messageType,
              },
            });
          } else {
            dispatch({ type: DELETE_MODULE_ERROR, payload: data });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleDeleteModule(moduleName, data.responseCode)
                  .message,
                severity: handleDeleteModule(moduleName, data.responseCode)
                  .messageType,
              },
            });
          }
          stopLoading(dispatch);
          dispatch({ type: HIDE_MESSAGE_DIALOG, payload: undefined });
        },
        (error) => {
          dispatch({ type: DELETE_MODULE_FAILURE, payload: error });
          stopLoading(dispatch);
          dispatch({ type: HIDE_MESSAGE_DIALOG, payload: undefined });
          dispatch({
            type: SHOW_SNACKBAR_ACTION,
            payload: {
              detail: handleDeleteModule(moduleName, "").message,
              severity: handleDeleteModule(moduleName, "").messageType,
            },
          });
        }
      );
  };
};

export const updateModule = (formData) => {
  let updateModuleFormData = {
    id: formData.moduleId,
    moduleName: formData.moduleName.trim(),
    description: formData.description,
    status: formData.status === "ACTIVE" ? 0 : 1,
  };

  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(UPDATEMODULE_API_URL, {
      method: "put",
      body: JSON.stringify(updateModuleFormData),
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            // var foundIndex = moduleDetails.list.findIndex(
            //   (x) => x.id === parseInt(formData.moduleId)
            // );
            // moduleDetails.list[foundIndex] = data.responseObject;
            dispatch({
              type: UPDATE_MODULE_COMPLETE,
              //payload: moduleDetails.list,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleUpdateModule(
                  updateModuleFormData.moduleName,
                  data.responseCode
                ).message,
                severity: handleUpdateModule(
                  updateModuleFormData.moduleName,
                  data.responseCode
                ).messageType,
              },
            });
          } else {
            dispatch({ type: UPDATE_MODULE_ERROR, payload: data });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleUpdateModule(
                  updateModuleFormData.moduleName,
                  data.responseCode
                ).message,
                severity: handleUpdateModule(
                  updateModuleFormData.moduleName,
                  data.responseCode
                ).messageType,
              },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: UPDATE_MODULE_FAILURE, payload: error });
          dispatch({
            type: SHOW_SNACKBAR_ACTION,
            payload: {
              detail: handleUpdateModule(updateModuleFormData.moduleName, "")
                .message,
              severity: handleUpdateModule(updateModuleFormData.moduleName, "")
                .messageType,
            },
          });
          stopLoading(dispatch);
        }
      );
  };
};

export const setUpdate = (input) => {
  return {
    type: UPDATE_MODULE_DIALOG,
    payload: input,
  };
};

export const resetDuplicateError = () => {
  return {
    type: RESET_DUPLICATE_ERROR,
    payload: undefined,
  };
};
