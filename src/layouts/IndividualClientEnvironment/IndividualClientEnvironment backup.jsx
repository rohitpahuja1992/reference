import React, { useState, useEffect, useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
// import { CardContent } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import Chip from "@material-ui/core/Chip";
import MatButton from "../../components/MaterialUi/MatButton";
import MatCard from "../../components/MaterialUi/MatCard";
//import MatButton from "../../components/MaterialUi/MatButton";
import MatContainer from "../../components/MaterialUi/MatContainer";
import PageHeading from "../../components/PageHeading";
import DataTable from "../../components/DataTable";
import HSBar from "react-horizontal-stacked-bar-chart";
//import ManageModule from "../../components/ManageModule";
import BreadcrumbView from "../../components/BreadcrumbView";
//import RateReviewIcon from "@material-ui/icons/RateReview";
//import DeleteIcon from "@material-ui/icons/Delete";
//import VisibilityIcon from "@material-ui/icons/Visibility";
//import ListAltIcon from '@material-ui/icons/ListAlt';
//import ModuleIcon from "../../assets/images/module-icon.svg";
//import { showMessageDialog } from "../../actions/MessageDialogActions";
//import { fetchOOBModule } from "../../actions/OOBModuleActions";
import { formatDateDash } from "../../utils/helpers";
import { updateEntityId } from "../../actions/AppHeaderActions";
import {
  approveCustReqReady,
  handleIndividualClientEnvironmentError,
  NO_RECORDS_MESSAGE,
  NO_RECORDS_FOR_NEW_CONFIG,
  NO_RECORDS_FOR_UPDATES,
  NO_RECORDS_FOR_DEPLOYMENT,
} from "../../utils/Messages";
//import { fetchClientModule } from "../../actions/ClientModuleActions";
//import { RESET_DEFAULTVERSION } from "../../utils/AppConstants";
import AddScheduleDeployment from "./AddScheduleDeployment";
import { deployConfig, fetchNewConfig } from "../../actions/NewConfigActions";
import { fetchEnvironmentStatus } from "../../actions/EnvironmentStatusActions";
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
  statusTerminated: {
    background: theme.palette.error.main,
},
}));

