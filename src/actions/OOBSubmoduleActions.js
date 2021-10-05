import {
  //FETCH_OOBSUBMODULEBYID_API_URL,
  OOB_MODULE_API_URL,
  OOB_COMPONENT_API_URL,
  FETCH_OOBSUBMODULEBYOOBMODULEID_COMPLETE,
  FETCH_OOBSUBMODULEBYOOBMODULEID_FAILURE,
  START_SPINNER_ACTION,
  OOB_SUBMODULE_API_URL,
  FETCH_OOB_SUBMODULE_COMPLETE,
  FETCH_OOB_SUBMODULE_FAILURE,
  ADD_OOB_SUBMODULE_COMPLETE,
  ADD_OOB_SUBMODULE_FAILURE,
  DELETE_OOBSUBMODULE_COMPLETE,
  DELETE_OOBSUBMODULE_FAILURE,
  HIDE_MESSAGE_DIALOG,
  SHOW_SNACKBAR_ACTION,
  RESET_DUPLICATE_ERROR,
  FETCH_OOB_SUBMODULE_BY_ID_COMPLETE,
  FETCH_OOB_SUBMODULE_BY_ID_FAILURE,
} from "../utils/AppConstants";
import { setRequestHeader, stopLoading } from "../utils/helpers";
import { handleDeleteOobSubmodule, handleAddOobSubmodule } from "../utils/Messages"
export const fetchOobSubmodule = () => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(OOB_SUBMODULE_API_URL, {
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            // data.responseObject.modules.sort((a, b) => (a.id < b.id ? 1 : -1));
            dispatch({
              type: FETCH_OOB_SUBMODULE_COMPLETE,
              payload: data.responseObject.oobSubmodules,
            });
          }
          else if (data.responseCode === "9146" || data.responseCode === 9146) {
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: "Invalid config table",
                severity: "error",
              },
            });
          }
          else {
            dispatch({ type: FETCH_OOB_SUBMODULE_FAILURE, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_OOB_SUBMODULE_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const addOobSubmodule = (addOOBSubmoduleFormData) => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(OOB_SUBMODULE_API_URL, {
      method: "post",
      body: JSON.stringify(addOOBSubmoduleFormData),
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
              type: ADD_OOB_SUBMODULE_COMPLETE,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleAddOobSubmodule("", data.responseCode).message,
                severity: handleAddOobSubmodule("", data.responseCode).messageType,
              },
            });
          } else {
            dispatch({ type: ADD_OOB_SUBMODULE_FAILURE, payload: data });
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
          dispatch({ type: ADD_OOB_SUBMODULE_FAILURE, payload: error });
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

export const fetchOOBSubmodulesByOOBModuleId = (
  moduleId,
  versionId,
  startIndex,
  pageSize,
  search
) => {
  let API_URL = OOB_MODULE_API_URL + "/" + moduleId + "/" + versionId + "?&sortBy=createdDate";
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
            data.responseObject.oobComponents.sort((a, b) =>
              a.versions[a.versions.length - 1].createdDate <
                b.versions[b.versions.length - 1].createdDate
                ? 1
                : -1
            );
            dispatch({
              type: FETCH_OOBSUBMODULEBYOOBMODULEID_COMPLETE,
              payload: {
                pageInfo: data.responseObject,
                startIndex: startIndex,
                pageSize: pageSize,
                moduleId: moduleId
              },
              //payload: data.responseObject.oobSubmodules,
            });
          } else {
            dispatch({
              type: FETCH_OOBSUBMODULEBYOOBMODULEID_FAILURE,
              payload: data,
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({
            type: FETCH_OOBSUBMODULEBYOOBMODULEID_FAILURE,
            payload: error,
          });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchOOBSubmodulesById = (oobSubmoduleId) => {
  let API_URL =
    OOB_COMPONENT_API_URL + "/" + oobSubmoduleId;
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
            //data.responseObject.sort((a, b) => (a.id < b.id ? 1 : -1));
            dispatch({
              type: FETCH_OOB_SUBMODULE_BY_ID_COMPLETE,
              payload: data.responseObject,
            });
          }
          else if (data.responseCode === "9146" || data.responseCode === 9146) {
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: "Invalid config table",
                severity: "error",
              },
            });
          }
          else {
            dispatch({
              type: FETCH_OOB_SUBMODULE_BY_ID_FAILURE,
              payload: data,
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_OOB_SUBMODULE_BY_ID_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const deleteOOBSubmodule = (submoduleId, submoduleName) => {
  let API_URL = OOB_SUBMODULE_API_URL + "/" + submoduleId;
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
              type: DELETE_OOBSUBMODULE_COMPLETE,
              //payload: moduleData.list,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleDeleteOobSubmodule(submoduleName, data.responseCode).message,
                severity: handleDeleteOobSubmodule(submoduleName, data.responseCode).messageType,
              },
            });
          } else {
            dispatch({ type: DELETE_OOBSUBMODULE_FAILURE, payload: data });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleDeleteOobSubmodule(submoduleName, data.responseCode).message,
                severity: handleDeleteOobSubmodule(submoduleName, data.responseCode).messageType,
              },
            });
          }
          stopLoading(dispatch);
          dispatch({ type: HIDE_MESSAGE_DIALOG, payload: undefined });
        },
        (error) => {
          dispatch({ type: DELETE_OOBSUBMODULE_FAILURE, payload: error });
          stopLoading(dispatch);
          dispatch({ type: HIDE_MESSAGE_DIALOG, payload: undefined });
          dispatch({
            type: SHOW_SNACKBAR_ACTION,
            payload: {
              detail: handleDeleteOobSubmodule(submoduleName, '').message,
              severity: handleDeleteOobSubmodule(submoduleName, '').messageType,
            },
          });
        }
      );
  };
};

export const resetError = () => {
  return {
    type: RESET_DUPLICATE_ERROR,
    payload: undefined,
  };
};
