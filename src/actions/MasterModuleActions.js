import {
  MASTERMODULE_API_URL,
  FETCH_MASTERMODULE_COMPLETE,
  FETCH_MASTERMODULE_FAILURE,
  FETCH_MASTERMODULEBYID_COMPLETE,
  FETCH_MASTERMODULEBYID_FAILURE,
  FETCH_ALLMASTERMODULE_COMPLETE,
  FETCH_ALLMASTERMODULE_FAILURE,
  ADD_MASTERMODULE_COMPLETE,
  ADD_MASTERMODULE_FAILURE,
  ADD_MASTERMODULE_ERROR,
  UPDATE_MASTERMODULE_COMPLETE,
  UPDATE_MASTERMODULE_ERROR,
  UPDATE_MASTERMODULE_FAILURE,
  DELETE_MASTERMODULE_COMPLETE,
  DELETE_MASTERMODULE_FAILURE,
  DELETE_MASTERMODULE_ERROR,
  SHOW_SNACKBAR_ACTION,
  START_SPINNER_ACTION,
  HIDE_MESSAGE_DIALOG,
  RESET_UPDATE_ERROR,
  RESET_DUPLICATE_ERROR,
} from "../utils/AppConstants";
import { setRequestHeader, stopLoading } from "../utils/helpers";
import { OBBModuleTerm, WARNIG } from "../utils/Messages";
//ERROR_MESSAGE, handleAddMasterModule, handleUpdateMasterModule,  handleDeleteMasterModule,
export const fetchMasterModule = (moduleFor, startIndex, pageSize, search) => {
  // let API_URL = MASTERMODULE_API_URL + "?startIndex=0&pageSize=10&sortBy=createdDate";
  let API_URL = MASTERMODULE_API_URL + "?";
  if (moduleFor && moduleFor === "global") {
    API_URL = API_URL + "&isglobal=true&sortBy=id";
  } else if (moduleFor && moduleFor === "oob") {
    API_URL = API_URL + "&isglobal=false&sortBy=id";
  } else API_URL = API_URL + "&isglobal=all";

  if (pageSize)
    API_URL =
      API_URL +
      "&startIndex=" +
      startIndex +
      "&pageSize=" +
      pageSize +
      "&sortBy=id";
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
            // data.responseObject.modules.sort((a, b) =>
            //   a.createdDate < b.createdDate ? 1 : -1
            // );
            dispatch({
              type: FETCH_MASTERMODULE_COMPLETE,
              payload: {
                list: data.responseObject.modules,
                totalElements: data.responseObject.totalElements,
                totalPages: data.responseObject.totalPages,
                startIndex: startIndex,
                pageSize: pageSize,
              },
            });
          } else {
            dispatch({ type: FETCH_MASTERMODULE_FAILURE, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_MASTERMODULE_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchAllMasterModule = () => {
  let API_URL = MASTERMODULE_API_URL;

  //API_URL = API_URL + "&startIndex=" + 0 + "&pageSize=" + 100 +"&sortBy=id";

  return (dispatch) => {
    //dispatch({ type: START_SPINNER_ACTION });
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
            // data.responseObject.modules.sort((a, b) =>
            //   a.createdDate < b.createdDate ? 1 : -1
            // );
            dispatch({
              type: FETCH_ALLMASTERMODULE_COMPLETE,
              payload: {
                allList: data.responseObject.modules,
                // totalElements: data.responseObject.totalElements,
                // totalPages: data.responseObject.totalPages,
                // startIndex: startIndex,
                // pageSize: pageSize,
              },
            });
          } else {
            dispatch({ type: FETCH_ALLMASTERMODULE_FAILURE, payload: data });
          }
          //stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_ALLMASTERMODULE_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchModuleById = (id) => {
  let API_URL = MASTERMODULE_API_URL + "/" + id;
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
            // data.responseObject.modules.sort((a, b) =>
            //   a.created_date < b.created_date ? 1 : -1
            // );
            dispatch({
              type: FETCH_MASTERMODULEBYID_COMPLETE,
              payload: data.responseObject.modules,
            });
          } else if (
            data.responseCode === "2035" ||
            data.responseCode === 2035
          ) {
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail:
                  "This Module associated with OOB Module, can not delete.",
                severity: "warning",
              },
            });
          } else {
            dispatch({ type: FETCH_MASTERMODULEBYID_FAILURE, payload: data });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: "An error occurred. Please try again later.",
                severity: "error",
              },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_MASTERMODULEBYID_FAILURE, payload: error });
          dispatch({
            type: SHOW_SNACKBAR_ACTION,
            payload: {
              detail: "An error occurred. Please try again later.",
              severity: "error",
            },
          });
          stopLoading(dispatch);
        }
      );
  };
};

export const addMasterModule = (formData) => {
  let addModuleFormData = {
    moduleName: formData.moduleName.trim(),
    shortName: formData.shortName.trim(),
    description: formData.description,
    isGlobal: formData.isGlobal,
    // category: formData.category,
  };
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(MASTERMODULE_API_URL, {
      method: "post",
      body: JSON.stringify(addModuleFormData),
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
              type: ADD_MASTERMODULE_COMPLETE,
              //payload: data.responseObject,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail:
                  "Module " +
                  addModuleFormData.moduleName +
                  " successfully added.",
                severity: "success",
              },
            });
          } else {
            dispatch({ type: ADD_MASTERMODULE_ERROR, payload: data });
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
          dispatch({ type: ADD_MASTERMODULE_FAILURE, payload: error });
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

export const updateMasterModule = (moduleId, formData) => {
  let updateModuleFormData = {
    id: moduleId,
    moduleName: formData.moduleName.trim(),
    shortName: formData.shortName.trim(),
    description: formData.description,
    isGlobal: formData.isGlobal,
    // category: formData.category,
    //status: formData.status === "ACTIVE" ? 0 : 1,
  };

  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(MASTERMODULE_API_URL, {
      method: "put",
      body: JSON.stringify(updateModuleFormData),
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
              type: UPDATE_MASTERMODULE_COMPLETE,
              //payload: moduleDetails.list,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail:
                  "Module " +
                  updateModuleFormData.moduleName +
                  " successfully updated.",
                severity: "success",
              },
            });
          } else {
            dispatch({ type: UPDATE_MASTERMODULE_ERROR, payload: data });
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
          dispatch({ type: UPDATE_MASTERMODULE_FAILURE, payload: error });
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

export const deleteMasterModule = (moduleId, moduleName) => {
  let API_URL = MASTERMODULE_API_URL + "/" + moduleId;
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
              type: DELETE_MASTERMODULE_COMPLETE,
              //payload: moduleData.list,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: "Module " + moduleName + " successfully deleted.",
                severity: "success",
              },
            });
          } else if (
            data.responseCode === "2035" ||
            data.responseCode === 2035
          ) {
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail:
                  "This Module associated with OOB Module, can not delete.",
                severity: "warning",
              },
            });
          } else {
            dispatch({ type: DELETE_MASTERMODULE_ERROR, payload: data });
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
                  detail: OBBModuleTerm(moduleName),
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
          dispatch({ type: DELETE_MASTERMODULE_FAILURE, payload: error });
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

export const resetDuplicateError = () => {
  return {
    type: RESET_DUPLICATE_ERROR,
    payload: undefined,
  };
};

export const resetUpdateError = () => {
  return {
    type: RESET_UPDATE_ERROR,
    payload: undefined,
  };
};