const IndividualClientEnvironment = () => {
  const history = useHistory();
  const styles = useStyles();
  const dispatch = useDispatch();
  //const { url } = useRouteMatch();
  //const [label, setLabel] = useState();
  const [open, setOpen] = useState(false);
  const { clientId, environment, environmentId } = useParams();
  const [apiError, setApiError] = useState(null);
  const getApiError = useSelector(
    (state) => state.ClientModule.getClientModulesError
  );
  let camparisonData = useSelector(
    (state) => state.EnvironmentStatusState.list || []
  );
  camparisonData = camparisonData?.filter(
    (tempo) => tempo.environmentName === environment
  );
  camparisonData = camparisonData[0];
  let matchItems = parseInt(
    (
      (camparisonData?.comparison?.matchItems /
        camparisonData?.comparison?.totalItems) *
      100
    ).toFixed(0)
  );
  let nonMatchItems = parseInt(
    (
      ((camparisonData?.comparison?.totalItems -
        camparisonData?.comparison?.matchItems) /
        camparisonData?.comparison?.totalItems) *
      100
    ).toFixed(0)
  );
  const [checked, setChecked] = useState([]);
  const [allChecked, setAllChecked] = useState(false);
  const [updatechecked, setUpdatechecked] = useState([]);
  const [updateallChecked, setUpdateallChecked] = useState(false);
  const featuresAssigned = useSelector((state) => state.User.features);
  // const loggedInUserData = useSelector(
  //     (state) => state.User.loggedInUser.details
  // );
  // const handleGlobalClass = (status) => {
  //     if (status === "Yes") {
  //         return styles.statusActive;
  //     } else return styles.statusInactive;
  // };

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
    // iconType: "imgIcon",
    // iconSource: ModuleIcon,
    checked: true,
  };
  const deleteTableConfig = {
    tableType: "",
    // iconType: "imgIcon",
    // iconSource: ModuleIcon,
    checked: false,
  };

  const handleDeploymentStatusLabel = (details) => {
    if (details === 'Deleted') {
      return "Deleted";
    } else {
      return "Completed";
    }
  };

  const handleDeploymentStatusClass = (status) => {
    if (status === 'Deleted') {
      return styles.statusTerminated;
    } else {
      return styles.statusActive;
    }
  };

  // const handleOpenScheduleDialog = () => {
  //   setOpen(true);
  // };

  const closeScheduleDialog = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    dispatch(updateEntityId(clientId));
    dispatch(fetchNewConfig(clientId,environmentId));
    dispatch(fetchEnvironmentStatus(clientId));
  }, [dispatch, clientId]);

  useEffect(() => {
    if (getApiError)
      setApiError(handleIndividualClientEnvironmentError(getApiError));
    else setApiError(false);
  }, [getApiError]);

  const cols = [
    { id: "moduleName", label: "Module" },
    { id: "submodule", label: "Component" },
    { id: "fieldName", label: "Field Name" },
    { id: "value", label: "New Value" },
  ];
  const updatecols = [
    { id: "moduleName", label: "Module" },
    { id: "submodule", label: "Component" },
    { id: "fieldName", label: "Field Name" },
    { id: "targetValue", label: "Original Value" },
    { id: "value", label: "New Value" },
  ];
  // const deletecols = [
  //   { id: "moduleName", label: "Module" },
  //   { id: "submodule", label: "Component" },
  //   { id: "fieldName", label: "Field Name" },
  //   { id: "targetValue", label: "Original Value" },
  //   { id: "value", label: "New Value" },
  // ];
  const deployedcols = [
    { id: "moduleName", label: "Module" },
    { id: "submodule", label: "Component" },
    { id: "fieldName", label: "Field Name" },
    { id: "targetValue", label: "Original Value" },
    { id: "value", label: "New Value" },
    { id: "deployedStatus", label: "Deployed Status" },
  ];
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
  //                 "primary": true
  //               },
  //               {
  //                 "fieldName": "description",
  //                 "value": null,
  //                 "targetValue": "codedesc",
  //                 "primary": false
  //               },
  //               {
  //                 "fieldName": "id",
  //                 "value": "1",
  //                 "targetValue": 1,
  //                 "primary": false
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
  //                 "primary": false
  //               },
  //               {
  //                 "fieldName": "description",
  //                 "value": "deploydesc",
  //                 "targetValue": "deploydesc",
  //                 "primary": true
  //               },
  //               {
  //                 "fieldName": "id",
  //                 "value": "1",
  //                 "targetValue": null,
  //                 "primary": false
  //               },
  //               {
  //                 "fieldName": "label_name",
  //                 "value": "deploymc",
  //                 "targetValue": "deploymc",
  //                 "primary": false
  //               }
  //             ]
  //           },
  //           "componentName": "message_constant"
  //         }
  //       }
  //     ]
  //   }
  // ]
