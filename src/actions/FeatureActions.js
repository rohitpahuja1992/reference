import {
  FETCH_FEATURES_API_URL,
  FETCH_FEATURES_COMPLETE,
  FETCH_FEATURES_FAILURE,
  FETCH_FEATURES_ERROR,
  FETCH_FEATURE_PROFILE_API_URL,
  FETCH_FEATURE_PROFILE_COMPLETE,
  FETCH_FEATURE_PROFILE_FAILURE,
  FETCH_FEATURE_PROFILE_ERROR,
  UPDATE_FEATURE_COMPLETE,
  UPDATE_FEATURE_ERROR,
  UPDATE_FEATURE_FAILURE,
  UPDATE_FEATURE_API_URL,
  START_SPINNER_ACTION,
  SHOW_SNACKBAR_ACTION,
} from "../utils/AppConstants";
import { setRequestHeader, stopLoading } from "../utils/helpers";
import { FEATURE_SUCC_UPDATED, DEFAULT_ERROR_MSG } from "../utils/Messages";
export const fetchFeatures = (startIndex, pageSize) => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(pageSize ? FETCH_FEATURES_API_URL + "?startIndex=" + startIndex + "&pageSize=" + pageSize : FETCH_FEATURES_API_URL, {
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (data && !data.hasOwnProperty("error")) {
            dispatch({ type: FETCH_FEATURES_COMPLETE, 
              payload:  {
                oobComponents: data.responseObject?.oobComponents,
                totalElements: data.responseObject?.totalElements,
                totalPages: data.responseObject?.totalPages,
                pageSize: pageSize,
                startIndex: startIndex,
            }
            });
          } else {
            dispatch({
              type: FETCH_FEATURES_ERROR,
              payload: data ? data : { message: DEFAULT_ERROR_MSG },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_FEATURES_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchFeatureProfile = (featureId) => {
  let ApiUrl = `${FETCH_FEATURE_PROFILE_API_URL}/${featureId}`;
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(ApiUrl, {
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (data && !data.hasOwnProperty("error")) {
            dispatch({ type: FETCH_FEATURE_PROFILE_COMPLETE, payload: data });
          } else {
            dispatch({
              type: FETCH_FEATURE_PROFILE_ERROR,
              payload: data ? data : { message: DEFAULT_ERROR_MSG },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_FEATURE_PROFILE_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const updateFeature = (formData) => {
  let updateFeatureData = {
    id: formData.id,
    featureName: formData.featureName,
    featureInternalName: formData.featureInternalName,
    permission: [],
    featureStatus: formData.featureStatus,
  };
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(UPDATE_FEATURE_API_URL, {
      method: "post",
      body: JSON.stringify(updateFeatureData),
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            dispatch({ type: UPDATE_FEATURE_COMPLETE, payload: data });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: FEATURE_SUCC_UPDATED,
              },
            });
          } else {
            dispatch({
              type: UPDATE_FEATURE_ERROR,
              payload: data ? data : { message: DEFAULT_ERROR_MSG },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: UPDATE_FEATURE_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};
