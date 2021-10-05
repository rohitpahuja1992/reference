import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core";
import MatContainer from "../../components/MaterialUi/MatContainer";
import PageHeading from "../../components/PageHeading";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";

import { fetchUserProfile } from "../../actions/UserActions";
import { fetchClients } from "../../actions/ClientActions";
import { fetchRoles } from "../../actions/RoleActions";
import { fetchUserAudit } from "../../actions/UserTimelineActions";
import { updateHeaderTitle } from "../../actions/AppHeaderActions";

import UserProfileDetails from "../../components/UserProfileDetails";
import UserAccessDetails from "../../components/UserAccessDetails";
import UserStatusDetails from "../../components/UserStatusDetails";
import UserTimelineDetails from "../../components/UserTimelineDetails";
import {
  USER_PROFILE,
  MY_PROFILE,
  handleUserProfileError
} from "../../utils/Messages";
import {
  DEFAULT_PAGE_SIZE_TIMELINE,
  DEFAULT_START_INDEX,
  RESET_USERAUDIT
} from "../../utils/AppConstants";
import MatCard from "../../components/MaterialUi/MatCard";
import TimeLineTable from "../../components/TimelineTable";

//import TimelineDetails from "../../components/TimelineDetails";
// import { UPDATE_HEADER_TEXT } from '../../utils/AppConstants';

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

const UserProfile = (props) => {
  const { email } = useParams();
  const styles = useStyles();
  const dispatch = useDispatch();
  const roleList = useSelector((state) => state.Role.data.list);
  // const clientList = useSelector((state) => state.MhkClient.data.list);
  const userData = useSelector((state) => state.User.profile.details);
  const userProfile = useSelector((state) => state.User.profile);
  const [apiError, setApiError] = useState(null);
  const [isDetailsUpdated, setDetailsUpdated] = useState(false);
  const [isAccessUpdated, setAccessUpdated] = useState(false);
  const loggedInUser = useSelector((state) => state.User.loggedInUser.details);

  const userAuditDetailsCount = useSelector(
    (state) => state.UserTimeline.totalElements
  );

  const userAuditDetails = useSelector(
    (state) => state.UserTimeline.userAuditDetails
  );


  const tableConfig={
    TotalRecords : userAuditDetailsCount,
    UserID : userData.id
  }
  

  useEffect(() => {
    if (loggedInUser.user_type === "MHK") {
      dispatch(updateHeaderTitle(USER_PROFILE));
    } else {
      dispatch(updateHeaderTitle(""));
    }

    if (email) dispatch(fetchUserProfile(email));
    dispatch(fetchClients("clientName"));
    dispatch(fetchRoles());
  }, [dispatch, email, loggedInUser.user_type]);

  useEffect(() => {
    if (userData.id) {
      dispatch({ type: RESET_USERAUDIT });
      dispatch(fetchUserAudit(userData.id,DEFAULT_START_INDEX, DEFAULT_PAGE_SIZE_TIMELINE ));
    }
  }, [dispatch, userData.id]);

  useEffect(() => {
    if (userProfile.error)
      setApiError(handleUserProfileError(userProfile.error));
    else
      setApiError(false);
  },
    [userProfile.error]
  );



  return (
    <MatContainer>
      {console.log(userAuditDetails)}
      {console.log("userAuditDetailsCount" + userAuditDetailsCount)}
      {userData && (
        <>
          {loggedInUser.user_type === "MHK" ? (
            <PageHeading
              heading={
                userData.firstName + " " + userData.lastName + `'s Profile`
              }
            />
          ) : (
              <PageHeading heading={MY_PROFILE} />
            )}
        </>
      )}
      <Grid container>
        {apiError && userProfile.isFetchCalled && (
          <Grid item xs={12} className={styles.col}>
            <Card className={apiError.messageType === "error" ? styles.errorCard : styles.warningCard}>
              <Typography variant="body2">
                {apiError.message}
              </Typography>
            </Card>
          </Grid>
        )}
        <Grid item xs={8}>
          {userData && (
            <UserProfileDetails
              isUpdated={isDetailsUpdated}
              fireOnUpdate={setDetailsUpdated}
              key={Math.random()}
              details={userData}
            />
          )}
          {userData && roleList.length > 0 && (
            <UserAccessDetails
              isUpdated={isAccessUpdated}
              fireOnUpdate={setAccessUpdated}
              key={Math.random()}
              details={userData}
            />
          )}
        </Grid>
        <Grid item xs={4}>
          {userData && <UserStatusDetails details={userData} />}
          {/* {userData && <UserTimelineDetails auditDetails={userAuditDetails} />} */}
          {userData && <MatCard className={styles.noneBackground}>     
      <TimeLineTable data={userAuditDetails} tableConfig={tableConfig}  />
    </MatCard>}
        </Grid>
      </Grid>
    </MatContainer>
  );
};

export default UserProfile;
