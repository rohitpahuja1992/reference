import {
  START_SPINNER_ACTION,
  STOP_SPINNER_ACTION,
} from "../utils/AppConstants";

const initState = {
  isLoading: false,
};
export const SpinnerReducer = (state = initState, action) => {
  const { type } = action;
  switch (type) {
    case START_SPINNER_ACTION:
      return {
        isLoading: true,
      };
    case STOP_SPINNER_ACTION:
      return {
        isLoading: false,
      };
    default:
      return { ...state };
  }
};
