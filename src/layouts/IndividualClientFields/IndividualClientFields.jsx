import React, { useState, useEffect, useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import DeleteIcon from "@material-ui/icons/Delete";
import Grid from "@material-ui/core/Grid";
import CardHeader from "@material-ui/core/CardHeader";
import ReviewNeededPopup from "../../components/ReviewNeededPopup";
import RateReviewIcon from "@material-ui/icons/RateReview";
// import { formatDateDash } from "../../utils/helpers";
import MatCard from "../../components/MaterialUi/MatCard";
import { fetchClientById } from "../../actions/ClientActions";
import MatContainer from "../../components/MaterialUi/MatContainer";
import PageHeading from "../../components/PageHeading";
import DataTable from "../../components/DataTable";
import Search from "../../components/Search";
import BreadcrumbView from "../../components/BreadcrumbView";
import MatButton from "../../components/MaterialUi/MatButton";
import IndividualModuleAnalytics from "../IndividualClientSubmodules/IndividualModuleAnalytics";
import Card from "@material-ui/core/Card";
// import VisibilityIcon from "@material-ui/icons/Visibility";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import Chip from "@material-ui/core/Chip";
import BulkProductReview from "./BulkProductReview";
import AddClientField from "../../components/AddClientField";
// import { fetchMasterControl } from "../../actions/ControlActions";

import {
  fetchClientComponentById,
  fetchClientModuleById,
  deleteClientComponetnById,
  // fetchClientSubmoduleById,
  bulkFieldStatus,
} from "../../actions/ClientModuleActions";

import { updateEntityId } from "../../actions/AppHeaderActions";
import {
  NO_RECORDS_MESSAGE,
  READY_TO_SIGNOFF,
  SIGN_OFF_CONFIRM,
  CONFIRM,
  READY_TO_CONFIGURE,
  RETRY_CONFIRM,
  CONFIGURE_CONFIRM,
  PRODUCT_REVIEW_CONFIRM,
  CONFIG_REVIEW_CONFIRM,
  READY_TO_VALIDATE,
  VALIDATE_CONFIRM,
  handleIndividualClientFieldsError,
  VIEW_FIELD_DETAIL
} from "../../utils/Messages";

import {
  DEFAULT_START_INDEX,
  DEFAULT_PAGE_SIZE,
  SET_DEFAULT_STARTINDEX
} from "../../utils/AppConstants";

import {
  FIELD_APPROVE_ACTION,
  FIELD_SIGN_OFF_ACTION,
  FIELD_REVIEW_ACTION,
  FIELD_MANUALLY_CONFIGURED_ACTION,
  FIELD_QA_PASSFAIL_ACTION,
  UPDATE_CLIENT_FIELD_ACTION,
} from "../../utils/FeatureConstants";
import { showMessageDialog } from "../../actions/MessageDialogActions";
import { fetchClientSingleModuleAnalytics } from "../../actions/ClientAnalyticsActions";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
    paddingLeft: "270px",
  },
  subMenuGrid: {
    position: "fixed",
  },
  searchFilter: {
    padding: "8px 8px 0px",
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
  cardHeading: {
    paddingTop: "10px",
    paddingBottom: "10px",
    backgroundColor: theme.palette.primary.light,
  },
  cardHeadingSize: {
    fontSize: "16px",
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
  approved: {
    background: "#00c853",
  },
  awatingSignOff: {
    background: theme.palette.warning.main,
  },
  signedOff: {
    background: theme.palette.primary.main,
  },
  analyticsContainer: {
    paddingTop: "2px",
    paddingBottom: "8px",
  },
  button: {
    marginLeft: "7px",
  },
}));

