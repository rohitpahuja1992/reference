import React, { useState, useEffect} from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import CardHeader from "@material-ui/core/CardHeader";
import MatCard from "../../components/MaterialUi/MatCard";
import MatContainer from "../../components/MaterialUi/MatContainer";
import DataTable from "../../components/DataTable";
import BreadcrumbView from "../../components/BreadcrumbView";
import Chip from "@material-ui/core/Chip";
import { formatDateDash } from "../../utils/helpers";
import { updateEntityId } from "../../actions/AppHeaderActions";
import {
  SET_DEFAULT_STARTINDEX,
  DEFAULT_START_INDEX,
  DEFAULT_PAGE_SIZE,  
} from "../../utils/AppConstants";
import {
  handleIndividualClientEnvironmentError,
  NO_RECORDS_FOR_DEPLOYMENT } from "../../utils/Messages";
import { fetchDeployConfig } from "../../actions/DeploymentConfigActions";

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

const IndividualClientDeploy = () => {
    const history = useHistory();
    const styles = useStyles();
    const dispatch = useDispatch();
    const { clientId, environment, deploymentScheduleTimeId } = useParams();
    const [apiError, setApiError] = useState(null);
    const getApiError = useSelector(
        (state) => state.ClientModule.getClientModulesError
    );
    
    const totalElements = useSelector(
      (state) => state.DeployConfigState.totalElements
    );
  const startIndex = useSelector((state) => state.DeployConfigState.startIndex);
  const pageSize = useSelector((state) => state.DeployConfigState.pageSize);
  const reset = useSelector((state) => state.DeployConfigState.reset);
  const handlePageChange = (start, size) => {
    dispatch(fetchDeployConfig(deploymentScheduleTimeId, start, size));
  };
    const handleBackButton = () => {
        history.push(`/client/config-deploy/${clientId}`);
    };

    const BreadcrumbData = [
        {
            id: "config",
            label: "Configuration Deployment",
            action: handleBackButton,
        },
        {
            id: "configEnvironment",
            label: environment,
        },
    ];


    const tableConfig = {
        tableType: "",
        paginationOption: "custom",
        // iconType: "imgIcon",
        // iconSource: ModuleIcon,
        //checked: true,
    };

    // const handleChecked = (value) => {
    //     const currentIndex = checked.findIndex((obj) => obj.id === value.id);
    //     const newChecked = [...checked];
    //     if (typeof value !== "boolean") {
    //         if (currentIndex === -1) {
    //             newChecked.push(value);
    //         } else {
    //             newChecked.splice(currentIndex, 1);
    //         }
    //         setChecked(newChecked);
    //         setAllChecked(false);
    //     }
    //     if (typeof value === "boolean" && value === true) {
    //         setAllChecked(true);
    //         let newAllChecked = [];
    //         ClientModuleList.map((row, index) => newAllChecked.push(row));
    //         setChecked(newAllChecked);
    //     }
    //     if (typeof value === "boolean" && value === false) {
    //         setAllChecked(false);
    //         setChecked([]);
    //     }
    // };

    // const handleUpdateChecked = (value) => {
    //     const currentIndex = updatechecked.findIndex((obj) => obj.id === value.id);
    //     const newChecked = [...updatechecked];
    //     if (typeof value !== "boolean") {
    //         if (currentIndex === -1) {
    //             newChecked.push(value);
    //         } else {
    //             newChecked.splice(currentIndex, 1);
    //         }
    //         setUpdatechecked(newChecked);
    //         setUpdateallChecked(false);
    //     }
    //     if (typeof value === "boolean" && value === true) {
    //         setUpdateallChecked(true);
    //         let newAllChecked = [];
    //         ClientModuleList.map((row, index) => newAllChecked.push(row));
    //         setUpdatechecked(newAllChecked);
    //     }
    //     if (typeof value === "boolean" && value === false) {
    //         setUpdateallChecked(false);
    //         setUpdatechecked([]);
    //     }
    // };

    // const handleOpenScheduleDialog = () => {
    //     setOpen(true);
    // };

    // const closeScheduleDialog = useCallback(() => {
    //     setOpen(false);
    // }, []);

    
    useEffect(() => {
        if (getApiError)
            setApiError(handleIndividualClientEnvironmentError(getApiError));
        else
            setApiError(false);
    },
        [getApiError]
    );

    const handleDeploymentStatusLabel = (details) => {
      details = details?.toLowerCase()
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

    // const cols = [
    //     { id: "moduleName", label: "Module" },
    //     { id: "componentName", label: "Component" },
    //     { id: "fieldName", label: "Field Name" },
    //     { id: "value", label: "New Value" },
    //     { id: "status", label: "Status" },
    //   ];
    //   const updatecols = [
    //     { id: "moduleName", label: "Module" },
    //     { id: "componentName", label: "Component" },
    //     { id: "fieldName", label: "Field Name" },
    //     { id: "value", label: "Original Value" },
    //     { id: "targetValue", label: "New Value" },
    //     { id: "status", label: "Status" },
    //   ];
    //   const deletecols = [
    //     { id: "moduleName", label: "Module" },
    //     { id: "componentName", label: "Component" },
    //     { id: "fieldName", label: "Field Name" },
    //     { id: "value", label: "Original Value" },
    //     { id: "targetValue", label: "New Value" },
    //     { id: "status", label: "Status" },
    //   ];
      const deployedcols = [
        { id: "moduleName", label: "Module" },
        { id: "componentName", label: "Component" },
        { id: "originalType", label: "Type" },
        { id: "labelValue", label: "Field Name" },
        { id: "value", label: "Original Value" },
        { id: "targetValue", label: "New Value" },
        { id: "status", label: "Status" },
        //{ id: "deployedStatus", label: "Deployed Status" },
      ];

      const handleType = (details) => {
        if (details === 'SYSTEM_TABLE') {
          return "System Table";
        } else if (details === 'SYSTEM_VARIABLE') {
          return "System Variable";
        } else {
          return "Message Constant";
        }
      };
      
      
      // const NewUpdateConfigAPIData = [
      //   {
      //     "module": {
      //       "id": 241,
      //       "moduleName": "SITE OF CARE",
      //       "shortName": "SOC"
      //     },
      //     "component": [
      //       {
      //         "clientOobComponentId": 218,
      //         "component": {
      //           "componentType": "SYSTEM_TABLE",
      //           "componentId": 1035,
      //           "controls": {
      //             "422": [
      //               {
      //                 "fieldName": "code",
      //                 "value": "deploycode",
      //                 "targetValue": null,
      //                 "status": "Completed"
      //               },
      //               {
      //                 "fieldName": "description",
      //                 "value": "codedesc",
      //                 "targetValue": "codedesc",
      //                 "status": "Completed"
      //               },
      //               {
      //                 "fieldName": "id",
      //                 "value": "1",
      //                 "targetValue": 1,
      //                 "status": "Failed"
      //               }
      //             ]
      //           },
      //           "componentName": "system_variables"
      //         }
      //       },
      //       {
      //         "clientOobComponentId": 219,
      //         "component": {
      //           "componentType": "SYSTEM_TABLE",
      //           "componentId": 1232,
      //           "controls": {
      //             "423": [
      //               {
      //                 "fieldName": "label_title",
      //                 "value": "titlemc",
      //                 "targetValue": "titlemc",
      //                 "status": "In Progress"
      //               },
      //               {
      //                 "fieldName": "description",
      //                 "value": "deploydesc",
      //                 "targetValue": "deploydesc",
      //                 "status": "Completed"
      //               },
      //               {
      //                 "fieldName": "id",
      //                 "value": "1",
      //                 "targetValue": 1,
      //                 "status": "Failed"
      //               },
      //               {
      //                 "fieldName": "label_name",
      //                 "value": null,
      //                 "targetValue": "deploymc",
      //                 "status": "Error"
      //               }
      //             ]
      //           },
      //           "componentName": "message_constant"
      //         }
      //       }
      //     ]
      //   }
      // ]
      let configData = {};
      let consumeData = [];
      let controlID = '';
      let controlVal = "";
    const NewUpdateConfigAPIData = useSelector(state => state?.DeployConfigState?.list || []);
    let NewUpdateConfigData = NewUpdateConfigAPIData?.map((data, index) => {
      data.componentList.map((itemval) => {
        if(typeof itemval?.component?.controls === 'object' && itemval?.component?.controls !== null && itemval?.component?.controls !== undefined && itemval?.component !== null) {
          
        Object?.entries(itemval?.component?.controls).map((itemval2) => {
          itemval2.map((itemval3) => {
            if (Number.isInteger(Number(itemval3))) {
              controlID = itemval3;
            }
            else {
              Object.entries(itemval3).map(item => {
                item.map((item2) => {
                if(!Array.isArray(item2)) {
                  controlVal = item2;
                }
                if(Array.isArray(item2)) {
                  item2.map((itemval4, indexval) => {
                    configData = {};
                    configData.id = consumeData.length + 1;
                    configData.controlID = controlID;
                    configData.controlVal = controlVal;
                    configData.componentName = itemval.component.componentName;
                    configData.fieldName = itemval4.fieldName;
                    configData.value = itemval4.inputType === "DATE" ? formatDateDash(itemval4.value) : itemval4.value === "NaN-NaN-NaN" ? '' : itemval4.value;
                    configData.primary = itemval4.primary;
                    configData.type = itemval4.type;
                    configData.originalType = handleType(itemval4.type);
                    configData.labelValue = itemval4.labelValue?itemval4.labelValue:itemval4.fieldName;
                    configData.required = itemval4.required;
                    configData.targetValue = itemval4.inputType === "DATE" ? formatDateDash(itemval4.targetValue) : itemval4.targetValue === "NaN-NaN-NaN" ? '' : itemval4.targetValue;
                    configData.moduleName = data.module.moduleName;
                    configData.status = itemval4.status;
                    configData.errorMessage = itemval4.errorMessage;
                    consumeData.push(configData);
                  });
                }
              })
              })
  
              
            }
          });
        });
      }
      });
      return consumeData;
    });
    NewUpdateConfigData = NewUpdateConfigData[0] || []
    NewUpdateConfigData = NewUpdateConfigData?.filter(
      (a) => a.fieldName !== "id"
    );
    console.log("NewUpdateConfigData",NewUpdateConfigData)
    let deploymentDetailsList = NewUpdateConfigData?.map((data) => {
      let blankData = {
        moduleName: data.moduleName,
        submodule: data.submodule,
        fieldName: data.fieldName,
        value: data.value,
        targetValue: data.targetValue,
        deleted: data.status !== "Deleted" ? false : true,
        status: (
          data.status !== "Deleted" ?
              <div>
                  {
                      <Chip
                          title={data.errorMessage}
                          label={handleDeploymentStatusLabel(data.status)}
                          className={handleDeploymentStatusClass(
                              handleDeploymentStatusLabel(data.status)
                          )}
                          color="primary"
                      />
                  }
              </div>
              : null
          ),          
      };
      return { ...data, ...blankData };
  });
  deploymentDetailsList = deploymentDetailsList?.filter(a => a.fieldName !== "id");
  // let NewConfigData = deploymentDetailsList?.filter(a => a.targetValue == null && a.value != null);
  // let UpdateConfigData = deploymentDetailsList?.filter(a => a.targetValue !== null && a.value != null);
  // let DeleteConfigData = deploymentDetailsList?.filter(a => a.targetValue != null && a.value == null);


  useEffect(() => {
    dispatch(updateEntityId(clientId));
    dispatch(fetchDeployConfig(deploymentScheduleTimeId,DEFAULT_START_INDEX, DEFAULT_PAGE_SIZE));
}, [dispatch, clientId, deploymentScheduleTimeId]);

    return (
        <MatContainer>
            <BreadcrumbView options={BreadcrumbData}></BreadcrumbView>
            {apiError ? (
        <Grid item xs={12} className={styles.error}>
          <Card className={apiError.messageType === "error" ? styles.errorCard : styles.warningCard}>
            <Typography variant="body2">
              {apiError.message}
            </Typography>
          </Card>
        </Grid>
      ) : deploymentDetailsList?.length >= 0 && (
        <MatCard className={styles.card}>
          <CardHeader
            className={styles.cardHeading}
            title={
              <Typography variant="h6" className={styles.cardHeadingSize}>
                Deployment Individual Status
              </Typography>
            }
          />
          <DataTable
                    cols={deployedcols}
                    rows={deploymentDetailsList}
                    customNoRecordsMessage={NO_RECORDS_FOR_DEPLOYMENT}
                    customNoRecords={!(deploymentDetailsList.length > 0)}
                    noRecordsCols={deploymentDetailsList.length > 0 ? 1 : deployedcols.length}
                    config={tableConfig}
                    resetPagination={reset}
                    totalElements={totalElements}
                    startIndex={startIndex}
                    handleNextPage={handlePageChange}
                    />
          {/* </CardContent> */}
        </MatCard>
      )}
            {/* {open && <AddScheduleDeployment handleClose={closeScheduleDialog} open={open} openFrom={"Add"} />} */}
        </MatContainer>
    );
};

export default IndividualClientDeploy;
