import React, { useState, useCallback, useEffect } from "react";
// import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Search from "../../components/Search";
import MatCard from "../../components/MaterialUi/MatCard";
import MatButton from "../../components/MaterialUi/MatButton";
import PageHeading from "../../components/PageHeading";
import DataTable from "../../components/DataTable";
import AddTag from "../../components/ManageAppSettings/AddTag";
import UpdateTag from "../../components/ManageAppSettings/UpdateTag";
import RateReviewIcon from "@material-ui/icons/RateReview";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteIcon from "@material-ui/icons/Delete";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { showMessageDialog } from "../../actions/MessageDialogActions";
import {
  fetchIndicators,
  deleteIndicators,
  fetchIndicatorsById,
  resetDuplicateError,
} from "../../actions/LettersActions";
import { formatDate } from "../../utils/helpers";
import {
  handleTagsError,
  CONFIRM,
  // termControlMessage,
  TAG_INDICATORS,
  NO_RECORDS_MESSAGE,
  DELETE_TAG,
  VIEW_DETAILS,
  VIEW_UPDATE_SUB,
  ADD_NEW_TAG,
  
} from "../../utils/Messages";

import {
  SET_DEFAULT_STARTINDEX,
  RESET_ADD_TAG_IS_DONE,
  RESET_ADD_TAG_ERROR,
  DEFAULT_START_INDEX,
  DEFAULT_PAGE_SIZE,  
} from "../../utils/AppConstants";

// import {
//   RESET_ADD_INDICATORS_ERROR,
// } from "../../utils/LettersAppConstant"

import { ADD_ACTION_APP_SETTINGS, DELETE_ACTION_APP_SETTINGS, UPDATE_ACTION_APP_SETTINGS } from "../../utils/FeatureConstants";

