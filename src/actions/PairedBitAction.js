import {
  UPDATE_PAIRED_BIT,
  DEFAULT_START_INDEX,
  DEFAULT_PAGE_SIZE_TIMELINE
} from "../utils/AppConstants";
import {fetchClientTimeline} from './ClientTimelineActions';

export const PairedBitAction = (checked,clientId) => {
  return (dispatch) => {
    dispatch({ type: UPDATE_PAIRED_BIT, payload: checked });
    dispatch(fetchClientTimeline(clientId,DEFAULT_START_INDEX, DEFAULT_PAGE_SIZE_TIMELINE))
  };
};
