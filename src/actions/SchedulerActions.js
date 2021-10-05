import {
  SCHEDULE_API_URL,
  ADD_SCHEDULE_DEPLOYMENT_COMPLETE,
  ADD_SCHEDULE_DEPLOYMENT_ERROR,
  ADD_SCHEDULE_DEPLOYMENT_FAILURE,
  START_SPINNER_ACTION,
  SHOW_SNACKBAR_ACTION,
} from "../utils/AppConstants";
import { handleAddClientProfile } from "../utils/Messages";
import { setRequestHeader, stopLoading } from "../utils/helpers";

export const addSchedule = (scheduleInfo) => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(SCHEDULE_API_URL, {
      method: "post",
      body: JSON.stringify(scheduleInfo),
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
              type: ADD_SCHEDULE_DEPLOYMENT_COMPLETE,
              payload: data.responseObject.id,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleAddClientProfile(
                  scheduleInfo.clientName,
                  data.responseCode
                ).message,
                severity: handleAddClientProfile(
                  scheduleInfo.clientName,
                  data.responseCode
                ).messageType,
              },
            });
          } else {
            dispatch({ type: ADD_SCHEDULE_DEPLOYMENT_ERROR, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: ADD_SCHEDULE_DEPLOYMENT_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};
