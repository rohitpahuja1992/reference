import {
  USERAUDIT_API_URL,
  FETCH_USERAUDIT_COMPLETE,
  FETCH_USERAUDIT_FAILURE,
  START_SPINNER_ACTION,
} from "../utils/AppConstants";
import { setRequestHeader, stopLoading } from "../utils/helpers";

export const fetchUserAudit = (userId, startIndex, pageSize) => {
  let API_URL = USERAUDIT_API_URL + "/" + userId;
  if (pageSize) {
    API_URL = API_URL + "?&startIndex=" + startIndex + "&pageSize=" + pageSize;
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
            data.responseObject.userAudits.sort((a, b) =>
              new Date(a.updatedDate) < new Date(b.updatedDate) ? 1 : -1
            );
            dispatch({
              type: FETCH_USERAUDIT_COMPLETE,
              payload: {
                oobComponents: data.responseObject.userAudits,
              totalElements: data.responseObject.totalElements
              },
            });
          } else {
            dispatch({ type: FETCH_USERAUDIT_FAILURE, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_USERAUDIT_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};
