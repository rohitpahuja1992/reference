import {
  OOB_MODULE_API_URL,
  FETCH_OOBMODULE_COMPLETE,
  FETCH_OOBMODULE_FAILURE,
  FETCH_OOBMODULEBYID_COMPLETE,
  FETCH_OOBMODULEBYID_FAILURE,
  FETCH_GLOBALMODULE_COMPLETE,
  FETCH_GLOBALMODULE_FAILURE,
  FETCH_DEFAULTVERSION_API_URL,
  FETCH_DEFAULTVERSION_COMPLETE,
  FETCH_DEFAULTVERSION_FAILURE,
  //ADD_OOBMODULE_API_URL,
  ADD_OOBMODULE_COMPLETE,
  ADD_OOBMODULE_FAILURE,
  UPDATE_OOBMODULE_COMPLETE,
  UPDATE_OOBMODULE_FAILURE,
  DELETE_OOBMODULE_COMPLETE,
  DELETE_OOBMODULE_FAILURE,
  START_SPINNER_ACTION,
  HIDE_MESSAGE_DIALOG,
  SHOW_SNACKBAR_ACTION,
  FETCH_COMPARE_VERSION_COMPLETE,
  FETCH_COMPARE_VERSION_FAILURE,
  OOB_TERMMODULE_API_URL,
  OOB_UNTERMMODULE_API_URL,
  TERM_OOBMODULE_COMPLETE,
  TERM_OOBMODULE_FAILURE,
  UNTERM_OOBMODULE_COMPLETE,
  UNTERM_OOBMODULE_FAILURE,
  RESET_MODULE_DELETED,
} from "../utils/AppConstants";
import { setRequestHeader, stopLoading } from "../utils/helpers";
import {
  handleDeleteOOBModule,
  handleUpdateOOBModule,
  handleAddOOBModule,
  OBBModuleTerm,
  WARNIG,
} from "../utils/Messages";

