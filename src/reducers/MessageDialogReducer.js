import { SHOW_MESSAGE_DIALOG, HIDE_MESSAGE_DIALOG } from "../utils/AppConstants";

const initState = {
	dialog: {isOpen: false, detail: {}},
}

export const MessageDialogReducer = (state = initState, action) => {
	switch(action.type){
		case SHOW_MESSAGE_DIALOG:
			return {
				...state,
				dialog: {isOpen: true, detail: action.payload},
				
			};

		case HIDE_MESSAGE_DIALOG:
			return {
				...state,
				dialog: {isOpen: false, detail: undefined},
            };
            
		default:
			return {...state};
	}
}