import {
  FETCH_SESSION_TIMEOUT_API_URL,
  FETCH_SESSION_TIMEOUT_COMPLETE,
  FETCH_SESSION_TIMEOUT_FAILURE,
  UPDATE_SESSION_TIMEOUT_API_URL,
  UPDATE_SESSION_TIMEOUT_COMPLETE,
  UPDATE_SESSION_TIMEOUT_FAILURE,
  START_SPINNER_ACTION,
  RESET_DUPLICATE_ERROR,
  SHOW_SNACKBAR_ACTION,
} from "../utils/AppConstants";
import { setRequestHeader, stopLoading } from "../utils/helpers";
import { handleUpdateSessionTimeout } from "../utils/Messages" 
export const fetchSessionTimeout = () => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(FETCH_SESSION_TIMEOUT_API_URL, {
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
              type: FETCH_SESSION_TIMEOUT_COMPLETE,
              payload: data.responseObject,
            });
          } else {
            dispatch({ type: FETCH_SESSION_TIMEOUT_FAILURE, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_SESSION_TIMEOUT_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const updateSessionTimeout = (formdata) => {
  let param = parseInt(formdata.sessionTime);
  let API_URL = UPDATE_SESSION_TIMEOUT_API_URL + param;
  return (dispatch) => {
    //dispatch({ type: UPDATE_USER_TIMEOUT_FAILURE, payload: "error" });
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(API_URL, {
      method: "post",
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
              type: UPDATE_SESSION_TIMEOUT_COMPLETE,
              payload: data.responseObject,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleUpdateSessionTimeout(data.responseCode).message,
                severity: handleUpdateSessionTimeout(data.responseCode).messageType,
              },
            });
          } else {
            dispatch({ type: UPDATE_SESSION_TIMEOUT_FAILURE, payload: data });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleUpdateSessionTimeout(data.responseCode).message,
                severity: handleUpdateSessionTimeout(data.responseCode).messageType,
              },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: UPDATE_SESSION_TIMEOUT_FAILURE, payload: error });
          stopLoading(dispatch);
          dispatch({
            type: SHOW_SNACKBAR_ACTION,
            payload: {
              detail: handleUpdateSessionTimeout('').message,
              severity: handleUpdateSessionTimeout('').messageType,
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