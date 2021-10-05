import {
  START_SPINNER_ACTION,
  SHOW_SNACKBAR_ACTION,
  // SHOW_MESSAGE_DIALOG,
  HIDE_MESSAGE_DIALOG,
} from "../utils/AppConstants";

import {
  DEFAULT_START_INDEX,
  DEFAULT_SORTBY,
  DEFAULT_PAGE_SIZE,
  FETCH_BUSINESSLINE_API_URL,
  FETCH_MODULES_API_URL,
  FETCH_COMPANIES_API_URL,
  FETCH_BUSINESSLINE_COMPLETE,
  FETCH_BUSINESSLINE_FAILURE,
  FETCH_MODULES_COMPLETE,
  FETCH_MODULES_FAILURE,
  FETCH_COMPANY_COMPLETE,
  FETCH_COMPANY_FAILURE,
  ADD_FILE_API_URL,
  DELETE_FILE_API_URL,
  ADD_FILE_COMPLETE,
  ADD_FILE_ERROR,
  ADD_FILE_FAILURE,
  ADD_FILE_RESET,
  UPDATE_FILE_API_URL,
  UPDATE_FILE_COMPLETE,
  UPDATE_FILE_ERROR,
  UPDATE_FILE_FAILURE,
  UPDATE_FILES_COMPLETE,
  UPDATE_FILES_ERROR,
  UPDATE_FILES_FAILURE,
  DELETE_FILE_COMPLETE,
  DELETE_FILE_ERROR,
  DELETE_FILE_FAILURE,
  FETCH_ALLFILES_API_URL,
  FETCH_ALLFILES_COMPLETE,
  FETCH_ALLFILES_FAILURE,
  FETCH_ALLFILES_ERROR,
  FETCH_STOPPED_API_URL,
  FETCH_STOPPED_COMPLETE,
  FETCH_STOPPED_FAILURE,
  FETCH_STOPPED_ERROR,
  DOWNLOAD_LETTER_API_URL,
  DOWNLOAD_LETTER_COMPLETE,
  DOWNLOAD_LETTER_FAILURE,
  DOWNLOAD_LETTER_ERROR,
  DOWNLOAD_LIBRARY_LETTER_COMPLETE,
  DOWNLOAD_LIBRARY_LETTER_FAILURE,
  DOWNLOAD_LIBRARY_LETTER_ERROR,
  FETCH_PROCESSING_API_URL,
  FETCH_PROCESSING_COMPLETE,
  // FETCH_PROCESSING_FAILURE,
  FETCH_PROCESSING_ERROR,
  UPDATE_PROCESSING_COMPLETE,
  UPDATE_PROCESSING_FAILURE,
  UPDATE_PROCESSING_ERROR,
  TAG_INDICATORS_API_URL,
  FETCH_INDICATORS_COMPLETE,
  FETCH_INDICATORS_FAILURE,
  FETCH_INDICATORS_ERROR,
  ADD_INDICATORS_COMPLETE,
  ADD_INDICATORS_FAILURE,
  ADD_INDICATORS_ERROR,
  DELETE_INDICATORS_COMPLETE,
  DELETE_INDICATORS_ERROR,
  DELETE_INDICATORS_FAILURE,
  UPDATE_INDICATORS_COMPLETE,
  UPDATE_INDICATORS_FAILURE,
  UPDATE_INDICATORS_ERROR,
  FETCH_INDICATORBYID_COMPLETE,
  FETCH_INDICATORBYID_FAILURE,
  DOCTOHTML_API_URL,
  HTMLTODOC_API_URL,
  FETCH_LETTERHTML_COMPLETE,
  FETCH_LETTERHTML_FAILURE,
  FETCH_LETTERHTML_ERROR,
  UPDATE_LETTERDOC_COMPLETE,
  UPDATE_LETTERDOC_FAILURE,
  UPDATE_LETTERDOC_ERROR,
  LETTER_COMMENT_API_URL,
  SAVE_FILE_COMPLETE,
  LETTER_LIRARY_API_URL,
  FETCH_LIBRARY_COMPLETE,
  FETCH_LIBRARY_FAILURE,
  FETCH_LIBRARY_ERROR,
  LETTER_AUDIT_API_URL,
  FETCH_AUDIT_COMPLETE,
  FETCH_AUDIT_FAILURE,
  FETCH_FILE_COMPLETE,
  FETCH_FILE_FAILURE,
  FETCH_FILE_ERROR,
  RESET_LETTERHTML,
  LETTER_TYPE_API_URL,
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
  LETTER_MATRIX_API_URL,
  LETTER_LETTERSTATUS_API_URL,
  FETCH_LETTERSTATUS_COMPLETE,
  FETCH_LETTERSTATUS_FAILURE,
  FETCH_LETTERSTATUS_ERROR,
  LETTER_AUTVSINT_API_URL,
  FETCH_AUTVSINT_COMPLETE,
  FETCH_AUTVSINT_FAILURE,
  FETCH_AUTVSINT_ERROR,
  LETTER_FETCHLOBS_BYCOMPID_API_URL,
  FETCH_LOBBYCOMPID_COMPLETE,
  FETCH_LOBBYCOMPID_FAILURE,
  UPLOAD_FILE_API_URL,
  UPLOAD_FILE_COMPLETE,
  UPLOAD_FILE_ERROR,
  UPLOAD_FILE_FAILURE,
  // UPDATE_PROCESSING_STATUS,
} from "../utils/LettersAppConstant";

