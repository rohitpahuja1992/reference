import React, { useState, useEffect } from "react"; //useEffect
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core";
import "./login.styles.scss";
import logo from "../../assets/images/login-logo.png";
import MatButton from "../../components/MaterialUi/MatButton";
import MaterialTextField from "../../components/MaterialUi/MatTextField";
import { doCognitoLogin } from "../../actions/LoginActions";
import { showMessageDialog } from "../../actions/MessageDialogActions";
import { EMAIL_VALIDATION_PATTERN, RESET_DASHBOARD_DATA } from "../../utils/AppConstants";
import ForgetPassword from "../../components/ForgetPassword";
import ChangePassword from "../../components/ChangePassword";
import {
  RESET_LOGIN_IS_DONE,
  RESET_CHANGE_PASSWORD_DATA,
} from "../../utils/AppConstants";
import {
  LOGIN_WRONG_CREDENTIALS_TITLE,
  LOGIN_WRONG_CREDENTIALS_DETAIL_MSG,
  LOGIN_USER_NOTEXIST_TITLE,
  LOGIN_USER_NOTEXIST_MSG,
  LOGIN_USER_PASSWORD_EXPIRE_TITLE,
  LOGIN_USER_PASSWORD_EXPIRE_MSG,
  RESET_PASSWORD_MSG,
  LOGIN_USER_INACTIVE_TITLE,
  LOGIN_USER_INACTIVE_MSG,
  LOGIN_SOMETHING_WRONG_TITLE,
  LOGIN_SOMETHING_WRONG_DETAIL_MSG,
  LOGIN_LOGO_ALTERNATIVE_TEXT,
  LOGIN_PAGE_HEADING,
  LOGIN_EMAIL_MANDATORY_MSG,
  LOGIN_VAILD_EMAIL_MSG,
  LOGIN_USERNAME_LABEL,
  LOGIN_PASSWORD_MANDATORY_MSG,
  LOGIN_PASSWORD_LABEL,
  LOGIN_FORGOT_PASSWORD_LINK_TEXT,
  LOGIN_SIGN_IN_BUTTON_TEXT,
} from "../../utils/Messages";

const useStyle = makeStyles((theme) => ({
  loginButton: {
    paddingTop: "9px",
    paddingBottom: "9px",
    fontSize: "18px",
    fontWeight: "normal",
    [theme.breakpoints.down("sm")]: {
      fontSize: "16px",
    },
  },
  forgetPwdLink: {
    cursor: "pointer",
  },
}));

