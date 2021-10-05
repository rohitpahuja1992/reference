import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import { Divider, makeStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import VisibilityIcon from "@material-ui/icons/Visibility";
import CheckCircleOutlineOutlinedIcon from "@material-ui/icons/CheckCircleOutlineOutlined";
import MatCard from "../../components/MaterialUi/MatCard";
import CustomProgressCircular from "../../components/CustomProgressCircular";
import CustomProgressBar from "../../components/CustomProgressBar";
import { Pie, Doughnut } from "react-chartjs-2";
import "chartjs-plugin-datalabels";
import MatContainer from "../../components/MaterialUi/MatContainer";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import { adminHomeWelcomeMessage, HOME } from "../../utils/Messages";
import CloseIcon from "@material-ui/icons/Close";
import PageHeading from "../../components/PageHeading";
import { updateHeaderTitle } from "../../actions/AppHeaderActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DataTable from "../../components/DataTable";
import { fetchClientSubmodule } from "../../actions/ClientModuleActions";
import {
  handleIndividualClientSubmodulesError,
  NO_RECORDS_MESSAGE,
} from "../../utils/Messages";
import {
  DEFAULT_START_INDEX,
  DEFAULT_PAGE_SIZE,
} from "../../utils/AppConstants";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import { red } from "@material-ui/core/colors";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import moment from "moment";
import { formatDate, formatScheduleDate } from "../../utils/helpers";
import { fetchClientOobModuleAnalytics } from "../../actions/DashboardActions";
import { fetchClientSingleModuleAnalytics } from "../../actions/ClientAnalyticsActions";

const useStyles = makeStyles((theme) => ({
  cardHeading: {
    paddingTop: "12px",
    paddingBottom: "10px",
  },
  cardHeadingSize: {
    fontSize: "16px",
  },
  cardContent: {
    flex: 1,
    padding: "16px 30px 25px",
  },
  cardContentChart: {
    flex: 1,
    padding: "16px 0px 0px 0px",
  },
  cardContentProgressBar: {
    flex: 1,
    padding: "16px 10px 0px 10px",
    width: "320px",
  },
  cardContentDoughnut: {
    flex: 1,
    margin: "0px -30px 0px -30px",
  },
  statusProgress: {
    paddingTop: "14px",
  },
  overallCompletion: {
    paddingTop: "8px",
  },
  noDataCard: {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    paddingTop: "20px",
  },
  expandDataCard: {
    padding: "0px",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
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

const HomeNew = (props) => {
  const styles = useStyles();

  const loggedInUserType = useSelector(
    (state) => state.User.loggedInUser.details
  );
  const [openOOBCustom, setopenOOBCustom] = React.useState(false);
  const [openTemp, setOpenTemp] = React.useState(false);
  const closeAddUsersDialog = () => {
    setopenOOBCustom(false);
    setOpenTemp(false);
  };

  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const history = useHistory();
  const getApiError = useSelector(
    (state) => state.Dashboard.OobModuleAnalyticsDashboard?.error
  );
  const totalElements = useSelector(
    (state) => state.ClientModule.clientSubmodulesList.totalElements
  );
  const singleModuleAnalytics = useSelector(
    (state) => state.ClientAnalytics.SingleModuleAnalytics.data
  );
  const startIndex = useSelector(
    (state) => state.ClientModule.submodulePage.startIndex
  );
  const [apiError, setApiError] = useState(null);
  const [popupText, setPopupText] = React.useState("");
  const heightGraph = 200;
  const widthGraph = 320;
  //Expand Collapse - Area Begin
  const [expanded, setExpanded] = React.useState(false);
  const [moduleId, setModuleId] = React.useState(0);
  const [clientId, setClientId] = React.useState(0);
  const [version, setVersion] = React.useState(0);
  const [moduleVersionId, setModuleVersionId] = React.useState(0);

  const dashboardData2 = useSelector(
    (state) => state.Dashboard?.OobModuleAnalyticsDashboard?.data[0] || {}
  );
  var arr = Object?.entries(dashboardData2)?.map(a => a[1]);
  var sortedArr = arr?.sort((a, b) => new Date(b.go_live_date) - new Date(a.go_live_date));

  let todayArray = [];
  let otherArray = []
  for (let i = 0; i < sortedArr.length; i++) {
    if ((new Date().toDateString() === new Date(sortedArr[i].go_live_date).toDateString()) || sortedArr[i].go_live_date === null) {
      otherArray.push(sortedArr[i])
    }
    else {
      todayArray.push(sortedArr[i])
    }
  }

  var mainArr = [...otherArray, ...todayArray]
  const dashboardData = new Map();
  for (var d = 0; d < mainArr.length; d++) {
    var prop = mainArr[d].oob_module_id.toString()
    dashboardData.set(prop, mainArr[d]);
  }
  const handleIndividualGraph = (e) => {
    setModuleId(e.module_id);
    setModuleVersionId(e.oob_module_id);
    setClientId(e.client_id);
    setVersion(e.module_version);
    dispatch(
      fetchClientSubmodule(
        e.module_id,
        e.client_id,
        e.module_version,
        DEFAULT_START_INDEX,
        DEFAULT_PAGE_SIZE
      )
    );
    dispatch(fetchClientSingleModuleAnalytics(e.oob_module_id, e.client_id));
  };

  const [expandedTable, setExpandedTable] = React.useState(true);

  const handleExpandClick = (e) => {
    setExpandedTable(e.oob_module_id);
    setExpanded(!expanded);
    if (expandedTable === e.oob_module_id) {
      setExpandedTable(false);
    }
    handleIndividualGraph(e);
  };

  const calculateSubmoduleProgress = (analyticsData, moduleData) => {
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

  const handlePageChange = (start, size) => {
    dispatch(
      fetchClientSubmodule(moduleId, clientId, version, start, size, searchText)
    );
  };

  const ClientSubmoduleListOOBCustom = useSelector((state) =>
    state.ClientModule.clientSubmodulesList.list.map((data) => {
      let ClientSubmoduleData = {
        id: data?.component
          ? data?.component.id
          : data?.systemTable
            ? data?.systemTable.id
            : 0,
        submoduleName: data?.component
          ? data?.component.componentName
          : data?.systemTable
            ? data?.systemTable.tableLabel
            : "",
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
        customControlsCount:
          singleModuleAnalytics &&
          singleModuleAnalytics[0] &&
          singleModuleAnalytics[0][
            `${data.versions.length > 0 && data.versions[0].id}`
          ]?.custom_controls,
        oobControlsCount:
          singleModuleAnalytics &&
          singleModuleAnalytics[0] &&
          singleModuleAnalytics[0][
            `${data.versions.length > 0 && data.versions[0].id}`
          ]?.oob_controls,

        submoduleVersionId: data.versions.length > 0 && data.versions[0].id,
      };
      return { ...ClientSubmoduleData };
    })
  );

  const colsOOBCustom = [
    { id: "submoduleName", label: "Component Name" },
    { id: "fieldCount", label: "# of Fields" },
    { id: "customControlsCount", label: "# of Custom Controls" },
    { id: "oobControlsCount", label: "# of OOB Controls" },
    { id: "completion", label: "Completion" },
  ];

  const ClientSubmoduleList = useSelector((state) =>
    state.ClientModule.clientSubmodulesList.list.map((data) => {
      let ClientSubmoduleData = {
        id: data?.component
          ? data?.component.id
          : data?.systemTable
            ? data?.systemTable.id
            : 0,
        submoduleName: data?.component
          ? data?.component.componentName
          : data?.systemTable
            ? data?.systemTable.tableLabel
            : "",
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
          ]?.client_review_needed != null &&
          singleModuleAnalytics[0][
            `${data.versions.length > 0 && data.versions[0].id}`
          ]?.product_review_needed +
          singleModuleAnalytics[0][
            `${data.versions.length > 0 && data.versions[0].id}`
          ]?.client_review_needed +
          singleModuleAnalytics[0][
            `${data.versions.length > 0 && data.versions[0].id}`
          ]?.config_review_needed,
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

  const cols1 = [
    { label: "Awaiting Sign-Off", name: "awaitingSignOffCount" },
    { label: "Signed Off", name: "signedOffCount" },
    { label: "Approved", name: "approvedCount" },
    { label: "Review Needed", name: "reviewNeededCount" },
    { label: "Configured", name: "configuredCount" },
    { label: "Validated", name: "validatedCount" },
    { label: "Custom Configuration", name: "customControlsCount" },
    { label: "Out-of-the-Box", name: "oobControlsCount" },
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
          "DashBoard"
        );
      },
    },
  };

  useEffect(() => {
    dispatch(updateHeaderTitle(HOME));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchClientOobModuleAnalytics());
  }, [dispatch, clientId]);

  useEffect(() => {
    if (getApiError)
      setApiError(handleIndividualClientSubmodulesError(getApiError));
    else setApiError(false);
  }, [getApiError]);
  let filteredData = ClientSubmoduleList.filter((data) => data[popupText] > 0);
  let filteredDataOOB = ClientSubmoduleListOOBCustom.filter(
    (data) => data[popupText] > 0
  );

  const getDifferenceInDays = (e) => {
    //let number = "2021-04-08T12:01:26.000+0000";
    let a = moment(formatDate(new Date()));
    // let b = moment(number);
    let b = e.go_live_date
      ? moment(formatDate(e.go_live_date))
      : moment(formatDate(new Date()));
    let c = b.diff(a, "days", true);
    let d = c.toFixed(0);
    let subtract = d == -0 ? 0 : d;
    return subtract;
  };

  let DounChartlabels = [];
  let bgColorDoun = [];
  let customDataDoun = [];
  const customLabelsDoun = (data) => {
    DounChartlabels = [];
    bgColorDoun = [];
    customDataDoun = [];
    if (data.custom_controls > 0) {
      DounChartlabels.push("Custom Configuration");
      bgColorDoun.push("#ff9800");
      customDataDoun.push(data.custom_controls);
    }
    if (data.oob_controls > 0) {
      DounChartlabels.push("Out-of-the-Box");
      bgColorDoun.push("#4caf50");
      customDataDoun.push(data.oob_controls);
    }
    return DounChartlabels;
  };

  let pieChartlabels = [];
  let bgColorPie = [];
  let customDataPie = [];
  const customLabelsPie = (data) => {
    pieChartlabels = [];
    bgColorPie = [];
    customDataPie = [];
    if (data.awaiting_sign_off > 0) {
      pieChartlabels.push("Awaiting Sign-Off");
      bgColorPie.push("#ffa500");
      customDataPie.push(data.awaiting_sign_off);
    }
    if (data.sign_off > 0) {
      pieChartlabels.push("Signed Off");
      bgColorPie.push("#5C78FF");
      customDataPie.push(data.sign_off);
    }
    if (data.approved > 0) {
      pieChartlabels.push("Approved");
      bgColorPie.push("#0000FF");
      customDataPie.push(data.approved);
    }
    if (
      data.product_review_needed > 0 ||
      data.client_review_needed > 0 ||
      data.config_review_needed > 0
    ) {
      // console.log(data.module + data.client_review_needed);
      pieChartlabels.push("Review Needed");
      bgColorPie.push("#FF0000");
      customDataPie.push(
        data.product_review_needed +
        data.client_review_needed +
        data.config_review_needed
      );
    }
    if (data.configured > 0) {
      pieChartlabels.push("Configured");
      bgColorPie.push("#008000");
      customDataPie.push(data.configured);
    }
    if (data.validated) {
      pieChartlabels.push("Validated");
      bgColorPie.push("#800080");
      customDataPie.push(data.validated);
    }
    return pieChartlabels;
  };

  const handleClickMethod = (data) => {
    history.push(
      `/client/components/${data.client_id}/${data.module_id}/${data.oob_module_id}/${data.module_version}`,
      "DashBoard"
    );
  };

  const roles = [];
  if (loggedInUserType.roles != null) {
    loggedInUserType.roles.map((role, index) => roles.push(role.roleName));
  }

  let pendingReviewCount = 0;

  const getPendingReviewCount = (e) => {
    pendingReviewCount = 0;
    roleMapping.map(function (roleMap) {
      roles.map((role) => {
        if (roleMap[0].indexOf(role) >= 0 && e[roleMap[1]] > 0) {
          pendingReviewCount = pendingReviewCount + e[roleMap[1]];
        }
      });
    });
    pendingReviewCount = pendingReviewCount + reviewNeededData(e);

    return pendingReviewCount;
  };

  const reviewNeededData = (data) => {
    let reviewNeededDataCount = 0;
    if (roles.length > 0) {
      roles.map((role) => {
        if (roles.indexOf("Administrator") >= 0 && role === "Administrator") {
          reviewNeededDataCount =
            reviewNeededDataCount +
            data.product_review_needed +
            data.client_review_needed +
            data.config_review_needed;
        } else if (roles.indexOf("Administrator") < 0) {
          if (role === "Product User Access") {
            reviewNeededDataCount =
              reviewNeededDataCount + data.product_review_needed;
          }
          if (role === ("Configuration User Access" || "QA User Access")) {
            reviewNeededDataCount =
              reviewNeededDataCount + data.config_review_needed;
          }
        }
      });
      return reviewNeededDataCount;
    } else {
      return reviewNeededDataCount;
    }
  };

  //[User Role , data string name, label value , color]
  let roleMapping = [
    [
      "Client User Access",
      "awaiting_sign_off",
      "Awaiting Sign Off:",
      "yellowMain",
    ],
    ["Product User Access", "sign_off", "Signed Off:", "blueMain"],
    ["Configuration User Access", "approved", "Approved:", "blueMain"],
    ["QA User Access", "configured", "Configured:", "greenMain"],
  ];

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
        <MatContainer>
          {loggedInUserType && (
            <PageHeading
              heading={adminHomeWelcomeMessage(
                loggedInUserType.firstName,
                loggedInUserType.lastName
              )}
            />
          )}

          {dashboardData != null ? (
            [...dashboardData.keys()].map((dataKey) => (
              <MatCard>
                <CardHeader
                  onClick={() => handleClickMethod(dashboardData.get(dataKey))}
                  className={styles.cardHeading}
                  title={
                    <Typography variant="subtitle1" style={{ fontWeight: 500 }}>
                      <span
                        style={{ cursor: "pointer" }}
                        title="Click to navigate module's components"
                      >
                        {dashboardData.get(dataKey).client_name}:{" "}
                        {dashboardData.get(dataKey).module}{" Progress"}
                      </span>
                      <div style={{ float: "right" }}>
                        {getDifferenceInDays(dashboardData.get(dataKey)) > 0 ? (
                          <div style={{ flex: 1, display: "flex" }}>
                            <span
                              style={{ cursor: "pointer" }}
                              title="Click to navigate module's components">
                              Go Live:{" "}
                              <span style={{ fontWeight: 200 }}>
                                {" "} {formatScheduleDate(
                                  dashboardData.get(dataKey).go_live_date
                                )}{" "}
                                ({getDifferenceInDays(dashboardData.get(dataKey))}{" "}
                                days)
                              </span>
                            </span>
                          </div>
                        ) : getDifferenceInDays(dashboardData.get(dataKey)) < 0 ? (
                          <div
                            style={{ flex: 1, display: "flex", color: "gray" }}
                          >

                            <span
                              style={{ cursor: "pointer" }}
                              title="Click to navigate module's components">
                              Go Live:{" "}
                              <span style={{ fontWeight: 200 }}>
                                {formatScheduleDate(
                                  dashboardData.get(dataKey).go_live_date
                                )}{" "}
                                (
                                {getDifferenceInDays(dashboardData.get(dataKey)) * -1}{" "}
                                days ago)
                              </span>
                            </span>

                          </div>
                        ) : (
                          <div style={{ flex: 1, display: "flex" }}>


                            <span
                              style={{ cursor: "pointer" }}
                              title="Click to navigate module's components">
                              Go Live:{" "}
                              <span style={{ fontWeight: 200 }}>
                                {formatScheduleDate(
                                  dashboardData.get(dataKey).go_live_date
                                )}{" "}
                                ({getDifferenceInDays(dashboardData.get(dataKey))}{" "}
                                Today!)
                              </span>
                            </span>
                          </div>
                        )}
                      </div>
                    </Typography>
                  }
                />
                <Divider />
                <Grid container>
                  <Grid item xs={12}>
                    <div style={{ flex: 1, display: "flex" }}>
                      <CardContent
                        className={styles.cardContentChart}
                        onClick={() =>
                          handleClickMethod(dashboardData.get(dataKey))
                        }
                      >
                        <div className={styles.overallCompletion}>
                          <CustomProgressCircular
                            value={parseFloat(
                              (
                                (dashboardData.get(dataKey).validated /
                                  dashboardData.get(dataKey).controls) *
                                100
                              )
                                .toFixed(1)
                                .toString()
                            )}
                            //onElementsClick={alert('hi')}
                            size={130}
                            thickness={5}
                            valueTextVariant="subtitle1"
                            label="Overall Completion"
                            colorName="greenMain"
                          />
                        </div>
                      </CardContent>
                      <Divider orientation="vertical" flexItem />
                      <CardContent className={styles.cardContentChart}>
                        <Pie
                          width={widthGraph}
                          height={heightGraph}
                          data={{
                            labels: customLabelsPie(dashboardData.get(dataKey)),
                            //  labels: test1(dashboardData.get(dataKey)),
                            // labels: [
                            //   "Awaiting Sign-Off",
                            //   "Signed Off",
                            //   "Approved",
                            //   "Review Needed",
                            //   "Configured",
                            //   "Validated",
                            // ],
                            datasets: [
                              {
                                backgroundColor: bgColorPie,
                                // hoverBackgroundColor: [
                                //   "#f57c00",
                                //   "#00008B",
                                //   "#000080",
                                //   "#8B0000",
                                //   "#388e3c",
                                //   "#301934",
                                // ],
                                //data : test(dashboardData.get(dataKey))
                                data: customDataPie,
                              },
                            ],
                          }}
                          onElementsClick={(elem) => {
                            console.log(elem);
                            if (elem[0] != null) {
                              const filterCol1 = cols1.filter(
                                (data) => data.label == elem[0]._view.label
                              );
                              if (filterCol1) {
                                setPopupText(filterCol1[0].name);
                              }

                              handleIndividualGraph(dashboardData.get(dataKey));
                              //setOpen(true);
                              setOpenTemp(true);
                              //setAddUserKey((count) => count + 1);
                            }
                          }}
                          options={{
                            responsive: true,
                            legend: {
                              display: true,
                              position: "bottom",
                              labels: {
                                padding: 15,
                                usePointStyle: true,
                                fontSize: 12,
                                fontColor: "#000000",
                                fontStyle: "500",
                              },
                            },

                            plugins: {
                              datalabels: {
                                color: "white",
                                formatter: (value, ctx) => {
                                  const label =
                                    parseFloat(
                                      (
                                        (value /
                                          dashboardData.get(dataKey).controls) *
                                        100
                                      )
                                        .toFixed(1)
                                        .toString()
                                    ) + "%"; //ctx.chart.data.labels[ctx.dataIndex];
                                  let itemValue = (
                                    dashboardData.get(dataKey).controls / 10
                                  ).toFixed(0);
                                  if (
                                    value > 0 &&
                                    dashboardData.get(dataKey).controls < 20
                                  )
                                    return label;
                                  else if (
                                    value > 0 &&
                                    value > itemValue &&
                                    dashboardData.get(dataKey).controls > 20
                                  )
                                    return label;
                                  else return "";
                                },
                              },
                            },
                          }}
                        />
                      </CardContent>
                      <Divider orientation="vertical" flexItem />
                      <CardContent className={styles.cardContentDoughnut}>
                        <Doughnut
                          width={widthGraph}
                          height={heightGraph}
                          data={{
                            labels: customLabelsDoun(dashboardData.get(dataKey)),
                            datasets: [
                              {
                                backgroundColor: bgColorDoun,
                                //hoverBackgroundColor: ["#f57c00", "#388e3c"],
                                data: customDataDoun,
                              },
                            ],
                          }}
                          onElementsClick={(elem) => {
                            if (elem[0] != null) {
                              const filterCol1 = cols1.filter(
                                (data) => data.label === elem[0]._view.label
                              );
                              if (filterCol1) {
                                setPopupText(filterCol1[0].name);
                              }
                              //  setPopupText(elem[0]._view.label);
                              handleIndividualGraph(dashboardData.get(dataKey));
                              //setOpen(true);
                              // setOpenTemp(true);
                              setopenOOBCustom(true);
                              // setAddUserKey((count) => count + 1);
                            }
                          }}
                          options={{
                            cutoutPercentage: 45,
                            responsive: true,
                            legend: {
                              display: true,
                              position: "bottom",
                              labels: {
                                padding: 15,
                                usePointStyle: true,
                                fontSize: 12,
                                fontColor: "#000000",
                                fontStyle: "500",
                              },
                            },
                            plugins: {
                              datalabels: {
                                color: "white",
                                formatter: (value, ctx) => {
                                  const label =
                                    parseFloat(
                                      (
                                        (value /
                                          dashboardData.get(dataKey).controls) *
                                        100
                                      )
                                        .toFixed(1)
                                        .toString()
                                    ) + "%"; //ctx.chart.data.labels[ctx.dataIndex];
                                  if (ctx.dataset.data[ctx.dataIndex] > 0)
                                    return label;
                                  else return "";
                                },
                              },
                            },
                          }}
                        />
                      </CardContent>
                      <Divider orientation="vertical" flexItem />
                      {getPendingReviewCount(dashboardData.get(dataKey)) > 0 ? (
                        <CardContent
                          className={styles.cardContentProgressBar}
                          onClick={() =>
                            handleClickMethod(dashboardData.get(dataKey))
                          }
                        >
                          <div style={{ textAlign: "center" }}>
                            <div
                              style={{
                                fontWeight: "500",
                                fontSize: "xx-large",
                              }}
                            >
                              {pendingReviewCount}
                            </div>
                            <div
                              style={{ fontWeight: "500", fontSize: "small" }}
                            >
                              Pending Review
                            </div>
                          </div>
                          {roleMapping.map(function (roleMap) {
                            return roles.map((role) => {
                              if (roleMap[0].indexOf(role) >= 0)
                                return (
                                  <div className={styles.statusProgress}>
                                    <CustomProgressBar
                                      label={roleMap[2]}
                                      countWithSuffix={`${dashboardData.get(dataKey)[roleMap[1]]
                                        } Fields`}
                                      value={parseFloat(
                                        (
                                          (dashboardData.get(dataKey)[roleMap[1]] /
                                            dashboardData.get(dataKey).controls) *
                                          100
                                        )
                                          .toFixed(1)
                                          .toString()
                                      )}
                                      colorName={roleMap[3]}
                                    />
                                  </div>
                                );
                            });
                          })}
                          <div className={styles.statusProgress}>
                            <CustomProgressBar
                              label="Review Needed:"
                              countWithSuffix={`${reviewNeededData(
                                dashboardData.get(dataKey)
                              )} Fields`}
                              value={parseFloat(
                                (
                                  (reviewNeededData(dashboardData.get(dataKey)) /
                                    dashboardData.get(dataKey).controls) *
                                  100
                                )
                                  .toFixed(1)
                                  .toString()
                              )}
                              colorName="redMain"
                            />
                          </div>
                        </CardContent>
                      ) : (
                        <CardContent
                          className={styles.cardContentProgressBar}
                          style={{
                            paddingTop: "50px",
                            width: "320px",
                            textAlign: "center",
                          }}
                        >
                          <div style={{ textAlign: "center" }}>
                            <CheckCircleOutlineOutlinedIcon
                              style={{ color: "green", fontSize: "100px" }}
                            ></CheckCircleOutlineOutlinedIcon>
                          </div>
                          <Typography variant="subtitle2">
                            No pending items to review!
                          </Typography>
                        </CardContent>
                      )}
                    </div>
                    <Divider />
                    {/* <CardActions disableSpacing> */}
                    <div style={{ float: "right", fontSize: "0.8rem" }}>
                      {expandedTable === dashboardData.get(dataKey).oob_module_id
                        ? "Collapse Details"
                        : "Expand Details"}
                      {/* {isOpened == dashboardData.get(dataKey).module ? 
              expandCollapseText : "Expand Details"} */}
                      <IconButton
                        style={{ padding: "4px" }}
                        className={
                          //isOpened == dashboardData.get(dataKey).module &&
                          expandedTable === dashboardData.get(dataKey).oob_module_id
                            ? styles.expandOpen
                            : styles.expand
                          // clsx(styles.expand, {
                          //   [styles.expandOpen]: expanded,
                          // })
                        }
                        onClick={() =>
                          handleExpandClick(dashboardData.get(dataKey))
                        }
                        //   aria-expanded={expanded}
                        aria-label="show more"
                      >
                        <ExpandMoreIcon />
                      </IconButton>
                    </div>
                    {/* </CardActions> */}
                  </Grid>

                  <Grid item xs={12}>
                    <Collapse
                      in={dashboardData.get(dataKey).oob_module_id}
                      timeout="auto"
                      unmountOnExit={true}
                    >
                      <>
                        {expandedTable ===
                          dashboardData.get(dataKey).oob_module_id ? (
                          <CardContent className={styles.expandDataCard}>
                            {apiError ? (
                              <Grid item xs={12} className={styles.error}>
                                <Card
                                  className={
                                    apiError.messageType === "error"
                                      ? styles.errorCard
                                      : styles.warningCard
                                  }
                                >
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
                                  <Typography variant="h5">
                                    {NO_RECORDS_MESSAGE}
                                  </Typography>
                                </CardContent>
                              </MatCard>
                            )}
                          </CardContent>
                        ) : (
                          ""
                        )}
                      </>
                    </Collapse>
                  </Grid>
                </Grid>
              </MatCard>
            ))
          ) : (
            <Grid item xs={12}>
              <CardContent className={styles.noDataCard}>
                <Typography variant="subtitle2">
                  {NO_RECORDS_MESSAGE}
                </Typography>
              </CardContent>
            </Grid>
          )}
          <Dialog
            fullWidth
            maxWidth="lg"
            onClose={closeAddUsersDialog}
            aria-labelledby="customized-dialog-title"
            open={openTemp}
          >
            <DialogTitle
              id="customized-dialog-title"
              onClose={closeAddUsersDialog}
            >
              {/* {popupText} */}
              {openTemp ? (
                <IconButton
                  aria-label="close"
                  className={styles.closeButton}
                  onClick={closeAddUsersDialog}
                >
                  <CloseIcon />
                </IconButton>
              ) : null}
            </DialogTitle>
            <DialogContent>
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
              ) : ClientSubmoduleList.length > 0 ? (
                <MatCard>
                  <DataTable
                    cols={cols}
                    // rows={ClientSubmoduleList.filter(data=>data[popupText]>0)}
                    rows={filteredData || []}
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
            </DialogContent>
          </Dialog>
          <Dialog
            fullWidth
            maxWidth="lg"
            onClose={closeAddUsersDialog}
            aria-labelledby="customized-dialog-title"
            open={openOOBCustom}
          >
            <DialogTitle
              id="customized-dialog-title"
              onClose={closeAddUsersDialog}
            >
              {openOOBCustom ? (
                <IconButton
                  aria-label="close"
                  className={styles.closeButton}
                  onClick={closeAddUsersDialog}
                >
                  <CloseIcon />
                </IconButton>
              ) : null}
            </DialogTitle>
            <DialogContent>
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
              ) : ClientSubmoduleListOOBCustom.length > 0 ? (
                <MatCard>
                  <DataTable
                    cols={colsOOBCustom}
                    // rows={ClientSubmoduleList.filter(data=>data[popupText]>0)}
                    rows={filteredDataOOB || []}
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
            </DialogContent>
          </Dialog>
        </MatContainer>
      )}
    </>
  );
};

export default HomeNew;
