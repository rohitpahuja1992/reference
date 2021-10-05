import {
    MASTERSECTION_API_URL,
    FETCH_MASTERSECTION_COMPLETE,
    FETCH_MASTERSECTION_FAILURE,
    FETCH_MASTERSECTIONBYID_COMPLETE,
    FETCH_MASTERSECTIONBYID_FAILURE,
    ADD_MASTERSECTION_COMPLETE,
    ADD_MASTERSECTION_FAILURE,
    ADD_MASTERSECTION_ERROR,
    UPDATE_MASTERSECTION_COMPLETE,
    UPDATE_MASTERSECTION_ERROR,
    UPDATE_MASTERSECTION_FAILURE,
    DELETE_MASTERSECTION_COMPLETE,
    DELETE_MASTERSECTION_FAILURE,
    DELETE_MASTERSECTION_ERROR,
    SHOW_SNACKBAR_ACTION,
    START_SPINNER_ACTION,
    HIDE_MESSAGE_DIALOG,
    RESET_UPDATE_ERROR,
    RESET_DUPLICATE_ERROR,
  } from "../utils/AppConstants";
  import { setRequestHeader, stopLoading } from "../utils/helpers";
  
  export const fetchMasterSection = () => {
    //let API_URL = MASTERSECTION_API_URL + "?isglobal=true";
    return (dispatch) => {
      dispatch({ type: START_SPINNER_ACTION });
      return fetch(MASTERSECTION_API_URL, {
        headers: setRequestHeader(),
      })
        .then((response) => response.json())
        .then(
          (data) => {
            if (
              data &&
              (data.responseCode === "200" || data.responseCode === 200)
            ) {
              data.responseObject.sections.sort((a, b) =>
                a.createdDate < b.createdDate ? 1 : -1
              );
              dispatch({
                type: FETCH_MASTERSECTION_COMPLETE,
                payload: data.responseObject.sections,
              });
            } else {
              dispatch({ type: FETCH_MASTERSECTION_FAILURE, payload: data });
            }
            stopLoading(dispatch);
          },
          (error) => {
            dispatch({ type: FETCH_MASTERSECTION_FAILURE, payload: error });
            stopLoading(dispatch);
          }
        );
    };
  };
  
  export const fetchSectionById = (id) => {
    let API_URL = MASTERSECTION_API_URL + "/" + id;
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
                type: FETCH_MASTERSECTIONBYID_COMPLETE,
                payload: data.responseObject.sections,
              });
            } else {
              dispatch({ type: FETCH_MASTERSECTIONBYID_FAILURE, payload: data });
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
            dispatch({ type: FETCH_MASTERSECTIONBYID_FAILURE, payload: error });
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
  
  export const addMasterSection = (formData) => {
    let addSectionFormData = {
      name: formData.sectionName.trim(),
      description: formData.description,
    };
    return (dispatch) => {
      dispatch({ type: START_SPINNER_ACTION });
      return fetch(MASTERSECTION_API_URL, {
        method: "post",
        body: JSON.stringify(addSectionFormData),
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
                type: ADD_MASTERSECTION_COMPLETE,
                //payload: data.responseObject,
              });
              dispatch({
                type: SHOW_SNACKBAR_ACTION,
                payload: {
                  detail:
                    "Section " +
                    addSectionFormData.name +
                    " successfully added.",
                  severity: "success",
                },
              });
            } else {
              dispatch({ type: ADD_MASTERSECTION_ERROR, payload: data });
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
            dispatch({ type: ADD_MASTERSECTION_FAILURE, payload: error });
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
  
  export const updateMasterSection = (sectionId, formData) => {
    let updateSectionFormData = {
      id: sectionId,
      name: formData.sectionName.trim(),
      description: formData.description,
      
    };
  
    return (dispatch) => {
      dispatch({ type: START_SPINNER_ACTION });
      return fetch(MASTERSECTION_API_URL, {
        method: "put",
        body: JSON.stringify(updateSectionFormData),
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
                type: UPDATE_MASTERSECTION_COMPLETE,
                //payload: moduleDetails.list,
              });
              dispatch({
                type: SHOW_SNACKBAR_ACTION,
                payload: {
                  detail:
                    "Section " +
                    updateSectionFormData.name +
                    " successfully updated.",
                  severity: "success",
                },
              });
            } else {
              dispatch({ type: UPDATE_MASTERSECTION_ERROR, payload: data });
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
            dispatch({ type: UPDATE_MASTERSECTION_FAILURE, payload: error });
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
  
  export const deleteMasterSection = (sectionId, sectionName) => {
    let API_URL = MASTERSECTION_API_URL + "/" + sectionId;
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
                type: DELETE_MASTERSECTION_COMPLETE,
                //payload: moduleData.list,
              });
              dispatch({
                type: SHOW_SNACKBAR_ACTION,
                payload: {
                  detail: "Section " + sectionName + " successfully termed.",
                  severity: "success",
                },
              });
            } else {
              dispatch({ type: DELETE_MASTERSECTION_ERROR, payload: data });
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
            dispatch({ type: DELETE_MASTERSECTION_FAILURE, payload: error });
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
  