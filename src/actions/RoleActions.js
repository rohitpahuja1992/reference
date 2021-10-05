import {
  FETCH_ROLES_API_URL,
  FETCH_ROLES_COMPLETE,
  FETCH_ROLES_FAILURE,
  FETCH_ROLES_ERROR,
  FETCH_ROLE_PROFILE_API_URL,
  FETCH_ROLE_PROFILE_COMPLETE,
  FETCH_ROLE_PROFILE_ERROR,
  FETCH_ROLE_PROFILE_FAILURE,
  UPDATE_ROLE_API_URL,
  UPDATE_ROLE_COMPLETE,
  UPDATE_ROLE_ERROR,
  UPDATE_ROLE_FAILURE,
  START_SPINNER_ACTION,
  SHOW_SNACKBAR_ACTION,
} from "../utils/AppConstants";
import { setRequestHeader, stopLoading } from "../utils/helpers";
import { DEFAULT_ERROR_MSG, ROLE_UPDATED } from "../utils/Messages";

export const fetchRoles = () => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(FETCH_ROLES_API_URL, {
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (data && data.responseCode === "200") {
            dispatch({ type: FETCH_ROLES_COMPLETE, payload: data });
          } else {
            dispatch({
              type: FETCH_ROLES_ERROR,
              payload: data ? data : { message: DEFAULT_ERROR_MSG },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_ROLES_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchRoleProfile = (roleId) => {
  let ApiUrl = `${FETCH_ROLE_PROFILE_API_URL}/${roleId}`;
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(ApiUrl, {
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            dispatch({ type: FETCH_ROLE_PROFILE_COMPLETE, payload: data });
          } else {
            dispatch({
              type: FETCH_ROLE_PROFILE_ERROR,
              payload: data ? data : { message: DEFAULT_ERROR_MSG },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_ROLE_PROFILE_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const updateRole = (formData) => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(UPDATE_ROLE_API_URL, {
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
            dispatch({ type: UPDATE_ROLE_COMPLETE, payload: data });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: ROLE_UPDATED,
              },
            });
          } else {
            dispatch({
              type: UPDATE_ROLE_ERROR,
              payload: data ? data : { message: DEFAULT_ERROR_MSG },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: UPDATE_ROLE_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};
