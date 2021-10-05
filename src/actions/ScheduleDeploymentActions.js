import {
   FETCH_SCHEDULEDBYID_COMPLETE,
   FETCH_SCHEDULEDBYID_COMPLETE_BYID,
   FETCH_SCHEDULE_DEPLOYMENT_API_URL,
   FETCH_SCHEDULE_DEPLOYMENT_COMPLETE,
   FETCH_SCHEDULE_DEPLOYMENT_ERROR,
   FETCH_SCHEDULE_DEPLOYMENT_FAILURE,
   ADD_SCHEDULE_DEPLOYMENT_COMPLETE,
   ADD_SCHEDULE_DEPLOYMENT_ERROR,
   ADD_SCHEDULE_DEPLOYMENT_FAILURE,
   UPDATE_SCHEDULE_DEPLOYMENT_COMPLETE,
   UPDATE_SCHEDULE_DEPLOYMENT_ERROR,
   UPDATE_SCHEDULE_DEPLOYMENT_FAILURE,
   DELETE_SCHEDULE_DEPLOYMENT_COMPLETE,
   DELETE_SCHEDULE_DEPLOYMENT_ERROR,
   DELETE_SCHEDULE_DEPLOYMENT_FAILURE,
   FETCH_SCHEDULE_DEPLOYMENT_BY_ID_API_URL,
   SCHEDULE_API_URL,
   START_SPINNER_ACTION,
   SHOW_SNACKBAR_ACTION,
   DEFAULT_START_INDEX,
   DEFAULT_PAGE_SIZE
  } from "../utils/AppConstants";
  import { handleAddClientProfile } from "../utils/Messages";
import { setRequestHeader, stopLoading } from "../utils/helpers";
import { DEFAULT_ERROR_MSG, SCHEDULE_DEPLOYMENT_UPDATED, ERROR_MESSAGE,
  DEPLOYMENT_SCHEDULE_DOES_NOT_EXIST,
  DESTINATION_ENVIRONMENT_NOT_EXIST,
  SCHEDULER_TIME_ALREADY_CONFIGURED,
  CLIENT_MODULE_SCHEDULER_DOES_NOT_EXISTS,
  DEPLOYMENT_SCHEDULER_IN_PROCESS,
  DESTINATION_ENVIRONMENT_NOT_CONFIGURED_WITH_CLIENT } from "../utils/Messages";

