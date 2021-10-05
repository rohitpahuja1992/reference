import {
    CONFIG_NAMELIST_API_URL,
    CONFIG_MODULEBYID_API_URL,
    CONFIG_TABLEFIELD_API_URL,
    FETCH_CONFIG_NAMELIST_COMPLETE,
    FETCH_CONFIG_NAMELIST_FAILURE,
    FETCH_CONFIG_MODULEBYID_COMPLETE,
    FETCH_CONFIG_MODULEBYID_FAILURE,
    FETCH_CONFIG_TABLEFIELD_COMPLETE,
    FETCH_CONFIG_TABLEFIELD_FAILURE,
    START_SPINNER_ACTION,
  } from "../utils/AppConstants";
  import { setRequestHeader, stopLoading } from "../utils/helpers";
  
  export const fetchConfigModuleList = () => {
    return (dispatch) => {
      dispatch({ type: START_SPINNER_ACTION });
      return fetch(CONFIG_NAMELIST_API_URL, {
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
                type: FETCH_CONFIG_NAMELIST_COMPLETE,
                payload: data.responseObject,
              });
            } else {
              dispatch({ type: FETCH_CONFIG_NAMELIST_FAILURE, payload: data });
            }
            stopLoading(dispatch);
          },
          (error) => {
            dispatch({ type: FETCH_CONFIG_NAMELIST_FAILURE, payload: error });
            stopLoading(dispatch);
          }
        );
    };
  };

  export const fetchConfigTableById = (moduleId) => {
    let API_URL = CONFIG_MODULEBYID_API_URL +"/"+moduleId
    return (dispatch) => {
      dispatch({ type: START_SPINNER_ACTION });
      return fetch(API_URL, {
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
                type: FETCH_CONFIG_MODULEBYID_COMPLETE,
                payload: data.responseObject,
              });
            } else {
              dispatch({ type: FETCH_CONFIG_MODULEBYID_FAILURE, payload: data });
            }
            stopLoading(dispatch);
          },
          (error) => {
            dispatch({ type: FETCH_CONFIG_MODULEBYID_FAILURE, payload: error });
            stopLoading(dispatch);
          }
        );
    };
  };

  export const fetchConfigColumnByName = (tableName) => {
    let API_URL = CONFIG_TABLEFIELD_API_URL +"/"+tableName
    return (dispatch) => {
      dispatch({ type: START_SPINNER_ACTION });
      return fetch(API_URL, {
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
                type: FETCH_CONFIG_TABLEFIELD_COMPLETE,
                payload: data.responseObject.fieldMappings,
              });
            } else {
              dispatch({ type: FETCH_CONFIG_TABLEFIELD_FAILURE, payload: data });
            }
            stopLoading(dispatch);
          },
          (error) => {
            dispatch({ type: FETCH_CONFIG_TABLEFIELD_FAILURE, payload: error });
            stopLoading(dispatch);
          }
        );
    };
  };
  
  