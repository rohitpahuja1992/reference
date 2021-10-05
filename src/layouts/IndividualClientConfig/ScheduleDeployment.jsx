import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import CardHeader from "@material-ui/core/CardHeader";
import { fetchScheduleById } from "../../actions/ScheduleDeploymentActions";
import MatCard from "../../components/MaterialUi/MatCard";
import MatButton from "../../components/MaterialUi/MatButton";
import DataTable from "../../components/DataTable";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {
  handleIndividualClientConfigError,
  NO_RECORDS_MESSAGE,
} from "../../utils/Messages";
import {
  FETCH_SCHEDULEDBYID_COMPLETE,
  RESET_SCHEDULEBYID_COMPLETE,
  SET_DEFAULT_STARTINDEX,
  DEFAULT_START_INDEX,
  DEFAULT_PAGE_SIZE, 
} from "../../utils/AppConstants";
import AddScheduleDeployment from "../IndividualClientEnvironment/AddScheduleDeployment";
import { formatScheduleDate, formatTimelineTime } from "../../utils/helpers";

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: "16px",
  },
  cardHeading: {
    paddingTop: "12px",
    paddingBottom: "10px",
  },
  cardHeadingSize: {
    fontSize: "18px",
    display: "flex",
  },
  btnMargin: {
    marginLeft: "auto",
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
  disableClick: {
    pointerEvents: "none",
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

const ScheduleDeployment = () => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const { clientId } = useParams();
  const [open, setOpen] = useState(false);
  const [openFrom, setOpenFrom] = useState("");

  const getApiError = useSelector(
    (state) => state.ClientModule.getClientModulesError
  );
  const totalElements = useSelector(
    (state) => state.Scheduled.scheduledDetailsList.totalElements
  );
const startIndex = useSelector((state) => state.Scheduled.scheduledDetailsList.startIndex);
const pageSize = useSelector((state) => state.Scheduled.scheduledDetailsList.pageSize);
const reset = useSelector((state) => state.Scheduled.scheduledDetailsList.reset);

const handlePageChange = (start, size) => {
    dispatch(fetchScheduleById(clientId, start, size));
  };
  let scheduledList = useSelector((state) =>
    state.Scheduled.scheduledDetailsList.list.map((data) => {
      let blankData = {
        id: data.id,
        environment: data?.destinationEnvironment?.environmentName,
        copyDate: !data.nextDeploymentTime ? data.scheduleDate : data.nextDeploymentTime,
        date: formatScheduleDate(!data.nextDeploymentTime ? data.scheduleDate : data.nextDeploymentTime),
        frequency: data.frequency,
        time: formatTimelineTime(!data.nextDeploymentTime ? data.scheduleDate : data.nextDeploymentTime),
        scheduledBy: data.createdByUser,
        ticket: data.jiraTicketNumber,
      };
      return { ...data, ...blankData };
    })
  );

  scheduledList = scheduledList?.filter(a => a.type === "SCHEDULED");
  const [apiError, setApiError] = useState(null);

  const cols = [
    { id: "environment", label: "Environment" },
    { id: "date", label: "Date" },
    { id: "time", label: "Time" },
    { id: "frequency", label: "Frequency" },
    { id: "scheduledBy", label: "Scheduled By" },
    { id: "ticket", label: "Ticket #" },
  ];

  const tableConfig = {
    tableType: "",
    paginationOption: "custom",
    actions: {
      icon: <VisibilityIcon color="primary" fontSize="small" />,
      tooltipText: "View & Update Details",
      action: (data) => {
        setOpenFrom("Cancel");
        setOpen(true);
        dispatch({ type: FETCH_SCHEDULEDBYID_COMPLETE, payload: data });
      },
    },
  };

  const closeScheduleDialog = useCallback(() => {
    setOpen(false);
    dispatch({ type: RESET_SCHEDULEBYID_COMPLETE });
  }, [dispatch]);

  useEffect(() => {
    if (getApiError)
      setApiError(handleIndividualClientConfigError(getApiError));
    else setApiError(false);
  }, [getApiError]);
  const handleOpenSchedule = () => {
    setOpenFrom("Add");
    setOpen(true);
    dispatch({ type: FETCH_SCHEDULEDBYID_COMPLETE, payload: [] });
  };
  useEffect(() => {
    dispatch(fetchScheduleById(clientId, DEFAULT_START_INDEX, pageSize? pageSize :DEFAULT_PAGE_SIZE));
  }, [dispatch, clientId]);

  return (
    <>
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
      ) : (
        <MatCard className={styles.card}>
          {scheduledList.length >= 0 && (
            <CardHeader
              className={styles.cardHeading}
              title={
                <Typography variant="h6" className={styles.cardHeadingSize}>
                  Scheduled Deployments
                  <MatButton
                    className={styles.btnMargin}
                    onClick={handleOpenSchedule}
                  >
                    Schedule Deployment
                  </MatButton>
                </Typography>
              }
            />
          )}

          {scheduledList.length >= 0 && (
            <DataTable
              cols={cols}
              rows={scheduledList}
              customNoRecordsMessage={NO_RECORDS_MESSAGE}
              customNoRecords={!(scheduledList.length > 0)}
              noRecordsCols={scheduledList.length > 0 ? 1 : cols.length}
              config={tableConfig}
              resetPagination={reset}
              totalElements={totalElements}
              startIndex={startIndex}
              handleNextPage={handlePageChange} />
          )}
        </MatCard>
      )}
      {open && (
        <AddScheduleDeployment
          handleClose={closeScheduleDialog}
          open={open}
          openFrom={openFrom}
        />
      )}
    </>
  );
};

export default ScheduleDeployment;