//   const NewUpdateConfigAPIData = [
//     {
//         "module": {
//             "id": 145,
//             "moduleName": "GLOBAL",
//             "shortName": "GLOBAL"
//         },
//         "component": [
//             {
//                 "clientOobComponentId": 236,
//                 "component": {
//                     "componentType": "CMT_COMPONENT",
//                     "componentId": 1,
//                     "controls": {
//                         "437": []
//                     },
//                     "componentName": "EMAILS"
//                 }
//             }
//         ]
//     },
//     {
//         "module": {
//             "id": 144,
//             "moduleName": "OTHER",
//             "shortName": "OTHER"
//         },
//         "component": [
//             {
//                 "clientOobComponentId": 237,
//                 "component": {
//                     "componentType": "CMT_COMPONENT",
//                     "componentId": 1,
//                     "controls": {
//                         "438": []
//                     },
//                     "componentName": "EMAILS"
//                 }
//             }
//         ]
//     },
//     {
//         "module": {
//             "id": 242,
//             "moduleName": "SOC",
//             "shortName": "SOC"
//         },
//         "component": [
//             {
//                 "clientOobComponentId": 238,
//                 "component": {
//                     "componentType": "SYSTEM_TABLE",
//                     "componentId": 1035,
//                     "controls": {
//                         "439": [
//                             {
//                                 "fieldName": "code",
//                                 "value": "soc code",
//                                 "targetValue": null,
//                                 "primary": true
//                             },
//                             {
//                                 "fieldName": "description",
//                                 "value": "soc description",
//                                 "targetValue": null,
//                                 "primary": false
//                             },
//                             {
//                                 "fieldName": "description",
//                                 "value": "soc description",
//                                 "targetValue": "soc description",
//                                 "primary": false
//                             },
//                             {
//                                 "fieldName": "description",
//                                 "value": null,
//                                 "targetValue": "abc",
//                                 "primary": false
//                             }
//                         ]
//                     },
//                     "componentName": "system_variables"
//                 }
//             }
//         ]
//     }
// ]

  const convertDate = (value) => {    
    let dateWrapper = new Date(value);
    if(dateWrapper!=="Invalid Date" && value?.toString()?.split("-").length === 3 && (value?.toString()?.length === 10 || value?.toString()?.length===28)){
      let newDate  = formatDateDash(value)
      return newDate;
    }else{
      return value;  
    }    
  }

  let configData = {};
  let consumeData = [];
  let controlID = "";
  const NewUpdateConfigAPIData = useSelector(
    (state) => state.NewConfigState.list || []
  );
  let NewUpdateConfigData = NewUpdateConfigAPIData?.map((data, index) => {
    data.componentList.map((itemval) => {
      if(typeof itemval?.component?.controls === 'object' && itemval?.component?.controls !== null && itemval?.component?.controls !== undefined && itemval?.component !== null) {
      Object?.entries(itemval?.component?.controls).map((itemval2) => {
        itemval2.map((itemval3) => {
          if (!Array.isArray(itemval3)) {
            controlID = itemval3;
          }
          if (Array.isArray(itemval3)) {
            itemval3.map((itemval4, indexval) => {
              configData = {};
              configData.id = consumeData.length + 1;
              configData.controlID = controlID;
              configData.submodule = itemval.component.componentName;
              configData.fieldName = itemval4.fieldName;
              configData.value = convertDate(itemval4.value);
              configData.primary = itemval4.primary;
              configData.type = itemval4.type;
              configData.targetValue = convertDate(itemval4.targetValue);
              configData.moduleName = data.module.moduleName;
              configData.deployedStatus = convertDate(itemval4.targetValue) == convertDate(itemval4.value) ? "Completed" : "Deleted";
              consumeData.push(configData);
            });
          }
        });
      });
    }
    });
    return consumeData;
  });

  // value = original
  // target = new
  NewUpdateConfigData = NewUpdateConfigData[0];
  NewUpdateConfigData = NewUpdateConfigData?.filter(
    (a) => a.fieldName !== "id"
  );
  let NewConfigData = NewUpdateConfigData?.filter(
    (a) => a.value != null && a.targetValue == null
  ) || [];
  let UpdateConfigData = NewUpdateConfigData?.filter(
    (a) => a.value !== null && a.targetValue != null && (a.value != a.targetValue)
  ) || [];
  let DeleteConfigData = NewUpdateConfigData?.filter(
    (a) => a.value == null && a.targetValue != null
  ) || [];
  let DeployedConfigData = NewUpdateConfigData?.filter(
    (a) => (a.value == null && a.targetValue != null) || (a.value == a.targetValue)
  ) || [];
  let DeployedConfigData2 = NewUpdateConfigData?.filter(
    (a) => (a.value == a.targetValue)
  ) || [];
 
  DeployedConfigData = DeployedConfigData?.map((data) => {
    let blankData = {
      deployedStatus: (
            <div>
                {
                    <Chip
                        label={handleDeploymentStatusLabel(data.deployedStatus)}
                        className={handleDeploymentStatusClass(
                            handleDeploymentStatusLabel(data.deployedStatus)
                        )}
                        color="primary"
                    />
                }
            </div>
        ),          
    };
    return { ...data, ...blankData };
});
  let NewUpdateConfigDataLength = NewUpdateConfigData?.length;
  let compData = [];
  let percentage = {
    NewConfigPercentage: Number(
      ((NewConfigData?.length / NewUpdateConfigDataLength) * 100).toFixed(2)
    ),
    UpdateConfigPercentage: Number(
      ((UpdateConfigData?.length / NewUpdateConfigDataLength) * 100).toFixed(2)
    ),
    DeleteConfigPercentage: Number(
      ((DeleteConfigData?.length / NewUpdateConfigDataLength) * 100).toFixed(2)
    ),
    DeployedConfigPercentage: Number(
      ((DeployedConfigData2?.length / NewUpdateConfigDataLength) * 100).toFixed(2)
    ),
  };
  let newconfigpercentageval = { value: percentage?.NewConfigPercentage, description: percentage?.NewConfigPercentage + "% New Config", color: "#5C78FF" }
  let updateconfigpercentageval = { value: percentage?.UpdateConfigPercentage, description: percentage?.UpdateConfigPercentage + "% Updates", color: "#ff9800" };
  let deleteconfigpercentageval = { value: percentage?.DeleteConfigPercentage, description: percentage?.DeleteConfigPercentage + "% Deletions", color: "#f44336" };
  let deployedConfigPercentageval = { value: percentage?.DeployedConfigPercentage, description: percentage?.DeployedConfigPercentage + "% Deployed", color: "#4caf50" };
  percentage?.NewConfigPercentage > 0 && compData.push(newconfigpercentageval)
  percentage?.UpdateConfigPercentage > 0 && compData.push(updateconfigpercentageval)
  percentage?.DeleteConfigPercentage > 0 && compData.push(deleteconfigpercentageval)
  percentage?.DeployedConfigPercentage > 0 && compData.push(deployedConfigPercentageval)

