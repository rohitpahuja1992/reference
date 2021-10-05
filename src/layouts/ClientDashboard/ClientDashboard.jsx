import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouteMatch, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import { updateHeaderTitle } from "../../actions/AppHeaderActions";
import { updateEntityId } from "../../actions/AppHeaderActions";
//import { resetClientInfo } from "../../actions/ClientActions";
import PageHeading from "../../components/PageHeading";
// import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import MatContainer from "../../components/MaterialUi/MatContainer";
// import ModuleAnalyticsDashboard from "./ModuleAnalyticsDashboard";
import ClientModulesDashboard from "./ClientModulesDashboard";
import {
  fetchClientOobModuleAnalytics,
  // fetchClientGlobalModuleAnalytics,
} from "../../actions/ClientAnalyticsActions";
import { handleClientDashboardError, MOD_DASHBOARD } from "../../utils/Messages";

const useStyles = makeStyles((theme) => ({
  errorCard: {
    background: theme.palette.error.main,
    boxShadow: "none !important",
    color: "#ffffff",
    padding: "12px 16px",
    margin: "10px 8px 14px 8px",
  },
  warningCard: {
    background: theme.palette.warning.main,
    boxShadow: 'none !important',
    color: '#ffffff',
    padding: '12px 16px',
    marginBottom: '14px'
  },
}));

// const moduleDashboardData = [
//   {
//     moduleName: "GRIEVANCE",
//     awaitingSignOff: 42,
//     signedOff: 23,
//     approved: 30,
//   },
//   {
//     moduleName: "CTM",
//     awaitingSignOff: 60,
//     signedOff: 20,
//     approved: 10,
//   },
//   {
//     moduleName: "EXRM",
//     awaitingSignOff: 24,
//     signedOff: 30,
//     approved: 50,
//   },
//   {
//     moduleName: "LTSS",
//     awaitingSignOff: 16,
//     signedOff: 50,
//     approved: 40,
//   },
// ];

// const globalDashboardData = [
//   {
//     moduleName: "COMMON",
//     awaitingSignOff: 14,
//     signedOff: 44,
//     approved: 62,
//   },
//   {
//     moduleName: "GLOBAL",
//     awaitingSignOff: 8,
//     signedOff: 56,
//     approved: 20,
//   },
// ];

const ClientDashboard = () => {
  let { path } = useRouteMatch();
  const history = useHistory();
  const dispatch = useDispatch();
  const { clientId } = useParams();
  const styles = useStyles();
  const loggedInInfo = useSelector((state) => state.User.loggedInUser.details);
  const OobModuleAnalytics = useSelector(
    (state) => state.ClientAnalytics.OobModuleAnalytics.data
  );
  // const GlobalModuleAnalytics = useSelector(
  //   (state) => state.ClientAnalytics.GlobalModuleAnalytics.data
  // );
  const OobModuleAnalyticsError = useSelector(
    (state) => state.ClientAnalytics.OobModuleAnalytics.error
  );
  // const GlobalModuleAnalyticsError = useSelector(
  //   (state) => state.ClientAnalytics.GlobalModuleAnalytics.error
  // );
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    dispatch(updateHeaderTitle(""));
    if (clientId) {
      dispatch(updateEntityId(clientId));
      dispatch(fetchClientOobModuleAnalytics(clientId));
    }
    // dispatch(fetchClientGlobalModuleAnalytics(clientId));
    //dispatch(resetClientInfo());
  }, [dispatch, clientId]);

  // useEffect(() => {
  //   console.log(loggedInInfo)
  //   dispatch(updateHeaderTitle(""));
  //   if (clientId) {
  //     dispatch(updateEntityId(clientId));
  //     dispatch(fetchClientOobModuleAnalytics(clientId));
  //   } else if (loggedInInfo && loggedInInfo?.clients?.length > 0) {
  //     history.push({
  //       pathname: `${path}/dashboard/${loggedInInfo.clients[0].id}`,
  //     });
  //   }
  //   // dispatch(fetchClientGlobalModuleAnalytics(clientId));
  //   //dispatch(resetClientInfo());
  // }, [dispatch, clientId, loggedInInfo]);

  useEffect(() => {
    if (OobModuleAnalyticsError)
      setApiError(handleClientDashboardError(OobModuleAnalyticsError))
    else
      setApiError(false)
  }, [OobModuleAnalyticsError]);

  return (
    <MatContainer>
      {loggedInInfo && (
        <PageHeading
          heading={`Hello, ${loggedInInfo.firstName} ${loggedInInfo.lastName}`}
        />
      )}

      <Grid container>
        {apiError && (
          <Grid item xs={12} className={styles.error}>
            <Card className={apiError.messageType === "error" ? styles.errorCard : styles.warningCard}>
              <Typography variant="body2">
                {apiError.message}
              </Typography>
            </Card>
          </Grid>
        )}
        <Grid item xs={12}>
          {/* {OobModuleAnalytics && (
            <ModuleAnalyticsDashboard
              title={MOD_DASHBOARD}
              dashboardData={OobModuleAnalytics[0]}
            />
          )} */}
          {OobModuleAnalytics[0] && (
            <ClientModulesDashboard
              title={MOD_DASHBOARD}
              dashboardData2={OobModuleAnalytics[0]}
            />
          )}

        </Grid>
        {/* <Grid item xs={12}>
          {GlobalModuleAnalytics && (
            <ModuleAnalyticsDashboard
              title={GLOBAL_MODULE_DASH}
              dashboardData={GlobalModuleAnalytics[0]}
            />
          )}
        </Grid> */}
      </Grid>
    </MatContainer>
  );
};

export default ClientDashboard;
