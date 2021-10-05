// eslint-disable-next-line
import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "@material-ui/icons/Delete";
import { CardContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import RateReviewIcon from "@material-ui/icons/RateReview";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Search from "../../components/Search";
import MatCard from "../../components/MaterialUi/MatCard";
import MatButton from "../../components/MaterialUi/MatButton";
import PageHeading from "../../components/PageHeading";
import DataTable from "../../components/DataTable";
import AddMasterSysVariable from "../../components/ManageAppSettings/AddMasterSysVariable";
import UpdateMasterSystem from "../../components/ManageAppSettings/UpdateMasterSystem";
import TableCellShowMore from "../../components/TableCellShowMore";
import { showMessageDialog } from "../../actions/MessageDialogActions";
import {
  SET_DEFAULT_STARTINDEX,
  RESET_MASTERSYSVARIABLE_ADDED,
  DEFAULT_START_INDEX,
  DEFAULT_PAGE_SIZE,
  RESET_DUPLICATE_ERROR
} from "../../utils/AppConstants";

import { fetchMasterSystem, fetchSystemById, deleteMasterSystemVariable } from "../../actions/MasterSystemActions";
import {
  ADD_SYSTEM_CONST,
  handleMasterSystemError,
  //COMMON_ERROR_MESSAGE,
  CONFIRM,
  NO_RECORDS_MESSAGE,
  VIEW_DETAILS,
  VIEW_UPDATE,
  //TERM_TABLE,
  deleteSystemVariable,
  MASTER_SYSTEM_VARIABLES,
  DELETE_SYS_VAR,
} from "../../utils/Messages";
import {
  ADD_ACTION_APP_SETTINGS,
  UPDATE_ACTION_APP_SETTINGS,
  DELETE_ACTION_APP_SETTINGS
} from "../../utils/FeatureConstants";
import { fetchMasterModule } from "../../actions/MasterModuleActions";


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
}));

const cols = [
  { id: "code", label: "System Variable Code", minWidth: "160px" },
  { id: "systemVariableModules", label: "Modules(s)" },
  // { id: "table", label: "Table", minWidth: "80px" },
  // { id: "uniqueColumn", label: "Primary Column", minWidth: "130px" },
  { id: "shortDescription", label: "Short Description", minWidth: "160px" },
];

// const searchFilter = [
//   { id: "tableName", label: "Table Name" },
//   { id: "createdBy", label: "Created By" },
// ];

