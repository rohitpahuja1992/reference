import React, { useState, useEffect, useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import VisibilityIcon from "@material-ui/icons/Visibility";
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
  NO_RECORDS_FOR_NEW_CONFIG,
  NO_RECORDS_FOR_UPDATES,
  NO_RECORDS_FOR_DEPLOYMENT,
} from "../../utils/Messages";
import NewUpdatePopup from "./NewUpdatePopup";
import DeployedStatus from "./DeployedStatus";
import { deployConfig, fetchNewConfig } from "../../actions/NewConfigActions";
import { fetchEnvironmentStatus } from "../../actions/EnvironmentStatusActions";
import {
  UPDATE_DEPLOYED_BIT
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
  const [deployedOpen, setDeployedOpen] = useState(false);
  const [openFrom, setOpenFrom] = useState("");
  const [popupContent, setPopupContent] = useState("");
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
  const pairedBit = camparisonData?.paired;
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
 //  const featuresAssigned = useSelector((state) => state.User.features);
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


  

  const handleDeploymentStatusLabel = (details) => {
    if (details === 'Deleted') {
      return "Mark Deleted";
    } else {
      return "Completed";
    }
  };

  const handleDeploymentStatusClass = (status) => {
    if (status === 'Mark Deleted') {
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
  const closeDeployedDialog = useCallback(() => {
    setDeployedOpen(false);
  }, []);

  useEffect(() => {
    dispatch(updateEntityId(clientId));
    dispatch(fetchNewConfig(clientId,environmentId));
    dispatch(fetchEnvironmentStatus(clientId));
  }, [dispatch, clientId, environmentId]);

  useEffect(() => {
    if (getApiError)
      setApiError(handleIndividualClientEnvironmentError(getApiError));
    else setApiError(false);
  }, [getApiError]);

  const cols = [
    { id: "moduleName", label: "Module" },
    { id: "componentName", label: "Component" },
    { id: "originalType", label: "Type" },
    { id: "labelValue", label: "Field Name (Primary)" },
    { id: "value", label: "New Value" },
  ];
  const updatecols = [
    { id: "moduleName", label: "Module" },
    { id: "componentName", label: "Component" },
    { id: "originalType", label: "Type" },
    { id: "labelValue", label: "Field Name (Primary)" },
    { id: "targetValue", label: "Original Value" },
    { id: "value", label: "New Value" },
  ];
  // const deletecols = [
  //   { id: "moduleName", label: "Module" },
  //   { id: "componentName", label: "Component" },
  //   { id: "type", label: "Type" },
  //   { id: "labelValue", label: "Field Name (Primary)" },
  //   { id: "targetValue", label: "Original Value" },
  //   { id: "value", label: "New Value" },
  // ];
  const deployedcols = [
    { id: "moduleName", label: "Module" },
    { id: "componentName", label: "Component" },
    { id: "originalType", label: "Type" },
    { id: "labelValue", label: "Field Name (Primary)" },
    // { id: "targetValue", label: "Original Value" },
    { id: "targetValue", label: "Current Value" },
    // { id: "value", label: "New Value" },
    { id: "deployedStatus", label: "Deployed Status" },
  ];
//  const NewUpdateConfigAPIData = [
//   {
//     "module": {
//       "id": 3,
//       "moduleName": "GRIEVANCE",
//       "shortName": "GRIEVANCE"
//     },
//     "componentList": [
//       {
//         "clientOobComponentId": 7,
//         "component": {
//           "componentType": "SYSTEM_TABLE",
//           "componentId": 79,
//           "controls": {
//             "7": {
//               "SYSTEM_TABLE": [
//                 {
//                   "fieldName": "exception",
//                   "labelValue": "Exception",
//                   "type": "SYSTEM_TABLE",
//                   "value": "1",
//                   "targetValue": null,
//                   "primary": true,
//                   "required": false
//                 },
//                 {
//                   "fieldName": "ignore_codes",
//                   "labelValue": "Codes (Ignore)",
//                   "type": "SYSTEM_TABLE",
//                   "value": "1",
//                   "targetValue": null,
//                   "primary": false,
//                   "required": true
//                 },
//                 {
//                   "fieldName": "insert_user",
//                   "labelValue": "Insert User",
//                   "type": "SYSTEM_TABLE",
//                   "value": "A",
//                   "targetValue": null,
//                   "primary": false,
//                   "required": false
//                 },
//                 {
//                   "fieldName": "uuid",
//                   "labelValue": "UUID",
//                   "type": "SYSTEM_TABLE",
//                   "value": "2",
//                   "targetValue": null,
//                   "primary": false,
//                   "required": false
//                 },
//                 {
//                   "fieldName": "authorization",
//                   "labelValue": "Auth",
//                   "type": "SYSTEM_TABLE",
//                   "value": "1",
//                   "targetValue": null,
//                   "primary": false,
//                   "required": true
//                 },
//                 {
//                   "fieldName": "update_user",
//                   "labelValue": "Update User",
//                   "type": "SYSTEM_TABLE",
//                   "value": "A",
//                   "targetValue": null,
//                   "primary": false,
//                   "required": false
//                 },
//                 {
//                   "fieldName": "hedis",
//                   "labelValue": "Hedis",
//                   "type": "SYSTEM_TABLE",
//                   "value": "0",
//                   "targetValue": null,
//                   "primary": false,
//                   "required": true
//                 },
//                 {
//                   "fieldName": "package_type_id",
//                   "labelValue": "Package Type",
//                   "type": "SYSTEM_TABLE",
//                   "value": "2",
//                   "targetValue": null,
//                   "primary": false,
//                   "required": false
//                 },
//                 {
//                   "fieldName": "id",
//                   "labelValue": "id",
//                   "type": "SYSTEM_TABLE",
//                   "value": 1,
//                   "targetValue": null,
//                   "primary": false,
//                   "required": false
//                 },
//                 {
//                   "fieldName": "um_survey",
//                   "labelValue": "UM Survey",
//                   "type": "SYSTEM_TABLE",
//                   "value": "0",
//                   "targetValue": null,
//                   "primary": false,
//                   "required": true
//                 },
//                 {
//                   "fieldName": "hospice",
//                   "labelValue": "Hospice",
//                   "type": "SYSTEM_TABLE",
//                   "value": "0",
//                   "targetValue": null,
//                   "primary": false,
//                   "required": true
//                 },
//                 {
//                   "fieldName": "um_approval",
//                   "labelValue": "UM Approval",
//                   "type": "SYSTEM_TABLE",
//                   "value": "0",
//                   "targetValue": null,
//                   "primary": false,
//                   "required": true
//                 },
                
//               ]
//             },
//             "8": {
//               "SYSTEM_TABLE": [
//                 {
//                   "fieldName": "exception",
//                   "labelValue": "Exception",
//                   "type": "SYSTEM_TABLE",
//                   "value": "0",
//                   "targetValue": 0,
//                   "primary": false,
//                   "required": false
//                 },
//                 {
//                   "fieldName": "ignore_codes",
//                   "labelValue": "Codes (Ignore)",
//                   "type": "SYSTEM_TABLE",
//                   "value": "1",
//                   "targetValue": 1,
//                   "primary": false,
//                   "required": true
//                 },
//                 {
//                   "fieldName": "insert_user",
//                   "labelValue": "Insert User",
//                   "type": "SYSTEM_TABLE",
//                   "value": "BB",
//                   "targetValue": "BB",
//                   "primary": false,
//                   "required": false
//                 },
//                 {
//                   "fieldName": "uuid",
//                   "labelValue": "UUID",
//                   "type": "SYSTEM_TABLE",
//                   "value": "4",
//                   "targetValue": "4",
//                   "primary": false,
//                   "required": false
//                 },
//                 {
//                   "fieldName": "authorization",
//                   "labelValue": "Auth",
//                   "type": "SYSTEM_TABLE",
//                   "value": "1",
//                   "targetValue": 1,
//                   "primary": false,
//                   "required": true
//                 },
//                 {
//                   "fieldName": "update_user",
//                   "labelValue": "Update User",
//                   "type": "SYSTEM_TABLE",
//                   "value": "BB",
//                   "targetValue": "BB",
//                   "primary": false,
//                   "required": false
//                 },
//                 {
//                   "fieldName": "hedis",
//                   "labelValue": "Hedis",
//                   "type": "SYSTEM_TABLE",
//                   "value": "1",
//                   "targetValue": 1,
//                   "primary": false,
//                   "required": true
//                 },
//                 {
//                   "fieldName": "package_type_id",
//                   "labelValue": "Package Type",
//                   "type": "SYSTEM_TABLE",
//                   "value": "4",
//                   "targetValue": 4,
//                   "primary": false,
//                   "required": false
//                 },
//                 {
//                   "fieldName": "id",
//                   "labelValue": "id",
//                   "type": "SYSTEM_TABLE",
//                   "value": null,
//                   "targetValue": 106,
//                   "primary": false,
//                   "required": false
//                 },
//                 {
//                   "fieldName": "um_survey",
//                   "labelValue": "UM Survey",
//                   "type": "SYSTEM_TABLE",
//                   "value": "1",
//                   "targetValue": 1,
//                   "primary": false,
//                   "required": true
//                 },
//                 {
//                   "fieldName": "hospice",
//                   "labelValue": "Hospice",
//                   "type": "SYSTEM_TABLE",
//                   "value": "0",
//                   "targetValue": 0,
//                   "primary": false,
//                   "required": true
//                 },
//                 {
//                   "fieldName": "um_approval",
//                   "labelValue": "UM Approval",
//                   "type": "SYSTEM_TABLE",
//                   "value": "0",
//                   "targetValue": 0,
//                   "primary": false,
//                   "required": true
//                 },
//                 {
//                   "fieldName": "display_message",
//                   "labelValue": "Message",
//                   "type": "SYSTEM_TABLE",
//                   "value": "Clinical Trial BB",
//                   "targetValue": "Clinical Trial BB",
//                   "primary": false,
//                   "required": false
//                 },
//                 {
//                   "fieldName": "group_context",
//                   "labelValue": "Group",
//                   "type": "SYSTEM_TABLE",
//                   "value": "BB",
//                   "targetValue": "BB",
//                   "primary": false,
//                   "required": false
//                 },
//                 {
//                   "fieldName": "version",
//                   "labelValue": "Version",
//                   "type": "SYSTEM_TABLE",
//                   "value": "4",
//                   "targetValue": 4,
//                   "primary": false,
//                   "required": true
//                 },
//                 {
//                   "fieldName": "medical_criteria",
//                   "labelValue": "Medical Criteria",
//                   "type": "SYSTEM_TABLE",
//                   "value": "1",
//                   "targetValue": 1,
//                   "primary": false,
//                   "required": true
//                 },
//                 {
//                   "fieldName": "rx_user_alert_msg",
//                   "labelValue": "Alert Msg",
//                   "type": "SYSTEM_TABLE",
//                   "value": "0",
//                   "targetValue": 0,
//                   "primary": false,
//                   "required": false
//                 },
//                 {
//                   "fieldName": "pa_client_effectuation",
//                   "labelValue": "Client Effectuation",
//                   "type": "SYSTEM_TABLE",
//                   "value": "0",
//                   "targetValue": 0,
//                   "primary": false,
//                   "required": false
//                 },
//                 {
//                   "fieldName": "tag_value",
//                   "labelValue": "Tag Value",
//                   "type": "SYSTEM_TABLE",
//                   "value": "Trial BB",
//                   "targetValue": "Trial BB",
//                   "primary": false,
//                   "required": false
//                 },
//                 {
//                   "fieldName": "negative_drug_cluster",
//                   "labelValue": "Negative Drug",
//                   "type": "SYSTEM_TABLE",
//                   "value": "0",
//                   "targetValue": 0,
//                   "primary": false,
//                   "required": false
//                 },
//                 {
//                   "fieldName": "name",
//                   "labelValue": "Name",
//                   "type": "SYSTEM_TABLE",
//                   "value": "Clinical Trial B",
//                   "targetValue": "Clinical Trial B",
//                   "primary": true,
//                   "required": true
//                 },
//                 {
//                   "fieldName": "claims",
//                   "labelValue": "Claim",
//                   "type": "SYSTEM_TABLE",
//                   "value": "0",
//                   "targetValue": 0,
//                   "primary": false,
//                   "required": true
//                 },
//                 {
//                   "fieldName": "pharmacy",
//                   "labelValue": "Pharmacy",
//                   "type": "SYSTEM_TABLE",
//                   "value": "1",
//                   "targetValue": 1,
//                   "primary": false,
//                   "required": true
//                 }
//               ]
//             }
//           },
//           "componentName": "Clinical Group Master"
//         }
//       },
//       {
//         "clientOobComponentId": 8,
//         "component": {
//           "componentType": "CMT_COMPONENT",
//           "componentId": 3,
//           "controls": {
//             "9": {
//               "MESSAGE_CONSTANT": [
//                 {
//                   "fieldName": "description",
//                   "labelValue": "Short Description",
//                   "type": "MESSAGE_CONSTANT",
//                   "value": "MSG_CONST_1",
//                   "targetValue": "MSG_CONST_1",
//                   "primary": false,
//                   "required": false
//                 },
//                 {
//                   "fieldName": "label_name",
//                   "labelValue": "Message Constant",
//                   "type": "MESSAGE_CONSTANT",
//                   "value": "MSG_CONST_1",
//                   "targetValue": "MSG_CONST_1",
//                   "primary": true,
//                   "required": false
//                 }
//               ],
//               "Hidden": [
//                 {
//                   "fieldName": "code",
//                   "labelValue": "code",
//                   "type": "SYSTEM_VARIABLE",
//                   "value": "SYS_VAR_SHOW_HIDE",
//                   "targetValue": "SYS_VAR_SHOW_HIDE",
//                   "primary": true,
//                   "required": false
//                 },
//                 {
//                   "fieldName": "description",
//                   "labelValue": "description",
//                   "type": "SYSTEM_VARIABLE",
//                   "value": "SYS_VAR_SHOW_HIDE",
//                   "targetValue": "SYS_VAR_SHOW_HIDE",
//                   "primary": false,
//                   "required": false
//                 },
//                 {
//                   "fieldName": "int_value",
//                   "labelValue": "INT Value",
//                   "type": "SYSTEM_VARIABLE",
//                   "value": 1,
//                   "targetValue": "0",
//                   "primary": false,
//                   "required": false
//                 }
//               ],
//               "Disabled": [
//                 {
//                   "fieldName": "code",
//                   "labelValue": "code",
//                   "type": "SYSTEM_VARIABLE",
//                   "value": "SYS_VAR_ENABLE_DISABLE",
//                   "targetValue": "SYS_VAR_ENABLE_DISABLE",
//                   "primary": true,
//                   "required": false
//                 },
//                 {
//                   "fieldName": "str_value",
//                   "labelValue": "STR Value",
//                   "type": "SYSTEM_VARIABLE",
//                   "value": "0",
//                   "targetValue": "1",
//                   "primary": false,
//                   "required": false
//                 },
//                 {
//                   "fieldName": "description",
//                   "labelValue": "description",
//                   "type": "SYSTEM_VARIABLE",
//                   "value": "SYS_VAR_ENABLE_DISABLE",
//                   "targetValue": "SYS_VAR_ENABLE_DISABLE",
//                   "primary": false,
//                   "required": false
//                 }
//               ],
//               "Mandatory": [
//                 {
//                   "fieldName": "code",
//                   "labelValue": "code",
//                   "type": "SYSTEM_VARIABLE",
//                   "value": "SYS_VAR_MANDATORY_NOT_MANDATORY",
//                   "targetValue": "SYS_VAR_MANDATORY_NOT_MANDATORY",
//                   "primary": true,
//                   "required": false
//                 },
//                 {
//                   "fieldName": "str_value",
//                   "labelValue": "STR Value",
//                   "type": "SYSTEM_VARIABLE",
//                   "value": "1",
//                   "targetValue": "0",
//                   "primary": false,
//                   "required": false
//                 },
//                 {
//                   "fieldName": "description",
//                   "labelValue": "description",
//                   "type": "SYSTEM_VARIABLE",
//                   "value": "SYS_VAR_MANDATORY_NOT_MANDATORY",
//                   "targetValue": "SYS_VAR_MANDATORY_NOT_MANDATORY",
//                   "primary": false,
//                   "required": false
//                 }
//               ]
//             }
//           },
//           "componentName": "GRIEVANCE USER DESCRIPTION"
//         }
//       },
//       {
//         "clientOobComponentId": 8,
//         "component": {
//           "componentType": "CMT_COMPONENT",
//           "componentId": 3,
//           "controls": {
//             "10": {
//               "Hidden": [
//                 {
//                   "fieldName": "code",
//                   "labelValue": "code",
//                   "type": "SYSTEM_VARIABLE",
//                   "value": "SYS_VAR_SHOW_HIDE",
//                   "targetValue": "SYS_VAR_SHOW_HIDE",
//                   "primary": true,
//                   "required": false
//                 },
//                 {
//                   "fieldName": "description",
//                   "labelValue": "description",
//                   "type": "SYSTEM_VARIABLE",
//                   "value": "SYS_VAR_SHOW_HIDE",
//                   "targetValue": "SYS_VAR_SHOW_HIDE",
//                   "primary": false,
//                   "required": false
//                 },
//                 {
//                   "fieldName": "int_value",
//                   "labelValue": "INT Value",
//                   "type": "SYSTEM_VARIABLE",
//                   "value": 1,
//                   "targetValue": 1,
//                   "primary": false,
//                   "required": false
//                 }
//               ],
//               "Mandatory": [
//                 {
//                   "fieldName": "code",
//                   "labelValue": "code",
//                   "type": "SYSTEM_VARIABLE",
//                   "value": "SYS_VAR_MANDATORY_NOT_MANDATORY",
//                   "targetValue": "SYS_VAR_MANDATORY_NOT_MANDATORY",
//                   "primary": true,
//                   "required": false
//                 },
//                 {
//                   "fieldName": "str_value",
//                   "labelValue": "STR Value",
//                   "type": "SYSTEM_VARIABLE",
//                   "value": "1",
//                   "targetValue": "0",
//                   "primary": false,
//                   "required": false
//                 },
//                 {
//                   "fieldName": "description",
//                   "labelValue": "description",
//                   "type": "SYSTEM_VARIABLE",
//                   "value": "SYS_VAR_MANDATORY_NOT_MANDATORY",
//                   "targetValue": "SYS_VAR_MANDATORY_NOT_MANDATORY",
//                   "primary": false,
//                   "required": false
//                 }
//               ]
//             }
//           },
//           "componentName": "GRIEVANCE USER DESCRIPTION2"
//         }
//       },
//     ]
//   }
// ]

const handleType = (details) => {
  if (details === 'SYSTEM_TABLE') {
    return "System Table";
  } else if (details === 'SYSTEM_VARIABLE') {
    return "System Variable";
  } else {
    return "Message Constant";
  }
};


  const isDeployedState = useSelector(
    (state) => state.NewConfigState.isDeployed
  );
  const deployedData = useSelector(
    (state) => state.NewConfigState.deployedStatusList
  );
  let configData = {};
  let consumeData = [];
  let controlID = "";
  let controlVal = "";
  const NewUpdateConfigAPIData = useSelector(
    (state) => state.NewConfigState.list || []
  );
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
                  configData.highLight = (configData.value !== null && configData.targetValue != null && (configData.value != configData.targetValue))?true:false;
                  configData.deployedStatus = itemval4.inputType === "DATE" ? formatDateDash(itemval4.targetValue) : itemval4.targetValue === "NaN-NaN-NaN" ? '' : itemval4.targetValue == itemval4.inputType === "DATE" ? formatDateDash(itemval4.value) : itemval4.value === "NaN-NaN-NaN" ? '' : itemval4.value ? "Completed" : "Deleted";
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

  // value = original
  // target = new
  NewUpdateConfigData = NewUpdateConfigData[0];
  NewUpdateConfigData = NewUpdateConfigData?.filter(
    (a) => a.fieldName !== "id"
  );
 const deployData = NewUpdateConfigData?.filter(
    (a) => a.fieldName !== "id"
  );
  // NewUpdateConfigData = deployData?.filter(
  //   (a) => a.primary
  // );
  console.log("NewUpdateConfigData",NewUpdateConfigData)
  // let NewConfigData = NewUpdateConfigData?.filter(
  //   (a) => a.value != null && a.targetValue == null
  // ) || [];


  let UpdateConfigDataCurrent = NewUpdateConfigData?.filter(
    (a) => a.value !== null && a.targetValue !== null && (a.value != a.targetValue)
  ) || [];
  UpdateConfigDataCurrent = UpdateConfigDataCurrent.map(({ controlID, controlVal }) => ({controlID, controlVal}));
  
  let uniqueUpdateControlID = [...new Map(UpdateConfigDataCurrent.map(item => [JSON.stringify(item), item])).values()];
  let uc = uniqueUpdateControlID.map(a => a.controlID)
  let ucVal = uniqueUpdateControlID.map(a => a.controlVal)
  let NewConfigData =[], UpdateConfigData =[], DeployedConfigData2 =[], DeleteConfigData = [];
console.log("uniqueUpdateControlID",uniqueUpdateControlID)
  for (let i = 0; i < NewUpdateConfigData?.length; i++) {
    // if (uc.indexOf(NewUpdateConfigData[i]?.controlID) !== -1 && ucVal.indexOf(NewUpdateConfigData[i]?.controlVal) !== -1) {
    //   for (let j = 0; j < uniqueUpdateControlID?.length; j++) {
    //     if ((uniqueUpdateControlID[j].controlID === NewUpdateConfigData[i]?.controlID) && (uniqueUpdateControlID[j].controlVal === NewUpdateConfigData[i]?.controlVal)) {
    //       UpdateConfigData?.push(NewUpdateConfigData[i])
    //     }
    //   }
    // }
    if(uniqueUpdateControlID.findIndex(item => item.controlID === NewUpdateConfigData[i]?.controlID && item.controlVal === NewUpdateConfigData[i]?.controlVal) !== -1) {
      console.log(i, NewUpdateConfigData[i])
      UpdateConfigData?.push(NewUpdateConfigData[i])
    }
    else if (NewUpdateConfigData[i].value != null && NewUpdateConfigData[i].targetValue == null) {
      NewConfigData?.push(NewUpdateConfigData[i])
    }
    else if (NewUpdateConfigData[i].value == NewUpdateConfigData[i].targetValue) {
      DeployedConfigData2?.push(NewUpdateConfigData[i])
    }
    else if (NewUpdateConfigData[i].value == null && NewUpdateConfigData[i].targetValue != null) {
      DeleteConfigData?.push(NewUpdateConfigData[i])
    }
  }
  
  console.log("UpdateConfigData",UpdateConfigData)
  console.log("NewConfigData",NewConfigData)
  console.log("DeployedConfigData2",DeployedConfigData2)
  console.log("DeleteConfigData",DeleteConfigData)
  NewConfigData = NewConfigData?.filter(item => item.primary) 
  UpdateConfigData = UpdateConfigData?.filter(item => item.primary)
  DeployedConfigData2 = DeployedConfigData2?.filter(item => item.primary) 
  DeleteConfigData = DeleteConfigData?.filter(item => item.primary) 
  
  
  
  // let DeleteConfigData = NewUpdateConfigData?.filter(
  //   (a) => a.value == null && a.targetValue != null && a.primary
  // ) || [];
  // let DeployedConfigData = NewUpdateConfigData?.filter(
  //   (a) => ((a.value == null && a.targetValue != null) || (a.value == a.targetValue)) && a.primary
  // ) || [];
  // let DeployedConfigData2 = NewUpdateConfigData?.filter(
  //   (a) => (a.value == a.targetValue) && a.primary
  // ) || [];
  let DeployedConfigData = [...DeleteConfigData, ...DeployedConfigData2]?.filter(item => item.primary);
 
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
  let NewUpdateConfigDataLength = NewUpdateConfigData?.filter(a => a.primary)?.length;
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
    let cidArray = [];
    let arrCid = []
    for (let i = 0; i < deployChecked.length; i++) {
      let cid = deployChecked[i].controlID;
      let cval = deployChecked[i].controlVal;
      cidArray = deployData.filter(a => a.controlID === cid && a.controlVal === cval)
        .map(function (item) {
          delete item.id;
          delete item.moduleName;
          delete item.componentName;
          delete item.primary;
          delete item.deployedStatus;
          delete item.highLight;
          delete item.controlID;
          delete item.labelValue;
          delete item.required;
          delete item.originalType;
          delete item.controlVal;
          return item;
        });
      if(arrCid.indexOf(cid) === -1) {
        arrCid.push(cid);
        deployObject[cid] = {};
      }
      deployObject[cid][cval] = cidArray
    }
    dispatch(deployConfig(deployObject, clientId, environmentId));
    if(parseInt(camparisonData?.comparison?.totalItems) === 0) {
      history.push(`/client/config-deploy/${clientId}`);
    }
  };
  const tableConfig = {
    tableType: "",
    checked: true,
    actions: {
      icon: <VisibilityIcon color="primary" fontSize="small" />,
      tooltipText: "View Details",
      action: (data) => {
        setOpenFrom(uniqueUpdateControlID.findIndex(item => item.controlID === data?.controlID && item.controlVal === data?.controlVal) !== -1 ? "Update": "New");
        setPopupContent(deployData.filter(a => a.controlID === data.controlID && a.controlVal === data.controlVal))
        setOpen(true);
      },
    },
  };
  const deleteTableConfig = {
    tableType: "",
    checked: false,
    actions: {
      icon: <VisibilityIcon color="primary" fontSize="small" />,
      tooltipText: "View Details",
      action: (data) => {
        setOpenFrom("Deployed");
        setPopupContent(deployData.filter(a => a.controlID === data.controlID && a.controlVal === data.controlVal))
        setOpen(true);
      },
    },
  };
  useEffect(()=>{
    if(isDeployedState) {
      setDeployedOpen(true);
      dispatch({ type: UPDATE_DEPLOYED_BIT });
    }
  },[isDeployedState])
  return (
    <MatContainer>
      <BreadcrumbView options={BreadcrumbData}></BreadcrumbView>
      <PageHeading
        heading={approveCustReqReady(environment)}
        action={!pairedBit && 
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
      ) : (NewConfigData?.length >= 0 && !pairedBit) && (
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
                    allCheckedDisabled={NewConfigData.length > 0 ? false : true }
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
      ) : (UpdateConfigData?.length >= 0 && !pairedBit) && (
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
                    allCheckedDisabled={UpdateConfigData.length > 0 ? false : true }
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
                Deployed Components
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
        <NewUpdatePopup
          handleClose={closeScheduleDialog}
          open={open}
          openFrom={openFrom}
          popupContent={popupContent}
        />
      )}
      {deployedOpen && (
        <DeployedStatus
          handleClose={closeDeployedDialog}
          open={deployedOpen}
          deployedData={deployedData}
        />
      )}
    </MatContainer>
  );
};

export default IndividualClientEnvironment;
