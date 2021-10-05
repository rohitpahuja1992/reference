import {
  MASTERSUBMODULE_API_URL,
  FETCH_MASTERSUBMODULE_COMPLETE,
  FETCH_MASTERSUBMODULE_FAILURE,
  FETCH_MASTERSUBMODULEBYID_COMPLETE,
  FETCH_MASTERSUBMODULEBYID_FAILURE,
  ADD_MASTERSUBMODULE_COMPLETE,
  ADD_MASTERSUBMODULE_FAILURE,
  ADD_MASTERSUBMODULE_ERROR,
  UPDATE_MASTERSUBMODULE_COMPLETE,
  UPDATE_MASTERSUBMODULE_ERROR,
  UPDATE_MASTERSUBMODULE_FAILURE,
  DELETE_MASTERSUBMODULE_COMPLETE,
  DELETE_MASTERSUBMODULE_FAILURE,
  DELETE_MASTERSUBMODULE_ERROR,
  MASTERCOMPONENTBYMODULE_API_URL,
  FETCH_MASTERCOMPONENTBYMODULE_COMPLETE,
  FETCH_MASTERCOMPONENTBYMODULE_FAILURE,
  SHOW_SNACKBAR_ACTION,
  START_SPINNER_ACTION,
  HIDE_MESSAGE_DIALOG,
  RESET_UPDATE_ERROR,
  RESET_DUPLICATE_ERROR,
} from "../utils/AppConstants";
import { setRequestHeader, stopLoading } from "../utils/helpers";
import {handleMasterSubmoduleTerm, ERROR_MESSAGE, handleUpdateMasterSubmodule, handleAddMasterSubmodule} from "../utils/Messages";

export const fetchMasterSubmodule = (startIndex, pageSize, search) => {
  let API_URL = MASTERSUBMODULE_API_URL + "?sortBy=createdDate";
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
            // data.responseObject.subModules.sort((a, b) =>
            //   a.id < b.id ? 1 : -1
            // );
            dispatch({
              type: FETCH_MASTERSUBMODULE_COMPLETE,
              payload: {
                //controls: controls,
                pageInfo: data.responseObject,
                startIndex: startIndex,
                pageSize: pageSize,
              },
              //payload: data.responseObject.subModules,
            });
          } else {
            dispatch({ type: FETCH_MASTERSUBMODULE_FAILURE, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_MASTERSUBMODULE_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchSubmoduleById = (id) => {
  let API_URL = MASTERSUBMODULE_API_URL + "/" + id;
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
              type: FETCH_MASTERSUBMODULEBYID_COMPLETE,
              payload: data.responseObject,
            });
          } else {
            dispatch({
              type: FETCH_MASTERSUBMODULEBYID_FAILURE,
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
          dispatch({ type: FETCH_MASTERSUBMODULEBYID_FAILURE, payload: error });
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

export const addMasterSubmodule = (formData) => {
  let addSubmoduleFormData = {
    componentName: formData.componentName.trim(),
    mapField: JSON.stringify(formData.column),
    moduleIds: formData.moduleIds,
    config:formData.config,
    //isGlobal: formData.isGlobal,
  };
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(MASTERSUBMODULE_API_URL, {
      method: "post",
      body: JSON.stringify(addSubmoduleFormData),
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
              type: ADD_MASTERSUBMODULE_COMPLETE,
              //payload: data.responseObject,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleAddMasterSubmodule(addSubmoduleFormData.componentName, data.responseCode).message,
                severity: handleAddMasterSubmodule(addSubmoduleFormData.componentName, data.responseCode).messageType,
              },
            });
          } else {
            dispatch({ type: ADD_MASTERSUBMODULE_ERROR, payload: data });
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
          dispatch({ type: ADD_MASTERSUBMODULE_FAILURE, payload: error });
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

export const updateMasterSubmodule = (submoduleId, formData) => {
  let updateSubmoduleFormData = {
    id: submoduleId,
    componentName: formData.componentName.trim(),
    config: formData.config,
    mapField: JSON.stringify(formData.column),
    moduleIds: formData.moduleIds,
  };

  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(MASTERSUBMODULE_API_URL, {
      method: "put",
      body: JSON.stringify(updateSubmoduleFormData),
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
              type: UPDATE_MASTERSUBMODULE_COMPLETE,
              //payload: moduleDetails.list,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleUpdateMasterSubmodule(updateSubmoduleFormData.componentName, data.responseCode).message,
                severity: handleUpdateMasterSubmodule(updateSubmoduleFormData.componentName, data.responseCode).messageType,
              },
            });
          } else {
            dispatch({ type: UPDATE_MASTERSUBMODULE_ERROR, payload: data });
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
          dispatch({ type: UPDATE_MASTERSUBMODULE_FAILURE, payload: error });
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

export const deleteMasterSubmodule = (moduleId, submoduleName) => {
  let API_URL = MASTERSUBMODULE_API_URL + "?id=" + moduleId;
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
            (data.responseCode === "200")
          ) {
            dispatch({
              type: DELETE_MASTERSUBMODULE_COMPLETE,
              //payload: moduleData.list,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleMasterSubmoduleTerm(submoduleName,data.responseCode).message,
                severity: handleMasterSubmoduleTerm(submoduleName,data.responseCode).messageType,
              },
            });
          } 
          
          else {
            dispatch({ type: DELETE_MASTERSUBMODULE_ERROR, payload: data });
              dispatch({
                type: SHOW_SNACKBAR_ACTION,
                payload: {
                  detail: handleMasterSubmoduleTerm(submoduleName,data.responseCode).message,
                  severity: handleMasterSubmoduleTerm(submoduleName,data.responseCode).messageType
                },
              });
            // } else {
            //   dispatch({
            //     type: SHOW_SNACKBAR_ACTION,
            //     payload: {
            //       detail: "An error occured. Please try again later.",
            //       severity: "error",
            //     },
            //   });
            // }
          }
          stopLoading(dispatch);
          dispatch({ type: HIDE_MESSAGE_DIALOG, payload: undefined });
        },
        (error) => {
          dispatch({ type: DELETE_MASTERSUBMODULE_FAILURE, payload: error });
          stopLoading(dispatch);
          dispatch({ type: HIDE_MESSAGE_DIALOG, payload: undefined });
          dispatch({
            type: SHOW_SNACKBAR_ACTION,
            payload: {
              detail: handleMasterSubmoduleTerm(submoduleName,"",error).message,
              severity: handleMasterSubmoduleTerm(submoduleName,"",error).messageType
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

export const fetchMasterComponentByModule = (id) => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(MASTERCOMPONENTBYMODULE_API_URL, {
      method: "post",
      body:JSON.stringify([id]),
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
              type: FETCH_MASTERCOMPONENTBYMODULE_COMPLETE,
              payload: data.responseObject,
            });
          } else {
            dispatch({
              type: FETCH_MASTERCOMPONENTBYMODULE_FAILURE,
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
            type: FETCH_MASTERCOMPONENTBYMODULE_FAILURE,
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

