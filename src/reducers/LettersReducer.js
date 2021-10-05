import {
  FETCH_BUSINESSLINE_COMPLETE,
  FETCH_BUSINESSLINE_FAILURE,
  FETCH_MODULES_COMPLETE,
  FETCH_MODULES_FAILURE,
  FETCH_COMPANY_COMPLETE,
  FETCH_COMPANY_FAILURE,
  FETCH_ALLFILES_COMPLETE,
  FETCH_ALLFILES_FAILURE,
  FETCH_ALLFILES_ERROR,
  FETCH_FILE_COMPLETE,
  FETCH_FILE_FAILURE,
  FETCH_FILE_ERROR,
  ADD_FILE_COMPLETE,
  ADD_FILE_ERROR,
  ADD_FILE_FAILURE,
  ADD_FILE_RESET,
  RESET_INVALIDTAG,
  RESET_LETTERUPDATE,
  UPDATE_FILE_COMPLETE,
  UPDATE_FILE_ERROR,
  UPDATE_FILE_FAILURE,
  UPDATE_FILES_COMPLETE,
  UPDATE_FILES_ERROR,
  UPDATE_FILES_FAILURE,
  DELETE_FILE_COMPLETE,
  DELETE_FILE_ERROR,
  DELETE_FILE_FAILURE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_START_INDEX,
  FETCH_STOPPED_COMPLETE,
  FETCH_STOPPED_FAILURE,
  FETCH_STOPPED_ERROR,
  DOWNLOAD_LETTER_COMPLETE,
  DOWNLOAD_LETTER_FAILURE,
  DOWNLOAD_LETTER_ERROR,
  DOWNLOAD_LIBRARY_LETTER_COMPLETE,
  DOWNLOAD_LIBRARY_LETTER_FAILURE,
  DOWNLOAD_LIBRARY_LETTER_ERROR,
  FETCH_PROCESSING_COMPLETE,
  FETCH_PROCESSING_FAILURE,
  FETCH_PROCESSING_ERROR,
  UPDATE_PROCESSING_COMPLETE,
  UPDATE_PROCESSING_FAILURE,
  UPDATE_PROCESSING_ERROR,
  FETCH_LETTERHTML_COMPLETE,
  FETCH_LETTERHTML_FAILURE,
  FETCH_LETTERHTML_ERROR,
  FETCH_LIBRARY_COMPLETE,
  FETCH_LIBRARY_FAILURE,
  FETCH_LIBRARY_ERROR,
  FETCH_AUDIT_COMPLETE,
  FETCH_AUDIT_FAILURE,
  RESET_AUDIT,
  RESET_LETTERHTML,
  FETCH_COVERSHEET_COMPLETE,
  FETCH_COVERSHEET_FAILURE,
  FETCH_ATTACHMENT_COMPLETE,
  FETCH_ATTACHMENT_FAILURE,
  FETCH_REVERTHTML_COMPLETE,
  FETCH_REVERTHTML_FAILURE,
  FETCH_REVERTHTML_ERROR,
  FETCH_METRICS_COMPLETE,
  FETCH_METRICS_FAILURE,
  FETCH_METRICS_ERROR,
  FETCH_LETTERSTATUS_COMPLETE,
  FETCH_LETTERSTATUS_FAILURE,
  FETCH_LETTERSTATUS_ERROR,
  FETCH_AUTVSINT_COMPLETE,
  FETCH_AUTVSINT_FAILURE,
  FETCH_AUTVSINT_ERROR,
  RESET_LETTERAUDIT_IS_DONE,
  RESET_LETTERDATE_IS_DONE,
  SAVE_FILE_COMPLETE,
  FETCH_LOBBYCOMPID_COMPLETE,
  FETCH_LOBBYCOMPID_FAILURE,
  UPDATE_LETTERDOC_COMPLETE,
  UPDATE_LETTERDOC_FAILURE,
  UPDATE_LETTERDOC_ERROR,
} from "../utils/LettersAppConstant";

