import {
  FETCH_CLIENT_PROFILE_COMPLETE,
  FETCH_CLIENT_PROFILE_FAILURE,
  FETCH_CLIENTBYID_COMPLETE,
  FETCH_CLIENTBYID_FAILURE,
  ADD_CLIENT_PROFILE_COMPLETE,
  ADD_CLIENT_PROFILE_ERROR,
  ADD_CLIENT_PROFILE_FAILURE,
  ADD_CLIENT_MODULE_COMPLETE,
  ADD_CLIENT_MODULE_FAILURE,
  ADD_CLIENT_ENVIRONMENT_COMPLETE,
  ADD_CLIENT_ENVIRONMENT_FAILURE,
  UPDATE_CLIENT_PROFILE_COMPLETE,
  UPDATE_CLIENT_PROFILE_ERROR,
  UPDATE_CLIENT_PROFILE_FAILURE,
  DELETE_CLIENT_COMPLETE,
  DELETE_CLIENT_ERROR,
  DELETE_CLIENT_FAILURE,
  FETCH_CLIENTS_API_COMPLETE,
  FETCH_CLIENTS_API_FAILURE,
  SAVE_CLIENT_INFO,
  RESET_CLIENT_INFO,
  FETCH_CLIENTS_API_ERROR,
  RESET_ADD_CLIENT,
  RESET_MODULE_ADDED,
  RESET_ADD_CLIENT_INFO,
  RESET_ASSIGN_MODULE_ERROR,
  SELECTED_GLOBAL_MODULE,
  SELECTED_OOB_MODULE,
  DEFAULT_START_INDEX,
  DEFAULT_PAGE_SIZE,
} from "../utils/AppConstants";

const initState = {
  clientDetailsList: {
    list: [],
    totalElements: "",
    totalPages: "",
  },
  page: {
    startIndex: DEFAULT_START_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
  },
  clientByIdDetails: {
    Details: "",
  },
  clientInfo: {
    clientName: "",
    version: "",
    manager: "",
    modules: [],
  },
  addSelectedGlobalModule: [],
  addSelectedOOBModule: [],
  getError: "",
  getByIdError: "",
  updateError: "",
  addInfoError: "",
  addModuleError: "",
  addEnvError: "",
  addedClientId: "",
  isClientInfoAdded: false,
  isClientModuleAdded: false,
  isClientEnvAdded: false,
  isClientUpdated: false,
  isClientDeleted: false,
  //spinner: false,
};

