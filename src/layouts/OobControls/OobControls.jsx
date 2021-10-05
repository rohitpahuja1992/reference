import React from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";

import Grid from "@material-ui/core/Grid";

import MatCard from "../../components/MaterialUi/MatCard";
import MatButton from "../../components/MaterialUi/MatButton";
import MatContainer from "../../components/MaterialUi/MatContainer";
import PageHeading from "../../components/PageHeading";
import DataTable from "../../components/DataTable";
import SideSubMenu from "../../components/SideSubMenu";
import CommonMenu from "../../components/CommonMenu";
import AddDynamicFields from "../../components/AddDynamicFields";
import FieldListTable from "../../components/FieldListTable";

import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import RateReviewIcon from "@material-ui/icons/RateReview";
import FormIcon from "../../assets/images/form-icon.svg";
import MatInputField from "../../components/MaterialUi/MatInputField";
import MenuItem from "@material-ui/core/MenuItem";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import CardContent from "@material-ui/core/CardContent";
import Tooltip from "../../components/MaterialUi/MatTooltip";
import Chip from "@material-ui/core/Chip";

import IconButton from "@material-ui/core/IconButton";

import CategoriesIcon from "../../assets/images/categories-icon.svg";
import {
  BACK_TO_GRIEVANCE,
  CONTROLS,
  FIRST_ADD_CONTROL,
  GRIVANCE_CUR_VERSION,
  IMAGE_INTAKE,
  SEARCH,
  SEARCH_BY_CONTROL,
  SELECT_SECTION,
  SELECT_STATUS,
  SWITCH_TO_OTHER,
  IMG_INTAKE_CONTROL,
  SEARCH_FILTER,
  GOOD_CAUSE_EXT,
  EXPEDITED_CRITERIA,
  ADD_NEW_CONTROL
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
  cardHeading: {
    paddingTop: "10px",
    paddingBottom: "10px",
    backgroundColor: theme.palette.primary.light,
  },
  cardHeadingSize: {
    fontSize: "16px",
  },
  grid: {
    display: "flex",
  },
  card: {
    width: "-webkit-fill-available",
  },
  cardTitle: {
    fontSize: "15px",
    fontWeight: 500,
    color: theme.palette.primary.dark,
    paddingBottom: "7px",
  },
  cardCaptionHighlight: {
    color: "rgba(0,0,0,0.7)",
    fontWeight: 500,
  },
  cardCaption: {
    color: "rgba(0,0,0,1)",
    paddingBottom: "7px",
  },
  description: {
    paddingTop: "0px",
    paddingBottom: "8px !important",
  },
}));

const controlData = [
  {
    controlType: "Text Field",
    controlLabel: "Document Name",
    controlProps: [
      {
        label: "Back End Name",
        value: "documentName",
      },
      {
        label: "Section",
        value: "Image Requests",
      },
      {
        label: "Status",
        value: "ACTIVE",
      },
    ],
  },
  {
    controlType: "Text Field",
    controlLabel: "Fax No",
    controlProps: [
      {
        label: "Back End Name",
        value: "faxNo",
      },
      {
        label: "Section",
        value: "Fax Forwarding",
      },
      {
        label: "Status",
        value: "ACTIVE",
      },
    ],
  },
  {
    controlType: "Text Field",
    controlLabel: "Notes",
    controlProps: [
      {
        label: "Back End Name",
        value: "notes",
      },
      {
        label: "Section",
        value: "Re-Route",
      },
      {
        label: "Status",
        value: "ACTIVE",
      },
    ],
  },
  {
    controlType: "Dropdown",
    controlLabel: "Request Type",
    controlProps: [
      {
        label: "Back End Name",
        value: "requestType",
      },
      {
        label: "Section",
        value: "Image Requests",
      },
      {
        label: "Status",
        value: "ACTIVE",
      },
    ],
  },
  {
    controlType: "Dropdown",
    controlLabel: "Template Type",
    controlProps: [
      {
        label: "Back End Name",
        value: "templateType",
      },
      {
        label: "Section",
        value: "Fax Forwarding",
      },
      {
        label: "Status",
        value: "ACTIVE",
      },
    ],
  },
  {
    controlType: "Fax Template",
    controlLabel: "Incomplete Fax Document",
    controlProps: [
      {
        label: "Template",
        value: `<Healthplan> was unable tp process your correspondence or appeal request because we are not able to read...`,
      },
      {
        label: "Status",
        value: "ACTIVE",
      },
    ],
  },
  {
    controlType: "Question",
    controlLabel: "What browser(s) is used?",
    controlProps: [
      {
        label: "Question Type",
        value: `General Question`,
      },
      {
        label: "Status",
        value: "ACTIVE",
      },
    ],
  },
  {
    controlType: "Question",
    controlLabel:
      "Are all faxes received in a central location? If not, describe the process.",
    controlProps: [
      {
        label: "Question Type",
        value: `Incoming Fax Question`,
      },
      {
        label: "Status",
        value: "ACTIVE",
      },
    ],
  },
  {
    controlType: "Question",
    controlLabel: "Who is the fax vendor?",
    controlProps: [
      {
        label: "Question Type",
        value: `Incoming Fax`,
      },
      {
        label: "Status",
        value: "ACTIVE",
      },
    ],
  },
];

