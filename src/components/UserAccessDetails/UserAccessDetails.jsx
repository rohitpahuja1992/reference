import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Paper from "@material-ui/core/Paper";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { Divider, makeStyles } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Switch from "@material-ui/core/Switch";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Card from "@material-ui/core/Card";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
// import FormControl from "@material-ui/core/FormControl";
// import FormLabel from "@material-ui/core/FormLabel";

import MatCard from "../MaterialUi/MatCard";
import MatButton from "../MaterialUi/MatButton";
import {
  CANCEL,
  handleUserAccessDetailsError,
  SAVE_ACCESS_ROLE,
  EDIT_ACCESS_ROLE,
  USER_DETAIL_STATUS_TERMINATION,
  ACCESS_ROLE,
  ACCOUNT_STATUS,
  ROLE,
  WARNING,
  USER_ACCESS_ROLE
} from "../../utils/Messages";
import { RESET_DASHBOARD_DATA } from "../../utils/AppConstants";
import { updateUser } from "../../actions/UserActions";
import { fetchUserAudit } from "../../actions/UserTimelineActions";
import { showMessageDialog } from "../../actions/MessageDialogActions";
import { RESET_UPDATE_USERAUDIT_IS_DONE } from "../../utils/AppConstants";
import { TERMINATE_USER, UPDATE_USER_PROFILE, UPDATE_OWN_PROFILE } from "../../utils/FeatureConstants";

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
  cardSubheadingSize: {
    fontSize: "16px",
    paddingTop: "10px",
    marginRight: "20px",
  },
  row: {
    padding: "10px 0 0",
  },
  col: {
    padding: "5px 10px",
  },
  grow: {
    flexGrow: 1,
  },
  buttonCol: {
    padding: "10px 10px 0px",
    display: "flex",
  },
  cancelBtn: {
    marginRight: "16px",
  },
  switchList: {
    padding: "0px",
  },
  switchItem: {
    marginRight: "6px",
  },
  listGutter: {
    paddingTop: "2px",
    paddingBottom: "2px",
    paddingLeft: "6px",
    "&.Mui-disabled": {
      opacity: "0.8",
    },
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
  accountStatus: {
    padding: "2px 16px 5px",
    display: "flex",
  },
}));

