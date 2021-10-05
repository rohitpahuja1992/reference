import {
  FETCH_CATEGORIES_API_URL,
  FETCH_CATEGORIES_COMPLETE,
  FETCH_CATEGORIES_FAILURE,
  ADD_CATEGORIES_API_URL,
  ADD_CATEGORIES_COMPLETE,
  ADD_CATEGORIES_ERROR,
  ADD_CATEGORIES_FAILURE,
  DELETE_CATEGORIES_API_URL,
  DELETE_CATEGORIES_COMPLETE,
  DELETE_CATEGORIES_ERROR,
  DELETE_CATEGORIES_FAILURE,
  START_SPINNER_ACTION,
  HIDE_MESSAGE_DIALOG,
  SHOW_SNACKBAR_ACTION,
  RESET_DUPLICATE_ERROR,
} from "../utils/AppConstants";
import { handleCategoryTerm, handleAddCategories } from "../utils/Messages";
import { setRequestHeader, stopLoading } from "../utils/helpers";

export const fetchCategories = () => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(FETCH_CATEGORIES_API_URL, {
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            data.responseObject.sort((a, b) => (a.id < b.id ? 1 : -1));
            dispatch({
              type: FETCH_CATEGORIES_COMPLETE,
              payload: data.responseObject,
            });
          } else {
            dispatch({ type: FETCH_CATEGORIES_FAILURE, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_CATEGORIES_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const addCategories = (categoryName) => {
  let formData = categoryName.trim();
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(ADD_CATEGORIES_API_URL, {
      method: "post",
      body: JSON.stringify({ categoryName: formData }),
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
              type: ADD_CATEGORIES_COMPLETE
              //payload: data.responseObject,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleAddCategories(formData, data.responseCode)
                  .message,
                severity: handleAddCategories(formData, data.responseCode)
                  .message,
              },
            });
          } else {
            dispatch({ type: ADD_CATEGORIES_ERROR, payload: data });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleAddCategories(formData, data.responseCode)
                  .message,
                severity: handleAddCategories(formData, data.responseCode)
                  .message,
              },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: ADD_CATEGORIES_FAILURE, payload: error });
          dispatch({
            type: SHOW_SNACKBAR_ACTION,
            payload: {
              detail: handleAddCategories(formData, "").message,
              severity: handleAddCategories(formData, "").message,
            },
          });
          stopLoading(dispatch);
        }
      );
  };
};

export const deleteCategories = (categoryId, categoryName) => {
  let DELETE_CATEGORY_API = DELETE_CATEGORIES_API_URL + categoryId;
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(DELETE_CATEGORY_API, {
      method: "put",
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            // var foundIndex = categoryList.findIndex((x) => x.id === categoryId);
            // categoryList[foundIndex] = data.responseObject;
            dispatch({
              type: DELETE_CATEGORIES_COMPLETE
              //payload: categoryList,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleCategoryTerm(categoryName, data.responseCode)
                  .message,
                severity: handleCategoryTerm(categoryName, data.responseCode)
                  .messageType,
              },
            });
          } else {
            dispatch({ type: DELETE_CATEGORIES_ERROR, payload: data });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleCategoryTerm(categoryName, data.responseCode)
                  .message,
                severity: handleCategoryTerm(categoryName, data.responseCode)
                  .messageType,
              },
            });
          }
          stopLoading(dispatch);
          dispatch({ type: HIDE_MESSAGE_DIALOG, payload: undefined });
        },
        (error) => {
          dispatch({ type: DELETE_CATEGORIES_FAILURE, payload: error });
          stopLoading(dispatch);
          dispatch({ type: HIDE_MESSAGE_DIALOG, payload: undefined });
          dispatch({
            type: SHOW_SNACKBAR_ACTION,
            payload: {
              detail: handleCategoryTerm(categoryName, "").message,
              severity: handleCategoryTerm(categoryName, "").messageType,
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
