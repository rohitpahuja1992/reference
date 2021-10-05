import {
  FETCH_CLIENT_API_URL,
  FETCH_CLIENTS_API_COMPLETE,
  FETCH_CLIENTS_API_ERROR,
  FETCH_CLIENTS_API_FAILURE,
  FETCH_CLIENT_PROFILE_API_URL,
  FETCH_CLIENT_PROFILE_COMPLETE,
  FETCH_CLIENT_PROFILE_FAILURE,
  FETCH_CLIENTBYID_API_URL,
  FETCH_CLIENTBYID_COMPLETE,
  FETCH_CLIENTBYID_FAILURE,
  ADD_CLIENT_PROFILE_API_URL,
  ADD_CLIENT_PROFILE_COMPLETE,
  ADD_CLIENT_PROFILE_ERROR,
  ADD_CLIENT_PROFILE_FAILURE,
  UPDATE_CLIENT_PROFILE_API_URL,
  UPDATE_CLIENT_PROFILE_COMPLETE,
  UPDATE_CLIENT_PROFILE_ERROR,
  UPDATE_CLIENT_PROFILE_FAILURE,
  DELETECLIENT_API_URL,
  DELETE_CLIENT_COMPLETE,
  DELETE_CLIENT_ERROR,
  DELETE_CLIENT_FAILURE,
  SAVE_CLIENT_INFO,
  RESET_ADD_CLIENT,
  RESET_CLIENT_INFO,
  START_SPINNER_ACTION,
  SHOW_SNACKBAR_ACTION,
  HIDE_MESSAGE_DIALOG,
} from "../utils/AppConstants";
import { setRequestHeader, stopLoading } from "../utils/helpers";

export const fetchClients = () => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(FETCH_CLIENT_API_URL, {
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            data.responseObject.sort((a, b) =>
              a.clientName > b.clientName ? 1 : -1
            );
            dispatch({
              type: FETCH_CLIENTS_API_COMPLETE,
              payload: data.responseObject,
            });
          } else {
            dispatch({
              type: FETCH_CLIENTS_API_ERROR,
              payload: data ? data : { message: "Error Occurred." },
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

export const fetchClientsProfile = () => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(FETCH_CLIENT_PROFILE_API_URL, {
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            data.responseObject.sort((a, b) => (a.id < b.id ? 1 : -1));
            dispatch({
              type: FETCH_CLIENT_PROFILE_COMPLETE,
              payload: data.responseObject,
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
  let FETCH_CLIENTBYID = FETCH_CLIENTBYID_API_URL + clientId;
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    dispatch({ type: RESET_ADD_CLIENT });
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

export const addClientProfile = (clientInfo, fileData) => {
  let addClientFormData = {
    clientName: clientInfo.clientName.trim(),
    clientStatus: 0,
    codeVersion: { id: clientInfo.version },
    relationshipManager: { id: clientInfo.manager },
    modules: clientInfo.modules,
  };

  const formDatas = new FormData();
  formDatas.append("file", fileData);
  formDatas.append("clientData", JSON.stringify(addClientFormData));

  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(ADD_CLIENT_PROFILE_API_URL, {
      method: "post",
      body: formDatas,
      headers: {
        ...setRequestHeader("upload"),
      },
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
              //payload: data.responseObject,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail:
                  "Client " +
                  addClientFormData.clientName +
                  " successfully added.",
                severity: "success",
              },
            });
          } else {
            dispatch({ type: ADD_CLIENT_PROFILE_ERROR, payload: data });
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
          dispatch({ type: ADD_CLIENT_PROFILE_FAILURE, payload: error });
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

export const deleteClient = (clientId, clientName) => {
  let DELETE_CLIENT_API = DELETECLIENT_API_URL + clientId;
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(DELETE_CLIENT_API, {
      method: "put",
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
                detail: "Client " + clientName + " successfully termed.",
                severity: "success",
              },
            });
          } else {
            dispatch({ type: DELETE_CLIENT_ERROR, payload: data });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: "An error occurred. Please try again later.",
                severity: "error",
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
              detail: "An error occurred. Please try again later.",
              severity: "error",
            },
          });
        }
      );
  };
};

export const updateClientProfile = (formData, clientData) => {
  const moduleList = formData.modules
    ? formData.modules.map((item) => {
        return { id: item };
      })
    : clientData.details.modules.map((item) => {
        return { id: item.id };
      });
  const environmentList = formData.environments
    ? formData.environments.map((item) => {
        return { id: item };
      })
    : clientData.details.environments.map((item) => {
        return { id: item.id };
      });
  let updateClientFormData = {
    id: clientData.details.id,
    clientName: formData.clientName
      ? formData.clientName.trim()
      : clientData.details.clientName,
    clientStatus: formData.accountStatus
      ? formData.accountStatus === "ACTIVE"
        ? 0
        : 1
      : clientData.details.clientStatus,
    codeVersion: formData.version
      ? { id: formData.version }
      : { id: clientData.details.codeVersion.id },
    relationshipManager: formData.manager
      ? { id: formData.manager }
      : { id: clientData.details.relationshipManager.id },
    modules: moduleList,
    environments: environmentList,
  };
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(UPDATE_CLIENT_PROFILE_API_URL, {
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
                detail:
                  "Client " +
                  updateClientFormData.clientName +
                  " successfully updated.",
                severity: "success",
              },
            });
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
