import {
  FETCH_LISTBYPAGE_COMPLETE,
  FETCH_LISTBYPAGE_FAILURE,
  SET_DEFAULT_STARTINDEX,
  START_SPINNER_ACTION,
} from "../utils/AppConstants";
import { setRequestHeader, stopLoading } from "../utils/helpers";

export const fetchListByPage = (API_URL, startIndex, pageSize, entity) => {
  let LIST_URL =
    API_URL +
    "?startIndex=" +
    startIndex +
    "&pageSize=" +
    pageSize +
    "&sortBy=createdDate";
  //let API_URL = MASTERMODULE_API_URL + "?isglobal=true"
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(LIST_URL, {
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            // data.responseObject[entity].npm((a, b) =>
            //   a.createdDate < b.createdDate ? 1 : -1
            // );
            dispatch({
              type: FETCH_LISTBYPAGE_COMPLETE,
              payload: {
                list: data.responseObject[entity],
                totalElements: data.responseObject.totalElements,
                totalPages: data.responseObject.totalPages,
                url: API_URL,
                startIndex: startIndex,
                pageSize: pageSize,
                entityName: entity,
              },
            });
          } else {
            dispatch({ type: FETCH_LISTBYPAGE_FAILURE, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_LISTBYPAGE_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

  export const resetTablePagination = (index) => {
    return {
        type: SET_DEFAULT_STARTINDEX,
        payload: index
      };
  };