const searchFilter = [
  // { id: "fieldName", label: "Field Name" },
  { id: "fieldType", label: "Control Type" },
  { id: "section", label: "Section" },
  // { id: "parentSection", label: "Parent Section" },
  { id: "status", label: "Status" },
];

const OobControls = () => {
  const history = useHistory();
  const controlList = useSelector((state) => state.Control.data.list);
  const styles = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [controlLabel, setControlLabel] = React.useState(null);
  const [controlId, setControlId] = React.useState(null);
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
    "": SEARCH,
    // fieldName: "Search by field name...",
    fieldType: SEARCH_BY_CONTROL,
    section: SELECT_SECTION,
    // parentSection: "Select Parent Section",
    status: SELECT_STATUS,
  };

  const handleNewControl = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseControl = () => {
    setAnchorEl(null);
  };

  const openDynamicFormDialog = (label, id) => {
    setControlLabel(label);
    setControlId(id);
    setOpen(true);
  };

  const closeDynamicFormDialog = () => {
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

  const controlMenuOptions =
    controlList.length > 0
      ? controlList.map((control) => {
        return {
          type: "link",
          icon: "",
          label: control.name,
          action: () => {
            openDynamicFormDialog(control.name, control.id);
          },
        };
      })
      : [
        {
          type: "label",
          icon: "",
          label: FIRST_ADD_CONTROL,
        },
      ];

  const handleBackButton = () => {
    history.goBack();
    // history.push(`/admin/oob-config/submodules`);
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
          label: CONTROLS,
          subText: "",
          action: () => {
            // handleSubMenuClick("Fields");
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
        // {
        //   type: "linkWithAvatar",
        //   icon: CategoriesIcon,
        //   label: "Controls",
        //   subText: "",
        //   action: () => {
        //     handleSubMenuClick("Controls");
        //   },
        // },
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
            heading={IMG_INTAKE_CONTROL}
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
                              {GOOD_CAUSE_EXT}
                            </MenuItem>
                            <MenuItem value="Intake">Intake</MenuItem>
                            <MenuItem value="Expedited Criteria">
                              {EXPEDITED_CRITERIA}
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
                <Grid item style={{ display: "flex", alignItems: "center" }}>
                  <MatButton onClick={handleNewControl}>
                    {ADD_NEW_CONTROL}
                  </MatButton>
                </Grid>
              </Grid>
            }
          />
          <Grid container>
            {controlData.map((control) => (
              <Grid item xs={4} className={styles.grid}>
                <MatCard className={styles.card}>
                  <CardHeader
                    style={{ paddingBottom: "3px" }}
                    action={
                      <Tooltip placement="left" arrow title="View &amp; Update">
                        <IconButton aria-label="settings" onClick={() => { }}>
                          <RateReviewIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                    }
                    title={
                      <>
                        <Chip
                          style={{ marginTop: "-10px", marginLeft: "-3px" }}
                          label={control.controlType}
                        />
                      </>
                    }
                  />
                  <CardContent className={styles.description}>
                    <Typography
                      className={styles.cardTitle}
                      variant="subtitle1"
                    >
                      {control.controlLabel}
                    </Typography>
                    {/* <Typography
                      className={styles.cardCaption}
                      variant="caption"
                      display="block"
                    >
                      <span className={styles.cardCaptionHighlight}>
                        Template:{" "}
                      </span>
                      {`<Healthplan> was unable tp process your correspondence or appeal request because we are not able to read the request Please resubmit the request with legible documentation via fax or mail.`}
                    </Typography> */}
                    {control.controlProps.map((list) => (
                      <Typography
                        className={styles.cardCaption}
                        variant="caption"
                        display="block"
                      >
                        <span className={styles.cardCaptionHighlight}>
                          {list.label}:{" "}
                        </span>
                        {list.value}
                      </Typography>
                    ))}
                  </CardContent>
                </MatCard>
              </Grid>
            ))}
          </Grid>

          {/* <FieldListTable /> */}
          {open && (
            <AddDynamicFields
              controlLabel={controlLabel}
              controlId={controlId}
              handleClose={closeDynamicFormDialog}
              open={open}
            />
          )}
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

export default OobControls;