const initState = {

  businessList: [],
  lobList: {},
  modulesList: [],
  companyList: [],
  auditDetails: [],
  attachments: [],
  coverSheets: [],
  fileData: [],
  matrixData: {},
  letterStatus: {},
  letterData: {},
  downloadOriginalLetter: "",
  downloadLibraryLetter: "",
  originalLetterError: "",
  libraryLetterError: "",
  updatedFile: [
    {
      status: "",
      termdate: "",
      isAuditUpdated: false,
      isDateUpdated: false,
      error: "",
    },
  ],
  updatedFiles: [
    {
      details: "",
      error: "",
      isUpdateCalled: false,
    },
  ],

  allFilesData: {
    list: [],
    error: "",
    responseCode: "",
    responseMessage: "",
    totalElements: "",
    totalPages: "",
  },
  allLibraryData: {
    list: [],
    error: "",
    responseCode: "",
    responseMessage: "",
    totalElements: "",
    totalPages: "",
  },
  stoppedData: {
    list: [],
    error: "",
    responseCode: "",
    responseMessage: "",
    totalElements: "",
    totalPages: "",
  },
  processingData: {
    list: [],
    success: [],
    failure: [],
    error: "",
    responseCode: "",
    responseMessage: "",
    totalElements: "",
    totalPages: "",
  },

  page: {
    startIndex: DEFAULT_START_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
  },

  getError: "",
  getByIdError: "",
  updateError: "",
  addInfoError: "",
  addModuleError: "",
  addEnvError: "",
};

