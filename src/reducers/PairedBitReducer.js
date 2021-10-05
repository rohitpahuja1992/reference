import { UPDATE_PAIRED_BIT } from "../utils/AppConstants";

let initState = {
  checked: false,
};

export const PairedBitReducer = (state = initState, action) => {
  switch (action.type) {
    case UPDATE_PAIRED_BIT:
      return {
        ...state,
        checked: action.payload
      }
    default:
      return { ...state };
  }
};