import {
  RESET_UPDATE_ERROR,
  RESET_DUPLICATE_ERROR,
} from "../utils/AppConstants";

import {
  DEFAULT_ERROR_MSG,
  handleTagTerm,
  handleUpdateTag,
  ERROR_MESSAGE,
  handleProcessLetter,
} from "../utils/Messages";
import { setRequestHeader, stopLoading } from "../utils/helpers";

export const fetchBusinessByClientId = (clientId) => {
  let apiUrl = FETCH_BUSINESSLINE_API_URL + "?&clientId=" + clientId;
  return (dispatch) => {
    //dispatch({ type: RESET_ADD_CLIENT });
    return fetch(apiUrl, {
      method: "get",
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            dispatch({
              type: FETCH_BUSINESSLINE_COMPLETE,
              payload: data.responseObject,
            });
          } else {
            dispatch({ type: FETCH_BUSINESSLINE_FAILURE, payload: data });
          }
          //stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_BUSINESSLINE_FAILURE, payload: error });
          //stopLoading(dispatch);
        }
      );
  };
};

export const fetchModulesByClientId = (clientId) => {
  let apiUrl = FETCH_MODULES_API_URL + "?&clientId=" + clientId;
  return (dispatch) => {
    //dispatch({ type: RESET_ADD_CLIENT });
    return fetch(apiUrl, {
      method: "get",
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            dispatch({
              type: FETCH_MODULES_COMPLETE,
              payload: data.responseObject,
            });
          } else {
            dispatch({ type: FETCH_MODULES_FAILURE, payload: data });
          }
        },
        (error) => {
          dispatch({ type: FETCH_MODULES_FAILURE, payload: error });
        }
      );
  };
};

export const fetchCompanyByClientId = (clientId) => {
  let apiUrl = FETCH_COMPANIES_API_URL + "?&clientId=" + clientId;
  return (dispatch) => {
    //dispatch({ type: RESET_ADD_CLIENT });
    return fetch(apiUrl, {
      method: "get",
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            dispatch({
              type: FETCH_COMPANY_COMPLETE,
              payload: data.responseObject,
            });
          } else {
            dispatch({ type: FETCH_COMPANY_FAILURE, payload: data });
          }
        },
        (error) => {
          dispatch({ type: FETCH_COMPANY_FAILURE, payload: error });
        }
      );
  };
};

export const fetchAttachments = (clientId, letterType, status) => {
  let apiUrl =
    LETTER_TYPE_API_URL + "?&clientId=" + clientId + "&type=" + letterType + "&status=" + status;
  return (dispatch) => {
    //dispatch({ type: RESET_ADD_CLIENT }); /lat/letters/type/clientId=21&type="ATTACHMENT"
    return fetch(apiUrl, {
      method: "get",
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            dispatch({
              type: FETCH_ATTACHMENT_COMPLETE,
              payload: data.responseObject,
            });
          } else {
            dispatch({ type: FETCH_ATTACHMENT_FAILURE, payload: data });
          }
          //stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_ATTACHMENT_FAILURE, payload: error });
          //stopLoading(dispatch);
        }
      );
  };
};

export const fetchCoverSheets = (clientId, letterType, status) => {
  let apiUrl =
    LETTER_TYPE_API_URL + "?&clientId=" + clientId + "&type=" + letterType + "&status=" + status;
  return (dispatch) => {
    //dispatch({ type: RESET_ADD_CLIENT });
    return fetch(apiUrl, {
      method: "get",
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            dispatch({
              type: FETCH_COVERSHEET_COMPLETE,
              payload: data.responseObject,
            });
          } else {
            dispatch({ type: FETCH_COVERSHEET_FAILURE, payload: data });
          }
          //stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_COVERSHEET_FAILURE, payload: error });
          //stopLoading(dispatch);
        }
      );
  };
};

