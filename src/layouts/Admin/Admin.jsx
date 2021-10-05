import React, { useEffect } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import { useDispatch } from "react-redux";
import MainMenu from "../../components/MainMenu/MainMenu";
import "./admin.styles.scss";
import AppHeader from "../../components/AppHeader";
// import Clients from "../Clients";
import Users from "../Users";
// import Home from "../Home";
import HomeNew from "../Home/HomeNew"
import UserProfile from "../UserProfile";
// import ClientDashboard from "../ClientDashboard";
import OobConfiguration from "../OobConfiguration";
//import GlobalConfiguration from "../GlobalConfiguration";
import AppSettings from "../AppSettings";
import UserAccessControl from "../UserAccessControl";
import ClientList from "../Clients/ClientList";
import { fetchLoggedInUserInfo } from "../../actions/UserActions";
import { fetchSessionTimeout } from "../../actions/SessionTimeoutActions";

function Admin() {
  const dispatch = useDispatch();
  let { path } = useRouteMatch();

  useEffect(() => {
    dispatch(fetchLoggedInUserInfo());
    dispatch(fetchSessionTimeout());
  }, [dispatch]);
  // useEffect(() => {
  //   //if (clientId) dispatch(fetchClientById(clientId));
  //   if (
  //     !clientId &&
  //     loggedInUserData &&
  //     loggedInUserData.user_type === "CLIENT" &&
  //     loggedInUserData.clients
  //   ) {
  //     if (loggedInUserData.clients.length > 0) {
  //       history.push({
  //         pathname: `client/dashboard/${loggedInUserData.clients[0].id}`,
  //       });
  //     }
  //   }
  // }, [dispatch, clientId, loggedInUserData, history, path]);

  return (
    <div className="container">
      <MainMenu />
      <div className="mainContainer">
        <AppHeader />
        <div className="childContainer">
          <Switch>
            {/* <Route path="/NoAccess" component={NoAccess} /> */}
            <Route exact path={`${path}`} component={HomeNew} />
            <Route path={`${path}/clients`} component={ClientList} />
            <Route path={`${path}/users`} component={Users} />
            <Route
              path={`${path}/user-profile/:email`}
              component={UserProfile}
            />
            <Route
              path={`${path}/access-control`}
              component={UserAccessControl}
            />
            <Route path={`${path}/oob-config`} component={OobConfiguration} />
            {/* <Route
              path={`${path}/global-config`}
              component={OobConfiguration}
            /> */}
            <Route path={`${path}/app-setting`} component={AppSettings} />
          </Switch>
        </div>
      </div>
    </div>
  );
}

export default Admin;