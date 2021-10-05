/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Tooltip from "../../components/MaterialUi/MatTooltip";
import {emphasize, withStyles, makeStyles } from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import MatContainer from "../../components/MaterialUi/MatContainer";
import BreadcrumbView from "../../components/BreadcrumbView";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import OobFieldConfigDetails from "../../components/OobFieldDetails/OobFieldConfigDetails";
import OobFieldDetails from "../../components/OobFieldDetails";
import OobFieldComments from "../../components/OobFieldComments";
// import OobFieldMapping from "../../components/OobFieldMapping";
import OobFieldTimeline from "../../components/OobFieldTimeline";
import { fetchOOBControlAudit } from "../../actions/OOBFieldTimelineActions";
import { fetchConfigTableById } from "../../actions/ModuleConfigActions";
//import { fetchOOBModule } from "../../actions/OOBModuleActions";
import { RESET_DEFAULTVERSION,
  DEFAULT_PAGE_SIZE_TIMELINE,
  DEFAULT_START_INDEX,
  RESET_OOBAUDIT
 } from "../../utils/AppConstants";
import { handleManageOobFieldError } from "../../utils/Messages";
import { UPDATE_ACTION_OOB_GLOBAL_CONFIG } from "../../utils/FeatureConstants";
// import {
//   // fetchOobControl,
//   fetchOobControlById,
// } from "../../actions/OobControlActions";
import {
  //fetchOobComponent,
  fetchOobComponentById,
  fetchOobConfigComponentById,
} from "../../actions/OobComponentActions";
import { fetchOOBSubmodulesById } from "../../actions/OOBSubmoduleActions";
import { fetchOOBModuleById } from "../../actions/OOBModuleActions";

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
  section: {
    display: 'flex',
    padding: '0px 8px 8px',
    alignItems: 'center' ,
    minWidth:'700px'
},
heading: {
    ...theme.typography.h6
},
ellipsis:{
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth:"500px"
},
ellipsis1:{
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth:"250px"
},
activeChip: {
  color: theme.palette.primary.main + "!important",
},
}));

const StyledBreadcrumb = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.grey[100],
    height: theme.spacing(3),
    color: theme.palette.grey[800],
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.grey[300],
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(theme.palette.grey[300], 0.12),
    },
  },
}))(Chip);

