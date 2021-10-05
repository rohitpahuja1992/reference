import {
  FETCHENVIRONMENT_API_URL,
  FETCH_ENVIRONMENT_COMPLETE,
  FETCH_ENVIRONMENT_FAILURE,
  ADDENVIRONMENT_API_URL,
  ADD_ENVIRONMENT_COMPLETE,
  ADD_ENVIRONMENT_ERROR,
  ADD_ENVIRONMENT_FAILURE,
  DELETEENVIRONMENT_API_URL,
  UNTERMENVIRONMENT_API_URL,
  DELETE_ENVIRONMENT_COMPLETE,
  DELETE_ENVIRONMENT_ERROR,
  DELETE_ENVIRONMENT_FAILURE,
  UNTERM_ENVIRONMENT_COMPLETE,
  UNTERM_ENVIRONMENT_ERROR,
  UNTERM_ENVIRONMENT_FAILURE,
  SHOW_SNACKBAR_ACTION,
  START_SPINNER_ACTION,
  HIDE_MESSAGE_DIALOG,
  RESET_DUPLICATE_ERROR,
} from "../utils/AppConstants";
import { setRequestHeader, stopLoading } from "../utils/helpers";
import {handleEnvironmentAddMsg,handleEnvironmentunTermMsg, handleEnvironmentTermMsg} from "../utils/Messages";

export const fetchEnvironment = (startIndex, pageSize) => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(pageSize?FETCHENVIRONMENT_API_URL + "?startIndex=" + startIndex + "&pageSize=" + pageSize : FETCHENVIRONMENT_API_URL, {
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            data.responseObject.oobComponents.sort((a, b) => (a.id < b.id ? 1 : -1));
            dispatch({
              type: FETCH_ENVIRONMENT_COMPLETE,
              payload: {
                oobComponents: data.responseObject?.oobComponents,
                totalElements: data.responseObject?.totalElements,
                totalPages: data.responseObject?.totalPages,
                pageSize: pageSize,
                startIndex: startIndex,
              },
            });
          } else {
            dispatch({ type: FETCH_ENVIRONMENT_FAILURE, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_ENVIRONMENT_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const addEnvironment = (environmentName) => {
  let formData = environmentName.trim();
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(ADDENVIRONMENT_API_URL, {
      method: "post",
      body: JSON.stringify({ environmentName: formData }),
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
              type: ADD_ENVIRONMENT_COMPLETE,
              //payload: data.responseObject,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleEnvironmentAddMsg(formData,data.responseCode).message,
                severity: handleEnvironmentAddMsg(formData,data.responseCode).messageType
              },
            });
          } else {
            dispatch({ type: ADD_ENVIRONMENT_ERROR, payload: data });
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
          dispatch({ type: ADD_ENVIRONMENT_FAILURE, payload: error });
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

export const deleteEnvironment = (environmentId, environmentName) => {
  let DELETE_ENVIRONMENT_API = DELETEENVIRONMENT_API_URL + environmentId;
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(DELETE_ENVIRONMENT_API, {
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
            // var foundIndex = environmentList.findIndex(
            //   (x) => x.id === environmentId
            // );
            // environmentList[foundIndex] = data.responseObject;
            dispatch({
              type: DELETE_ENVIRONMENT_COMPLETE,
              //payload: environmentList,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleEnvironmentTermMsg(environmentName,data.responseCode).message,
                severity: handleEnvironmentTermMsg(environmentName,data.responseCode).messageType
              },
            });
          } else {
            dispatch({ type: DELETE_ENVIRONMENT_ERROR, payload: data });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleEnvironmentTermMsg(environmentName,data.responseCode).message,
                severity: handleEnvironmentTermMsg(environmentName,data.responseCode).messageType
              },
            });
          }
          stopLoading(dispatch);
          dispatch({ type: HIDE_MESSAGE_DIALOG, payload: undefined });
        },
        (error) => {
          dispatch({ type: DELETE_ENVIRONMENT_FAILURE, payload: error });
          stopLoading(dispatch);
          dispatch({ type: HIDE_MESSAGE_DIALOG, payload: undefined });
          dispatch({
            type: SHOW_SNACKBAR_ACTION,
            payload: {
              detail: handleEnvironmentTermMsg("","").message,
                severity: handleEnvironmentTermMsg("","").messageType
            },
          });
        }
      );
  };
};
export const untermEnvironment = (environmentId, environmentName) => {
  let DELETE_ENVIRONMENT_API = UNTERMENVIRONMENT_API_URL + environmentId;
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(DELETE_ENVIRONMENT_API, {
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
            // var foundIndex = environmentList.findIndex(
            //   (x) => x.id === environmentId
            // );
            // environmentList[foundIndex] = data.responseObject;
            dispatch({
              type: UNTERM_ENVIRONMENT_COMPLETE,
              //payload: environmentList,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleEnvironmentunTermMsg(environmentName,data.responseCode).message,
                severity: handleEnvironmentunTermMsg(environmentName,data.responseCode).messageType
              },
            });
          } else {
            dispatch({ type: UNTERM_ENVIRONMENT_ERROR, payload: data });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleEnvironmentunTermMsg(environmentName,data.responseCode).message,
                severity: handleEnvironmentunTermMsg(environmentName,data.responseCode).messageType
              },
            });
          }
          stopLoading(dispatch);
          dispatch({ type: HIDE_MESSAGE_DIALOG, payload: undefined });
        },
        (error) => {
          dispatch({ type: UNTERM_ENVIRONMENT_FAILURE, payload: error });
          stopLoading(dispatch);
          dispatch({ type: HIDE_MESSAGE_DIALOG, payload: undefined });
          dispatch({
            type: SHOW_SNACKBAR_ACTION,
            payload: {
              detail: handleEnvironmentunTermMsg("","").message,
                severity: handleEnvironmentunTermMsg("","").messageType
            },
          });
        }
      );
  };
};

export const resetDuplicateError = () => {
  return {
    type: RESET_DUPLICATE_ERROR,
    payload: undefined,
  };
};
