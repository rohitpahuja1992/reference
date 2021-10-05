import React from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
//import { useDispatch } from "react-redux";

import SideSubMenu from "../../components/SideSubMenu";
//import RateReviewIcon from "@material-ui/icons/RateReview";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import SubmoduleIcon from "../../assets/images/submodule-icon.svg";
import VersionHistoryIcon from "../../assets/images/version-history.svg";
import CompareIcon from "../../assets/images/compare-icon.svg";
import {
  VER_HISTORY,
  menuLabel,
  SUBMODULE,
  COMP_VERSION,
  versionsLabel,
} from "../../utils/Messages";
//import { fetchOOBModule } from "../../actions/OOBModuleActions";
//import { RESET_DEFAULTVERSION} from "../../utils/AppConstants";

const LeftDrawer = (props) => {
  const history = useHistory();
  //const dispatch = useDispatch();
  const localPath = "/admin/oob-config";
  //const versions = props.OOBModule.versions.filter(obj => obj.version !== props.version);
  const versionList = props.OOBModule.versions.sort((a, b) =>
    a.version < b.version ? 1 : -1
  );
  const { moduleId, oobModuleId, versionId } = useParams();

  // const handleBackButton = () => {
  //     if (props.label === 'OOB') {
  //         history.push(`/admin/oob-config`);
  //         dispatch({ type: RESET_DEFAULTVERSION });
  //         dispatch(fetchOOBModule("oob"));
  //     }
  //     else {
  //         history.push(`/admin/global-config`);
  //         dispatch({ type: RESET_DEFAULTVERSION });
  //         dispatch(fetchOOBModule("global"));
  //     }
  // };
  const subMenuOptions = [
    // {
    //     type: "linkToBack",
    //     label: "Back to " + props.label + " Module",
    //     action: handleBackButton,
    //     isExpandable: false,
    //     children: "",
    // },
    {
      type: "menu",
      label: menuLabel(props.OOBModule.module.moduleName, props.version),
      action: () => {},
      isExpandable: false,
      children: [
        {
          type: "linkWithAvatar",
          icon: SubmoduleIcon,
          label: SUBMODULE,
          subText: "",
          action: () => {
            history.push(
              `${localPath}/components/${moduleId}/${oobModuleId}/${versionId}`
            );
          },
          children: "",
        },
        {
          type: "linkWithAvatar",
          icon: CompareIcon,
          label: COMP_VERSION,
          subText: "",
          action: () => {
            history.push(
              `${localPath}/compare-versions/${moduleId}/${oobModuleId}/${versionId}`
            );
          },
          children: "",
        },
        {
          type: "linkWithAvatar",
          icon: VersionHistoryIcon,
          label: VER_HISTORY,
          subText: "",
          action: () => {
            history.push(
              `${localPath}/version-history/${moduleId}/${oobModuleId}/${versionId}`
            );
          },
          children: "",
        },
      ],
    },
    versionList.length > 0 &&
      !props.isVersionHistory && {
        type: "menu",
        icon: "",
        label: versionsLabel(props.OOBModule.module.moduleName),
        subText: "",
        action: () => {},
        isExpandable: true,
        children: versionList
          .sort((a, b) =>
            new Date(a.createdDate) < new Date(b.createdDate) ? 1 : -1
          )
          .map((otherVersion, key) => {
            return {
              type: "linkWithIcon",
              icon: <ArrowRightIcon />,
              label:
                otherVersion.oobModuleStatus === "DRAFT"
                  ? otherVersion.version + " - " + otherVersion.oobModuleStatus
                  : otherVersion.version,
              subText: "",
              action: () => {
                history.push(
                  `${localPath}/components/${moduleId}/${otherVersion.id}/${otherVersion.version}`
                );
              },
            };
          }),
      },
  ];

  // useEffect(() => {
  //   //if (props.label === "OOB") {
  //     setLocalPath("/admin/oob-config");
  //   // } else {
  //   //   setLocalPath("/admin/global-config");
  //   // }
  // }, []);

  return <SideSubMenu options={subMenuOptions}></SideSubMenu>;
};

export default LeftDrawer;
