import React, { useEffect } from "react";
import { Switch, Route, useRouteMatch, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import MatContainer from "../../components/MaterialUi/MatContainer";
import SideSubMenu from "../../components/SideSubMenu";
import Role from "../Role";
import Features from "./Features";
//import Queues from "./Queues";
import Permissions from "./Permissions";
import RoleDetails from "./RoleDetails";
import FeatureDetails from "./FeatureDetails";
//import QueueDetails from "./QueueDetails";
import RoleIcon from "../../assets/images/role-permission-icon.svg";
import FeatureIcon from "../../assets/images/feature-icon.svg";
// import QueueIcon from "../../assets/images/queue-icon.svg";
import { updateHeaderTitle } from "../../actions/AppHeaderActions";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  ROLE_AND_PERMISSION,
  ROLES,
  FEATURES,
  //QUENES
} from "../../utils/Messages";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
    paddingLeft: "270px",
    [theme.breakpoints.down("md")]: {
      paddingLeft: "0px",
    },
  },
  subMenuGrid: {
    position: "fixed",
    [theme.breakpoints.down("md")]: {
      position: "static"
    },
  },

}));


const UserAccessControl = () => {
  let { path } = useRouteMatch();
  const history = useHistory();
  const dispatch = useDispatch();
  const styles = useStyles();
  const theme = useTheme();
  const mdScreen = useMediaQuery(theme.breakpoints.down('md'));
  useEffect(() => {
    dispatch(updateHeaderTitle(ROLE_AND_PERMISSION));
  }, [dispatch]);

  //Role & Permission subMenu section...
  const subMenuOptions = [
    {
      type: "menu",
      label: ROLE_AND_PERMISSION,
      action: () => { },
      isExpandable: false,
      children: [
        {
          type: "linkWithAvatar",
          icon: RoleIcon,
          label: ROLES,
          subText: "",
          action: () => {
            history.push("/admin/access-control");
          },
          path: "/admin/access-control",
          activePages: [
            "/admin/access-control",
            "/admin/access-control/role-details",
          ],
          children: [],
        },
        {
          type: "linkWithAvatar",
          icon: FeatureIcon,
          label: FEATURES,
          subText: "",
          action: () => {
            history.push("/admin/access-control/features");
          },
          path: "/admin/access-control/features",
          activePages: [
            "/admin/access-control/features",
            "/admin/access-control/feature-details",
          ],
          children: [],
        },
        //Temporary hide Queues later might be we can enable it....
        // {
        //   type: "linkWithAvatar",
        //   icon: QueueIcon,
        //   label: QUENES,
        //   subText: "",
        //   action: () => {
        //     history.push("/admin/access-control/queues");
        //   },
        //   path: "/admin/access-control/queues",
        //   activePages: [
        //     "/admin/access-control/queues",
        //     "/admin/access-control/queue-details",
        //   ],
        //   children: [],
        // },
        // {
        //     type: 'linkWithAvatar',
        //     icon: QueueIcon,
        //     label: 'Permissions',
        //     subText: '',
        //     action: () => {history.push('/admin/access-control/permissions')},
        //     children: []
        // }
      ],
    },
  ];

  return (
    <MatContainer>
      <Grid container wrap={"nowrap"}>
        <Grid item className={styles.subMenuGrid}>
          <SideSubMenu options={subMenuOptions}></SideSubMenu>

        </Grid>
        <Grid item className={styles.grow}>
          <Switch>
            <Route exact path={`${path}`} component={Role} />
            <Route
              exact
              path={`${path}/role-details/:roleId`}
              component={RoleDetails}
            />
            <Route exact path={`${path}/features`} component={Features} />
            <Route
              exact
              path={`${path}/feature-details/:featureId`}
              component={FeatureDetails}
            />
            {/* <Route exact path={`${path}/queues`} component={Queues} />
            <Route
              exact
              path={`${path}/queue-details/:queueId`}
              component={QueueDetails}
            /> */}
            <Route exact path={`${path}/permissions`} component={Permissions} />
          </Switch>
        </Grid>
      </Grid>
    </MatContainer>
  );
};

export default UserAccessControl;
