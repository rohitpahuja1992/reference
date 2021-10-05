import React from "react";

import MatButton from "../MaterialUi/MatButton";
import PageHeading from "../PageHeading";
import DataTable from "../DataTable";
import ManageFormFields from "../ManageFormFields";

// import EditIcon from "@material-ui/icons/Edit";
// import DeleteIcon from "@material-ui/icons/Delete";
// import VisibilityIcon from "@material-ui/icons/Visibility";
import RateReviewIcon from "@material-ui/icons/RateReview";
import FormIcon from "../../assets/images/form-icon.svg";
import { CardContent } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import MatInputField from "../MaterialUi/MatTextField";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import { SEARCH_FILTER } from "../../utils/Messages";

const useStyles = makeStyles((theme) => ({
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
  tableType: "tableWithIcon",
  iconType: "imgIcon",
  iconSource: FormIcon,
  iconWidth: "20",
  actions: {
    icon: <RateReviewIcon color="primary" />,
    tooltipText: "View & Update",
    action: (data) => {},
  },
  // menuOptions: [
  //   {
  //     type: "link",
  //     icon: <EditIcon fontSize="small" />,
  //     label: "Edit Control",
  //     action: () => {},
  //   },
  //   {
  //     type: "link",
  //     icon: <VisibilityIcon fontSize="small" />,
  //     label: "View Control Details",
  //     action: () => {},
  //   },
  //   {
  //     type: "link",
  //     icon: <DeleteIcon fontSize="small" />,
  //     label: "Delete Control",
  //     action: () => {},
  //   },
  // ],
};

const SectionTabContent = () => {
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
    "": "Search...",
    sectionName: "Search by section name...",
    status: "Select Status",
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

  return (
    <>
      <CardContent className={styles.searchFilter}>
        <PageHeading
          heading={
            <Grid container>
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
            </Grid>
          }
          action={
            <MatButton onClick={openSectionFormDialog}>
              Add New Section
            </MatButton>
          }
        />
      </CardContent>
      <DataTable cols={cols} rows={rows} config={tableConfig} />

      <ManageFormFields handleClose={closeSectionFormDialog} open={open} />
    </>
  );
};

export default SectionTabContent;
