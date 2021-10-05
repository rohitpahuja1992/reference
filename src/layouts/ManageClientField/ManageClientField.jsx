import React, { useState, useEffect } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { makeStyles } from "@material-ui/core";
import { fetchClientById } from "../../actions/ClientActions";
import MatContainer from "../../components/MaterialUi/MatContainer";
import PageHeading from "../../components/PageHeading";
import BreadcrumbView from "../../components/BreadcrumbView";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";

import ClientFieldDetails from "../../components/ClientFieldDetails";
import ClientFieldConfigDetails from "../../components/ClientFieldDetails/ClientFieldConfigDetails";
import OobFieldComments from "../../components/OobFieldComments";
// import OobFieldMapping from "../../components/OobFieldMapping";
import OobFieldTimeline from "../../components/OobFieldTimeline";
import FieldStatusDetails from "../../components/FieldStatusDetails";
import FieldSignOffDetails from "../../components/FieldSignOffDetails";
import FieldApproveDetails from "../../components/FieldApproveDetails";
import FieldConfigureDetails from "../../components/FieldConfigureDetails";
import FieldValidateDetails from "../../components/FieldValidateDetails";
import { fetchClientControlAudit } from "../../actions/ClientModuleActions";
import { updateEntityId } from "../../actions/AppHeaderActions";
//import { fetchOOBModule } from "../../actions/OOBModuleActions";
//import { RESET_DEFAULTVERSION } from "../../utils/AppConstants";
import {
  DEFAULT_START_INDEX,
  DEFAULT_PAGE_SIZE,
  RESET_UPDATE_CLIENT_CONTROL_IS_DONE
} from "../../utils/AppConstants";
import {
  // fetchOobControl,
  fetchClientControlById,
  fetchClientConfigControlById,
  fetchClientComponentById,
} from "../../actions/ClientModuleActions";

import { fetchClientModuleById } from "../../actions/ClientModuleActions";
import { ADD_COMMENT_ON_CLIENT_FIELD } from "../../utils/FeatureConstants";
import { handleManageClientFieldError } from "../../utils/Messages";

