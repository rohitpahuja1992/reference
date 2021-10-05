import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "@material-ui/icons/Delete";
import { CardContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
//import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";

import RateReviewIcon from "@material-ui/icons/RateReview";
import VisibilityIcon from "@material-ui/icons/Visibility";
//import DeleteIcon from "@material-ui/icons/Delete";
import Search from "../../components/Search";
import MatCard from "../../components/MaterialUi/MatCard";
import MatButton from "../../components/MaterialUi/MatButton";
//import MatInputField from "../../components/MaterialUi/MatInputField";
import PageHeading from "../../components/PageHeading";
import DataTable from "../../components/DataTable";
//import AddMasterSubmodule from "../../components/ManageAppSettings/AddMasterSubmodule";
import AddMasterComponent from "../../components/ManageAppSettings/AddMasterComponent";
//import UpdateMasterSubmodule from "../../components/ManageAppSettings/UpdateMasterSubmodule";

import {
  SET_DEFAULT_STARTINDEX,
  DEFAULT_START_INDEX,
  DEFAULT_PAGE_SIZE,
  RESET_FIELD_DETAILS,
  SHOW_SNACKBAR_ACTION
} from "../../utils/AppConstants";
import {
  resetDuplicateError,
  fetchSubmoduleById,
  deleteMasterSubmodule,
  fetchMasterSubmodule,
  addMasterSubmodule,
  updateMasterSubmodule
} from "../../actions/MasterSubmoduleActions";
import { updateFieldData, updateFieldProperty } from "../../actions/MasterComponentActions";
import { showMessageDialog } from "../../actions/MessageDialogActions";
import { formatDate } from "../../utils/helpers";
// import {
//   fetchListByPage,
//   resetTablePagination,
// } from "../../actions/PaginationActions";
import {
  ADD_NEW_SUBMODULE,
  termSubmoduleMessage,
  handleMasterSubmoduleError,
  CONFIRM,
  NO_RECORDS_MESSAGE,
  VIEW_DETAILS,
  VIEW_UPDATE_SUB,
  VIEW_UPDATE,
  MASTER_SUBMODULE,
  DELETE_COMPONENT
} from "../../utils/Messages";
import { fetchMasterModule } from "../../actions/MasterModuleActions";
import { ADD_ACTION_APP_SETTINGS, DELETE_ACTION_APP_SETTINGS, UPDATE_ACTION_APP_SETTINGS } from "../../utils/FeatureConstants";

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
  errorCard: {
    background: theme.palette.error.main,
    boxShadow: "none !important",
    color: "#ffffff",
    padding: "12px 16px",
    marginBottom: "14px",
  },
  warningCard: {
    background: theme.palette.warning.main,
    boxShadow: 'none !important',
    color: '#ffffff',
    padding: '12px 16px',
    marginBottom: '14px'
  },
}));

const cols = [
  { id: "submoduleName", label: "Component Name" },
  //{ id: "status", label: "Status" },
  { id: "createdBy", label: "Created By" },
  { id: "createdAt", label: "Created On" },
];

