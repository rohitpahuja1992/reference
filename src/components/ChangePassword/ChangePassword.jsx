import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import MaterialTextField from "../MaterialUi/MatTextField";
import MatButton from "../MaterialUi/MatButton";
import MatTooltip from "../MaterialUi/MatTooltip";
import PasswordPolicy from "../PasswordPolicy";
import { Divider, makeStyles } from "@material-ui/core";
import { changeUserPassword } from "../../actions/ChangePasswordActions";
import { PASSWORD_VALIDATION_PATTERN } from "../../utils/AppConstants";
import { showMessageDialog } from "../../actions/MessageDialogActions";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import {
  // COMMON_ERROR_MESSAGE,
  // CHANGE_PWD_INCORRECT_PWD_MSG,
  // CHANGE_PWD_LIMIT_EXCEEDED_MSG,
  handleChangePasswordError,
  CHANGE_PWD_SUCCESSFULLY_TITLE,
  CHANGE_PWD_SUCCESSFULLY_MSG,
  CHANGE_PWD_RESET_PWD_TITLE,
  CHANGE_PWD_TITLE,
  CHANGE_PWD_MANDATORY_MSG,
  CHANGE_PWD_VALIDATION_MSG,
  CHANGE_PWD_CURRENT_PWD_LABEL,
  CHANGE_PWD_NEW_PWD_MANDATORY_MSG,
  CHANGE_PWD_VALID_NEW_PWD_MSG,
  CHANGE_PWD_NEW_PWD_LABEL,
  CHANGE_PWD_CONFIRM_PWD_MANDATORY_MSG,
  CHANGE_PWD_CONFIRM_PWD_NOT_MATCH_MSG,
  CHANGE_PWD_CONFIRM_PWD_LABEL,
  CHANGE_PWD_CANCEL_BUTTON_TEXT,
  CHANGE_PWD_BUTTON_TEXT,
  CHANGE_PWD_RESET_BUTTON_TEXT,
} from "../../utils/Messages";

const useStyles = makeStyles((theme) => ({
  row: {
    padding: "10px 0 0",
  },
  col: {
    padding: "5px 10px",
  },
  dialogTitle: {
    fontWeight: 300,
  },
  chip: {
    margin: "2px",
  },
  errorCard: {
    background: theme.palette.error.main,
    boxShadow: "none !important",
    color: "#ffffff",
    padding: "12px 16px",
    marginBottom: "14px",
  },
  warningCard: {
    background: theme.palette.warning.main,
    boxShadow: "none !important",
    color: "#ffffff",
    padding: "12px 16px",
    marginBottom: "14px",
  },
}));

