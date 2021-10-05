import {
  CHANGE_PASSWORD_COMPLETE,
  CHANGE_PASSWORD_ERROR,
  CHANGE_PASSWORD_FAILURE,
  RESET_CHANGE_PASSWORD_DATA,
} from "../utils/AppConstants";

const initState = {
  data: "",
  isPasswordChanged: false,
  error: "",
};

export const ChangePasswordReducer = (state = initState, action) => {
  switch (action.type) {
    case CHANGE_PASSWORD_COMPLETE:
      return {
        ...state,
        data: action.payload,
        isPasswordChanged: true,
        error: undefined,
      };
    case CHANGE_PASSWORD_ERROR:
      return {
        ...state,
        data: "",
        isPasswordChanged: false,
        error: action.payload,
      };

    case CHANGE_PASSWORD_FAILURE:
      return {
        ...state,
        data: "",
        isPasswordChanged: false,
        error: action.payload,
      };

    case RESET_CHANGE_PASSWORD_DATA:
      return {
        ...state,
        data: "",
        isPasswordChanged: false,
        error: "",
      };
    default:
      return { ...state };
  }
};