const cols = [
  { id: "name", label: "Tag Name" },
  { id: "fieldId", label: "Tag Field" },
  { id: "description", label: "Description" },
  { id: "tagType", label: "Type" },
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

const TagIdicators = (props) => {
  const styles = useStyles();
  const [open, setOpen] = React.useState(false);
  
  const dispatch = useDispatch();
  // const history = useHistory();
  const [searchText, setSearchText] = useState("");
  const [openUpdateTag, setOpenUpdateTag] = useState(false);

  const isTagDeleted = useSelector(
    (state) => state.Tag.data.isTagDeleted
  );
  
  const isTagUpdated = useSelector(
    (state) => state.Tag.data.isTagUpdated
  );

  const featuresAssigned = useSelector(
    (state) => state.User.features
  );
  const tagDetailsById = useSelector(
    (state) => state.Tag.tagDetailsById
  );
  const getApiError = useSelector((state) => state.Tag.data.getError);
  const [apiError, setApiError] = useState(null);
  const totalElements = useSelector(
    (state) => state.Tag.data.totalElements
  );
  const startIndex = useSelector((state) => state.Tag.page.startIndex || 0);
  const pageSize = useSelector((state) => state.Tag.page.pageSize);
  const reset = useSelector((state) => state.Tag.reset);
  const tagList = useSelector((state) =>
    state.Tag.data.list.map((data) => {
      let blankData = {
        id: data.id,
        tagName: data.name,
        tagField: data.fieldId,
        tagType: data.tagType,
        description: data.description,
        createdBy: data.createdByUser,
        createdOn: formatDate(data.createdDate),
      };
      return { ...data, ...blankData };
     
    })
  );

  const openTagFormDialog = () => {
    dispatch({ type: RESET_ADD_TAG_IS_DONE });
    setOpen(true);
  };

  const closeTagFormDialog = () => {
    dispatch({ type: RESET_ADD_TAG_ERROR });
    setOpen(false);
  };

  const closeUpdateTagDialog = useCallback(() => {
    setOpenUpdateTag(false);
    dispatch(resetDuplicateError());
  }, [dispatch]);

  const tableConfig = {
    tableType: "",
    paginationOption: "custom",
    menuOptions: [
      {
        type: "link",
        icon: featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1 ? <VisibilityIcon fontSize="small" /> : <RateReviewIcon fontSize="small" />,
        label: featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1 ? VIEW_DETAILS : VIEW_UPDATE_SUB,
        action: (e) => openUpdateTagDialog(e),
      },
      {
        type: "link",
        icon: <DeleteIcon fontSize="small" />,
        label: DELETE_TAG,
        action: (e) => {
          openConfirmDeleteDialog(e);
        },
      },
    ],
    actions: featuresAssigned.indexOf(DELETE_ACTION_APP_SETTINGS) === -1 &&
    {
      icon: featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1 ? <VisibilityIcon color="primary" fontSize="small" /> : <RateReviewIcon color="primary" fontSize="small" />,
      tooltipText: featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) === -1 ? VIEW_DETAILS : VIEW_UPDATE_SUB,
      action: (e) => openUpdateTagDialog(e),
    }

  };

  const openUpdateTagDialog = (data) => {
    dispatch(fetchIndicatorsById(data.id));
  };

  const handleChange = (e) => {
    dispatch({ type: RESET_ADD_TAG_ERROR });
    setSearchText(e.target.value);
    if (e.target.value === "") {
      dispatch({ type: SET_DEFAULT_STARTINDEX });
      dispatch(fetchIndicators(DEFAULT_START_INDEX, pageSize));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSearch = () => {
    if (searchText !== "") {
      dispatch({ type: SET_DEFAULT_STARTINDEX });
      dispatch(fetchIndicators(DEFAULT_START_INDEX, pageSize,'', searchText.trim()));
    }
  };

  const handlePageChange = (start, size) => {
    dispatch(fetchIndicators(start, size, '', searchText));
  };

  const openConfirmDeleteDialog = (e) => {
    let messageObj = {
      primaryButtonLabel: "Yes",
      primaryButtonAction: () => {
        dispatch(deleteIndicators(e.id, e.name));
      },
      secondaryButtonLabel: "No",
      secondaryButtonAction: () => {},
      title: CONFIRM,
      message: `Are you sure you want to term tag ${e.name}?`,
    };
    dispatch(showMessageDialog(messageObj));
  };

  useEffect(() => {
    //console.log("startIndex", startIndex);
    //console.log("pageSize", pageSize);
    dispatch(fetchIndicators(startIndex, pageSize ? pageSize : DEFAULT_PAGE_SIZE));
  }, [dispatch]);

  useEffect(() => {
    if (tagDetailsById?.id) {
      setOpenUpdateTag(true);
    }
  }, [tagDetailsById]);

  useEffect(() => {
    if (isTagUpdated) {
      dispatch(fetchIndicators(startIndex, pageSize,'', searchText));
      closeUpdateTagDialog();
    }
  }, [
    dispatch,
    isTagUpdated,
    closeUpdateTagDialog,
    startIndex,
    pageSize,
    searchText,
  ]);

  useEffect(() => {
    if (isTagDeleted) {
      //dispatch(fetchListByPage(MASTERMODULE_API_URL, startIndex, pageSize, "modules"));
      if (
        startIndex + 1 === totalElements &&
        startIndex !== DEFAULT_START_INDEX
      )
        dispatch(
          fetchIndicators(startIndex - pageSize, pageSize, searchText)
        );
      else dispatch(fetchIndicators(startIndex, pageSize, searchText));
      //dispatch(resetDuplicateError());
    }
  }, [
    dispatch,
    isTagDeleted,
    totalElements,
    startIndex,
    pageSize,
    searchText,
  ]);

  useEffect(() => {
    if (getApiError) {
      setApiError(handleTagsError(getApiError));
    }
    else
      setApiError(false);
  }, [getApiError]);

  return (
    <>
      <PageHeading
        heading={TAG_INDICATORS}
        action={
          <Grid container style={{ width: "auto" }}>
            <Search searchText={searchText} handleChange={handleChange} handleKeyPress={handleKeyPress} handleSearch={handleSearch} />
            {featuresAssigned.indexOf(ADD_ACTION_APP_SETTINGS) !== -1 && <Grid item style={{ display: "flex", alignItems: "center" }}>
              <MatButton onClick={openTagFormDialog}>{ADD_NEW_TAG}</MatButton>
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
      ) : tagList.length > 0 ? (
        <MatCard>
          <DataTable
            cols={cols}
            rows={tagList}
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
        <AddTag
          handleClose={closeTagFormDialog}
          open={open}
          resetSearchText={() => setSearchText("")}
        />
      )}
      {openUpdateTag && (
        <UpdateTag
          handleClose={closeUpdateTagDialog}
          open={openUpdateTag}
        />
      )}
    </>
  );
};

export default TagIdicators;
