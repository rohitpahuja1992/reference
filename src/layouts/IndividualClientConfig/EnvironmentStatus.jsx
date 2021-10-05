import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import CardHeader from "@material-ui/core/CardHeader";
import MatCard from "../../components/MaterialUi/MatCard";
import DataTable from "../../components/DataTable";
import LinkSolidIcon from "../../assets/images/link-solid-purple.svg";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { handleIndividualClientConfigError, NO_RECORDS_FOR_ENVIRONMENT_STATUS } from "../../utils/Messages";
import { fetchEnvironmentStatus } from "../../actions/EnvironmentStatusActions";
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
    statusInactive: {
        background: theme.palette.warning.main,
    },
    linkIconSize: {
        width: "15px",
        marginLeft: "8px"
    }
}));

const EnvironmentStatus = (props) => {
    const history = useHistory();
    const styles = useStyles();
    const dispatch = useDispatch();
    const { clientId } = useParams();
    const getApiError = useSelector(
        (state) => state.ClientModule.getClientModulesError
    );
    let matchItems = (match, total) => {
        var matchItemsPercentage = parseInt((match / total * 100).toFixed(0));
        return isNaN(matchItemsPercentage) ? 0 : matchItemsPercentage;
    }
    let nonMatchItems = (match, total) => {
        var nonMatchItemsPercentage = parseInt(((total - match) / total * 100).toFixed(0));
        return isNaN(nonMatchItemsPercentage) ? 0 : nonMatchItemsPercentage;
    }
    let ClientModuleList = useSelector(
        (state) => state.EnvironmentStatusState.list || []
    );
    const totalElements = useSelector(
        (state) => state.EnvironmentStatusState.totalElements
      );
    const startIndex = useSelector((state) => state.EnvironmentStatusState.startIndex);
    const pageSize = useSelector((state) => state.EnvironmentStatusState.pageSize);
    const reset = useSelector((state) => state.EnvironmentStatusState.reset);
    
    const handlePageChange = (start, size) => {
        dispatch(fetchEnvironmentStatus(clientId, start, size));
      };
    // let ClientModuleList = [
    //     {
    //       "environmentId": 9,
    //       "environmentName": "DevInt",
    //       "domainUrl": "https://devint.medhokapps.com/medhokws/rest/configservices?test",
    //       "comparison": {
    //         "matchItems": 0,
    //         "totalItems": 2
    //       },
    //       "connectionStatus": false,
    //       "enable": true,
    //       "paired": false
    //     },
    //     {
    //         "environmentId": 9,
    //         "environmentName": "DevInt",
    //         "domainUrl": "https://devint.medhokapps.com/medhokws/rest/configservices?test",
    //         "comparison": {
    //           "matchItems": 0,
    //           "totalItems": 2
    //         },
    //         "connectionStatus": true,
    //         "enable": true,
    //         "paired": true
    //       }
    //   ]
    if (props.popupid) {
        ClientModuleList = ClientModuleList?.filter(tempo => tempo.environmentId === props.popupid)
    }
    ClientModuleList = (ClientModuleList?.map((data) => {
        let blankData = {
            environment: (
                <>
                    {
                        <>
                            <span>{data.environmentName}</span>
                            {data.paired &&
                                <img
                                    src={LinkSolidIcon}
                                    alt={LinkSolidIcon + " icon"}
                                    className={styles.linkIconSize}
                                />
                            }
                        </>
                    }
                </>
            ),

            connectstatus: data.connectionStatus ? "Connected" : "Unable to Connect",
            comparison: data.connectionStatus && (data?.comparison?.totalItems > 0) ? [
                {
                    value: matchItems(data?.comparison?.matchItems, data?.comparison?.totalItems),
                    description: matchItems(data?.comparison?.matchItems, data?.comparison?.totalItems) + "% Match",
                    color: "#4caf50"
                },
                {
                    value: nonMatchItems(data?.comparison?.matchItems, data?.comparison?.totalItems),
                    description: nonMatchItems(data?.comparison?.matchItems, data?.comparison?.totalItems) + "% Non-Matching",
                    color: "#ff9800"
                }
            ]
                : "Unable to fetch data"

        };
        return { ...data, ...blankData };
    })
    );



    const [apiError, setApiError] = useState(null);




    const cols = [
        { id: "environment", label: "Environment" },
        { id: "connectstatus", label: "Connection Status" },
        { id: "comparison", label: "Configuration Comparison", minWidth: 600, isSorting: false },
    ];

    const tableConfig = {
        tableType: "",
        paginationOption: "custom",
        actions: {
            icon: <VisibilityIcon color="primary" fontSize="small" />,
            disabledAction: true,
            tooltipText: "View & Update Environment",
            action: (data) => {
                history.push(`/client/config-deploy/${clientId}/${data.environmentName}/${data.environmentId}`);
            },
        },
    };
    useEffect(() => {
        if (getApiError)
            setApiError(handleIndividualClientConfigError(getApiError));
        else
            setApiError(false);
    },
        [getApiError]
    );

    useEffect(() => {
        dispatch(fetchEnvironmentStatus(clientId, DEFAULT_START_INDEX, pageSize? pageSize :DEFAULT_PAGE_SIZE))
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
            ) : ClientModuleList.length >= 0 && (
                <MatCard className={styles.card}>
                    {props.openFrom !== "environmentPopup" &&
                        <CardHeader
                            className={styles.cardHeading}
                            title={
                                <Typography variant="h6" className={styles.cardHeadingSize}>
                                    Environment Status &amp; comparison
              </Typography>
                            }
                        />
                    }
                    <DataTable
                        cols={cols}
                        rows={ClientModuleList}
                        customNoRecordsMessage={NO_RECORDS_FOR_ENVIRONMENT_STATUS}
                        customNoRecords={!(ClientModuleList.length > 0)}
                        noRecordsCols={ClientModuleList.length > 0 ? 1 : cols.length}
                        resetPagination={reset}
                        totalElements={totalElements}
                        startIndex={startIndex}
                        handleNextPage={handlePageChange}
                        config={props.openFrom !== "environmentPopup" && tableConfig} />
                </MatCard>
            )}
        </>
    );
};

export default EnvironmentStatus;
