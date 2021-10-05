import React, { useEffect } from "react";
import {
  Switch,
  Route,
  useRouteMatch,
  useHistory,
  useParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import MatContainer from "../../components/MaterialUi/MatContainer";
import ImportPortal from "./ImportPortal";
import Automation from "./Automation";
import TemplateLibrary from "./TemplateLibrary";
// import LetterEditor from "./LetterEditor";
import SideSubMenu from "../../components/SideSubMenu";
import ModuleIcon from "../../assets/images/module-icon.svg";
import EnvironmentIcon from "../../assets/images/environment-icon.svg";
import VersionIcon from "../../assets/images/version_icon.svg";

import { updateHeaderTitle } from "../../actions/AppHeaderActions";
import { updateEntityId } from "../../actions/AppHeaderActions";
// import { fetchClientById } from "../../actions/ClientActions";
// import {
//   fetchCompanyList,
//   fetchBusinessLineList,
//  } from "../../actions/ClientHierarchyActions";
import {
  CLIENT_LETTERS,
  IMPORT_PORTAL,
  AUTOMATION,
  TEMPLATE_LIBRARY,
} from "../../utils/Messages";
import { UPDATE_CLIENT_HIERARCHY } from "../../utils/FeatureConstants";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
    paddingLeft: "270px",
  },
  subMenuGrid: {
    position: "absolute",

  },
}));

const ClientLetters = () => {
  let { path } = useRouteMatch();
  const history = useHistory();
  const dispatch = useDispatch();
  const styles = useStyles();
  const { clientId } = useParams();
  const featuresAssigned = useSelector((state) => state.User.features);

  const loggedInUserData = useSelector(
    (state) => state.User.loggedInUser.details
  );
  const clientInfo = useSelector(
    (state) => state.Client.clientByIdDetails.details
  );
  // const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(updateHeaderTitle(""));
    dispatch(updateEntityId(clientId));
    //dispatch(fetchCompanyList(clientId));
    //dispatch(fetchBusinessLineList(clientId));
    //if (clientId) dispatch(fetchClientById(clientId));
    //     //dispatch(resetClientInfo());
  }, [dispatch, clientId]);

  const subMenuOptions = [
    {
      type: "menu",
      label: CLIENT_LETTERS,
      action: () => { },
      isExpandable: false,
      children: [
        {
          type: "linkWithAvatar",
          icon: ModuleIcon,
          label: IMPORT_PORTAL,
          subText: "",
          action: () => {
            history.push(`/client/letters/${clientId}`);
          },
          path: `/client/letters/${clientId}`,
          activePages: [`/client/letters/${clientId}`],
          children: [],
        },
        {
          type: "linkWithAvatar",
          icon: VersionIcon,
          label: AUTOMATION,
          subText: "",
          action: () => {
            history.push(`/client/letters/${clientId}/automation`);
          },
          path: `/client/letters/${clientId}/automation`,
          activePages: [`/client/letters/${clientId}/automation`],
          children: [],
        },
        {
          type: "linkWithAvatar",
          icon: EnvironmentIcon,
          label: TEMPLATE_LIBRARY,
          subText: "",
          action: () => {
            history.push(`/client/letters/${clientId}/template-library`);
          },
          path: `/client/letters/${clientId}/template-library`,
          activePages: [`/client/letters/${clientId}/template-library`],
          children: [],
        },
      ],
    },
  ];

  const subMenuWithPermission = subMenuOptions.map((data) => {
    const filteredMenu = data.children.filter((menu) => {
      if (
        loggedInUserData &&
        loggedInUserData.user_type === "CLIENT" &&
        menu.visibleFor === "MHK"
      ) {
        return false;
      } else {
        if (
          (featuresAssigned.indexOf(UPDATE_CLIENT_HIERARCHY) === -1 ||
            (clientInfo && clientInfo.isDeleted && clientInfo.clientStatus !== 1)) &&
          menu.visibleFor === "MHK"
        )
          return false;
        else return true;
      }
    });

    return { ...data, children: filteredMenu };
  });

  return (
    <MatContainer>
      <Grid container wrap="nowrap">
        <Grid item className={styles.subMenuGrid}>
          <SideSubMenu options={subMenuWithPermission}></SideSubMenu>
        </Grid>
        <Grid item className={styles.grow}>
          <Switch>
            <Route exact path={`${path}`} component={ImportPortal} />

            <Route path={`${path}/automation`} component={Automation} />
            <Route
              path={`${path}/template-library`}
              component={TemplateLibrary}
            />

          </Switch>
        </Grid>
      </Grid>
    </MatContainer>
  );
};

export default ClientLetters;
