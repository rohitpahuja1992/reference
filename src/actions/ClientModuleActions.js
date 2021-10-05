import {
  MHKCLIENT_MODULE_API_URL,
  MHKCLIENT_CONTROL_API_URL,
  MHKCLIENT_COMPONENT_API_URL,
  OOBCLIENT_MODULE_API_URL,
  OOBCLIENT_SUBMODULE_API_URL,
  RESET_CLIENT_DUPLICATE_ERROR,
  // CLIENT_CONTROL_BY_ID_API_URL,
  CLIENT_COMPONENTDATA_BY_ID_API_URL,
  CLIENT_CONTROL_AUDIT_API_URL,
  CLIENT_CONTROL_SIGN_OFF_API_URL,
  CLIENT_CONTROL_RESTORE_API_URL,
  START_SPINNER_ACTION,
  SHOW_SNACKBAR_ACTION,
  RESET_DUPLICATE_ERROR,
  FETCH_MHKCLIENT_MODULE_COMPLETE,
  FETCH_MHKCLIENT_MODULE_FAILURE,
  FETCH_MHKCLIENT_SUBMODULE_COMPLETE,
  FETCH_MHKCLIENT_SUBMODULE_FAILURE,
  DELETE_CLIENTCOMPONENT_COMPLETE,
  DELETE_CLIENTCOMPONENT_FAILURE,
  FETCH_MHKCLIENT_CONTROL_COMPLETE,
  FETCH_MHKCLIENT_CONTROL_FAILURE,
  FETCH_MHKCLIENT_COMPONENT_COMPLETE,
  FETCH_MHKCLIENT_COMPONENT_FAILURE,
  FETCH_CLIENT_MODULE_BY_ID_COMPLETE,
  FETCH_CLIENT_MODULE_BY_ID_FAILURE,
  FETCH_CLIENT_SUBMODULE_BY_ID_COMPLETE,
  FETCH_CLIENT_SUBMODULE_BY_ID_FAILURE,
  FETCH_CLIENT_CONTROL_BY_ID_COMPLETE,
  FETCH_CLIENT_CONTROL_BY_ID_FAILURE,
  UPDATE_CLIENT_CONTROL_COMPLETE,
  UPDATE_CLIENT_CONTROL_FAILURE,
  ADD_CLIENT_CONTROL_COMPLETE,
  ADD_CLIENT_CONTROL_FAILURE,
  FETCH_CLIENT_CONTROL_TIMELINE_COMPLETE,
  FETCH_CLIENT_CONTROL_TIMELINE_FAILURE,
  UPDATE_CLIENT_CONTROL_STATUS_COMPLETE,
  UPDATE_CLIENT_CONTROL_STATUS_FAILURE,
  BULK_CLIENT_CONTROL_STATUS_COMPLETE,
  BULK_CLIENT_CONTROL_STATUS_FAILURE,
  CLIENT_CONTROL_RESTORED_COMPLETE,
  CLIENT_CONTROL_RESTORED_FAILURE,
  FETCH_CLIENT_COMPONENTDATA_BY_ID_COMPLETE,
  FETCH_CLIENT_COMPONENTDATA_BY_ID_FAILURE,
  FETCH_CLIENT_COMPONENTDATA_BY_ID_ERROR,
  FETCH_CLIENT_CONFIG_CONTROL_BY_ID_COMPLETE,
  FETCH_CLIENT_CONFIG_CONTROL_BY_ID_FAILURE,
  ADD_CLIENT_FIELD_API_URL,
  HIDE_MESSAGE_DIALOG
} from "../utils/AppConstants";
import { setRequestHeader, stopLoading } from "../utils/helpers";
import {
  handleUpdateClientControl,
  handleChangeSingleFieldStatus,
  handleRestoreOobSingleField,
  handleBulkFieldStatus,
  // handleAddOobControl,
  CANNOT_DEPLOY_CHILD_AS_PARENT_IS_NOT_DEPLOYED,
  ERROR_MESSAGE,
  DEFAULT_ERROR_MSG
} from "../utils/Messages";

