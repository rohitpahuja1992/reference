//import { API_INSTANCE, API_MHK_COGNITO_LOGIN, API_MHK_COGNITO_LOGIN_PAYLOAD } from "../BackendAPI";
import {
  CHANGE_PASSWORD_COMPLETE,
  CHANGE_PASSWORD_ERROR,
  CHANGE_PASSWORD_FAILURE,
  CHANGE_PASSWORD_API_URL,
  START_SPINNER_ACTION,
} from "../utils/AppConstants";
import {
  setRequestHeader,
  stopLoading,
  getLocalStorageData,
} from "../utils/helpers";
import {
  DEFAULT_ERROR_MSG
} from "../utils/Messages"

export const changeUserPassword = (formObj) => {
  let formData = {
    username: formObj.username,
    oldPassword: formObj.currentPassword,
    password: formObj.newPassword,
  };
  if (formObj.openFor === "firstLogin") {
    formData.firstTimeLogin = true;
  } else {
    let loggedInInfo = getLocalStorageData();
    formData.firstTimeLogin = false;
    formData.accessToken = loggedInInfo.access_token;
  }
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(CHANGE_PASSWORD_API_URL, {
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
            dispatch({ type: CHANGE_PASSWORD_COMPLETE, payload: data });
          } else {
            dispatch({
              type: CHANGE_PASSWORD_ERROR,
              payload: data ? data : { message: DEFAULT_ERROR_MSG },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: CHANGE_PASSWORD_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};
