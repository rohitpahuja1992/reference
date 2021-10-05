import {
    SHOW_SNACKBAR_ACTION,
    HIDE_SNACKBAR_ACTION
  } from "../utils/AppConstants";
  
  const initState = {
    dialog: {isOpen: false, detail:"",severity:""},
  };
  export const SnackbarReducer = (state = initState, action) => {
    switch (action.type) {
      case SHOW_SNACKBAR_ACTION:
        return {
            ...state,
            dialog: {isOpen: true, detail: action.payload.detail,severity:action.payload.severity},
            
        };
        case HIDE_SNACKBAR_ACTION:
        return {
            ...state,
            dialog: {isOpen: false, detail:"",severity:""},    
        };
      default:
        return { ...state };
    }
  };