export const LettersReducer = (state = initState, action) => {
  switch (action.type) {
    case FETCH_BUSINESSLINE_COMPLETE:
      return {
        ...state,
        businessList: [...action.payload],
        addInfoError: action.payload,
      };
    case FETCH_BUSINESSLINE_FAILURE:
      return {
        ...state,
        businessList: [],
        addInfoError: action.payload,
      };
    case DOWNLOAD_LETTER_COMPLETE:
      return {
        ...state,
        downloadOriginalLetter: action.payload,
        libraryLetterError: undefined,
      };
    case DOWNLOAD_LETTER_ERROR:
      return {
        ...state,
        downloadOriginalLetter: "",
        libraryLetterError: action.payload,
      };
    case DOWNLOAD_LETTER_FAILURE:
      return {
        ...state,
        downloadOriginalLetter: "",
        libraryLetterError: action.payload,
      };
    case DOWNLOAD_LIBRARY_LETTER_COMPLETE:
      return {
        ...state,
        downloadLibraryLetter: action.payload,
        originalLetterError: undefined,
      };
    case DOWNLOAD_LIBRARY_LETTER_ERROR:
      return {
        ...state,
        downloadLibraryLetter: "",
        originalLetterError: action.payload,
      };
    case DOWNLOAD_LIBRARY_LETTER_FAILURE:
      return {
        ...state,
        downloadLibraryLetter: "",
        originalLetterError: action.payload,
      };

    case FETCH_MODULES_COMPLETE:
      return {
        ...state,
        modulesList: [...action.payload.modules],
        addInfoError: action.payload,
      };
    case FETCH_MODULES_FAILURE:
      return {
        ...state,
        modulesList: [],
        addInfoError: action.payload,
      };

    case FETCH_COMPANY_COMPLETE:
      return {
        ...state,
        companyList: [...action.payload],
        addInfoError: action.payload,
      };
    case FETCH_COMPANY_FAILURE:
      return {
        ...state,
        companyList: [],
        addInfoError: action.payload,
      };

    case FETCH_LOBBYCOMPID_COMPLETE:
      return {
        ...state,
        lobList: {
          ...state.lobList,
          ...action.payload,
        },
        addInfoError: action.payload,
      };
    case FETCH_LOBBYCOMPID_FAILURE:
      return {
        ...state,
        lobList: {},
        noLOB: action.payload,
        addInfoError: action.payload,
      };

    case FETCH_COVERSHEET_COMPLETE:
      return {
        ...state,
        coverSheets: [...action.payload.libraryLetters],
        addInfoError: action.payload,
      };
    case FETCH_COVERSHEET_FAILURE:
      return {
        ...state,
        coverSheets: [],
        addInfoError: action.payload,
      };

    case FETCH_ATTACHMENT_COMPLETE:
      return {
        ...state,
        attachments: [...action.payload.libraryLetters],
        addInfoError: action.payload,
      };
    case FETCH_ATTACHMENT_FAILURE:
      return {
        ...state,
        attachments: [],
        addInfoError: action.payload,
      };

    case FETCH_FILE_COMPLETE:
      return {
        ...state,
        letterData: { ...action.payload },
      };

    case FETCH_FILE_ERROR:
      return {
        ...state,
        letterData: {},
      };

    case FETCH_FILE_FAILURE:
      return {
        ...state,
        letterData: {},
      };

    case FETCH_ALLFILES_COMPLETE:
      return {
        ...state,
        isFileRemoved: false,
        isFilesProcessed: false,
        lobList: null,
        allFilesData: {
          ...state.allFilesData,
          isFileAdded: false,
          list: action.payload.filesInfo.responseObject.importedLetters,
          failedList: action.payload.filesInfo.responseObject.failedLetters,
          processList:
            action.payload.filesInfo.responseObject.processingLetters,
          responseCode: action.payload.filesInfo.responseCode,
          responseMessage: action.payload.filesInfo.responseMessage,
          totalElements: action.payload.filesInfo.responseObject.totalElements,
          totalPages: action.payload.filesInfo.responseObject.totalPages,
          error: undefined,
          fecthError: undefined,
        },
        page: {
          startIndex: action.payload.startIndex,
          pageSize: action.payload.pageSize,
        },
      };

    case FETCH_ALLFILES_ERROR:
      return {
        ...state,
        allFilesData: {
          ...state.allFilesData,
          isFetchCalled: true,
          isFileAdded: false,
          responseCode: action.payload.responseCode,
          responseMessage: action.payload.responseMessage,
          totalElements: "",
          totalPages: "",
          fecthError: action.payload,
          error: undefined,
        },
        page: {
          startIndex: DEFAULT_START_INDEX,
          pageSize: DEFAULT_PAGE_SIZE,
        },
      };

    case FETCH_ALLFILES_FAILURE:
      return {
        ...state,
        allFilesData: {
          ...state.allFilesData,
          isFileAdded: false,
          list: [],
          responseCode: "",
          responseMessage: "",
          totalElements: "",
          totalPages: "",
          fecthError: action.payload,
          error: undefined,
        },
        page: {
          startIndex: DEFAULT_START_INDEX,
          pageSize: DEFAULT_PAGE_SIZE,
        },
      };

    case FETCH_STOPPED_COMPLETE:
      return {
        ...state,
        stoppedData: {
          ...state.stoppedData,
          isFileAdded: false,
          list: action.payload.filesInfo.responseObject.failedLetters,
          //list: action.payload.filesInfo.responseObject.processingLetters,
          responseCode: action.payload.filesInfo.responseCode,
          responseMessage: action.payload.filesInfo.responseMessage,
          totalElements: action.payload.filesInfo.responseObject.totalElements,
          totalPages: action.payload.filesInfo.responseObject.totalPages,
          error: undefined,
          fecthError: undefined,
        },
        page: {
          startIndex: action.payload.startIndex,
          pageSize: action.payload.pageSize,
        },
      };

    case FETCH_STOPPED_ERROR:
      return {
        ...state,
        stoppedData: {
          ...state.stoppedData,
          isFetchCalled: true,
          isFileAdded: false,
          responseCode: action.payload.responseCode,
          responseMessage: action.payload.responseMessage,
          totalElements: "",
          totalPages: "",
          fecthError: action.payload,
          error: undefined,
        },
        page: {
          startIndex: DEFAULT_START_INDEX,
          pageSize: DEFAULT_PAGE_SIZE,
        },
      };

    case FETCH_STOPPED_FAILURE:
      return {
        ...state,
        stoppedData: {
          ...state.stoppedData,
          isFileAdded: false,
          list: [],
          responseCode: "",
          responseMessage: "",
          totalElements: "",
          totalPages: "",
          fecthError: action.payload,
          error: undefined,
        },
        page: {
          startIndex: DEFAULT_START_INDEX,
          pageSize: DEFAULT_PAGE_SIZE,
        },
      };

    case FETCH_PROCESSING_COMPLETE:
      return {
        ...state,
        processingData: {
          ...state.processingData,
          isFileAdded: false,
          list: action.payload.filesInfo.responseObject.processingLetters,
          responseCode: action.payload.filesInfo.responseCode,
          responseMessage: action.payload.filesInfo.responseMessage,
          totalElements: action.payload.filesInfo.responseObject.totalElements,
          totalPages: action.payload.filesInfo.responseObject.totalPages,
          error: undefined,
          fecthError: undefined,
        },
        page: {
          startIndex: action.payload.startIndex,
          pageSize: action.payload.pageSize,
        },
      };

    case FETCH_PROCESSING_ERROR:
      return {
        ...state,
        processingData: {
          ...state.processingData,
          isFetchCalled: true,
          isFileAdded: false,
          responseCode: action.payload.responseCode,
          responseMessage: action.payload.responseMessage,
          totalElements: "",
          totalPages: "",
          fecthError: action.payload,
          error: undefined,
        },
        page: {
          startIndex: DEFAULT_START_INDEX,
          pageSize: DEFAULT_PAGE_SIZE,
        },
      };

    case FETCH_PROCESSING_FAILURE:
      return {
        ...state,
        processingData: {
          ...state.processingData,
          isFileAdded: false,
          list: [],
          responseCode: "",
          responseMessage: "",
          totalElements: "",
          totalPages: "",
          fecthError: action.payload,
          error: undefined,
        },
        page: {
          startIndex: DEFAULT_START_INDEX,
          pageSize: DEFAULT_PAGE_SIZE,
        },
      };

    case UPDATE_PROCESSING_COMPLETE:
      return {
        ...state,
        isFilesProcessed: true,
        processingData: {
          ...state.processingData,
          isFileAdded: false,
          success: action.payload.resPonseData.responseObject.Success,
          failure: action.payload.resPonseData.responseObject.Failure,
          responseCode: action.payload.resPonseData.responseCode,
          responseMessage: action.payload.resPonseData.responseMessage,
          // totalElements: action.payload.resPonseData.responseObject.totalElements,
          // totalPages: action.payload.resPonseData.responseObject.totalPages,
          error: undefined,
          fecthError: undefined,
        },
        page: {
          startIndex: action.payload.startIndex,
          pageSize: action.payload.pageSize,
        },
      };

    case UPDATE_PROCESSING_ERROR:
      return {
        ...state,
        isFilesProcessed: false,
        processingData: {
          ...state.processingData,
          isFetchCalled: true,
          isFileAdded: false,
          responseCode: action.payload.responseCode,
          responseMessage: action.payload.responseMessage,
          totalElements: "",
          totalPages: "",
          fecthError: action.payload,
          error: undefined,
        },
        page: {
          startIndex: DEFAULT_START_INDEX,
          pageSize: DEFAULT_PAGE_SIZE,
        },
      };

    case UPDATE_PROCESSING_FAILURE:
      return {
        ...state,
        isFilesProcessed: false,
        processingData: {
          ...state.processingData,
          isFileAdded: false,
          success: [],
          failure: [],
          responseCode: "",
          responseMessage: "",
          totalElements: "",
          totalPages: "",
          fecthError: action.payload,
          error: undefined,
        },
        page: {
          startIndex: DEFAULT_START_INDEX,
          pageSize: DEFAULT_PAGE_SIZE,
        },
      };

    case FETCH_LIBRARY_COMPLETE:
      return {
        ...state,

        allLibraryData: {
          ...state.allLibraryData,
          isFileAdded: false,
          list: action.payload.filesInfo.responseObject.libraryLetters,
          responseCode: action.payload.filesInfo.responseCode,
          responseMessage: action.payload.filesInfo.responseMessage,
          totalElements: action.payload.filesInfo.responseObject.totalElements,
          totalPages: action.payload.filesInfo.responseObject.totalPages,
          error: undefined,
          fecthError: undefined,
        },
        page: {
          startIndex: action.payload.startIndex,
          pageSize: action.payload.pageSize,
        },
      };

    case FETCH_LIBRARY_ERROR:
      return {
        ...state,
        allLibraryData: {
          ...state.allLibraryData,
          isFetchCalled: true,
          isFileAdded: false,
          responseCode: action.payload.responseCode,
          responseMessage: action.payload.responseMessage,
          totalElements: "",
          totalPages: "",
          fecthError: action.payload,
          error: undefined,
        },
        page: {
          startIndex: DEFAULT_START_INDEX,
          pageSize: DEFAULT_PAGE_SIZE,
        },
      };

    case FETCH_LIBRARY_FAILURE:
      return {
        ...state,
        allLibraryData: {
          ...state.allLibraryData,
          isFileAdded: false,
          list: [],
          responseCode: "",
          responseMessage: "",
          totalElements: "",
          totalPages: "",
          fecthError: action.payload,
          error: undefined,
        },
        page: {
          startIndex: DEFAULT_START_INDEX,
          pageSize: DEFAULT_PAGE_SIZE,
        },
      };

    case ADD_FILE_COMPLETE:
      return {
        ...state,
        fileData: [
          ...state.fileData,
          {
            isFileAdded: true,
            responseCode: action.payload.data.responseCode,
            responseMessage: action.payload.data.responseMessage,
            //resFileData: action.payload.data.responseObject,
            error: undefined,
            fileName: action.payload.originalFileName,
          },
        ],
      };

    case ADD_FILE_ERROR:
      return {
        ...state,
        fileData: [
          ...state.fileData,
          {
            responseCode: action.payload.data.responseCode,
            responseMessage: action.payload.data.responseMessage,
            error: action.payload.data,
            fileName: action.payload.originalFileName,
          },
        ],
      };

    case ADD_FILE_FAILURE:
      return {
        ...state,
        fileData: [
          {
            responseCode: "",
            responseMessage: "",
            error: action.payload.error,
            fileName: action.payload.originalFileName,
          },
        ],
      };

    case ADD_FILE_RESET:
      return {
        ...state,
        fileData: [],
      };

    case SAVE_FILE_COMPLETE:
      return {
        ...state,
        updatedFile: [
          {
            //details: action.payload.data.status,
            error: undefined,
            //isUpdateCalled: true,
            isAuditUpdated: true,
          },
        ],
      };

    case UPDATE_FILE_COMPLETE:
      return {
        ...state,
        allFilesData: {
          list: state.allFilesData.list.map(item => item.id === action.payload.data.id ? {
            ...action.payload.data,
          }
            : item),
          totalElements: state.allFilesData.totalElements,
          totalPages: state.allFilesData.totalPages,
        },

        updatedFile: [
          {
            status: action.payload.data.status,
            termDate: action.payload.data.termDate,
            error: undefined,
            isUpdateCalled: true,
            isAuditUpdated: true,
            isDateUpdated: true,
          },
        ],
      };

    case UPDATE_FILE_ERROR:
      return {
        ...state,
        allFilesData: {
          list: state.allFilesData.list.map(item => item.id === action.payload.data.id ? {
            ...item,
            duplicateLetterName: true
          }
            : item),
          totalElements: state.allFilesData.totalElements,
          totalPages: state.allFilesData.totalPages,
        },

        updatedFile: [
          {
            status: "",
            termDate: "",
            isUpdateCalled: false,
            isAuditUpdated: false,
            isDateUpdated: false,
            error: action.payload,
          },
        ],
      };

    case UPDATE_FILE_FAILURE:
      return {
        ...state,
        updatedFile: [
          {
            status: "",
            termDate: "",
            isUpdateCalled: false,
            isAuditUpdated: false,
            isDateUpdated: false,
            error: action.payload,
          },
        ],
      };

    case UPDATE_FILES_COMPLETE:
      return {
        ...state,
        isLetterUpdated: true,
        // status: {
        //   ...action.payload,
        // },

        // updatedFiles: [
        //   {
        //     ...state.updatedFiles,
        //     details: action.payload.responseObject,
        //     error: undefined,
        //     isUpdateCalled: true,
        //   },
        // ],
      };

    case UPDATE_FILES_ERROR:
      return {
        ...state,
        isLetterUpdated: false,
        updatedFiles: [
          {
            details: "",
            isUpdateCalled: false,
            error: action.payload,
          },
        ],
      };

    case UPDATE_FILES_FAILURE:
      return {
        ...state,
        isLetterUpdated: false,
        updatedFiles: [
          {
            details: "",
            isUpdateCalled: false,
            error: action.payload,
          },
        ],
      };

    case DELETE_FILE_COMPLETE:
      return {
        ...state,
        isFileRemoved: true,
        // updatedFiles: [{
        //   details: action.payload.responseObject,
        //   error: undefined,
        // }],
      };

    case DELETE_FILE_ERROR:
      return {
        ...state,
        isFileRemoved: false,
      };

    case DELETE_FILE_FAILURE:
      return {
        ...state,
        isFileRemoved: false,
      };

    case FETCH_LETTERHTML_COMPLETE:
      return {
        ...state,
        htmlData: action.payload.html,
        InvalidTag: action.payload.invalidTagList,
        isReverted: action.payload.isReverted,
      };
    case FETCH_LETTERHTML_FAILURE:
      return {
        ...state,
        htmlData: "",
        InvalidTag: [],
        isReverted: false,
      };
    case FETCH_LETTERHTML_ERROR:
      return {
        ...state,
        htmlData: "",
        InvalidTag: [],
        isReverted: false,
      };

    case FETCH_REVERTHTML_COMPLETE:
      return {
        ...state,
        revertHtmlData: action.payload.html,
        isReverted: action.payload.isReverted,
      };
    case FETCH_REVERTHTML_FAILURE:
      return {
        ...state,
        revertHtmlData: "",
        isReverted: false,
      };
    case FETCH_REVERTHTML_ERROR:
      return {
        ...state,
        revertHtmlData: "",
        isReverted: false,
      };

    case UPDATE_LETTERDOC_COMPLETE:
      return {
        ...state,
        NewInvalidTag: action.payload.invalidTagList,
        isInvalid: true,
        isReverted: action.payload.isReverted
      };
    case UPDATE_LETTERDOC_FAILURE:
      return {
        ...state,
        NewInvalidTag: "",
        isInvalid: false,
        isReverted: false,
      };
    case UPDATE_LETTERDOC_ERROR:
      return {
        ...state,
        NewInvalidTag: "",
        isInvalid: false,
        isReverted: false,
      };

    case FETCH_METRICS_COMPLETE:
      return {
        ...state,
        matrixData: { ...action.payload },
      };

    case FETCH_METRICS_ERROR:
      return {
        ...state,
        matrixData: {},
      };

    case FETCH_METRICS_FAILURE:
      return {
        ...state,
        matrixData: {},
      };

    case FETCH_LETTERSTATUS_COMPLETE:
      return {
        ...state,
        letterStatus: { ...action.payload },
      };

    case FETCH_LETTERSTATUS_ERROR:
      return {
        ...state,
        letterStatus: {},
      };

    case FETCH_LETTERSTATUS_FAILURE:
      return {
        ...state,
        letterStatus: {},
      };

    case FETCH_AUTVSINT_COMPLETE:
      return {
        ...state,
        autVsInt: { ...action.payload },
      };

    case FETCH_AUTVSINT_ERROR:
      return {
        ...state,
        autVsInt: {},
      };

    case FETCH_AUTVSINT_FAILURE:
      return {
        ...state,
        autVsInt: {},
      };

    case FETCH_AUDIT_COMPLETE:
      return {
        ...state,
        auditDetails: action.payload,
        getError: "",
      };
    case FETCH_AUDIT_FAILURE:
      return {
        ...state,
        auditDetails: [],
        getError: action.payload,
      };
    case RESET_AUDIT:
      return {
        ...state,
        auditDetails: [],
        isAuditUpdated: false,
        getError: "",
      };
    case RESET_LETTERHTML:
      //console.log("Reset");
      return {
        ...state,
        htmlData: "",
        revertHtmlData: "",
        getError: "",
      };

    case RESET_LETTERAUDIT_IS_DONE:
      return {
        ...state,
        updatedFiles: [
          {
            isAuditUpdated: false,
          },
        ],
      };

    case RESET_LETTERDATE_IS_DONE:
      return {
        ...state,
        updatedFile: [
          {
            isDateUpdated: false,
          },
        ],
      };

    case RESET_INVALIDTAG:
      return {
        ...state,
        NewInvalidTag: "",
        isInvalid: false,
      };

    case RESET_LETTERUPDATE:
      return {
        ...state,
        isLetterUpdated: false,
      };



    default:
      return { ...state };
  }
};
