import {
  FETCH_MASTERMESSAGE_COMPLETE,
  FETCH_MASTERMESSAGE_FAILURE,
  FETCH_ALL_MASTERMESSAGE_COMPLETE,
  FETCH_ALL_MASTERMESSAGE_FAILURE,
  FETCH_MASTERMESSAGEBYID_COMPLETE,
  FETCH_MASTERMESSAGEBYID_FAILURE,
  ADD_MASTERMESSAGE_COMPLETE,
  ADD_MASTERMESSAGE_FAILURE,
  ADD_MASTERMESSAGE_ERROR,
  UPDATE_MASTERMESSAGE_COMPLETE,
  UPDATE_MASTERMESSAGE_FAILURE,
  UPDATE_MASTERMESSAGE_ERROR,
  UPDATE_CONTROLTOOGLE_COMPLETE,
  UPDATE_CONTROLTOOGLE_FAILURE,
  UPDATE_CONTROLTOOGLE_ERROR,
  DELETE_MASTERMESSAGE_COMPLETE,
  DELETE_MASTERMESSAGE_FAILURE,
  DELETE_MASTERMESSAGE_ERROR,
  RESET_MASTERMESSAGE_ADDED,
  FETCH_MASTERMESSAGEBYMODULEID_COMPLETE,
  FETCH_MASTERMESSAGEBYMODULEID_FAILURE,
  FETCH_CONTROLPROPERTY_COMPLETE,
  FETCH_CONTROLPROPERTY_FAILURE,
  RESET_DUPLICATE_ERROR,
  RESET_UPDATE_ERROR,
  DEFAULT_START_INDEX,
  DEFAULT_PAGE_SIZE,
  SET_DEFAULT_STARTINDEX,
} from "../utils/AppConstants";

const initState = {
  messageDetailsList: {
    list: [
      // {
      //   createdByUser: "Vipul Saxena",
      //   createdDate: "2020-10-09T07:16:52.000+0000",
      //   msgConst:'CCRC_UmSubCategory',
      //   shortDescription: "Rebel the UM Sub Category field",
      //   id: 0,
      //   modules: "PROVIDER_DISPUTES",
      //   updatedByUser: null,
      //   updatedDate: null,
      // },
      // {
      //     createdByUser: "Vipul Saxena",
      //     createdDate: "2020-10-09T07:16:52.000+0000",
      //     msgConst:'CCRCP_modifier1',
      //     shortDescription: "Rebel the Modifier field",
      //     id: 0,
      //     modules: "PROVIDER_DISPUTES",
      //     updatedByUser: null,
      //     updatedDate: null,
      //   },
      //   {
      //     createdByUser: "Vipul Saxena",
      //     createdDate: "2020-10-09T07:16:52.000+0000",
      //     msgConst:'ccrBenefitDetailsMonthlyCopay',
      //     shortDescription: "Rebel the Monthly CoPay field",
      //     id: 0,
      //     modules: "LTSS",
      //     updatedByUser: null,
      //     updatedDate: null,
      //   },
      //   {
      //     createdByUser: "Vipul Saxena",
      //     createdDate: "2020-10-09T07:16:52.000+0000",
      //     msgConst:'ccrBenefitDetailsBudget',
      //     shortDescription: "Rebel the Budget field",
      //     id: 0,
      //     modules: "LTSS",
      //     updatedByUser: null,
      //     updatedDate: null,
      //   },
    ],
    totalElements: "",
    totalPages: "",
  },
  allList: [],
  reset: false,
  page: {
    startIndex: DEFAULT_START_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
  },
  messageDetailsById: {
    data: {},
  },
  isMessageAdded: false,
  isMessageDeleted: false,
  isMessageUpdated: false,
  //getByIdError:"",
  getError: "",
  addError: "",
  putError: "",
  messageByModule: [],
  controlList: {},
};