export const fetchClientModule = (
  moduleType,
  clientId,
  clientType,
  startIndex,
  pageSize,
  search
) => {
  let API_URL = "";
  if (moduleType === "global") {
    API_URL =
      OOBCLIENT_MODULE_API_URL +
      "?sortBy=id&clientId=" +
      clientId +
      "&isglobal=true";
    if (clientType !== "CLIENT") {
      API_URL =
        MHKCLIENT_MODULE_API_URL +
        "?sortBy=id&client_id=" +
        clientId +
        "&isglobal=true";
    }
  }
  if (moduleType === "oob") {
    API_URL =
      OOBCLIENT_MODULE_API_URL +
      "?sortBy=id&clientId=" +
      clientId +
      "&isglobal=false";
    if (clientType !== "CLIENT") {
      API_URL =
        MHKCLIENT_MODULE_API_URL +
        "?sortBy=id&client_id=" +
        clientId +
        "&isglobal=false";
    }
  }
  if (moduleType === "all") {
    API_URL =
      OOBCLIENT_MODULE_API_URL +
      "?sortBy=id&clientId=" +
      clientId;
    if (clientType !== "CLIENT") {
      API_URL =
        MHKCLIENT_MODULE_API_URL +
        "?sortBy=id&client_id=" +
        clientId;
    }
  }
  if (search)
    API_URL =
      API_URL +
      "&startIndex=" +
      startIndex +
      "&pageSize=" +
      pageSize +
      "&search=" +
      search.trim();
  if (!search && pageSize)
    API_URL = API_URL + "&startIndex=" + startIndex + "&pageSize=" + pageSize;

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
            // data.responseObject.modules.sort((a, b) => (a.id < b.id ? 1 : -1));
            dispatch({
              type: FETCH_MHKCLIENT_MODULE_COMPLETE,
              payload: {
                pageInfo: data.responseObject,
                startIndex: startIndex,
                pageSize: pageSize,
              },
              //payload: data.responseObject.modules,
            });
          } else {
            dispatch({ type: FETCH_MHKCLIENT_MODULE_FAILURE, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_MHKCLIENT_MODULE_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchClientSubmodule = (
  moduleId,
  clientId,
  version,
  startIndex,
  pageSize,
  search
) => {
  let API_URL =
    MHKCLIENT_MODULE_API_URL + "/" + moduleId + "/" + clientId + "/" + version;

  if (search)
    API_URL =
      API_URL +
      "?startIndex=" +
      startIndex +
      "&pageSize=" +
      pageSize +
      "&search=" +
      search.trim();
  if (!search && pageSize)
    API_URL = API_URL + "?startIndex=" + startIndex + "&pageSize=" + pageSize;

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
            // data.responseObject.modules.sort((a, b) => (a.id < b.id ? 1 : -1));
            dispatch({
              type: FETCH_MHKCLIENT_SUBMODULE_COMPLETE,
              payload: {
                pageInfo: data.responseObject,
                startIndex: startIndex,
                pageSize: pageSize,
                moduleId: moduleId
              },
              //payload: data.responseObject.oobSubmodules,
            });
          } else {
            dispatch({
              type: FETCH_MHKCLIENT_SUBMODULE_FAILURE,
              payload: data,
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_MHKCLIENT_SUBMODULE_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchClientControl = (
  submoduleId,
  startIndex,
  pageSize,
  search
) => {
  let API_URL = MHKCLIENT_CONTROL_API_URL + "/" + submoduleId;
  if (search)
    API_URL =
      API_URL +
      "?startIndex=" +
      startIndex +
      "&pageSize=" +
      pageSize +
      "&search=" +
      search.trim();
  if (!search && pageSize)
    API_URL = API_URL + "?startIndex=" + startIndex + "&pageSize=" + pageSize;
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
            let controls = [];
            if (data.responseObject && data.responseObject.controls) {
              data.responseObject.controls.sort((a, b) =>
                a.createdDate < b.createdDate ? -1 : 1
              );
              controls = data.responseObject.controls.map((control) => {
                if (control.controlData) {
                  control.controlData = JSON.parse(control.controlData);
                }
                return control;
              });
            }
            dispatch({
              type: FETCH_MHKCLIENT_CONTROL_COMPLETE,
              payload: {
                controls: controls,
                pageInfo: data.responseObject,
                startIndex: startIndex,
                pageSize: pageSize,
              },
            });
          } else {
            dispatch({ type: FETCH_MHKCLIENT_CONTROL_FAILURE, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_MHKCLIENT_CONTROL_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchClientModuleById = (moduleId, clientId) => {
  let API_URL = `${OOBCLIENT_MODULE_API_URL}/${moduleId}`;
  if (clientId) {
    API_URL = `${MHKCLIENT_MODULE_API_URL}/${moduleId}/${clientId}`;
  }
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
              type: FETCH_CLIENT_MODULE_BY_ID_COMPLETE,
              payload: data.responseObject,
            });
          } else {
            dispatch({
              type: FETCH_CLIENT_MODULE_BY_ID_FAILURE,
              payload: data,
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_CLIENT_MODULE_BY_ID_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchClientSubmoduleById = (
  submoduleId,
  clientModuleVersionId
) => {
  let API_URL = `${OOBCLIENT_SUBMODULE_API_URL}/${submoduleId}/${clientModuleVersionId}`;
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
              type: FETCH_CLIENT_SUBMODULE_BY_ID_COMPLETE,
              payload: data.responseObject.oobSubmodules[0],
            });
          } else {
            dispatch({
              type: FETCH_CLIENT_SUBMODULE_BY_ID_FAILURE,
              payload: data,
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({
            type: FETCH_CLIENT_SUBMODULE_BY_ID_FAILURE,
            payload: error,
          });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchClientControlById = (controlId) => {
  let API_URL = `${CLIENT_COMPONENTDATA_BY_ID_API_URL}/${controlId}`;
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
              type: FETCH_CLIENT_CONTROL_BY_ID_COMPLETE,
              payload: data.responseObject,
            });
          } else {
            dispatch({
              type: FETCH_CLIENT_CONTROL_BY_ID_FAILURE,
              payload: data,
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({
            type: FETCH_CLIENT_CONTROL_BY_ID_FAILURE,
            payload: error,
          });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchClientConfigControlById = (controlId) => {
  let API_URL = `${CLIENT_COMPONENTDATA_BY_ID_API_URL}/${controlId}`;
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
              type: FETCH_CLIENT_CONFIG_CONTROL_BY_ID_COMPLETE,
              payload: data.responseObject,
            });
          } else {
            dispatch({
              type: FETCH_CLIENT_CONFIG_CONTROL_BY_ID_FAILURE,
              payload: data,
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({
            type: FETCH_CLIENT_CONFIG_CONTROL_BY_ID_FAILURE,
            payload: error,
          });
          stopLoading(dispatch);
        }
      );
  };
};

export const addClientControl = (fromObj, id, primaryField) => {
  let formData = {
    mapField: JSON.stringify(fromObj),
    oobComponentId: id,
    primaryField: primaryField
  }
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(ADD_CLIENT_FIELD_API_URL, {
      method: "post",
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
              type: ADD_CLIENT_CONTROL_COMPLETE,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: `This field added successfully.`,
                severity: "success",
              },
            });
          }

          else if (data.responseCode == "2259") {
            dispatch({ type: ADD_CLIENT_CONTROL_FAILURE, payload: data });
          }
          else {
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: data.responseMessage || DEFAULT_ERROR_MSG,
                severity: "warning"
              },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: ADD_CLIENT_CONTROL_FAILURE, payload: error });
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

export const resetClientError = () => {
  return {
    type: RESET_CLIENT_DUPLICATE_ERROR,
    payload: undefined,
  };
};

export const updateClientControl = (fromObj) => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(MHKCLIENT_CONTROL_API_URL, {
      method: "put",
      body: JSON.stringify(fromObj),
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            // let controlByIdData = "";
            // if (data.responseObject && data.responseObject.controls) {
            //   controlByIdData = data.responseObject.controls;
            //   controlByIdData.control.format = JSON.parse(
            //     controlByIdData.control.format
            //   );
            //   controlByIdData.controlData = JSON.parse(
            //     controlByIdData.controlData
            //   );
            // }
            dispatch({
              type: UPDATE_CLIENT_CONTROL_COMPLETE,
              payload: data.responseObject,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleUpdateClientControl(data.responseCode).message,
                severity: handleUpdateClientControl(data.responseCode)
                  .messageType,
              },
            });
          }
          else if (data.responseCode === "2291" || data.responseCode === 2291) {
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: CANNOT_DEPLOY_CHILD_AS_PARENT_IS_NOT_DEPLOYED,
                severity: "warning",
              },
            });
          }
          else if (data.responseCode == "2259") {
            dispatch({ type: UPDATE_CLIENT_CONTROL_FAILURE, payload: data });
          }
          else {
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: data.responseMessage || DEFAULT_ERROR_MSG,
                severity: "warning"
              },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: UPDATE_CLIENT_CONTROL_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchClientControlAudit = (controlId) => {
  let API_URL = CLIENT_CONTROL_AUDIT_API_URL + "/" + controlId;

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
            data.responseObject?.componentDataAudits?.sort((a, b) =>
              new Date(a.createdDate) < new Date(b.createdDate) ? 1 : -1
            );
            dispatch({
              type: FETCH_CLIENT_CONTROL_TIMELINE_COMPLETE,
              payload: data.responseObject.componentDataAudits,
            });
          } else {
            dispatch({
              type: FETCH_CLIENT_CONTROL_TIMELINE_FAILURE,
              payload: data,
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({
            type: FETCH_CLIENT_CONTROL_TIMELINE_FAILURE,
            payload: error,
          });
          stopLoading(dispatch);
        }
      );
  };
};

export const changeSingleFieldStatus = (payload, status, fieldName, fromRetry) => {
  console.log("payload", payload, status, fieldName);
  const statusLabel = {
    SIGN_OFF: "signed off",
    APPROVED: "approved",
    RETRACT: "retracted",
    VALIDATED: "validated",
    CONFIGURED: "configured",
    PRODUCT_REVIEW_NEEDED: "sent for review",
    CLIENT_REVIEW_NEEDED: "sent for review",
    CONFIG_REVIEW_NEEDED: "sent for review",
  };
  console.log("label", statusLabel[status]);
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(CLIENT_CONTROL_SIGN_OFF_API_URL, {
      method: "put",
      body: JSON.stringify([payload]),
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            data.responseCode === "201" &&
            data.responseObject &&
            data.responseObject.components &&
            data.responseObject.components[0] &&
            data.responseObject.components[0].executionResult &&
            (data.responseObject.components[0].executionResult.messageCode ===
              "2125" ||
              data.responseObject.components[0].executionResult.messageCode ===
              "2128" ||
              data.responseObject.components[0].executionResult.messageCode ===
              "2132")
          ) {
            dispatch({
              type: UPDATE_CLIENT_CONTROL_STATUS_COMPLETE,
            });
            if (fromRetry) {
              dispatch({
                type: SHOW_SNACKBAR_ACTION,
                payload: {
                  detail: `The field successfully ${data.responseObject.components[0].status}`,
                  severity: "success",
                },
              });
            }
            else {
              dispatch({
                type: SHOW_SNACKBAR_ACTION,
                payload: {
                  detail: handleChangeSingleFieldStatus(
                    data.responseCode,
                    statusLabel[status],
                    fieldName
                  ).message,
                  severity: handleChangeSingleFieldStatus(
                    data.responseCode,
                    statusLabel[status],
                    fieldName
                  ).messageType,
                },
              });
            }
          }
          else if (
            data.responseCode === "2233" ||
            data.responseCode === 2233
          ) {
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: data.responseMessage,
                severity: "warning",
              },
            });
          }
          else if (data.responseCode === "2291" || data.responseCode === 2291) {
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: CANNOT_DEPLOY_CHILD_AS_PARENT_IS_NOT_DEPLOYED,
                severity: "warning",
              },
            });
          }
          else if (
            data &&
            data.responseCode === "201" &&
            data.responseObject &&
            data.responseObject.components &&
            data.responseObject.components[0] &&
            data.responseObject.components[0].executionResult &&
            data.responseObject.components[0].executionResult.message
          ) {
            dispatch({
              type: UPDATE_CLIENT_CONTROL_STATUS_FAILURE,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: data.responseObject.components[0].executionResult.message,
                severity: "warning",
              },
            });
          } else {
            dispatch({
              type: UPDATE_CLIENT_CONTROL_STATUS_FAILURE,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleChangeSingleFieldStatus(
                  data.responseCode,
                  "",
                  fieldName
                ).message,
                severity: handleChangeSingleFieldStatus(
                  data.responseCode,
                  "",
                  fieldName
                ).messageType,
              },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({
            type: UPDATE_CLIENT_CONTROL_STATUS_FAILURE,
          });
          dispatch({
            type: SHOW_SNACKBAR_ACTION,
            payload: {
              detail: handleChangeSingleFieldStatus("", "", fieldName).message,
              severity: handleChangeSingleFieldStatus("", "", fieldName)
                .messageType,
            },
          });
          stopLoading(dispatch);
        }
      );
  };
};

