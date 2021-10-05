import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Search from "../../../components/Search";
import MatCard from "../../../components/MaterialUi/MatCard";
import MatButton from "../../../components/MaterialUi/MatButton";
import PageHeading from "../../../components/PageHeading";
import DataTable from "../../../components/DataTable";
import AddControl from "../../../components/AddControl";
import RateReviewIcon from "@material-ui/icons/RateReview";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteIcon from "@material-ui/icons/Delete";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { showMessageDialog } from "../../../actions/MessageDialogActions";
import {
  fetchMasterControl,
  deleteMasterControl,
} from "../../../actions/ControlActions";
import { formatDate } from "../../../utils/helpers";
import {
  handleControlsError,
  CONFIRM,
  termControlMessage,
  MASTER_CONTROL,
  NO_RECORDS_MESSAGE,
  TERM_CONTROL,
  VIEW_PROP,
  VIEW_ADD_PROP,
  ADD_NEW_CONTROL,
} from "../../../utils/Messages";

import {
  SET_DEFAULT_STARTINDEX,
  RESET_ADD_CONTROL_IS_DONE,
  RESET_ADD_CONTROL_ERROR,
  DEFAULT_START_INDEX,
  DEFAULT_PAGE_SIZE,
} from "../../../utils/AppConstants";
import { ADD_ACTION_APP_SETTINGS, DELETE_ACTION_APP_SETTINGS } from "../../../utils/FeatureConstants";

const cols = [
  { id: "name", label: "Control Name" },
  // { id: "internalName", label: "Internal Name" },
  { id: "controlType", label: "Type" },
  { id: "noOfFields", label: "Number of Fields" },
  { id: "createdBy", label: "Created By" },
  { id: "createdOn", label: "Created On" },
];

