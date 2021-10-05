import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { makeStyles } from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import { CardContent } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import MatInputField from "../../components/MaterialUi/MatInputField";
import MenuItem from "@material-ui/core/MenuItem";
import ListSubheader from "@material-ui/core/ListSubheader";

import MatButton from "../../components/MaterialUi/MatButton";
import MatCard from "../../components/MaterialUi/MatCard";
import MatContainer from "../../components/MaterialUi/MatContainer";
import ManageClient from "../../components/ManageClient";
import PageHeading from "../../components/PageHeading";
import DataTable from "../../components/DataTable";
//import MatInputField from "../../components/MaterialUi/MatInputField";
import TableCellShowMore from "../../components/TableCellShowMore";
import Search from "../../components/Search";
import {
  NO_RECORDS_MESSAGE,
  CLIENT_NAME,
  CONFIRM,
  CODE_VERSION,
  TERM_CLI,
  MODULES,
  handleClientListError,
  TERM_CLIENT_MSG,
  REL_MANAGER,
  VIEW_UPDATE,
  STATUS,
} from "../../utils/Messages";

import { showMessageDialog } from "../../actions/MessageDialogActions";
import {
  deleteClient,
  addClientModules,
  //saveClientInfo,
  addClientProfile,
  resetClientInfo,
  //resetAddError,
  fetchClientsProfile,
} from "../../actions/ClientActions";
import { fetchClientUsage } from "../../actions/DashboardActions";
import {
  fetchOOBModule,
  fetchGlobalModule,
} from "../../actions/OOBModuleActions";
import { fetchCodeVersion } from "../../actions/CodeVersionActions";
import { fetchUsers } from "../../actions/UserActions";
import { updateHeaderTitle } from "../../actions/AppHeaderActions";
import { updateEntityId } from "../../actions/AppHeaderActions";
//import ArchiveIcon from "@material-ui/icons/Archive";
import RateReviewIcon from "@material-ui/icons/RateReview";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
//import VisibilityIcon from "@material-ui/icons/Visibility";
// import { uploadHierarchy } from "../../actions/ClientHierarchyActions";
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_START_INDEX,
  RESET_HIERARCHY_ERROR,
} from "../../utils/AppConstants";
import { ADD_CLIENT, TERM_CLIENT } from "../../utils/FeatureConstants";
import CustomProgressCircular from "../../components/CustomProgressCircular";

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
  search: {
    paddingRight: "10px",
    minWidth: "300px",
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
  statusTerminated: {
    background: theme.palette.error.main,
  },
}));

const cols = [
  { id: "clientName", label: CLIENT_NAME },
  { id: "version", label: CODE_VERSION },
  { id: "clientModules", label: MODULES, isSorting: false },
  { id: "relationshipManager", label: REL_MANAGER },
  { id: "completion", label: "Completion" },
  { id: "awaitingSignOff", label: "Awaiting Sign-Off" },
  { id: "signedOff", label: "Signed Off" },
  { id: "status", label: STATUS },
];

const searchFilter = [
  { id: "clientName", label: "Client Name" },
  { id: "codeversion", label: "Code Version" },
  { id: "module", label: "Module" },
  { id: "RM", label: "Relationship Manager" },
  { id: "status", label: "Status" },
];