function Login() {
  
  const styles = useStyle();
  const history = useHistory();
  const loginDetails = useSelector((state) => state.login.loginDetails);
  const dispatch = useDispatch();
  const { register, handleSubmit, watch, reset, errors } = useForm();
  const defaultFormData = {
    username: "",
    password: "",
  };
  const [inputs, setInputs] = useState(defaultFormData);
  const [isSubmited, setIsSubmited] = useState(false);
  const { username, password } = inputs;

  const [open, setOpen] = useState(false);
  const [forgetPasswordKey, setForgetPasswordKey] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [isChangePasswordOpen, setChangePasswordOpen] = useState(false);
  const [changePasswordKey, setChangePasswordKey] = useState(0);

  const isMhkUser = () => username.toLocaleLowerCase().indexOf("mhk") > -1 || username.toLocaleLowerCase().indexOf("aainaarora93gmail") > -1;

  const openForgetPasswordDialog = () => {
    setOpen(true);
    setForgetPasswordKey((count) => count + 1);
  };

  const closeForgetPasswordDialog = () => {
    setActiveTab(0);
    setOpen(false);
  };

  const handleNextTab = () => {
    setActiveTab((prevState) => prevState + 1);
  };

  const openChangePasswordDialog = () => {
    setChangePasswordOpen(true);
    setChangePasswordKey((count) => count + 1);
  };

  const closeChangePasswordDialog = () => {
    dispatch({ type: RESET_LOGIN_IS_DONE });
    dispatch({ type: RESET_CHANGE_PASSWORD_DATA });
    setIsSubmited(false);
    reset(defaultFormData);
    setInputs(defaultFormData);
    setChangePasswordOpen(false);
  };

  useEffect(() => {
    if (loginDetails.isDone && loginDetails.responseCode === "9132") {
      openChangePasswordDialog();
    }
    if (
      loginDetails.isDone &&
      (loginDetails.responseCode === "9131" ||
        loginDetails.responseCode === "9124")
    ) {
      if (isMhkUser()) {
        history.push({
          pathname: "/admin",
        });
      } else {
        history.push({
          pathname: "/client",
        });
      }
    }

    if (
      loginDetails.isDone &&
      (loginDetails.responseCode === "9127" ||
        loginDetails.responseCode === "9128")
    ) {
      let messageObj = {
        primaryButtonLabel: "Ok",
        title: LOGIN_WRONG_CREDENTIALS_TITLE,
        message: LOGIN_WRONG_CREDENTIALS_DETAIL_MSG,
        primaryButtonAction: () => { },
      };
      dispatch(showMessageDialog(messageObj));
      dispatch({ type: RESET_LOGIN_IS_DONE });
      setIsSubmited(false);
    }

    if (
      loginDetails.isDone &&
      (loginDetails.responseCode === "9126" ||
        loginDetails.responseCode === "9129" ||
        loginDetails.responseCode === "9130")
    ) {
      let messageObj = {
        primaryButtonLabel: "Ok",
        title: LOGIN_USER_NOTEXIST_TITLE,
        message: LOGIN_USER_NOTEXIST_MSG,
        primaryButtonAction: () => { },
      };
      dispatch(showMessageDialog(messageObj));
      dispatch({ type: RESET_LOGIN_IS_DONE });
      setIsSubmited(false);
    }

    if (
      loginDetails.isDone &&
      (loginDetails.responseCode === "9135")
    ) {
      let messageObj = {
        primaryButtonLabel: "Cancel",
        title: LOGIN_USER_PASSWORD_EXPIRE_TITLE,
        message: <>{LOGIN_USER_PASSWORD_EXPIRE_MSG}<a href="https://login.microsoftonline.com/">{RESET_PASSWORD_MSG}</a></>,
        primaryButtonAction: () => { },
      };
      dispatch(showMessageDialog(messageObj));
      dispatch({ type: RESET_LOGIN_IS_DONE });
      setIsSubmited(false);
    }

    if (
      loginDetails.isDone &&
      (loginDetails.responseCode === "9123" ||
        loginDetails.responseCode === "9125")
    ) {
      let messageObj = {
        primaryButtonLabel: "Ok",
        title: LOGIN_USER_INACTIVE_TITLE,
        message: LOGIN_USER_INACTIVE_MSG,
        primaryButtonAction: () => { },
      };
      dispatch(showMessageDialog(messageObj));
      dispatch({ type: RESET_LOGIN_IS_DONE });
      setIsSubmited(false);
    }

    if (!loginDetails.isDone && loginDetails.error) {
      let messageObj = {
        primaryButtonLabel: "Ok",
        title: LOGIN_SOMETHING_WRONG_TITLE,
        message: LOGIN_SOMETHING_WRONG_DETAIL_MSG,
        primaryButtonAction: () => { },
      };
      dispatch(showMessageDialog(messageObj));
      dispatch({ type: RESET_LOGIN_IS_DONE });
      setIsSubmited(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    loginDetails.isDone,
    loginDetails.responseCode,
    //loginDetails.detail,
    loginDetails.error,
    history,
    dispatch,
  ]);

  let handleChange = (e) => {
    const { name } = e.target;
    setInputs((inputs) => ({ ...inputs, [name]: watch(name) }));
  };

  let handleLogin = () => {
    //let userType = isMhkUser() ? "MHK" : "CLIENT";
    setIsSubmited(true);
    dispatch({ type: RESET_DASHBOARD_DATA });
    let emailAsUsername = username.trim();
    dispatch(doCognitoLogin(emailAsUsername, password));
  };

  return (
    <>
      <form
        className="loginContainer"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(handleLogin)}
      >
        <div className="loginBox">
          <div className="loginLogo">
            <img src={logo} alt={LOGIN_LOGO_ALTERNATIVE_TEXT} />
          </div>
          <div className="pageHeading">{LOGIN_PAGE_HEADING}</div>
          <div className="field">
            <MaterialTextField
              size="normal"
              inputRef={register({
                required: { value: true, message: LOGIN_EMAIL_MANDATORY_MSG },
                pattern: {
                  value: EMAIL_VALIDATION_PATTERN,
                  message: LOGIN_VAILD_EMAIL_MSG,
                },
              })}
              error={errors.username ? true : false}
              helperText={errors.username ? errors.username.message : " "}
              required
              name="username"
              label={LOGIN_USERNAME_LABEL}
              onChange={handleChange}
            />
          </div>
          <div className="field">
            <MaterialTextField
              size="normal"
              inputRef={register({ required: true })}
              error={errors.password ? true : false}
              helperText={errors.password ? LOGIN_PASSWORD_MANDATORY_MSG : " "}
              required
              type="password"
              name="password"
              label={LOGIN_PASSWORD_LABEL}
              onChange={handleChange}
            />
          </div>
          <div className="bottomAction">
            <div className="remberMe"></div>
            {/* Below forget password linked is hidden till implemenation of API on back-end */}
            <div className="forgetPassword">
              <Link
                className={styles.forgetPwdLink}
                onClick={openForgetPasswordDialog}
              >
                {LOGIN_FORGOT_PASSWORD_LINK_TEXT}
              </Link>
            </div>
          </div>
          <MatButton
            type="submit"
            className={styles.loginButton}
            disabled={isSubmited}
          >
            {LOGIN_SIGN_IN_BUTTON_TEXT}
          </MatButton>
        </div>
      </form>
      {open && (
        <ForgetPassword
          key={forgetPasswordKey}
          handleClose={closeForgetPasswordDialog}
          open={open}
          handleNext={handleNextTab}
          activeTab={activeTab}
        />
      )}

      {isChangePasswordOpen && (
        <ChangePassword
          openFor="firstLogin"
          username={username}
          password={password}
          key={changePasswordKey}
          handleClose={closeChangePasswordDialog}
          open={isChangePasswordOpen}
        />
      )}
    </>
  );
}

export default Login;
