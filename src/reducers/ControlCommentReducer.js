import {
  UPDATE_CONTROL_COMMENT_COMPLETE,
  UPDATE_CONTROL_COMMENT_FAILURE,
  RESET_COMMENT_STATUS
} from "../utils/AppConstants";

const initState = {
  success: false,
  error: false,
};

export const ControlCommentReducer = (state = initState, action) => {
  switch (action.type) {
    case UPDATE_CONTROL_COMMENT_COMPLETE:
      return {
        ...state,
        success: true,
        error: false,
      };

    case UPDATE_CONTROL_COMMENT_FAILURE:
      return {
        ...state,
        success: false,
        error: true,
      };
    case RESET_COMMENT_STATUS:
      return {
        ...state,
        success: false,
        error: false,
      };
    default:
      return { ...state };
  }
};
