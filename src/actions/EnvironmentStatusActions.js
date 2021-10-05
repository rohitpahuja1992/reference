import {
    START_SPINNER_ACTION,
    FETCH_ENVIRONMENT_STATUS_API_URL,
    FETCH_ENVIRONMENT_STATUS_COMPLETE,
    FETCH_ENVIRONMENT_STATUS_ERROR,
    FETCH_ENVIRONMENT_STATUS_FAILURE,
   } from "../utils/AppConstants";
 import { setRequestHeader, stopLoading } from "../utils/helpers";
 import { DEFAULT_ERROR_MSG } from "../utils/Messages";
 
 export const fetchEnvironmentStatus = (clientID, startIndex, pageSize) => {
     return (dispatch) => {
        dispatch({ type: START_SPINNER_ACTION });
       return fetch(pageSize ? FETCH_ENVIRONMENT_STATUS_API_URL + clientID + "?startIndex=" + startIndex + "&pageSize=" + pageSize : FETCH_ENVIRONMENT_STATUS_API_URL + clientID, {
         headers: setRequestHeader(),
       })
         .then((response) => response.json())
         .then(
           (data) => {
             if (data && data.responseCode === "200") {
               dispatch({ type: FETCH_ENVIRONMENT_STATUS_COMPLETE, 
                payload:  {
                  oobComponents: data.responseObject?.oobComponents?.clientEnvironmentComparsion,
                  totalElements: data.responseObject?.totalElements,
                  totalPages: data.responseObject?.totalPages,
                  pageSize: pageSize,
                  startIndex: startIndex,
              },
             });
             } else {
               dispatch({
                 type: FETCH_ENVIRONMENT_STATUS_ERROR,
                 payload: data ? data : { message: DEFAULT_ERROR_MSG },
               });
             }
             stopLoading(dispatch);
           },
           (error) => {
             dispatch({ type: FETCH_ENVIRONMENT_STATUS_FAILURE, payload: error });
             stopLoading(dispatch);
           }
         );
     };
   };