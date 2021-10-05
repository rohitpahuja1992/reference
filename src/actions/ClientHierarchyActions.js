import {
  FETCH_HIERARCHY_COMPANY_API_URL,
  FETCH_HIERARCHY_BUSINESSLINE_API_URL,
  FETCH_HIERARCHY_ELIGIBILITYPLAN_API_URL,
  FETCH_HIERARCHY_ELIGIBILITYGROUP_API_URL,
  DELETE_HIERARCHYBYID_API_URL,
  UPLOAD_HIERARCHYBYID_API_URL,
  FETCH_COMPANY_LIST_SUCCESS,
  FETCH_COMPANY_LIST_FAILURE,
  FETCH_BUSINESS_LINE_SUCCESS,
  FETCH_BUSINESS_LINE_FAILURE,
  FETCH_ELIGIBILITY_PLAN_SUCCESS,
  FETCH_ELIGIBILITY_PLAN_FAILURE,
  FETCH_ELIGIBILITY_GROUP_SUCCESS,
  FETCH_ELIGIBILITY_GROUP_FAILURE,
  DELETE_HIERARCHYBYID_COMPLETE,
  DELETE_HIERARCHYBYID_ERROR,
  DELETE_HIERARCHYBYID_FAILURE,
  UPLOAD_HIERARCHYBYID_COMPLETE,
  UPLOAD_HIERARCHYBYID_ERROR,
  UPLOAD_HIERARCHYBYID_FAILURE,
  START_SPINNER_ACTION,
  SHOW_SNACKBAR_ACTION,
} from "../utils/AppConstants";
import { setRequestHeader, stopLoading } from "../utils/helpers";
import { handleHierarchyTerm, handleHierarchyUpdaload } from "../utils/Messages";

export const fetchCompanyList = (clientId) => {
  let API_URL = FETCH_HIERARCHY_COMPANY_API_URL + clientId;
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
              type: FETCH_COMPANY_LIST_SUCCESS,
              payload: data.responseObject,
            });
          } else {
            dispatch({ type: FETCH_COMPANY_LIST_FAILURE, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_COMPANY_LIST_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchBusinessLineList = (clientId) => {
  let API_URL = FETCH_HIERARCHY_BUSINESSLINE_API_URL + clientId;
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
              type: FETCH_BUSINESS_LINE_SUCCESS,
              payload: data.responseObject,
            });
          } else {
            dispatch({ type: FETCH_BUSINESS_LINE_FAILURE, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_BUSINESS_LINE_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchEligibilityPlanList = (clientId) => {
  let API_URL = FETCH_HIERARCHY_ELIGIBILITYPLAN_API_URL + clientId;
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
              type: FETCH_ELIGIBILITY_PLAN_SUCCESS,
              payload: data.responseObject,
            });
          } else {
            dispatch({ type: FETCH_ELIGIBILITY_PLAN_FAILURE, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_ELIGIBILITY_PLAN_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchEligibilityGroupList = (clientId) => {
  let API_URL = FETCH_HIERARCHY_ELIGIBILITYGROUP_API_URL + clientId;
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
              type: FETCH_ELIGIBILITY_GROUP_SUCCESS,
              payload: data.responseObject,
            });
          } else {
            dispatch({ type: FETCH_ELIGIBILITY_GROUP_FAILURE, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_ELIGIBILITY_GROUP_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const deleteHierarchy = (clientId) => {
  let Delete_Hierarchy_Api = DELETE_HIERARCHYBYID_API_URL + clientId;
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(Delete_Hierarchy_Api, {
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
            dispatch({ type: DELETE_HIERARCHYBYID_COMPLETE });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleHierarchyTerm(data.responseCode).message,
                severity: handleHierarchyTerm(data.responseCode).messageType,
              },
            });
          } else {
            dispatch({
              type: DELETE_HIERARCHYBYID_ERROR,
              payload: data,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleHierarchyTerm(data.responseCode).message,
                severity: handleHierarchyTerm(data.responseCode).messageType,
              },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: DELETE_HIERARCHYBYID_FAILURE, payload: error });
          dispatch({
            type: SHOW_SNACKBAR_ACTION,
            payload: {
              detail: handleHierarchyTerm("").message,
              severity: handleHierarchyTerm("").messageType,
            },
          });
          stopLoading(dispatch);
        }
      );
  };
};

export const uploadHierarchy = (fileData, clientId) => {
  // let uploadHierarchyFormData = {
  //   id: clientId,
  // };

  const formDatas = new FormData();
  formDatas.append("file", fileData);
  formDatas.append("clientId", clientId);

  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(UPLOAD_HIERARCHYBYID_API_URL, {
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
            dispatch({ type: UPLOAD_HIERARCHYBYID_COMPLETE });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleHierarchyUpdaload(data.responseCode).message,
                severity: handleHierarchyUpdaload(data.responseCode).messageType,
              },
            });
          } else {
            dispatch({
              type: UPLOAD_HIERARCHYBYID_ERROR,
              payload: data,
            });

            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: data.responseMessage || "An error occurred. Please try again later.",
                severity: "warning",
              },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: UPLOAD_HIERARCHYBYID_FAILURE, payload: error });
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
