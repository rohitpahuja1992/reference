import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import { CardContent } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

import MatCard from "../../components/MaterialUi/MatCard";
import MatContainer from "../../components/MaterialUi/MatContainer";
import PageHeading from "../../components/PageHeading";
import DataTable from "../../components/DataTable";
import BreadcrumbView from "../../components/BreadcrumbView";
import CustomProgressCircular from "../../components/CustomProgressCircular";
import Search from "../../components/Search";
import IndividualModuleAnalytics from "./IndividualModuleAnalytics";

import VisibilityIcon from "@material-ui/icons/Visibility";
import { updateEntityId } from "../../actions/AppHeaderActions";
import {
  fetchClientSubmodule,
  fetchClientModuleById,
} from "../../actions/ClientModuleActions";
import { fetchClientControlPropertyList } from "../../actions/MasterMessageActions";
import { fetchClientSingleModuleAnalytics } from "../../actions/ClientAnalyticsActions";
import { handleIndividualClientSubmodulesError, NO_RECORDS_MESSAGE } from "../../utils/Messages";
import {
  DEFAULT_START_INDEX,
  DEFAULT_PAGE_SIZE,
} from "../../utils/AppConstants";
import ControlList from "../Submodules/ControlList";

const useStyles = makeStyles((theme) => ({
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
  analyticsContainer: {
    paddingTop: "2px",
    paddingBottom: "8px",
  },
}));