const ClientList = () => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  // const [fileInput, setFileInput] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [popUpAnchorEl, setPopUpAnchorEl] = useState(null);
  const [popUpOptions, setPopUpOptions] = useState(null);
  const [popUpFieldKey, setPopUpFieldKey] = useState("");
  const [popUpNestedFieldKey, setPopUpNestedFieldKey] = useState("");
  const [searchText, setSearchText] = useState("");
  const isPopUpOpen = Boolean(popUpAnchorEl);
  const [apiError, setApiError] = useState(null);
  const featuresAssigned = useSelector((state) => state.User.features);
  const totalElements = useSelector(
    (state) => state.Client.clientDetailsList.totalElements
  );
  const startIndex = useSelector((state) => state.Client.page.startIndex || 0);

  const pageSize = useSelector((state) => state.Client.page.pageSize);
  const clientUsage = useSelector((state) => state.Dashboard.clientUsageData);

  const [inputs, setInputs] = useState({
    searchBy: "",
    search: "",
  });
  const { searchBy, search } = inputs;

  const statusList = [
    { id: "ACTIVE", value: "ACTIVE" },
    { id: "INACTIVE", value: "INACTIVE" },
    { id: "TERMINATED", value: "TERMINATED" },
  ];

  const searchFieldLabel = {
    "": "Search...",
    name: "Search by Name...",
    version: "Search by Version...",
    module: "Select Module",
    manager: "Search by Manager...",
    status: "Select Status",
  };

  const handlePopUpClick = (event, data, fieldKey, nestedFieldKey) => {
    setPopUpFieldKey(fieldKey);
    setPopUpOptions(data);
    setPopUpAnchorEl(event.currentTarget);
    setPopUpNestedFieldKey(nestedFieldKey);
  };

  const handlePopUpClose = () => {
    setPopUpAnchorEl(null);
  };

  // let handleSearch = (e) => {
  //   const { name, value } = e.target;
  //   if (name === "searchBy" && (value === "name" || value === "manager")) {
  //     setInputs((inputs) => ({ ...inputs, search: "" }));
  //   }
  //   if (name === "searchBy" && value !== "name" && value !== "manager") {
  //     setInputs((inputs) => ({ ...inputs, search: "All" }));
  //   }
  //   if (name === "search" && !searchBy) {
  //     setInputs((inputs) => ({ ...inputs, searchBy: "name" }));
  //   }
  //   setInputs((inputs) => ({ ...inputs, [name]: value }));
  // };

  const handleClientStatusLabel = (details) => {
    if (details.isDeleted) {
      return "TERMINATED";
    } else if (details.clientStatus) {
      return "INACTIVE";
    } else {
      return "ACTIVE";
    }
  };

  const handleClientStatusClass = (status) => {
    if (status === "TERMINATED") {
      return styles.statusTerminated;
    } else if (status === "INACTIVE") {
      return styles.statusInactive;
    } else {
      return styles.statusActive;
    }
  };
  const getApiError = useSelector((state) => state.Client.getError);
  const addApiError = useSelector((state) => state.Client.addInfoError);
  const totalOOBModuleList = useSelector(
    (state) =>
      state.OOBModule.OOBModuleDetailsList.data &&
      state.OOBModule.OOBModuleDetailsList.data
    // state.OOBModule.OOBModuleDetailsList.data.filter(
    //   (obj) => !obj.deleted && obj.status === "ACTIVE"
    // )
  );
  const totalGlobalModuleList = useSelector(
    (state) =>
      state.OOBModule.GlobalModuleDetailsList.data &&
      state.OOBModule.GlobalModuleDetailsList.data
  );
  const totalModuleList = [...totalOOBModuleList, ...totalGlobalModuleList];
  const moduleList = totalModuleList.sort((a, b) =>
    a.module.moduleName > b.module.moduleName ? 1 : -1
  );
  const totalCodeVersionList = useSelector(
    (state) =>
      state.CodeVersion.codeVersionDetailsList.list &&
      state.CodeVersion.codeVersionDetailsList.list.filter(
        (obj) => !obj.deleted
      )
  );
  const codeVersionList = totalCodeVersionList?.sort((a, b) =>
    a.codeVersion > b.codeVersion ? 1 : -1
  );
  //const managerList = useSelector(state => state.User.data.list && state.User.data.list.filter(obj => obj.user_type === 'MHK'));
  const isClientInfoAdded = useSelector(
    (state) => state.Client.isClientInfoAdded
  );
  // const isClientModuleAdded = useSelector(
  //   (state) => state.Client.isClientModuleAdded
  // );
  const isClientDeleted = useSelector((state) => state.Client.isClientDeleted);
  const addedClientId = useSelector((state) => state.Client.addedClientId);
  // const uploadHierarchyDetails = useSelector(
  //   (state) => state.ClientHierarchy.uploadHierarchy
  // );
  // const clientDetails = useSelector(
  //   (state) => state.Client.clientDetailsList.list
  // );
  //const clientSavedInfo = useSelector((state) => state.Client.clientInfo);
  const clientDetailsList = useSelector((state) =>
    state.Client.clientDetailsList.list
      .map((data) => {
        let filterData = clientUsage.filter(item => item.client_id === data.id);
        let blankData = {
          id: data.id,
          status: (
            <div>
              {
                <Chip
                  label={handleClientStatusLabel(data)}
                  className={handleClientStatusClass(
                    handleClientStatusLabel(data)
                  )}
                  color="primary"
                />
              }
            </div>
          ),
          statusDialog: handleClientStatusLabel(data),
          clientName: data.clientName,
          version: data.codeVersion && data.codeVersion.codeVersion,
          clientModules: data.modules && (
            <div>
              {data.modules.map(
                (module, index) =>
                  index < 2 && (
                    <Chip
                      style={{ margin: "2px" }}
                      key={index}
                      label={module.module.moduleName}
                    />
                  )
              )}
              {data.modules.length > 2 && (
                <Chip
                  className={styles.moreChip}
                  icon={<MoreHorizIcon />}
                  onClick={(e) =>
                    handlePopUpClick(e, data.modules, "module", "moduleName")
                  }
                />
              )}
            </div>
          ),
          completion: filterData.length > 0 && (
            <div style={{ marginBottom: "-4px", paddingTop: "2px" }}>
              <CustomProgressCircular
                value={parseFloat((filterData[0].completion / filterData[0].controls) * 100).toFixed(0)}
                size={46}
                thickness={4}
                valueTextVariant="caption"
                align="start"
                colorName="greenMain"
              />
            </div>
          ),
          awaitingSignOff: filterData.length > 0 && (
            <div style={{ marginBottom: "-4px", paddingTop: "2px" }}>
              <CustomProgressCircular
                value={parseFloat((filterData[0].awaiting_sign_off / filterData[0].controls) * 100).toFixed(0)}
                size={46}
                thickness={4}
                valueTextVariant="caption"
                align="start"
                colorName="yellowMain"
              />
            </div>
          ),
          signedOff: filterData.length > 0 && (
            <div style={{ marginBottom: "-4px", paddingTop: "2px" }}>
              <CustomProgressCircular
                value={parseFloat((filterData[0].sign_off / filterData[0].controls) * 100).toFixed(0)}
                size={46}
                thickness={4}
                valueTextVariant="caption"
                align="start"
                colorName="blueMain"
              />
            </div>
          ),
          relationshipManager:
            data.relationshipManager &&
            data.relationshipManager.firstName +
            " " +
            data.relationshipManager.lastName,
          deleted: data.isDeleted ? true : false,
        };
        return { ...data, ...blankData };
      })
  );

  const tableConfig = {
    tableType: "",
    selectAction: true,
    paginationOption: "custom",
    menuOptions: featuresAssigned.indexOf(TERM_CLIENT) !== -1 && [
      {
        type: "link",
        icon: <RateReviewIcon fontSize="small" />,
        label: VIEW_UPDATE,
        action: (e) => openClientProfile(e),
      },
      {
        type: "link",
        icon: <DeleteIcon fontSize="small" />,
        label: TERM_CLI,
        display: "Hide",
        action: (e) => {
          openConfirmDeleteDialog(e);
        },
      },
    ],
    actions: {
      icon: <RateReviewIcon color="primary" fontSize="small" />,
      tooltipText: VIEW_UPDATE,
      action: (e) => openClientProfile(e),
    },
  };

  const openConfirmDeleteDialog = (e) => {
    let messageObj = {
      primaryButtonLabel: "Yes",
      primaryButtonAction: () => {
        dispatch(deleteClient(e.id, e.clientName));
      },
      secondaryButtonLabel: "No",
      secondaryButtonAction: () => { },
      title: CONFIRM,
      message: TERM_CLIENT_MSG + e.clientName + "?",
    };
    dispatch(showMessageDialog(messageObj));
  };

  const openClientProfile = (e) => {
    dispatch(updateEntityId(e.id));
    history.push(`/client/dashboard/${e.id}`);
  };

  const openManageClientDialog = () => {
    setOpen(true)
    setActiveTab(0);
  };

  const closeManageClientDialog = useCallback(() => {
    dispatch(resetClientInfo());
    dispatch(fetchClientsProfile(DEFAULT_START_INDEX, pageSize, searchText));
    setOpen(false);
  }, [dispatch, pageSize, searchText]);

  const handleNextManageClientDialog = (inputs) => {
    dispatch(addClientProfile(inputs));
    closeManageClientDialog();
    // dispatch(saveClientInfo(clientSavedInfo, inputs));
    // setActiveTab((prevState) => prevState + 1);
  };
  const handleAssignManageClientDialog = (inputs) => {
    dispatch(addClientModules(inputs, 'update'));
    // dispatch(saveClientInfo(clientSavedInfo, inputs));
    // setActiveTab((prevState) => prevState + 1);
  };

  // const handleFileUploadManageClientDialog = (files) => {
  //   if (files) {
  //     setIsDisabled(false);
  //     setFileInput(files);
  //   } else {
  //     setIsDisabled(true);
  //     dispatch({ type: RESET_HIERARCHY_ERROR });
  //     setFileInput("");
  //     //setApiError(null);
  //   }
  // };

  const handleSubmitManageClientDialog = () => {
    setIsDisabled(true);
    closeManageClientDialog();
    //dispatch(uploadHierarchy(fileInput, addedClientId));
  };

  let handleFilter = (e) => {
    const { name, value } = e.target;
    if (name === "searchBy" && (value === "clientName" || value === "RM")) {
      setSearchText("");
      setInputs((inputs) => ({ ...inputs, search: "" }));
    }
    if (name === "searchBy" && value !== "clientName" && value !== "RM") {
      setSearchText("");
      setInputs((inputs) => ({ ...inputs, search: "All" }));
    }
    if (name === "search" && !searchBy) {
      setInputs((inputs) => ({ ...inputs, searchBy: "clientName" }));
    }
    if (name === "search" && value !== "All") {
      setSearchText(value);
      dispatch(
        fetchClientsProfile(
          DEFAULT_START_INDEX,
          pageSize,
          value,
          inputs.searchBy
        )
      );
    }
    if ((name === "search" && value === "All") || name === "searchBy") {
      dispatch(fetchClientsProfile(DEFAULT_START_INDEX, pageSize));
    }
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };

  const handleChange = (e) => {
    setSearchText(e.target.value);
    if (e.target.value === "")
      dispatch(fetchClientsProfile(DEFAULT_START_INDEX, pageSize));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSearch = () => {
    if (searchText !== "")
      dispatch(
        fetchClientsProfile(
          DEFAULT_START_INDEX,
          pageSize,
          searchText,
          inputs.searchBy
        )
      );
  };
  const handlePageChange = (start, size) => {
    if (searchText === "" || searchText === "All")
      dispatch(fetchClientsProfile(start, size));
    else
      dispatch(fetchClientsProfile(start, size, searchText, inputs.searchBy));
  };
  // const handleBackManageClientDialog = () => {
  //   dispatch(resetAddError());
  //   setActiveTab((prevState) => prevState - 1);
  // };

  useEffect(() => {
    dispatch(updateHeaderTitle("Clients"));
    dispatch(fetchOOBModule("oob"));
    dispatch(fetchGlobalModule());
    dispatch(fetchCodeVersion());
    dispatch(fetchUsers("", "", "", "", "name"));
    dispatch(fetchClientsProfile(startIndex, pageSize));
    dispatch(fetchClientUsage());
  }, [dispatch]);

  useEffect(() => {
    if (isClientInfoAdded) {
      // setActiveTab((prevState) => prevState + 1);
      dispatch(resetClientInfo());
      dispatch(fetchClientsProfile(DEFAULT_START_INDEX, pageSize, searchText));
    }
  }, [isClientInfoAdded]);

  // useEffect(() => {
  //   if (isClientModuleAdded) {
  //     setActiveTab((prevState) => prevState + 1);
  //   }
  // }, [isClientModuleAdded]);

  const handleActiveTab = (value) => {
    setActiveTab(value);
  }

  useEffect(() => {
    if (addApiError) {
      setIsDisabled(false);
      //setApiError(COMMON_ERROR_MESSAGE);
    }

    // if (uploadHierarchyDetails.isDone) {
    //   dispatch({ type: RESET_HIERARCHY_ERROR });
    //   closeManageClientDialog();
    // }
    if (isClientDeleted) {
      dispatch(fetchClientsProfile(startIndex, pageSize, searchText));
    }
  }, [dispatch,
    closeManageClientDialog,
    addApiError,
    isClientDeleted,
    pageSize,
    searchText,
    startIndex,
    //uploadHierarchyDetails.isDone
  ]);

  useEffect(() => {
    if (getApiError) {
      setApiError(handleClientListError(getApiError));
    }
    else
      setApiError(false);
  }, [getApiError]);

  return (
    <MatContainer>
      <PageHeading
        action={
          <Grid container style={{ width: "auto" }}>
            <Grid item className={styles.filterDropdown}>
              <MatInputField
                select
                onChange={handleFilter}
                label="Search or Filter By"
                name="searchBy"
                value={searchBy}
              >
                {searchFilter.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.label}
                  </MenuItem>
                ))}
              </MatInputField>
            </Grid>
            {searchBy && searchBy !== "clientName" && searchBy !== "RM" && (
              <Grid item className={styles.search}>
                <MatInputField
                  select
                  onChange={handleFilter}
                  label={searchFieldLabel[searchBy]}
                  name="search"
                  value={search}
                >
                  <MenuItem value="All">All</MenuItem>
                  {searchBy === "codeversion" && (
                    <ListSubheader
                      disableSticky={true}
                      className={styles.disableClick}
                    >
                      Released
                    </ListSubheader>
                  )}
                  {searchBy === "codeversion" &&
                    codeVersionList
                      .filter((type) => type.type === "RELEASED")
                      .map((option, key) => (
                        <MenuItem key={option.id} value={option.codeVersion}>
                          {option.codeVersion}
                        </MenuItem>
                      ))}
                  {searchBy === "codeversion" && (
                    <ListSubheader
                      disableSticky={true}
                      className={styles.disableClick}
                    >
                      Unreleased
                    </ListSubheader>
                  )}
                  {searchBy === "codeversion" &&
                    codeVersionList
                      .filter((type) => type.type === "UNRELEASED")
                      .map((option, key) => (
                        <MenuItem key={option.id} value={option.codeVersion}>
                          {option.codeVersion}
                        </MenuItem>
                      ))}
                  {searchBy === "module" &&
                    moduleList.map((module, index) => (
                      <MenuItem
                        key={index}
                        value={module.module.moduleName}
                        disabled={!module.module.moduleName}
                      >
                        {module.module.moduleName}
                      </MenuItem>
                    ))}
                  {searchBy === "status" &&
                    statusList.map((status) => (
                      <MenuItem key={status.id} value={status.id}>
                        {status.value}
                      </MenuItem>
                    ))}
                </MatInputField>
              </Grid>
            )}
            {(!searchBy || searchBy === "clientName" || searchBy === "RM") && (
              <Search
                searchText={searchText}
                handleChange={handleChange}
                handleKeyPress={handleKeyPress}
                handleSearch={handleSearch}
              />
            )}
            {featuresAssigned.indexOf(ADD_CLIENT) !== -1 && (
              <Grid item style={{ display: "flex", alignItems: "center" }}>
                <MatButton onClick={openManageClientDialog}>
                  Add New Client
                </MatButton>
              </Grid>
            )}
          </Grid>
        }
      />
      {apiError ? (
        <Grid item xs={12} className={styles.error}>
          <Card className={apiError.messageType === "error" ? styles.errorCard : styles.warningCard}>
            <Typography variant="body2">{apiError.message}</Typography>
          </Card>
        </Grid>
      ) : clientDetailsList.length > 0 ? (
        <MatCard>
          <DataTable
            cols={cols}
            rows={clientDetailsList}
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
      {open && (
        <ManageClient
          handleClose={closeManageClientDialog}
          open={open}
          activeTab={activeTab}
          handleActiveTab={handleActiveTab}
          disabled={isDisabled}
          //apiError={apiError}
          handleNext={handleNextManageClientDialog}
          handleAssign={handleAssignManageClientDialog}
          //handleBack={handleBackManageClientDialog}
          //handleFileUpload={handleFileUploadManageClientDialog}
          handleSubmit={handleSubmitManageClientDialog}
        />
      )}
      <TableCellShowMore
        anchorEl={popUpAnchorEl}
        open={isPopUpOpen}
        onClose={handlePopUpClose}
        fieldProp={popUpFieldKey}
        nestedFieldProp={popUpNestedFieldKey}
        moreItems={1}
        options={popUpOptions}
      />
    </MatContainer>
  );
};

export default ClientList;