export const fetchSchedule = () => {
    return (dispatch) => {
      dispatch({ type: FETCH_SCHEDULEDBYID_COMPLETE });
      return fetch(FETCH_SCHEDULE_DEPLOYMENT_API_URL, {
        headers: setRequestHeader(),
      })
        .then((response) => response.json())
        .then(
          (data) => {
            if (data && data.responseCode === "200") {
              dispatch({ type: FETCH_SCHEDULE_DEPLOYMENT_COMPLETE, payload: data });
            }
            else if (data.responseCode === "2281" || data.responseCode === 2281) {
              dispatch({
                type: SHOW_SNACKBAR_ACTION,
                payload: {
                  detail: DEPLOYMENT_SCHEDULE_DOES_NOT_EXIST,
                  severity: "error",
                },
              });
            }
            else {
              dispatch({
                type: FETCH_SCHEDULE_DEPLOYMENT_ERROR,
                payload: data ? data : { message: DEFAULT_ERROR_MSG },
              });
            }
            //stopLoading(dispatch);
          },
          (error) => {
            dispatch({ type: FETCH_SCHEDULE_DEPLOYMENT_FAILURE, payload: error });
            stopLoading(dispatch);
          }
        );
    };
  };

  export const fetchScheduleById = (id, startIndex, pageSize) => {
    return (dispatch) => {
      dispatch({ type: FETCH_SCHEDULEDBYID_COMPLETE_BYID });
      return fetch(FETCH_SCHEDULE_DEPLOYMENT_BY_ID_API_URL + id + "?startIndex=" + startIndex + "&pageSize=" + pageSize, {
        headers: setRequestHeader(),
      })
      .then((response) => response.json())
      .then(
        (data) => {
          if (data && data.responseCode === "200") {
            data.responseObject?.oobComponents?.sort((a, b) =>
              a.scheduleDate < b.scheduleDate ? 1 : -1
            );
            dispatch({ type: FETCH_SCHEDULE_DEPLOYMENT_COMPLETE, 
              payload:  {
                  oobComponents: data.responseObject?.oobComponents,
                  totalElements: data.responseObject?.totalElements,
                  totalPages: data.responseObject?.totalPages,
                  pageSize: pageSize,
                  startIndex: startIndex,
              }
             });
          }
          else if (data.responseCode === "2281" || data.responseCode === 2281) {
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: DEPLOYMENT_SCHEDULE_DOES_NOT_EXIST,
                severity: "error",
              },
            });
          }
          else {
            dispatch({
              type: FETCH_SCHEDULE_DEPLOYMENT_ERROR,
              payload: data ? data : { message: DEFAULT_ERROR_MSG },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_SCHEDULE_DEPLOYMENT_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

  export const addSchedule = (scheduleInfo,clientID) => {
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
                  detail: data.responseMessage,
                  severity: "Success",
                },
              });
              dispatch(fetchScheduleById(clientID, DEFAULT_START_INDEX, DEFAULT_PAGE_SIZE));
            }
            else if (data.responseCode === "2282" || data.responseCode === 2282) {
              dispatch({
                type: SHOW_SNACKBAR_ACTION,
                payload: {
                  detail: DESTINATION_ENVIRONMENT_NOT_EXIST,
                  severity: "warning",
                },
              });
            }
            else if (data.responseCode === "2284" || data.responseCode === 2284) {
              dispatch({
                type: SHOW_SNACKBAR_ACTION,
                payload: {
                  detail: SCHEDULER_TIME_ALREADY_CONFIGURED,
                  severity: "warning",
                },
              });
            }
            else if (data.responseCode === "2286" || data.responseCode === 2286) {
              dispatch({
                type: SHOW_SNACKBAR_ACTION,
                payload: {
                  detail: DEPLOYMENT_SCHEDULER_IN_PROCESS,
                  severity: "warning",
                },
              });
            }
            else if (data.responseCode === "2287" || data.responseCode === 2287) {
              dispatch({
                type: SHOW_SNACKBAR_ACTION,
                payload: {
                  detail: DESTINATION_ENVIRONMENT_NOT_CONFIGURED_WITH_CLIENT,
                  severity: "warning",
                },
              });
            }
             else {
              dispatch({
                type: SHOW_SNACKBAR_ACTION,
                payload: {
                  detail: data.responseMessage || DEFAULT_ERROR_MSG,
                  severity: "error",
                },
              });
              dispatch({ type: ADD_SCHEDULE_DEPLOYMENT_ERROR, payload: data });
            }
            stopLoading(dispatch);
          },
          (error) => {
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: ERROR_MESSAGE,
                severity: "error",
              },
            });
            dispatch({ type: ADD_SCHEDULE_DEPLOYMENT_FAILURE, payload: error });
            stopLoading(dispatch);
          }
        );
    };
  };

  export const deleteSchedule = (id,clientID) => {
    return (dispatch) => {
      dispatch({ type: FETCH_SCHEDULEDBYID_COMPLETE });
      return fetch(FETCH_SCHEDULE_DEPLOYMENT_API_URL + "/" + id, {
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
              dispatch({ type: DELETE_SCHEDULE_DEPLOYMENT_COMPLETE });
              dispatch({
                type: SHOW_SNACKBAR_ACTION,
                payload: {
                  detail: "Successfully deleted.",
                  severity: "success",
                },
              });
              dispatch(fetchScheduleById(clientID, DEFAULT_START_INDEX, DEFAULT_PAGE_SIZE));
            }
            else if (data.responseCode === "2282" || data.responseCode === 2282) {
              dispatch({
                type: SHOW_SNACKBAR_ACTION,
                payload: {
                  detail: DESTINATION_ENVIRONMENT_NOT_EXIST,
                  severity: "warning",
                },
              });
            }
            else if (data.responseCode === "2284" || data.responseCode === 2284) {
              dispatch({
                type: SHOW_SNACKBAR_ACTION,
                payload: {
                  detail: SCHEDULER_TIME_ALREADY_CONFIGURED,
                  severity: "warning",
                },
              });
            }
            else if (data.responseCode === "2286" || data.responseCode === 2286) {
              dispatch({
                type: SHOW_SNACKBAR_ACTION,
                payload: {
                  detail: DEPLOYMENT_SCHEDULER_IN_PROCESS,
                  severity: "warning",
                },
              });
            }
            else if (data.responseCode === "2287" || data.responseCode === 2287) {
              dispatch({
                type: SHOW_SNACKBAR_ACTION,
                payload: {
                  detail: DESTINATION_ENVIRONMENT_NOT_CONFIGURED_WITH_CLIENT,
                  severity: "warning",
                },
              });
            }
            else if (data.responseCode === "2285" || data.responseCode === 2285) {
              dispatch({
                type: SHOW_SNACKBAR_ACTION,
                payload: {
                  detail: CLIENT_MODULE_SCHEDULER_DOES_NOT_EXISTS,
                  severity: "error",
                },
              });
            }
            else {
              dispatch({
                type: DELETE_SCHEDULE_DEPLOYMENT_ERROR,
                payload: data ? data : { message: DEFAULT_ERROR_MSG },
              });
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
            dispatch({ type: DELETE_SCHEDULE_DEPLOYMENT_FAILURE, payload: error });
            stopLoading(dispatch);
          }
        );
    };
  };


  export const updateSchedule = (formData ,clientID) => {
    return (dispatch) => {
      dispatch({ type: FETCH_SCHEDULEDBYID_COMPLETE });
      return fetch(FETCH_SCHEDULE_DEPLOYMENT_API_URL, {
        method: "put",
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
              dispatch({ type: UPDATE_SCHEDULE_DEPLOYMENT_COMPLETE, payload: data });
              dispatch({
                type: SHOW_SNACKBAR_ACTION,
                payload: {
                  detail: "Successfully Updated.",
                  severity: "success",
                },
              });
              dispatch(fetchScheduleById(clientID, DEFAULT_START_INDEX, DEFAULT_PAGE_SIZE));
            } 
            else if (data.responseCode === "2282" || data.responseCode === 2282) {
              dispatch({
                type: SHOW_SNACKBAR_ACTION,
                payload: {
                  detail: DESTINATION_ENVIRONMENT_NOT_EXIST,
                  severity: "warning",
                },
              });
            }
            else if (data.responseCode === "2284" || data.responseCode === 2284) {
              dispatch({
                type: SHOW_SNACKBAR_ACTION,
                payload: {
                  detail: SCHEDULER_TIME_ALREADY_CONFIGURED,
                  severity: "warning",
                },
              });
            }
            else if (data.responseCode === "2286" || data.responseCode === 2286) {
              dispatch({
                type: SHOW_SNACKBAR_ACTION,
                payload: {
                  detail: DEPLOYMENT_SCHEDULER_IN_PROCESS,
                  severity: "warning",
                },
              });
            }
            else if (data.responseCode === "2287" || data.responseCode === 2287) {
              dispatch({
                type: SHOW_SNACKBAR_ACTION,
                payload: {
                  detail: DESTINATION_ENVIRONMENT_NOT_CONFIGURED_WITH_CLIENT,
                  severity: "warning",
                },
              });
            }
             else {
              dispatch({
                type: SHOW_SNACKBAR_ACTION,
                payload: {
                  detail: data.responseMessage || DEFAULT_ERROR_MSG,
                  severity: "error",
                },
              });
              dispatch({ type: ADD_SCHEDULE_DEPLOYMENT_ERROR, payload: data });
            }
            stopLoading(dispatch);
          },
          (error) => {
            dispatch({ type: UPDATE_SCHEDULE_DEPLOYMENT_FAILURE, payload: error });
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