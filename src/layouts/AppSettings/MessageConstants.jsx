import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showMessageDialog } from "../../actions/MessageDialogActions";
import { CardContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import RateReviewIcon from "@material-ui/icons/RateReview";
import VisibilityIcon from "@material-ui/icons/Visibility";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import DeleteIcon from "@material-ui/icons/Delete";
import Search from "../../components/Search";
import MatCard from "../../components/MaterialUi/MatCard";
import MatButton from "../../components/MaterialUi/MatButton";
import PageHeading from "../../components/PageHeading";
import DataTable from "../../components/DataTable";
import AddMasterMessage from "../../components/ManageAppSettings/AddMasterMessage";
import UpdateMasterMessage from "../../components/ManageAppSettings/UpdateMasterMessage";
import TableCellShowMore from "../../components/TableCellShowMore";

import {
  SET_DEFAULT_STARTINDEX,
  RESET_MASTERMESSAGE_ADDED,
  DEFAULT_START_INDEX,
  DEFAULT_PAGE_SIZE,
  RESET_DUPLICATE_ERROR
} from "../../utils/AppConstants";

import { fetchMasterMessage, fetchAllMasterMessage, fetchMessageById, deleteMasterMessageConstant } from "../../actions/MasterMessageActions";
import { fetchMasterModule } from "../../actions/MasterModuleActions";


import {
  ADD_MESSAGE_CONST,
  handleMasterMessageError,
  // systemVariableMessage,
  // COMMON_ERROR_MESSAGE,
  CONFIRM,
  NO_RECORDS_MESSAGE,
  VIEW_DETAILS,
  VIEW_UPDATE,
  deleteMessageConstantMessage,
  MASTER_MESSAGE_CONSTANTS,
  DELETE_MSG_CONSTANT
} from "../../utils/Messages";
import {
  ADD_ACTION_APP_SETTINGS,
  UPDATE_ACTION_APP_SETTINGS,
  DELETE_ACTION_APP_SETTINGS
} from "../../utils/FeatureConstants";

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
  { id: "msgConst", label: "Message Constant", minWidth: "160px" },
  { id: "messageConstantModules", label: "Modules(s)" },
  { id: "shortDescription", label: "Short Description", minWidth: "160px" },
];

// const searchFilter = [
//   { id: "tableName", label: "Table Name" },
//   { id: "createdBy", label: "Created By" },
// ];

