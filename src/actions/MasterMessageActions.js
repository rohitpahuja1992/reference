import {
  MASTERMESSAGE_API_URL,
  MASTERMESSAGEBYMODULE_API_URL,
  FETCH_MASTERMESSAGE_COMPLETE,
  FETCH_MASTERMESSAGE_FAILURE,
  FETCH_ALL_MASTERMESSAGE_COMPLETE,
  FETCH_ALL_MASTERMESSAGE_FAILURE,
  FETCH_MASTERMESSAGEBYID_COMPLETE,
  FETCH_MASTERMESSAGEBYID_FAILURE,
  ADD_MASTERMESSAGE_COMPLETE,
  ADD_MASTERMESSAGE_FAILURE,
  ADD_MASTERMESSAGE_ERROR,
  UPDATE_MASTERMESSAGE_COMPLETE,
  UPDATE_MASTERMESSAGE_ERROR,
  UPDATE_MASTERMESSAGE_FAILURE,
  FETCH_MASTERMESSAGEBYMODULEID_COMPLETE,
  FETCH_MASTERMESSAGEBYMODULEID_FAILURE,
  FETCH_CONTROLPROPERTY_API_URL,
  FETCH_CONTROLPROPERTY_COMPLETE,
  FETCH_CONTROLPROPERTY_FAILURE,
  UPDATE_CONTROLTOOGLE_API_URL,
  UPDATE_CONTROLTOOGLE_COMPLETE,
  UPDATE_CONTROLTOOGLE_FAILURE,
  UPDATE_CONTROLTOOGLE_ERROR,
  DELETE_MASTERMESSAGE_COMPLETE,
  DELETE_MASTERMESSAGE_FAILURE,
  DELETE_MASTERMESSAGE_ERROR,
  SHOW_SNACKBAR_ACTION,
  START_SPINNER_ACTION,
  // HIDE_MESSAGE_DIALOG,
  // RESET_UPDATE_ERROR,
  // RESET_DUPLICATE_ERROR,
  FETCH_CLIENT_CONTROLPROPERTY_API_URL,
  UPDATE_CIENT_CONTROLTOOGLE_API_URL
} from "../utils/AppConstants";
import { setRequestHeader, stopLoading } from "../utils/helpers";
import {
  handleAddMasterMessage,
  handleUpdateMasterMessage,
  ALREADY_USE_MODULE,
  ERROR_MESSAGE,
  DEFAULT_ERROR_MSG
} from "../utils/Messages";
//handleMasterSubmoduleTerm, ERROR_MESSAGE, handleUpdateMasterSubmodule, }


export const deleteMasterMessageConstant = (msgConstantID) => {
  let API_URL = MASTERMESSAGE_API_URL + "?id=" + msgConstantID;
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(API_URL, {
      method: "delete",
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "201")
          ) {
            dispatch({
              type: DELETE_MASTERMESSAGE_COMPLETE,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: "Message Constant deleted successfully",
                severity: "success",
              },
            });
          }
          else if (data.responseCode === "9156" || data.responseCode === 9156) {
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: ALREADY_USE_MODULE,
                severity: "warning",
              },
            });
          }
          else {
            dispatch({ type: DELETE_MASTERMESSAGE_ERROR, payload: data });
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
          dispatch({ type: DELETE_MASTERMESSAGE_FAILURE, payload: error });
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

export const fetchMasterMessage = (startIndex, pageSize, search) => {
  let API_URL = MASTERMESSAGE_API_URL + "?sortBy=createdDate";
  if (pageSize)
    API_URL = API_URL + "&startIndex=" + startIndex + "&pageSize=" + pageSize;
  if (search) API_URL = API_URL + "&search=" + search.trim();
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
              type: FETCH_MASTERMESSAGE_COMPLETE,
              payload: {
                pageInfo: data.responseObject,
                startIndex: startIndex,
                pageSize: pageSize,
              },
            });
          } 
          else if (data.responseCode === "9156" || data.responseCode === 9156) {
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: ALREADY_USE_MODULE,
                severity: "warning",
              },
            });
          }
          else {
            dispatch({ type: FETCH_MASTERMESSAGE_FAILURE, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_MASTERMESSAGE_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchAllMasterMessage = () => {
  let API_URL = MASTERMESSAGE_API_URL;
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
              type: FETCH_ALL_MASTERMESSAGE_COMPLETE,
              payload: {
                pageInfo: data.responseObject,
              },
            });
          }
          else if (data.responseCode === "9156" || data.responseCode === 9156) {
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: ALREADY_USE_MODULE,
                severity: "warning",
              },
            });
          }
          else {
            dispatch({ type: FETCH_ALL_MASTERMESSAGE_FAILURE, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_ALL_MASTERMESSAGE_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const addMessage = (formData) => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(MASTERMESSAGE_API_URL, {
      method: "post",
      body: JSON.stringify(formData),
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "201" || data.responseCode === 201)
          ) {
            dispatch({
              type: ADD_MASTERMESSAGE_COMPLETE,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleAddMasterMessage(
                  formData.messageConstant,
                  data.responseCode
                ).message,
                severity: handleAddMasterMessage(
                  formData.messageConstant,
                  data.responseCode
                ).messageType,
              },
            });
          } 
          else if (data.responseCode === "9156" || data.responseCode === 9156) {
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: ALREADY_USE_MODULE,
                severity: "warning",
              },
            });
          }
          else {
            dispatch({ type: ADD_MASTERMESSAGE_ERROR, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: ADD_MASTERMESSAGE_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchMessageById = (id) => {
  let API_URL = MASTERMESSAGE_API_URL + "/" + id;
  //let API_URL = 'http://125.63.92.178:8184/config/config/messageconstant/{id}?id=5';
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(API_URL, {
      method: "get",
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
              type: FETCH_MASTERMESSAGEBYID_COMPLETE,
              payload: data.responseObject,
            });
          } 
          else if (data.responseCode === "9156" || data.responseCode === 9156) {
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: ALREADY_USE_MODULE,
                severity: "warning",
              },
            });
          }
          else {
            dispatch({
              type: FETCH_MASTERMESSAGEBYID_FAILURE,
              payload: data,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: ERROR_MESSAGE,
                severity: "error",
              },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_MASTERMESSAGEBYID_FAILURE, payload: error });
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

