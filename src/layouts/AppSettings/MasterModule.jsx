/* eslint-disable no-unused-vars */
import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { CardContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
//import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";

import RateReviewIcon from "@material-ui/icons/RateReview";
import DeleteIcon from "@material-ui/icons/Delete";
import Search from "../../components/Search";
import MatCard from "../../components/MaterialUi/MatCard";
import MatButton from "../../components/MaterialUi/MatButton";
// import MatInputField from "../../components/MaterialUi/MatInputField";
import PageHeading from "../../components/PageHeading";
import DataTable from "../../components/DataTable";
import VisibilityIcon from "@material-ui/icons/Visibility";
import AddMasterModule from "../../components/ManageAppSettings/AddMasterModule";
import UpdateMasterModule from "../../components/ManageAppSettings/UpdateMasterModule";

import {
  DEFAULT_START_INDEX,
  DEFAULT_PAGE_SIZE,
  SET_DEFAULT_STARTINDEX,
  MASTERMODULE_API_URL,
} from "../../utils/AppConstants";
import {
  resetDuplicateError,
  fetchModuleById,
  deleteMasterModule,
} from "../../actions/MasterModuleActions";
import { fetchMasterModule, fetchAllMasterModule } from "../../actions/MasterModuleActions";
import { showMessageDialog } from "../../actions/MessageDialogActions";
import { formatDate } from "../../utils/helpers";
import {
  fetchListByPage,
  resetTablePagination,
} from "../../actions/PaginationActions";
import {
  handleMasterModuleError,
  MASTER_MODULE,
  NO_RECORDS_MESSAGE,
  VIEW_DETAILS,
  VIEW_UPDATE
} from "../../utils/Messages";
import { ADD_ACTION_APP_SETTINGS, UPDATE_ACTION_APP_SETTINGS, DELETE_ACTION_APP_SETTINGS } from "../../utils/FeatureConstants";

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
    boxShadow: "none !important",
    color: "#ffffff",
    padding: "12px 16px",
    marginBottom: "14px",
  },
  statusActive: {
    background: "#00c853",
  },
  statusInactive: {
    background: theme.palette.warning.main,
  },
}));

const cols = [
  { id: "moduleName", label: "Module Name" },
  { id: "shortName", label: "Module Abbreviation" },
  // { id: "global", label: "Is Global" },
  { id: "createdBy", label: "Created By" },
  { id: "createdAt", label: "Created On" },
];

// const searchFilter = [
//   { id: "moduleName", label: "Module Name" },
//   { id: "createdBy", label: "Created By" },
// ];

