import {
    START_SPINNER_ACTION,
    FETCH_DEPLOYMENT_CONFIG_API_URL,
    FETCH_DEPLOYMENT_CONFIG_COMPLETE,
    FETCH_DEPLOYMENT_CONFIG_ERROR,
    FETCH_DEPLOYMENT_CONFIG_FAILURE,
   } from "../utils/AppConstants";
 import { setRequestHeader, stopLoading } from "../utils/helpers";
 import { DEFAULT_ERROR_MSG } from "../utils/Messages";
 
 export const fetchDeployConfig = (id, startIndex, pageSize) => {
     return (dispatch) => {
        dispatch({ type: START_SPINNER_ACTION });
       return fetch(pageSize ? FETCH_DEPLOYMENT_CONFIG_API_URL + id + "?startIndex=" + startIndex + "&pageSize=" + pageSize : FETCH_DEPLOYMENT_CONFIG_API_URL + id, {
         headers: setRequestHeader(),
       })
         .then((response) => response.json())
         .then(
           (data) => {
             if (data && data.responseCode === "200") {
               dispatch({ type: FETCH_DEPLOYMENT_CONFIG_COMPLETE, 
                payload: {
                oobComponents: data.responseObject?.oobComponents,
                totalElements: data.responseObject?.totalElements,
                totalPages: data.responseObject?.totalPages,
                pageSize: pageSize,
                startIndex: startIndex,
              }, 
            });
             } else {
               dispatch({
                 type: FETCH_DEPLOYMENT_CONFIG_ERROR,
                 payload: data ? data : { message: DEFAULT_ERROR_MSG },
               });
             }
             stopLoading(dispatch);
           },
           (error) => {
             dispatch({ type: FETCH_DEPLOYMENT_CONFIG_FAILURE, payload: error });
             stopLoading(dispatch);
           }
         );
     };
   };
