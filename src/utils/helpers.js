// import { LOCAL_ACCESS_TOKEN } from "./AppConstants";
import { STOP_SPINNER_ACTION, USER_LOGGED_OUT } from "./AppConstants";
import { showMessageDialog } from "../actions/MessageDialogActions";
// import { refresh } from "../../src/actions/LoginActions";
import jwtDecode from "jwt-decode";

export const getUserProfileInfo = () => {
  let loggedInInfo = getLocalStorageData();
  return jwtDecode(loggedInInfo.access_token); //local VDI
  //return jwtDecode(loggedInInfo.id_token); // UAT
};

export const saveDataInLocalStorage = (data) => {
  let userData = data.responseObject;
  localStorage.setItem("idToken", userData.id_token);
  localStorage.setItem("id_token", userData.id_token);
  localStorage.setItem("access_token", userData.access_token);
  localStorage.setItem("refresh_token", userData.refresh_token);
  localStorage.setItem("user_type", userData.user_type);
  // localStorage.setItem("expires_in", userData.expires_in);
};

export const updateAccessToken = (data) => {
  let userData = data.responseObject;
  localStorage.setItem("access_token", userData.access_token);
};

export const getLocalStorageData = () => {
  let data = {};
  if (localStorage.length > 0) {
    data = {
      idToken: localStorage.getItem("idToken"),
      id_token: localStorage.getItem("id_token"),
      access_token: localStorage.getItem("access_token"),
      refresh_token: localStorage.getItem("refresh_token"),
    };
  }
  return data;
};

export const setLoginAndRefreshTokenRequestHeader = () => {
  let headerObj = {};
  headerObj["Content-Type"] = "application/json";
  headerObj["Accept"] = "application/json";
  console.log("first time login or refresh token api is calling.");
  return headerObj;
}

export const setRequestHeader = (type) => {
  let headerObj = {};
  let loggedInInfo = getLocalStorageData();
  if (type !== "upload") {
    headerObj["Content-Type"] = "application/json";
    headerObj["Accept"] = "application/json";
  }
  if (type === "doc") {
    headerObj["Content-Type"] = "application/msword";
    headerObj["Accept"] = "application/msword";
  }

  // try {
  //   let token = loggedInInfo.access_token;
  //   const { exp } = jwtDecode(token);
  //   // valid token format
  //   const expirationTime = (exp * 1000) - 60000
  //   // Refresh the token a minute early to avoid latency issues
  //   if (token && (Date.now() >= expirationTime)) {
  //     console.log("Token expired. calling refresh token api....");
  //     const refreshToken = localStorage.getItem("refresh_token");
  //     refresh(refreshToken)?.then((accessToken) => {
  //       console.log("new access token: ", accessToken);
  //       if (accessToken) {
  //         headerObj.Authorization = `Bearer ${accessToken}`;
  //         localStorage.setItem("access_token", accessToken);
  //         return headerObj;
  //       } else {
  //         throw new Error("session expired.")
  //       }

  //     }).catch((err) => {
  //       console.log("getting refresh token api error", err);
  //       window.location.href = "https://mhk-cmt.auth.ap-south-1.amazoncognito.com/logout?client_id=aadlq5t84gijincd43k71kgnn&response_type=code&scope=email+openid+aws.cognito.signin.user.admin&redirect_uri=http://localhost:3000/login/oauth2/code/cognito";

  //     });

  //   } else {
  //     console.log("Valid token");
  //     headerObj.Authorization = `Bearer ${loggedInInfo.access_token}`;
  //   }
  // } catch (error) {
  //   // invalid token format
  //   console.log("invalid token format")
  // }

  if (loggedInInfo.access_token) {
    //console.log("token checking ");
    headerObj.Authorization = `Bearer ${loggedInInfo.access_token}`;
  }
  return headerObj;
};

export const isDecimal = (n) => (n - Math.floor(n)) !== 0;

export function formatDate(inputDate) {
  if (inputDate) {
    let d = new Date(inputDate);
    let dd = (d.getDate() < 10 ? "0" : "") + d.getDate();
    var MM = (d.getMonth() + 1 < 10 ? "0" : "") + (d.getMonth() + 1);
    let formattedDate =
      MM +
      "/" +
      dd +
      "/" +
      d.getFullYear() +
      " " +
      d.toString().split(" ")[4].substring(0, 5);
    return formattedDate;
  }
  return " ";
}

export function formatScheduleDate(inputDate) {
  if (inputDate) {
    let d = new Date(inputDate);
    let dd = (d.getDate() < 10 ? "0" : "") + d.getDate();
    var MM = (d.getMonth() + 1 < 10 ? "0" : "") + (d.getMonth() + 1);
    let formattedDate = MM + "/" + dd + "/" + d.getFullYear();
    //  +
    // " " +
    // d.toString().split(" ")[4].substring(0, 5);
    return formattedDate;
  }
  return " ";
}

export function formatDateDash(inputDate) {
  if (inputDate) {
    let d = new Date(inputDate);
    let dd = (d.getDate() < 10 ? "0" : "") + d.getDate();
    var MM = (d.getMonth() + 1 < 10 ? "0" : "") + (d.getMonth() + 1);
    let formattedDate = MM + "-" + dd + "-" + d.getFullYear();
    //  +
    // " " +
    // d.toString().split(" ")[4].substring(0, 5);
    return formattedDate;
  }
  return " ";
}

export function formatDateDashYearFirst(inputDate) {
  if (inputDate) {
    let d = new Date(inputDate);
    let dd = (d.getDate() < 10 ? "0" : "") + d.getDate();
    var MM = (d.getMonth() + 1 < 10 ? "0" : "") + (d.getMonth() + 1);
    let formattedDate = d.getFullYear() + "-" + MM + "-" + dd;
    return formattedDate;
  }
  return " ";
}