export const MasterMessageReducer = (state = initState, action) => {
  switch (action.type) {
    case FETCH_MASTERMESSAGE_COMPLETE:
      return {
        ...state,
        messageDetailsList: {
          list: action.payload.pageInfo.configTableRecord,
          totalElements: action.payload.pageInfo.totalElements,
          totalPages: action.payload.pageInfo.totalPages,
        },
        page: {
          startIndex: action.payload.startIndex,
          pageSize: action.payload.pageSize,
        },
        reset: false,
        messageDetailsById: { data: {} },
        getError: "",
        addError: "",
        putError: "",
        isMessageAdded: false,
        isMessageDeleted: false,
        isMessageUpdated: false,
      };

    case FETCH_MASTERMESSAGE_FAILURE:
      return {
        ...state,
        messageDetailsList: { list: [], totalElements: "", totalPages: "" },
        page: {
          startIndex: DEFAULT_START_INDEX,
          pageSize: DEFAULT_PAGE_SIZE,
        },
        reset: false,
        messageDetailsById: { data: {} },
        getError: action.payload,
        addError: "",
        putError: "",
        isMessageAdded: false,
        isMessageDeleted: false,
        isMessageUpdated: false,
      };
    case FETCH_ALL_MASTERMESSAGE_COMPLETE:
      return {
        ...state,
        allList: action.payload.pageInfo.configTableRecord,
      };

    case FETCH_ALL_MASTERMESSAGE_FAILURE:
      return {
        ...state,
        allList: []
      };
    case FETCH_MASTERMESSAGEBYID_COMPLETE:
      return {
        ...state,
        messageDetailsById: { data: action.payload },
      };
    case FETCH_MASTERMESSAGEBYID_FAILURE:
      return {
        ...state,
        messageDetailsById: { data: {} },
      };
    case ADD_MASTERMESSAGE_COMPLETE:
      return {
        ...state,
        isMessageAdded: true,
        addError: "",
      };
    case ADD_MASTERMESSAGE_ERROR:
      return {
        ...state,
        isMessageAdded: false,
        addError: action.payload,
      };

    case ADD_MASTERMESSAGE_FAILURE:
      return {
        ...state,
        isMessageAdded: false,
        addError: action.payload,
      };

    case RESET_MASTERMESSAGE_ADDED:
      return {
        ...state,
        isMessageAdded: false,
        putError: "",
      };

    case UPDATE_MASTERMESSAGE_COMPLETE:
      return {
        ...state,
        isMessageUpdated: true,
        putError: "",
      };
    case UPDATE_MASTERMESSAGE_ERROR:
      return {
        ...state,
        isMessageUpdated: false,
        putError: action.payload,
      };

    case UPDATE_MASTERMESSAGE_FAILURE:
      return {
        ...state,
        isMessageUpdated: false,
        putError: action.payload,
      };
    case DELETE_MASTERMESSAGE_COMPLETE:
      return {
        ...state,
        isMessageDeleted: true,
      };
    case DELETE_MASTERMESSAGE_ERROR:
      return {
        ...state,
        isMessageDeleted: false,
      };
    case DELETE_MASTERMESSAGE_FAILURE:
      return {
        ...state,
        isMessageDeleted: false,
      };
    case RESET_DUPLICATE_ERROR:
      return {
        ...state,
        messageDetailsById: { data: {} },
        addError: "",
        putError: "",
        isMessageAdded: false,
        isMessageDeleted: false,
        isMessageUpdated: false,
      };
    case RESET_UPDATE_ERROR:
      return {
        ...state,
        //messageDetailsById:{data: {}},
        addError: "",
        putError: "",
      };
    case SET_DEFAULT_STARTINDEX:
      return {
        ...state,
        reset: true,
      };
    case FETCH_MASTERMESSAGEBYMODULEID_COMPLETE:
      return {
        ...state,
        messageByModule: action.payload,
      };
    case FETCH_MASTERMESSAGEBYMODULEID_FAILURE:
      return {
        ...state,
        messageByModule: [],
      };
    case FETCH_CONTROLPROPERTY_COMPLETE:
      return {
        ...state,
        controlList: action.payload,
        isToggleUpdated: false,
      };
    case FETCH_CONTROLPROPERTY_FAILURE:
      return {
        ...state,
        controlList: {},
      };
    case UPDATE_CONTROLTOOGLE_COMPLETE:
      return {
        ...state,
        isToggleUpdated: true,
        putError: "",
      };
    case UPDATE_CONTROLTOOGLE_ERROR:
      return {
        ...state,
        isToggleUpdated: false,
        putError: action.payload,
      };

    case UPDATE_CONTROLTOOGLE_FAILURE:
      return {
        ...state,
        isToggleUpdated: false,
        putError: action.payload,
      };
    default:
      return { ...state };
  }
};
