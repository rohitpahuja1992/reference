import {
  MASTERTABLE_API_URL,
  COLUMN_LIST_API_URL,
  CHILD_TABLE_LIST_API_URL,
  FETCH_ALL_MASTERTABLE_COMPLETE,
  FETCH_ALL_MASTERTABLE_FAILURE,
  FETCH_MASTERTABLE_COMPLETE,
  FETCH_MASTERTABLE_FAILURE,
  FETCH_COLUMN_LIST_COMPLETE,
  FETCH_COLUMN_LIST_FAILURE,
  ADD_MASTERTABLE_COMPLETE,
  ADD_MASTERMODULE_FAILURE,
  UPDATE_MASTERTABLE_COMPLETE,
  UPDATE_MASTERTABLE_FAILURE,
  FETCH_MASTERTABLEBYID_COMPLETE,
  FETCH_MASTERTABLEBYID_FAILURE,
  FETCH_CHILD_TABLE_COMPLETE,
  FETCH_CHILD_TABLE_FAILURE,
  DELETE_MASTERTABLE_COMPLETE,
  DELETE_MASTERTABLE_ERROR,
  DELETE_MASTERTABLE_FAILURE,
  MASTERTABLEBYMODULE_API_URL,
  FETCH_MASTERTABLEBYMODULE_COMPLETE,
  FETCH_MASTERTABLEBYMODULE_FAILURE,
  START_SPINNER_ACTION,
  SHOW_SNACKBAR_ACTION,
  HIDE_MESSAGE_DIALOG,
} from "../utils/AppConstants";
import {
  ERROR_MESSAGE,
  handleUpdateMasterTable,
  handleMasterTableTerm,
} from "../utils/Messages";
import { setRequestHeader, stopLoading } from "../utils/helpers";

export const fetchMasterTable = (startIndex, pageSize, search) => {
  let API_URL = MASTERTABLE_API_URL + "?sortBy=tableName";
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
              type: FETCH_MASTERTABLE_COMPLETE,
              payload: {
                list: data.responseObject.configTable,
                totalElements: data.responseObject.totalElements,
                totalPages: data.responseObject.totalPages,
                startIndex: startIndex,
                pageSize: pageSize,
              },
            });
          } else {
            dispatch({ type: FETCH_MASTERTABLE_FAILURE, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_MASTERTABLE_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchAllMasterTable = () => {
  let API_URL = MASTERTABLE_API_URL;
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
              type: FETCH_ALL_MASTERTABLE_COMPLETE,
              payload: {
                allList: data.responseObject.configTable
              },
            });
          } else {
            dispatch({ type: FETCH_ALL_MASTERTABLE_FAILURE, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_ALL_MASTERTABLE_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchColumnList = (tableName) => {
  let API_URL = COLUMN_LIST_API_URL + tableName;
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
              type: FETCH_COLUMN_LIST_COMPLETE,
              payload: data.responseObject.fieldMappings,
            });
          } else {
            dispatch({ type: FETCH_COLUMN_LIST_FAILURE, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_COLUMN_LIST_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const addMasterTable = (formData) => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(MASTERTABLE_API_URL, {
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
              type: ADD_MASTERTABLE_COMPLETE,
              //payload: data.responseObject,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail:
                  "Module " +
                  formData.mapObject.tableName +
                  " successfully added.",
                severity: "success",
              },
            });
          } else {
            dispatch({ type: ADD_MASTERMODULE_FAILURE, payload: data });
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
  // return (dispatch) => {
  //   dispatch({ type: ADD_MASTERTABLE_COMPLETE, payload: formData });
  // };
};

export const fetchTableById = (id) => {
  let API_URL = MASTERTABLE_API_URL + "/" + id;
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
              type: FETCH_MASTERTABLEBYID_COMPLETE,
              payload: data.responseObject,
            });
          } else {
            dispatch({
              type: FETCH_MASTERTABLEBYID_FAILURE,
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
          dispatch({ type: FETCH_MASTERTABLEBYID_FAILURE, payload: error });
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

export const updateMasterTable = (formData) => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(MASTERTABLE_API_URL, {
      method: "put",
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
              type: UPDATE_MASTERTABLE_COMPLETE,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleUpdateMasterTable(
                  formData.tableName,
                  data.responseCode
                ).message,
                severity: handleUpdateMasterTable(
                  formData.tableName,
                  data.responseCode
                ).messageType,
              },
            });
          } else {
            dispatch({ type: UPDATE_MASTERTABLE_FAILURE, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: UPDATE_MASTERTABLE_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const deleteMasterTable = (tableId, tableName) => {
  let API_URL = MASTERTABLE_API_URL + "/" + tableId;
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(API_URL, {
      method: "delete",
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (data && data.responseCode === "200") {
            dispatch({
              type: DELETE_MASTERTABLE_COMPLETE,
              //payload: moduleData.list,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleMasterTableTerm(tableName, data.responseCode)
                  .message,
                severity: handleMasterTableTerm(tableName, data.responseCode)
                  .messageType,
              },
            });
          } else {
            dispatch({ type: DELETE_MASTERTABLE_ERROR, payload: data });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleMasterTableTerm(tableName, data.responseCode)
                  .message,
                severity: handleMasterTableTerm(tableName, data.responseCode)
                  .messageType,
              },
            });
          }
          stopLoading(dispatch);
          dispatch({ type: HIDE_MESSAGE_DIALOG, payload: undefined });
        },
        (error) => {
          dispatch({ type: DELETE_MASTERTABLE_FAILURE, payload: error });
          stopLoading(dispatch);
          dispatch({ type: HIDE_MESSAGE_DIALOG, payload: undefined });
          dispatch({
            type: SHOW_SNACKBAR_ACTION,
            payload: {
              detail: handleMasterTableTerm(tableName, "", error).message,
              severity: handleMasterTableTerm(tableName, "", error).messageType,
            },
          });
        }
      );
  };
};

export const fetchChildTable = (id) => {
  let API_URL = CHILD_TABLE_LIST_API_URL + "/" + id;
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
              type: FETCH_CHILD_TABLE_COMPLETE,
              payload: data.responseObject,
            });
          } else {
            dispatch({ type: FETCH_CHILD_TABLE_FAILURE, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_CHILD_TABLE_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchMasterTableByModule = (id) => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(MASTERTABLEBYMODULE_API_URL, {
      method: "post",
      body: JSON.stringify([id]),
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
              type: FETCH_MASTERTABLEBYMODULE_COMPLETE,
              payload: data.responseObject,
            });
          } else {
            dispatch({
              type: FETCH_MASTERTABLEBYMODULE_FAILURE,
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
            type: FETCH_MASTERTABLEBYMODULE_FAILURE,
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