export function formatTimelineDate(inputDate) {
  let monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  if (inputDate) {
    let d = new Date(inputDate);
    let dd = (d.getDate() < 10 ? "0" : "") + d.getDate();
    var MM = monthNames[d.getMonth()];
    let formattedDate = MM + " " + dd + ", " + d.getFullYear();
    return formattedDate;
  }
  return " ";
}

export function convertToUTCTime(inputDate) {
  return new Date(inputDate).toUTCString()
}
export function convertToNormalTime(inputDate) {
  return new Date(inputDate)
}

export function formatTimelineTime(inputDate) {
  if (inputDate) {
    let d = new Date(inputDate);
    let time24 = d.toString().split(" ")[4].substring(0, 7);
    const [sHours, minutes] = time24.match(/([0-9]{1,2}):([0-9]{2})/).slice(1);
    const period = +sHours < 12 ? "AM" : "PM";
    const hours = +sHours % 12 || 12;
    return `${hours < 10 ? "0" + hours : hours}:${minutes} ${period}`;
  }
  return " ";
}

export function formatTimelineData(input, dataFor) {
  //let temp = "";
  //console.log("INPUT",input);
  //dataFor === "USER" ? (temp = "updatedDate") : (temp = "createdDate");
  let result = input?.reduce(function (r, a) {
    let temp = a["updatedDate"] ? "updatedDate" : "createdDate";
    if (a[temp] && !(a.action === "UPDATE" && a.changes.length === 0)) {
      r[a[temp].substring(0, 10)] = r[a[temp].substring(0, 10)] || [];
      r[a[temp].substring(0, 10)].push(a);
    }
    return r;
  }, Object.create(null));
  return result;
}

export const stopLoading = (dispatch) => {
  setTimeout(() => {
    dispatch({ type: STOP_SPINNER_ACTION });
  }, 700);
};

export const logout = (history, dispatch) => {
  dispatch({ type: USER_LOGGED_OUT });
  localStorage.clear();
  history.push("/"); // Local VDI..
  //history.push("/api/logout"); //UAT
};

export const handleTimeoutMessage = (history, dispatch, setExpiry) => {
  logout(history, dispatch);
  let messageObj = {
    primaryButtonLabel: "OK",
    primaryButtonAction: () => {
      window.location.reload(false);
    },
    // secondaryButtonLabel: "No",
    // secondaryButtonAction: () => {},
    title: "Session Expired",
    message:
      "Your session has expired due to inactivity. Login again to continue.",
  };
  dispatch(showMessageDialog(messageObj));
  document.removeEventListener("click", setExpiry);
  document.removeEventListener("keypress", setExpiry);
};

export const generateInternalName = (propertyLabel) => {
  let camelCase = propertyLabel
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
  let currentDate = new Date();
  let internalName = camelCase + currentDate.getTime();
  return internalName;
};

export const generateFileName = (
  fileName,
  { moduleList, lobList, companyList, deliveryTypeList }
) => {
  const fileNames = fileName.split("-");
  let fileNamesCopy = [...fileNames];

  const valueSet = {
    deliveryMethod: "MAIL",
    moduleId: 0,
    companyDescription: "",
    businessLineDescription: "",
    letterName: "",
  };

  fileNames.forEach((item, index) => {
    if (!valueSet.moduleId) {
      for (var moduleItem in moduleList) {
        if (
          (moduleList[moduleItem]?.shortName?.toLowerCase().trim() ===
            item.toLowerCase()?.trim()) || moduleList[moduleItem]?.moduleName?.toLowerCase().trim() ===
          item.toLowerCase()?.trim()
        ) {
          valueSet.moduleId = moduleList[moduleItem]?.id;
          delete fileNamesCopy[index];
          break;
        }
      }
      if (!valueSet.moduleId && fileNames.length === 5 && index !== 2) {
        delete fileNamesCopy[index];
      }
    }

    if (valueSet.deliveryMethod === "MAIL") {
      for (var deliveryItem of deliveryTypeList) {
        if (deliveryItem.toLowerCase().trim() === item?.toLowerCase().trim()) {
          valueSet.deliveryMethod = deliveryItem;

          delete fileNamesCopy[index];
          break;
        }
      }

      if (
        valueSet.deliveryMethod !== "" &&
        fileNames.length === 5 &&
        index !== 2
      ) {
        delete fileNamesCopy[index];
      }
    }

    if (!valueSet.businessLineDescription) {
      for (var currentItem in lobList) {
        if (
          lobList[currentItem].description?.toLowerCase().trim() ===
          item?.toLowerCase().trim()
        ) {
          valueSet.businessLineDescription = lobList[currentItem].description;

          delete fileNamesCopy[index];
          break;
        }
      }

      if (!!valueSet.businessLineDescription && fileNames.length === 5 && index !== 2) {
        delete fileNamesCopy[index];
      }
    }

    if (!valueSet.companyDescription) {
      for (var currentItem1 in companyList) {
        if (
          companyList[currentItem1].description?.toLowerCase().trim() ===
          item?.toLowerCase().trim()
        ) {
          valueSet.companyDescription = companyList[currentItem1].description;

          delete fileNamesCopy[index];
          break;
        }
      }

      if (!!valueSet.companyDescription && fileNames.length === 5 && index !== 2) {
        delete fileNamesCopy[index];
      }
    }
  });

  fileNamesCopy = fileNamesCopy.filter((item) => !!item);

  if (fileNamesCopy.length === 1) {
    valueSet.letterName = fileNamesCopy[0];
  }

  //console.log(fileNamesCopy);

  return valueSet;
};
