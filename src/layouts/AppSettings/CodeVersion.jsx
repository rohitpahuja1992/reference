import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core";
import MatButton from "../../components/MaterialUi/MatButton";
import MatCard from "../../components/MaterialUi/MatCard";
import DataTable from "../../components/DataTable";
import PageHeading from "../../components/PageHeading";
import AddVersion from "../../components/ManageAppSettings/AddCodeVersion";
import UpdateCodeVersion from "../../components/ManageAppSettings/UpdateCodeVersion";
import DeleteIcon from "@material-ui/icons/Delete";
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import { CardContent } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import RateReviewIcon from "@material-ui/icons/RateReview";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { showMessageDialog } from "../../actions/MessageDialogActions";
import { ADD_ACTION_APP_SETTINGS } from "../../utils/FeatureConstants";
import {
  deleteCodeVersion,
  resetDuplicateError,
  fetchCodeVersion,
  untermCodeVersion
} from "../../actions/CodeVersionActions";
import { formatDate } from "../../utils/helpers";
import {
  NO_RECORDS_MESSAGE,
  handleCodeVersionError,
  VIEW_DETAILS,
  VIEW_UPDATE,
  TERM_CODE_VER,
  UNTERM_CODE_VER,
  CONFIRM,
  CODE_VERSION,
  ADD_NEW_CODE_VER,
  codeTermVersionMessage,
  codeUntermVersionMessage
} from "../../utils/Messages";
import { DELETE_ACTION_APP_SETTINGS,UPDATE_ACTION_APP_SETTINGS } from "../../utils/FeatureConstants";
import {
  SET_DEFAULT_STARTINDEX,
  DEFAULT_START_INDEX,
  DEFAULT_PAGE_SIZE, 
} from "../../utils/AppConstants";
const useStyles = makeStyles((theme) => ({
  col: {
    padding: "10px",
  },
  grow: {
    flexGrow: 1,
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
  { id: "id", label: "ID" },
  { id: "codeVersion", label: "Code Version" },
  { id: "type", label: "Version Type" },
  { id: "createdBy", label: "Created By" },
  { id: "createdAt", label: "Created Date", minWidth: 120 },
];

const CodeVersion = () => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [openUpdateCodeVersion, setOpenUpdateCodeVersion] = useState(false);
  const [selectedData,setSelectedData] = useState("");
  const getApiError = useSelector((state) => state.CodeVersion.getError);
  const [apiError, setApiError] = useState(null);
  const isCodeVersionDeleted = useSelector(
    (state) => state.CodeVersion.isCodeVersionDeleted
  );
  const isCodeVersionUpdated = useSelector(
    (state) => state.CodeVersion.isCodeVersionUpdated
  );
  const featuresAssigned = useSelector(
    (state) => state.User.features
  );
  const isCodeVersionAdded = useSelector(
    (state) => state.CodeVersion.isCodeVersionAdded
  );
  const codeVersionDetailsList = useSelector((state) =>
    state.CodeVersion.codeVersionDetailsList.list.map((data) => {
      let codeVersionData = {
        id: data.id,
        codeVersion: data.codeVersion,
        type: data.type,
        createdBy: data.createdByUser,
        createdAt: formatDate(data.createdDate),
        updatedBy: data.updatedByUser,
        updatedAt: data.updatedDate && formatDate(data.updatedDate),
        deleted: data.deleted,
        termStatus: data.deleted
      };
      return { ...codeVersionData };
    })
  );
  const totalElements = useSelector(
    (state) => state.CodeVersion.codeVersionDetailsList.totalElements
  );
const startIndex = useSelector((state) => state.CodeVersion.codeVersionDetailsList.startIndex);
const pageSize = useSelector((state) => state.CodeVersion.codeVersionDetailsList.pageSize);
const reset = useSelector((state) => state.CodeVersion.codeVersionDetailsList.reset);

const handlePageChange = (start, size) => {
    dispatch(fetchCodeVersion(start, size));
  };
  const tableConfig = {
    tableType: "",
    paginationOption: "custom",
    menuOptions: [
      {
        type: "link",
        icon: featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1 ? <VisibilityIcon fontSize="small" /> : <RateReviewIcon fontSize="small" />,
        label: featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1 ? VIEW_DETAILS : VIEW_UPDATE,
        display: "Hide",
        action: (e) => openUpdateCodeVersionDialog(e),
      },
      {
        type: "link",
        icon: <DeleteIcon fontSize="small" />,
        label: TERM_CODE_VER,
        override: (properties, row) => {
          //
          properties.label = row?.termStatus ? UNTERM_CODE_VER  : TERM_CODE_VER;
          properties.icon = row?.termStatus ? <RestoreFromTrashIcon fontSize="small" />  : <DeleteIcon fontSize="small" />;
        },
        action: (e) => {
          if (e.termStatus) {
            openUntermDialog(e);
          }
          else {
            openConfirmDeleteDialog(e);
          }
        },
      },
    ],
    actions: featuresAssigned.indexOf(DELETE_ACTION_APP_SETTINGS) === -1 && {
      icon: featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1 ? <VisibilityIcon color="primary" fontSize="small" /> : <RateReviewIcon color="primary" fontSize="small" />,
      tooltipText: featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1 ? VIEW_DETAILS : VIEW_UPDATE,
      display: "Hide",
      action: (e) => openUpdateCodeVersionDialog(e)
    },
  };

  const openConfirmDeleteDialog = (e) => {
    let messageObj = {
      primaryButtonLabel: "Yes",
      primaryButtonAction: () => {
        dispatch(deleteCodeVersion(e.id, e.codeVersion));
      },
      secondaryButtonLabel: "No",
      secondaryButtonAction: () => {},
      title: CONFIRM,
      message: codeTermVersionMessage(e.codeVersion),
    };
    dispatch(showMessageDialog(messageObj));
  };

  const openUntermDialog = (e) => {
    let messageObj = {
      primaryButtonLabel: "Yes",
      primaryButtonAction: () => {
        dispatch(untermCodeVersion(e.id, e.codeVersion));
      },
      secondaryButtonLabel: "No",
      secondaryButtonAction: () => { },
      title: CONFIRM,
      message: codeUntermVersionMessage(e.codeVersion),
    };
    dispatch(showMessageDialog(messageObj));
  };

  const openAddVersionDialog = () => {
    setOpen(true);
  };

  const closeAddVersionDialog = useCallback(() => {
    dispatch(resetDuplicateError());
    setOpen(false);
  }, [dispatch]);

  const openUpdateCodeVersionDialog = (data) => {
    //dispatch(fetchSectionById(data.id));
    setSelectedData(data);
    setOpenUpdateCodeVersion(true);
  };

  const closeUpdateCodeVersionDialog = useCallback(() => {
    setOpenUpdateCodeVersion(false);
    dispatch(resetDuplicateError());
  }, [dispatch]);

  useEffect(() => {
    if (isCodeVersionAdded) {
      dispatch(fetchCodeVersion(DEFAULT_START_INDEX, DEFAULT_PAGE_SIZE));
      closeAddVersionDialog();
    }
  }, [dispatch, isCodeVersionAdded, closeAddVersionDialog]);

  useEffect(() => {
    if (isCodeVersionUpdated) {
      dispatch(fetchCodeVersion(DEFAULT_START_INDEX, DEFAULT_PAGE_SIZE));
      closeUpdateCodeVersionDialog();
    }
  }, [
    dispatch,
    isCodeVersionUpdated,
    closeUpdateCodeVersionDialog,
  ]);

  useEffect(() => {
    if (isCodeVersionDeleted) {
      dispatch(fetchCodeVersion(DEFAULT_START_INDEX, DEFAULT_PAGE_SIZE));
    }
  }, [dispatch, isCodeVersionDeleted]);

  useEffect(() => {
    if (getApiError) {
      setApiError(handleCodeVersionError(getApiError));
    }
    else
      setApiError(false);
  }, [getApiError]);

  return (
    <>
      <PageHeading
        heading={CODE_VERSION}
        action={
          featuresAssigned.indexOf(ADD_ACTION_APP_SETTINGS) !== -1 &&
          <MatButton onClick={openAddVersionDialog}>
            {ADD_NEW_CODE_VER}
          </MatButton>
        }
      />
      {apiError ? (
        <Grid item xs={12} className={styles.col}>
          <Card className={apiError.messageType === "error" ? styles.errorCard : styles.warningCard}>
            <Typography variant="body2">{apiError.message}</Typography>
          </Card>
        </Grid>
      ) : codeVersionDetailsList.length > 0 ? (
        <MatCard>
          <DataTable
            cols={cols}
            rows={codeVersionDetailsList}
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
      {open && <AddVersion handleClose={closeAddVersionDialog} open={open} />}
      {openUpdateCodeVersion && (
        <UpdateCodeVersion
          handleClose={closeUpdateCodeVersionDialog}
          open={openUpdateCodeVersion}
          data={selectedData}
        />
      )}
    </>
  );
};

export default CodeVersion;
