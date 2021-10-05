import {
    START_SPINNER_ACTION,
    FETCH_CLIENT_TIMELINE_API_URL,
    FETCH_CLIENT_TIMELINE_COMPLETE,
    FETCH_CLIENT_TIMELINE_ERROR,
    FETCH_CLIENT_TIMELINE_FAILURE,
    SHOW_SNACKBAR_ACTION
   } from "../utils/AppConstants";
 import { setRequestHeader, stopLoading } from "../utils/helpers";
 import { DEFAULT_ERROR_MSG, ERROR_MESSAGE } from "../utils/Messages";
 
 export const fetchClientTimeline = (clientID, startIndex, pageSize) => {
     return (dispatch) => {
        dispatch({ type: START_SPINNER_ACTION });
       return fetch(FETCH_CLIENT_TIMELINE_API_URL + clientID + "?&startIndex=" + startIndex + "&pageSize=" + pageSize, {
         headers: setRequestHeader(),
       })
         .then((response) => response.json())
         .then(
           (data) => {
             if (data && data.responseCode === "200") {
               dispatch({ type: FETCH_CLIENT_TIMELINE_COMPLETE,
                payload: {
                oobcomponents: data?.responseObject?.oobComponents?.clientAudits,
                totalElements: data?.responseObject?.totalElements,
                startIndex: startIndex
                } });
             } else {
               
              dispatch({
                type: FETCH_CLIENT_TIMELINE_ERROR,
                payload: data ? data : { message: DEFAULT_ERROR_MSG },
              });
              dispatch({
                type: SHOW_SNACKBAR_ACTION,
                payload: {
                  detail: "Error occured in client timeline",
                  severity: "error",
                },
              });
             }
             stopLoading(dispatch);
           },
           (error) => {
             dispatch({ type: FETCH_CLIENT_TIMELINE_FAILURE, payload: error });
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