import {
  FETCH_JIRATICKET_API_URL,
  FETCH_JIRATICKET_COMPLETE,
  FETCH_JIRATICKET_FAILURE,
  UPDATE_JIRATICKET_API_URL,
  UPDATE_JIRATICKET_COMPLETE,
  UPDATE_JIRATICKET_FAILURE,
  START_SPINNER_ACTION,
  RESET_DUPLICATE_ERROR,
  SHOW_SNACKBAR_ACTION,
} from "../utils/AppConstants";
import { setRequestHeader, stopLoading } from "../utils/helpers";
import { handleUpdateJiraTicket } from "../utils/Messages" 
export const fetchJiraTickeInfo = () => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(FETCH_JIRATICKET_API_URL, {
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
              type: FETCH_JIRATICKET_COMPLETE,
              payload: data.responseObject,
            });
          } else {
            dispatch({ type: FETCH_JIRATICKET_FAILURE, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_JIRATICKET_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const updateJiraTickeInfo = (toggle) => {
  let API_URL = UPDATE_JIRATICKET_API_URL + toggle;
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
              type: UPDATE_JIRATICKET_COMPLETE,
              payload: data.responseObject.jiraToggle,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleUpdateJiraTicket(data.responseCode).message,
                severity: handleUpdateJiraTicket(data.responseCode).messageType,
              },
            });
          } else {
            dispatch({ type: UPDATE_JIRATICKET_FAILURE, payload: data });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleUpdateJiraTicket(data.responseCode).message,
                severity: handleUpdateJiraTicket(data.responseCode).messageType,
              },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: UPDATE_JIRATICKET_FAILURE, payload: error });
          stopLoading(dispatch);
          dispatch({
            type: SHOW_SNACKBAR_ACTION,
            payload: {
              detail: handleUpdateJiraTicket('').message,
              severity: handleUpdateJiraTicket('').messageType,
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