import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";

import Chip from "@material-ui/core/Chip";
import Card from "@material-ui/core/Card";
import TableCellShowMore from "../../components/TableCellShowMore";
import MatButton from "../../components/MaterialUi/MatButton";
import MatCard from "../../components/MaterialUi/MatCard";
import MatContainer from "../../components/MaterialUi/MatContainer";
import AddUsers from "../../components/AddUsers";
import PageHeading from "../../components/PageHeading";
import DataTable from "../../components/DataTable";
import Search from "../../components/Search";
import { fetchUsers } from "../../actions/UserActions";
import { fetchClients } from "../../actions/ClientActions";
import { fetchRoles } from "../../actions/RoleActions";

// import EditIcon from '@material-ui/icons/Edit';
// import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from "@material-ui/icons/Visibility";
import RateReviewIcon from "@material-ui/icons/RateReview";
import {
  RESET_USER_IS_DONE,
  RESET_ADD_USER_ERROR,
  DEFAULT_START_INDEX,
  DEFAULT_PAGE_SIZE,
} from "../../utils/AppConstants";
import {
  ADD_USER,
  VIEW_USER_PROFILE,
  UPDATE_USER_PROFILE,
} from "../../utils/FeatureConstants";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import Grid from "@material-ui/core/Grid";
import MatInputField from "../../components/MaterialUi/MatInputField";
import MenuItem from "@material-ui/core/MenuItem";
import { CardContent } from "@material-ui/core";
//import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { updateHeaderTitle } from "../../actions/AppHeaderActions";
import { formatDate } from "../../utils/helpers";
import {
  NO_RECORDS_MESSAGE,
  //VIEW_UPDATE,
  USERS,
  handleUsersError,
  VIEW_PROFILE,
  VIEW_UPDATE_PROFILE,
  SEARCH_FILTER,
  //ADD_NEW_CLIENT,
} from "../../utils/Messages";

