import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Provider } from "react-redux";
import Login from "./layouts/Login";
import Authorization from "./layouts/Authorization";
import Admin from "./layouts/Admin";
//import ExternalDashboard from "./layouts/ExternalDashboard";
import IndividualClient from "./layouts/IndividualClient";
import { ThemeProvider } from "@material-ui/core";
import AppStore from "./app-store";
import GlobalScreens from "./components/GlobalScreens";
import { ProtectedRoute } from "./ProtectedRoute";

import AppTheme from "./AppTheme";
import "./App.scss";
import OnBoard from "./layouts/OnBoard";
import NoAccess from "./layouts/NoAccess";

function App() {

  // const loginAuthDetails = useSelector((state) => state.login.loginAuthDetails);
  // console.log("loginAuthDetails", loginAuthDetails)
  return (
    <Provider store={AppStore}>
      <ThemeProvider theme={AppTheme}>
        <Router>
          {/* basename={'/dev'} */}
          <Switch>
            <Route path="/OnBoard" component={OnBoard} />
            <Route path="/NoAccess" component={NoAccess} />

            <Route
              exact
              path="/"
              component={(props) =>
                localStorage.getItem("access_token") && localStorage.getItem("user_type") === "MHK" ? (
                  <Redirect to="/admin" />
                ) : localStorage.getItem("access_token") && localStorage.getItem("user_type") === "CLIENT" ?
                  <Redirect to="/client" />
                  : (
                    <Login {...props} /> // Local VDI...
                    //window.location.href = "https://mhk-cmt.auth.us-east-1.amazoncognito.com/logout?client_id=vbt51e6imbfeaa0vmfct7l2j5&response_type=code&scope=email+openid&redirect_uri=https://cmt.medhokapps.com/api/login/oauth2/code/cognito" // UAT
                  )
              }
            />

            <Route
              path="/api/login"
              component={(props) =>
                localStorage.getItem("access_token") ? (
                  <Redirect to="/admin" />
                ) : (
                  <Authorization {...props} />
                )
              }
            />
            <Route path='/api/logout' component={() => {
              //set logout route for MHK cognito users...
              window.location.href = "https://mhk-cmt.auth.us-east-1.amazoncognito.com/logout?client_id=vbt51e6imbfeaa0vmfct7l2j5&response_type=code&scope=email+openid&redirect_uri=https://cmt.medhokapps.com/api/login/oauth2/code/cognito"

              //set logout route for puresoft congito users...
              // window.location.href = 'https://mhk-cmt.auth.ap-south-1.amazoncognito.com/logout?client_id=aadlq5t84gijincd43k71kgnn&response_type=code&scope=email+openid+aws.cognito.signin.user.admin&redirect_uri=http://localhost:3000/login/oauth2/code/cognito';
              return null;
            }} />
            <ProtectedRoute path="/admin" component={Admin} />
            <ProtectedRoute path="/client" component={IndividualClient} />
          </Switch>
          <GlobalScreens />
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
