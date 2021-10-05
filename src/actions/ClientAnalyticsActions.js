import {
  START_SPINNER_ACTION,
  CLIENT_ANALYTICS_API_URL,
  FETCH_CLIENT_ALL_MODULE_ANALYTICS_COMPLETE,
  FETCH_CLIENT_ALL_MODULE_ANALYTICS_FAILURE,
  FETCH_CLIENT_OOB_MODULE_ANALYTICS_COMPLETE,
  FETCH_CLIENT_OOB_MODULE_ANALYTICS_FAILURE,
  FETCH_CLIENT_GLOBAL_MODULE_ANALYTICS_COMPLETE,
  FETCH_CLIENT_GLOBAL_MODULE_ANALYTICS_FAILURE,
  FETCH_CLIENT_SINGLE_MODULE_ANALYTICS_COMPLETE,
  FETCH_CLIENT_SINGLE_MODULE_ANALYTICS_FAILURE,
  FETCH_CLIENT_SINGLE_MODULE_ANALYTICS_COMPLETE_BYFLAG,
  FETCH_CLIENT_SINGLE_MODULE_ANALYTICS_FAILURE_BYFLAG,
} from "../utils/AppConstants";
import { setRequestHeader, stopLoading } from "../utils/helpers";

export const fetchClientAllModuleAnalytics = (clientId) => {
  let API_URL = `${CLIENT_ANALYTICS_API_URL}?clientId=${clientId}&isGlobal=all`;

  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(API_URL, {
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (data && data.responseCode === "200") {
            dispatch({
              type: FETCH_CLIENT_ALL_MODULE_ANALYTICS_COMPLETE,
              payload: data.responseObject,
            });
          } else {
            dispatch({
              type: FETCH_CLIENT_ALL_MODULE_ANALYTICS_FAILURE,
              payload: data,
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({
            type: FETCH_CLIENT_ALL_MODULE_ANALYTICS_FAILURE,
            payload: error,
          });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchClientOobModuleAnalytics = (clientId) => {
  let API_URL = `${CLIENT_ANALYTICS_API_URL}?clientId=${clientId}&isGlobal=all`;

  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(API_URL, {
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (data && data.responseCode === "200") {
            dispatch({
              type: FETCH_CLIENT_OOB_MODULE_ANALYTICS_COMPLETE,
              payload: data.responseObject,
            });
          } else {
            dispatch({
              type: FETCH_CLIENT_OOB_MODULE_ANALYTICS_FAILURE,
              payload: data,
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({
            type: FETCH_CLIENT_OOB_MODULE_ANALYTICS_FAILURE,
            payload: error,
          });
          stopLoading(dispatch);
        }
      );
  };
};

// export const fetchClientGlobalModuleAnalytics = (clientId) => {
//   let API_URL = `${CLIENT_ANALYTICS_API_URL}?clientId=${clientId}&isGlobal=true`;

//   return (dispatch) => {
//     dispatch({ type: START_SPINNER_ACTION });
//     return fetch(API_URL, {
//       headers: setRequestHeader(),
//     })
//       .then((response) => response.json())
//       .then(
//         (data) => {
//           if (data && data.responseCode === "200") {
//             dispatch({
//               type: FETCH_CLIENT_GLOBAL_MODULE_ANALYTICS_COMPLETE,
//               payload: data.responseObject,
//             });
//           } else {
//             dispatch({
//               type: FETCH_CLIENT_GLOBAL_MODULE_ANALYTICS_FAILURE,
//               payload: data,
//             });
//           }
//           stopLoading(dispatch);
//         },
//         (error) => {
//           dispatch({
//             type: FETCH_CLIENT_GLOBAL_MODULE_ANALYTICS_FAILURE,
//             payload: error,
//           });
//           stopLoading(dispatch);
//         }
//       );
//   };
// };

export const fetchClientSingleModuleAnalyticsFlag = (moduleId, clientId, flag) => {
  let API_URL = `${CLIENT_ANALYTICS_API_URL}/${moduleId}?clientId=${clientId}&flag=${flag}`;

  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(API_URL, {
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (data && data.responseCode === "200") {
            dispatch({
              type: FETCH_CLIENT_SINGLE_MODULE_ANALYTICS_COMPLETE_BYFLAG,
              payload: data.responseObject,
            });
          } else {
            dispatch({
              type: FETCH_CLIENT_SINGLE_MODULE_ANALYTICS_FAILURE_BYFLAG,
              payload: data,
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({
            type: FETCH_CLIENT_SINGLE_MODULE_ANALYTICS_FAILURE_BYFLAG,
            payload: error,
          });
          stopLoading(dispatch);
        }
      );
  };
};



export const fetchClientSingleModuleAnalytics = (moduleId, clientId) => {
  let API_URL = `${CLIENT_ANALYTICS_API_URL}/${moduleId}?clientId=${clientId}`;

  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(API_URL, {
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (data && data.responseCode === "200") {
            dispatch({
              type: FETCH_CLIENT_SINGLE_MODULE_ANALYTICS_COMPLETE,
              payload: data.responseObject,
            });
          } else {
            dispatch({
              type: FETCH_CLIENT_SINGLE_MODULE_ANALYTICS_FAILURE,
              payload: data,
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({
            type: FETCH_CLIENT_SINGLE_MODULE_ANALYTICS_FAILURE,
            payload: error,
          });
          stopLoading(dispatch);
        }
      );
  };
};
