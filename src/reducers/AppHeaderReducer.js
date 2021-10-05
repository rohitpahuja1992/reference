import { UPDATE_HEADER_TEXT, UPDATE_ENTITY_ID } from "../utils/AppConstants";

const initState = {
  data: { title: "", subtitle: "" },
  entityId: "",
};

export const AppHeaderReducer = (state = initState, action) => {
  switch (action.type) {
    case UPDATE_HEADER_TEXT:
      return {
        ...state,
        data: { ...state.data, ...action.payload },
      };
    case UPDATE_ENTITY_ID:
      return {
        ...state,
        entityId: action.payload,
      };
    default:
      return { ...state };
  }
};
