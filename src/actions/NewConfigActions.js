import {
  START_SPINNER_ACTION,
  FETCH_NEW_CONFIG_API_URL,
  DEPLOY_CONFIG_API_URL,
  FETCH_NEW_CONFIG_COMPLETE,
  FETCH_NEW_CONFIG_ERROR,
  FETCH_NEW_CONFIG_FAILURE,
  ADD_NEW_CONFIG_COMPLETE,
  ADD_NEW_CONFIG_ERROR,
  ADD_NEW_CONFIG_FAILURE,
  SHOW_SNACKBAR_ACTION,
} from "../utils/AppConstants";
import { setRequestHeader, stopLoading } from "../utils/helpers";
import { DEFAULT_ERROR_MSG , CANNOT_DEPLOY_CHILD_AS_PARENT_IS_NOT_DEPLOYED} from "../utils/Messages";

export const fetchNewConfig = (clientID, eid) => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(FETCH_NEW_CONFIG_API_URL + clientID + "/" + eid, {
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (data && data.responseCode === "200") {
            dispatch({
              type: FETCH_NEW_CONFIG_COMPLETE,
              payload: data.responseObject,
            });
          } else {
            dispatch({
              type: FETCH_NEW_CONFIG_ERROR,
              payload: data ? data : { message: DEFAULT_ERROR_MSG },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_NEW_CONFIG_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const deployConfig = (configInfo, clientId, environmentId) => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(DEPLOY_CONFIG_API_URL + environmentId, {
      method: "post",
      body: JSON.stringify(configInfo),
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseMessage === "Completed")
          ) {
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: "Deployment Completed",
                severity: "Success",
              },
            });
            dispatch(fetchNewConfig(clientId, environmentId));
          } 
          else if (data.responseCode === "2291" || data.responseCode === 2291) {
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: CANNOT_DEPLOY_CHILD_AS_PARENT_IS_NOT_DEPLOYED,
                severity: "warning",
              },
            });
          }
          else if (
            data.responseMessage === "Failed" ||
            data.responseMessage === "Completed_Errors"
          ) {
            dispatch({
              type: ADD_NEW_CONFIG_COMPLETE,
              payload: data.responseObject,
            });
            dispatch(fetchNewConfig(clientId, environmentId));
          } else {
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: data.responseMessage || DEFAULT_ERROR_MSG,
                severity: "Error",
              },
            });
            dispatch({ type: ADD_NEW_CONFIG_ERROR, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({
            type: SHOW_SNACKBAR_ACTION,
            payload: {
              detail: "An error occurred. Please try again later.",
              severity: "error",
            },
          });
          dispatch({ type: ADD_NEW_CONFIG_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};
