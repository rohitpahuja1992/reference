import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";

import PageHeading from "../../../components/PageHeading";
import UpdateRoleDetails from "../../../components/UpdateRoleDetails";
import RoleStatusDetails from "../../../components/RoleStatusDetails";
import RoleFeatureAccess from "../../../components/RoleFeatureAccess";
// import RoleQueueAccess from "../../../components/RoleQueueAccess";
import { fetchFeatures } from "../../../actions/FeatureActions";
import { fetchRoleProfile } from "../../../actions/RoleActions";
//import { fetchQueues } from "../../../actions/QueueActions";
import {
  handleRoleDetailsError
} from "../../../utils/Messages";

const useStyles = makeStyles((theme) => ({
  col: {
    padding: "5px 10px",
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
    boxShadow: 'none !important',
    color: '#ffffff',
    padding: '12px 16px',
    marginBottom: '14px'
  },
}));

const RoleDetails = () => {
  const styles = useStyles();
  const { roleId } = useParams();
  const dispatch = useDispatch();
  const roleData = useSelector((state) => state.Role.profile.details);
  const roleProfile = useSelector((state) => state.Role.profile);
  const [apiError, setApiError] = useState(null);
  const [isDetailsUpdated, setDetailsUpdated] = useState(false);
  const [isFeaturesUpdated, setFeaturesUpdated] = useState(false);
  // const [isQueuesUpdated, setQueuesUpdated] = useState(false);

  useEffect(() => {
    if (roleId) dispatch(fetchRoleProfile(roleId));
    dispatch(fetchFeatures());
    // dispatch(fetchQueues());
  }, [dispatch, roleId]);

  useEffect(() => {
    if(roleProfile.error)
      setApiError(handleRoleDetailsError(roleProfile.error));
    else
      setApiError(false);
  },
    [roleProfile.error]
  );

  return (
    <>
      {roleData && <PageHeading heading={roleData.roleName + ` Role`} />}

      <Grid container>
        {apiError && roleProfile.isFetchCalled && (
          <Grid item xs={12} className={styles.col}>
            <Card className={apiError.messageType === "error" ? styles.errorCard : styles.warningCard}>
              <Typography variant="body2">
                {apiError.message}
              </Typography>
            </Card>
          </Grid>
        )}
        <Grid item xs={8} style={{ display: "flex" }}>
          {roleData && (
            <UpdateRoleDetails
              isUpdated={isDetailsUpdated}
              fireOnUpdate={setDetailsUpdated}
              key={Math.random()}
              details={roleData}
            />
          )}
        </Grid>
        <Grid item xs={4} style={{ display: "flex" }}>
          {roleData && <RoleStatusDetails details={roleData} />}
        </Grid>
        <Grid item xs={12}>
          {roleData && (
            <RoleFeatureAccess
              isUpdated={isFeaturesUpdated}
              fireOnUpdate={setFeaturesUpdated}
              key={Math.random()}
              details={roleData}
            />
          )}
        </Grid>
        {/* Temporary hide Role Queues Access later we can enable it.... */}
        {/* <Grid item xs={12}>
          {roleData && (
            <RoleQueueAccess
              isUpdated={isQueuesUpdated}
              fireOnUpdate={setQueuesUpdated}
              key={Math.random()}
              details={roleData}
            />
          )}
        </Grid> */}
      </Grid>
    </>
  );
};

export default RoleDetails;
