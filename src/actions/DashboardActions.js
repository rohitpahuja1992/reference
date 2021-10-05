import {
  START_SPINNER_ACTION,
  SYSTEM_INFO_API_URL,
  ROLE_TREND_API_URL,
  MODULE_USAGE_API_URL,
  CLIENT_USAGE_API_URL,
  FETCH_SYSTEM_INFO_COMPLETE,
  FETCH_SYSTEM_INFO_FAILURE,
  FETCH_ROLE_TREND_COMPLETE,
  FETCH_ROLE_TREND_FAILURE,
  FETCH_MODULE_USAGE_COMPLETE,
  FETCH_MODULE_USAGE_FAILURE,
  FETCH_CLIENT_USAGE_COMPLETE,
  FETCH_CLIENT_USAGE_FAILURE,
  CLIENT_ANALYTICS_API_URL, //Added by Mohit for Dashboard Data
  CLIENT_ANALYTICS_DASHBOARD_API_URL,
  FETCH_CLIENT_OOB_MODULE_ANALYTICS_COMPLETE, //Added by Mohit for Dashboard Data
  FETCH_CLIENT_OOB_MODULE_ANALYTICS_FAILURE, //Added by Mohit for Dashboard Data
} from "../utils/AppConstants";
import { setRequestHeader, stopLoading } from "../utils/helpers";


export const fetchClientOobModuleAnalytics = () => {  
  //let a =[73,34];
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(CLIENT_ANALYTICS_DASHBOARD_API_URL, {
      method: "post",
      //body:JSON.stringify(a),
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


// export const fetchClientOobModuleAnalytics1 = (clientId) => {
//   let a =[73,34];
//   return fetch(CLIENT_ANALYTICS_API_URL, {
//     method: "post",
//     body: a,
//     headers: setRequestHeader(),
//   })

//   //let API_URL = `${CLIENT_ANALYTICS_API_URL}`;  
//  //let API_URL = `${CLIENT_ANALYTICS_API_URL}?clientId=${clientId}&isGlobal=false&isGlobal=true`;
//  // process.env.REACT_APP_API_DEV_URL + "/oobclient/stats/modules";
//  //http://125.63.92.178:8184/oobclient/stats/modules?clientId=34&isGlobal=false&isGlobal=true
//   //POST /api/oobclient/stats/modules/clients
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
//               type: FETCH_CLIENT_OOB_MODULE_ANALYTICS_COMPLETE,
//               payload: data.responseObject,
//             });
//           } else {
//             dispatch({
//               type: FETCH_CLIENT_OOB_MODULE_ANALYTICS_FAILURE,
//               payload: data,
//             });
//           }
//           stopLoading(dispatch);
//         },
//         (error) => {
//           dispatch({
//             type: FETCH_CLIENT_OOB_MODULE_ANALYTICS_FAILURE,
//             payload: error,
//           });
//           stopLoading(dispatch);
//         }
//       );
//   };
// };


export const fetchSystemInfo = (rmUserId) => {
  let API_URL = SYSTEM_INFO_API_URL;
  if (rmUserId)
    API_URL = API_URL + "?&rmUserId=" + rmUserId;
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(API_URL, {
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data && data.responseCode === "200"
          ) {
            dispatch({
              type: FETCH_SYSTEM_INFO_COMPLETE,
              payload: data.responseObject,
            });
          } else {
            dispatch({ type: FETCH_SYSTEM_INFO_FAILURE, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_SYSTEM_INFO_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchRoleInfo = () => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(ROLE_TREND_API_URL, {
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data && data.responseCode === "200"
          ) {
            dispatch({
              type: FETCH_ROLE_TREND_COMPLETE,
              payload: data.responseObject,
            });
          } else {
            dispatch({ type: FETCH_ROLE_TREND_FAILURE, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_ROLE_TREND_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchModuleUsage = (rmUserId) => {
  let API_URL = MODULE_USAGE_API_URL;
  // if (rmUserId)
  //   API_URL = API_URL + "?&rmUserId=" + rmUserId;
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(API_URL, {
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data && data.responseCode === "200"
          ) {
            dispatch({
              type: FETCH_MODULE_USAGE_COMPLETE,
              payload: data.responseObject,
            });
          } else {
            dispatch({ type: FETCH_MODULE_USAGE_FAILURE, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_MODULE_USAGE_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchClientUsage = () => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(CLIENT_USAGE_API_URL, {
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data && data.responseCode === "200"
          ) {
            dispatch({
              type: FETCH_CLIENT_USAGE_COMPLETE,
              payload: data.responseObject,
            });
          } else {
            dispatch({ type: FETCH_CLIENT_USAGE_FAILURE, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_CLIENT_USAGE_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};