export const restoreOobSingleField = (clientControlId) => {
  const API_URL = `${CLIENT_CONTROL_RESTORE_API_URL}/${clientControlId}`;
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(API_URL, {
      method: "put",
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (data && data.responseCode === "200") {
            dispatch({
              type: CLIENT_CONTROL_RESTORED_COMPLETE,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleRestoreOobSingleField(
                  data.responseCode
                ).message,
                severity: handleRestoreOobSingleField(
                  data.responseCode
                ).messageType,
              },
            });
          } 
          else if (data.responseCode === "2253" || data.responseCode === 2253) {
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: "OOB component data field does not exists",
                severity: "warning",
              },
            });
          }
          else {
            dispatch({
              type: CLIENT_CONTROL_RESTORED_FAILURE,
            });

            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleRestoreOobSingleField(
                  data.responseCode
                ).message,
                severity: handleRestoreOobSingleField(
                  data.responseCode
                ).messageType,
              },
            });
            //}
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({
            type: CLIENT_CONTROL_RESTORED_FAILURE,
          });
          dispatch({
            type: SHOW_SNACKBAR_ACTION,
            payload: {
              detail: handleRestoreOobSingleField("").message,
              severity: handleRestoreOobSingleField("").messageType,
            },
          });
          stopLoading(dispatch);
        }
      );
  };
};

