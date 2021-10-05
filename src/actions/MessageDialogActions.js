import { SHOW_MESSAGE_DIALOG, HIDE_MESSAGE_DIALOG, HIDE_SNACKBAR_ACTION } from "../utils/AppConstants";

export const showMessageDialog = (data) => {
    return dispatch => {
        dispatch ({type: SHOW_MESSAGE_DIALOG, payload: data});
    }
}

export const hideMessageDialog = () => {
    return dispatch => {
        dispatch ({type: HIDE_MESSAGE_DIALOG, payload: undefined});
    }
}

export const hideSnackbar = () => {
    return dispatch => {
        dispatch ({type: HIDE_SNACKBAR_ACTION});
    }
}