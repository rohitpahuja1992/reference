import {
  ADD_Turn_On_Module_COMPLETE,
  ADD_Turn_On_Module_ERROR,
  ADD_Turn_On_Module_FAILURE,
  CORRESPONDENCE_DEFINITION_ID_COMPLETE,
  CORRESPONDENCE_DEFINITION_ID_ERROR,
  CORRESPONDENCE_DEFINITION_ID_FAILURE,
  DEFAULT_CORRESPONDENCE_PACKAGE_COMPLETE,
  DEFAULT_CORRESPONDENCE_PACKAGE_ERROR,
  DEFAULT_CORRESPONDENCE_PACKAGE_FAILURE,
  DEFAULT_DELIVERY_TAG_COMPLETE,
  DEFAULT_DELIVERY_TAG_ERROR,
  DEFAULT_DELIVERY_TAG_FAILURE,
  CLEAR_TURN_ON_POPUP_DATA
} from "../utils/AppConstants";

let initState = {
  correspondenceDefinitionIdList: [],
  defaultCorrespondencePackageList: [],
  defaultDeliveryTagList: [],
  addError: '',
  isModuleUpdated: false,
};

export const TurnOnModuleReducer = (state = initState, action) => {
  switch (action.type) {
    case CORRESPONDENCE_DEFINITION_ID_COMPLETE:
      return {
        ...state,
        correspondenceDefinitionIdList: action.payload
      }
    case CORRESPONDENCE_DEFINITION_ID_ERROR:
      return {
        ...state
      }
    case CORRESPONDENCE_DEFINITION_ID_FAILURE:
      return {
        ...state
      }

    case DEFAULT_CORRESPONDENCE_PACKAGE_COMPLETE:
      return {
        ...state,
        defaultCorrespondencePackageList: action.payload
      }
    case DEFAULT_CORRESPONDENCE_PACKAGE_ERROR:
      return {
        ...state
      }
    case DEFAULT_CORRESPONDENCE_PACKAGE_FAILURE:
      return {
        ...state
      }

    case DEFAULT_DELIVERY_TAG_COMPLETE:
      return {
        ...state,
        defaultDeliveryTagList: action.payload
      }
    case DEFAULT_DELIVERY_TAG_ERROR:
      return {
        ...state
      }
    case DEFAULT_DELIVERY_TAG_FAILURE:
      return {
        ...state
      }

    case ADD_Turn_On_Module_COMPLETE:
      return {
        ...state,
        addError: "",
        isModuleUpdated: true,
      };
    case ADD_Turn_On_Module_ERROR:
      return {
        ...state,
        addError: action.payload,
        isModuleUpdated: false,
      };

    case ADD_Turn_On_Module_FAILURE:
      return {
        ...state,
        addError: action.payload,
        isModuleUpdated: false,
      };
    case CLEAR_TURN_ON_POPUP_DATA:
      return {
        ...state,
        correspondenceDefinitionIdList: [],
        defaultCorrespondencePackageList: [],
        defaultDeliveryTagList: [],
      };
    default:
      return { ...state };
  }
};