export const bulkFieldStatus = (payload,fromRetry) => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(CLIENT_CONTROL_SIGN_OFF_API_URL, {
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
            // data.responseObject.modules.sort((a, b) => (a.id < b.id ? 1 : -1));
            dispatch({
              type: BULK_CLIENT_CONTROL_STATUS_COMPLETE,
              //payload: data.responseObject
              //payload: data.responseObject.modules,
            });
            const statusLabel = {
              SIGN_OFF: "signed off",
              APPROVED: "approved",
              CLIENT_REVIEW_NEEDED: "sent for client review",
              CONFIG_REVIEW_NEEDED: "sent for config review",
              PRODUCT_REVIEW_NEEDED: "sent for product review",
              CONFIGURED: 'Configured',
              VALIDATED: 'Validated'
            };
            if (fromRetry) {
              dispatch({
                type: SHOW_SNACKBAR_ACTION,
                payload: {
                  detail: `The field successfully ${data.responseObject.components[0].status}`,
                  severity: "success",
                },
              });
            }
            else {
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleBulkFieldStatus(
                  statusLabel[payload[0].status],
                  data.responseCode
                ).message,
                severity: handleBulkFieldStatus(
                  statusLabel[payload[0].status],
                  data.responseCode
                ).messageType,
              },
            });
          }
          }
          else if (data.responseCode === "2291" || data.responseCode === 2291) {
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: CANNOT_DEPLOY_CHILD_AS_PARENT_IS_NOT_DEPLOYED,
                severity: "warning",
              },
            });
          }
          else {
            dispatch({ type: BULK_CLIENT_CONTROL_STATUS_FAILURE });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleBulkFieldStatus("", data.responseCode).message,
                severity: handleBulkFieldStatus("", data.responseCode)
                  .messageType,
              },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({
            type: BULK_CLIENT_CONTROL_STATUS_FAILURE,
            payload: error,
          });
          stopLoading(dispatch);
          dispatch({
            type: SHOW_SNACKBAR_ACTION,
            payload: {
              detail: handleBulkFieldStatus("", "").message,
              severity: handleBulkFieldStatus("", "").messageType,
            },
          });
        }
      );
  };
};