export const addFiles = (fileDetails, clientId, increment) => {
  return (dispatch) => {
    let apiUrl = ADD_FILE_API_URL + "?clientId=" + clientId;
    return fetch(apiUrl, {
      method: "post",
      body: JSON.stringify({ ...fileDetails }),
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "201" || data.responseCode === 201)
          ) {
            dispatch({
              type: ADD_FILE_COMPLETE,
              payload: { data, originalFileName: fileDetails.originalFileName },
            });
            increment();
          } else if (
            data.responseCode === "2032" ||
            data.responseCode === 2032
          ) {
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: "Module doesn't exist in database.",
                severity: "error",
              },
            });
            stopLoading(dispatch);
          } else {
            dispatch({
              type: ADD_FILE_ERROR,
              payload: { data, originalFileName: fileDetails.originalFileName },
            });
            increment();
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({
            type: ADD_FILE_FAILURE,
            payload: { error, originalFileName: fileDetails.originalFileName },
          });
          increment();
        }
      );
  };
};

export const addFilesReset = () => (dispatch) => {
  dispatch({ type: ADD_FILE_RESET });
};

export const deleteFiles = (filesId, clientId) => {
  let apiUrl = DELETE_FILE_API_URL;
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(apiUrl, {
      method: "delete",
      body: JSON.stringify(filesId),
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            dispatch({
              type: DELETE_FILE_COMPLETE,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: "All selected files removed",
              },
            });
            // dispatch(
            //   fetchFiles(
            //     DEFAULT_START_INDEX,
            //     DEFAULT_PAGE_SIZE,
            //     DEFAULT_SORTBY,
            //     clientId
            //   )
            // );
          } else {
            dispatch({ type: DELETE_FILE_ERROR, payload: data });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: data.reponseMessage,
              },
            });
          }
          stopLoading(dispatch);
          dispatch({ type: HIDE_MESSAGE_DIALOG, payload: undefined });
        },
        (error) => {
          dispatch({ type: DELETE_FILE_FAILURE, payload: error });
          stopLoading(dispatch);
          dispatch({ type: HIDE_MESSAGE_DIALOG, payload: undefined });
          dispatch({
            type: SHOW_SNACKBAR_ACTION,
            payload: {
              detail: error.message,
            },
          });
        }
      );
  };
};

