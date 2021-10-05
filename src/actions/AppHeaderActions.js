import { UPDATE_HEADER_TEXT, UPDATE_ENTITY_ID } from "../utils/AppConstants";

export const updateHeaderTitle = (title, subtitle) => {
  return (dispatch) => {
    dispatch({ type: UPDATE_HEADER_TEXT, payload: { title, subtitle } });
  };
};

export const updateEntityId = (entityId) => {
  return (dispatch) => {
    dispatch({ type: UPDATE_ENTITY_ID, payload: entityId });
  };
};