export const fetchClientComponentById = (
  submoduleId,
  startIndex,
  pageSize,
  search
) => {
  let API_URL = MHKCLIENT_COMPONENT_API_URL + "/" + submoduleId;
  if (search)
    API_URL =
      API_URL +
      "?startIndex=" +
      startIndex +
      "&pageSize=" +
      pageSize +
      "&search=" +
      search.trim();
  if (!search && pageSize)
    API_URL = API_URL + "?startIndex=" + startIndex + "&pageSize=" + pageSize;
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
              type: FETCH_MHKCLIENT_COMPONENT_COMPLETE,
              payload: {
                data: data.responseObject,
                totalElements: data.responseObject.totalElements,
                totalPages: data.responseObject.totalPages,
                startIndex: startIndex,
                pageSize: pageSize,
                submoduleId: submoduleId
              }
            });

            // dispatch({
            //   type: FETCH_MHKCLIENT_CONTROL_COMPLETE,
            //   payload: {
            //     controls: controls,
            //     pageInfo: data.responseObject,
            //     startIndex: startIndex,
            //     pageSize: pageSize,
            //   },
            // });
          } else {
            dispatch({ type: FETCH_MHKCLIENT_COMPONENT_FAILURE, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_MHKCLIENT_COMPONENT_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchClientComponentDataById = (controlId) => {
  let API_URL = `${CLIENT_COMPONENTDATA_BY_ID_API_URL}/${controlId}`;
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
            // let controlByIdData = "";

            // if (data.responseObject) {
            //   controlByIdData = data.responseObject;
            //   controlByIdData.control.format = JSON.parse(
            //     controlByIdData.control.format
            //   );
            //   controlByIdData.controlData = JSON.parse(
            //     controlByIdData.controlData
            //   );
            // }
            dispatch({
              type: FETCH_CLIENT_COMPONENTDATA_BY_ID_COMPLETE,
              payload: data.responseObject,
            });
          } else {
            dispatch({
              type: FETCH_CLIENT_COMPONENTDATA_BY_ID_FAILURE,
              payload: data,
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({
            type: FETCH_CLIENT_COMPONENTDATA_BY_ID_ERROR,
            payload: error,
          });
          stopLoading(dispatch);
        }
      );
  };
};

export const updateClientModule = (fromObj) => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(MHKCLIENT_CONTROL_API_URL, {
      method: "put",
      body: JSON.stringify(fromObj),
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
              type: UPDATE_CLIENT_CONTROL_COMPLETE,
              payload: data.responseObject,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleUpdateClientControl(data.responseCode).message,
                severity: handleUpdateClientControl(data.responseCode)
                  .messageType,
              },
            });
          }
          else if (data.responseCode === "2291" || data.responseCode === 2291) {
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: CANNOT_DEPLOY_CHILD_AS_PARENT_IS_NOT_DEPLOYED,
                severity: "warning",
              },
            });
          }
          else {
            dispatch({ type: UPDATE_CLIENT_CONTROL_FAILURE, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: UPDATE_CLIENT_CONTROL_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};


export const deleteClientComponetnById = (id) => {
  let API_URL = CLIENT_COMPONENTDATA_BY_ID_API_URL + "?id=" + id;
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
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            dispatch({
              type: DELETE_CLIENTCOMPONENT_COMPLETE,
              //payload: moduleData.list,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: "Client field is deleted successfully",
                severity: "success"
              },
            });
          }
          else {
            dispatch({ type: DELETE_CLIENTCOMPONENT_FAILURE, payload: data });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: data.responseMessage || DEFAULT_ERROR_MSG,
                severity: "warning"
              },
            });
          }
          stopLoading(dispatch);
          dispatch({ type: HIDE_MESSAGE_DIALOG, payload: undefined });
        },
        (error) => {
          dispatch({ type: DELETE_CLIENTCOMPONENT_FAILURE, payload: error });
          stopLoading(dispatch);
          dispatch({ type: HIDE_MESSAGE_DIALOG, payload: undefined });
          dispatch({
            type: SHOW_SNACKBAR_ACTION,
            payload: {
              detail: ERROR_MESSAGE,
              severity: "error",
            },
          });
        }
      );
  };
};

export const resetDuplicateError = () => {
  return {
    type: RESET_DUPLICATE_ERROR,
    payload: undefined,
  };
};