// let compData = [
//   { value: percentage?.NewConfigPercentage, description: percentage?.NewConfigPercentage > 0 ? percentage?.NewConfigPercentage + "% New Config": "", color: "#5C78FF" },
//   { value: percentage?.UpdateConfigPercentage, description: percentage?.UpdateConfigPercentage > 0 ? percentage?.UpdateConfigPercentage + "% Updates": "", color: "#ff9800" },
//   { value: percentage?.DeleteConfigPercentage, description: percentage?.DeleteConfigPercentage > 0 ? percentage?.DeleteConfigPercentage + "% Deletions": "", color: "#f44336" },
// ]
  const handleChecked = (value) => {
    const currentIndex = checked.findIndex((obj) => obj.id === value.id);
    const newChecked = [...checked];
    if (typeof value !== "boolean") {
      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }
      setChecked(newChecked);
      setAllChecked(false);
    }
    if (typeof value === "boolean" && value === true) {
      setAllChecked(true);
      let newAllChecked = [];
      NewConfigData.map((row, index) => newAllChecked.push(row));
      setChecked(newAllChecked);
    }
    if (typeof value === "boolean" && value === false) {
      setAllChecked(false);
      setChecked([]);
    }
  };

  const handleUpdateChecked = (value) => {
    const currentIndex = updatechecked.findIndex((obj) => obj.id === value.id);
    const newChecked = [...updatechecked];
    if (typeof value !== "boolean") {
      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }
      setUpdatechecked(newChecked);
      setUpdateallChecked(false);
    }
    if (typeof value === "boolean" && value === true) {
      setUpdateallChecked(true);
      let newAllChecked = [];
      UpdateConfigData.map((row, index) => newAllChecked.push(row));
      setUpdatechecked(newAllChecked);
    }
    if (typeof value === "boolean" && value === false) {
      setUpdateallChecked(false);
      setUpdatechecked([]);
    }
  };
  const handleDeploy = () => {
    let deployChecked = [...checked, ...updatechecked];
    var deployObject = {};
    var uniqueControlIDs = [...new Set(deployChecked.map((a) => a.controlID))];
    for (let i = 0; i < uniqueControlIDs.length; i++) {
      let cid = uniqueControlIDs[i];
      let primaryRows = [...NewUpdateConfigData].filter(
        (a) => a.controlID == uniqueControlIDs[i] && a.primary == true
      );
      let finaldata = [...primaryRows, ...deployChecked].map(JSON.stringify);
      let uniqueSet = new Set(finaldata);
      let finaldataNoduplicate = Array.from(uniqueSet).map(JSON.parse);

      let cidArray = finaldataNoduplicate
        .filter((a) => a.controlID == uniqueControlIDs[i])
        .map(function (item) {
          delete item.id;
          delete item.moduleName;
          delete item.submodule;
          delete item.controlID;
          delete item.primary;
          delete item.deployedStatus;
          return item;
        });
      deployObject[cid] = cidArray;
    }
    console.log(deployObject);
    dispatch(deployConfig(deployObject, clientId, environmentId));
  };

  return (
    <MatContainer>
      <BreadcrumbView options={BreadcrumbData}></BreadcrumbView>
      <PageHeading
        heading={approveCustReqReady(environment)}
        action={
          <Grid container style={{ width: "auto" }}>
            <Grid
              item
              style={{
                display: "flex",
                alignItems: "center",
                paddingLeft: "5px",
              }}
            >
              <MatButton
                onClick={handleDeploy}
                disabled={checked.length === 0 && updatechecked.length === 0}
              >
                Deploy
              </MatButton>
            </Grid>
          </Grid>
        }
      />
      <MatCard className={styles.card}>
        <CardHeader
          className={styles.cardHeading}
          title={
            <Typography variant="h6" className={styles.cardHeadingSize}>
              Configuration Analytics
            </Typography>
          }
        />
        <Divider />
        <Grid container>
          <>
            <Grid
              item
              xs={2}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                paddingTop: "20px",
              }}
            >
              <Typography variant="subtitle2">Overall Comparison:</Typography>
            </Grid>
            <Grid
              item
              xs={9}
              style={{ paddingTop: "20px", paddingLeft: "15px" }}
            >
              <HSBar
                showTextIn
                height={20}
                data={[
                  {
                    value: matchItems,
                    description: matchItems + "% Match",
                    color: "#4caf50",
                  },
                  {
                    value: nonMatchItems,
                    description: nonMatchItems + "% Non-Matching",
                    color: "#ff9800",
                  },
                ]}
              />
            </Grid>
            <Grid item xs={1}></Grid>
          </>
          <>
            <Grid
              item
              xs={2}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                paddingTop: "20px",
                paddingBottom: "20px",
              }}
            >
              <Typography variant="subtitle2">Non-Matching:</Typography>
            </Grid>
            <Grid
              item
              xs={9}
              style={{ paddingTop: "20px", paddingLeft: "15px" }}
            >
              <HSBar
                showTextIn
                height={20}
                data={compData}
              />
            </Grid>
            <Grid item xs={1}></Grid>
          </>
        </Grid>
      </MatCard>
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
      ) : NewConfigData?.length >= 0 && (
        <MatCard className={styles.card}>
          <CardHeader
            className={styles.cardHeading}
            title={
              <Typography variant="h6" className={styles.cardHeadingSize}>
                New Config
              </Typography>
            }
          />
          <DataTable
                    cols={cols}
                    rows={NewConfigData}
                    customNoRecordsMessage={NO_RECORDS_FOR_NEW_CONFIG}
                    customNoRecords={!(NewConfigData.length > 0)}
                    noRecordsCols={NewConfigData.length > 0 ? 1 : cols.length + 1}
                    config={tableConfig}
                    checkedStatus={checked}
                    checkboxSelection
                    allCheckedStatus={allChecked}
                    updateCheckedStatus={handleChecked}
                    customCheckboxEnabled={true} />
          {/* </CardContent> */}
        </MatCard>
      )}
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
      ) : UpdateConfigData?.length >= 0 && (
        <MatCard className={styles.card}>
          <CardHeader
            className={styles.cardHeading}
            title={
              <Typography variant="h6" className={styles.cardHeadingSize}>
                Updates
              </Typography>
            }
          />
          <DataTable
                    cols={updatecols}
                    rows={UpdateConfigData}
                    customNoRecordsMessage={NO_RECORDS_FOR_UPDATES}
                    customNoRecords={!(UpdateConfigData.length > 0)}
                    noRecordsCols={UpdateConfigData.length > 0 ? 1 : updatecols.length + 1}
                    config={tableConfig}
                    checkedStatus={updatechecked}
                    checkboxSelection
                    allCheckedStatus={updateallChecked}
                    updateCheckedStatus={handleUpdateChecked}
                    customCheckboxEnabled={true} />
          {/* </CardContent> */}
        </MatCard>
      )}
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
      ) : DeployedConfigData?.length >= 0 && (
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
              rows={DeployedConfigData}
              customNoRecordsMessage={NO_RECORDS_FOR_DEPLOYMENT}
              customNoRecords={!(DeployedConfigData.length > 0)}
              noRecordsCols={DeployedConfigData.length > 0 ? 1 : deployedcols.length}
              config={deleteTableConfig} />
          {/* </CardContent> */}
        </MatCard>
      )}
      
      {open && (
        <AddScheduleDeployment
          handleClose={closeScheduleDialog}
          open={open}
          openFrom={"Add"}
        />
      )}
    </MatContainer>
  );
};

export default IndividualClientEnvironment;