const useStyles = makeStyles((theme) => ({
  moreChip: {
    "& .MuiChip-label": {
      paddingLeft: "0px",
    },
  },
  col: {
    paddingRight: "10px",
  },
  gridCol: {
    padding: "5px 10px",
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
  { id: "name", label: "Name", width: "120px" },
  { id: "email", label: "Email" },
  //{ id: 'contact', label: 'Contact' },
  { id: "role", label: "Role", isSorting: false },
  { id: "associatedClient", label: "Associated Client", isSorting: false },
  { id: "status", label: "Status" },
  { id: "lastActiveOn", label: "Last Active On", minWidth: 120 },
];

const searchFilter = [
  { id: "email_and_name", label: "Name/Email" },
  //{ id: "email", label: "Email" },
  { id: "role", label: "Role" },
  { id: "client", label: "Associated Client", minWidth: "200px" },
  { id: "status", label: "Status" },
  //{ id: "userType", label: "User Type" },
];

const Users = () => {
  const styles = useStyles();
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [addUserKey, setAddUserKey] = React.useState(0);
  const [inputs, setInputs] = useState({
    searchBy: "email_and_name",
    search: "",
  });
  const { searchBy, search } = inputs;
  const [searchText, setSearchText] = useState("");
  const [popUpAnchorEl, setPopUpAnchorEl] = React.useState(null);
  const [popUpOptions, setPopUpOptions] = React.useState(null);
  const [popUpFieldKey, setPopUpFieldKey] = React.useState("");
  const isPopUpOpen = Boolean(popUpAnchorEl);
  const featuresAssigned = useSelector((state) => state.User.features);
  const [apiError, setApiError] = useState(null);
  const totalElements = useSelector((state) => state.User.data.totalElements);
  const startIndex = useSelector((state) => state.User.page.startIndex || 0);

  const pageSize = useSelector((state) => state.User.page.pageSize);
  const statusList = [
    { id: "ACTIVE", value: "ACTIVE" },
    { id: "INACTIVE", value: "INACTIVE" },
    { id: "TERMINATED", value: "TERMINATED" },
  ];
  // const userTypeList = [
  //   { id: "MHK", value: "MHK" },
  //   { id: "CLIENT", value: "CLIENT" },
  // ];
  const searchFieldLabel = {
    "": "Search...",
    name: "Search...",
    //email: "Search by email...",
    role: "Select Role",
    associatedClient: "Search...",
    status: "Select Status",
    //userType: "Select User Type",
  };

  const handlePopUpClick = (event, data, fieldKey) => {
    setPopUpFieldKey(fieldKey);
    setPopUpOptions(data);
    setPopUpAnchorEl(event.currentTarget);
  };

  const handlePopUpClose = () => {
    setPopUpAnchorEl(null);
  };

  let handleFilter = (e) => {
    const { name, value } = e.target;
    if (
      name === "searchBy" &&
      (value === "email_and_name" || value === "client")
    ) {
      setSearchText("");
      setInputs((inputs) => ({ ...inputs, search: "" }));
    }
    if (
      name === "searchBy" &&
      value !== "email_and_name" &&
      //value !== "email" &&
      value !== "client"
    ) {
      setSearchText("");
      setInputs((inputs) => ({ ...inputs, search: "All" }));
    }
    if (name === "search" && !searchBy) {
      setInputs((inputs) => ({ ...inputs, searchBy: "name" }));
    }
    if (name === "search" && value !== "All") {
      setSearchText(value);
      dispatch(
        fetchUsers(DEFAULT_START_INDEX, pageSize, value, inputs.searchBy)
      );
    }
    if ((name === "search" && value === "All") || name === "searchBy") {
      dispatch(fetchUsers(DEFAULT_START_INDEX, pageSize));
    }
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };

  const handleUserStatusClass = (status) => {
    if (status === "TERMINATED") {
      return styles.statusTerminated;
    } else if (status === "INACTIVE") {
      return styles.statusInactive;
    } else {
      return styles.statusActive;
    }
  };
  const fetchUserError = useSelector((state) => state.User.data.fecthError);
  // const fetchUserCalled = useSelector((state) => state.User.data.error);
  const totalRoleList = useSelector((state) => state.Role.data.list);
  const roleList = totalRoleList.sort((a, b) =>
    a.roleName > b.roleName ? 1 : -1
  );
  //const clientList = useSelector((state) => state.MhkClient.data.list);
  const usersList = useSelector((state) =>
    state.User.data.list      
      .map((data) => {
        let blankData = {
          name: data.firstName + " " + data.lastName,
          contact: data.phone_number,
          role: data.roles && (
            <div>
              {data.roles.map(
                (role, index) =>
                  index < 1 && (
                    <Chip
                      style={{ margin: "2px" }}
                      key={index}
                      label={role.roleName}
                    />
                  )
              )}
              {data.roles.length > 1 && (
                <Chip
                  className={styles.moreChip}
                  icon={<MoreHorizIcon />}
                  onClick={(e) => handlePopUpClick(e, data.roles, "roleName")}
                />
              )}
            </div>
          ),
          associatedClient: data.clients && (
            <div>
              {data.clients.map(
                (client, index) =>
                  index < 1 && (
                    <Chip
                      style={{ margin: "2px" }}
                      key={index}
                      label={client.clientName}
                    />
                  )
              )}
              {data.clients.length > 1 && (
                <Chip
                  className={styles.moreChip}
                  icon={<MoreHorizIcon />}
                  onClick={(e) =>
                    handlePopUpClick(e, data.clients, "clientName")
                  }
                />
              )}
            </div>
          ),
          status: (
            <div>
              {
                <Chip
                  label={data.status}
                  className={handleUserStatusClass(data.status)}
                  color="primary"
                />
              }
            </div>
          ),
          statusDialog: data.status,
          deleted: data.status === "TERMINATED" ? true : false,
          lastActiveOn: formatDate(data.last_login_time),
        };
        return { ...data, ...blankData };
      })
  );
  const dispatch = useDispatch();
  //const [activeTab, setActiveTab] = React.useState(0);

  const tableConfig = {
    tableType: "",
    paginationOption: "custom",
    actions: featuresAssigned.indexOf(VIEW_USER_PROFILE) !== -1 && {
      icon:
        featuresAssigned.indexOf(UPDATE_USER_PROFILE) === -1 ? (
          <VisibilityIcon color="primary" />
        ) : (
            <RateReviewIcon color="primary" />
          ),
      tooltipText:
        featuresAssigned.indexOf(UPDATE_USER_PROFILE) === -1
          ? VIEW_PROFILE
          : VIEW_UPDATE_PROFILE,
      action: (data) => {
        history.push(`/admin/user-profile/${data.id}`);
      },
    },
  };

  const openAddUsersDialog = () => {
    dispatch({ type: RESET_USER_IS_DONE, payload: "" });
    dispatch({ type: RESET_ADD_USER_ERROR, payload: "" });
    setOpen(true);
    setAddUserKey((count) => count + 1);
    //setActiveTab(0);
  };

  const handleChange = (e) => {
    setSearchText(e.target.value);
    if (e.target.value === "")
      dispatch(fetchUsers(DEFAULT_START_INDEX, pageSize));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSearch = () => {
    if (searchText !== "")
      dispatch(
        fetchUsers(DEFAULT_START_INDEX, pageSize, searchText, inputs.searchBy)
      );
  };

  const handlePageChange = (start, size) => {
    if (searchText === "" || searchText === "All")
      dispatch(fetchUsers(start, size));
    else dispatch(fetchUsers(start, size, searchText, inputs.searchBy));
  };

  const closeAddUsersDialog = () => {
    setOpen(false);
  };

  useEffect(() => {
    dispatch(updateHeaderTitle(USERS));
    dispatch(fetchUsers(startIndex, DEFAULT_PAGE_SIZE));
    dispatch(fetchClients("clientName"));
    dispatch(fetchRoles());
  }, [dispatch]);

  useEffect(() => {
    if (fetchUserError)
      setApiError(handleUsersError(fetchUserError));
    else
      setApiError(false);
  },
    [fetchUserError]
  );

  return (
    <MatContainer>
      <PageHeading
        action={
          <Grid container style={{ width: "auto" }}>
            <Grid item className={styles.filterDropdown}>
              <MatInputField
                select
                onChange={handleFilter}
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
            {/* {(!searchBy ||
              searchBy === "name" ||
              searchBy === "email" ||
              searchBy === "associatedClient") && (
                <Grid item className={styles.col}>
                  <MatInputField
                    value={search}
                    label={searchFieldLabel[searchBy]}
                    onChange={handleFilter}
                    name="search"
                  />
                </Grid>
              )} */}
            {searchBy &&
              searchBy !== "email_and_name" &&
              //searchBy !== "email" &&
              searchBy !== "client" && (
                <Grid item className={styles.search}>
                  <MatInputField
                    select
                    onChange={handleFilter}
                    label={searchFieldLabel[searchBy]}
                    name="search"
                    value={search}
                  >
                    <MenuItem value="All">All</MenuItem>
                    {searchBy === "role" &&
                      roleList.map((role, index) => (
                        <MenuItem
                          key={index}
                          value={role.roleName}
                          disabled={!role.roleName}
                        >
                          {role.roleName}
                        </MenuItem>
                      ))}
                    {/* {searchBy === "associatedClient" &&
                    clientList.map((client, index) => (
                      <MenuItem
                        key={index}
                        value={client.clientName}
                        disabled={!client.clientName}
                      >
                        {client.clientName}
                      </MenuItem>
                    ))} */}
                    {searchBy === "status" &&
                      statusList.map((status) => (
                        <MenuItem key={status.id} value={status.id}>
                          {status.value}
                        </MenuItem>
                      ))}
                    {/* {searchBy === "userType" &&
                      userTypeList.map((userType) => (
                        <MenuItem key={userType.id} value={userType.id}>
                          {userType.value}
                        </MenuItem>
                      ))} */}
                  </MatInputField>
                </Grid>
              )}
            {(!searchBy ||
              searchBy === "email_and_name" ||
              searchBy === "client") && (
                <Search
                  searchText={searchText}
                  handleChange={handleChange}
                  handleKeyPress={handleKeyPress}
                  handleSearch={handleSearch}
                />
              )}
            {/* {featuresAssigned.indexOf(ADD_USER) !== -1 && (
              <Grid item style={{ display: "flex", alignItems: "center" }}>
                <MatButton onClick={openAddUsersDialog}>Add New User</MatButton>
              </Grid>
            )} */}
          </Grid>
        }
      // action={
      //   <MatButton onClick={openAddUsersDialog}>
      //     Add New Client User
      //   </MatButton>
      // }
      // action={
      //   <Grid container style={{ width: "auto" }}>
      //     <Search searchText={searchText} handleChange={handleChange} handleKeyPress={handleKeyPress} handleSearch={handleSearch} />
      //     {featuresAssigned.indexOf(ADD_USER) !== -1 && <Grid item style={{ display: "flex", alignItems: "center" }}>
      //       <MatButton onClick={openAddUsersDialog}>Add New Client User</MatButton>
      //     </Grid>}
      //   </Grid>
      // }
      />

      {(usersList.length <= 0 && apiError) ? (
        <Grid item xs={12} className={styles.gridCol}>
          <Card className={apiError.messageType === "error" ? styles.errorCard : styles.warningCard}>
            <Typography variant="body2">{apiError.message}</Typography>
          </Card>
        </Grid>
      ) :
        usersList.length ? (
          <MatCard>
            <DataTable
              cols={cols}
              rows={usersList}
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
          )
      }

      {open && (
        <AddUsers
          key={addUserKey}
          handleClose={closeAddUsersDialog}
          open={open}
        />
      )}
      <TableCellShowMore
        anchorEl={popUpAnchorEl}
        open={isPopUpOpen}
        onClose={handlePopUpClose}
        moreItems={0}
        fieldProp={popUpFieldKey}
        options={popUpOptions}
      />
    </MatContainer>
  );
};

export default Users;