const useStyles = makeStyles((theme) => ({
  col: {
    padding: "5px 10px",
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
}));

const ManageClientField = () => {
  const history = useHistory();
  let {
    // label,
    clientId,
    moduleId,
    moduleVersionId,
    submoduleId,
    submoduleVersionId,
    controlId,
    version,
  } = useParams();

  const styles = useStyles();
  const dispatch = useDispatch();
  const { url } = useRouteMatch();
  const [isDetailsUpdated, setDetailsUpdated] = React.useState(false);
  const [isSignOffUpdated, setSignOffUpdated] = React.useState(false);
  const [isApproveUpdated, setApproveUpdated] = React.useState(false);
  const [isMappingUpdated, setMappingUpdated] = React.useState(false);
  const [fieldData, setFieldData] = useState([]);
  const [primary, setPrimary] = useState("");

  const loggedInUserData = useSelector(
    (state) => state.User.loggedInUser.details
  );
  const startIndex = useSelector(
    (state) => state.ClientModule.clientsSubmoduleById.startIndex || 0
  );
  const submoduleId2 = useSelector(
    (state) => state.ClientModule.clientsSubmoduleById.submoduleId || 0
  );
  const pageSize = useSelector(
    (state) => state.ClientModule.clientsSubmoduleById.pageSize || 10
  );
  const clientInfo = useSelector(
    (state) => state.Client.clientByIdDetails.details
  );
  const featuresAssigned = useSelector((state) => state.User.features);

  const clientModuleById = useSelector(
    (state) => state.ClientModule.clientModuleById.data
  );
  // const clientSubmoduleById = useSelector(
  //   (state) => state.ClientModule.clientSubmoduleById.data
  // );
  const clientSubmoduleData = useSelector(
    (state) => state.ClientModule.clientsSubmoduleById.data
  );
  const submoduleData = clientSubmoduleData.ClientComponent
    ? clientSubmoduleData.ClientComponent.componentName
    : clientSubmoduleData?.systemTable
      ? clientSubmoduleData.systemTable.tableLabel
      : "";

  let clientControlData1 = useSelector(
    (state) => state.ClientModule.clientControlById.data
  );

  let clientControlConfigData = useSelector(
    (state) => state.ClientModule.clientControlById.configDetails
  );

  let clientControlData = clientControlData1 ? clientControlData1 : clientControlConfigData

  console.log('clientControlData', clientControlData)

  const clientControlDataError = useSelector(
    (state) => state.ClientModule.clientControlById.error
  );
  const [apiError, setApiError] = useState(null);

  const controlAuditDetails = useSelector(
    (state) => state.ClientModule.controlTimeline.data
  );

  const roles =
    loggedInUserData && loggedInUserData.roles.map((item) => item.roleName);
  const handleBackButtonClientDashBoard = () => {
    history.push(`/client/dashboard/${clientId}`);
  };

  const handleBackButtonDashBoard = () => {
    history.push(`/admin`);
  };

  const handleModuleBackButton = () => {
    history.push(`/client/modules/${clientId}`, history.location.state);
  };

  const handleSubmoduleBackButton = () => {
    history.push(
      `/client/components/${clientId}/${moduleId}/${moduleVersionId}/${version}`,
      history.location.state
    );
  };

  const handleFieldsBackButton = () => {
    history.push(
      `/client/fields/${clientId}/${moduleId}/${moduleVersionId}/${submoduleId}/${submoduleVersionId}/${version}`,
      history.location.state
    );
  };

  const BreadcrumbData = [
    {
      id: "modules",
      label: "Modules",
      action: handleModuleBackButton,
    },
    {
      id: "submodules",
      label:
        clientModuleById &&
        clientModuleById.module &&
        clientModuleById.module.moduleName + " (" + version + ")",
      action: handleSubmoduleBackButton,
    },
    {
      id: "fields",
      label: submoduleData ? submoduleData : "",
      action: handleFieldsBackButton,
    },
    {
      id: "controls",
      label: clientControlData && primary,
    },
  ];

  const BreadcrumbDataClientDash = [
    {
      id: "cDash",
      label: "Module Dashboard",
      action: handleBackButtonClientDashBoard,
    },
    {
      id: "submodules",
      label:
        clientModuleById &&
        clientModuleById.module &&
        clientModuleById.module.moduleName + " (" + version + ")",
      action: handleSubmoduleBackButton,
    },
    {
      id: "fields",
      label: submoduleData ? submoduleData : "",
      action: handleFieldsBackButton,
    },
    {
      id: "controls",
      label: clientControlData && primary,
    },
  ];

  const BreadcrumbDataDashboard = [
    {
      id: "DashBoard",
      label: "Dashboard",
      action: handleBackButtonDashBoard,
    },
    {
      id: "submodules",
      label:
        clientModuleById &&
        clientModuleById.module &&
        clientModuleById.module.moduleName + " (" + version + ")",
      action: handleSubmoduleBackButton,
    },
    {
      id: "fields",
      label: submoduleData ? submoduleData : "",
      action: handleFieldsBackButton,
    },
    {
      id: "controls",
      label: clientControlData && primary,
    },
  ];

  const handlePrimary = (value) => {
    setPrimary(value);
  }

  // const detailUpdated = (val) => {
  //   setDetailsUpdated(val);
  // }

  useEffect(() => {
    dispatch(
      fetchClientComponentById(
        submoduleVersionId,
        submoduleId2 === submoduleVersionId ? startIndex : DEFAULT_START_INDEX,
        pageSize
      )
    );
  }, [dispatch, submoduleVersionId]);

  // useEffect(() => {
  //   if (isDetailsUpdated && clientSubmoduleData?.ClientComponent?.config) {
  //     dispatch(fetchClientControlAudit(controlId));
  //     dispatch(fetchClientConfigControlById(controlId));
  //     dispatch({ type: RESET_UPDATE_CLIENT_CONTROL_IS_DONE });
  //   }
  //   else {
  //     dispatch(fetchClientControlAudit(controlId));
  //     dispatch(fetchClientControlById(controlId));
  //     dispatch({ type: RESET_UPDATE_CLIENT_CONTROL_IS_DONE });
  //   }

  //   setDetailsUpdated(false);
  // }, [dispatch, isDetailsUpdated, controlId, clientSubmoduleData]);

  useEffect(() => {
    if (clientId) dispatch(fetchClientById(clientId));
  }, [dispatch, clientId]);

  useEffect(() => {
    dispatch(updateEntityId(clientId));
    if (clientSubmoduleData?.ClientComponent?.config || isDetailsUpdated) {
      dispatch(fetchClientConfigControlById(controlId));
    } else if (!clientSubmoduleData?.ClientComponent?.config || isMappingUpdated) {
      dispatch(fetchClientControlById(controlId));
    }

    dispatch(fetchClientControlAudit(controlId));

    if (loggedInUserData.user_type === "CLIENT") {
      dispatch(fetchClientModuleById(moduleId));
    } else {
      dispatch(fetchClientModuleById(moduleId, clientId));
    }
  }, [
    dispatch,
    url,
    submoduleId,
    moduleId,
    controlId,
    clientId,
    loggedInUserData.user_type,
    moduleVersionId,
    isDetailsUpdated,
    isMappingUpdated,
    clientSubmoduleData?.ClientComponent?.config
  ]);

  useEffect(() => {
    if (clientControlDataError)
      setApiError(handleManageClientFieldError(clientControlDataError));
    else setApiError(false);
  }, [clientControlDataError]);

  useEffect(() => {
    let data = [];
    const mapFieldData = clientSubmoduleData?.ClientComponent
      ? clientSubmoduleData.ClientComponent.mapField
      : clientSubmoduleData?.systemTable
        ? clientSubmoduleData.systemTable.mapField
        : [];
    if (clientSubmoduleData?.ClientComponent) {
      data = JSON.parse(mapFieldData).filter((item) =>
        item.visibility !== undefined ? item.visibility : item
      );

      if (data.length > 0) {
        setFieldData(data);
      }
    }

    if (clientSubmoduleData?.systemTable) {
      data = JSON.parse(mapFieldData);

      if (data.length > 0) {
        setFieldData(data);
      }
    }
  }, [clientSubmoduleData]);

  return (
    <MatContainer>
      {/* {console.log(fieldData)} */}
      {history.location.state === "DashBoard" && (
        <BreadcrumbView options={BreadcrumbDataDashboard}></BreadcrumbView>
      )}
      {history.location.state === "cDash" && (
        <BreadcrumbView options={BreadcrumbDataClientDash}></BreadcrumbView>
      )}
      {history.location.state === "Modules" && (
        <BreadcrumbView options={BreadcrumbData}></BreadcrumbView>
      )}
      <PageHeading heading={clientControlData && primary} />
      <Grid container>
        {apiError && (
          <Grid item xs={12} className={styles.col}>
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
        )}
        <Grid item xs={8}>
          <Grid container style={{ display: "flex" }}>
            {clientControlData &&
              !(
                (roles.length === 1 &&
                  roles[0] === "Configuration User Access") ||
                (roles.length > 0 &&
                  roles.includes("Configuration User Access") &&
                  (clientControlData.status === "CONFIG_REVIEW_NEEDED" ||
                    clientControlData.status === "APPROVED")) ||
                (roles.length === 1 && roles[0] === "QA User Access") ||
                (roles.length > 0 &&
                  roles.includes("QA User Access") &&
                  clientControlData.status === "CONFIGURED")
              ) && (
                <Grid item xs={6} style={{ display: "flex", flex: 1 }}>
                  <FieldSignOffDetails
                    isUpdated={isSignOffUpdated}
                    fireOnUpdate={setSignOffUpdated}
                    key={Math.random()}
                    clientInfo={clientInfo}
                    clientControlData={clientControlData}
                    userType={loggedInUserData.user_type}
                  />
                </Grid>
              )}

            {clientControlData &&
              clientControlData.status !== "VALIDATED" && (
                <Grid item xs={6} style={{ display: "flex", flex: 1 }}>
                  <FieldApproveDetails
                    isUpdated={isApproveUpdated}
                    fireOnUpdate={setApproveUpdated}
                    key={Math.random()}
                    clientInfo={clientInfo}
                    clientControlData={clientControlData}
                    userType={loggedInUserData.user_type}
                  />
                </Grid>
              )}

            {clientControlData &&
              ((roles.length === 1 &&
                roles[0] === "Configuration User Access") ||
                (roles.length > 0 &&
                  roles.includes("Configuration User Access") &&
                  (clientControlData.status === "CONFIG_REVIEW_NEEDED" ||
                    clientControlData.status === "APPROVED")) ||
                (roles.length === 1 && roles[0] === "QA User Access") ||
                (roles.length > 0 &&
                  roles.includes("QA User Access") &&
                  clientControlData.status === "CONFIGURED")) && (
                <Grid item xs={6} style={{ display: "flex", flex: 1 }}>
                  <FieldConfigureDetails
                    isUpdated={isApproveUpdated}
                    fireOnUpdate={setApproveUpdated}
                    key={Math.random()}
                    clientInfo={clientInfo}
                    clientControlData={clientControlData}
                    userType={loggedInUserData.user_type}
                  />
                </Grid>
              )}
            {clientControlData &&
              clientControlData.status === "VALIDATED" && (
                <Grid item xs={6} style={{ display: "flex", flex: 1 }}>
                  <FieldValidateDetails
                    isUpdated={isApproveUpdated}
                    fireOnUpdate={setApproveUpdated}
                    key={Math.random()}
                    clientInfo={clientInfo}
                    clientControlData={clientControlData}
                    userType={loggedInUserData.user_type}
                  />
                </Grid>
              )}

          </Grid>
          {console.log("ye dekh bus", clientSubmoduleData, clientControlConfigData)}

          {(clientSubmoduleData?.ClientComponent?.config || clientSubmoduleData?.ClientComponent != null) && !!clientControlConfigData && (
            <ClientFieldConfigDetails
              isUpdated={isDetailsUpdated}
              fireOnUpdate={setDetailsUpdated}
              key={Math.random()}
              clientInfo={clientInfo}
              clientControlData={clientControlConfigData}
              columnData={fieldData}
              handlePrimary={handlePrimary}
            />
          )}
          {(clientSubmoduleData?.ClientComponent?.config === false || clientSubmoduleData?.ClientComponent === null) && clientControlData1 && (
            <ClientFieldDetails
              isUpdated={isMappingUpdated}
              fireOnUpdate={setMappingUpdated}
              key={Math.random()}
              clientInfo={clientInfo}
              clientControlData={clientControlData1}
              columnData={fieldData}
              handlePrimary={handlePrimary}
            />
          )}
          {/* {clientControlData && (
            <ClientFieldDetails
              isUpdated={isDetailsUpdated}
              fireOnUpdate={setDetailsUpdated}
              key={Math.random()}
              clientControlData={clientControlData}
              columnData={fieldData}
            />
          )} */}

          {/* {OobControlData && (
            <OobFieldMapping
              isUpdated={isMappingUpdated}
              fireOnUpdate={setMappingUpdated}
              key={Math.random()}
              OobControlData={OobControlData}
            />
          )} */}
        </Grid>
        <Grid item xs={4}>
          {clientControlData && (
            <FieldStatusDetails clientControlData={clientControlData} />
          )}
          {/* {featuresAssigned.indexOf(ADD_COMMENT_ON_CLIENT_FIELD) !== -1 &&
            !clientInfo?.isDeleted && clientInfo?.clientStatus !== 1 && (
              <OobFieldComments />
            )} */}
          <OobFieldComments />
          <OobFieldTimeline columnData={fieldData} auditDetails={controlAuditDetails} />
        </Grid>
      </Grid>
    </MatContainer>
  );
};

export default ManageClientField;