const MasterSubmodule = () => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [openUpdateSubmodule, setOpenUpdateSubmodule] = useState(false);
  const [searchText, setSearchText] = useState("");
  // const [selectedData, setSelectedData] = useState({});
  const [isSubmitted, setIsSubmited] = useState(false);
  const [defaultError, setDefaultError] = useState([]);
  const [openFrom, setOpenFrom] = useState("Add");
  const getApiError = useSelector((state) => state.MasterSubmodule.getError);
  const [apiError, setApiError] = useState(null);
  const featuresAssigned = useSelector(
    (state) => state.User.features
  );
  const totalElements = useSelector(
    (state) => state.MasterSubmodule.submoduleDetailsList.totalElements
  );
  const isSubmoduleAdded = useSelector(
    (state) => state.MasterSubmodule.isSubmoduleAdded
  );
  const isSubmoduleUpdated = useSelector(
    (state) => state.MasterSubmodule.isSubmoduleUpdated
  );
  const isSubmoduleDeleted = useSelector(
    (state) => state.MasterSubmodule.isSubmoduleDeleted
  );
  const submoduleDetailsById = useSelector(
    (state) => state.MasterSubmodule.submoduleDetailsById.data
  );
  const startIndex = useSelector(
    (state) => state.MasterSubmodule.page.startIndex || 0
  );
  const MasterComponentData = useSelector(
    (state) => state.MasterComponent.data
  );
  //const url = useSelector((state) => state.Pagination.page.url);
  const pageSize = useSelector((state) => state.MasterSubmodule.page.pageSize);
  const reset = useSelector((state) => state.MasterSubmodule.reset);
  const [activeTab, setActiveTab] = useState(0);
  //const entityName = useSelector((state) => state.Pagination.page.entityName);
  // const [inputs, setInputs] = React.useState({
  //   searchBy: "",
  //   search: "",
  // });
  // const { searchBy, search } = inputs;

  // const statusList = [
  //   { id: "ACTIVE", value: "ACTIVE" },
  //   { id: "INACTIVE", value: "INACTIVE" },
  //   { id: "TERMINATED", value: "TERMINATED" },
  // ];
  // const searchFieldLabel = {
  //   "": "Search...",
  //   submoduleName: "Search by submodule name...",
  //   createdBy: "Search by created by...",
  // };
  const checkValidation = () => {
    let isValid = true;
    let validationText = [];
    let column = MasterComponentData.column;
    for (let i = 0; i < column.length; i++) {
      if (column[i].label === "") {
        validationText.push(
          `Row no. ${column[i].id} label value is required`
        );
        isValid = false;
      }
      if (column[i].fieldType === "") {
        validationText.push(
          `Row no. ${column[i].id} field type is required`
        );
        isValid = false;
      }
      if (defaultError.indexOf(column[i].id) !== -1) {
        validationText.push(
          `Row no. ${column[i].id} default value must be within set limits`
        );
        isValid = false;
      }
    }
    if (validationText.length > 0) {
      dispatch({
        type: SHOW_SNACKBAR_ACTION,
        payload: {
          detail: (
            <ul>
              {validationText.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ),
          severity: "error",
        },
      });
    }
    return isValid;
  };
  const submoduleDetailsList = useSelector((state) =>
    state.MasterSubmodule.submoduleDetailsList.list
      // .filter((data) => {
      //   if (!searchBy || !search || search === "All") return data;

      //   if (searchBy && search) {
      //     let filterData = {
      //       submoduleName: data.name,
      //       createdBy: data.createdByUser,
      //       //searchstatus: data.deleted ? "TERMINATED" : data.status,
      //       //!(data.deleted) ? data.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE' : 'TERMINATED',
      //       ...data,
      //     };
      //     if (
      //       filterData[searchBy] &&
      //       filterData[searchBy].toLowerCase().includes(search.toLowerCase())
      //     ) {
      //       return data;
      //     }
      //   }

      //   return false;
      // })
      .map((data) => {
        let blankData = {
          id: data.id,
          submoduleName: data.componentName,
          createdBy: data.createdByUser,
          createdAt: formatDate(data.createdDate),
        };
        return { ...data, ...blankData };
      })
  );

  const tableConfig = {
    tableType: "",
    paginationOption: "custom",
    // menuOptions: [
    //   {
    //     type: "link",
    //     icon: featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1 ? <VisibilityIcon fontSize="small" /> : <RateReviewIcon fontSize="small" />,
    //     label: featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1 ? VIEW_DETAILS : VIEW_UPDATE_SUB,
    //     action: (e) => openUpdateSubmoduleDialog(e),
    //   },
    //   {
    //     type: "link",
    //     icon: <DeleteIcon fontSize="small" />,
    //     label: "Term Component",
    //     action: (e) => {
    //       openConfirmDeleteDialog(e);
    //     },
    //   },
    // ],
    // actions:
    // {
    //   icon: featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1 ? <VisibilityIcon color="primary" fontSize="small" /> : <RateReviewIcon color="primary" fontSize="small" />,
    //   tooltipText: featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1 ? VIEW_DETAILS : VIEW_UPDATE,
    //   action: (e) => openUpdateSubmoduleDialog(e)
    // }
    menuOptions: [
      {
        type: "link",
        icon: featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1 ? <VisibilityIcon fontSize="small" /> : <RateReviewIcon fontSize="small" />,
        label: featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1 ? VIEW_DETAILS : VIEW_UPDATE_SUB,
        action: (e) => openUpdateSubmoduleDialog(e),
      },
      {
        type: "link",
        icon: <DeleteIcon fontSize="small" />,
        label: DELETE_COMPONENT,
        action: (e) => {
          openConfirmDeleteDialog(e);
        },
      },
    ],
    actions: featuresAssigned.indexOf(DELETE_ACTION_APP_SETTINGS) === -1 &&
    {
      icon: featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1 ? <VisibilityIcon color="primary" fontSize="small" /> : <RateReviewIcon color="primary" fontSize="small" />,
      tooltipText: featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1 ? VIEW_DETAILS : VIEW_UPDATE,
      action: (e) => openUpdateSubmoduleDialog(e)
    }
  };

  const openUpdateSubmoduleDialog = (data) => {
    setOpenFrom("Update");
    dispatch(fetchSubmoduleById(data.id));
  };

  const closeUpdateMasterSubmoduleFormDialog = useCallback(() => {
    setOpenUpdateSubmodule(false);
    dispatch(resetDuplicateError());
  }, [dispatch]);

  const openAddMasterSubmoduleFormDialog = () => {
    setOpen(true);
    setOpenFrom("Add");
    dispatch({ type: RESET_FIELD_DETAILS });
    setActiveTab(0);
  };

  const closeAddMasterSubmoduleFormDialog = useCallback(() => {
    setOpen(false);
    dispatch(resetDuplicateError());
  }, [dispatch]);

  // let handleSearch = (e) => {
  //   const { name, value } = e.target;
  //   if (
  //     name === "searchBy" &&
  //     value === "submoduleName" &&
  //     value === "createdBy"
  //   ) {
  //     setInputs((inputs) => ({ ...inputs, search: "" }));
  //   }
  //   // if (name === "searchBy" && value !== "sectionName") {
  //   //   setInputs((inputs) => ({ ...inputs, search: "All" }));
  //   // }
  //   if (name === "search" && !searchBy) {
  //     setInputs((inputs) => ({ ...inputs, searchBy: "submoduleName" }));
  //   }
  //   setInputs((inputs) => ({ ...inputs, [name]: value }));
  // };

  const openConfirmDeleteDialog = (e) => {
    let messageObj = {
      primaryButtonLabel: "Yes",
      primaryButtonAction: () => {
        dispatch(deleteMasterSubmodule(e.id, e.submoduleName));
      },
      secondaryButtonLabel: "No",
      secondaryButtonAction: () => { },
      title: CONFIRM,
      message: termSubmoduleMessage(e.submoduleName),
    };
    dispatch(showMessageDialog(messageObj));
  };

  const handlePageChange = (start, size) => {
    dispatch(fetchMasterSubmodule(start, size, searchText));
  };

  const handleChange = (e) => {
    setSearchText(e.target.value);
    if (e.target.value === "") {
      dispatch({ type: SET_DEFAULT_STARTINDEX });
      dispatch(fetchMasterSubmodule(DEFAULT_START_INDEX, pageSize));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSearch = () => {
    if (searchText !== "") {
      dispatch({ type: SET_DEFAULT_STARTINDEX });
      dispatch(fetchMasterSubmodule(DEFAULT_START_INDEX, pageSize, searchText));
    }
  };

  const handleNextAddMasterSubmoduleDialog = (componentName, moduleIds, column, selectedId, columnDetails) => {
    dispatch(updateFieldData(componentName, moduleIds, column, selectedId, columnDetails));
    setActiveTab((prevState) => prevState + 1);
  };

  const handleNextConfigDetailsTab = (fieldProperty, value) => {
    let FieldDetails;
    console.log("Val", value, typeof value, MasterComponentData);
    if (typeof value === "number")
      FieldDetails = MasterComponentData.column.filter(item => item.id === MasterComponentData.selectedFieldId)[0].config[fieldProperty][value].mapping;
    else
      FieldDetails = MasterComponentData.column.filter(item => item.id === MasterComponentData.selectedFieldId)[0].config[fieldProperty].mapping;
    dispatch(updateFieldProperty(fieldProperty, FieldDetails, value));
    setActiveTab((prevState) => prevState + 1);
  };

  const handlePrevAddMasterSubmoduleDialog = () => {
    setActiveTab((prevState) => prevState - 1);
  };


  const handleAddComponent = () => {
    let isValid = checkValidation();
    MasterComponentData.column.filter((a, i) => {
      if (a.fieldType === "Check Box" && a.defaultVal === "") {
        MasterComponentData.column[i]["defaultVal"] = 0;
      }
      else if (a.fieldType === "Check Box" && a.defaultVal === "0") {
        MasterComponentData.column[i]["defaultVal"] = 0;
      }
      else if (a.fieldType === "Check Box" && a.defaultVal === "1") {
        MasterComponentData.column[i]["defaultVal"] = 1;
      }
    })

    setIsSubmited(true);
    if (isValid) {
      if (openFrom === "Add")
        dispatch(addMasterSubmodule(MasterComponentData));
      else
        dispatch(updateMasterSubmodule(submoduleDetailsById.id, MasterComponentData));
    }
  };


  useEffect(() => {
    dispatch(fetchMasterSubmodule(startIndex, pageSize ? pageSize : DEFAULT_PAGE_SIZE));
    // dispatch(
    //   fetchListByPage(MASTERSUBMODULE_API_URL, 0, pageSize, "subModules")
    // );
    // return () =>{
    //   console.log("DISPATCH CALLED");
    //   dispatch(
    //   {type: RESET_PAGINATION_DATA}
    //  );}
  }, [dispatch]);

  useEffect(() => {
    if (Object.keys(submoduleDetailsById).length !== 0) {
      setOpenUpdateSubmodule(true);
    }
  }, [dispatch, submoduleDetailsById]);

  useEffect(() => {
    if (isSubmoduleAdded) {
      setSearchText("");
      dispatch({ type: SET_DEFAULT_STARTINDEX });
      dispatch(fetchMasterSubmodule(DEFAULT_START_INDEX, pageSize));
      //dispatch(resetTablePagination(true));
      closeAddMasterSubmoduleFormDialog();
    }
  }, [dispatch, isSubmoduleAdded, closeAddMasterSubmoduleFormDialog, pageSize]);

  useEffect(() => {
    if (isSubmoduleUpdated) {
      dispatch(fetchMasterSubmodule(startIndex, pageSize, searchText));
      closeUpdateMasterSubmoduleFormDialog();
    }
  }, [
    dispatch,
    isSubmoduleUpdated,
    closeUpdateMasterSubmoduleFormDialog,
    startIndex,
    pageSize,
    searchText,
  ]);

  useEffect(() => {
    if (isSubmoduleDeleted) {
      if (
        startIndex + 1 === totalElements &&
        startIndex !== DEFAULT_START_INDEX
      )
        dispatch(
          fetchMasterSubmodule(startIndex - pageSize, pageSize, searchText)
        );
      else dispatch(fetchMasterSubmodule(startIndex, pageSize, searchText));
      dispatch(resetDuplicateError());
    }
  }, [dispatch, isSubmoduleDeleted, startIndex, pageSize, totalElements, searchText]);

  useEffect(() => {
    if (getApiError) {
      setApiError(handleMasterSubmoduleError(getApiError));
    }
    else
      setApiError(false);
  }, [getApiError]);

  useEffect(() => {
    dispatch(fetchMasterModule());
  }, [dispatch]);

  return (
    <>
      <PageHeading
        heading={MASTER_SUBMODULE}
        action={
          <Grid container style={{ width: "auto" }}>
            <Search
              searchText={searchText}
              handleChange={handleChange}
              handleKeyPress={handleKeyPress}
              handleSearch={handleSearch}
            />
            {/* Search & filter temporary hidden it will be integreated with backend later  */}
            {/* {false && (
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
            )}
            {false &&
              (!searchBy ||
                searchBy === "submoduleName" ||
                searchBy === "createdBy") && (
                <Grid item className={styles.col}>
                  <MatInputField
                    value={search}
                    label={searchFieldLabel[searchBy]}
                    onChange={handleSearch}
                    name="search"
                  />
                </Grid>
              )} */}
            {featuresAssigned.indexOf(ADD_ACTION_APP_SETTINGS) !== -1 && <Grid item style={{ display: "flex", alignItems: "center" }}>
              <MatButton onClick={openAddMasterSubmoduleFormDialog}>
                {ADD_NEW_SUBMODULE}
              </MatButton>
            </Grid>}
          </Grid>
        }
      />
      {apiError ? (
        <Grid item xs={12} className={styles.error}>
          <Card className={apiError.messageType === "error" ? styles.errorCard : styles.warningCard}>
            <Typography variant="body2">{apiError.message}</Typography>
          </Card>
        </Grid>
      ) : submoduleDetailsList.length ? (
        <MatCard>
          <DataTable
            cols={cols}
            rows={submoduleDetailsList}
            config={tableConfig}
            resetPagination={reset}
            totalElements={totalElements}
            startIndex={startIndex}
            handleNextPage={handlePageChange}
          />
        </MatCard>
      ) : (
        <MatCard>
          <CardContent className={styles.noDataCard}>
            <Typography variant="h5">{NO_RECORDS_MESSAGE}</Typography>
          </CardContent>
        </MatCard>
      )}
      {/* {open && (
        <AddMasterSubmodule
          handleClose={closeAddMasterSubmoduleFormDialog}
          open={open}
        />
      )} */}
      {open && (
        <AddMasterComponent
          handleClose={closeAddMasterSubmoduleFormDialog}
          open={open}
          openFrom={openFrom}
          activeTab={activeTab}
          handleNext={handleNextAddMasterSubmoduleDialog}
          handlePrev={handlePrevAddMasterSubmoduleDialog}
          handleConfigNext={handleNextConfigDetailsTab}
          defaultError={defaultError}
          handleAddComponent={handleAddComponent}
        />
      )}
      {openUpdateSubmodule && (
        <AddMasterComponent
          handleClose={closeUpdateMasterSubmoduleFormDialog}
          open={openUpdateSubmodule}
          openFrom={openFrom}
          activeTab={activeTab}
          handleNext={handleNextAddMasterSubmoduleDialog}
          handlePrev={handlePrevAddMasterSubmoduleDialog}
          handleConfigNext={handleNextConfigDetailsTab}
          defaultError={defaultError}
          handleAddComponent={handleAddComponent}
        />
      )}
    </>
  );
};

export default MasterSubmodule;
