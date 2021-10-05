import {
  CLIENT_API_URL,
  CLIENT_ASSIGNMODULE_API_URL,
  CLIENT_ASSIGNENVIRONMENT_API_URL,
  FETCH_CLIENT_API_URL,
  FETCH_CLIENTS_API_COMPLETE,
  FETCH_CLIENTS_API_ERROR,
  FETCH_CLIENTS_API_FAILURE,
  //FETCH_CLIENT_PROFILE_API_URL,
  FETCH_CLIENT_PROFILE_COMPLETE,
  FETCH_CLIENT_PROFILE_FAILURE,
  //FETCH_CLIENTBYID_API_URL,
  FETCH_CLIENTBYID_COMPLETE,
  FETCH_CLIENTBYID_FAILURE,
  //ADD_CLIENT_PROFILE_API_URL,
  ADD_CLIENT_PROFILE_COMPLETE,
  ADD_CLIENT_PROFILE_ERROR,
  ADD_CLIENT_PROFILE_FAILURE,
  ADD_CLIENT_MODULE_COMPLETE,
  ADD_CLIENT_MODULE_FAILURE,
  //UPDATE_CLIENT_PROFILE_API_URL,
  ADD_CLIENT_ENVIRONMENT_COMPLETE,
  ADD_CLIENT_ENVIRONMENT_FAILURE,
  UPDATE_CLIENT_PROFILE_COMPLETE,
  UPDATE_CLIENT_PROFILE_ERROR,
  UPDATE_CLIENT_PROFILE_FAILURE,
  //DELETECLIENT_API_URL,
  DELETE_CLIENT_COMPLETE,
  DELETE_CLIENT_ERROR,
  DELETE_CLIENT_FAILURE,
  SAVE_CLIENT_INFO,
  RESET_ADD_CLIENT,
  RESET_CLIENT_INFO,
  START_SPINNER_ACTION,
  SHOW_SNACKBAR_ACTION,
  HIDE_MESSAGE_DIALOG,
  DEFAULT_START_INDEX,
  DEFAULT_PAGE_SIZE_TIMELINE
  //RESET_HIERARCHY_DETAILS,
} from "../utils/AppConstants";
import {
  DEFAULT_ERROR_MSG,
  handleAddClientEnvironment,
  handleAddClientProfile,
  handleAddClientModules,
  handleDeleteClient,
  handleUpdateClientProfile,
} from "../utils/Messages";
import { setRequestHeader, stopLoading } from "../utils/helpers";
import {addTurnOnModule} from './TurnOnModuleAction';
import {fetchClientTimeline} from './ClientTimelineActions';

