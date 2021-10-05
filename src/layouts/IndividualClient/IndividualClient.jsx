import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch, Route, useRouteMatch, useHistory } from "react-router-dom";
import MainMenu from "../../components/MainMenu/MainMenu";
import AppHeader from "../../components/AppHeader";
import ClientDashboard from "../ClientDashboard";
import ClientProfile from "../Clients/ClientProfile";
// import ClientHierarchy from "../ClientHierarchy";
import IndividualClientModules from "../IndividualClientModules";
import ClientModules from "../ClientModules";

import IndividualClientSubmodules from "../IndividualClientSubmodules";
import IndividualClientFields from "../IndividualClientFields";
import IndividualClientConfig from "../IndividualClientConfig";
import IndividualClientEnvironment from "../IndividualClientEnvironment";
import IndividualClientDeploy from "../IndividualClientDeploy";
import ManageClientField from "../ManageClientField";
import ClientLetters from "../ClientLetters";
import LetterReports from "../ClientLetters/LetterReports";
import LetterEditor from "../ClientLetters/LetterEditor";
import { fetchOOBModule, fetchGlobalModule } from "../../actions/OOBModuleActions";
import { fetchEnvironment } from "../../actions/EnvironmentActions";
import { fetchCodeVersion } from "../../actions/CodeVersionActions";
import { fetchUsers, fetchLoggedInUserInfo } from "../../actions/UserActions";
// import { fetchClientById } from "../../actions/ClientActions";
import { fetchSessionTimeout } from "../../actions/SessionTimeoutActions";
import UserProfile from "../UserProfile";
import { RESET_ADD_CLIENT } from "../../utils/AppConstants";
import "./client.styles.scss";
function IndividualClient(props) {
  let { path } = useRouteMatch();
  const history = useHistory();
  const dispatch = useDispatch();
  const clientId = useSelector((state) => state.Header.entityId);
  const loggedInUserData = useSelector(
    (state) => state.User.loggedInUser.details
  );

  // React.useMemo(() => {
  //   dispatch({ type: RESET_ADD_CLIENT });
  //   dispatch(fetchLoggedInUserInfo());
  //   dispatch(fetchSessionTimeout());
  //   dispatch(fetchOOBModule("oob"));
  //   dispatch(fetchGlobalModule());
  //   dispatch(fetchEnvironment());
  //   dispatch(fetchCodeVersion());
  //   dispatch(fetchUsers("", "", "", "", "name"));
  // }, [dispatch])
  useEffect(() => {
    dispatch({ type: RESET_ADD_CLIENT });
    dispatch(fetchLoggedInUserInfo());
    dispatch(fetchSessionTimeout());
    dispatch(fetchOOBModule("oob"));
    dispatch(fetchGlobalModule());
    dispatch(fetchEnvironment());
    dispatch(fetchCodeVersion());
    dispatch(fetchUsers("", "", "", "", "name"));
  }, [dispatch]);


  // useEffect(() => {

  //   if (clientId) {
  //     console.log("admin")
  //     dispatch(fetchClientById(clientId));
  //   }

  //   if (
  //     !clientId &&
  //     loggedInUserData &&
  //     loggedInUserData.user_type === "CLIENT" &&
  //     loggedInUserData.clients
  //     //!loggedInUserData.clients[0].id
  //   ) {
  //     if (loggedInUserData.clients.length > 0) {
  //       console.log(path)
  //       history.push({
  //         pathname: `${path}/dashboard/${loggedInUserData.clients[0].id}`,
  //       });
  //     }
  //   }
  // }, [dispatch, clientId, loggedInUserData]);

  useEffect(() => {
    let newClientId = clientId || localStorage.getItem('storeClientId')
    if (newClientId) {
      //dispatch(fetchClientById(newClientId));
    }
    else if (loggedInUserData && loggedInUserData.user_type === "CLIENT") {
      localStorage.setItem('storeClientId', (loggedInUserData?.clients[0]?.id || loggedInUserData?.id)); //store a key/value
      history.push({
        pathname: `${path}/dashboard/${loggedInUserData?.clients[0]?.id || loggedInUserData?.id}`,
      });
    }
  }, [dispatch, clientId, loggedInUserData, history, path])

  return (
    <div className="container">
      <MainMenu />
      <div className="mainContainer">
        <AppHeader />
        <div className="childContainer">
          <Switch>
            <Route
              exact
              path={`${path}/dashboard/:clientId`}
              component={ClientDashboard}
            />

            <Route
              // exact
              path={`${path}/profile/:clientId`}
              component={ClientProfile}
            />
            {/* <Route
              path={`${path}/hierarchy/:clientId`}
              component={ClientHierarchy}
            /> */}
            <Route
              path={`${path}/user-profile/:clientId/:email`}
              component={UserProfile}
            />
            <Route
              exact
              path={`${path}/modules/:clientId`}
              component={IndividualClientModules}
            />
            <Route

              path={`${path}/client-modules/:clientId`}
              component={ClientModules}
            />
            {/* <Route
              exact
              path={`${path}/global-modules/:clientId`}
              component={IndividualClientModules}
            /> */}
            <Route
              exact
              path={`${path}/components/:clientId/:moduleId/:moduleVersionId/:version`}
              component={IndividualClientSubmodules}
            />
            <Route
              exact
              path={`${path}/fields/:clientId/:moduleId/:moduleVersionId/:submoduleId/:submoduleVersionId/:version`}
              component={IndividualClientFields}
            />
            <Route
              exact
              path={`${path}/field-details/:clientId/:moduleId/:moduleVersionId/:submoduleId/:submoduleVersionId/:controlId/:version`}
              component={ManageClientField}
            />
            <Route
              exact
              path={`${path}/config-deploy/:clientId`}
              component={IndividualClientConfig}
            />
            <Route
              exact
              path={`${path}/config-deploy/:clientId/:environment/:environmentId`}
              component={IndividualClientEnvironment}
            />
            <Route
              exact
              path={`${path}/config-deploy/:clientId/${'Deploy'}/:environment/:deploymentScheduleTimeId`}
              component={IndividualClientDeploy}
            />
            <Route
              path={`${path}/letters/:clientId`}
              component={ClientLetters}
            />
            {/* <Route
              exact
              path={`${path}/global-modules/:clientId`}
              component={IndividualClientModules}
            /> */}
            <Route
              path={`${path}/letter-Editor/:clientId/:letterId/:BreadCrum`}
              component={LetterEditor}
            />
            <Route
              path={`${path}/letter-Reports/:clientId`}
              component={LetterReports}
            />

          </Switch>
        </div>
      </div>
    </div>
  );
}

export default IndividualClient;
