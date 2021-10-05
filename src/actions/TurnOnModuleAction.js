import {
  ADD_Turn_On_Module_COMPLETE, 
  ADD_Turn_On_Module_ERROR,
  ADD_Turn_On_Module_FAILURE,
  TurnOnModule_API_URL,
  START_SPINNER_ACTION,
  SHOW_SNACKBAR_ACTION,
  CORRESPONDENCE_DEFINITION_ID_API_URL,
  DEFAULT_CORRESPONDENCE_PACKAGE_API_URL,
  DEFAULT_DELIVERY_TAG_API_URL,
  CORRESPONDENCE_DEFINITION_ID_COMPLETE,
  CORRESPONDENCE_DEFINITION_ID_ERROR,
  CORRESPONDENCE_DEFINITION_ID_FAILURE,
  DEFAULT_CORRESPONDENCE_PACKAGE_COMPLETE,
  DEFAULT_CORRESPONDENCE_PACKAGE_ERROR,
  DEFAULT_CORRESPONDENCE_PACKAGE_FAILURE,
  DEFAULT_DELIVERY_TAG_COMPLETE,
  DEFAULT_DELIVERY_TAG_ERROR,
  DEFAULT_DELIVERY_TAG_FAILURE,
} from "../utils/AppConstants";
import { setRequestHeader, stopLoading } from "../utils/helpers";
import { DEFAULT_ERROR_MSG } from "../utils/Messages";

export const fetchCorrespondenceDefinitionId = (clientid) => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(CORRESPONDENCE_DEFINITION_ID_API_URL + '/' + clientid, {
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (data && data.responseCode === "200") {
            dispatch({ type: CORRESPONDENCE_DEFINITION_ID_COMPLETE, payload: data.responseObject });
          } else {
            dispatch({
              type: CORRESPONDENCE_DEFINITION_ID_ERROR,
              payload: data ? data : { message: DEFAULT_ERROR_MSG },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: CORRESPONDENCE_DEFINITION_ID_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchDefaultCorrespondencePackage = (clientid) => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(DEFAULT_CORRESPONDENCE_PACKAGE_API_URL + '/' + clientid, {
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (data && data.responseCode === "200") {
            dispatch({ type: DEFAULT_CORRESPONDENCE_PACKAGE_COMPLETE, payload: data.responseObject });
          } else {
            dispatch({
              type: DEFAULT_CORRESPONDENCE_PACKAGE_ERROR,
              payload: data ? data : { message: DEFAULT_ERROR_MSG },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: DEFAULT_CORRESPONDENCE_PACKAGE_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchDefaultDeliveryTag = (clientid) => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(DEFAULT_DELIVERY_TAG_API_URL + '/' + clientid, {
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (data && data.responseCode === "200") {
            dispatch({ type: DEFAULT_DELIVERY_TAG_COMPLETE, payload: data.responseObject });
          } else {
            dispatch({
              type: DEFAULT_DELIVERY_TAG_ERROR,
              payload: data ? data : { message: DEFAULT_ERROR_MSG },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: DEFAULT_DELIVERY_TAG_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const addTurnOnModule = (turnOnModuleInfo) => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(TurnOnModule_API_URL, {
      method: "put",
      body: JSON.stringify(turnOnModuleInfo),
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
              type: ADD_Turn_On_Module_COMPLETE,
              payload: data.responseObject,
            });
          } else {
            dispatch({ type: ADD_Turn_On_Module_ERROR, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: ADD_Turn_On_Module_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};