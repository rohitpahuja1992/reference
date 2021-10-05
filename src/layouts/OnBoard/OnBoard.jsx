import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MatContainer from "../../components/MaterialUi/MatContainer";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core";
import PageHeading from "../../components/PageHeading";
import { fetchLoggedInUserInfo } from "../../actions/UserActions";
import AppHeader from "../../components/AppHeader";
// import { updateHeaderTitle } from "../../actions/AppHeaderActions";
// import { fetchRoles } from "../../actions/RoleActions";
// import { fetchRoleInfo } from "../../actions/DashboardActions";
import {
  //adminHomeDescription,
  adminHomeWelcomeMessage,
  // HOME,
} from "../../utils/Messages";
const useStyles = makeStyles((theme) => ({
  col: {
    padding: "10px",
  },
}));

const OnBoard = () => {
  const dispatch = useDispatch();
  const styles = useStyles();
  const loggedInInfo = useSelector((state) => state.User.loggedInUser.details);


  useEffect(() => {
    if (!loggedInInfo)
      //   dispatch(updateHeaderTitle(HOME));
      // dispatch(fetchRoles());
      // dispatch(fetchRoleInfo());
      dispatch(fetchLoggedInUserInfo());

  }, [dispatch, loggedInInfo]);


  return (
    <>
      <AppHeader />
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
          <Grid item xs={12} className={styles.col}>
            <Typography variant="h5">
              {`Your onboarding process not completed yet. Please connect with administrator. `}
            </Typography>
          </Grid>
        </Grid>
      </MatContainer>
    </>
  );
};

export default OnBoard;
