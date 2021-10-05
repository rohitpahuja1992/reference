import {
    START_SPINNER_ACTION,
    FETCH_DEPLOYMENT_HISTORY_API_URL,
    FETCH_DEPLOYMENT_HISTORY_COMPLETE,
    FETCH_DEPLOYMENT_HISTORY_ERROR,
    FETCH_DEPLOYMENT_HISTORY_FAILURE,
   } from "../utils/AppConstants";
 import { setRequestHeader, stopLoading } from "../utils/helpers";
 import { DEFAULT_ERROR_MSG } from "../utils/Messages";
 
 export const fetchDeploymentHistory = (clientID, startIndex, pageSize) => {
     return (dispatch) => {
        dispatch({ type: START_SPINNER_ACTION });
       return fetch(FETCH_DEPLOYMENT_HISTORY_API_URL + clientID + "?startIndex=" + startIndex + "&pageSize=" + pageSize, {
         headers: setRequestHeader(),
       })
         .then((response) => response.json())
         .then(
           (data) => {
             if (data && data.responseCode === "200") {
              data.responseObject?.oobComponents.sort((a, b) =>
              a.scheduleDate < b.scheduleDate ? 1 : -1
            );
               dispatch({
                type: FETCH_DEPLOYMENT_HISTORY_COMPLETE,
                payload: {
                  oobComponents: data.responseObject?.oobComponents,
                  totalElements: data.responseObject?.totalElements,
                  totalPages: data.responseObject?.totalPages,
                  pageSize: pageSize,
                  startIndex: startIndex,
                }
               });
             } else {
               dispatch({
                 type: FETCH_DEPLOYMENT_HISTORY_ERROR,
                 payload: data ? data : { message: DEFAULT_ERROR_MSG },
               });
             }
             stopLoading(dispatch);
           },
           (error) => {
             dispatch({ type: FETCH_DEPLOYMENT_HISTORY_FAILURE, payload: error });
             stopLoading(dispatch);
           }
         );
     };
   };