function ChangePassword(props) {
  const { open, openFor, handleClose, username, password } = props;
  const styles = useStyles();
  const changePasswordData = useSelector((state) => state.ChangePassword);
  const { register, handleSubmit, watch, errors } = useForm({ mode: "onBlur" });
  const [isSubmited, setIsSubmited] = useState(false);
  const [apiError, setApiError] = useState(null);

  const dispatch = useDispatch();
  const defaultFormData = {
    currentPassword: password || "",
    newPassword: "",
    confirmPassword: "",
  };
  const [inputs, setInputs] = useState(defaultFormData);

  let handleChange = (e) => {
    setApiError(null);
    const { name } = e.target;
    setInputs((inputs) => ({ ...inputs, [name]: watch(name) }));
  };

  const handleChangePassword = () => {
    setIsSubmited(true);
    let formData = {
      openFor,
      username,
      ...inputs,
    };
    dispatch(changeUserPassword(formData));
  };

  const handleCloseForm = useCallback(() => {
    setIsSubmited(false);
    handleClose();
  }, [handleClose]);

  useEffect(() => {
    if (
      changePasswordData.error && !(changePasswordData.error.responseCode === "200")
    ) {
      setIsSubmited(false);
      setApiError(handleChangePasswordError(changePasswordData.error));
    }
    else{
      setIsSubmited(false);
      setApiError(false);
    }


  }, [changePasswordData.error]);

  useEffect(() => {
    if (changePasswordData.isPasswordChanged) {
      let messageObj = {
        primaryButtonLabel: "OK",
        primaryButtonAction: () => { },
        // secondaryButtonLabel: "No",
        // secondaryButtonAction: () => {},
        title: CHANGE_PWD_SUCCESSFULLY_TITLE,
        message: CHANGE_PWD_SUCCESSFULLY_MSG,
      };
      dispatch(showMessageDialog(messageObj));
      handleCloseForm();
    }
  }, [
    changePasswordData.isPasswordChanged,
    dispatch,
    handleCloseForm
  ]);

  return (
    <>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle className={styles.dialogTitle}>
          {openFor === "firstLogin"
            ? CHANGE_PWD_RESET_PWD_TITLE
            : CHANGE_PWD_TITLE}
        </DialogTitle>
        <Divider />
        <DialogContent dividers="true">
          <form
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit(handleChangePassword)}
            id="changePassword"
          >
            <Grid container className={styles.row}>
              {apiError && (
                <Grid item xs={12} className={styles.col}>
                  <Card className={apiError.messageType === "error" ? styles.errorCard : styles.warningCard}>
                    <Typography variant="body2">{apiError.message}</Typography>
                  </Card>
                </Grid>
              )}
              {openFor !== "firstLogin" && (
                <Grid item xs={12} className={styles.col}>
                  <MaterialTextField
                    inputRef={register({
                      required: {
                        value: true,
                        message: CHANGE_PWD_MANDATORY_MSG,
                      },
                      pattern: {
                        value: PASSWORD_VALIDATION_PATTERN,
                        message: CHANGE_PWD_VALIDATION_MSG,
                      },
                    })}
                    error={errors.currentPassword ? true : false}
                    type="password"
                    helperText={
                      errors.currentPassword
                        ? errors.currentPassword.message
                        : " "
                    }
                    required
                    label={CHANGE_PWD_CURRENT_PWD_LABEL}
                    name="currentPassword"
                    onChange={handleChange}
                  />
                </Grid>
              )}
              <Grid item xs={12} className={styles.col}>
                <MatTooltip
                  title={<PasswordPolicy />}
                  placement="right"
                  arrow
                  disableHoverListener
                >
                  <MaterialTextField
                    inputRef={register({
                      required: {
                        value: true,
                        message: CHANGE_PWD_NEW_PWD_MANDATORY_MSG,
                      },
                      pattern: {
                        value: PASSWORD_VALIDATION_PATTERN,
                        message: CHANGE_PWD_VALID_NEW_PWD_MSG,
                      },
                    })}
                    error={errors.newPassword ? true : false}
                    type="password"
                    helperText={
                      errors.newPassword ? errors.newPassword.message : " "
                    }
                    required
                    label={CHANGE_PWD_NEW_PWD_LABEL}
                    name="newPassword"
                    onChange={handleChange}
                  />
                </MatTooltip>
              </Grid>
              <Grid item xs={12} className={styles.col}>
                <MaterialTextField
                  inputRef={register({
                    required: {
                      value: true,
                      message: CHANGE_PWD_CONFIRM_PWD_MANDATORY_MSG,
                    },
                    validate: (value) =>
                      value === watch("newPassword") ||
                      CHANGE_PWD_CONFIRM_PWD_NOT_MATCH_MSG,
                  })}
                  error={errors.confirmPassword ? true : false}
                  type="password"
                  helperText={
                    errors.confirmPassword
                      ? errors.confirmPassword.message
                      : " "
                  }
                  required
                  label={CHANGE_PWD_CONFIRM_PWD_LABEL}
                  name="confirmPassword"
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          {/* {openFor !== "firstLogin" && ( */}
          <MatButton color="primary" onClick={handleCloseForm}>
            {CHANGE_PWD_CANCEL_BUTTON_TEXT}
          </MatButton>
          {/* )} */}
          <MatButton type="submit" form="changePassword" disabled={isSubmited}>
            {openFor === "firstLogin"
              ? CHANGE_PWD_RESET_BUTTON_TEXT
              : CHANGE_PWD_BUTTON_TEXT}
          </MatButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ChangePassword;