const ManageOobField = () => {
  const history = useHistory();
  let {
    moduleId,
    oobModuleId,
    versionId,
    submoduleId,
    oobSubmoduleId,
    oobControlId,
  } = useParams();
  
  const styles = useStyles();
  const dispatch = useDispatch();
  const { url } = useRouteMatch();
  const [fieldData, setFieldData] = useState([]);
  const [columnData, setColumnData] = useState([]);
  const [isDraft, setDraft] = useState(false);
  const [primary, setPrimary] = useState("");
  const [isDetailsUpdated, setDetailsUpdated] = useState(false);
  // const [isMappingUpdated, setMappingUpdated] = useState(false);
  const featuresAssigned = useSelector((state) => state.User.features);
  const OobModuleData = useSelector(
    (state) => state.OOBModule.OOBModuleById.data
  );
  const OOBModuleById = useSelector(
    (state) => state.OOBModule.OOBModuleById.data
  );

  const OobSubmoduleData = useSelector(
    (state) => state.OOBSubmodule.OobSubmoduleById.data
  );
  
  const submoduleData = OobSubmoduleData?.component
    ? OobSubmoduleData.component.componentName
    : OobSubmoduleData?.systemTable
    ? OobSubmoduleData.systemTable.tableLabel
    : "";

  const OobControlData = useSelector(
    (state) => state.OobComponent.individual.details
  );
  console.log("OobControlData", OobControlData)
  const OobControlConfigData = useSelector(
    (state) => state.OobComponent.individual.configDetails
  );

  const OobControlDataError = useSelector(
    (state) => state.OobControl.individual.fetchError
  );
  const [apiError, setApiError] = useState(null);

  const controlAuditDetails = useSelector(
    (state) => state.OOBFieldTimeline.controlAuditDetails
  );
  const controlAuditDetailsCount = useSelector(
    (state) => state.OOBFieldTimeline.totalElements
  );
  const tableConfig={
    TotalRecords : controlAuditDetailsCount,
    UserID : oobControlId
  }

  const handleModuleBackButton = () => {
    history.push(`/admin/oob-config`);
    dispatch({ type: RESET_DEFAULTVERSION });
  };

  const handleSubmoduleBackButton = () => {
    history.push(
      `/admin/oob-config/components/${moduleId}/${oobModuleId}/${versionId}`
    );
  };

  const handleFieldsBackButton = () => {
    history.push(
      `/admin/oob-config/fields/${moduleId}/${oobModuleId}/${versionId}/${submoduleId}/${oobSubmoduleId}`
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
        OOBModuleById &&
        OOBModuleById.module &&
        OOBModuleById.module.moduleName + " (" + versionId + ")",
      action: handleSubmoduleBackButton,
    },
    {
      id: "fields",
      label: submoduleData ? submoduleData : "",
      action: handleFieldsBackButton,
    },
    {
      id: "controls",
      label: primary,
    },
  ];

  const handlePrimary = (value) => {
    setPrimary(value);
  }

  useEffect(() => {
    if (OobSubmoduleData?.component?.config) {
      dispatch(fetchOobConfigComponentById(oobSubmoduleId, oobControlId));
    } else {
      dispatch(fetchOobComponentById(oobSubmoduleId, oobControlId));
    }

    // dispatch(fetchOobControl(oobSubmoduleId));
    dispatch({ type: RESET_OOBAUDIT });
    dispatch(fetchOOBControlAudit(oobControlId,DEFAULT_START_INDEX, DEFAULT_PAGE_SIZE_TIMELINE));
    dispatch(fetchOOBSubmodulesById(oobSubmoduleId));
    dispatch(fetchOOBModuleById(moduleId));
    dispatch(fetchConfigTableById(moduleId));
  }, [
    dispatch,
    url,
    submoduleId,
    moduleId,
    oobModuleId,
    oobSubmoduleId,
    oobControlId,
    OobSubmoduleData?.component?.config,
  ]);

  useEffect(() => {
    if (OobControlDataError)
      setApiError(handleManageOobFieldError(OobControlDataError));
    else setApiError(false);
  }, [OobControlDataError]);

  useEffect(() => {
    let data = [],
      cols = [],
      columnName="";
    const mapFieldData = OobSubmoduleData?.component
      ? OobSubmoduleData.component.mapField
      : OobSubmoduleData?.systemTable
      ? OobSubmoduleData.systemTable.mapField
      : [];
    if (OobSubmoduleData?.component) {
      data = JSON.parse(mapFieldData).filter((item) => item.visibility);
      cols = data.map((item) => {
        return { id: item.label, label: item.label, fieldType: item.fieldType };
      });

      if (cols.length > 0) {
        setColumnData(cols);
      }
      if (data.length > 0) {
        setFieldData(data);
      }
      // columnName = data.filter(a => a?.primary)[0]?.label;
      // setPrimary(JSON?.parse(OobControlConfigData?.mapField)[columnName])
    }
    
    if (OobSubmoduleData?.systemTable) {
      data = JSON.parse(mapFieldData);
      cols = data.map((item) => {
        return {
          id: item.mapLable,
          label: item.mapLable,
          fieldType: item.fieldType,
        };
      });

      if (cols.length > 0) {
        setColumnData(cols);
      }
      if (data.length > 0) {
        setFieldData(data);
      }
      // columnName = data.filter(a => a?.mapReference)[0]?.mapObject?.columnName;
      // setPrimary(data?.mapField[columnName])
    }
  }, [OobSubmoduleData,OobControlConfigData, OobControlData]);

  useEffect(() => {
    if (!!OobModuleData) {
      let currentversion = OobModuleData?.versions?.filter(
        (obj) => obj.version === versionId
      )[0];
      setDraft(currentversion?.oobModuleStatus === "DRAFT" ? true : false);
    }
  }, [OobModuleData, versionId]);
  console.log("fieldData",fieldData)


  // useEffect(()=>{
  //   if (OobSubmoduleData?.component?.config && OobControlConfigData) {
  //     let columnName = JSON.parse(mapFieldData)?.filter(a => a?.primary)[0]?.label;
  //     setPrimary(JSON?.parse(OobControlConfigData?.mapField)[columnName])
  
  //   }
  //   if (OobSubmoduleData?.component === null) {
  //     let columnName = JSON.parse(mapFieldData).filter(a => a?.mapReference)[0]?.mapObject?.columnName;
  //     setPrimary(JSON?.parse(OobControlData?.mapField)[columnName])
  //   }
  //   if(OobSubmoduleData?.component?.config===false) {
  //     let columnName = JSON.parse(mapFieldData)?.filter(a => a?.primary)[0]?.label;
  //     setPrimary(JSON?.parse(OobControlData?.mapField)[columnName])
  //   }
  // },[OobControlConfigData?.mapField,OobControlData])
  return (
    <>
      <MatContainer>
        {/* <BreadcrumbView options={BreadcrumbData}></BreadcrumbView> */}
        <Breadcrumbs
      style={{ marginBottom: "8px" }}
      aria-label="breadcrumb"
      separator="//"
    >
      {BreadcrumbData?.map((option, key) => (
        <StyledBreadcrumb
          className={option?.action && styles.activeChip}
          label={  option?.label?.length<100 ?option.label:
            (<Tooltip  
            title={option?.label}  placement="right-start">
                <div className={styles.ellipsis1}>
                {option?.label}
                </div>
            </Tooltip>) }
          onClick={option?.action}
          key={key}
        />
      ))}
    </Breadcrumbs>
        <section className={styles.section}>
        <Tooltip className={styles.heading}
        title={primary}  placement="right-start">
            <div className={styles.ellipsis}>
            {primary}
            </div>
        </Tooltip>                     
        </section>
        {/* <PageHeading heading={primary} /> */}
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
            
            {OobSubmoduleData?.component?.config && OobControlConfigData && (
              <OobFieldConfigDetails
                isUpdated={isDetailsUpdated}
                fireOnUpdate={setDetailsUpdated}
                key={Math.random()}
                OobControlData={OobControlConfigData}
                columnData={fieldData}
                handlePrimary={handlePrimary}
              />
            )}
            {(OobSubmoduleData?.component?.config === false || OobSubmoduleData?.component ===null ) &&
              OobControlData && (
                // <>hi</>
                <OobFieldDetails
                  isUpdated={isDetailsUpdated}
                  fireOnUpdate={setDetailsUpdated}
                  key={Math.random()}
                  OobControlData={OobControlData}
                  columnData={fieldData}
                  handlePrimary={handlePrimary}
                />
              )}
          </Grid>
          <Grid item xs={4}>
            {isDraft &&
              featuresAssigned.indexOf(UPDATE_ACTION_OOB_GLOBAL_CONFIG) !==
                -1 && <OobFieldComments />}
            <OobFieldTimeline auditDetails={controlAuditDetails} tableConfig={tableConfig} />
          </Grid>
        </Grid>
      </MatContainer>
    </>
  );
};

export default ManageOobField;
