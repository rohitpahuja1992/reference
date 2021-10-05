import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";

import MatCard from "../../components/MaterialUi/MatCard";
import MatButton from "../../components/MaterialUi/MatButton";
import PageHeading from "../../components/PageHeading";
import DataTable from "../../components/DataTable";
import AddModule from "../../components/ManageAppSettings/AddModule";
import UpdateModule from "../../components/UpdateModule";
import MatInputField from "../../components/MaterialUi/MatInputField";
import Chip from "@material-ui/core/Chip";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from "@material-ui/icons/Visibility";
//import ModuleIcon from "../../assets/images/module-icon.svg";
import { CardContent } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";

import { showMessageDialog } from "../../actions/MessageDialogActions";
import {
  deleteModule,
  setUpdate,
  fetchModule,
  resetDuplicateError,
} from "../../actions/ModuleActions";
import { formatDate } from "../../utils/helpers";
import {
  ADD_NEW_MOD,
  COMMON_ERROR_MESSAGE,
  termModuleMessage,
  CONFIRM,
  MASTER_MODULE,
  NO_RECORDS_MESSAGE,
  SEARCH_FILTER,
  TERM_MODULE,
  UPDATE_MODULE,
  VIEW_DETAILS,
} from "../../utils/Messages";

const useStyles = makeStyles((theme) => ({
  col: {
    paddingRight: "10px",
  },
  error: {
    paddingRight: "10px",
    paddingTop: "10px",
  },
  filterDropdown: {
    paddingLeft: "10px",
    paddingRight: "10px",
    minWidth: "200px",
  },
  noDataCard: {
    minHeight: "200px",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
  errorCard: {
    background: theme.palette.error.main,
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

const cols = [
  { id: "moduleName", label: "Module Name" },
  { id: "status", label: "Status" },
  { id: "createdBy", label: "Created By" },
  { id: "createdAt", label: "Created Date", minWidth: 120 },
  //{ id: 'description', label: 'Description', width: '35%' }
];

const searchFilter = [
  { id: "name", label: "Module Name" },
  { id: "searchstatus", label: "Status" },
  { id: "searchcreatedBy", label: "Created By" },
];

const Modules = () => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  //const [apiError, setApiError] = useState(false);
  const [openUpdate, setOpenUpdate] = React.useState(false);
  const [selectedMenu, setSelectedMenu] = React.useState("");
  const [selectedData, setSelectedData] = React.useState({});
  const getApiError = useSelector((state) => state.Module.getError);
  const isModuleAdded = useSelector((state) => state.Module.isModuleAdded);
  const isModuleUpdated = useSelector((state) => state.Module.isModuleUpdated);
  const isModuleDeleted = useSelector((state) => state.Module.isModuleDeleted);
  //const moduleData = useSelector((state) => state.Module.moduleDetailsList);
  //const filterList = useSelector((state) =>
  //  state.User.data.list.filter(obj => !obj.is_deleted && obj.status === 'ACTIVE'));
  //const usersList = filterList.sort((a, b) => a.firstName > b.firstName ? 1 : -1);
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
    searchstatus: "Search by Status...",
    searchcreatedBy: "Search by User...",
  };

  const handleModuleStatusLabel = (details) => {
    if (details.deleted) {
      return "TERMINATED";
    } else return details.status;
  };

  const handleModuleStatusClass = (status) => {
    if (status === "TERMINATED") {
      return styles.statusTerminated;
    } else if (status === "INACTIVE") {
      return styles.statusInactive;
    } else {
      return styles.statusActive;
    }
  };
  const moduleDetailsList = useSelector((state) =>
    state.Module.moduleDetailsList.list
      .filter((data) => {
        if (!searchBy || !search || search === "All") return data;

        if (searchBy && search) {
          let filterData = {
            name: data.moduleName,
            searchcreatedBy: data.createdByUser,
            searchstatus: data.deleted ? "TERMINATED" : data.status,
            //!(data.deleted) ? data.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE' : 'TERMINATED',
            ...data,
          };
          if (
            searchBy !== "searchstatus" &&
            filterData[searchBy] &&
            filterData[searchBy].toLowerCase().includes(search.toLowerCase())
          ) {
            return data;
          }
          if (
            searchBy === "searchstatus" &&
            filterData[searchBy] &&
            filterData[searchBy].toLowerCase() === search.toLowerCase()
          ) {
            return data;
          }
        }

        return false;
      })
      .map((data) => {
        let blankData = {
          moduleName: data.moduleName,
          description: data.description,
          status: (
            <div>
              {
                <Chip
                  label={handleModuleStatusLabel(data)}
                  className={handleModuleStatusClass(
                    handleModuleStatusLabel(data)
                  )}
                  color="primary"
                />
              }
            </div>
          ),
          statusDialog: handleModuleStatusLabel(data),
          createdBy: data.createdByUser,
          createdAt: formatDate(data.createdDate),
          updatedBy: data.updatedByUser,
          updatedAt: formatDate(data.updatedDate),
          id: data.id,
          deleted: data.deleted,
        };
        return { ...data, ...blankData };
      })
  );

  const openUpdateModuleDialog = (data, val) => {
    setOpenUpdate(true);
    setSelectedData(data);
    setSelectedMenu(val);
    dispatch(setUpdate(false));
  };

  const closeUpdateModuleDialog = useCallback(() => {
    setOpenUpdate(false);
    setSelectedData({});
    setSelectedMenu("");
    dispatch(resetDuplicateError());
    dispatch(setUpdate(false));
  }, [dispatch]);

  let handleSearch = (e) => {
    const { name, value } = e.target;
    if (
      name === "searchBy" &&
      (value === "name" || value === "searchcreatedBy")
    ) {
      setInputs((inputs) => ({ ...inputs, search: "" }));
    }
    if (
      name === "searchBy" &&
      value !== "name" &&
      value !== "searchcreatedBy"
    ) {
      setInputs((inputs) => ({ ...inputs, search: "All" }));
    }
    if (name === "search" && !searchBy) {
      setInputs((inputs) => ({ ...inputs, searchBy: "name" }));
    }
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };

  const tableConfig = {
    tableType: "",
    // iconType: "imgIcon",
    // iconSource: ModuleIcon,
    menuOptions: [
      {
        type: "link",
        icon: <EditIcon fontSize="small" />,
        label: UPDATE_MODULE,
        display: "Hide",
        action: (e) => openUpdateModuleDialog(e, "UPDATE"),
      },
      {
        type: "link",
        icon: <VisibilityIcon fontSize="small" />,
        label: VIEW_DETAILS,
        action: (e) => openUpdateModuleDialog(e, "VIEW"),
      },
      {
        type: "link",
        icon: <DeleteIcon fontSize="small" />,
        label: TERM_MODULE,
        display: "Hide",
        action: (e) => {
          openConfirmDeleteDialog(e);
        },
      },
    ],
  };

  const openManageModuleDialog = () => {
    setOpen(true);
  };

  const closeManageModuleDialog = useCallback(() => {
    dispatch(resetDuplicateError());
    setOpen(false);
  }, [dispatch]);

  const openConfirmDeleteDialog = (e) => {
    let messageObj = {
      primaryButtonLabel: "Yes",
      primaryButtonAction: () => {
        dispatch(deleteModule(e.id, e.moduleName));
      },
      secondaryButtonLabel: "No",
      secondaryButtonAction: () => {},
      title: CONFIRM,
      message: termModuleMessage(e.moduleName),
    };
    dispatch(showMessageDialog(messageObj));
  };

  useEffect(() => {
    if (isModuleAdded) {
      dispatch(fetchModule());
      closeManageModuleDialog();
    }
  }, [dispatch, isModuleAdded, closeManageModuleDialog]);

  useEffect(() => {
    if (isModuleUpdated) {
      dispatch(fetchModule());
      closeUpdateModuleDialog();
    }
  }, [dispatch, isModuleUpdated, closeUpdateModuleDialog]);

  useEffect(() => {
    if (isModuleDeleted) {
      dispatch(fetchModule());
    }
  }, [dispatch, isModuleDeleted]);

  return (
    <>
      <PageHeading
        heading={MASTER_MODULE}
        action={
          <Grid container style={{ width: "auto" }}>
            <Grid item className={styles.filterDropdown}>
              <MatInputField
                select
                onChange={handleSearch}
                label={SEARCH_FILTER}
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
            {(!searchBy ||
              searchBy === "name" ||
              searchBy === "searchcreatedBy") && (
              <Grid item className={styles.col}>
                <MatInputField
                  value={search}
                  label={searchFieldLabel[searchBy]}
                  onChange={handleSearch}
                  name="search"
                />
              </Grid>
            )}
            {searchBy && searchBy !== "name" && searchBy !== "searchcreatedBy" && (
              <Grid item className={styles.filterDropdown}>
                <MatInputField
                  select
                  onChange={handleSearch}
                  label={searchFieldLabel[searchBy]}
                  name="search"
                  value={search}
                >
                  <MenuItem value="All">All</MenuItem>
                  {/* {searchBy === "searchcreatedBy" &&
                    usersList.map((user, index) => (
                      <MenuItem
                        key={index}
                        value={user.firstName + " " + user.lastName}
                      >
                        {user.firstName + " " + user.lastName}
                      </MenuItem>
                    ))} */}
                  {searchBy === "searchstatus" &&
                    statusList.map((status) => (
                      <MenuItem key={status.id} value={status.id}>
                        {status.value}
                      </MenuItem>
                    ))}
                </MatInputField>
              </Grid>
            )}
            <Grid item style={{ display: "flex", alignItems: "center" }}>
              <MatButton onClick={openManageModuleDialog}>
                {ADD_NEW_MOD}
              </MatButton>
            </Grid>
          </Grid>
        }
      />
      {getApiError ? (
        <Grid item xs={12} className={styles.error}>
          <Card className={styles.errorCard}>
            <Typography variant="body2">{COMMON_ERROR_MESSAGE}</Typography>
          </Card>
        </Grid>
      ) : moduleDetailsList.length ? (
        <MatCard>
          <DataTable
            cols={cols}
            rows={moduleDetailsList}
            config={tableConfig}
          />
        </MatCard>
      ) : (
        <MatCard>
          <CardContent className={styles.noDataCard}>
            <Typography variant="h5">{NO_RECORDS_MESSAGE}</Typography>
          </CardContent>
        </MatCard>
      )}
      <AddModule handleClose={closeManageModuleDialog} open={open} />
      <UpdateModule
        handleClose={closeUpdateModuleDialog}
        open={openUpdate}
        data={selectedData}
        selectedMenu={selectedMenu}
      />
    </>
  );
};

export default Modules;
