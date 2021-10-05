import React from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

import MatCard from "../../components/MaterialUi/MatCard";
import MatButton from "../../components/MaterialUi/MatButton";
import MatContainer from "../../components/MaterialUi/MatContainer";
import PageHeading from "../../components/PageHeading";
import DataTable from "../../components/DataTable";
import ManageQuestion from "../../components/ManageQuestion";
import SideSubMenu from "../../components/SideSubMenu";

import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import QuestionIcon from "../../assets/images/question-icon.svg";
import FormIcon from "../../assets/images/form-icon.svg";
import {
  GRIVANCE_CUR_VERSION,
  IMG_INTAKE,
  IMPLEMENT_QUESTIONS,
  SWITCH_TO_OTHER,
  UI_REQU,
  GRIEVANCE_UI_DESC,
  SUBMODULE,
  BACK_TO_GRIEVANCE,
  ADD_NEW_QUE
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

function createData(question, createdOn, createdBy, descriptions) {
  return { question, createdOn, createdBy, descriptions };
}

const rows = [
  createData(
    "What browser(s) is used?",
    "24/05/2020 08:00 AM",
    "Chay Levell",
    "This is a general question"
  ),
  createData(
    "Do users use multiple screens?",
    "16/05/2020 06:00 PM",
    "Maggie Cajka",
    "This is a general question"
  ),
  createData(
    "What is the average monthly case count?",
    "04/05/2020 12:30 PM",
    "Maggie Cajka",
    "This is a general question"
  ),
];

const cols = [
  { id: "question", label: "Question" },
  { id: "createdOn", label: "Created On" },
  { id: "createdBy", label: "Created By" },
  { id: "descriptions", label: "Descriptions", width: "160px" },
];

const tableConfig = {
  tableType: "tableWithIcon",
  iconType: "imgIcon",
  iconSource: QuestionIcon,
  iconWidth: "20",
  menuOptions: [
    {
      type: "link",
      icon: <EditIcon fontSize="small" />,
      label: "Edit Question",
      action: () => { },
    },
    {
      type: "link",
      icon: <VisibilityIcon fontSize="small" />,
      label: "View Question Details",
      action: () => { },
    },
    {
      type: "link",
      icon: <DeleteIcon fontSize="small" />,
      label: "Delete Question",
      action: () => { },
    },
  ],
};

const OobQuestions = () => {
  const [open, setOpen] = React.useState(false);
  const history = useHistory();
  const styles = useStyles();

  const openManageSubmoduleDialog = () => {
    setOpen(true);
  };

  const closeManageSubmoduleDialog = () => {
    setOpen(false);
  };

  const handleBackButton = () => {
    history.push(`/admin/oob-config/components`);
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
          label: IMG_INTAKE,
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

  return (
    <MatContainer>
      <Grid container wrap="nowrap">
        <Grid item className={styles.subMenuGrid}>
          <SideSubMenu options={subMenuOptions}></SideSubMenu>
        </Grid>
        <Grid item className={styles.grow}>
          <PageHeading
            heading={IMPLEMENT_QUESTIONS}
            action={
              <MatButton onClick={openManageSubmoduleDialog}>
                {ADD_NEW_QUE}
              </MatButton>
            }
          />
          <MatCard>
            <DataTable cols={cols} rows={rows} config={tableConfig} />
          </MatCard>
          <ManageQuestion
            handleClose={closeManageSubmoduleDialog}
            open={open}
          />
        </Grid>
      </Grid>
    </MatContainer>
  );
};

export default OobQuestions;
