import {
  MASTERSYSVARIABLE_API_URL,
  MASTERSYSVARIABLEBYMODULE_API_URL,
  FETCH_MASTERSYSVARIABLE_COMPLETE,
  FETCH_MASTERSYSVARIABLE_FAILURE,
  FETCH_MASTERSYSVARIABLEBYID_COMPLETE,
  FETCH_MASTERSYSVARIABLEBYID_FAILURE,
  ADD_MASTERSYSVARIABLE_COMPLETE,
  ADD_MASTERSYSVARIABLE_FAILURE,
  ADD_MASTERSYSVARIABLE_ERROR,
  UPDATE_MASTERSYSVARIABLE_COMPLETE,
  UPDATE_MASTERSYSVARIABLE_ERROR,
  UPDATE_MASTERSYSVARIABLE_FAILURE,
  FETCH_MASTERSYSVARIABLEBYMODULEID_COMPLETE,
  FETCH_MASTERSYSVARIABLEBYMODULEID_FAILURE,
  DELETE_MASTERSYSVARIABLE_COMPLETE,
  DELETE_MASTERSYSVARIABLE_FAILURE,
  DELETE_MASTERSYSVARIABLE_ERROR,
  SHOW_SNACKBAR_ACTION,
  START_SPINNER_ACTION,
  // HIDE_MESSAGE_DIALOG,
  // RESET_UPDATE_ERROR,
  // RESET_DUPLICATE_ERROR,
} from "../utils/AppConstants";
import { setRequestHeader, stopLoading } from "../utils/helpers";
import {
  handleAddMasterSystem,
  ERROR_MESSAGE,
  DEFAULT_ERROR_MSG,
  handleUpdateMasterSystem,
  ALREADY_USE_MODULE
} from "../utils/Messages";
//handleMasterSubmoduleTerm, ERROR_MESSAGE, handleUpdateMasterSubmodule, }

export const deleteMasterSystemVariable = (msgConstantID) => {
  let API_URL = MASTERSYSVARIABLE_API_URL + "?id=" + msgConstantID;
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
            (data.responseCode === "201")
          ) {
            dispatch({
              type: DELETE_MASTERSYSVARIABLE_COMPLETE,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: "System Variable deleted successfully",
                severity: "success",
              },
            });
          } 
          else if (data.responseCode === "9155" || data.responseCode === 9155) {
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: ALREADY_USE_MODULE,
                severity: "warning",
              },
            });
          }
          else {
            dispatch({ type: DELETE_MASTERSYSVARIABLE_ERROR, payload: data });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: data.responseMessage || DEFAULT_ERROR_MSG,
                severity: "warning",
              },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: DELETE_MASTERSYSVARIABLE_FAILURE, payload: error });
          dispatch({
            type: SHOW_SNACKBAR_ACTION,
            payload: {
              detail: ERROR_MESSAGE,
              severity: "error",
            },
          });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchMasterSystem = (startIndex, pageSize, search) => {
  let API_URL = MASTERSYSVARIABLE_API_URL + "?sortBy=createdDate";
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
            dispatch({
              type: FETCH_MASTERSYSVARIABLE_COMPLETE,
              payload: {
                pageInfo: data.responseObject,
                startIndex: startIndex,
                pageSize: pageSize,
              },
            });
          } 
          else if (data.responseCode === "9155" || data.responseCode === 9155) {
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: ALREADY_USE_MODULE,
                severity: "warning",
              },
            });
          }
          else {
            dispatch({ type: FETCH_MASTERSYSVARIABLE_FAILURE, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_MASTERSYSVARIABLE_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const AddSystemVariable = (formData) => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(MASTERSYSVARIABLE_API_URL, {
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
              type: ADD_MASTERSYSVARIABLE_COMPLETE,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleAddMasterSystem(formData.code, data.responseCode)
                  .message,
                severity: handleAddMasterSystem(
                  formData.code,
                  data.responseCode
                ).messageType,
              },
            });
          }
          else if (data.responseCode === "9155" || data.responseCode === 9155) {
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: ALREADY_USE_MODULE,
                severity: "warning",
              },
            });
          }
          else {
            dispatch({ type: ADD_MASTERSYSVARIABLE_ERROR, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: ADD_MASTERSYSVARIABLE_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchSystemById = (id) => {
  let API_URL = MASTERSYSVARIABLE_API_URL + "/" + id;
  //let API_URL = 'http://125.63.92.178:8184/config/config/messageconstant/{id}?id=5';
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(API_URL, {
      method: "get",
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
              type: FETCH_MASTERSYSVARIABLEBYID_COMPLETE,
              payload: data.responseObject,
            });
          }
          else if (data.responseCode === "9155" || data.responseCode === 9155) {
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: ALREADY_USE_MODULE,
                severity: "warning",
              },
            });
          }
          else {
            dispatch({
              type: FETCH_MASTERSYSVARIABLEBYID_FAILURE,
              payload: data,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: ERROR_MESSAGE,
                severity: "error",
              },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({
            type: FETCH_MASTERSYSVARIABLEBYID_FAILURE,
            payload: error,
          });
          dispatch({
            type: SHOW_SNACKBAR_ACTION,
            payload: {
              detail: ERROR_MESSAGE,
              severity: "error",
            },
          });
          stopLoading(dispatch);
        }
      );
  };
};

export const updateMasterSystem = (payload) => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(MASTERSYSVARIABLE_API_URL, {
      method: "put",
      body: JSON.stringify(payload),
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
              type: UPDATE_MASTERSYSVARIABLE_COMPLETE,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleUpdateMasterSystem(
                  payload.code,
                  data.responseCode
                ).message,
                severity: handleUpdateMasterSystem(
                  payload.code,
                  data.responseCode
                ).messageType,
              },
            });
          }
          else if (data.responseCode === "9155" || data.responseCode === 9155) {
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: ALREADY_USE_MODULE,
                severity: "warning",
              },
            });
          }
          else {
            dispatch({ type: UPDATE_MASTERSYSVARIABLE_ERROR, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: UPDATE_MASTERSYSVARIABLE_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchMasterSystemByModuleId = (id) => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(MASTERSYSVARIABLEBYMODULE_API_URL, {
      method: "post",
      body:JSON.stringify(id),
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
              type: FETCH_MASTERSYSVARIABLEBYMODULEID_COMPLETE,
              payload: data.responseObject,
            });
          }
          else if (data.responseCode === "9155" || data.responseCode === 9155) {
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: ALREADY_USE_MODULE,
                severity: "warning",
              },
            });
          }
          else {
            dispatch({
              type: FETCH_MASTERSYSVARIABLEBYMODULEID_FAILURE,
              payload: data,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: ERROR_MESSAGE,
                severity: "error",
              },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({
            type: FETCH_MASTERSYSVARIABLEBYMODULEID_FAILURE,
            payload: error,
          });
          dispatch({
            type: SHOW_SNACKBAR_ACTION,
            payload: {
              detail: ERROR_MESSAGE,
              severity: "error",
            },
          });
          stopLoading(dispatch);
        }
      );
  };
};