export const ClientReducer = (state = initState, action) => {
  switch (action.type) {
    case FETCH_CLIENT_PROFILE_COMPLETE:
      return {
        ...state,
        clientDetailsList: {
          list: action.payload.clientsInfo.Clients,
          totalElements: action.payload.clientsInfo.totalElements,
          totalPages: action.payload.clientsInfo.totalPages,
        },
        page: {
          startIndex: action.payload.startIndex,
          pageSize: action.payload.pageSize,
        },
        addSelectedModule: [],
        getError: "",
        addedClientId: "",
        addInfoError: "",
        addModuleError: "",
        updateError: "",
        isClientInfoAdded: false,
        isClientModuleAdded: false,
        isClientEnvAdded: false,
        isClientUpdated: false,
        isClientDeleted: false,
      };
    case FETCH_CLIENT_PROFILE_FAILURE:
      return {
        ...state,
        clientDetailsList: { list: [], totalElements: "", totalPages: "" },
        page: {
          startIndex: DEFAULT_START_INDEX,
          pageSize: DEFAULT_PAGE_SIZE,
        },
        addSelectedModule: [],
        getError: action.payload,
        addedClientId: "",
        addInfoError: "",
        addModuleError: "",
        updateError: "",
        isClientInfoAdded: false,
        isClientModuleAdded: false,
        isClientEnvAdded: false,
        isClientUpdated: false,
        isClientDeleted: false,
      };
    case ADD_CLIENT_PROFILE_COMPLETE:
      return {
        ...state,
        isClientInfoAdded: true,
        addedClientId: action.payload,
        addInfoError: "",
      };
    case ADD_CLIENT_PROFILE_ERROR:
      return {
        ...state,
        isClientInfoAdded: false,
        addedClientId: "",
        addInfoError: action.payload,
      };
    case ADD_CLIENT_PROFILE_FAILURE:
      return {
        ...state,
        isClientInfoAdded: false,
        addedClientId: "",
        addInfoError: action.payload,
      };
    case ADD_CLIENT_MODULE_COMPLETE:
      return {
        ...state,
        isClientInfoAdded: false,
        isClientModuleAdded: true,
        addModuleError: "",
      };
    case ADD_CLIENT_MODULE_FAILURE:
      return {
        ...state,
        isClientInfoAdded: false,
        isClientModuleAdded: false,
        addModuleError: action.payload,
      };
    case ADD_CLIENT_ENVIRONMENT_COMPLETE:
      return {
        ...state,
        isClientEnvAdded: true,
        addEnvError: "",
      };
    case ADD_CLIENT_ENVIRONMENT_FAILURE:
      return {
        ...state,
        isClientEnvAdded: false,
        addEnvError: action.payload,
      };
    case SELECTED_GLOBAL_MODULE:
      return {
        ...state,
        addSelectedGlobalModule: action.payload,
      };
    case SELECTED_OOB_MODULE:
      return {
        ...state,
        addSelectedOOBModule: action.payload,
      };
    case UPDATE_CLIENT_PROFILE_COMPLETE:
      return {
        ...state,
        isClientUpdated: true,
        updateError: "",
      };
    case UPDATE_CLIENT_PROFILE_ERROR:
      return {
        ...state,
        isClientUpdated: false,
        updateError: action.payload,
      };
    case UPDATE_CLIENT_PROFILE_FAILURE:
      return {
        ...state,
        isClientUpdated: false,
        updateError: action.payload,
      };
    case DELETE_CLIENT_COMPLETE:
      return {
        ...state,
        isClientDeleted: true,
      };
    case DELETE_CLIENT_ERROR:
      return {
        ...state,
        isClientDeleted: false,
      };
    case DELETE_CLIENT_FAILURE:
      return {
        ...state,
        isClientDeleted: false,
      };
    case FETCH_CLIENTBYID_COMPLETE:
      return {
        ...state,
        clientByIdDetails: { details: action.payload },
        isClientUpdated: false,
        updateError: "",
        getByIdError: "",
      };
    case FETCH_CLIENTBYID_FAILURE:
      return {
        ...state,
        clientByIdDetails: { details: "" },
        isClientUpdated: false,
        updateError: "",
        getByIdError: action.payload,
      };
    case SAVE_CLIENT_INFO:
      return {
        ...state,
        clientInfo: action.payload,
      };
    case RESET_CLIENT_INFO:
      return {
        ...state,
        // clientDetailsList: {
        //   ...state.clientDetailsList,
        //   //list: [...state.clientDetailsList.list],
        // },
        clientInfo: action.payload,
        isClientUpdated: false,
        updateError: "",
      };
    case RESET_ADD_CLIENT:
      return {
        ...state,
        updateError: "",
        clientByIdDetails: { details: "" },
      };
    case RESET_ADD_CLIENT_INFO:
      return {
        ...state,
        addInfoError: "",
        isClientInfoAdded: false,
      };
    case RESET_ASSIGN_MODULE_ERROR:
      return {
        ...state,
        addModuleError: "",
        isClientModuleAdded: false,
      };
    case RESET_MODULE_ADDED:
      return {
        ...state,
        isClientModuleAdded: false,
        isClientEnvAdded: false,
      };

    default:
      return { ...state };
  }
};

const clientInitState = {
  data: {
    list: [],
    error: "",
  },
};

export const ClientApiReducer = (state = clientInitState, action) => {
  switch (action.type) {
    case FETCH_CLIENTS_API_COMPLETE:
      return {
        ...state,
        data: { ...state.data, list: action.payload, error: undefined },
      };

    case FETCH_CLIENTS_API_ERROR:
      return {
        ...state,
        data: { ...state.data, list: state.data.list, error: action.payload },
      };

    case FETCH_CLIENTS_API_FAILURE:
      return {
        ...state,
        data: { ...state.data, list: [], error: action.payload },
      };
    default:
      return { ...state };
  }
};
