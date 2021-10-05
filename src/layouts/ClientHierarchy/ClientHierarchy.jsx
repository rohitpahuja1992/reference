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
import Company from "./Company";
import BusinessLine from "./BusinessLine";
import EligibilityPlan from "./EligibilityPlan";
import EligibilityGroup from "./EligibilityGroup";
import ManageHierarchy from "./ManageHierarchy";
import SideSubMenu from "../../components/SideSubMenu";
import ModuleIcon from "../../assets/images/module-icon.svg";
import EnvironmentIcon from "../../assets/images/environment-icon.svg";
import CategoriesIcon from "../../assets/images/categories-icon.svg";
import VersionIcon from "../../assets/images/version_icon.svg";
import ManageIcon from "../../assets/images/manage-hierarchy.svg";
import { updateHeaderTitle } from "../../actions/AppHeaderActions";
import { updateEntityId } from "../../actions/AppHeaderActions";
import { fetchClientById } from "../../actions/ClientActions";
//import { resetClientInfo } from "../../actions/ClientActions";
import {
  fetchCompanyList,
  fetchBusinessLineList,
  fetchEligibilityPlanList,
  fetchEligibilityGroupList,
} from "../../actions/ClientHierarchyActions";
import { CLIENT_HIERARCHY, COMPANY, ELIGIBILITY_GROUP, ELIGIBILITY_PLAN, LINE_OF_BUSINESS, MANAGE_HIERARCHY } from "../../utils/Messages";
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

const ClientHierarchy = () => {
  let { path } = useRouteMatch();
  const history = useHistory();
  const dispatch = useDispatch();
  const styles = useStyles();
  const { clientId } = useParams();
  const featuresAssigned = useSelector(
    (state) => state.User.features
  );
  const deleteHierarchyDetails = useSelector(
    (state) => state.ClientHierarchy.deleteHierarchy
  );
  const uploadHierarchyDetails = useSelector(
    (state) => state.ClientHierarchy.uploadHierarchy
  );
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
    dispatch(fetchCompanyList(clientId));
    dispatch(fetchBusinessLineList(clientId));
    dispatch(fetchEligibilityPlanList(clientId));
    dispatch(fetchEligibilityGroupList(clientId));
    if (clientId) dispatch(fetchClientById(clientId));
    //     //dispatch(resetClientInfo());
  }, [dispatch, clientId]);

  useEffect(() => {
    if (deleteHierarchyDetails.isDone || uploadHierarchyDetails.isDone) {
      dispatch(fetchCompanyList(clientId));
      dispatch(fetchBusinessLineList(clientId));
      dispatch(fetchEligibilityPlanList(clientId));
      dispatch(fetchEligibilityGroupList(clientId));
      if (clientId) dispatch(fetchClientById(clientId));
    }
  }, [
    dispatch,
    clientId,
    deleteHierarchyDetails.isDone,
    uploadHierarchyDetails.isDone,
  ]);

  const subMenuOptions = [
    {
      type: "menu",
      label: CLIENT_HIERARCHY,
      action: () => { },
      isExpandable: false,
      children: [
        {
          type: "linkWithAvatar",
          icon: ModuleIcon,
          label: COMPANY,
          subText: "",
          action: () => {
            history.push(`/client/hierarchy/${clientId}`);
          },
          path: `/client/hierarchy/${clientId}`,
          activePages: [`/client/hierarchy/${clientId}`],
          children: [],
        },
        {
          type: "linkWithAvatar",
          icon: VersionIcon,
          label: LINE_OF_BUSINESS,
          subText: "",
          action: () => {
            history.push(`/client/hierarchy/${clientId}/line-of-business`);
          },
          path: `/client/hierarchy/${clientId}/line-of-business`,
          activePages: [`/client/hierarchy/${clientId}/line-of-business`],
          children: [],
        },
        {
          type: "linkWithAvatar",
          icon: EnvironmentIcon,
          label: ELIGIBILITY_PLAN,
          subText: "",
          action: () => {
            history.push(`/client/hierarchy/${clientId}/eligibility-plan`);
          },
          path: `/client/hierarchy/${clientId}/eligibility-plan`,
          activePages: [`/client/hierarchy/${clientId}/eligibility-plan`],
          children: [],
        },
        {
          type: "linkWithAvatar",
          icon: CategoriesIcon,
          label: ELIGIBILITY_GROUP,
          subText: "",
          action: () => {
            history.push(`/client/hierarchy/${clientId}/eligibility-group`);
          },
          path: `/client/hierarchy/${clientId}/eligibility-group`,
          activePages: [`/client/hierarchy/${clientId}/eligibility-group`],
          children: [],
        },
        {
          type: "linkWithAvatar",
          icon: ManageIcon,
          label: MANAGE_HIERARCHY,
          subText: "",
          visibleFor: "MHK",
          action: () => {
            history.push(`/client/hierarchy/${clientId}/manage-hierarchy`);
          },
          path: `/client/hierarchy/${clientId}/manage-hierarchy`,
          activePages: [`/client/hierarchy/${clientId}/manage-hierarchy`],
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
        if ((featuresAssigned.indexOf(UPDATE_CLIENT_HIERARCHY) === -1 || (clientInfo && clientInfo.isDeleted)) && menu.visibleFor === "MHK")
          return false;
        else
          return true;
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
            <Route exact path={`${path}`} component={Company} />
            <Route path={`${path}/line-of-business`} component={BusinessLine} />
            <Route
              path={`${path}/eligibility-plan`}
              component={EligibilityPlan}
            />
            <Route
              path={`${path}/eligibility-group`}
              component={EligibilityGroup}
            />
            <Route
              path={`${path}/manage-hierarchy`}
              component={ManageHierarchy}
            />
          </Switch>
        </Grid>
      </Grid>
    </MatContainer>
  );
};

export default ClientHierarchy;