const useStyles = makeStyles((theme) => ({
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

const Controls = (props) => {
  const styles = useStyles();
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const [searchText, setSearchText] = useState("");
  const isControlDeleted = useSelector(
    (state) => state.Control.data.isControlDeleted
  );
  const featuresAssigned = useSelector(
    (state) => state.User.features
  );
  const getApiError = useSelector((state) => state.Control.data.getError);
  const [apiError, setApiError] = useState(null);
  const totalElements = useSelector(
    (state) => state.Control.data.totalElements
  );
  const startIndex = useSelector((state) => state.Control.page.startIndex);
  const pageSize = useSelector((state) => state.Control.page.pageSize);
  const reset = useSelector((state) => state.Control.reset);
  const controlList = useSelector((state) =>
    state.Control.data.list.map((control) => {
      // let controlFormat = JSON.parse(control.format);
      control.noOfFields = control.format.length;
      // control.controlType = control.type === "form" ? "Form" : "Other Content";
      control.controlType = control.type;
      control.createdBy = control.createdByUser;
      control.createdOn = formatDate(control.createdDate);
      return control;
    })
  );

  const openControlFormDialog = () => {
    dispatch({ type: RESET_ADD_CONTROL_IS_DONE });
    setOpen(true);
  };

  const closeControlFormDialog = () => {
    dispatch({ type: RESET_ADD_CONTROL_ERROR });
    setOpen(false);
  };

  const tableConfig = {
    tableType: "",
    paginationOption: "custom",
    menuOptions: [
      {
        type: "link",
        icon: featuresAssigned.indexOf(ADD_ACTION_APP_SETTINGS) === -1 ? <VisibilityIcon fontSize="small" /> : <RateReviewIcon fontSize="small" />,
        label: featuresAssigned.indexOf(ADD_ACTION_APP_SETTINGS) === -1 ? VIEW_PROP : VIEW_ADD_PROP,
        action: (data) => {
          history.push(`/admin/app-setting/control-group/${data.id}`);
        },
      },
      {
        type: "link",
        icon: <DeleteIcon fontSize="small" />,
        label: TERM_CONTROL,
        action: (e) => {
          openConfirmDeleteDialog(e);
        },
      },
    ],
    actions: featuresAssigned.indexOf(DELETE_ACTION_APP_SETTINGS) === -1 &&
    {
      icon: featuresAssigned.indexOf(ADD_ACTION_APP_SETTINGS) === -1 ? <VisibilityIcon color="primary" fontSize="small" /> : <RateReviewIcon color="primary" fontSize="small" />,
      tooltipText: featuresAssigned.indexOf(ADD_ACTION_APP_SETTINGS) === -1 ? VIEW_PROP : VIEW_ADD_PROP,
      action: (data) => {
        history.push(`/admin/app-setting/control-group/${data.id}`);
      },
    }
    // actions: {
    //   icon: <RateReviewIcon color="primary" />,
    //   tooltipText: "View & Add Fields",
    //   action: (data) => {
    //     history.push(`/admin/app-setting/control-group/${data.id}`);
    //   },
    // },
  };

  const handleChange = (e) => {
    setSearchText(e.target.value);
    if (e.target.value === "") {
      dispatch({ type: SET_DEFAULT_STARTINDEX });
      dispatch(fetchMasterControl(DEFAULT_START_INDEX, pageSize));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSearch = () => {
    if (searchText !== "") {
      dispatch({ type: SET_DEFAULT_STARTINDEX });
      dispatch(fetchMasterControl(DEFAULT_START_INDEX, pageSize, searchText));
    }
  };

  const handlePageChange = (start, size) => {
    dispatch(fetchMasterControl(start, size, searchText));
  };

  const openConfirmDeleteDialog = (e) => {
    let messageObj = {
      primaryButtonLabel: "Yes",
      primaryButtonAction: () => {
        dispatch(deleteMasterControl(e.id, e.name));
      },
      secondaryButtonLabel: "No",
      secondaryButtonAction: () => {},
      title: CONFIRM,
      message: termControlMessage(e.name),
    };
    dispatch(showMessageDialog(messageObj));
  };

  useEffect(() => {
    //console.log("startIndex", startIndex);
    //console.log("pageSize", pageSize);
    dispatch(fetchMasterControl(DEFAULT_START_INDEX, DEFAULT_PAGE_SIZE));
  }, [dispatch]);

  useEffect(() => {
    if (isControlDeleted) {
      //dispatch(fetchListByPage(MASTERMODULE_API_URL, startIndex, pageSize, "modules"));
      if (
        startIndex + 1 === totalElements &&
        startIndex !== DEFAULT_START_INDEX
      )
        dispatch(
          fetchMasterControl(startIndex - pageSize, pageSize, searchText)
        );
      else dispatch(fetchMasterControl(startIndex, pageSize, searchText));
      //dispatch(resetDuplicateError());
    }
  }, [
    dispatch,
    isControlDeleted,
    totalElements,
    startIndex,
    pageSize,
    searchText,
  ]);

  useEffect(() => {
    if (getApiError) {
      setApiError(handleControlsError(getApiError));
    }
    else
      setApiError(false);
  }, [getApiError]);

  return (
    <>
      <PageHeading
        heading={MASTER_CONTROL}
        action={
          <Grid container style={{ width: "auto" }}>
            <Search searchText={searchText} handleChange={handleChange} handleKeyPress={handleKeyPress} handleSearch={handleSearch} />
            {featuresAssigned.indexOf(ADD_ACTION_APP_SETTINGS) !== -1 && <Grid item style={{ display: "flex", alignItems: "center" }}>
              <MatButton onClick={openControlFormDialog}>{ADD_NEW_CONTROL}</MatButton>
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
      ) : controlList.length > 0 ? (
        <MatCard>
          <DataTable
            cols={cols}
            rows={controlList}
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
        <AddControl
          handleClose={closeControlFormDialog}
          open={open}
          resetSearchText={() => setSearchText("")}
        />
      )}
    </>
  );
};

export default Controls;
