import React from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";

import Grid from "@material-ui/core/Grid";

import MatCard from "../../components/MaterialUi/MatCard";
import MatButton from "../../components/MaterialUi/MatButton";
import MatContainer from "../../components/MaterialUi/MatContainer";
import PageHeading from "../../components/PageHeading";
import DataTable from "../../components/DataTable";
import SideSubMenu from "../../components/SideSubMenu";

import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import RateReviewIcon from "@material-ui/icons/RateReview";
import FormIcon from "../../assets/images/form-icon.svg";
import AddControl from "../../components/AddControl";
import ImportControls from "../../components/ImportControls/ImportControls";
import CategoriesIcon from "../../assets/images/categories-icon.svg";

import {
  RESET_OOB_CONTROL_IS_FETCH_DONE,
  RESET_ADD_CONTROL_IS_DONE,
  RESET_ADD_OOB_CONTROL_IS_DONE,
} from "../../utils/AppConstants";
import { ADD_NEW_CONTROL, BACK_TO_GRIEVANCE, CONTROLS, FIELDS, GRIVANCE_CUR_VERSION, IMAGE_INTAKE, IMG_INTAKE_CONTROLS, IMP_MASTER_CONTROLS, SWITCH_TO_OTHER } from "../../../utils/Messages";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
    paddingLeft: "270px",
  },
  subMenuGrid: {
    position: "fixed",
  },
  searchFilter: {
    padding: "8px 8px 0px",
  },
  moreChip: {
    "& .MuiChip-label": {
      paddingLeft: "0px",
    },
  },
  col: {
    paddingRight: "10px",
  },
  filterDropdown: {
    paddingRight: "10px",
    minWidth: "200px",
  },
  noDataCard: {
    minHeight: "200px",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
}));

const cols = [
  { id: "name", label: "Control Name" },
  { id: "internalName", label: "Internal Name" },
  { id: "noOfFields", label: "Number of Fields" },
  { id: "status", label: "Status" },
];

const OobControls = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const styles = useStyles();
  const [open, setOpen] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [importControlKey, setImportControlKey] = React.useState(0);
  const controlList = useSelector((state) => state.OobControl.data.list);

  const openControlFormDialog = () => {
    dispatch({ type: RESET_ADD_CONTROL_IS_DONE });
    dispatch({ type: RESET_ADD_OOB_CONTROL_IS_DONE });
    setOpen(true);
  };

  const closeControlFormDialog = () => {
    setOpen(false);
  };

  const openImportControlDialog = () => {
    dispatch({ type: RESET_OOB_CONTROL_IS_FETCH_DONE });
    setIsOpen(true);
    setImportControlKey((count) => count + 1);
  };

  const closeImportControlDialog = () => {
    setIsOpen(false);
  };

  const tableConfig = {
    tableType: "",
    actions: {
      icon: <RateReviewIcon color="primary" />,
      tooltipText: "View & Add Fields",
      action: (data) => {
        history.push(`/admin/oob-config/control-group/${data.id}`);
      },
    },
  };

  const handleBackButton = () => {
    history.push(`/admin/oob-config/components`);
  };

  const handleSubMenuClick = (linkType) => {
    if (linkType === "Fields") {
      history.push(`/admin/oob-config/fields`);
    } else if (linkType === "Sections") {
      history.push(`/admin/oob-config/sections`);
    } else if (linkType === "Controls") {
      history.push(`/admin/oob-config/controls`);
    }
  };

  const subMenuOptions = [
    {
      type: "linkToBack",
      label: BACK_TO_GRIEVANCE,
      action: handleBackButton,
      isExpandable: false,
      children: [],
    },
    {
      type: "menu",
      label: GRIVANCE_CUR_VERSION,
      action: () => { },
      isExpandable: false,
      children: [],
    },
    {
      type: "menu",
      label: IMAGE_INTAKE,
      action: () => { },
      isExpandable: false,
      children: [
        {
          type: "linkWithAvatar",
          icon: FormIcon,
          label: FIELDS,
          subText: "",
          action: () => {
            handleSubMenuClick("Fields");
          },
        },
        // {
        //   type: "linkWithAvatar",
        //   icon: FormIcon,
        //   label: "Sections",
        //   subText: "",
        //   action: () => {
        //     handleSubMenuClick("Sections");
        //   },
        // },
        {
          type: "linkWithAvatar",
          icon: CategoriesIcon,
          label: CONTROLS,
          subText: "",
          action: () => {
            handleSubMenuClick("Controls");
          },
        },
      ],
    },
    {
      type: "menu",
      icon: "",
      label: SWITCH_TO_OTHER,
      subText: "",
      action: () => { },
      isExpandable: true,
      children: [
        {
          type: "linkWithIcon",
          icon: <ArrowRightIcon />,
          label: "v1.2.5",
          subText: "",
          action: () => { },
        },
        {
          type: "linkWithIcon",
          icon: <ArrowRightIcon />,
          label: "v1.2.4",
          subText: "",
          action: () => { },
        },
        {
          type: "linkWithIcon",
          icon: <ArrowRightIcon />,
          label: "v1.2.3",
          subText: "",
          action: () => { },
        },
      ],
    },
  ];

  return (
    <MatContainer>
      <Grid container wrap="nowrap">
        <Grid item className={styles.subMenuGrid}>
          <SideSubMenu options={subMenuOptions}></SideSubMenu>
        </Grid>
        <Grid item xs className={styles.grow}>
          <PageHeading
            heading={IMG_INTAKE_CONTROLS}
            action={
              <Grid container style={{ width: "auto" }}>
                <Grid item className={styles.filterDropdown}>
                  <MatButton color="primary" onClick={openImportControlDialog}>
                    {IMP_MASTER_CONTROLS}
                  </MatButton>
                </Grid>
                <Grid item style={{ display: "flex", alignItems: "center" }}>
                  <MatButton onClick={openControlFormDialog}>
                    {ADD_NEW_CONTROL}
                  </MatButton>
                </Grid>
              </Grid>
            }
          />
          <MatCard>
            <DataTable cols={cols} rows={controlList} config={tableConfig} />
          </MatCard>
          <ImportControls
            key={importControlKey}
            handleClose={closeImportControlDialog}
            open={isOpen}
          />
          <AddControl
            openFrom="oobControl"
            handleClose={closeControlFormDialog}
            open={open}
          />
        </Grid>
      </Grid>
    </MatContainer>
  );
};

export default OobControls;
