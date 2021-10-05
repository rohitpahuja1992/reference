import React, { useState, useEffect,useCallback } from "react";
import { useHistory, useRouteMatch, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import { CardContent } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import RateReviewIcon from "@material-ui/icons/RateReview";

import MatCard from "../../components/MaterialUi/MatCard";
import MatContainer from "../../components/MaterialUi/MatContainer";
import PageHeading from "../../components/PageHeading";
import DataTable from "../../components/DataTable";
import Search from "../../components/Search";
import CustomProgressCircular from "../../components/CustomProgressCircular";

import VisibilityIcon from "@material-ui/icons/Visibility";
import { updateEntityId } from "../../actions/AppHeaderActions";
import { fetchClientModule, fetchClientModuleById } from "../../actions/ClientModuleActions";
import { handleIndividualClientModulesError, NO_RECORDS_MESSAGE } from "../../utils/Messages";
import {
  DEFAULT_START_INDEX,
  DEFAULT_PAGE_SIZE,
} from "../../utils/AppConstants";

import { fetchClientAllModuleAnalytics } from "../../actions/ClientAnalyticsActions";
import { resetDuplicateError } from "../../actions/ClientModuleActions";
import UpdateClientModule from "../../components/ClientModules/UpdateClientModule";

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
}));

const ClientModules = () => {
  const history = useHistory();
  const styles = useStyles();
  const dispatch = useDispatch();
  const { url } = useRouteMatch();
  const { clientId } = useParams();
  const [openUpdateModule, setOpenUpdateModule] = useState(false);
  const getApiError = useSelector(
    (state) => state.ClientModule.getClientModulesError
  );
  const [apiError, setApiError] = useState(null);
  const allModuleAnalytics = useSelector(
    (state) => state.ClientAnalytics.AllModuleAnalytics.data
  );

  const [searchText, setSearchText] = useState("");
  const loggedInUserData = useSelector(
    (state) => state.User.loggedInUser.details
  );
  const totalElements = useSelector(
    (state) => state.ClientModule.clientModulesList.totalElements
  );
  const startIndex = useSelector((state) => state.ClientModule.page.startIndex);

  const calculateModuleProgress = (analyticsData, moduleData) => {
    let value =
      analyticsData &&
      analyticsData[0] &&
      parseFloat(
        (
          (analyticsData[0][
            `${moduleData.versions.length > 0 && moduleData.versions[0].id}`
          ]?.approved /
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

  const ClientModuleList = useSelector((state) =>
    state.ClientModule.clientModulesList.list.map((data) => {
      let ClientModuleData = {
        id: data.module.id,
        moduleName: data.module.moduleName,
        projectLaunch: data.module?.projectLaunchDate,
        budgetedHours: data.module?.budgetedHours,
        upcomingTask: data.module?.upcomingTask,
        overdueTask: data.module?.overDueTask,
        completion: (
          <div style={{ marginBottom: "-4px", paddingTop: "2px" }}>
            <CustomProgressCircular
              value={calculateModuleProgress(allModuleAnalytics, data)}
              size={46}
              thickness={4}
              valueTextVariant="caption"
              align="start"
              colorName="greenMain"
            />
          </div>
        ),
         currentVersion: data.versions.length > 0 && data.versions[0].version,
         versionId: data.versions.length > 0 && data.versions[0].id,
        //submoduleCount: data.componentCount,
      };
      return { ...ClientModuleData };
    })
  );

  const cols = [
    { id: "moduleName", label: "Module Name" },
    // { id: "currentVersion", label: "Version" },
    // { id: "submoduleCount", label: "Number of Component" },
    { id: "projectLaunch", label: "Project Launch Date" },
    { id: "budgetedHours", label: "Budgeted Hours" },
    { id: "completion", label: "Completion" },
    { id: "upcomingTask", label: "Upcoming Task" },
    { id: "overdueTask", label: "Overdue Task" },
  ];

  const tableConfig = {
    tableType: "",
    paginationOption: "custom",
    menuOptions: [
      {
        type: "link",
        icon: <RateReviewIcon fontSize="small" />,
        label: "View & Update Module",
        action: (e) => openUpdateModuleDialog(e),
      },
      {
        type: "link",
        icon: <VisibilityIcon color="primary" fontSize="small" />,
        label: "View Component",
        action: (data) => {
          history.push(
            `/client/components/${clientId}/${data.id}/${data.versionId}/${data.currentVersion}`
          );
        },
      },
    ],
   
  };

  const openUpdateModuleDialog = (data) => {
    setOpenUpdateModule(true);
    //dispatch(fetchConfigModuleList());
    dispatch(fetchClientModuleById(data.id, clientId));
  };

  const closeUpdateModuleDialog = useCallback(() => {
    setOpenUpdateModule(false);
    dispatch(resetDuplicateError());
  }, [dispatch]);

  const handleChange = (e) => {
    setSearchText(e.target.value);
    if (e.target.value === "") {
        dispatch(
          fetchClientModule(
            "all",
            clientId,
            loggedInUserData.user_type,
            DEFAULT_START_INDEX,
            DEFAULT_PAGE_SIZE
          )
        );     
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSearch = () => {
    if (searchText !== "") {
        dispatch(
          fetchClientModule(
            "all",
            clientId,
            loggedInUserData.user_type,
            DEFAULT_START_INDEX,
            DEFAULT_PAGE_SIZE,
            searchText
          )
        );
    }
  };

  const handlePageChange = (start, size) => {
    // if (label === "Global") {
      dispatch(
        fetchClientModule("all", clientId, loggedInUserData.user_type, start, size, searchText)
      );
    // } else {
    //   dispatch(fetchClientModule("oob", clientId, loggedInUserData.user_type, start, size, searchText));
    // }
  };

  useEffect(() => {
    dispatch(updateEntityId(clientId));
    //setLabel("All");
    dispatch(
      fetchClientModule(
        "all",
        clientId,
        loggedInUserData.user_type,
        DEFAULT_START_INDEX,
        DEFAULT_PAGE_SIZE
      )
    );

    dispatch(fetchClientAllModuleAnalytics(clientId));
  }, [dispatch, url, clientId, loggedInUserData]);

  useEffect(() => {
    if (getApiError)
      setApiError(handleIndividualClientModulesError(getApiError));
    else
      setApiError(false);
  },
    [getApiError]
  );

  return (
    <MatContainer>
      <PageHeading
        heading={"Modules"}
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
      ) : ClientModuleList.length > 0 ? (
        <MatCard>
          <DataTable
            cols={cols}
            rows={ClientModuleList}
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
          {openUpdateModule && (
        <UpdateClientModule
          handleClose={closeUpdateModuleDialog}
          open={openUpdateModule}
        />
      )}
    </MatContainer>
  );
};

export default ClientModules;