export const fetchOOBModule = (moduleFor, startIndex, pageSize, search) => {
  let API_URL = OOB_MODULE_API_URL;

  if (moduleFor && moduleFor === "oob") {

    API_URL = API_URL + "?isglobal=false";
  }
  if (moduleFor && moduleFor === "all") {
    if (search)
      API_URL =
        API_URL +
        "?isglobal=all&startIndex=" +
        startIndex +
        "&pageSize=" +
        pageSize +
        "&search=" +
        search.trim();
    else if (pageSize)
      API_URL =
        API_URL +
        "?isglobal=all&startIndex=" +
        startIndex +
        "&pageSize=" +
        pageSize;
    else API_URL = API_URL + "?isglobal=all";
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
            data.responseObject.modules.sort((a, b) =>
              a.versions[a.versions.length - 1].createdDate <
                b.versions[b.versions.length - 1].createdDate
                ? 1
                : -1
            );
            dispatch({
              type: FETCH_OOBMODULE_COMPLETE,
              payload: {
                pageInfo: data.responseObject,
                startIndex: startIndex,
                pageSize: pageSize,
              },
              //payload: data.responseObject.modules,
            });
          } else {
            dispatch({ type: FETCH_OOBMODULE_FAILURE, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_OOBMODULE_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchGlobalModule = () => {
  let API_URL = OOB_MODULE_API_URL + "?isglobal=true";

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
              type: FETCH_GLOBALMODULE_COMPLETE,
              payload: data.responseObject.modules,
            });
          } else {
            dispatch({ type: FETCH_GLOBALMODULE_FAILURE, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_GLOBALMODULE_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchOOBModuleById = (moduleId, startIndex, pageSize) => {
  let API_URL = pageSize ? OOB_MODULE_API_URL + "/" + moduleId + "?startIndex=" + startIndex + "&pageSize=" + pageSize : OOB_MODULE_API_URL + "/" + moduleId;
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
              type: FETCH_OOBMODULEBYID_COMPLETE,
              payload: {
                oobComponents: data.responseObject?.oobComponents,
                totalElements: data.responseObject?.totalElements,
                totalPages: data.responseObject?.totalPages,
                pageSize: pageSize,
                startIndex: startIndex,
              },
            });
          } else {
            dispatch({ type: FETCH_OOBMODULEBYID_FAILURE, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_OOBMODULEBYID_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchDefaultVersion = (moduleId) => {
  let API_URL = FETCH_DEFAULTVERSION_API_URL + moduleId + `/3`;
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
              type: FETCH_DEFAULTVERSION_COMPLETE,
              payload: data.responseObject,
            });
          } else {
            dispatch({ type: FETCH_DEFAULTVERSION_FAILURE, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_DEFAULTVERSION_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const addOOBModule = (inputs, moduleName, label) => {
  let addOOBModuleFormData = {
    moduleId: inputs.moduleName,
    oobModuleVerNum: inputs.version,
  };
  if (inputs.copyVersion) {
    addOOBModuleFormData.versionFrom = inputs.copyVersion;
  }
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(OOB_MODULE_API_URL, {
      method: "post",
      body: JSON.stringify(addOOBModuleFormData),
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
              type: ADD_OOBMODULE_COMPLETE,
            });
            if (label === "version") {
              dispatch({
                type: SHOW_SNACKBAR_ACTION,
                payload: {
                  detail: handleAddOOBModule(
                    inputs.version,
                    label,
                    moduleName,
                    data.responseCode
                  ).message,
                  severity: handleAddOOBModule(
                    inputs.version,
                    label,
                    moduleName,
                    data.responseCode
                  ).messageType,
                },
              });
            } else {
              dispatch({
                type: SHOW_SNACKBAR_ACTION,
                payload: {
                  detail: handleAddOOBModule(
                    inputs.version,
                    label,
                    moduleName,
                    data.responseCode
                  ).message,
                  severity: handleAddOOBModule(
                    inputs.version,
                    label,
                    moduleName,
                    data.responseCode
                  ).messageType,
                },
              });
            }
          } else {
            dispatch({ type: ADD_OOBMODULE_FAILURE, payload: data });
            // dispatch({
            //   type: SHOW_SNACKBAR_ACTION,
            //   payload: {
            //     detail: "An error occurred. Please try again later.",
            //     severity: "error",
            //   },
            // });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: ADD_OOBMODULE_FAILURE, payload: error });
          // dispatch({
          //   type: SHOW_SNACKBAR_ACTION,
          //   payload: {
          //     detail: "An error occurred. Please try again later.",
          //     severity: "error",
          //   },
          // });
          stopLoading(dispatch);
        }
      );
  };
};

export const deleteOOBModule = (moduleId, moduleName, currentVersion) => {
  let API_URL = OOB_MODULE_API_URL + "/" + moduleId;
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
              type: DELETE_OOBMODULE_COMPLETE,
              //payload: moduleData.list,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleDeleteOOBModule(
                  currentVersion,
                  moduleName,
                  data.responseCode
                ).message,
                severity: handleDeleteOOBModule(
                  currentVersion,
                  moduleName,
                  data.responseCode
                ).messageType,
              },
            });
          }
          else if (data.responseCode === "2064") {
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: "This Module is LABELED",
                severity: "warning"
              },
            });
          }
          else if (data.responseCode === "2264") {
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: data.responseMessage,
                severity: "warning"
              },
            });
          }
          else {
            dispatch({ type: DELETE_OOBMODULE_FAILURE, payload: data });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleDeleteOOBModule(
                  currentVersion,
                  moduleName,
                  data.responseCode
                ).message,
                severity: handleDeleteOOBModule(
                  currentVersion,
                  moduleName,
                  data.responseCode
                ).messageType,
              },
            });
          }
          stopLoading(dispatch);
          dispatch({ type: HIDE_MESSAGE_DIALOG, payload: undefined });
        },
        (error) => {
          dispatch({ type: DELETE_OOBMODULE_FAILURE, payload: error });
          stopLoading(dispatch);
          dispatch({ type: HIDE_MESSAGE_DIALOG, payload: undefined });
          dispatch({
            type: SHOW_SNACKBAR_ACTION,
            payload: {
              detail: handleDeleteOOBModule(currentVersion, moduleName, "")
                .message,
              severity: handleDeleteOOBModule(currentVersion, moduleName, "")
                .messageType,
            },
          });
        }
      );
  };
};

