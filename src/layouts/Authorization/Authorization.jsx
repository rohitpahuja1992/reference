import React, { useEffect } from "react"; //useEffect
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { doAuthCognitoLogin } from "../../actions/LoginActions";
// import { refreshToken } from "../../actions/LoginActions";
import {
  RESET_LOGIN_IS_DONE,
  //RESET_CHANGE_PASSWORD_DATA,
} from "../../utils/AppConstants";

function Authorization(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  let authCode = props?.location?.search?.split("code=")[1];
  const loginAuthDetails = useSelector((state) => state.login.loginAuthDetails);

  useEffect(() => {
    if (authCode) {
      dispatch(doAuthCognitoLogin(authCode, ""));
      // console.log("props", authCode)
    }
  }, [dispatch, authCode])


  useEffect(() => {
    if (
      loginAuthDetails.isDone
    ) {
      //check user type..
      if (loginAuthDetails?.detail?.user_type === "MHK") {
        history.push({
          pathname: "/admin",
        });
      }
      else if (loginAuthDetails?.detail?.user_type === "CLIENT" && loginAuthDetails?.detail?.client_associated) {
        history.push({
          pathname: "/client",
        });
      }
      else if (loginAuthDetails?.detail?.user_type === "CLIENT" && !loginAuthDetails?.detail?.client_associated) {
        history.push({
          pathname: "/OnBoard",
        });
      }
      else if (loginAuthDetails?.responseCode === 2306 || loginAuthDetails?.responseCode === "2306" || loginAuthDetails?.responseCode === 2307 || loginAuthDetails?.responseCode === "2307") {
        history.push({
          pathname: "/NoAccess",
          state: {loginAuthDetailsResponseCode:loginAuthDetails?.responseCode}
        });
      }
    }
    dispatch({ type: RESET_LOGIN_IS_DONE });
  }, [
    loginAuthDetails.isDone,
    loginAuthDetails?.detail?.user_type,
    loginAuthDetails?.detail?.client_associated,
    history,
    dispatch
  ]);

  return (
    <>
      {/* <p>Login Page...</p> */}
    </>
  );
}

export default Authorization;
