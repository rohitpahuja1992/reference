
import {
  FETCH_USERS_API_URL,
  FETCH_USERS_COMPLETE,
  FETCH_USERS_FAILURE,
  ADD_USER_API_URL,
  ADD_USER_COMPLETE,
  ADD_USER_ERROR,
  ADD_USER_FAILURE,
  FETCH_USERS_ERROR,
  FETCH_USER_PROFILE_API_URL,
  FETCH_USER_PROFILE_COMPLETE,
  FETCH_USER_PROFILE_ERROR,
  FETCH_USER_PROFILE_FAILURE,
  FETCH_LOGGED_IN_USER_INFO_COMPLETE,
  FETCH_LOGGED_IN_USER_INFO_ERROR,
  FETCH_LOGGED_IN_USER_INFO_FAILURE,
  UPDATE_USER_API_URL,
  UPDATE_USER_PROFILE_COMPLETE,
  UPDATE_USER_PROFILE_ERROR,
  UPDATE_USER_PROFILE_FAILURE,
  START_SPINNER_ACTION,
  SHOW_SNACKBAR_ACTION,
  FETCH_USER_PROFILEBYID_API_URL,
} from "../utils/AppConstants";
import {
  setRequestHeader,
  getUserProfileInfo,
  stopLoading,
} from "../utils/helpers";
import { DEFAULT_ERROR_MSG, PRO_SUCCESS_UPDATED, USER_ADDED } from "../utils/Messages";

export const fetchUsers = (startIndex, pageSize, search, filter, sorting) => {
  let API_URL = FETCH_USERS_API_URL;
  if (pageSize)
    API_URL = API_URL + "?&startIndex=" + startIndex + "&pageSize=" + pageSize;
  if (search) API_URL = API_URL + "&search=" + search.trim();
  if (filter) API_URL = API_URL + "&filterby=" + filter;
  if (sorting) API_URL = API_URL + "?&sortBy=" + sorting;
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
            data.responseObject.users &&
              data.responseObject.users.sort((a, b) =>
                a.last_login_time > b.last_login_time ? -1 : 1
              );
            dispatch({
              type: FETCH_USERS_COMPLETE,
              //payload: data
              payload: {
                usersInfo: data,
                startIndex: startIndex,
                pageSize: pageSize,
              },
            });
          } else {
            dispatch({
              type: FETCH_USERS_ERROR,
              payload: data ? data : { message: DEFAULT_ERROR_MSG },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_USERS_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const addUser = (formData) => {
  let addUserFormData = {
    firstname: formData.firstName,
    lastname: formData.lastName,
    email: formData.email,
    mobileNumber: formData.contactNumber,
    groupName: formData.userType,
    clients: formData.clients,
    roles: formData.roles,
  };
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(ADD_USER_API_URL, {
      method: "post",
      body: JSON.stringify(addUserFormData),
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "201" || data.responseCode === '200')
          ) {
            dispatch({ type: ADD_USER_COMPLETE, payload: data });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: USER_ADDED,
              },
            });
          } else {
            dispatch({
              type: ADD_USER_ERROR,
              payload: data ? data : { message: DEFAULT_ERROR_MSG },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: ADD_USER_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchUserProfile = (emailId) => {
  let ApiUrl = `${FETCH_USER_PROFILEBYID_API_URL}/${emailId}`;
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
            dispatch({ type: FETCH_USER_PROFILE_COMPLETE, payload: data });
          } else {
            dispatch({
              type: FETCH_USER_PROFILE_ERROR,
              payload: data ? data : { message: DEFAULT_ERROR_MSG },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_USER_PROFILE_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchLoggedInUserInfo = () => {
  let userInfo = getUserProfileInfo();
  //let emailId = userInfo.email ? userInfo.email : userInfo.username;  //For UAT...
  let emailId = userInfo.username ? userInfo.username : userInfo.unique_name;  // local VDI
  let ApiUrl = `${FETCH_USER_PROFILE_API_URL}/${emailId}`;
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
            let temp = [];
            data.responseObject.roles &&
              data.responseObject.roles.map(
                (item, key) =>
                  item.features &&
                  item.features.map((internalName, internalKey) =>
                    temp.push(internalName.featureInternalName)
                  )
              );
            dispatch({
              type: FETCH_LOGGED_IN_USER_INFO_COMPLETE,
              payload: { Info: data, features: temp },
            });
          } else {
            dispatch({
              type: FETCH_LOGGED_IN_USER_INFO_ERROR,
              payload: data ? data : { message: DEFAULT_ERROR_MSG },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_LOGGED_IN_USER_INFO_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const updateUser = (formData) => {
  let updateUserData = {
    id: formData.id,
    firstname: formData.firstName,
    lastname: formData.lastName,
    email: formData.email,
    mobileNumber: formData.contactNumber,
    groupName: formData.userType,
    clients: formData.clients,
    roles: formData.roles,
    status: formData.status,
    emailNotificationOn: formData.emailNotificationOn
  };
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(UPDATE_USER_API_URL, {
      method: "post",
      body: JSON.stringify(updateUserData),
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (!data.hasOwnProperty("error") ||
              data.responseCode === "200" ||
              data.responseCode === 200)
          ) {
            dispatch({ type: UPDATE_USER_PROFILE_COMPLETE, payload: data });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: PRO_SUCCESS_UPDATED,
              },
            });
          } else {
            dispatch({
              type: UPDATE_USER_PROFILE_ERROR,
              payload: data ? data : { message: DEFAULT_ERROR_MSG },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: UPDATE_USER_PROFILE_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};
