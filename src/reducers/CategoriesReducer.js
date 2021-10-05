import {
  FETCH_CATEGORIES_COMPLETE,
  FETCH_CATEGORIES_FAILURE,
  ADD_CATEGORIES_COMPLETE,
  ADD_CATEGORIES_ERROR,
  ADD_CATEGORIES_FAILURE,
  DELETE_CATEGORIES_COMPLETE,
  DELETE_CATEGORIES_ERROR,
  DELETE_CATEGORIES_FAILURE,
  RESET_DUPLICATE_ERROR,
} from "../utils/AppConstants";

const initState = {
  categoriesDetailsList: { list: [] },
  isCategoryAdded: false,
  isCategoryDeleted: false,
  getError: "",
  addError: "",
};

export const CategoriesReducer = (state = initState, action) => {
  switch (action.type) {
    case FETCH_CATEGORIES_COMPLETE:
      return {
        ...state,
        categoriesDetailsList: { list: action.payload },
        getError: "",
        addError: "",
        isCategoryAdded: false,
        isCategoryDeleted: false,
      };

    case FETCH_CATEGORIES_FAILURE:
      return {
        ...state,
        categoriesDetailsList: { list: [] },
        getError: action.payload,
        addError: "",
        isCategoryAdded: false,
        isCategoryDeleted: false,
      };
    case ADD_CATEGORIES_COMPLETE:
      return {
        ...state,
        isCategoryAdded: true,
        addError: "",
      };
    case ADD_CATEGORIES_ERROR:
      return {
        ...state,
        addError: action.payload,
      };

    case ADD_CATEGORIES_FAILURE:
      return {
        ...state,
        addError: action.payload,
      };
    case DELETE_CATEGORIES_COMPLETE:
      return {
        ...state,
        isCategoryDeleted: true,
        deleteError: "",
      };
    case DELETE_CATEGORIES_ERROR:
      return {
        ...state,
        isCategoryDeleted: false
      };

    case DELETE_CATEGORIES_FAILURE:
      return {
        ...state,
        isCategoryDeleted: false
      };
    case RESET_DUPLICATE_ERROR:
      return {
        ...state,
        addError: "",
      };
    default:
      return { ...state };
  }
};