const MasterModule = () => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [openUpdateModule, setOpenUpdateModule] = useState(false);
  // const [selectedData, setSelectedData] = useState({});
  const getApiError = useSelector((state) => state.MasterModule.getError);
  const [apiError, setApiError] = useState(null);
  const isModuleAdded = useSelector(
    (state) => state.MasterModule.isModuleAdded
  );
  const isModuleUpdated = useSelector(
    (state) => state.MasterModule.isModuleUpdated
  );
  const isModuleDeleted = useSelector(
    (state) => state.MasterModule.isModuleDeleted
  );
  const moduleDetailsById = useSelector(
    (state) => state.MasterModule.moduleDetailsById.data
  );
  const featuresAssigned = useSelector(
    (state) => state.User.features
  );
  // const totalElements = useSelector((state) => state.Pagination.DetailsList.totalElements);
  // const totalPages = useSelector(
  //   (state) => state.Pagination.DetailsList.totalPages
  // );
  // const startIndex = useSelector((state) => state.Pagination.page.startIndex);
  const pageSize = useSelector((state) => state.MasterModule.page.pageSize);
  // const reset = useSelector((state) => state.MasterModule.reset);
  // const url = useSelector((state) => state.Pagination.page.url);
  const [searchText, setSearchText] = useState("");
  const totalElements = useSelector(
    (state) => state.MasterModule.moduleDetailsList.totalElements
  );
  const startIndex = useSelector((state) => state.MasterModule.page.startIndex || 0);
  // const entityName = useSelector((state) => state.Pagination.page.entityName);
  const [inputs, setInputs] = React.useState({
    searchBy: "",
    search: "",
  });
  const { searchBy, search } = inputs;

  // const statusList = [
  //   { id: "ACTIVE", value: "ACTIVE" },
  //   { id: "INACTIVE", value: "INACTIVE" },
  //   { id: "TERMINATED", value: "TERMINATED" },
  // ];
  // const searchFieldLabel = {
  //   "": "Search...",
  //   moduleName: "Search by module name...",
  //   shortName: "Search by module short name...",
  //   createdBy: "Search by created by...",
  // };

  const handleGlobalClass = (status) => {
    if (status === "Yes") {
      return styles.statusActive;
    } else return styles.statusInactive;
  };

  const moduleDetailsList = useSelector((state) =>
    state.MasterModule.moduleDetailsList.list
      .filter((data) => {
        if (!searchBy || !search || search === "All") return data;

        if (searchBy && search) {
          let filterData = {
            moduleName: data.moduleName,
            shortName: data.shortName ? data.shortName : "",
            createdBy: data.createdByUser,
            //searchstatus: data.deleted ? "TERMINATED" : data.status,
            //!(data.deleted) ? data.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE' : 'TERMINATED',
            ...data,
          };
          if (
            filterData[searchBy] &&
            filterData[searchBy].toLowerCase().includes(search.toLowerCase())
          ) {
            return data;
          }
        }

        return false;
      })
      .map((data) => {
        let blankData = {
          id: data.id,
          moduleName: data.moduleName,
          shortName: data.shortName,
          description: data.description,
          global: (
            <div>
              {
                <Chip
                  label={data.global ? "Yes" : "No"}
                  className={handleGlobalClass(data.global ? "Yes" : "No")}
                  color="primary"
                />
              }
            </div>
          ),
          statusDialog: data.global,
          createdBy: data.createdByUser,
          createdAt: formatDate(data.createdDate),
        };
        return { ...data, ...blankData };
      })
  );
  const tableConfig = {
    tableType: "",
    paginationOption: "custom",
    menuOptions: [
      {
        type: "link",
        icon: featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1 ? <VisibilityIcon fontSize="small" /> : <RateReviewIcon fontSize="small" />,
        label: featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1 ? VIEW_DETAILS : VIEW_UPDATE,
        display: "Hide",
        action: (e) => openUpdateModuleDialog(e),
      },
      {
        type: "link",
        icon: <DeleteIcon fontSize="small" />,
        label: "Delete Module",
        action: (e) => {
          openConfirmDeleteDialog(e);
        },
      },
    ],
    actions: featuresAssigned.indexOf(DELETE_ACTION_APP_SETTINGS) === -1 && {
      icon: featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1 ? <VisibilityIcon color="primary" fontSize="small" /> : <RateReviewIcon color="primary" fontSize="small" />,
      tooltipText: featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1 ? VIEW_DETAILS : VIEW_UPDATE,
      action: (e) => openUpdateModuleDialog(e)
    },
    // menuOptions: [
    //   {
    //     type: "link",
    //     icon: <RateReviewIcon fontSize="small" />,
    //     label: "View & Update Module",
    //     action: (e) => openUpdateModuleDialog(e),
    //   },
    //   {
    //     type: "link",
    //     icon: <DeleteIcon fontSize="small" />,
    //     label: "Term Module",
    //     action: (e) => {
    //       openConfirmDeleteDialog(e);
    //     },
    //   },
    // ],
  };

  const openUpdateModuleDialog = (data) => {
    //dispatch(fetchConfigModuleList());
    dispatch(fetchModuleById(data.id));
  };

  const closeUpdateModuleDialog = useCallback(() => {
    setOpenUpdateModule(false);
    dispatch(resetDuplicateError());
  }, [dispatch]);

  const openAddMasterModuleFormDialog = () => {
    //dispatch(fetchConfigModuleList());
    setOpen(true);
  };

  const closeAddMasterModuleFormDialog = useCallback(() => {
    setOpen(false);
    dispatch(resetDuplicateError());
  }, [dispatch]);

  // let handleSearch = (e) => {
  //   const { name, value } = e.target;
  //   if (
  //     name === "searchBy" &&
  //     value === "moduleName" &&
  //     value === "createdBy"
  //   ) {
  //     setInputs((inputs) => ({ ...inputs, search: "" }));
  //   }
  //   // if (name === "searchBy" && value !== "sectionName") {
  //   //   setInputs((inputs) => ({ ...inputs, search: "All" }));
  //   // }
  //   if (name === "search" && !searchBy) {
  //     setInputs((inputs) => ({ ...inputs, searchBy: "moduleName" }));
  //   }
  //   setInputs((inputs) => ({ ...inputs, [name]: value }));
  // };

  const openConfirmDeleteDialog = (e) => {
    let messageObj = {
      primaryButtonLabel: "Yes",
      primaryButtonAction: () => {
        dispatch(deleteMasterModule(e.id, e.moduleName));
      },
      secondaryButtonLabel: "No",
      secondaryButtonAction: () => { },
      title: "Confirm",
      message: "Are you sure you want to delete module " + e.moduleName + "?",
    };
    dispatch(showMessageDialog(messageObj));
  };
  const handlePageChange = (start, size) => {
    dispatch(fetchMasterModule("ALL", start, size, searchText));
  };

  const handleChange = (e) => {
    setSearchText(e.target.value);
    if (e.target.value === "") {
      dispatch({ type: SET_DEFAULT_STARTINDEX });
      dispatch(fetchMasterModule("All", DEFAULT_START_INDEX, pageSize));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSearch = () => {
    if (searchText !== "") {
      dispatch({ type: SET_DEFAULT_STARTINDEX });
      dispatch(
        fetchMasterModule("All", DEFAULT_START_INDEX, pageSize, searchText)
      );
    }
  };

  useEffect(() => {
    // dispatch(fetchAllMasterModule());
    dispatch(fetchMasterModule("All", startIndex, pageSize ? pageSize : DEFAULT_PAGE_SIZE));
    //dispatch(fetchListByPage(MASTERMODULE_API_URL, 0, pageSize, "modules"));
  }, [dispatch]);

  useEffect(() => {
    if (getApiError) {
      setApiError(handleMasterModuleError(getApiError));
    } else setApiError(false);
  }, [getApiError]);

  useEffect(() => {
    if (Object.keys(moduleDetailsById).length !== 0) {
      setOpenUpdateModule(true);
    }
  }, [dispatch, moduleDetailsById]);

  useEffect(() => {
    if (isModuleAdded) {
      dispatch(fetchListByPage(MASTERMODULE_API_URL, 0, pageSize, "modules"));
      dispatch(resetTablePagination(true));
      closeAddMasterModuleFormDialog();
    }
  }, [dispatch, isModuleAdded, pageSize, closeAddMasterModuleFormDialog]);

  useEffect(() => {
    if (isModuleUpdated) {
      dispatch(fetchMasterModule("All", DEFAULT_START_INDEX, DEFAULT_PAGE_SIZE));
      dispatch(
        fetchListByPage(MASTERMODULE_API_URL, startIndex, pageSize, "modules")
      );
      closeUpdateModuleDialog();
    }
  }, [
    dispatch,
    isModuleUpdated,
    startIndex,
    pageSize,
    closeUpdateModuleDialog,
  ]);

  useEffect(() => {
    if (isModuleDeleted) {
      dispatch(fetchMasterModule("All", DEFAULT_START_INDEX, DEFAULT_PAGE_SIZE));
      dispatch(
        fetchListByPage(MASTERMODULE_API_URL, startIndex, pageSize, "modules")
      );
      dispatch(resetDuplicateError());
    }
  }, [dispatch, isModuleDeleted, startIndex, pageSize]);

  return (
    <>
      <PageHeading
        heading={MASTER_MODULE}
        action={
          <Grid container style={{ width: "auto" }}>
            <Search
              handleChange={handleChange}
              handleKeyPress={handleKeyPress}
              handleSearch={handleSearch}
            />
            {featuresAssigned.indexOf(ADD_ACTION_APP_SETTINGS) !== -1 && <Grid item style={{ display: "flex", alignItems: "center" }}>
              <MatButton onClick={openAddMasterModuleFormDialog}>
                Add New Module
              </MatButton>
            </Grid>}
          </Grid>
        }
      // action={
      //   <Grid container style={{ width: "auto" }}>
      //     {/* Search & filter temporary hidden it will be integreated with backend later  */}
      //     {false && (
      //       <Grid item className={styles.filterDropdown}>
      //         <MatInputField
      //           select
      //           onChange={handleSearch}
      //           label="Search or Filter By"
      //           name="searchBy"
      //           value={searchBy}
      //         >
      //           {searchFilter.map((item) => (
      //             <MenuItem key={item.id} value={item.id}>
      //               {item.label}
      //             </MenuItem>
      //           ))}
      //         </MatInputField>
      //       </Grid>
      //     )}
      //     {false &&
      //       (!searchBy ||
      //         searchBy === "moduleName" ||
      //         searchBy === "createdBy") && (
      //         <Grid item className={styles.col}>
      //           <MatInputField
      //             value={search}
      //             label={searchFieldLabel[searchBy]}
      //             onChange={handleSearch}
      //             name="search"
      //           />
      //         </Grid>
      //       )}
      //     <Grid item style={{ display: "flex", alignItems: "center" }}>
      //       <MatButton onClick={openAddMasterModuleFormDialog}>
      //         Add New Module
      //       </MatButton>
      //     </Grid>
      //   </Grid>
      // }
      />
      {apiError ? (
        <Grid item xs={12} className={styles.error}>
          <Card
            className={
              apiError.messageType === "error"
                ? styles.errorCard
                : styles.warningCard
            }
          >
            <Typography variant="body2">{apiError.message}</Typography>
          </Card>
        </Grid>
      ) : moduleDetailsList.length ? (
        <MatCard>
          <DataTable
            cols={cols}
            rows={moduleDetailsList}
            config={tableConfig}
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
      {open && (
        <AddMasterModule
          handleClose={closeAddMasterModuleFormDialog}
          open={open}
        />
      )}
      {openUpdateModule && (
        <UpdateMasterModule
          handleClose={closeUpdateModuleDialog}
          open={openUpdateModule}
        />
      )}
    </>
  );
};

export default MasterModule;
