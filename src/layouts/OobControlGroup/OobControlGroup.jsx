import React from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";

import MatCard from "../../components/MaterialUi/MatCard";
import MatButton from "../../components/MaterialUi/MatButton";
import PageHeading from "../../components/PageHeading";
import DataTable from "../../components/DataTable";
import CommonMenu from "../../components/CommonMenu";
import AddControlFieldDialog from "../../components/AddControlFieldDialog";
import MatContainer from "../../components/MaterialUi/MatContainer";
import SideSubMenu from "../../components/SideSubMenu";

import RateReviewIcon from "@material-ui/icons/RateReview";
import Grid from "@material-ui/core/Grid";

import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import FormIcon from "../../assets/images/form-icon.svg";

import { RESET_ADD_CONTROL_FIELD_IS_DONE } from "../../utils/AppConstants";
import {
  BACK_TO_GRIEVANCE,
  GRIVANCE_CUR_VERSION,
  CONTROLS,
  FIELDS,
  IMAGE_INTAKE,
  NO_RECORDS_MESSAGE,
  SWITCH_TO_OTHER,
  VIEW_ADD_FIELD,
  ADD_NEW_FIELDS,
} from "../../utils/Messages";

const cols = [
  { id: "fieldLabel", label: "Field Label" },
  { id: "fieldName", label: "Field Name" },
  { id: "fieldType", label: "Field Type" },
  { id: "isFieldRequired", label: "Required" },
  { id: "status", label: "Status" },
];

const useStyles = makeStyles((theme) => ({
  noDataCard: {
    minHeight: "200px",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
}));

const OobControlGroup = (props) => {
  const styles = useStyles();
  const { controlId } = useParams();
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [fieldType, setFieldType] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const history = useHistory();
  const activeControl = useSelector(
    (state) =>
      state.Control.data.list.filter((control) => control.id === +controlId)[0]
  );
  const fieldList = useSelector((state) =>
    state.ControlGroup.data.list.filter(
      (field) => field.controlId === +controlId
    )
  );

  const handleNewField = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseField = () => {
    setAnchorEl(null);
  };

  const openAddFieldDialog = (fieldType) => {
    dispatch({ type: RESET_ADD_CONTROL_FIELD_IS_DONE });
    setFieldType(fieldType);
    setOpen(true);
  };

  const closeAddFieldDialog = () => {
    setOpen(false);
  };

  const tableConfig = {
    tableType: "",
    actions: {
      icon: <RateReviewIcon color="primary" />,
      tooltipText: VIEW_ADD_FIELD,
      action: (data) => {
        // history.push(`/admin/app-setting/control-details`);
      },
    },
  };

  const controlMenuOptions = [
    {
      type: "link",
      icon: "",
      label: "Textbox",
      action: () => openAddFieldDialog("textbox"),
    },
    {
      type: "link",
      icon: "",
      label: "Textarea",
      action: () => openAddFieldDialog("textarea"),
    },
    {
      type: "link",
      icon: "",
      label: "Select",
      action: () => openAddFieldDialog("select"),
    },
    {
      type: "link",
      icon: "",
      label: "Option",
      action: () => openAddFieldDialog("option"),
    },
  ];

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
      action: () => {},
      isExpandable: false,
      children: [],
    },
    {
      type: "menu",
      label: IMAGE_INTAKE,
      action: () => {},
      isExpandable: false,
      children: [
        {
          type: "linkWithAvatar",
          icon: FormIcon,
          label: { FIELDS },
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
          icon: FormIcon,
          label: { CONTROLS },
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
      action: () => {},
      isExpandable: true,
      children: [
        {
          type: "linkWithIcon",
          icon: <ArrowRightIcon />,
          label: "v1.2.5",
          subText: "",
          action: () => {},
        },
        {
          type: "linkWithIcon",
          icon: <ArrowRightIcon />,
          label: "v1.2.4",
          subText: "",
          action: () => {},
        },
        {
          type: "linkWithIcon",
          icon: <ArrowRightIcon />,
          label: "v1.2.3",
          subText: "",
          action: () => {},
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
            heading={activeControl.name + " Control"}
            action={
              <MatButton onClick={handleNewField}>{ADD_NEW_FIELDS}</MatButton>
            }
          />
          {fieldList.length > 0 ? (
            <MatCard>
              <DataTable cols={cols} rows={fieldList} config={tableConfig} />
            </MatCard>
          ) : (
            <MatCard>
              <CardContent className={styles.noDataCard}>
                <Typography variant="h5">{NO_RECORDS_MESSAGE}</Typography>
              </CardContent>
            </MatCard>
          )}
          <AddControlFieldDialog
            formType={fieldType}
            handleClose={closeAddFieldDialog}
            open={open}
          />
          <CommonMenu
            anchorEl={anchorEl}
            open={isMenuOpen}
            activeRow={null}
            onClose={handleCloseField}
            options={controlMenuOptions}
          />
        </Grid>
      </Grid>
    </MatContainer>
  );
};

export default OobControlGroup;
