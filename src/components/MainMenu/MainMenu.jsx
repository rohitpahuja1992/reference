import React, { useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Box from "@material-ui/core/Box";
import MhkLogo from "../../assets/images/mhk-cmt-logo.png";
import ModuleIcon from "../../assets/images/module-icon.svg";
// import GlobalIcon from "../../assets/images/global-configuration.svg";
import ClientIcon from "../../assets/images/client-icon.svg";
import { fetchClientById } from "../../actions/ClientActions";
// import HierarchyIcon from "../../assets/images/hierarchy-icon.svg";
import OobIcon from "../../assets/images/oob-icon.svg";
import HomeIcon from "../../assets/images/home-icon.svg";
import UsersIcon from "../../assets/images/users-icon.svg";
import DeployIcon from "../../assets/images/deployment.svg";
import RolePermissionIcon from "../../assets/images/role-permission-icon.svg";
import AppSettingsIcon from "../../assets/images/app-settings-icon.svg";
//import GlobalConfigurationIcon from "../../assets/images/global-configuration.svg";
import LetterIcon from "../../assets/images/letters.svg";

import "./mainMenu.styles.scss";

import {
  CLIENTS,
  USERS,
  ROLE_AND_PERMISSION,
  OUT_OF_BOX_CONF,
  //GLOBAL_CONF,
  APP_SETTINGS,
  GO_BACK_TO_ADMIN,
  CLIENT_DASH,
  CLIENT_PROF,
  // CLIENT_HIERARCHY,
  MODULES,
  // GLOBAL_MODULES,
  CONF_DEPLOYMENT,
  LETTERS,
} from "../../utils/Messages";
import {
  VIEW_LIST_OF_CLIENTS,
  // VIEW_CLIENT_HIERARCHY,
  VIEW_CLIENT_PROFILE,
  VIEW_CONFIGURATION_DEPLOYMENT,
  VIEW_LETTERS,
  VIEW_USER_LIST,
  VIEW_ROLE_PERMISSION,
  VIEW_OOB_GLOBAL_CONFIG,
  VIEW_APP_SETTINGS,

} from "../../utils/FeatureConstants";

function MainMenu() {
  const history = useHistory();
  const dispatch = useDispatch();
  let { url } = useRouteMatch();
  // const {environment} = useParams();
  const clientId = useSelector((state) => state.Header.entityId);
  const loggedInUserData = useSelector(
    (state) => state.User.loggedInUser.details
  );
  const featuresAssigned = useSelector((state) => state.User.features);
  // console.log("featuresAssigned", featuresAssigned)
  const clientInfo = useSelector(
    (state) => state.Client.clientByIdDetails.details
  );
  // const getClientId = (url) => {
  //   let path = url.split("/");
  //   return path[5];
  // };

  // const clientId = getClientId(window.location.href);

  const menus = [
    {
      label: "Home",
      path: `/admin`,
      icon: HomeIcon,
      activeFeature: "ALL",
      activePages: ["/admin"],
    },
    {
      label: CLIENTS,
      path: `${url}/clients`,
      icon: ClientIcon,
      activeFeature: VIEW_LIST_OF_CLIENTS,
      activePages: ["/admin/clients"],
    },
    {
      label: USERS,
      path: `${url}/users`,
      icon: UsersIcon,
      activeFeature: VIEW_USER_LIST,
      activePages: ["/admin/users", "/admin/user-profile"],
    },
    {
      label: ROLE_AND_PERMISSION,
      path: `${url}/access-control`,
      icon: RolePermissionIcon,
      activeFeature: VIEW_ROLE_PERMISSION,
      activePages: ["admin/access-control"],
    },
    {
      label: OUT_OF_BOX_CONF,
      path: `${url}/oob-config`,
      icon: OobIcon,
      activeFeature: VIEW_OOB_GLOBAL_CONFIG,
      activePages: ["admin/oob-config"],
    },

    {
      label: APP_SETTINGS,
      path: `${url}/app-setting`,
      icon: AppSettingsIcon,
      activeFeature: VIEW_APP_SETTINGS,
      activePages: ["admin/app-setting"],
    },
  ];

  const clientMenus = [
    {
      label: GO_BACK_TO_ADMIN,
      path: `/admin/clients`,
      visibleFor: "MHK",
      activeFeature: "ALL",
      icon: HomeIcon,
    },
    {
      label: CLIENT_DASH,
      path: `${url}/dashboard/${clientId}`,
      icon: UsersIcon,
      activeFeature: "ALL",
      activePages: [`${url}/dashboard/${clientId}`],
    },
    {
      label: CLIENT_PROF,
      path: `${url}/profile/${clientId}`,
      icon: ClientIcon,
      activeFeature: VIEW_CLIENT_PROFILE,
      activePages: [`${url}/profile/${clientId}`],
    },
    // {
    //   label: CLIENT_HIERARCHY,
    //   path: `${url}/hierarchy/${clientId}`,
    //   icon: HierarchyIcon,
    //   activeFeature: VIEW_CLIENT_HIERARCHY,
    //   activePages: [`hierarchy/${clientId}`],
    // },
    {
      label: MODULES,
      path: `${url}/modules/${clientId}`,
      icon: ModuleIcon,
      activeFeature: "ALL",
      activePages: [`${url}/modules/${clientId}`, `${url}/components/OOB`],
    },

    {
      label: CONF_DEPLOYMENT,
      path: `${url}/config-deploy/${clientId}`,
      //visibleFor: "MHK",
      icon: DeployIcon,
      activeFeature: (!clientInfo?.isDeleted && clientInfo?.clientStatus !== 1) && VIEW_CONFIGURATION_DEPLOYMENT,
      activePages: [`config-deploy/${clientId}`],
    },
    {
      label: LETTERS,
      path: `${url}/letters/${clientId}`,
      //visibleFor: "ALL",
      icon: LetterIcon,
      activeFeature: (!clientInfo?.isDeleted && clientInfo?.clientStatus !== 1) && VIEW_LETTERS,
      //activeFeature: VIEW_CLIENT_HIERARCHY,
      activePages: [`letters/${clientId}`],
    },
  ];

  let navigateTo = (path) => {
    history.push(path);
  };

  const handleLogoClick = () => {
    if (loggedInUserData.user_type === "CLIENT") {
      history.push(`/client/dashboard/${clientId}`);
    } else {
      history.push(`/admin`);
    }
  };

  const handleActiveClass = (activePages, pagePath) => {
    if (activePages) {
      let urlPath = window.location.pathname;
      let isPageActive = activePages.some((value) => {
        return (
          (pagePath === value && urlPath === value) ||
          (pagePath !== value && urlPath.indexOf(value) >= 0)
        );
      });
      return isPageActive ? "active" : "";
    } else {
      return "";
    }
  };
  useEffect(() => {
    if (clientId) dispatch(fetchClientById(clientId));
  }, [dispatch, clientId]);


  return (
    <Box
      color="primary.contrastText"
      bgcolor="primary.dark"
      className="menuContainer"
    >
      <div className="logo">
        {/* <Link to="/"> */}
        <img onClick={handleLogoClick} src={MhkLogo} alt="MHK Logo" />
        {/* </Link> */}
      </div>
      <div className="menus">
        <ul>
          {(url === "/client"
            ? clientMenus.filter((menu) => {
              if (
                loggedInUserData.user_type === "CLIENT" &&
                menu.visibleFor === "MHK"
              ) {
                return false;
              } else {
                return true;
              }
            })
            : menus
          )
            // eslint-disable-next-line array-callback-return
            .map((prop, key) => {
              if (
                prop.activeFeature === "ALL" ||
                featuresAssigned.indexOf(prop.activeFeature) !== -1
              ) {
                return (
                  <li
                    className={handleActiveClass(prop.activePages, prop.path)}
                    key={key}
                    onClick={() => navigateTo(prop.path)}
                  >
                    <span className="menuIcon">
                      <img src={prop.icon} alt={prop.label + " icon"} />
                    </span>
                    <span className="menuLabel">{prop.label}</span>
                  </li>
                );
              }
            })}
        </ul>
      </div>
    </Box>
  );
}

export default MainMenu;