export const updateMasterMessage = (payload) => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(MASTERMESSAGE_API_URL, {
      method: "put",
      body: JSON.stringify(payload),
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "201" || data.responseCode === 201)
          ) {
            dispatch({
              type: UPDATE_MASTERMESSAGE_COMPLETE,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleUpdateMasterMessage(
                  payload.messageConstant,
                  data.responseCode
                ).message,
                severity: handleUpdateMasterMessage(
                  payload.messageConstant,
                  data.responseCode
                ).messageType,
              },
            });
          } 
          else if (data.responseCode === "9156" || data.responseCode === 9156) {
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: ALREADY_USE_MODULE,
                severity: "warning",
              },
            });
          }
          else {
            dispatch({ type: UPDATE_MASTERMESSAGE_ERROR, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: UPDATE_MASTERMESSAGE_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchMasterMessageByModuleId = (id) => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(MASTERMESSAGEBYMODULE_API_URL, {
      method: "post",
      body: JSON.stringify(id),
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
              type: FETCH_MASTERMESSAGEBYMODULEID_COMPLETE,
              payload: data.responseObject,
            });
          } else {
            dispatch({
              type: FETCH_MASTERMESSAGEBYMODULEID_FAILURE,
              payload: data,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: ERROR_MESSAGE,
                severity: "error",
              },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({
            type: FETCH_MASTERMESSAGEBYMODULEID_FAILURE,
            payload: error,
          });
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

export const fetchControlPropertyList = (moduleId, oobVersion) => {
  let apiUrl =
    FETCH_CONTROLPROPERTY_API_URL +
    "?&moduleId=" +
    moduleId +
    "&oobVersion=" +
    oobVersion;
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(apiUrl, {
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
              type: FETCH_CONTROLPROPERTY_COMPLETE,
              payload: data.responseObject,
            });
          } else {
            dispatch({
              type: FETCH_CONTROLPROPERTY_FAILURE,
              payload: data,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: ERROR_MESSAGE,
                severity: "error",
              },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({
            type: FETCH_CONTROLPROPERTY_FAILURE,
            payload: error,
          });
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

export const updateOobControlToggle = (formData, openFrom) => {
  let API_URL = "";
  if (openFrom === 'Client')
    API_URL = UPDATE_CIENT_CONTROLTOOGLE_API_URL;
  if (openFrom === 'OOB')
    API_URL = UPDATE_CONTROLTOOGLE_API_URL;
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(API_URL, {
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
            dispatch({
              type: UPDATE_CONTROLTOOGLE_COMPLETE,
            });
            // dispatch({
            //   type: SHOW_SNACKBAR_ACTION,
            //   payload: {
            //     detail: handleUpdateMasterMessage(payload.messageConstant, data.responseCode).message,
            //     severity: handleUpdateMasterMessage(payload.messageConstant, data.responseCode).messageType,
            //   },
            // });
          } else {
            dispatch({ type: UPDATE_CONTROLTOOGLE_ERROR, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: UPDATE_CONTROLTOOGLE_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchClientControlPropertyList = (
  moduleId,
  oobVersion,
  clientId
) => {
  let apiUrl =
    FETCH_CLIENT_CONTROLPROPERTY_API_URL +
    "?&moduleId=" +
    moduleId +
    "&oobVersion=" +
    oobVersion +
    "&clientId=" +
    clientId;
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(apiUrl, {
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
              type: FETCH_CONTROLPROPERTY_COMPLETE,
              payload: data.responseObject,
            });
          }
          else if (
            (data.responseCode === "2102" || data.responseCode === 2102)
          ) {
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: data.responseMessage,
                severity: "warning",
              },
            });
          } else {
            dispatch({
              type: FETCH_CONTROLPROPERTY_FAILURE,
              payload: data,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: ERROR_MESSAGE,
                severity: "error",
              },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({
            type: FETCH_CONTROLPROPERTY_FAILURE,
            payload: error,
          });
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
