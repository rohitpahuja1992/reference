import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import Chip from "@material-ui/core/Chip";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import CardHeader from "@material-ui/core/CardHeader";

import MatCard from "../../components/MaterialUi/MatCard";

import DataTable from "../../components/DataTable";

import VisibilityIcon from "@material-ui/icons/Visibility";
import { handleIndividualClientConfigError, NO_RECORDS_FOR_DEPLOYMENT_HISTORY } from "../../utils/Messages";
import { fetchDeploymentHistory } from "../../actions/DeploymentHistoryActions";
import { formatScheduleDate, formatTimelineTime } from "../../utils/helpers";
import RefreshIcon from '@material-ui/icons/Refresh';
import {
    SET_DEFAULT_STARTINDEX,
    DEFAULT_START_INDEX,
    DEFAULT_PAGE_SIZE,  
  } from "../../utils/AppConstants";

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
    },
    refresh: {
        marginLeft: "10px",
        cursor: "pointer",
        marginTop: "3px"
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
        boxShadow: 'none !important',
        color: '#ffffff',
        padding: '12px 16px',
        marginBottom: '14px'
    },
    statusActive: {
        background: "#00c853",
    },
    statusInprogress: {
        background: "#d0940e",
    },
    statusInactive: {
        background: theme.palette.warning.main,
    },
    statusTerminated: {
        background: theme.palette.error.main,
    },
}));

const DeploymentHistory = () => {
    const history = useHistory();
    const styles = useStyles();
    const dispatch = useDispatch();
    const { clientId } = useParams();
    const handleType = (details) => {
        if (details === 'ADHOC') {
          return "Ad Hoc";
        } else if (details === 'AUTO_SETUP') {
          return "Auto Setup";
        } else if (details === 'AUTO') {
          return "Auto";
        } else if (details === 'SCHEDULED') {
          return "Scheduled";
        } else {
          return details;
        }
      };
    const getApiError = useSelector(
        (state) => state.ClientModule.getClientModulesError
    );
    let ClientModuleList = useSelector(
        (state) => state?.DeploymentHistoryState?.list || []
    );
    let ClientModuleList2 = ClientModuleList?.map((data) => {
        let blankData = {
            environment: !!data.destinationEnvironment ? data.destinationEnvironment.environmentName : '',
            date: formatScheduleDate(!data.nextDeploymentTime ? data.scheduleDate : data.nextDeploymentTime),
            sortDate: !data.nextDeploymentTime ? data.scheduleDate : data.nextDeploymentTime,
            time: formatTimelineTime(!data.nextDeploymentTime ? data.scheduleDate : data.nextDeploymentTime),
            type: handleType(data.type),
            ticket: data.jiraTicketNumber,
            status: data.status,
            deploymentScheduleTimeId: data.deploymentScheduleTimeId
        };
        return { ...data, ...blankData };
    })
    const totalElements = useSelector(
        (state) => state.DeploymentHistoryState.totalElements
      );
    const startIndex = useSelector((state) => state.DeploymentHistoryState.startIndex);
    const pageSize = useSelector((state) => state.DeploymentHistoryState.pageSize);
    const reset = useSelector((state) => state.DeploymentHistoryState.reset);
    const [apiError, setApiError] = useState(null);

    const handlePageChange = (start, size) => {
        dispatch(fetchDeploymentHistory(clientId, start, size));
      };

    const handleDeploymentStatusLabel = (details) => {
        details = details.toLowerCase()
        if (details === 'failed') {
            return "Failed";
        } else if (details === 'completed_errors') {
            return "Completed with Error(s)";
        } else if (details === 'updated') {
            return "Updated";
        } else if (details === 'deleted') {
            return "Deleted";
        } else if (details === 'created') {
            return "Created";
        } else if (details === 'in_progress') {
            return "In Progress";
        } else {
            return "Completed";
        }
    };

    const handleDeploymentStatusClass = (status) => {
        if (status === 'Failed') {
            return styles.statusTerminated;
        } else if (status === 'Completed with Error(s)') {
            return styles.statusInactive;
        } else if (status === 'In Progress') {
            return styles.statusInprogress;
        } else {
            return styles.statusActive;
        }
    };

    const cols = [
        { id: "environment", label: "Environment" },
        { id: "date", label: "Date" },
        { id: "time", label: "Time" },
        { id: "frequency", label: "Frequency" },
        { id: "type", label: "Type" },
        { id: "ticket", label: "Ticket #" },
        { id: "status", label: "Status" },
    ];

    let deploymentDetailsList = ClientModuleList2?.map((data) => {
        let blankData = {
            id: data.id,
            status: (
                <div>
                    {
                        <Chip
                            title={data.errorDescription}
                            label={handleDeploymentStatusLabel(data.status)}
                            className={handleDeploymentStatusClass(
                                handleDeploymentStatusLabel(data.status)
                            )}
                            color="primary"
                        />
                    }
                </div>
            ),
            statusDialog: handleDeploymentStatusLabel(data.status),

        };
        return { ...data, ...blankData };
    });
    deploymentDetailsList = deploymentDetailsList.sort(function(a,b){
        return new Date(b.sortDate) - new Date(a.sortDate)
      });
  
    const tableConfig = {
        tableType: "",
        paginationOption: "custom",
        actions: {
            icon: <VisibilityIcon color="primary" fontSize="small" />,
            tooltipText: "View Details",
            action: (data) => {
                history.push(`/client/config-deploy/${clientId}/Deploy/${data.environment}/${data.deploymentScheduleTimeId}`);
            },
        },
    };
    const handleRefresh = () => {
        dispatch(fetchDeploymentHistory(clientId, DEFAULT_START_INDEX, DEFAULT_PAGE_SIZE));
    }
    useEffect(() => {
        if (getApiError)
            setApiError(handleIndividualClientConfigError(getApiError));
        else
            setApiError(false);
    },
        [getApiError]
    );

    useEffect(() => {
        dispatch(fetchDeploymentHistory(clientId, startIndex, pageSize ? pageSize : DEFAULT_PAGE_SIZE))
    },
        []
    );

    return (
        <>
            {apiError ? (
                <Grid item xs={12} className={styles.error}>
                    <Card className={apiError.messageType === "error" ? styles.errorCard : styles.warningCard}>
                        <Typography variant="body2">
                            {apiError.message}
                        </Typography>
                    </Card>
                </Grid>
            ) : deploymentDetailsList.length >= 0 && (
                <MatCard className={styles.card}>
                    <CardHeader
                        className={styles.cardHeading}
                        title={
                            <Typography variant="h6" className={styles.cardHeadingSize}>
                                Deployment History
                                <RefreshIcon className={styles.refresh} onClick={handleRefresh} />
                            </Typography>
                        }
                    />
                    <DataTable
                        cols={cols}
                        rows={deploymentDetailsList}
                        totalElements={totalElements}
                        customNoRecordsMessage={NO_RECORDS_FOR_DEPLOYMENT_HISTORY}
                        customNoRecords={!(deploymentDetailsList.length > 0)}
                        noRecordsCols={deploymentDetailsList.length > 0 ? 1 : cols.length}
                        config={tableConfig}
                        resetPagination={reset}
                        
                        startIndex={startIndex}
                        handleNextPage={handlePageChange}
                        />
                </MatCard>
            )}
        </>
    );
};

export default DeploymentHistory;
