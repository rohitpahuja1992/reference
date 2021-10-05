import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import MessageDialog from "../MessageDialog";
import LoadingScreen from "./LoadingScreen";
import { SnackbarScreen } from "./SnackbarScreen";
import { handleTimeoutMessage, logout } from "../../utils/helpers";

const GlobalScreens = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isMessageDialogActive, setIsMessageDialogActive] = useState(false);
  const messageDialog = useSelector((state) => state.AppMessages.dialog);
  const isLoadingScreen = useSelector((state) => state.Spinner.isLoading);
  const isSnackbar = useSelector((state) => state.Snackbar.dialog.isOpen);
  const loggedInUserData = useSelector(
    (state) => state.User.loggedInUser.details
  );
  const sessionInfo = useSelector(
    (state) => state.SessionTimeout.sessionTimeDetails.list[0]
  );

  const handleDialogClose = () => {
    setIsMessageDialogActive(false);
  };

  const setExpiry = useCallback(() => {
    const dateNow = new Date();
    const sessionExpiry = JSON.parse(localStorage.getItem("storageExpiry"));

    if (sessionExpiry && dateNow.getTime() > sessionExpiry) {
      handleTimeoutMessage(history, dispatch, setExpiry);
    } else {
      let timeoutms = 900000;
      if (sessionInfo && sessionInfo.timeout) {
        timeoutms = sessionInfo.timeout * 60000;
      }
      localStorage.setItem(
        "storageExpiry",
        dateNow.getTime() + timeoutms
        //(sessionInfo && sessionInfo.timeout ? sessionInfo.timeout : 180000)
      );
    }
  }, [history, dispatch, sessionInfo]);

  const handleSessionTimeout = useCallback(() => {
    document.addEventListener("click", setExpiry);
    document.addEventListener("keypress", setExpiry);
  }, [setExpiry]);

  const clearSessionEvent = useCallback(() => {
    document.removeEventListener("click", setExpiry);
    document.removeEventListener("keypress", setExpiry);
  }, [setExpiry]);

  useEffect(() => {
    if (messageDialog.isOpen) {
      setIsMessageDialogActive(true);
    } else {
      setIsMessageDialogActive(false);
    }
  }, [messageDialog, setIsMessageDialogActive]);

  useEffect(() => {
    const dateNow = new Date();
    const sessionExpiry = localStorage.getItem("storageExpiry");
    if (sessionExpiry && dateNow.getTime() > sessionExpiry) {
      logout(history, dispatch);
      clearSessionEvent();
    } else if (loggedInUserData) {
      handleSessionTimeout();
    } else {
      clearSessionEvent();
    }
  }, [
    loggedInUserData,
    handleSessionTimeout,
    clearSessionEvent,
    history,
    dispatch,
  ]);

  return (
    <>
      <MessageDialog
        {...messageDialog.detail}
        open={isMessageDialogActive}
        handleClose={handleDialogClose}
      />
      {isLoadingScreen ? <LoadingScreen /> : null}
      {isSnackbar ? <SnackbarScreen /> : null}
    </>
  );
};

export default GlobalScreens;