export const fetchClients = (sorting) => {
  let API_URL = FETCH_CLIENT_API_URL;
  if (sorting) API_URL = API_URL + "?&sortBy=" + sorting;
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
            // data.responseObject.Clients.sort((a, b) =>
            //   a.clientName > b.clientName ? 1 : -1
            // );
            dispatch({
              type: FETCH_CLIENTS_API_COMPLETE,
              payload: data.responseObject.Clients,
            });
          } else {
            dispatch({
              type: FETCH_CLIENTS_API_ERROR,
              payload: data ? data : { message: DEFAULT_ERROR_MSG },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_CLIENTS_API_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchClientsProfile = (startIndex, pageSize, search, filter) => {
  let API_URL = CLIENT_API_URL;
  if (pageSize)
    API_URL = API_URL + "?&startIndex=" + startIndex + "&pageSize=" + pageSize;
  if (search) API_URL = API_URL + "&search=" + search.trim();
  if (filter) API_URL = API_URL + "&filterby=" + filter;
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
            //data.responseObject.Clients.sort((a, b) => (a.id < b.id ? 1 : -1));
            dispatch({
              type: FETCH_CLIENT_PROFILE_COMPLETE,
              payload: {
                clientsInfo: data.responseObject,
                startIndex: startIndex,
                pageSize: pageSize,
              },
              //payload: data.responseObject.Clients,
            });
          } else {
            dispatch({ type: FETCH_CLIENT_PROFILE_FAILURE, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_CLIENT_PROFILE_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchClientById = (clientId) => {
  let FETCH_CLIENTBYID = CLIENT_API_URL + "/" + clientId;
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    //dispatch({ type: RESET_HIERARCHY_DETAILS });
    //dispatch({ type: RESET_ADD_CLIENT });
    return fetch(FETCH_CLIENTBYID, {
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
              type: FETCH_CLIENTBYID_COMPLETE,
              payload: data.responseObject,
            });
          } else {
            dispatch({ type: FETCH_CLIENTBYID_FAILURE, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_CLIENTBYID_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const addClientProfile = (clientInfo) => {
  let addClientFormData = {
    clientName: clientInfo.clientName.trim(),
    codeVersionId: clientInfo.version,
    relationshipManagerId: clientInfo.manager,
    // clientStatus: 0,
    // modules: clientInfo.modules,
  };

  // const formDatas = new FormData();
  // formDatas.append("file", fileData);
  // formDatas.append("clientData", JSON.stringify(addClientFormData));

  return (dispatch) => {
    // dispatch({
    //   type: ADD_CLIENT_PROFILE_COMPLETE,
    //   payload: 419,
    // });
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(CLIENT_API_URL, {
      method: "post",
      body: JSON.stringify(addClientFormData),
      headers: setRequestHeader(),
      // {
      //   ...setRequestHeader("upload"),
      // },
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            dispatch({
              type: ADD_CLIENT_PROFILE_COMPLETE,
              payload: data.responseObject.id,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleAddClientProfile(
                  addClientFormData.clientName,
                  data.responseCode
                ).message,
                severity: handleAddClientProfile(
                  addClientFormData.clientName,
                  data.responseCode
                ).messageType,
              },
            });
          } else {
            dispatch({ type: ADD_CLIENT_PROFILE_ERROR, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: ADD_CLIENT_PROFILE_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const addClientEnvironment = (reqobj,clientId) => {
  return (dispatch) => {
    // dispatch({
    //   type: ADD_CLIENT_MODULE_FAILURE,
    //   payload: "ERROR OCCURRED"
    //   //payload: data.responseObject.id,
    // });
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(CLIENT_ASSIGNENVIRONMENT_API_URL, {
      method: "put",
      body: JSON.stringify(reqobj),
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
              type: ADD_CLIENT_ENVIRONMENT_COMPLETE,
              //payload: data.responseObject.id,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleAddClientEnvironment(data.responseCode).message,
                severity: handleAddClientEnvironment(data.responseCode)
                  .messageType,
              },
            });
            dispatch(fetchClientTimeline(clientId,DEFAULT_START_INDEX, DEFAULT_PAGE_SIZE_TIMELINE))
          } 
          else if (data.responseCode === "2289" || data.responseCode === 2289) {
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: "Can't Connect to Client Environment",
                severity: "Warning",
              },
            });
          }
          else {
            dispatch({ type: ADD_CLIENT_ENVIRONMENT_FAILURE, payload: data });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleAddClientEnvironment(data.responseCode).message,
                severity: handleAddClientEnvironment(data.responseCode)
                  .messageType,
              },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: ADD_CLIENT_ENVIRONMENT_FAILURE, payload: error });
          dispatch({
            type: SHOW_SNACKBAR_ACTION,
            payload: {
              detail: handleAddClientEnvironment("").message,
              severity: handleAddClientEnvironment("").messageType,
            },
          });
          stopLoading(dispatch);
        }
      );
  };
};

export const addClientModules = (modulesobj, addFor,payloadval, clientId ) => {
  let addClientFormData = {
    modules: modulesobj,
  };

  // const formDatas = new FormData();
  // formDatas.append("file", fileData);
  // formDatas.append("clientData", JSON.stringify(addClientFormData));

  return (dispatch) => {
    // dispatch({
    //   type: ADD_CLIENT_MODULE_FAILURE,
    //   payload: "ERROR OCCURRED"
    //   //payload: data.responseObject.id,
    // });
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(CLIENT_ASSIGNMODULE_API_URL, {
      method: "post",
      body: JSON.stringify(addClientFormData),
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
              type: ADD_CLIENT_MODULE_COMPLETE,
              //payload: data.responseObject.id,
            });
            if (addFor !== "update") {
            dispatch(addTurnOnModule(payloadval));
            }
            if (addFor) {
              dispatch({
                type: SHOW_SNACKBAR_ACTION,
                payload: {
                  detail: handleAddClientModules(addFor, data.responseCode)
                    .message,
                  severity: handleAddClientModules(addFor, data.responseCode)
                    .messageType,
                },
              });
            } else {
              dispatch({
                type: SHOW_SNACKBAR_ACTION,
                payload: {
                  detail: handleAddClientModules(addFor, data.responseCode)
                    .message,
                  severity: handleAddClientModules(addFor, data.responseCode)
                    .messageType,
                },
              });
            }
            if(clientId) {
            dispatch(fetchClientTimeline(clientId,DEFAULT_START_INDEX, DEFAULT_PAGE_SIZE_TIMELINE))
            }
          } else {
            dispatch({ type: ADD_CLIENT_MODULE_FAILURE, payload: data });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleAddClientModules("", "").message,
                severity: handleAddClientModules("", "").messageType,
              },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: ADD_CLIENT_MODULE_FAILURE, payload: error });
          dispatch({
            type: SHOW_SNACKBAR_ACTION,
            payload: {
              detail: handleAddClientModules("", "").message,
              severity: handleAddClientModules("", "").messageType,
            },
          });
          stopLoading(dispatch);
        }
      );
  };
};