const UserAccessDetails = (props) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const roleList = useSelector((state) => state.Role.data.list);
  const userData = useSelector((state) => state.User.profile);
  const userRoles = userData.details.roles.map(a => a.roleName);
  const [isEditable, setEditable] = useState(false);
  const [isEditAccess, setEditAccess] = useState(false);
  const { isUpdated, fireOnUpdate } = props;
  const [isSubmited, setIsSubmited] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [checked, setChecked] = useState(
    props.details.roles.map((role) => role.id)
  );
  
  const featuresAssigned = useSelector(
    (state) => state.User.features
  );
  const loggedInUser = useSelector((state) => state.User.loggedInUser.details);
  const [status, setStatus] = useState(props.details.status);
  const [isDirty, setDirty] = useState(false);
  const roles = loggedInUser && loggedInUser.roles.map(item => item.roleName);

  const handleCancel = () => {
    fireOnUpdate(false);
    setChecked(props.details.roles.map((role) => role.id));
    setStatus(props.details.status);
    setEditable(false);
    setDirty(false);
  };

  const showTerminatedMessage = () => {
    let messageObj = {
      primaryButtonLabel: "OK",
      primaryButtonAction: () => { },
      secondaryButtonLabel: "Cancel",
      secondaryButtonAction: () => { setStatus(props.details.status) },
      title: WARNING,
      message: USER_DETAIL_STATUS_TERMINATION,
    };
    dispatch(showMessageDialog(messageObj));
  };

  const handleStatusSelection = (event) => {
    setApiError(null);
    setDirty(true);
    // if (status === "ACTIVE") {
    //   setStatus("INACTIVE");
    // } else {
    //   setStatus("ACTIVE");
    // }
    if (event.target.value === "TERMINATED") {
      showTerminatedMessage();
    }
    setStatus(event.target.value);
  };

  const handleRoleSelection = (value) => () => {
    console.log(value, checked);
    setApiError(null);
    setDirty(true);
    const currentIndex = checked.indexOf(value);
    const clientIndex = checked.indexOf(2);
    if (props.details.user_type === "MHK") {
      let newChecked = [...checked];
      if (currentIndex === -1) {
        if(value === 2 ) {
          newChecked = []
        }
        if(value !==2 && clientIndex !== -1) {
          newChecked.splice(clientIndex, 1);
        }
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }
      setChecked(newChecked);
    } else {
      let newChecked = [];
      newChecked.push(value);
      setChecked(newChecked);
    }
  };

  const updateRoleAndStatus = () => {
    fireOnUpdate(true);
    dispatch({ type: RESET_DASHBOARD_DATA });
    setIsSubmited(true);
    let formData = {
      id: props.details.id,
      firstName: props.details.firstName,
      lastName: props.details.lastName,
      email: props.details.email,
      contactNumber: props.details.phone_number,
      userType: checked[0]===2?"CLIENT":"MHK",
      clients: props.details.clients.map((client) => client.id),
      roles: checked,
      status: status,
    };
    dispatch(updateUser(formData));
  };

  useEffect(() => {
    if (isEditable) {
      if (loggedInUser.email === userData.details.email) {
        setEditAccess(false);

      } else {
        setEditAccess(true);
      }
    } else {
      setEditAccess(false);
    }

  }, [isEditable, loggedInUser, userData])

  useEffect(() => {
    if (userData.error && userData.isUpdateCalled && isUpdated) {
      setEditable(true);
      setIsSubmited(false);
      setApiError(handleUserAccessDetailsError(userData.error));
    } else {
      setEditable(false);
      setIsSubmited(false);
      setApiError(null);
    }
  }, [userData, isUpdated]);

  useEffect(() => {
    if (userData.isAuditUpdated) {
      dispatch(fetchUserAudit(props.details.id));
      dispatch({ type: RESET_UPDATE_USERAUDIT_IS_DONE });
    }
  }, [dispatch, userData, props]);
  console.log("checked",loggedInUser)
  return (
    <MatCard className={styles.card}>
      <CardHeader
        className={styles.cardHeading}
        title={
          <Typography variant="h6" className={styles.cardHeadingSize}>
            {loggedInUser.user_type === "MHK" ? USER_ACCESS_ROLE : ACCESS_ROLE}
          </Typography>
        }
      />
      <Divider />
      <CardContent>
        <form noValidate autoComplete="off">
          <Grid container className={styles.row}>
            {apiError && (
              <Grid item xs={12} className={styles.col}>
                <Card className={apiError.messageType === "error" ? styles.errorCard : styles.warningCard}>
                  <Typography variant="body2">{apiError.message}</Typography>
                </Card>
              </Grid>
            )}
            <Grid item xs={12} className={styles.col}>
              <Paper variant="outlined" className={styles.accountStatus}>

                <Typography variant="h6" className={styles.cardSubheadingSize}>
                  {ACCOUNT_STATUS}
                </Typography>
                <RadioGroup row value={status} onChange={handleStatusSelection}>
                  <FormControlLabel
                    value="ACTIVE"
                    disabled={!isEditAccess}
                    control={<Radio />}
                    label="ACTIVE"
                  />
                  <FormControlLabel
                    value="INACTIVE"
                    disabled={!isEditAccess}
                    control={<Radio />}
                    label="INACTIVE"
                  />
                  {featuresAssigned.indexOf(TERMINATE_USER) !== -1 &&
                    <FormControlLabel
                      value="TERMINATED"
                      disabled={!isEditAccess}
                      control={<Radio />}
                      label="TERMINATED"
                    />}
                </RadioGroup>
                {/* <List className={styles.switchList}>
                  <ListItem
                    disabled={!isEditable}
                    className={styles.listGutter}
                    button
                    onClick={handleStatusSelection}
                  >
                    <ListItemIcon className={styles.switchItem}>
                      <Switch
                        edge="end"
                        checked={status === "ACTIVE"}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemText primary="Account Status" />
                  </ListItem>
                </List> */}
              </Paper>
            </Grid>
            <Grid item xs={12} className={styles.col}>
              <Typography variant="h6" className={styles.cardSubheadingSize}>
                {ROLE}
              </Typography>
            </Grid>
            {roleList.map((role) => (
              <Grid key={role.id} item xs={6} className={styles.col}>
                <Paper variant="outlined">
                  <List className={styles.switchList}>
                    <ListItem
                      // disabled={
                      //   !isEditable ||
                      //   userRoles.includes("Client User Access") ||
                      //     (role.roleName ==="Administrator" && userRoles.includes("Administrator")) ||
                      //     (role.roleName ==="Client User Access" && userRoles.includes("Administrator"))
                      // }
                      className={styles.listGutter}
                      button
                      onClick={handleRoleSelection(role.id)}
                    >
                      <ListItemIcon className={styles.switchItem}>
                        <Switch
                          edge="end"
                          // onChange={handleToggle('wifi')}
                          checked={checked.indexOf(role.id) !== -1}
                          disableRipple
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            variant="subtitle2"
                            style={{ wordBreak: "break-word" }}
                          >
                            {role.roleName}
                          </Typography>
                        }
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Grid item xs={12} className={styles.buttonCol}>
            <div className={styles.grow} />
            {!isEditable &&
              props.details.status !== "TERMINATED" &&
              loggedInUser.user_type !== "CLIENT" &&
              roles.indexOf('Administrator') !== -1 &&
              ((featuresAssigned.indexOf(UPDATE_USER_PROFILE) !== -1 && loggedInUser.email !== userData.details.email) || (featuresAssigned.indexOf(UPDATE_OWN_PROFILE) !== -1 && loggedInUser.email === userData.details.email)) && (
                <MatButton onClick={() => setEditable(true)}>
                  {EDIT_ACCESS_ROLE}
                </MatButton>
              )}

            {isEditable && (
              <div>
                {!isSubmited && (
                  <MatButton
                    className={styles.cancelBtn}
                    color="primary"
                    onClick={handleCancel}
                  >
                    {CANCEL}
                  </MatButton>
                )}
                <MatButton
                  type="button"
                  onClick={updateRoleAndStatus}
                  disabled={(isSubmited || !isDirty || checked.length === 0) && !apiError}
                >
                  {SAVE_ACCESS_ROLE}
                </MatButton>
              </div>
            )}
          </Grid>
        </form>
      </CardContent>
    </MatCard>
  );
};

export default UserAccessDetails;
