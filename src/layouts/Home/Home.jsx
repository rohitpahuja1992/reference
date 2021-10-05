import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MatContainer from "../../components/MaterialUi/MatContainer";
//import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import PageHeading from "../../components/PageHeading";
import { updateHeaderTitle } from "../../actions/AppHeaderActions";
import { fetchRoles } from "../../actions/RoleActions";
import { fetchRoleInfo, fetchSystemInfo, fetchModuleUsage } from "../../actions/DashboardActions";
import {
  //adminHomeDescription,
  adminHomeWelcomeMessage,
  HOME,
} from "../../utils/Messages";
import TotalClientAnalytics from "./TotalClientAnalytics";
import TotalModuleAnalytics from "./TotalModuleAnalytics";
import TotalUserAnalytics from "./TotalUserAnalytics";
import TotalApprovalAnalytics from "./TotalApprovalAnalytics";
import ActiveUserRoleWiseAnalytics from "./ActiveUserRoleWiseAnalytics";
import ModuleUsesTrends from "./ModuleUsesTrends";
import { VIEW_ADMIN_DASHBOARD } from "../../utils/FeatureConstants";

const Home = () => {
  const dispatch = useDispatch();
  const loggedInInfo = useSelector((state) => state.User.loggedInUser.details);
  //const isAdmin = loggedInInfo && loggedInInfo.roles.filter((obj) => obj.id === 8);
  const featuresAssigned = useSelector((state) => state.User.features);

  useEffect(() => {
    dispatch(updateHeaderTitle(HOME));
    dispatch(fetchRoles());
    dispatch(fetchRoleInfo());
    dispatch(fetchModuleUsage());
  }, [dispatch]);

  useEffect(() => {
    if (featuresAssigned.indexOf(VIEW_ADMIN_DASHBOARD) !== -1) {
      dispatch(fetchSystemInfo());
    }
    else {
      dispatch(fetchSystemInfo(loggedInInfo.id));
    }
  }, [dispatch, featuresAssigned, loggedInInfo.id]);

  return (
    <MatContainer>
      {loggedInInfo && (
        <PageHeading
          heading={adminHomeWelcomeMessage(
            loggedInInfo.firstName,
            loggedInInfo.lastName
          )}
        />
      )}
      {/* {adminHomeDescription()} */}
      <Grid container>
        <Grid item xs={12} sm={6} md={3}>
          <TotalClientAnalytics />
        </Grid>
        <Grid item xs={12} sm={6} md={3} style={{display:'grid'}}>
          <TotalModuleAnalytics />
        </Grid>
        {featuresAssigned.indexOf(VIEW_ADMIN_DASHBOARD) !== -1 &&
          //(loggedInInfo.relationshipManager || (isAdmin.length > 0)) &&
          <Grid item xs={12} sm={6} md={3}>
            <TotalUserAnalytics />
          </Grid>}
        <Grid item xs={12} sm={6} md={3}>
          <TotalApprovalAnalytics />
        </Grid>
        {featuresAssigned.indexOf(VIEW_ADMIN_DASHBOARD) !== -1 &&
          //(loggedInInfo.relationshipManager || (isAdmin.length > 0)) &&
          <Grid item xs={12}>
            <ActiveUserRoleWiseAnalytics />
          </Grid>}
        {featuresAssigned.indexOf(VIEW_ADMIN_DASHBOARD) !== -1 &&
          <Grid item xs={12}>
            <ModuleUsesTrends />
          </Grid>}
      </Grid>
    </MatContainer>
  );
};

export default Home;
