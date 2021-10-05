import React from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

import MatCard from "../../components/MaterialUi/MatCard";
import MatContainer from "../../components/MaterialUi/MatContainer";
import PageHeading from "../../components/PageHeading";
import SideSubMenu from "../../components/SideSubMenu";
import FieldTabContent from "../../components/FieldTabContent";
import SectionTabContent from "../../components/SectionTabContent";

import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import QuestionIcon from "../../assets/images/question-icon.svg";
import FormIcon from "../../assets/images/form-icon.svg";
import { Divider, Box, Tabs, Tab } from "@material-ui/core";
import {
  BACK_TO_GRIEVANCE,
  GRIVANCE_CUR_VERSION,
  SUBMODULE,
  SWITCH_TO_OTHER,
  UI_REQU,
  GRIEVANCE_UI_DESC,
  IMPLEMENT_QUESTIONS,
  IMG_INTAKE,
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

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
      style={{ minHeight: "120px" }}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const OobSubmodule = () => {
  const history = useHistory();
  const [tabValue, setTabValue] = React.useState(0);
  const styles = useStyles();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleBackButton = () => {
    history.push(`/admin/oob-config/components`);
  };

  const handleSubMenuClick = (linkType) => {
    history.push(`/admin/oob-config/fields-sections`);
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
        <Grid item xs className={styles.grow}>
          <PageHeading heading={IMG_INTAKE} />
          <MatCard>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="simple tabs example"
            >
              <Tab style={{ width: "50%", maxWidth: "none" }} label="Fields" />
              <Tab
                style={{ width: "50%", maxWidth: "none" }}
                label="Sections"
              />
            </Tabs>
            <Divider />
            <TabPanel value={tabValue} index={0}>
              <FieldTabContent />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <SectionTabContent />
            </TabPanel>
          </MatCard>
        </Grid>
      </Grid>
    </MatContainer>
  );
};

export default OobSubmodule;
