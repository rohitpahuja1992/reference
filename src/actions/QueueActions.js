import {
  FETCH_QUEUES_API_URL,
  FETCH_QUEUES_COMPLETE,
  FETCH_QUEUES_FAILURE,
  FETCH_QUEUES_ERROR,
  FETCH_QUEUE_PROFILE_API_URL,
  FETCH_QUEUE_PROFILE_COMPLETE,
  FETCH_QUEUE_PROFILE_FAILURE,
  FETCH_QUEUE_PROFILE_ERROR,
  UPDATE_QUEUE_API_URL,
  UPDATE_QUEUES_COMPLETE,
  UPDATE_QUEUES_ERROR,
  UPDATE_QUEUES_FAILURE,
  START_SPINNER_ACTION,
  SHOW_SNACKBAR_ACTION,
} from "../utils/AppConstants";
import { setRequestHeader, stopLoading } from "../utils/helpers";
import { DEFAULT_ERROR_MSG, QUEUE_UPDATED } from "../utils/Messages";

export const fetchQueues = () => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(FETCH_QUEUES_API_URL, {
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (data && !data.hasOwnProperty("error")) {
            dispatch({ type: FETCH_QUEUES_COMPLETE, payload: data });
          } else {
            dispatch({
              type: FETCH_QUEUES_ERROR,
              payload: data ? data : { message: DEFAULT_ERROR_MSG },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_QUEUES_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchQueueProfile = (queueId) => {
  let ApiUrl = `${FETCH_QUEUE_PROFILE_API_URL}/${queueId}`;
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(ApiUrl, {
      // method: "post",
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (data && !data.hasOwnProperty("error")) {
            dispatch({ type: FETCH_QUEUE_PROFILE_COMPLETE, payload: data });
          } else {
            dispatch({
              type: FETCH_QUEUE_PROFILE_ERROR,
              payload: data ? data : { message: DEFAULT_ERROR_MSG },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_QUEUE_PROFILE_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const updateQueue = (formData) => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(UPDATE_QUEUE_API_URL, {
      method: "post",
      body: JSON.stringify(formData),
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            dispatch({ type: UPDATE_QUEUES_COMPLETE, payload: data });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: QUEUE_UPDATED,
              },
            });
          } else {
            dispatch({
              type: UPDATE_QUEUES_ERROR,
              payload: data ? data : { message: DEFAULT_ERROR_MSG },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: UPDATE_QUEUES_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};