export const deleteClient = (clientId, clientName) => {
  let DELETE_CLIENT_API = CLIENT_API_URL + "/" + clientId;
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(DELETE_CLIENT_API, {
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
            // var foundIndex = clientList.findIndex((x) => x.id === clientId);
            // clientList[foundIndex] = data.responseObject;
            dispatch({ type: DELETE_CLIENT_COMPLETE });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleDeleteClient(clientName, data.responseCode)
                  .message,
                severity: handleDeleteClient(clientName, data.responseCode)
                  .messageType,
              },
            });
          } else {
            dispatch({ type: DELETE_CLIENT_ERROR, payload: data });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleDeleteClient(clientName, data.responseCode)
                  .message,
                severity: handleDeleteClient(clientName, data.responseCode)
                  .messageType,
              },
            });
          }
          stopLoading(dispatch);
          dispatch({ type: HIDE_MESSAGE_DIALOG, payload: undefined });
        },
        (error) => {
          dispatch({ type: DELETE_CLIENT_FAILURE, payload: error });
          stopLoading(dispatch);
          dispatch({ type: HIDE_MESSAGE_DIALOG, payload: undefined });
          dispatch({
            type: SHOW_SNACKBAR_ACTION,
            payload: {
              detail: handleDeleteClient(clientName, "").message,
              severity: handleDeleteClient(clientName, "").messageType,
            },
          });
        }
      );
  };
};

export const updateClientProfile = (formData, clientData, clientId) => {
  console.log("FormData,clientData",formData,clientData);
  const environmentList = formData.environments
    ? formData.environments
    : clientData.details.environments.map((item) => item.environmentId);
  let updateClientFormData = {
    id: clientData.details.id,
    clientName: formData.clientName
      ? formData.clientName.trim()
      : clientData.details.clientName,
    codeVersionId: formData.version
      ? formData.version
      : clientData.details.codeVersion.id,
    relationshipManagerId: formData.manager
      ? formData.manager
      : clientData.details.relationshipManager.id,
    environmentIds: environmentList,
    clientStatus: formData.accountStatus
      ? formData.accountStatus === "ACTIVE"
        ? 0
        : 1
      : clientData.details.clientStatus,
  };
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(CLIENT_API_URL, {
      method: "put",
      body: JSON.stringify(updateClientFormData),
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
              type: UPDATE_CLIENT_PROFILE_COMPLETE,
              //payload: data.responseObject,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleUpdateClientProfile(
                  updateClientFormData.clientName,
                  data.responseCode
                ).message,
                severity: handleUpdateClientProfile(
                  updateClientFormData.clientName,
                  data.responseCode
                ).messageType,
              },
            });
            dispatch(fetchClientTimeline(clientId,DEFAULT_START_INDEX, DEFAULT_PAGE_SIZE_TIMELINE))
          } else {
            dispatch({ type: UPDATE_CLIENT_PROFILE_ERROR, payload: data });
            // dispatch({
            //   type: SHOW_SNACKBAR_ACTION,
            //   payload: {
            //     detail: "Error Occured!Please try again.",
            //     severity: "error",
            //   },
            // });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: UPDATE_CLIENT_PROFILE_FAILURE, payload: error });
          // dispatch({
          //   type: SHOW_SNACKBAR_ACTION,
          //   payload: {
          //     detail: "Error Occured!Please try again.",
          //     severity: "error",
          //   },
          // });
          stopLoading(dispatch);
        }
      );
  };
};

export const saveClientInfo = (savedInfo, inputData) => {
  let moduleList = savedInfo.modules;
  if (Array.isArray(inputData)) {
    moduleList =
      inputData &&
      inputData.map((item) => {
        return { id: item };
      });
    savedInfo.modules = moduleList;
  } else {
    savedInfo = { ...inputData };
    savedInfo.modules = moduleList;
  }
  return {
    type: SAVE_CLIENT_INFO,
    payload: savedInfo,
  };
};

export const resetClientInfo = () => {
  return {
    type: RESET_CLIENT_INFO,
    payload: { clientName: "", version: "", manager: "", modules: [] },
  };
};

export const resetAddError = () => {
  return {
    type: RESET_ADD_CLIENT,
  };
};