const IndividualClientSubmodules = () => {
  const history = useHistory();
  const styles = useStyles();
  const dispatch = useDispatch();
  const { label, clientId, moduleId, moduleVersionId, version } = useParams();
  const [searchText, setSearchText] = useState("");
  const loggedInUserData = useSelector(
    (state) => state.User.loggedInUser.details
  );
  const singleModuleAnalytics = useSelector(
    (state) => state.ClientAnalytics.SingleModuleAnalytics.data
  );
  // const singleModuleAnalyticsError = useSelector(
  //   (state) => state.ClientAnalytics.SingleModuleAnalytics.error
  // );
  const getApiError = useSelector(
    (state) => state.ClientModule.getClientSubmodulesError
  );
  const [apiError, setApiError] = useState(null);
  const clientModuleById = useSelector(
    (state) => state.ClientModule.clientModuleById.data
  );
  const totalElements = useSelector(
    (state) => state.ClientModule.clientSubmodulesList.totalElements
  );
  const startIndex = useSelector(
    (state) => state.ClientModule.submodulePage.startIndex
  );
  const moduleId2 = useSelector(
    (state) => state.ClientModule.submodulePage.moduleId
  );

  const calculateSubmoduleProgress = (analyticsData, moduleData) => {
    let value =
      analyticsData &&
      analyticsData[0] &&
      parseFloat(
        (
          (analyticsData[0][
            `${moduleData.versions.length > 0 && moduleData.versions[0].id}`
          ]?.validated /
            analyticsData[0][
              `${moduleData.versions.length > 0 && moduleData.versions[0].id}`
            ]?.controls) *
          100
        )
          .toFixed(1)
          .toString()
      );
    return isNaN(value) ? 0 : value;
  };

 
  const ClientSubmoduleList = useSelector((state) =>
    state.ClientModule.clientSubmodulesList.list.map((data) => {
      let ClientSubmoduleData = {
        id: data?.component ? data?.component.id : (data?.systemTable ? data?.systemTable.id : 0),
        submoduleName: data?.component ? data?.component.componentName : (data?.systemTable.tableLabel ? data?.systemTable.tableLabel : data?.systemTable.tableName),
        fieldCount: data.oobControlDataCount,
        completion: (
          <div style={{ marginBottom: "-4px", paddingTop: "2px" }}>
            <CustomProgressCircular
              value={calculateSubmoduleProgress(singleModuleAnalytics, data)}
              size={46}
              thickness={4}
              valueTextVariant="caption"
              align="start"
              colorName="greenMain"
            />
          </div>
        ),
        awaitingSignOffCount:
        singleModuleAnalytics &&
        singleModuleAnalytics[0] &&
        singleModuleAnalytics[0][
          `${data.versions.length > 0 && data.versions[0].id}`
        ]?.awaiting_sign_off,
      signedOffCount:
        singleModuleAnalytics &&
        singleModuleAnalytics[0] &&
        singleModuleAnalytics[0][
          `${data.versions.length > 0 && data.versions[0].id}`
        ]?.sign_off,
      approvedCount:
        singleModuleAnalytics &&
        singleModuleAnalytics[0] &&
        singleModuleAnalytics[0][
          `${data.versions.length > 0 && data.versions[0].id}`
        ]?.approved,
        reviewNeededCount:
        singleModuleAnalytics &&
        singleModuleAnalytics[0] &&
        singleModuleAnalytics[0][
          `${data.versions.length > 0 && data.versions[0].id}`
        ]?.client_review_needed !=null &&
        (singleModuleAnalytics[0][
          `${data.versions.length > 0 && data.versions[0].id}`
        ]?.product_review_needed+
        singleModuleAnalytics[0][
          `${data.versions.length > 0 && data.versions[0].id}`
        ]?.client_review_needed+
        singleModuleAnalytics[0][
          `${data.versions.length > 0 && data.versions[0].id}`
        ]?.config_review_needed),
        configuredCount:
        singleModuleAnalytics &&
        singleModuleAnalytics[0] &&
        singleModuleAnalytics[0][
          `${data.versions.length > 0 && data.versions[0].id}`
        ]?.configured,
        validatedCount:
        singleModuleAnalytics &&
        singleModuleAnalytics[0] &&
        singleModuleAnalytics[0][
          `${data.versions.length > 0 && data.versions[0].id}`
        ]?.validated,

        submoduleVersionId: data.versions.length > 0 && data.versions[0].id,
      };
      return { ...ClientSubmoduleData };
    })
  );

  const handleBackButton = () => {
    history.push(`/client/modules/${clientId}`);
  };

  const handleBackButtonClientDashBoard = () => {
    history.push(`/client/dashboard/${clientId}`);    
  };

  const handleBackButtonDashBoard = () => {
    history.push(`/admin`);
  };

  const BreadcrumbData = [
    {
      id: "modules",
      label: "Modules",
      action: handleBackButton,
    },
    {
      id: "submodules",
      label:
        clientModuleById &&
        clientModuleById.module &&
        clientModuleById.module.moduleName + " (" + version + ")",
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
    },
  ];

  const BreadcrumbDataDashboard = [
    {
      id: "DashBoard",
      label: "DashBoard",
      action: handleBackButtonDashBoard,
    },
    {
      id: "submodules",
      label:
        clientModuleById &&
        clientModuleById.module &&
        clientModuleById.module.moduleName + " (" + version + ")",
    },
  ];
  
  

  const cols = [
    { id: "submoduleName", label: "Component Name" },
    { id: "fieldCount", label: "# of Fields" },
    { id: "awaitingSignOffCount", label: "# of Awaiting Sign-Off" },
    { id: "signedOffCount", label: "# of Signed Off" },
    { id: "approvedCount", label: "# of Approved" },
    { id: "reviewNeededCount", label: "# of Review Needed" },
    { id: "configuredCount", label: "# of Configured" },
    { id: "validatedCount", label: "# of Validated" },
    { id: "completion", label: "Completion" },
  ];

  const tableConfig = {
    tableType: "",
    paginationOption: "custom",
    actions: {
      icon: <VisibilityIcon color="primary" fontSize="small" />,
      tooltipText: "View Fields",
      action: (data) => {
        history.push(
          `/client/fields/${clientId}/${moduleId}/${moduleVersionId}/${data.id}/${data.submoduleVersionId}/${version}`,
          history.location.state
        );
      },
    },
  };

  const handleChange = (e) => {
    setSearchText(e.target.value);
    if (e.target.value === "")
      dispatch(
        fetchClientSubmodule(
          moduleId,
          clientId,
          version,
          DEFAULT_START_INDEX,
          DEFAULT_PAGE_SIZE
        )
      );
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSearch = () => {
    if (searchText !== "")
      dispatch(
        fetchClientSubmodule(
          moduleId,
          clientId,
          version,
          DEFAULT_START_INDEX,
          DEFAULT_PAGE_SIZE,
          searchText
        )
      );
  };

  const handlePageChange = (start, size) => {
    dispatch(
      fetchClientSubmodule(moduleId, clientId, version, start, size, searchText)
    );
  };
  useEffect(() => {
    dispatch(updateEntityId(clientId));
    
    dispatch(
      fetchClientSubmodule(
        moduleId,
        clientId,
        version,
        moduleId2 === moduleId ? startIndex : DEFAULT_START_INDEX,
        DEFAULT_PAGE_SIZE
      )
    );
    if (loggedInUserData.user_type === "CLIENT") {
      dispatch(fetchClientModuleById(moduleId));
    } else {
      dispatch(fetchClientModuleById(moduleId, clientId));
    }
    dispatch(fetchClientSingleModuleAnalytics(moduleVersionId, clientId));
  }, [
    dispatch,
    clientId,
    moduleId,
    version,
    moduleVersionId,
    loggedInUserData.user_type,
  ]);

  useEffect(() => {
    if (getApiError)
      setApiError(handleIndividualClientSubmodulesError(getApiError));
    else
      setApiError(false);
  },
    [getApiError]
  );

  useEffect(() => {
    dispatch(fetchClientControlPropertyList(moduleId, version, clientId));
  }, [dispatch, moduleId, version, clientId]);

  return (
    <MatContainer>
      {history.location.state=="DashBoard" &&
      <BreadcrumbView options={BreadcrumbDataDashboard}></BreadcrumbView>}
      {history.location.state=="cDash" &&
      <BreadcrumbView options={BreadcrumbDataClientDash}></BreadcrumbView>}
      {history.location.state=="Modules" &&
      <BreadcrumbView options={BreadcrumbData}></BreadcrumbView>}
      {singleModuleAnalytics && (
        <div className={styles.analyticsContainer}>
          <IndividualModuleAnalytics
            title={`${clientModuleById &&
              clientModuleById.module &&
              clientModuleById.module.moduleName
              } Progress`}
            analyticsData={singleModuleAnalytics[1]}
          />
        </div>
      )}
      <PageHeading
        heading="Components"
        action={
          <Grid container style={{ width: "auto" }}>
            <Search
              handleChange={handleChange}
              handleKeyPress={handleKeyPress}
              handleSearch={handleSearch}
            />
          </Grid>
        }
      />
      {apiError ? (
        <Grid item xs={12} className={styles.error}>
          <Card className={apiError.messageType === "error" ? styles.errorCard : styles.warningCard}>
            <Typography variant="body2">
              {apiError.message}
            </Typography>
          </Card>
        </Grid>
      ) : ClientSubmoduleList.length > 0 ? (
        <MatCard>
          <DataTable
            cols={cols}
            rows={ClientSubmoduleList}
            config={tableConfig}
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
      <ControlList open={"Client"}/>
    </MatContainer>
  );
};

export default IndividualClientSubmodules;
