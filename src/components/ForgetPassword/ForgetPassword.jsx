import React, { useState, useCallback, useEffect } from "react"; // useEffect
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from "react-hook-form";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import MaterialTextField from "../MaterialUi/MatTextField";
import MatButton from "../MaterialUi/MatButton";
import MatTooltip from "../MaterialUi/MatTooltip";
import PasswordPolicy from "../PasswordPolicy";
import { Divider, makeStyles } from "@material-ui/core";
import {
  EMAIL_VALIDATION_PATTERN,
  PASSWORD_VALIDATION_PATTERN,
  RESET_PASSWORD_CODE,
  RESET_FORGET_PASSWORD,
  //FORGET_PASSWORD_SUCCESS
} from "../../utils/AppConstants";
import {
  FORGET_PWD_TITLE,
  FORGET_PWD_RESET_PWD_TITLE,
  FORGET_PWD_EMAIL_MANDATORY_MSG,
  FORGET_PWD_VALID_EMAIL_MSG,
  FORGET_PWD_OTP_CODE_INFO_MSG,
  FORGET_PWD_EMAIL_ADDRESS_LABEL,
  FORGET_PWD_CHECK_EMAIL_INFO_MSG,
  FORGET_PWD_OTP_CODE_MANDATORY_MSG,
  FORGET_PWD_OTP_CODE_LABEL,
  FORGET_PWD_NEW_PWD_MANDATORY_MSG,
  FORGET_PWD_VALID_NEW_PWD_MSG,
  FORGET_PWD_NEW_PWD_LABEL,
  FORGET_PWD_CONFIRM_PWD_MANDATORY_MSG,
  FORGET_PWD_CONFIRM_PWD_NOT_MATCH_MSG,
  FORGET_PWD_CONFIRM_PWD_LABEL,
  FORGET_PWD_CANCEL_BUTTON_TEXT,
  FORGET_PWD_RESET_PWD_BUTTON_TEXT,
  FORGET_PWD_SUBMIT_BUTTON_TEXT,
  //COMMON_ERROR_MESSAGE,
  handleForgotPasswordError,
  handleResetPasswordError,
  //WRONG_EMAIL_MSG
} from "../../utils/Messages";
import { getForgetPasswordCode, forgetPassword } from '../../actions/LoginActions';
// import {addUser} from '../../actions/UserActions';
// import { RESET_ADD_USER_ERROR } from '../../utils/AppConstants';
// import Typography from '@material-ui/core/Typography';
// import Card from '@material-ui/core/Card';

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
  infoCard: {
    background: theme.palette.info.main,
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
    marginBottom: '14px'
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
      style={{ minHeight: "120px" }}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function ForgetPassword(props) {
  const styles = useStyles();
  const { register, handleSubmit, watch, errors } = useForm({ mode: "onBlur" });
  const [isSubmited, setIsSubmited] = useState(false);
  const [resetCodeError, setResetCodeError] = useState(false);
  const [forgetPasswordError, setForgetPasswordError] = useState(false);
  // const [apiError, setApiError] = useState(null);

  const dispatch = useDispatch();
  const defaultForgetFormData = {
    eamil: "",
  };

  const defaultResetFormData = {
    verificationCode: "",
    newPassword: "",
    confirmPassword: "",
  };

  const [forgetInputs, setForgetInputs] = useState(defaultForgetFormData);
  const [resetInputs, setResetInputs] = useState(defaultResetFormData);
  const resetPasswordCode = useSelector(
    (state) => state.login.resetPasswordCode
  );
  const isForgetPassword = useSelector(
    (state) => state.login.forgetPassword
  );

  let handleForgetChange = (e) => {
    const { name } = e.target;
    dispatch({ type: RESET_PASSWORD_CODE });
    setForgetInputs((inputs) => ({ ...inputs, [name]: watch(name) }));
  };

  let handleResetChange = (e) => {
    const { name } = e.target;
    dispatch({ type: RESET_FORGET_PASSWORD });
    setResetInputs((inputs) => ({ ...inputs, [name]: watch(name) }));
  };

  const handleForgetPassword = () => {
    dispatch(getForgetPasswordCode(forgetInputs.email));
    //props.handleNext();
    //return forgetInputs; // remove this line after API integration
  };

  const handleResetPassword = () => {
    let payload = {
      confirmationCode: resetInputs.verificationCode,
      password: resetInputs.confirmPassword,
      username: forgetInputs.email
    };
    setIsSubmited(true);
    dispatch(forgetPassword(payload));

    // let formData = {
    //     ...inputs,
    // }
    //props.handleClose();
    // dispatch(addUser(formData));
    //return resetInputs; // remove this line after API integration
  };

  const handleCloseForm = useCallback(() => {
    dispatch({ type: RESET_PASSWORD_CODE });
    setIsSubmited(false);
    props.handleClose();
  }, [props, dispatch]);

  useEffect(() => {
    if (typeof resetPasswordCode === 'boolean' && resetPasswordCode === true) {
      props.handleNext();
      dispatch({ type: RESET_PASSWORD_CODE })
    }
    if (typeof resetPasswordCode === 'boolean' && resetPasswordCode === false) {
      setResetCodeError(false);
    }
    if (typeof resetPasswordCode !== 'boolean') {
      setResetCodeError(handleResetPasswordError(resetPasswordCode,forgetInputs.email));
    }
  }, [dispatch, props, resetPasswordCode,forgetInputs.email]);

  useEffect(() => {
    if (typeof isForgetPassword === 'boolean' && isForgetPassword === true) {
      props.handleClose();
      dispatch({ type: RESET_FORGET_PASSWORD });
    }
    if (typeof isForgetPassword === 'boolean' && isForgetPassword === false) {
      setForgetPasswordError(false);
    }
    if (typeof isForgetPassword !== 'boolean') {
      setIsSubmited(false);
      setForgetPasswordError(handleForgotPasswordError(isForgetPassword));
    }
  }, [dispatch, props, isForgetPassword]);

  return (
    <>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={props.open}
        onClose={props.handleClose}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle className={styles.dialogTitle}>
          {props.activeTab === 0 && FORGET_PWD_TITLE}
          {props.activeTab === 1 && FORGET_PWD_RESET_PWD_TITLE}
        </DialogTitle>
        <Divider />
        <DialogContent dividers="true">
          <TabPanel value={props.activeTab} index={0}>
            <form
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(handleForgetPassword)}
              id="forgetPassword"
            >
              <Grid container className={styles.row}>
                {resetCodeError && (
                  <Grid item xs={12} className={styles.col}>
                    <Card className={resetCodeError.messageType === "error"?styles.errorCard:styles.warningCard}>
                      <Typography variant="body2">{resetCodeError.message}</Typography>
                    </Card>
                  </Grid>
                )}
                <Grid item xs={12} className={styles.col}>
                  <MaterialTextField
                    inputRef={register({
                      required: {
                        value: true,
                        message: FORGET_PWD_EMAIL_MANDATORY_MSG,
                      },
                      pattern: {
                        value: EMAIL_VALIDATION_PATTERN,
                        message: FORGET_PWD_VALID_EMAIL_MSG,
                      },
                    })}
                    error={errors.email ? true : false}
                    helperText={
                      errors.email
                        ? errors.email.message
                        : FORGET_PWD_OTP_CODE_INFO_MSG
                    }
                    required
                    label={FORGET_PWD_EMAIL_ADDRESS_LABEL}
                    id="email"
                    name="email"
                    onChange={handleForgetChange}
                  />
                </Grid>
              </Grid>
            </form>
          </TabPanel>
          <TabPanel value={props.activeTab} index={1}>
            <form
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(handleResetPassword)}
              id="resetPassword"
            >
              <Grid container className={styles.row}>
                <Grid item xs={12} className={styles.col}>
                  <Card className={forgetPasswordError ? (forgetPasswordError.messageType === "error"?styles.errorCard:styles.warningCard) : styles.infoCard}>
                    <Typography variant="body2">
                      {forgetPasswordError ? forgetPasswordError.message : FORGET_PWD_CHECK_EMAIL_INFO_MSG}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} className={styles.col}>
                  <MaterialTextField
                    inputRef={register({
                      required: {
                        value: true,
                        message: FORGET_PWD_OTP_CODE_MANDATORY_MSG,
                      },
                    })}
                    error={errors.verificationCode ? true : false}
                    type="password"
                    helperText={
                      errors.verificationCode
                        ? errors.verificationCode.message
                        : " "
                    }
                    required
                    label={FORGET_PWD_OTP_CODE_LABEL}
                    name="verificationCode"
                    onChange={handleResetChange}
                  />
                </Grid>
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
                          message: FORGET_PWD_NEW_PWD_MANDATORY_MSG,
                        },
                        pattern: {
                          value: PASSWORD_VALIDATION_PATTERN,
                          message: FORGET_PWD_VALID_NEW_PWD_MSG,
                        },
                      })}
                      error={errors.newPassword ? true : false}
                      type="password"
                      helperText={
                        errors.newPassword ? errors.newPassword.message : " "
                      }
                      required
                      label={FORGET_PWD_NEW_PWD_LABEL}
                      name="newPassword"
                      onChange={handleResetChange}
                    />
                  </MatTooltip>
                </Grid>
                <Grid item xs={12} className={styles.col}>
                  <MaterialTextField
                    inputRef={register({
                      required: {
                        value: true,
                        message: FORGET_PWD_CONFIRM_PWD_MANDATORY_MSG,
                      },
                      validate: (value) =>
                        value === watch("newPassword") ||
                        FORGET_PWD_CONFIRM_PWD_NOT_MATCH_MSG,
                    })}
                    error={errors.confirmPassword ? true : false}
                    type="password"
                    helperText={
                      errors.confirmPassword
                        ? errors.confirmPassword.message
                        : " "
                    }
                    required
                    label={FORGET_PWD_CONFIRM_PWD_LABEL}
                    name="confirmPassword"
                    onChange={handleResetChange}
                  />
                </Grid>
              </Grid>
            </form>
          </TabPanel>
        </DialogContent>
        <DialogActions>
          <MatButton color="primary" onClick={handleCloseForm}>
            {FORGET_PWD_CANCEL_BUTTON_TEXT}
          </MatButton>
          {props.activeTab === 0 && (
            <MatButton type="submit" form="forgetPassword">
              {FORGET_PWD_RESET_PWD_BUTTON_TEXT}
            </MatButton>
          )}

          {props.activeTab === 1 && (
            <MatButton type="submit" form="resetPassword" disabled={isSubmited}>
              {FORGET_PWD_SUBMIT_BUTTON_TEXT}
            </MatButton>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ForgetPassword;
