import React from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";

import MatCard from "../../components/MaterialUi/MatCard";
import MatButton from "../../components/MaterialUi/MatButton";
import MatContainer from "../../components/MaterialUi/MatContainer";
import PageHeading from "../../components/PageHeading";
import DataTable from "../../components/DataTable";
import SideSubMenu from "../../components/SideSubMenu";
import ManageFormFields from "../../components/ManageFormFields";

import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import RateReviewIcon from "@material-ui/icons/RateReview";
import FormIcon from "../../assets/images/form-icon.svg";
import MatInputField from "../../components/MaterialUi/MatInputField";
import MenuItem from "@material-ui/core/MenuItem";
import {
  SEARCH,
  SEARCH_BY_SECTION,
  BACK_TO_GRIEVANCE,
  GRIVANCE_CUR_VERSION,
  IMAGE_INTAKE,
  FIELDS,
  SECTIONS,
  CONTROLS,
  SWITCH_TO_OTHER,
  IMG_INTAKE_SECTION,
  SEARCH_FILTER,
  ADD_NEW_SEC,
  SELECT_STATUS,
} from "../../utils/Messages";

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

function createData(sectionName, updatedBy, updatedOn, status) {
  return { sectionName, updatedBy, updatedOn, status };
}

const rows = [
  createData(
    "Good Cause Extension",
    "Chay Levell",
    "07/13/2020 11:45",
    "ACTIVE"
  ),
  createData("Intake", "Maria Fajardo", "07/13/2020 11:45", "ACTIVE"),
  createData(
    "Expedited Criteria",
    "Maggie Cajka",
    "07/13/2020 11:45",
    "INACTIVE"
  ),
];

const cols = [
  { id: "sectionName", label: "Section Name" },
  { id: "updatedBy", label: "Updated By" },
  { id: "updatedOn", label: "Updated On" },
  { id: "status", label: "Status" },
];

const searchFilter = [
  { id: "sectionName", label: "Section Name" },
  { id: "status", label: "Status" },
];

const tableConfig = {
  tableType: "",
  actions: {
    icon: <RateReviewIcon color="primary" />,
    tooltipText: "View & Update",
    action: (data) => { },
  },
};

const OobSections = () => {
  const history = useHistory();

  const styles = useStyles();
  const [open, setOpen] = React.useState(false);
  const [inputs, setInputs] = React.useState({
    searchBy: "",
    search: "",
  });
  const { searchBy, search } = inputs;

  const statusList = [
    { id: "ACTIVE", value: "ACTIVE" },
    { id: "INACTIVE", value: "INACTIVE" },
    { id: "TERMINATED", value: "TERMINATED" },
  ];
  const searchFieldLabel = {
    "": SEARCH,
    sectionName: SEARCH_BY_SECTION,
    status: SELECT_STATUS,
  };

  const openSectionFormDialog = () => {
    setOpen(true);
  };

  const closeSectionFormDialog = () => {
    setOpen(false);
  };

  let handleSearch = (e) => {
    const { name, value } = e.target;
    if (name === "searchBy" && value === "sectionName") {
      setInputs((inputs) => ({ ...inputs, search: "" }));
    }
    if (name === "searchBy" && value !== "sectionName") {
      setInputs((inputs) => ({ ...inputs, search: "All" }));
    }
    if (name === "search" && !searchBy) {
      setInputs((inputs) => ({ ...inputs, searchBy: "sectionName" }));
    }
    setInputs((inputs) => ({ ...inputs, [name]: value }));
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
        {
          type: "linkWithAvatar",
          icon: FormIcon,
          label: SECTIONS,
          subText: "",
          action: () => {
            handleSubMenuClick("Sections");
          },
        },
        {
          type: "linkWithAvatar",
          icon: FormIcon,
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
            heading={IMG_INTAKE_SECTION}
            action={
              <Grid container style={{ width: "auto" }}>
                <Grid item className={styles.filterDropdown}>
                  <MatInputField
                    select
                    onChange={handleSearch}
                    label={SEARCH_FILTER}
                    name="searchBy"
                    value={searchBy}
                  >
                    {searchFilter.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </MatInputField>
                </Grid>
                {(!searchBy || searchBy === "sectionName") && (
                  <Grid item className={styles.col}>
                    <MatInputField
                      value={search}
                      label={searchFieldLabel[searchBy]}
                      onChange={handleSearch}
                      name="search"
                    />
                  </Grid>
                )}
                {searchBy && searchBy !== "sectionName" && (
                  <Grid item className={styles.filterDropdown}>
                    <MatInputField
                      select
                      onChange={handleSearch}
                      label={searchFieldLabel[searchBy]}
                      name="search"
                      value={search}
                    >
                      <MenuItem value="All">All</MenuItem>
                      {searchBy === "status" &&
                        statusList.map((status) => (
                          <MenuItem key={status.id} value={status.id}>
                            {status.value}
                          </MenuItem>
                        ))}
                    </MatInputField>
                  </Grid>
                )}
                <Grid item style={{ display: "flex", alignItems: "center" }}>
                  <MatButton onClick={openSectionFormDialog}>
                    {ADD_NEW_SEC}
                  </MatButton>
                </Grid>
              </Grid>
            }
          />
          <MatCard>
            <DataTable cols={cols} rows={rows} config={tableConfig} />
          </MatCard>
          <ManageFormFields handleClose={closeSectionFormDialog} open={open} />
        </Grid>
      </Grid>
    </MatContainer>
  );
};

export default OobSections;