export const termOobModule = (moduleId, moduleName) => {
  let API_URL = OOB_TERMMODULE_API_URL + "/" + moduleId;
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(API_URL, {
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
            dispatch({
              type: TERM_OOBMODULE_COMPLETE,
              //payload: moduleData.list,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: "Module " + moduleName + " successfully termed.",
                severity: "success",
              },
            });
          } else {
            dispatch({ type: TERM_OOBMODULE_FAILURE, payload: data });
            if (
              data &&
              data.responseMessage
              // &&
              // data.responseMessage.includes("Module") &&
              // data.responseMessage.includes("can not delete")
            ) {
              dispatch({
                type: SHOW_SNACKBAR_ACTION,
                payload: {
                  detail: OBBModuleTerm(moduleName, data).message,
                  severity: WARNIG,
                },
              });
            } else {
              dispatch({
                type: SHOW_SNACKBAR_ACTION,
                payload: {
                  detail: "An error occured. Please try again later.",
                  severity: "error",
                },
              });
            }
          }
          stopLoading(dispatch);
          dispatch({ type: HIDE_MESSAGE_DIALOG, payload: undefined });
        },
        (error) => {
          dispatch({ type: TERM_OOBMODULE_FAILURE, payload: error });
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

export const unTermOobModule = (moduleId, moduleName) => {
  let API_URL = OOB_UNTERMMODULE_API_URL + "/" + moduleId;
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(API_URL, {
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
            dispatch({
              type: UNTERM_OOBMODULE_COMPLETE,
              //payload: moduleData.list,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: "Module " + moduleName + " successfully untermed.",
                severity: "success",
              },
            });
          } else {
            dispatch({ type: UNTERM_OOBMODULE_FAILURE, payload: data });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: "An error occured. Please try again later.",
                severity: "error",
              },
            });
          }
          stopLoading(dispatch);
          dispatch({ type: HIDE_MESSAGE_DIALOG, payload: undefined });
        },
        (error) => {
          dispatch({ type: UNTERM_OOBMODULE_FAILURE, payload: error });
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

export const updateOOBModule = (moduleId, version, comment) => {
  let updateOOBModuleFormData = {
    moduleId: moduleId,
    oobModuleVerNum: version,
    oobModuleStatus: "LABEL",
  };
  if (comment) {
    updateOOBModuleFormData.comment = comment;
  }
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(OOB_MODULE_API_URL, {
      method: "put",
      body: JSON.stringify(updateOOBModuleFormData),
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
              type: UPDATE_OOBMODULE_COMPLETE,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleUpdateOOBModule(version, data.responseCode)
                  .message,
                severity: handleUpdateOOBModule(version, data.responseCode)
                  .messageType,
              },
            });
          } else {
            dispatch({ type: UPDATE_OOBMODULE_FAILURE, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: UPDATE_OOBMODULE_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchCompareVersion = (moduleId, version1, version2) => {
  let API_URL = `${OOB_MODULE_API_URL}/${moduleId}/compare/${version1}-${version2}`;
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(API_URL, {
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (data && data.responseCode === "200") {
            if (
              data.responseObject &&
              data.responseObject.oobModuleMasterVersion1 &&
              data.responseObject.oobModuleMasterVersion1.oobSubModules &&
              data.responseObject.oobModuleMasterVersion2 &&
              data.responseObject.oobModuleMasterVersion2.oobSubModules
            ) {
              data.responseObject.oobModuleMasterVersion1.oobSubModules = data.responseObject.oobModuleMasterVersion1.oobSubModules.map(
                (submodule) => {
                  if (submodule.metaTag) {
                    submodule.metaTag = JSON.parse(submodule.metaTag);
                  }
                  if (submodule.oobControls.length > 0) {
                    submodule.oobControls = submodule.oobControls.map(
                      (data) => {
                        if (data.control && data.control.format) {
                          data.control.format = JSON.parse(data.control.format);
                        }
                        return data;
                      }
                    );
                  }
                  return submodule;
                }
              );

              data.responseObject.oobModuleMasterVersion2.oobSubModules = data.responseObject.oobModuleMasterVersion2.oobSubModules.map(
                (submodule) => {
                  if (submodule.metaTag) {
                    submodule.metaTag = JSON.parse(submodule.metaTag);
                  }
                  if (submodule.oobControls.length > 0) {
                    submodule.oobControls = submodule.oobControls.map(
                      (data) => {
                        if (data.control && data.control.format) {
                          data.control.format = JSON.parse(data.control.format);
                        }
                        return data;
                      }
                    );
                  }
                  return submodule;
                }
              );
            }
            dispatch({
              type: FETCH_COMPARE_VERSION_COMPLETE,
              payload: data.responseObject,
            });
          } else {
            dispatch({ type: FETCH_COMPARE_VERSION_FAILURE, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_COMPARE_VERSION_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const resetModuleTermed = () => {
  return {
    type: RESET_MODULE_DELETED,
    payload: undefined,
  };
};