const MasterSystemVariables = () => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [openUpdateSystem, setOpenUpdateSystem] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [popUpAnchorEl, setPopUpAnchorEl] = useState(null);
  const [popUpOptions, setPopUpOptions] = useState(null);
  const [popUpFieldKey, setPopUpFieldKey] = useState("");
  const isPopUpOpen = Boolean(popUpAnchorEl);
  const getApiError = useSelector((state) => state.MasterSysVariable.getError);
  const [apiError, setApiError] = useState(null);
  const featuresAssigned = useSelector((state) => state.User.features);
  const totalElements = useSelector(
    (state) => state.MasterSysVariable.systemDetailsList.totalElements
  );
  const isSystemAdded = useSelector(
    (state) => state.MasterSysVariable.isSystemAdded
  );
  const isSystemUpdated = useSelector(
    (state) => state.MasterSysVariable.isSystemUpdated
  );
  const isSystemDeleted = useSelector(
    (state) => state.MasterSysVariable.isSystemDeleted
  );
  //   const isTableDeleted = useSelector(
  //     (state) => state.MasterSysVariable.isTableDeleted
  //   );
  const systemDetailsById = useSelector(
    (state) => state.MasterSysVariable.systemDetailsById.data
  );
  const startIndex = useSelector(
    (state) => state.MasterSysVariable.page.startIndex || 0
  );
  //const url = useSelector((state) => state.Pagination.page.url);
  const pageSize = useSelector(
    (state) => state.MasterSysVariable.page.pageSize
  );
  const reset = useSelector((state) => state.MasterSysVariable.reset);

  const handlePopUpClick = (event, data, fieldKey) => {
    setPopUpFieldKey(fieldKey);
    setPopUpOptions(data);
    setPopUpAnchorEl(event.currentTarget);
  };

  const handlePopUpClose = () => {
    setPopUpAnchorEl(null);
  };

  const tableDetailsList = useSelector((state) =>
    state.MasterSysVariable.systemDetailsList.list.map((data) => {
      let blankData = {
        id: data.id,
        code: data.code,
        systemVariableModules: data.modules && (
          <div>
            {data.modules.map(
              (module, index) =>
                index < 2 && (
                  <Chip
                    style={{ margin: "2px" }}
                    key={index}
                    label={module.moduleName}
                  />
                )
            )}
            {data.modules.length > 2 && (
              <Chip
                className={styles.moreChip}
                icon={<MoreHorizIcon />}
                onClick={(e) =>
                  handlePopUpClick(e, data.modules, "moduleName")
                }
              />
            )}
          </div>
        ),
        systemVariableModulesSort: data.modules && (
          data.modules.map(
            (module, index) =>
              module.moduleName
          )
        ),
        shortDescription: data.description,
      };
      return { ...data, ...blankData };
    })
  );
  console.log("tableDetailsList", tableDetailsList)
  const tableConfig = {
    tableType: "",
    paginationOption: "custom",
    menuOptions: [
      {
        type: "link",
        icon: featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1 ? (
          <VisibilityIcon fontSize="small" />
        ) : (
          <RateReviewIcon fontSize="small" />
        ),
        label: featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1
          ? VIEW_DETAILS
          : VIEW_UPDATE,
        action: (e) => openUpdateSystemDialog(e),
      },
      {
        type: "link",
        icon: <DeleteIcon fontSize="small" />,
        label: DELETE_SYS_VAR,
        action: (e) => {
          openConfirmDeleteDialog(e);
        },
      },
    ],
    actions: featuresAssigned.indexOf(DELETE_ACTION_APP_SETTINGS) === -1 && {
      icon: featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1 ? <VisibilityIcon color="primary" fontSize="small" /> : <RateReviewIcon color="primary" fontSize="small" />,
      tooltipText: featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1 ? VIEW_DETAILS : VIEW_UPDATE,
      action: (e) => openUpdateSystemDialog(e)
    },
  };

  const openUpdateSystemDialog = (data) => {
    dispatch(fetchSystemById(data.id));
  };

  const openConfirmDeleteDialog = (e) => {
    console.log(e)
    let messageObj = {
      primaryButtonLabel: "Yes",
      primaryButtonAction: () => {
        dispatch(deleteMasterSystemVariable(e.id));
      },
      secondaryButtonLabel: "No",
      secondaryButtonAction: () => { },
      title: CONFIRM,
      message: deleteSystemVariable(e.code),
    };
    dispatch(showMessageDialog(messageObj));
  };

  const closeUpdateSystemDialog = useCallback(() => {
    setOpenUpdateSystem(false);
    dispatch({ type: RESET_DUPLICATE_ERROR });
  }, [dispatch]);

  const openAddMasterTableFormDialog = () => {
    dispatch({ type: RESET_MASTERSYSVARIABLE_ADDED });
    setOpen(true);
  };

  const closeAddMasterSystemFormDialog = useCallback(() => {
    setOpen(false);
    dispatch({ type: RESET_DUPLICATE_ERROR });
  }, [dispatch]);

  const handlePageChange = (start, size) => {
    dispatch(fetchMasterSystem(start, size, searchText));
  };

  const handleChange = (e) => {
    setSearchText(e.target.value);
    if (e.target.value === "") {
      dispatch({ type: SET_DEFAULT_STARTINDEX });
      dispatch(fetchMasterSystem(DEFAULT_START_INDEX, pageSize));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSearch = () => {
    if (searchText !== "") {
      dispatch({ type: SET_DEFAULT_STARTINDEX });
      dispatch(fetchMasterSystem(DEFAULT_START_INDEX, pageSize, searchText));
    }
  };

  useEffect(() => {
    if (Object.keys(systemDetailsById).length !== 0) {
      setOpenUpdateSystem(true);
    }
  }, [dispatch, systemDetailsById]);

  useEffect(() => {
    if (isSystemAdded) {
      setSearchText("");
      dispatch({ type: SET_DEFAULT_STARTINDEX });
      dispatch(fetchMasterSystem(DEFAULT_START_INDEX, pageSize));
      //dispatch(resetTablePagination(true));
      closeAddMasterSystemFormDialog();
    }
  }, [dispatch, isSystemAdded, closeAddMasterSystemFormDialog, pageSize]);

  useEffect(() => {
    if (isSystemUpdated) {
      dispatch(fetchMasterSystem(startIndex, pageSize, searchText));
      closeUpdateSystemDialog();
    }
  }, [
    dispatch,
    isSystemUpdated,
    closeUpdateSystemDialog,
    startIndex,
    pageSize,
    searchText,
  ]);
  useEffect(() => {
    if (isSystemDeleted) {
      dispatch(fetchMasterSystem(startIndex, pageSize, searchText));
    }
  }, [
    dispatch,
    isSystemDeleted,
    startIndex,
    pageSize,
    searchText,
  ]);

  useEffect(() => {
    dispatch(fetchMasterSystem(startIndex, pageSize ? pageSize : DEFAULT_PAGE_SIZE));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchMasterModule());
  }, [dispatch]);

  useEffect(() => {
    if (getApiError) {
      setApiError(handleMasterSystemError(getApiError));
    }
    else
      setApiError(false);
  }, [getApiError]);

  return (
    <>
      <PageHeading
        heading={MASTER_SYSTEM_VARIABLES}
        action={
          <Grid container style={{ width: "auto" }}>
            <Search
              searchText={searchText}
              handleChange={handleChange}
              handleKeyPress={handleKeyPress}
              handleSearch={handleSearch}
            />

            {featuresAssigned.indexOf(ADD_ACTION_APP_SETTINGS) !== -1 && (
              <Grid item style={{ display: "flex", alignItems: "center" }}>
                <MatButton onClick={openAddMasterTableFormDialog}>
                  {ADD_SYSTEM_CONST}
                </MatButton>
              </Grid>
            )}
          </Grid>
        }
      />
      {apiError ? (
        <Grid item xs={12} className={styles.error}>
          <Card className={apiError.messageType === "error" ? styles.errorCard : styles.warningCard}>
            <Typography variant="body2">{apiError.message}</Typography>
          </Card>
        </Grid>
      ) : tableDetailsList.length ? (
        <MatCard>
          <DataTable
            cols={cols}
            rows={tableDetailsList}
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
      {open && (
        <AddMasterSysVariable
          handleClose={closeAddMasterSystemFormDialog}
          open={open}
        />
      )}
      {openUpdateSystem && (
        <UpdateMasterSystem
          handleClose={closeUpdateSystemDialog}
          open={openUpdateSystem}
        />
      )}
      <TableCellShowMore
        anchorEl={popUpAnchorEl}
        open={isPopUpOpen}
        onClose={handlePopUpClose}
        moreItems={1}
        fieldProp={popUpFieldKey}
        options={popUpOptions}
      />
    </>
  );
};

export default MasterSystemVariables;
