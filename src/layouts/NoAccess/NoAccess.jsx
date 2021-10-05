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
  LOGIN_USER_INACTIVE_TITLE,
  LOGIN_USER_TERMINATED_TITLE,
  LOGIN_USER_INACTIVE_MSG,
  // HOME,
} from "../../utils/Messages";
const useStyles = makeStyles((theme) => ({
  col: {
    padding: "10px",
  },
}));

const NoAccess = (props) => {
  const dispatch = useDispatch();
  const styles = useStyles();
  const loginAuthDetailsResponseCode = props.location.state.loginAuthDetailsResponseCode;


  return (
    <>
      <AppHeader />
      <MatContainer>
          <PageHeading
            heading={loginAuthDetailsResponseCode === 2306 || loginAuthDetailsResponseCode === "2306" ? LOGIN_USER_INACTIVE_TITLE : LOGIN_USER_TERMINATED_TITLE}
          />
        
        <Grid container>
          <Grid item xs={12} className={styles.col}>
            <Typography variant="h5">
              {LOGIN_USER_INACTIVE_MSG}
            </Typography>
          </Grid>
        </Grid>
      </MatContainer>
    </>
  );
};

export default NoAccess;
