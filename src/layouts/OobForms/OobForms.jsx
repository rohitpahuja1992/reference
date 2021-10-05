import React from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

import MatCard from "../../components/MaterialUi/MatCard";
import MatButton from "../../components/MaterialUi/MatButton";
import MatContainer from "../../components/MaterialUi/MatContainer";
import PageHeading from "../../components/PageHeading";
import DataTable from "../../components/DataTable";
import SideSubMenu from "../../components/SideSubMenu";
import CommonMenu from "../../components/CommonMenu";
import ManageFormFields from "../../components/ManageFormFields";

import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import QuestionIcon from "../../assets/images/question-icon.svg";
import FormIcon from "../../assets/images/form-icon.svg";
import {
  BACK_TO_GRIEVANCE,
  GRIEVANCE_UI_DESC,
  GRIVANCE_CUR_VERSION,
  IMAGE_INTAKE,
  IMG_INTAKE,
  IMPLEMENT_QUESTIONS,
  SWITCH_TO_OTHER,
  UI_REQU,
  ADD_NEW_FORM_CON,
  SUBMODULE,
} from "../../utils/Messages";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
    paddingLeft: "270px",
  },
  subMenuGrid: {
    position: "fixed",
  },
}));

function createData(
  controlName,
  controlType,
  backEndName,
  mandatory,
  descriptions
) {
  return { controlName, controlType, backEndName, mandatory, descriptions };
}

const rows = [
  createData(
    "Product",
    "dropdown",
    "product",
    "Yes",
    "This is a dropdown field."
  ),
  createData(
    "Date of Occurrence",
    "calendar",
    "dateOfOccurrence",
    "Yes",
    "This is a calendar field."
  ),
  createData(
    "Requester First Name",
    "text",
    "requesterFirstName",
    "Yes",
    "This is a text field."
  ),
];

const cols = [
  { id: "controlName", label: "Control Name" },
  { id: "controlType", label: "Form Control" },
  { id: "backEndName", label: "Internal Name" },
  { id: "mandatory", label: "Mandatory" },
  { id: "descriptions", label: "Descriptions", width: "150px" },
];

const tableConfig = {
  tableType: "tableWithIcon",
  iconType: "imgIcon",
  iconSource: FormIcon,
  iconWidth: "20",
  menuOptions: [
    {
      type: "link",
      icon: <EditIcon fontSize="small" />,
      label: "Edit Control",
      action: () => { },
    },
    {
      type: "link",
      icon: <VisibilityIcon fontSize="small" />,
      label: "View Control Details",
      action: () => { },
    },
    {
      type: "link",
      icon: <DeleteIcon fontSize="small" />,
      label: "Delete Control",
      action: () => { },
    },
  ],
};

const OobForms = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [fieldLabel, setFieldLabel] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const history = useHistory();
  const styles = useStyles();

  const handleNewControl = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseControl = () => {
    setAnchorEl(null);
  };

  const handleBackButton = () => {
    history.push(`/admin/oob-config/components`);
  };

  const openManageFormControlDialog = (label) => {
    setFieldLabel(label);
    setOpen(true);
  };

  const closeManageFormControlDialog = () => {
    setOpen(false);
  };

  const handleSubMenuClick = (linkType) => {
    if (linkType === "Question") {
      history.push(`/admin/oob-config/questions`);
    } else if (linkType === "Form") {
      history.push(`/admin/oob-config/forms`);
    } else if (linkType === "Section") {
      history.push(`/admin/oob-config/sections`);
    } else if (linkType === "Table") {
      history.push(`/admin/oob-config/tables`);
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
      label: SUBMODULE,
      action: () => { },
      isExpandable: true,
      children: [
        {
          type: "linkWithAvatar",
          icon: QuestionIcon,
          label: IMPLEMENT_QUESTIONS,
          subText: "",
          action: () => {
            handleSubMenuClick("Question");
          },
        },
        {
          type: "linkWithAvatar",
          icon: FormIcon,
          label: IMAGE_INTAKE,
          subText: "",
          action: () => {
            handleSubMenuClick("Form");
          },
        },
        {
          type: "linkWithAvatar",
          icon: FormIcon,
          label: GRIEVANCE_UI_DESC,
          subText: "",
          action: () => {
            handleSubMenuClick("Section");
          },
        },
        {
          type: "linkWithAvatar",
          icon: FormIcon,
          label: UI_REQU,
          subText: "",
          action: () => {
            handleSubMenuClick("Table");
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

  const controlMenuOptions = [
    {
      type: "link",
      icon: "",
      label: "Text Field",
      action: () => openManageFormControlDialog("Text Field"),
    },
    {
      type: "link",
      icon: "",
      label: "Checkbox",
      action: () => openManageFormControlDialog("Checkbox"),
    },
    {
      type: "link",
      icon: "",
      label: "Radiobox",
      action: () => openManageFormControlDialog("Radiobox"),
    },
    {
      type: "link",
      icon: "",
      label: "Dropdown",
      action: () => openManageFormControlDialog("Dropdown"),
    },
    {
      type: "link",
      icon: "",
      label: "Hidden",
      action: () => openManageFormControlDialog("Hidden"),
    },
    {
      type: "link",
      icon: "",
      label: "Clickable Buttons",
      action: () => openManageFormControlDialog("Clickable Buttons"),
    },
    {
      type: "link",
      icon: "",
      label: "Calendar Field",
      action: () => openManageFormControlDialog("Calendar Field"),
    },
    {
      type: "link",
      icon: "",
      label: "Search Field",
      action: () => openManageFormControlDialog("Search Field"),
    },
    {
      type: "link",
      icon: "",
      label: "Textarea Field",
      action: () => openManageFormControlDialog("Textarea Field"),
    },
    {
      type: "link",
      icon: "",
      label: "Label",
      action: () => openManageFormControlDialog("Label"),
    },
    {
      type: "link",
      icon: "",
      label: "File Upload",
      action: () => openManageFormControlDialog("File Upload"),
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
            heading={IMG_INTAKE}
            action={
              <MatButton onClick={handleNewControl}>
                {ADD_NEW_FORM_CON}
              </MatButton>
            }
          />

          <MatCard>
            <DataTable cols={cols} rows={rows} config={tableConfig} />
          </MatCard>
          <ManageFormFields
            formLabel={fieldLabel}
            handleClose={closeManageFormControlDialog}
            open={open}
          />
          <CommonMenu
            anchorEl={anchorEl}
            open={isMenuOpen}
            activeRow={null}
            onClose={handleCloseControl}
            options={controlMenuOptions}
          />
        </Grid>
      </Grid>
    </MatContainer>
  );
};

export default OobForms;