//Letter Editor get api..
export const fetchFileByLetterId = (letterId, letterStage) => {
  let API_URL = FETCH_ALLFILES_API_URL + "/" + letterId;

  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(API_URL, {
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            dispatch({
              type: FETCH_FILE_COMPLETE,
              payload: data.responseObject,
            });
            dispatch(fetchLetterHTML(letterId, letterStage));
          } else {
            dispatch({
              type: FETCH_FILE_ERROR,
              payload: data ? data : { message: DEFAULT_ERROR_MSG },
            });
          }

          // stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_FILE_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};


export const downloadOriginalFile = (letterId) => {
  let API_URL = DOWNLOAD_LETTER_API_URL + letterId + "?docType=";
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(API_URL, {
      headers: setRequestHeader("doc"),
    })
      .then((response) => response.blob())
      .then(
        (data) => {
          const url = window.URL.createObjectURL(
            new Blob([data], { type: 'application/octet-stream' }),
          );
          dispatch({
            type: DOWNLOAD_LETTER_COMPLETE,
            payload: url,
          });

          // stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: DOWNLOAD_LETTER_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const downloadLibraryFile = (letterId) => {
  let API_URL = DOWNLOAD_LETTER_API_URL + letterId + "?docType=library";
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(API_URL, {
      headers: setRequestHeader("doc"),
    })
      .then((response) => response.blob())
      .then(
        (data) => {
          const url = window.URL.createObjectURL(
            new Blob([data], { type: 'application/octet-stream' }),
          );

          dispatch({
            type: DOWNLOAD_LIBRARY_LETTER_COMPLETE,
            payload: url,
          });


          // stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: DOWNLOAD_LIBRARY_LETTER_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchFiles = (
  startIndex,
  pageSize,
  sorting,
  clientId,
  search,
  filterBy
) => {
  let API_URL = FETCH_ALLFILES_API_URL;
  if (pageSize >= 0)
    API_URL =
      API_URL +
      "?clientId=" +
      clientId +
      "&startIndex=" +
      startIndex +
      "&pageSize=" +
      pageSize +
      "&search=" +
      search +
      //search.trim() +
      "&filterBy=" +
      filterBy;

  if (sorting) API_URL = API_URL + "&sortBy=" + sorting;
  if (filterBy) API_URL = API_URL + "?filterBy=" + filterBy;
  return (dispatch) => {
    if (startIndex >= 10 || pageSize >= 25) {
      dispatch({ type: START_SPINNER_ACTION });
    }

    return fetch(API_URL, {
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            dispatch({
              type: FETCH_ALLFILES_COMPLETE,
              payload: {
                filesInfo: data,
                startIndex: startIndex,
                pageSize: pageSize,
              },
            });
          } else {
            dispatch({
              type: FETCH_ALLFILES_ERROR,
              payload: data ? data : { message: DEFAULT_ERROR_MSG },
            });
          }

          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_ALLFILES_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchLibraryFiles = (
  startIndex,
  pageSize,
  sorting,
  filter,
  search,
  clientId
) => {
  let API_URL = LETTER_LIRARY_API_URL;
  if (pageSize)
    API_URL =
      API_URL +
      "?clientId=" +
      clientId +
      "&startIndex=" +
      startIndex +
      "&pageSize=" +
      pageSize;
  if (sorting) API_URL = API_URL + "&sortBy=" + sorting;
  if (filter) API_URL = API_URL + "&filterBy=" + filter + "&search=" + search;
  return (dispatch) => {
    if (startIndex >= 10 || pageSize >= 25) {
      dispatch({ type: START_SPINNER_ACTION });
    }

    return fetch(API_URL, {
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            // data.responseObject.users &&
            //   data.responseObject.users.sort((a, b) =>
            //     a.last_login_time > b.last_login_time ? -1 : 1
            //   );
            dispatch({
              type: FETCH_LIBRARY_COMPLETE,
              payload: {
                filesInfo: data,
                startIndex: startIndex,
                pageSize: pageSize,
              },
            });
          } else {
            dispatch({
              type: FETCH_LIBRARY_ERROR,
              payload: data ? data : { message: DEFAULT_ERROR_MSG },
            });
          }

          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_LIBRARY_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchStoppedFiles = (startIndex, pageSize, sorting, clientId, refresh) => {
  let API_URL = FETCH_STOPPED_API_URL;
  if (pageSize)
    API_URL =
      API_URL +
      "?clientId=" +
      clientId +
      "&startIndex=" +
      startIndex +
      "&pageSize=" +
      pageSize;
  //if (filter) API_URL = API_URL + "&filterby=" + filter;
  if (sorting) API_URL = API_URL + "&sortBy=" + sorting;
  return (dispatch) => {
    if (refresh || (startIndex >= 10 || pageSize >= 25)) {
      dispatch({ type: START_SPINNER_ACTION });
    }

    return fetch(API_URL, {
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            dispatch({
              type: FETCH_STOPPED_COMPLETE,
              payload: {
                filesInfo: data,
                startIndex: startIndex,
                pageSize: pageSize,
              },
            });
          } else {
            dispatch({
              type: FETCH_STOPPED_ERROR,
              payload: data ? data : { message: DEFAULT_ERROR_MSG },
            });
          }

          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_STOPPED_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

// export const fetchProcessingFiles = (
//   startIndex,
//   pageSize,
//   sorting,
//   clientId
// ) => {
//   let API_URL = FETCH_PROCESSING_API_URL;
//   if (pageSize)
//     API_URL =
//       API_URL +
//       "?clientId=" +
//       clientId +
//       "&startIndex=" +
//       startIndex +
//       "&pageSize=" +
//       pageSize;
//   //if (filter) API_URL = API_URL + "&filterby=" + filter;
//   if (sorting) API_URL = API_URL + "&sortBy=" + sorting;
//   let eventSource = null;
//   return (dispatch) => {
//     if (startIndex >= 10 || pageSize>=25) {
//       dispatch({ type: START_SPINNER_ACTION });
//     }
//     return fetch(API_URL, {
//       headers: setRequestHeader(),
//     })
//       .then((response) => JSON.parse(response))
//       .then(
//         (data) => {
//           if (
//             data
//             //&& (data.responseCode === "200" || data.responseCode === 200)
//           )
//           {
//             dispatch({
//               type: FETCH_PROCESSING_COMPLETE,
//               payload: {
//                 filesInfo: data,
//                 startIndex: startIndex,
//                 pageSize: pageSize,
//               },
//             });

//             eventSource = new EventSource(`${API_URL}}`);
//             eventSource.onopen = (event) => {
//               console.log("connection opened")
//             }
//             eventSource.onmessage = e => {
//             //   dispatch({
//             //     type: UPDATE_PROCESSING_STATUS,
//             //     palyload: e.data,
//             // })
//             dispatch({
//               type: FETCH_PROCESSING_COMPLETE,
//               payload: {
//                 filesInfo: data,
//                 startIndex: startIndex,
//                 pageSize: pageSize,
//               },
//             });
//           }
//           } else {
//             dispatch({
//               type: FETCH_PROCESSING_ERROR,
//               payload: data ? data : { message: DEFAULT_ERROR_MSG },
//             });
//           }

//           stopLoading(dispatch);
//         },
//         (error) => {
//           dispatch({ type: FETCH_PROCESSING_FAILURE, payload: error });
//           stopLoading(dispatch);
//         }
//       );
//   };
// };

export const fetchProcessingFiles = (
  startIndex,
  pageSize,
  sorting,
  clientId
) => {
  let API_URL = FETCH_PROCESSING_API_URL;
  if (pageSize)
    API_URL =
      API_URL +
      "?clientId=" +
      clientId +
      "&startIndex=" +
      startIndex +
      "&pageSize=" +
      pageSize;
  if (sorting) API_URL = API_URL + "&sortBy=" + sorting;
  var eventSource = new EventSource(`${API_URL}`),
    data;
  eventSource.onopen = (event) => {
    console.log("connection opened");
  };

  return (dispatch) => {
    if (startIndex >= 10 || pageSize >= 25) {
      dispatch({ type: START_SPINNER_ACTION });
    }

    eventSource.onmessage = (event) => {
      data = JSON.parse(event.data);
      console.log("result", data.responseObject.processingLetters);
      // setData(old => [...old, data.responseObject.processingLetters])
      if (data.responseObject.processingLetters.length === 0) {
        eventSource.close();
        console.log("final eventsource closed");
        dispatch(
          fetchStoppedFiles(
            0,
            10,
            "id",
            clientId
          )
        );
      }

      if (data && data.responseCode === "200") {
        dispatch({
          type: FETCH_PROCESSING_COMPLETE,
          payload: {
            filesInfo: data,
            startIndex: startIndex,
            pageSize: pageSize,
          },
        });
      } else {
        dispatch({
          type: FETCH_PROCESSING_ERROR,
          payload: data ? data : { message: DEFAULT_ERROR_MSG },
        });
      }
    };
    eventSource.onerror = (event) => {
      console.log(event.target.readyState);
      if (event.target.readyState === EventSource.CLOSED) {
        console.log("eventsource closed (" + event.target.readyState + ")");
        eventSource.close();
        console.log("eventsource closed on error");
      }

    };

    // eventSource.close();
    // console.log("final eventsource closed");
    stopLoading(dispatch);
  };
};

export const updateFile = (formData, { name, value }) => {
  return (dispatch) => {
    //dispatch({ type: START_SPINNER_ACTION });
    return fetch(UPDATE_FILE_API_URL, {
      method: "put",
      body: JSON.stringify(formData),
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            dispatch({
              type: UPDATE_FILE_COMPLETE,
              payload: {
                // ...formData[0],
                data: data.responseObject[0],
                message: data.responseMessage,
                name,
                value,
              },
            });

            //stopLoading(dispatch);
          }
          else if (
            data.responseCode === "2211" ||
            data.responseCode === "2212"
          ) {

            stopLoading(dispatch);
          }
          else {
            dispatch({
              type: UPDATE_FILE_ERROR,
              payload: { data: { ...data, id: formData[0].id } },
            });

          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: UPDATE_FILE_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const updateFiles = (formData, clientId, updateLetterName) => {
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(UPDATE_FILE_API_URL, {
      method: "put",
      body: JSON.stringify(formData),
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            if (updateLetterName === true) {
              dispatch({ type: UPDATE_FILES_COMPLETE, payload: data });
            }
            else if (updateLetterName === "automation") {
              dispatch({
                type: SHOW_SNACKBAR_ACTION,
                payload: {
                  detail: "Letters saved successfully",
                },
              });
            }
            else {
              dispatch(
                fetchLibraryFiles(
                  DEFAULT_START_INDEX,
                  DEFAULT_PAGE_SIZE,
                  DEFAULT_SORTBY,
                  "",
                  "",
                  clientId
                )
              );
              stopLoading(dispatch);
              dispatch({
                type: SHOW_SNACKBAR_ACTION,
                payload: {
                  detail: "All selected files mass configured successfully",
                },
              });
            }

          } else {
            dispatch({
              type: UPDATE_FILES_ERROR,
              payload: data ? data : { message: data.responseMessage },
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: data.responseMessage,
                severity: "error",
              },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: UPDATE_FILES_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

// processing files from Ready to Processing stage...
export const updateProcessingFiles = (filesId, clientId) => {
  let apiUrl = FETCH_PROCESSING_API_URL;
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(apiUrl, {
      method: "put",
      body: JSON.stringify(filesId),
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            dispatch({
              type: UPDATE_PROCESSING_COMPLETE,
              payload: {
                resPonseData: data,
              },
            });
            // dispatch(
            //   fetchFiles(
            //     DEFAULT_START_INDEX,
            //     DEFAULT_PAGE_SIZE,
            //     DEFAULT_SORTBY,
            //     clientId
            //   )
            // );
            stopLoading(dispatch);

            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleProcessLetter(data.responseObject).message,
                severity: handleProcessLetter(data.responseObject).messageType,
              },
              // payload: {
              //   detail: "All selected files imported successfully",
              // },
            });
          } else {
            dispatch({ type: UPDATE_PROCESSING_ERROR, payload: data });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: ERROR_MESSAGE,
                severity: "error",
              },
            });
          }
          stopLoading(dispatch);
          dispatch({ type: HIDE_MESSAGE_DIALOG, payload: undefined });
        },
        (error) => {
          dispatch({ type: UPDATE_PROCESSING_FAILURE, payload: error });
          stopLoading(dispatch);
          dispatch({ type: HIDE_MESSAGE_DIALOG, payload: undefined });
          dispatch({
            type: SHOW_SNACKBAR_ACTION,
            payload: {
              detail: ERROR_MESSAGE,
              severity: "error",
            },
          });
        }
      );
  };
};

export const fetchIndicators = (startIndex, pageSize, sorting, search) => {
  let API_URL = TAG_INDICATORS_API_URL,
    apiUrl = "";
  if (pageSize)
    apiUrl = API_URL + "?startIndex=" + startIndex + "&pageSize=" + pageSize;
  //if (filter) API_URL = API_URL + "&filterby=" + filter;
  if (sorting) apiUrl = API_URL + "&sortBy=" + sorting;
  if (search)
    apiUrl =
      API_URL +
      "?startIndex=" +
      startIndex +
      "&pageSize=" +
      pageSize +
      "&search=" +
      search.trim();
  if (!search && pageSize)
    apiUrl = API_URL + "?startIndex=" + startIndex + "&pageSize=" + pageSize;
  return (dispatch) => {
    if (startIndex >= 10 || pageSize >= 25) {
      dispatch({ type: START_SPINNER_ACTION });
    }

    return fetch(apiUrl, {
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            dispatch({
              type: FETCH_INDICATORS_COMPLETE,
              payload: {
                filesInfo: data.responseObject.letterTags,
                pageInfo: data.responseObject,
                startIndex: startIndex,
                pageSize: pageSize,
              },
            });
          } else {
            dispatch({
              type: FETCH_INDICATORS_ERROR,
              payload: data ? data : { message: DEFAULT_ERROR_MSG },
            });
          }

          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_INDICATORS_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchIndicatorsById = (id) => {
  let API_URL = TAG_INDICATORS_API_URL + "/" + id;
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(API_URL, {
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            dispatch({
              type: FETCH_INDICATORBYID_COMPLETE,
              payload: data.responseObject,
            });
          } else {
            dispatch({
              type: FETCH_INDICATORBYID_FAILURE,
              payload: data,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: ERROR_MESSAGE,
                severity: "error",
              },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_INDICATORBYID_FAILURE, payload: error });
          dispatch({
            type: SHOW_SNACKBAR_ACTION,
            payload: {
              detail: ERROR_MESSAGE,
              severity: "error",
            },
          });
          stopLoading(dispatch);
        }
      );
  };
};

export const addIndicators = (fromObj) => {
  let formData = {
    name: "<" + fromObj.tagName.trim() + ">",
    fieldId: fromObj.tagField.trim(),
    description: fromObj.description,
    tagType: fromObj.tagType,
  };
  return (dispatch) => {
    let apiUrl = TAG_INDICATORS_API_URL;
    return fetch(apiUrl, {
      method: "post",
      body: JSON.stringify(formData),
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            dispatch({
              type: ADD_INDICATORS_COMPLETE,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: `Tag ${formData.name} successfully added.`,
                severity: "success",
              },
            });
          } else {
            dispatch({ type: ADD_INDICATORS_ERROR, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({
            type: ADD_INDICATORS_FAILURE,
            payload: error,
          });
          stopLoading(dispatch);
        }
      );
  };
};

export const updateIndicators = (Id, frmData) => {
  let formData = {
    id: Id,
    name: "<" + frmData.tagName.trim() + ">",
    fieldId: frmData.tagField.trim(),
    description: frmData.description,
    tagType: frmData.tagType,
  };
  let apiUrl = TAG_INDICATORS_API_URL;
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(apiUrl, {
      method: "put",
      body: JSON.stringify(formData),
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            dispatch({ type: UPDATE_INDICATORS_COMPLETE, payload: data });
            // stopLoading(dispatch);
            // dispatch(
            //   fetchFiles(DEFAULT_START_INDEX, DEFAULT_PAGE_SIZE, DEFAULT_SORTBY)
            // );
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleUpdateTag(formData.name, data.responseCode)
                  .message,
                severity: handleUpdateTag(formData.name, data.responseCode)
                  .messageType,
              },
            });
          } else {
            dispatch({
              type: UPDATE_INDICATORS_ERROR,
              payload: data ? data : { message: data.responseMessage },
            });
            // dispatch({
            //   type: SHOW_SNACKBAR_ACTION,
            //   payload: {
            //     detail: data.responseMessage,
            //     severity: "error",
            //   },
            // });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: UPDATE_INDICATORS_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const deleteIndicators = (tagId, tagName) => {
  let apiUrl = TAG_INDICATORS_API_URL + "/" + tagId;
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(apiUrl, {
      method: "delete",
      body: JSON.stringify(tagId),
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "2218" || data.responseCode === 2218)
          ) {
            dispatch({
              type: DELETE_INDICATORS_COMPLETE,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: "Tag " + tagName + " successfully termed.",
                severity: "success",
              },
            });
            // dispatch(
            //   fetchFiles(DEFAULT_START_INDEX, DEFAULT_PAGE_SIZE, DEFAULT_SORTBY)
            // );
          } else {
            dispatch({ type: DELETE_INDICATORS_ERROR, payload: data });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: handleTagTerm(tagName, data.responseCode).message,
                severity: handleTagTerm(tagName, data.responseCode).messageType,
              },
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: data.reponseMessage,
              },
            });
          }
          stopLoading(dispatch);
          dispatch({ type: HIDE_MESSAGE_DIALOG, payload: undefined });
        },
        (error) => {
          dispatch({ type: DELETE_INDICATORS_FAILURE, payload: error });
          stopLoading(dispatch);
          dispatch({ type: HIDE_MESSAGE_DIALOG, payload: undefined });
          dispatch({
            type: SHOW_SNACKBAR_ACTION,
            payload: {
              detail: error.message,
            },
          });
        }
      );
  };
};

export const resetDuplicateError = () => {
  return {
    type: RESET_DUPLICATE_ERROR,
    payload: undefined,
  };
};

export const resetUpdateError = () => {
  return {
    type: RESET_UPDATE_ERROR,
    payload: undefined,
  };
};

export const fetchLetterHTML = (Id, letterStage) => {
  let apiUrl = `${DOCTOHTML_API_URL}${Id}/details?doc_type=`;
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(apiUrl, {
      method: "get",
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            dispatch({ type: RESET_LETTERHTML });
            dispatch({
              type: FETCH_LETTERHTML_COMPLETE,
              payload: data.responseObject,
            });
          } else {
            dispatch({ type: FETCH_LETTERHTML_ERROR, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_LETTERHTML_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchRevertHTML = (Id) => {
  let apiUrl = `${DOCTOHTML_API_URL}${Id}/revert`;
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(apiUrl, {
      method: "put",
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            //dispatch({ type: RESET_LETTERHTML });
            dispatch({
              type: FETCH_REVERTHTML_COMPLETE,
              payload: data.responseObject,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: "Document reverted successfully",
              },
            });
          } else {
            dispatch({ type: FETCH_REVERTHTML_ERROR, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_REVERTHTML_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const updateLetterDoc = (Id, htmlData) => {
  let apiUrl = HTMLTODOC_API_URL;
  let formatData = {
    id: Id,
    html: htmlData,
  };

  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });

    return fetch(apiUrl, {
      method: "put",
      body: JSON.stringify(formatData),
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            if (data.responseObject.invalidTagList.length === 0) {
              dispatch({
                type: SHOW_SNACKBAR_ACTION,
                payload: {
                  detail: "Letter saved successfully.",
                  severity: "success",
                },
              });
            } else {
              dispatch({ type: UPDATE_LETTERDOC_COMPLETE, payload: data.responseObject });
            }
            //stopLoading(dispatch);
          } else {
            dispatch({
              type: UPDATE_LETTERDOC_ERROR,
              payload: data ? data : { message: data.responseMessage },
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: data.responseMessage,
                severity: "error",
              },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: UPDATE_LETTERDOC_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const saveComment = (Id, Comment) => {
  let apiUrl = LETTER_COMMENT_API_URL;
  let formatData = {
    id: Id,
    comment: Comment,
  };
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(apiUrl, {
      method: "put",
      body: JSON.stringify(formatData),
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            dispatch({ type: SAVE_FILE_COMPLETE, payload: data });

            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: "Comment saved successfully",
                severity: "success",
              },
            });
            stopLoading(dispatch);
          } else {
            dispatch({
              type: UPDATE_FILE_ERROR,
              payload: data ? data : { message: data.responseMessage },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: UPDATE_FILE_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchAudit = (letterId) => {
  let API_URL = LETTER_AUDIT_API_URL + "?letterId=" + letterId;

  return (dispatch) => {
    //dispatch({ type: START_SPINNER_ACTION });
    return fetch(API_URL, {
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            data.responseObject.letterAudits.sort((a, b) =>
              new Date(a.updatedDate) < new Date(b.updatedDate) ? 1 : -1
            );
            dispatch({
              type: FETCH_AUDIT_COMPLETE,
              payload: data.responseObject.letterAudits,
            });
          } else {
            dispatch({ type: FETCH_AUDIT_FAILURE, payload: data });
          }
          //stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_AUDIT_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchMetricsByClientId = (clientId) => {
  let apiUrl = LETTER_MATRIX_API_URL + "?client_id=" + clientId;
  return (dispatch) => {
    //dispatch({ type: START_SPINNER_ACTION });
    return fetch(apiUrl, {
      method: "get",
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            dispatch({
              type: FETCH_METRICS_COMPLETE,
              payload: data.responseObject,
            });
          } else {
            dispatch({ type: FETCH_METRICS_ERROR, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_METRICS_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchLetStatusByClientId = (clientId) => {
  let apiUrl = LETTER_LETTERSTATUS_API_URL + "?client_id=" + clientId;
  return (dispatch) => {
    //dispatch({ type: START_SPINNER_ACTION });
    return fetch(apiUrl, {
      method: "get",
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            dispatch({
              type: FETCH_LETTERSTATUS_COMPLETE,
              payload: data.responseObject,
            });
          } else {
            dispatch({ type: FETCH_LETTERSTATUS_ERROR, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_LETTERSTATUS_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchLetAutVsIntClientId = (clientId) => {
  let apiUrl = LETTER_AUTVSINT_API_URL + "?client_id=" + clientId;
  return (dispatch) => {
    //dispatch({ type: START_SPINNER_ACTION });
    return fetch(apiUrl, {
      method: "get",
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            dispatch({
              type: FETCH_AUTVSINT_COMPLETE,
              payload: data.responseObject,
            });
          } else {
            dispatch({ type: FETCH_AUTVSINT_ERROR, payload: data });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_AUTVSINT_FAILURE, payload: error });
          stopLoading(dispatch);
        }
      );
  };
};

export const fetchLobsByCompId = (id, clientId, itemId) => {
  let API_URL =
    LETTER_FETCHLOBS_BYCOMPID_API_URL +
    "?companyDescription=" +
    id +
    "&clientId=" +
    clientId;
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(API_URL, {
      headers: setRequestHeader(),
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            dispatch({
              type: FETCH_LOBBYCOMPID_COMPLETE,
              payload: { [itemId]: data.responseObject },
            });
          }
          else if (
            data.responseCode === "2211" ||
            data.responseCode === "2212"
          ) {

            stopLoading(dispatch);
          }
          else {
            dispatch({
              type: FETCH_LOBBYCOMPID_FAILURE,
              payload: data,
            });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: ERROR_MESSAGE,
                severity: "error",
              },
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: FETCH_LOBBYCOMPID_FAILURE, payload: error });
          dispatch({
            type: SHOW_SNACKBAR_ACTION,
            payload: {
              detail: ERROR_MESSAGE,
              severity: "error",
            },
          });
          stopLoading(dispatch);
        }
      );
  };
};

export const uploadFiles = (arrFiles, clientId) => {
  const formData = new FormData();
  formData.append("file", arrFiles);
  formData.append("clientId", clientId);
  return (dispatch) => {
    dispatch({ type: START_SPINNER_ACTION });
    return fetch(UPLOAD_FILE_API_URL, {
      method: "post",
      body: formData,
      headers: {
        ...setRequestHeader("upload"),
      },
    })
      .then((response) => response.json())
      .then(
        (data) => {
          if (
            data &&
            (data.responseCode === "200" || data.responseCode === 200)
          ) {
            dispatch({ type: UPLOAD_FILE_COMPLETE });
            dispatch({
              type: SHOW_SNACKBAR_ACTION,
              payload: {
                detail: "Files successfully uploaded.",
                severity: "success",
              },
            });
          } else {
            dispatch({
              type: UPLOAD_FILE_ERROR,
              payload: data,
            });
          }
          stopLoading(dispatch);
        },
        (error) => {
          dispatch({ type: UPLOAD_FILE_FAILURE, payload: error });
          dispatch({
            type: SHOW_SNACKBAR_ACTION,
            payload: {
              detail: "An error occurred. Please try again later.",
              severity: "error",
            },
          });
          stopLoading(dispatch);
        }
      );
  };
};
