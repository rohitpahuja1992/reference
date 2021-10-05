import React from "react";

import MatButton from "../MaterialUi/MatButton";
import PageHeading from "../PageHeading";
import DataTable from "../DataTable";
import CommonMenu from "../CommonMenu";
import ManageFormFields from "../ManageFormFields";

// import EditIcon from "@material-ui/icons/Edit";
// import DeleteIcon from "@material-ui/icons/Delete";
// import VisibilityIcon from "@material-ui/icons/Visibility";
import RateReviewIcon from "@material-ui/icons/RateReview";
import FormIcon from "../../assets/images/form-icon.svg";
import { CardContent } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import MatInputField from "../../components/MaterialUi/MatTextField";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";

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

function createData(fieldName, fieldType, section, parentSection, status) {
  return { fieldName, fieldType, section, parentSection, status };
}

const rows = [
  createData("Product", "dropdown", "......", "......", "ACTIVE"),
  createData(
    "Date of Occurrence",
    "calendar",
    "Good Cause Extension",
    "Intake",
    "ACTIVE"
  ),
  createData(
    "Requester First Name",
    "text",
    "Expedited Criteria",
    "......",
    "INACTIVE"
  ),
];

const cols = [
  { id: "fieldName", label: "Field Name" },
  { id: "fieldType", label: "Field Type" },
  { id: "section", label: "Section" },
  { id: "parentSection", label: "Parent Section" },
  { id: "status", label: "Status" },
];

const searchFilter = [
  { id: "fieldName", label: "Field Name" },
  { id: "fieldType", label: "Field Type" },
  { id: "section", label: "Section" },
  { id: "parentSection", label: "Parent Section" },
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

const FieldTabContent = () => {
  const styles = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [fieldLabel, setFieldLabel] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
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
    fieldName: "Search by field name...",
    fieldType: "Search by field type...",
    section: "Select Section",
    parentSection: "Select Parent Section",
    status: "Select Status",
  };

  const handleNewControl = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseControl = () => {
    setAnchorEl(null);
  };

  const openManageFormControlDialog = (label) => {
    setFieldLabel(label);
    setOpen(true);
  };

  const closeManageFormControlDialog = () => {
    setOpen(false);
  };

  let handleSearch = (e) => {
    const { name, value } = e.target;
    if (name === "searchBy" && value === "fieldName") {
      setInputs((inputs) => ({ ...inputs, search: "" }));
    }
    if (name === "searchBy" && value !== "fieldName") {
      setInputs((inputs) => ({ ...inputs, search: "All" }));
    }
    if (name === "search" && !searchBy) {
      setInputs((inputs) => ({ ...inputs, searchBy: "fieldName" }));
    }
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };

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
    <>
      <CardContent className={styles.searchFilter}>
        <PageHeading
          heading={
            <Grid container>
              <Grid item className={styles.filterDropdown}>
                <MatInputField
                  select
                  onChange={handleSearch}
                  label="Search or Filter By"
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
              {(!searchBy || searchBy === "fieldName") && (
                <Grid item className={styles.col}>
                  <MatInputField
                    value={search}
                    label={searchFieldLabel[searchBy]}
                    onChange={handleSearch}
                    name="search"
                  />
                </Grid>
              )}
              {searchBy && searchBy !== "fieldName" && (
                <Grid item className={styles.filterDropdown}>
                  <MatInputField
                    select
                    onChange={handleSearch}
                    label={searchFieldLabel[searchBy]}
                    name="search"
                    value={search}
                  >
                    <MenuItem value="All">All</MenuItem>
                    {searchBy === "fieldType" &&
                      controlMenuOptions.map((field, index) => (
                        <MenuItem key={index} value={field.label}>
                          {field.label}
                        </MenuItem>
                      ))}
                    {(searchBy === "section" ||
                      searchBy === "parentSection") && (
                      <>
                        <MenuItem value="Good Cause Extension">
                          Good Cause Extension
                        </MenuItem>
                        <MenuItem value="Intake">Intake</MenuItem>
                        <MenuItem value="Expedited Criteria">
                          Expedited Criteria
                        </MenuItem>
                      </>
                    )}
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
            <MatButton onClick={handleNewControl}>
              Add New Form Control
            </MatButton>
          }
        />
      </CardContent>
      <DataTable cols={cols} rows={rows} config={tableConfig} />

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
    </>
  );
};

export default FieldTabContent;
