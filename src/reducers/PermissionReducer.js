import { FETCH_PERMISSIONS_COMPLETE,FETCH_PERMISSIONS_FAILURE } from "../utils/AppConstants";

const initState = {
	data: { 
    list: [
      { id: 1, name: "Add", internalName: "addAccess", createdOn: "24/05/2020 08:00 AM", createdBy: "Chay Levell" },
      { id: 2, name: "Edit", internalName: "editAccess", createdOn: "16/05/2020 06:00 PM", createdBy: "Maggie Cajka" },
      { id: 3, name: "View", internalName: "viewAccess", createdOn: "04/05/2020 12:30 PM", createdBy: "Maggie Cajka" },
      { id: 4, name: "Delete", internalName: "deleteAccess", createdOn: "24/05/2020 08:00 AM", createdBy: "Chay Levell" },
      { id: 5, name: "Approve", internalName: "approveAccess", createdOn: "16/05/2020 06:00 PM", createdBy: "Maggie Cajka" },
      { id: 6, name: "Sign Off", internalName: "signOffAccess", createdOn: "24/05/2020 08:00 AM", createdBy: "Maggie Cajka" },
    ], 
    error: ""
  }
}

export const PermissionReducer = (state = initState, action) => {
  switch (action.type) {
    case FETCH_PERMISSIONS_COMPLETE:
      return {
        ...state,
        data: { list: action.payload, error: undefined },
      };

    case FETCH_PERMISSIONS_FAILURE:
      return {
        ...state,
        data: { list: [], error: action.payload }
      };
    default:
      return { ...state };
  }
}