const IndividualClientFields = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const styles = useStyles();
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewStatus, setReviewStatus] = useState('');
  const {

    clientId,
    moduleId,
    submoduleId,
    submoduleVersionId,
    version,
    moduleVersionId,
  } = useParams();
  const [searchText, setSearchText] = useState("");
  const [checked, setChecked] = useState([]);
  const [addNewActive, setAddNewActive] = useState(false);

  const [allChecked, setAllChecked] = useState(false);
  const [allDisabled, setAllDisabled] = useState(false);
  const [fireOnUpdate, setFireOnUpdate] = useState(false);
  const [isSignoffDisable, setIsSignoffDisable] = useState(true);
  const [isApproveDisable, setIsApproveDisable] = useState(true);
  const [isManConfigDisable, setIsManConfigDisable] = useState(true);
  const [isQAPASSFAILDisable, setIsQAPASSFAILDisable] = useState(true);
  const [isReviewNeededDisable, setIsReviewNeededDisable] = useState(true);
  const [isProdReviewDisable, setIsProdReviewDisable] = useState(true);
  const loggedInUserData = useSelector(
    (state) => state.User.loggedInUser.details
  );
  const clientInfo = useSelector(
    (state) => state.Client.clientByIdDetails.details
  );
  // console.log('clientInfo',clientInfo)
  const featuresAssigned = useSelector((state) => state.User.features);
  const singleModuleAnalytics = useSelector(
    (state) => state.ClientAnalytics.SingleModuleAnalytics.data
  );
  const isComponentAdded = useSelector(
    (state) => state.ClientModule?.data?.isComponentAdded
  );
  const [open, setOpen] = useState(false);
  const [fieldOpen, setFieldOpen] = useState(false);
  // const singleModuleAnalyticsError = useSelector(
  //   (state) => state.ClientAnalytics.SingleModuleAnalytics.error
  // );

  const singleSubmoduleAnalytics =
    singleModuleAnalytics &&
      singleModuleAnalytics[0] &&
      Object.keys(singleModuleAnalytics[0]).length > 0
      ? { totalSummary: singleModuleAnalytics[0][submoduleVersionId] }
      : {};

  const oobControlIdError = useSelector((state) => state.OobControl.data.error);
  const oobSubmoduleError = useSelector(
    (state) => state.OOBSubmodule.OobSubmoduleById.error
  );
  const [apiError, setApiError] = useState(null);

  const clientModuleById = useSelector(
    (state) => state.ClientModule.clientModuleById.data
  );
  const isComponentDeleted = useSelector(
    (state) => state.ClientModule.data.isComponentDeleted
  );

  const bulkUpdate = useSelector((state) => state.ClientModule.bulkUpdate);

  // const clientSubmoduleById = useSelector(
  //   (state) => state.ClientModule.clientSubmoduleById.data
  // );
  // const submoduleData = clientSubmoduleById && clientSubmoduleById.subModule;

  const clientSubmoduleData = useSelector(
    (state) => state.ClientModule.clientsSubmoduleById.data
  );
  const submoduleData = clientSubmoduleData.ClientComponent
    ? clientSubmoduleData.ClientComponent.componentName
    : clientSubmoduleData?.systemTable
      ? clientSubmoduleData.systemTable.tableLabel
      : "";

  const [columnData, setColumnData] = useState([]);
  const [fieldData, setFieldData] = useState([]);
  const [primaryColumn, setPrimaryColumn] = useState("");
  const roles =
    loggedInUserData && loggedInUserData.roles.map((item) => item.roleName);

  const handleFieldStatusLabel = (details) => {
    if (details === "AWAITING_SIGN_OFF" || details === "RETRACT") {
      return "Awaiting Sign-Off";
    } else if (details === "SIGN_OFF") {
      return "Signed Off";
    } else if (details === "APPROVED") {
      return "Approved";
    } else if (details === "CONFIGURED") {
      return "Configured";
    } else if (details === "VALIDATED") {
      return "Validated";
    } else if (details.indexOf("REVIEW_NEEDED") !== -1) {
      return "Review Needed";
    } else {
      return details;
    }
  };

  const handleFieldStatusClass = (status) => {
    if (
      status === "AWAITING_SIGN_OFF" ||
      status === "RETRACT" ||
      status === "PRODUCT_REVIEW_NEEDED" ||
      status === "CLIENT_REVIEW_NEEDED" ||
      status === "CONFIG_REVIEW_NEEDED"
    ) {
      return styles.awatingSignOff;
    } else if (
      status === "SIGN_OFF" ||
      status === "APPROVED" ||
      status === "CONFIGURED"
    ) {
      return styles.signedOff;
    } else {
      return styles.approved;
    }
  };

  const handleOobStatusClass = (status) => {
    if (status === "YES") {
      return styles.approved;
    } else {
      return styles.awatingSignOff;
    }
  };
  // const totalElements = useSelector(
  //   (state) => state.ClientModule.clientControlsList.totalElements
  // );
  // const startIndex = useSelector(
  //   (state) => state.ClientModule.controlPage.startIndex
  // );

  // const pageSize = useSelector((state) => state.ClientModule.controlPage.pageSize);
  const totalElements = useSelector(
    (state) => state.ClientModule.clientsSubmoduleById.totalElements
  );

  const startIndex = useSelector(
    (state) => state.ClientModule.clientsSubmoduleById.startIndex || 0
  );
  const submoduleId2 = useSelector(
    (state) => state.ClientModule.clientsSubmoduleById.submoduleId || ''
  );
  const pageSize = useSelector(
    (state) => state.ClientModule.clientsSubmoduleById.pageSize || 10
  );
  const reset = useSelector((state) => state.ClientModule.reset);
  // console.log("reset",reset)
  // const clientOobComponentData = useSelector((state) =>
  // clientSubmoduleData?.ClientComponent?.clientOobComponentData);
  const convertDate = (value) => {
    let dateWrapper = new Date(value);
    if (dateWrapper !== "Invalid Date" && value?.toString()?.split("-").length === 3 && (value?.toString()?.length === 10 || value?.toString()?.length === 28)) {
      var parts = value?.split('-');
      let newDate = `${parts[2]}-${parts[1]}-${parts[0]}`
      return newDate;
    } else {
      return value;
    }
  }
  const ClientComponentData = useSelector((state) =>
    clientSubmoduleData?.ClientComponent?.clientOobComponentData?.map(
      (data, index) => {
        let existingComponentData = JSON.parse(data.mapField);
        let componentData = {}
        Object.entries(existingComponentData).forEach(
          ([key, value]) => {
            componentData[key] = convertDate(value);
          });
        componentData.id = data.id;
        componentData.editedByClient = (!clientInfo?.isDeleted && clientInfo?.clientStatus !== 1) ? data.editedByClient : false;
        componentData.fieldOob = data.oobChangeStatus ? (
          <div>
            {
              <Chip
                label={data.oobChangeStatus}
                className={handleOobStatusClass(data.oobChangeStatus)}
                color="primary"
              />
            }
          </div>
        ) : (
          "N/A"
        );
        componentData.status = data.status ? (
          <div>
            {
              <Chip
                label={handleFieldStatusLabel(data.status)}
                className={handleFieldStatusClass(data.status)}
                color="primary"
              />
            }
          </div>
        ) : (
          "N/A"
        );
        componentData.oobStatus = data.oobChangeStatus;
        componentData.statusDialog = data.status;

        return { ...componentData };
      }
    )
  );
  // console.log("ClientComponentData", ClientComponentData)
  const handleModuleBackButton = () => {
    history.push(`/client/modules/${clientId}`);
  };

  const handleSubmoduleBackButton = () => {
    history.push(
      `/client/components/${clientId}/${moduleId}/${moduleVersionId}/${version}`,
      history.location.state
    );
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
      label: "OOB Modules",
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
      action: handleSubmoduleBackButton,
    },
    {
      id: "fields",
      label: submoduleData ? submoduleData : "",
    },
  ];

  const tableConfig = {

    tableType: "",
    headerFixed: "yes",
    firstColumnFixed: "yes",
    maxWidth: window.innerWidth - 144,
    height: "500px",
    checked: ((roles.indexOf("Product User Access") !== -1 || roles.indexOf("Client User Access") !== -1 || roles.indexOf("QA User Access") !== -1 || roles.indexOf("Configuration User Access") !== -1) && !clientInfo?.isDeleted && clientInfo?.clientStatus !== 1),
    checkedStatus: "workflow",
    paginationOption: "custom",
    menuOptions: [
      {
        type: "link",
        icon: <RateReviewIcon fontSize="small" />,
        label: VIEW_FIELD_DETAIL,
        action: (data) => {
          history.push(
            `/client/field-details/${clientId}/${moduleId}/${moduleVersionId}/${submoduleId}/${submoduleVersionId}/${data.id}/${version}`,
            history.location.state
          );
        },
      },
      {
        type: "link",
        icon: <DeleteIcon fontSize="small" />,
        label: "Delete",
        doNotTrack: true,
        action: (e) => {
          openConfirmDeleteDialog(e);
        },
      },
    ],
    // actions: {
    //   icon: <VisibilityIcon color="primary" fontSize="small" />,
    //   tooltipText: VIEW_FIELD_DETAIL,
    //   action: (data) => {
    //     history.push(
    //       `/client/field-details/${clientId}/${moduleId}/${moduleVersionId}/${submoduleId}/${submoduleVersionId}/${data.id}/${version}`,
    //       history.location.state
    //     );
    //   },
    // },
  };

  const openConfirmDeleteDialog = (e) => {
    //let columns = getTableCol();
    console.log("df", e)
    let messageObj = {
      primaryButtonLabel: "Yes",
      primaryButtonAction: () => {
        dispatch(deleteClientComponetnById(e.id));
      },
      secondaryButtonLabel: "No",
      secondaryButtonAction: () => { },
      title: CONFIRM,
      message: "Are you sure you want to delete client field?",
    };
    dispatch(showMessageDialog(messageObj));
  };


  const handlePageChange = (start, size) => {
    dispatch(
      fetchClientComponentById(submoduleVersionId, start, size, searchText)
    );
  };

  const handleChange = (e) => {
    setSearchText(e.target.value);
    if (e.target.value === "")
      dispatch(
        fetchClientComponentById(
          submoduleVersionId,
          DEFAULT_START_INDEX,
          pageSize
        )
      );
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSearch = () => {
    if (searchText !== "")
      dispatch(
        fetchClientComponentById(
          submoduleVersionId,
          DEFAULT_START_INDEX,
          pageSize,
          searchText
        )
      );
  };

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
      handleSignoffDisable(newChecked);
      handleApproveDisable(newChecked);
      handleReviewNeededDisable(newChecked);
      handleProdReviewDisable(newChecked);
      handleManConfigDisable(newChecked);
      handleQAPassFailfigDisable(newChecked);
    }
    if (typeof value === "boolean" && value === true) {
      setAllChecked(true);
      let newAllChecked = [];
      ClientComponentData.map(
        (row, index) =>
          (
            (roles.indexOf("Product User Access") !== -1 && row.statusDialog === "SIGN_OFF") ||
            (roles.indexOf("Configuration User Access") !== -1 && row.statusDialog === "CONFIG_REVIEW_NEEDED") ||
            (roles.indexOf("QA User Access") !== -1 && (row.statusDialog === "CONFIGURED" || row.statusDialog === "APPROVED"))
            ||
            (loggedInUserData.user_type === "CLIENT" &&
              (row.statusDialog === "AWAITING_SIGN_OFF" ||
                row.statusDialog === "RETRACT"))) &&
          newAllChecked.push(row)
      );
      setChecked(newAllChecked);
      handleSignoffDisable(newAllChecked);
      handleApproveDisable(newAllChecked);
      handleReviewNeededDisable(newAllChecked);
      handleProdReviewDisable(newAllChecked);
      handleManConfigDisable(newAllChecked);
      handleQAPassFailfigDisable(newAllChecked);
    }
    if (typeof value === "boolean" && value === false) {
      setAllChecked(false);
      setChecked([]);
      handleSignoffDisable([]);
      handleApproveDisable([]);
      handleReviewNeededDisable([]);
      handleProdReviewDisable([]);
      handleManConfigDisable([]);
      handleQAPassFailfigDisable([]);
    }
    console.log("value", newChecked);
  };

  const handleSignoffDisable = (checked) => {
    let data = checked.filter(function (item) {
      return item.statusDialog === "SIGN_OFF";
    });
    if (checked.length === 0 || data.length > 0) setIsSignoffDisable(true);
    else setIsSignoffDisable(false);
  };

  const bulkSignOffControl = () => {
    let payload = [];
    checked
      //.filter((item) => item.statusDialog !== "SIGN_OFF")
      .map((obj) => {
        let data = {};
        data["clientOobComponentDataId"] = obj.id;
        data["comment"] = "";
        data["status"] = "SIGN_OFF";
        return payload.push(data);
      });
    dispatch(bulkFieldStatus(payload));
  };

  const confirmSignOffControl = () => {
    let messageObj = {
      primaryButtonLabel: "Sign Off",
      //primaryButtonDisabled: handleBulkSignoff().disable,
      primaryButtonAction: () => {
        bulkSignOffControl();
      },
      secondaryButtonLabel: "Cancel",
      secondaryButtonAction: () => { },
      title: READY_TO_SIGNOFF,
      message: SIGN_OFF_CONFIRM,
    };
    dispatch(showMessageDialog(messageObj));
  };

  const handleApproveDisable = (checked) => {
    let data = checked.filter(function (item) {
      return item.statusDialog !== "SIGN_OFF";
    });
    //if (checked.length === 0 || data.length > 0) setIsApproveDisable(true);
    if (checked.length === 0 || data.length > 0) setIsApproveDisable(true);
    else setIsApproveDisable(false);
  };

  const handleManConfigDisable = (checked) => {
    let data = checked.filter(function (item) {
      return (
        item.statusDialog === "APPROVED" ||
        item.statusDialog === "CONFIG_REVIEW_NEEDED"
      );
    });
    if (data.length > 0) setIsManConfigDisable(false);
    else setIsManConfigDisable(true);
  };

  const handleQAPassFailfigDisable = (checked) => {
    let data = checked.filter(function (item) {
      return item.statusDialog === "CONFIGURED";
    });
    if (data.length > 0) setIsQAPASSFAILDisable(false);
    else setIsQAPASSFAILDisable(true);
  };

  const handleProdReviewDisable = (checked) => {
    let data = checked.filter(function (item) {
      return item.statusDialog === "PRODUCT_REVIEW_NEEDED";
    });
    if (data.length > 0) setIsProdReviewDisable(false);
    else setIsProdReviewDisable(true);
  };

  const handleReviewNeededDisable = (checked) => {
    let data = checked.filter(function (item) {
      return item.statusDialog === "SIGN_OFF";
    });
    if (checked.length === 0 || data.length > 0) setIsReviewNeededDisable(true);
    else setIsReviewNeededDisable(false);
  };

  const bulkApproveControl = (retried) => {
    let payload = [];
    checked.map((obj) => {
      let data = {};
      data["clientOobComponentDataId"] = obj.id;
      data["comment"] = "";
      data["status"] = "APPROVED";
      return payload.push(data);
    });
    dispatch(bulkFieldStatus(payload, retried));
  };

  const confirmApproveControl = () => {
    let messageObj = {
      primaryButtonLabel: "Approve",
      //primaryButtonDisabled: handleBulkApprove().disable,
      primaryButtonAction: () => {
        bulkApproveControl();
      },
      secondaryButtonLabel: "Cancel",
      secondaryButtonAction: () => { },
      title: "Ready to approve?",
      message: `Please click on "Approve" to confirm your approval.`,
    };
    dispatch(showMessageDialog(messageObj));
  };

  const openProductReviewDialog = () => {
    setOpen(true);
  };

  const closeProductReviewDialog = useCallback(() => {
    setFireOnUpdate(true);
    setOpen(false);
  }, [setFireOnUpdate]);

  const confirmConfigureControl = () => {
    let messageObj = {
      primaryButtonLabel: "Configure",
      primaryButtonAction: () => {
        configureControl();
      },
      secondaryButtonLabel: "Cancel",
      secondaryButtonAction: () => { },
      title: READY_TO_CONFIGURE,
      message: CONFIGURE_CONFIRM,
    };
    dispatch(showMessageDialog(messageObj));
  };

  const confirmRetryControl = () => {
    let messageObj = {
      primaryButtonLabel: "Retry",
      primaryButtonAction: () => {
        bulkApproveControl('retried');
      },
      secondaryButtonLabel: "Cancel",
      secondaryButtonAction: () => { },
      title: CONFIRM,
      message: RETRY_CONFIRM,
    };
    dispatch(showMessageDialog(messageObj));
  };

  const configureControl = () => {
    let payload = [];
    checked.map((obj) => {
      let data = {};
      data["clientOobComponentDataId"] = obj.id;
      data["comment"] = "";
      data["status"] = "CONFIGURED";
      return payload.push(data);
    });
    dispatch(bulkFieldStatus(payload));
  };

  const reviewApproval = (review) => {
    let payload = [];
    checked.map((obj) => {
      let data = {};
      data["clientOobComponentDataId"] = obj.id;
      data["comment"] = "";
      data["status"] = review;
      return payload.push(data);
    });
    dispatch(bulkFieldStatus(payload));
  };

  const configReviewApproval = () => {
    let payload = [];
    checked.map((obj) => {
      let data = {};
      data["clientOobComponentDataId"] = obj.id;
      data["comment"] = "";
      data["status"] = "CONFIG_REVIEW_NEEDED";
      return payload.push(data);
    });
    dispatch(bulkFieldStatus(payload));
  };

  const validateControl = () => {
    let payload = [];
    checked.map((obj) => {
      let data = {};
      data["clientOobComponentDataId"] = obj.id;
      data["comment"] = "";
      data["status"] = "VALIDATED";
      return payload.push(data);
    });
    dispatch(bulkFieldStatus(payload));
  };

  const confirmReviewApproval = (review) => {
    let messageObj = {
      primaryButtonLabel: "Review Needed",
      primaryButtonAction: () => {
        reviewApproval(review);
      },
      secondaryButtonLabel: "Cancel",
      secondaryButtonAction: () => { },
      title: CONFIRM,
      message: PRODUCT_REVIEW_CONFIRM,
    };
    dispatch(showMessageDialog(messageObj));
  };

  const confirmFailTest = () => {
    let messageObj = {
      primaryButtonLabel: "Review Needed",
      primaryButtonAction: () => {
        configReviewApproval();
      },
      secondaryButtonLabel: "Cancel",
      secondaryButtonAction: () => { },
      title: CONFIRM,
      message: CONFIG_REVIEW_CONFIRM,
    };
    dispatch(showMessageDialog(messageObj));
  };

  const confirmPassTest = () => {
    let messageObj = {
      primaryButtonLabel: "Validate",
      primaryButtonAction: () => {
        validateControl();
      },
      secondaryButtonLabel: "Cancel",
      secondaryButtonAction: () => { },
      title: READY_TO_VALIDATE,
      message: VALIDATE_CONFIRM,
    };
    dispatch(showMessageDialog(messageObj));
  };

  const closeAddClientFieldDialog = () => {
    setFieldOpen(false);
  };
  const closeReviewDialog = () => {
    setReviewDialogOpen(false);
  };


  const openAddClientFieldDialog = () => {
    setFieldOpen(true);
  };
  const openReviewDialog = (review) => {
    setReviewStatus(review);
    setReviewDialogOpen(true);
  };
  useEffect(() => {
    if (clientId) dispatch(fetchClientById(clientId));
  }, [dispatch, clientId]);
  useEffect(() => {

    dispatch(
      fetchClientComponentById(
        submoduleVersionId,
        submoduleId2 === submoduleVersionId ? startIndex : DEFAULT_START_INDEX,
        pageSize
      )
    );
  }, [dispatch, submoduleVersionId]);

  useEffect(() => {
    if (ClientComponentData && ClientComponentData.length > 0 && loggedInUserData.user_type === "CLIENT") {
      let data = ClientComponentData.filter((row) => (row.statusDialog === "AWAITING_SIGN_OFF" || row.statusDialog === "RETRACT" || row.statusDialog === "CLIENT_REVIEW_NEEDED"));
      data.length > 0 ? setAllDisabled(false) : setAllDisabled(true);
    }
    else if (ClientComponentData && ClientComponentData.length > 0 && roles?.indexOf("Product User Access") !== -1) {
      let data = ClientComponentData.filter((row) => (row.statusDialog === "SIGN_OFF" || row.statusDialog === "PRODUCT_REVIEW_NEEDED"));
      data.length > 0 ? setAllDisabled(false) : setAllDisabled(true);
    }
    else if (ClientComponentData && ClientComponentData.length > 0 && roles?.indexOf("Configuration User Access") !== -1) {
      let data = ClientComponentData.filter((row) => (row.statusDialog === "CONFIG_REVIEW_NEEDED"));
      data.length > 0 ? setAllDisabled(false) : setAllDisabled(true);
    }
    else if (ClientComponentData && ClientComponentData.length > 0 && roles?.indexOf("QA User Access") !== -1) {
      let data = ClientComponentData.filter((row) => (row.statusDialog === "CONFIGURED" || row.statusDialog === "APPROVED"));
      data.length > 0 ? setAllDisabled(false) : setAllDisabled(true);
    }
    else {
      setAllDisabled(true)
    }

  }, [ClientComponentData, loggedInUserData, roles]);

  useEffect(() => {
    if (bulkUpdate) {
      dispatch(
        fetchClientComponentById(submoduleVersionId, startIndex, pageSize)
      );
      dispatch(fetchClientSingleModuleAnalytics(moduleVersionId, clientId));
      setChecked([]);
      setAllChecked(false);
      setIsSignoffDisable(true);
      setIsReviewNeededDisable(true);
      setIsApproveDisable(true);
      setIsProdReviewDisable(true);
      setIsManConfigDisable(true);
      setIsQAPASSFAILDisable(true);
    }
  }, [dispatch, submoduleVersionId, bulkUpdate, pageSize, startIndex, clientId, moduleVersionId]);

  useEffect(() => {
    //console.log("check:", submoduleId, moduleVersionId);
    dispatch(updateEntityId(clientId));
    //dispatch(fetchMasterControl());
    //dispatch(fetchClientSubmoduleById(submoduleId, moduleVersionId));
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
    moduleVersionId,
    submoduleId,
    loggedInUserData.user_type,
  ]);

  useEffect(() => {
    if (oobControlIdError || oobSubmoduleError)
      setApiError(
        handleIndividualClientFieldsError(oobControlIdError, oobSubmoduleError)
      );
    else setApiError(false);
  }, [oobControlIdError, oobSubmoduleError]);

  useEffect(() => {
    let data = [],
      cols = [];
    const mapFieldData = clientSubmoduleData?.ClientComponent
      ? clientSubmoduleData.ClientComponent.mapField
      : clientSubmoduleData?.systemTable
        ? clientSubmoduleData.systemTable.mapField
        : [];

    if (clientSubmoduleData?.ClientComponent) {
      data = JSON.parse(mapFieldData).filter((item) =>
        item.visibility !== undefined ? item.visibility : item
      );
      let primary = data.find(
        (item) => item.primary === true || item.mapReference === true
      );
      !!primary?.mapObject?.columnName ? setAddNewActive(true) : setAddNewActive(false)
      setPrimaryColumn(primary?.label ? primary.label : primary?.mapObject.columnName);
      cols = data.map((item) => {
        return {
          id: item.label ? item.label : item.mapObject.columnName,
          label: item.label ? item.label : item.mapLable,
          fieldType: item.fieldType,
          primary: item.primary ? item.primary : item.mapReference,
        };
      });

      cols.push({ id: "fieldOob", label: "OOB" });
      cols.push({ id: "status", label: "Status" });
      if (cols.length > 0) {
        setColumnData(cols);
      }
      if (data.length > 0) {
        setFieldData(data);

      }
    }
  }, [clientSubmoduleData]);

  useEffect(() => {
    if (isComponentAdded || isComponentDeleted) {
      closeAddClientFieldDialog();
      dispatch({ type: SET_DEFAULT_STARTINDEX });
      dispatch(
        fetchClientComponentById(
          submoduleVersionId,
          DEFAULT_START_INDEX,
          DEFAULT_PAGE_SIZE
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isComponentAdded, isComponentDeleted]);


  var column = columnData?.map(a => a.id)
  ClientComponentData?.map((item, i) => (
    column.map(col => (
      (Object.keys(item).indexOf(col) === -1) ? (ClientComponentData[i][col] = "") : null
    ))
  ))
  return (
    <MatContainer >
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
        <>
          {history.location.state === "DashBoard" && (
            <BreadcrumbView options={BreadcrumbDataDashboard}></BreadcrumbView>
          )}
          {history.location.state === "cDash" && (
            <BreadcrumbView options={BreadcrumbDataClientDash}></BreadcrumbView>
          )}
          {history.location.state === "Modules" && (
            <BreadcrumbView options={BreadcrumbData}></BreadcrumbView>
          )}
          {/* <BreadcrumbView options={BreadcrumbData}></BreadcrumbView> */}
          {/* below code need to uncomment after issue fixes of dashboard-controller apis */}
          <div className={styles.analyticsContainer}>
            <IndividualModuleAnalytics
              title={`${submoduleData && submoduleData} Progress`}
              analyticsData={singleSubmoduleAnalytics}
            />
          </div>
          <PageHeading
            heading={submoduleData && submoduleData}
            action={
              <Grid container style={{ width: "auto" }}>
                <Search
                  handleChange={handleChange}
                  handleKeyPress={handleKeyPress}
                  handleSearch={handleSearch}
                />
                <Grid item style={{ display: "flex", alignItems: "center" }}>
                  {
                    addNewActive &&
                    //loggedInInfo.user_type !== "MHK" &&
                    (featuresAssigned.indexOf(UPDATE_CLIENT_FIELD_ACTION) !== -1 && !clientInfo?.isDeleted && clientInfo?.clientStatus !== 1) &&
                    (
                      <MatButton onClick={openAddClientFieldDialog}>Add New</MatButton>
                    )}
                </Grid>
              </Grid>

            }
          />
          {ClientComponentData?.length > 0 && columnData?.length > 0 ? (
            <MatCard>
              <div >
                {(!clientInfo?.isDeleted && clientInfo?.clientStatus !== 1) &&
                  <CardHeader
                    action={
                      <>


                        {roles.indexOf("Configuration User Access") !== -1 &&
                          featuresAssigned.indexOf(
                            FIELD_MANUALLY_CONFIGURED_ACTION
                          ) !== -1 && (
                            <MatButton
                              className={styles.button}
                              disabled={isManConfigDisable}
                              onClick={confirmConfigureControl}
                            >
                              Manually Configured
                            </MatButton>
                          )}

                        {(roles.indexOf("Configuration User Access") !== -1 ||
                          loggedInUserData.user_type === "CLIENT") &&
                          featuresAssigned.indexOf(FIELD_REVIEW_ACTION) !== -1 && (
                            <MatButton
                              className={styles.button}
                              disabled={isReviewNeededDisable}
                              onClick={() =>
                                openReviewDialog("PRODUCT_REVIEW_NEEDED")
                              }
                            >
                              Review Needed
                            </MatButton>
                          )}

                        {roles.indexOf("Configuration User Access") !== -1 &&
                          featuresAssigned.indexOf(
                            FIELD_MANUALLY_CONFIGURED_ACTION
                          ) !== -1 && (
                            <MatButton
                              className={styles.button}
                              disabled={isManConfigDisable}
                              onClick={confirmRetryControl}
                            >
                              Retry
                            </MatButton>
                          )}

                        {roles.indexOf("QA User Access") !== -1 &&
                          featuresAssigned.indexOf(FIELD_QA_PASSFAIL_ACTION) !==
                          -1 && (
                            <>
                              <MatButton
                                className={styles.button}
                                disabled={isReviewNeededDisable}
                                onClick={() =>
                                  openReviewDialog("CONFIG_REVIEW_NEEDED")
                                }
                              >
                                Review Needed
                              </MatButton>
                              <MatButton
                                className={styles.button}
                                disabled={isQAPASSFAILDisable}
                                onClick={confirmFailTest}
                              >
                                Fail
                              </MatButton>
                              <MatButton
                                className={styles.button}
                                disabled={isQAPASSFAILDisable}
                                onClick={confirmPassTest}
                              >
                                Pass
                              </MatButton>
                            </>
                          )}

                        {roles.indexOf("Product User Access") !== -1 &&
                          featuresAssigned.indexOf(FIELD_REVIEW_ACTION) !== -1 && (
                            <MatButton
                              disabled={isProdReviewDisable}
                              style={{ marginLeft: "10px" }}
                              type="button"
                              onClick={openProductReviewDialog}
                            >
                              Review Needed
                            </MatButton>
                          )}
                        {roles.indexOf("Product User Access") !== -1 &&
                          featuresAssigned.indexOf(FIELD_APPROVE_ACTION) !== -1 && (
                            <MatButton
                              disabled={isApproveDisable}
                              style={{ marginLeft: "10px" }}
                              type="button"
                              onClick={confirmApproveControl}
                            >
                              Approve
                            </MatButton>
                          )}

                        {/* {loggedInUserData.user_type === "CLIENT" && featuresAssigned.indexOf(FIELD_REVIEW_ACTION) !== -1 && 
                                <MatButton disabled={isApproveDisable} style={{ marginLeft: "10px" }} type="button" onClick={confirmReviewApproval}>Review Needed</MatButton>} */}
                        {loggedInUserData.user_type === "CLIENT" &&
                          featuresAssigned.indexOf(FIELD_SIGN_OFF_ACTION) !==
                          -1 && (
                            <MatButton
                              disabled={isSignoffDisable}
                              style={{ marginLeft: "10px" }}
                              type="button"
                              onClick={confirmSignOffControl}
                            >
                              Sign Off
                            </MatButton>
                          )}
                      </>
                    }
                  />
                }


                <DataTable
                  //key={Math.random()}
                  //cols={getTableCol()}
                  cols={columnData}
                  rows={ClientComponentData}
                  config={tableConfig}
                  checkedStatus={checked}
                  allCheckedStatus={allChecked}
                  allCheckedDisabled={allDisabled}
                  resetPagination={reset}
                  updateCheckedStatus={handleChecked}
                  totalElements={totalElements}
                  startIndex={startIndex}
                  handleNextPage={handlePageChange}
                />
              </div>
            </MatCard>
          ) : (
            <MatCard>
              <CardContent className={styles.noDataCard}>
                <Typography variant="h5">{NO_RECORDS_MESSAGE}</Typography>
              </CardContent>
            </MatCard>
          )}
          {open && (
            <BulkProductReview
              checked={checked}
              handleClose={closeProductReviewDialog}
              open={open}
            />
          )}
          {fieldOpen && fieldData && (
            <AddClientField
              open={fieldOpen}
              colData={fieldData}
              handleClose={closeAddClientFieldDialog}
            />
          )}
          {reviewDialogOpen && (
            <ReviewNeededPopup
              clientControlData={checked}
              handleClose={closeReviewDialog}
              status={reviewStatus}
              open={reviewDialogOpen}
              bulk={true}
            />
          )}
        </>
      )}
    </MatContainer>
  );
};

export default IndividualClientFields;