const MessageConstants = () => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [openUpdateMessage, setOpenUpdateMessage] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [popUpAnchorEl, setPopUpAnchorEl] = useState(null);
  const [popUpOptions, setPopUpOptions] = useState(null);
  const [popUpFieldKey, setPopUpFieldKey] = useState("");
  const isPopUpOpen = Boolean(popUpAnchorEl);
  const getApiError = useSelector((state) => state.MasterMessage.getError);
  const [apiError, setApiError] = useState(null);
  const featuresAssigned = useSelector((state) => state.User.features);
  const totalElements = useSelector(
    (state) => state.MasterMessage.messageDetailsList.totalElements
  );
  const isMessageAdded = useSelector(
    (state) => state.MasterMessage.isMessageAdded
  );
  const isMessageUpdated = useSelector(
    (state) => state.MasterMessage.isMessageUpdated
  );
  const isMessageDeleted = useSelector(
    (state) => state.MasterMessage.isMessageDeleted
  );

  const messageDetailsById = useSelector(
    (state) => state.MasterMessage.messageDetailsById.data
  );
  const startIndex = useSelector(
    (state) => state.MasterMessage.page.startIndex || 0
  );
  //const url = useSelector((state) => state.Pagination.page.url);
  const pageSize = useSelector(
    (state) => state.MasterMessage.page.pageSize
  );
  const reset = useSelector((state) => state.MasterMessage.reset);

  const handlePopUpClick = (event, data, fieldKey) => {
    setPopUpFieldKey(fieldKey);
    setPopUpOptions(data);
    setPopUpAnchorEl(event.currentTarget);
  };

  const handlePopUpClose = () => {
    setPopUpAnchorEl(null);
  };

  const tableDetailsList = useSelector((state) =>
    state.MasterMessage.messageDetailsList.list.map((data) => {
      let blankData = {
        id: data.id,
        msgConst: data.messageConstant,
        messageConstantModules: data.modules && (
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
        messageConstantModulesSort: data.modules && (
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
        action: (e) => openUpdateMessageDialog(e),
      },
      {
        type: "link",
        icon: <DeleteIcon fontSize="small" />,
        label: DELETE_MSG_CONSTANT,
        action: (e) => {
          openConfirmDeleteDialog(e);
        },
      },
    ],
    actions: featuresAssigned.indexOf(DELETE_ACTION_APP_SETTINGS) === -1 && {
      icon: featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1 ? <VisibilityIcon color="primary" fontSize="small" /> : <RateReviewIcon color="primary" fontSize="small" />,
      tooltipText: featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1 ? VIEW_DETAILS : VIEW_UPDATE,
      action: (e) => openUpdateMessageDialog(e)
    },
  };

  const openUpdateMessageDialog = (data) => {
    dispatch(fetchMessageById(data.id));
  };

  const openConfirmDeleteDialog = (e) => {
    console.log(e)
    let messageObj = {
      primaryButtonLabel: "Yes",
      primaryButtonAction: () => {
        dispatch(deleteMasterMessageConstant(e.id));
      },
      secondaryButtonLabel: "No",
      secondaryButtonAction: () => { },
      title: CONFIRM,
      message: deleteMessageConstantMessage(e.messageConstant),
    };
    dispatch(showMessageDialog(messageObj));
  };

  const closeUpdateMessageDialog = useCallback(() => {
    setOpenUpdateMessage(false);
    dispatch({ type: RESET_DUPLICATE_ERROR });
  }, [dispatch]);

  const openAddMasterMessageDialog = () => {
    dispatch({ type: RESET_MASTERMESSAGE_ADDED });
    setOpen(true);
  };

  const closeAddMasterMessageFormDialog = useCallback(() => {
    setOpen(false);
    dispatch({ type: RESET_DUPLICATE_ERROR });
  }, [dispatch]);


  const handlePageChange = (start, size) => {
    dispatch(fetchMasterMessage(start, size, searchText));
  };

  const handleChange = (e) => {
    setSearchText(e.target.value);
    if (e.target.value === "") {
      dispatch({ type: SET_DEFAULT_STARTINDEX });
      dispatch(fetchMasterMessage(DEFAULT_START_INDEX, pageSize));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSearch = () => {
    if (searchText !== "") {
      dispatch({ type: SET_DEFAULT_STARTINDEX });
      dispatch(fetchMasterMessage(DEFAULT_START_INDEX, pageSize, searchText));
    }
  };

  useEffect(() => {
    dispatch(fetchMasterMessage(startIndex, pageSize ? pageSize : DEFAULT_PAGE_SIZE));
    dispatch(fetchAllMasterMessage())
  }, [dispatch]);

  useEffect(() => {
    if (Object.keys(messageDetailsById).length !== 0) {
      setOpenUpdateMessage(true);
    }
  }, [dispatch, messageDetailsById]);

  useEffect(() => {
    if (isMessageAdded) {
      setSearchText("");
      dispatch({ type: SET_DEFAULT_STARTINDEX });
      dispatch(fetchMasterMessage(DEFAULT_START_INDEX, pageSize));
      //dispatch(resetTablePagination(true));
      closeAddMasterMessageFormDialog();
    }
  }, [dispatch, isMessageAdded, closeAddMasterMessageFormDialog, pageSize]);

  useEffect(() => {
    if (isMessageUpdated) {
      dispatch(fetchMasterMessage(startIndex, pageSize, searchText));
      closeUpdateMessageDialog();
    }
  }, [
    dispatch,
    isMessageUpdated,
    closeUpdateMessageDialog,
    startIndex,
    pageSize,
    searchText,
  ]);
  useEffect(() => {
    if (isMessageDeleted) {
      dispatch(fetchMasterMessage(startIndex, pageSize, searchText));
    }
  }, [
    dispatch,
    isMessageDeleted,
    startIndex,
    pageSize,
    searchText,
  ]);

  useEffect(() => {
    dispatch(fetchMasterModule());
  }, [dispatch]);

  useEffect(() => {
    if (getApiError) {
      setApiError(handleMasterMessageError(getApiError));
    }
    else
      setApiError(false);
  }, [getApiError]);

  return (
    <>
      <PageHeading
        heading={MASTER_MESSAGE_CONSTANTS}
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
                <MatButton onClick={openAddMasterMessageDialog}>
                  {ADD_MESSAGE_CONST}
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
        <AddMasterMessage
          handleClose={closeAddMasterMessageFormDialog}
          open={open}
        />
      )}
      {openUpdateMessage && (
        <UpdateMasterMessage
          handleClose={closeUpdateMessageDialog}
          open={openUpdateMessage}
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

export default MessageConstants;
