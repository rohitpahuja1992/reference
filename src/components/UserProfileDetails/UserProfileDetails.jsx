import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import InputLabel from "@material-ui/core/InputLabel";
import Typography from "@material-ui/core/Typography";
import { Divider, makeStyles, FormHelperText } from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import Card from "@material-ui/core/Card";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Switch from "@material-ui/core/Switch";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import MatCard from "../../components/MaterialUi/MatCard";
import MaterialTextField from "../../components/MaterialUi/MatTextField";
import MatFormControl from "../../components/MaterialUi/MatFormControl";
import MatSelect from "../../components/MaterialUi/MatSelect";
import MatButton from "../../components/MaterialUi/MatButton";
import ChangePassword from "../../components/ChangePassword";

import { fetchUserAudit } from "../../actions/UserTimelineActions";
import { updateUser } from "../../actions/UserActions";
import {
  handleUserProfileDetailsError,
  CLIENT_ASSI_MANDATORY,
  FIRST_NAME_MANDATORY,
  VALID_NAME_MSG,
  MAXIMUN_CHARACTER_ALLOWED_MSG,
  LAST_NAME_MANDATORY,
  ENTER_VALID_EMAIL,
  EMAIL_WILL_USERNAME,
  EMAIL_ADD,
  CONTACT_NUM_MES,
  CANCEL,
  SAVE_DETAILS,
  EDIT_DETAILS,
  FIRST_NAME,
  LAST_NAME,
  CONTACT_NUM,
  EMAIL_ADDRESS_MANDATORY,
  ENTER_VALID_CONTACT_NUM,
  FILL_EMAIL_FIRST_CLIENT,
  CHANGE_PWD_BUTTON_TEXT
} from "../../utils/Messages";
import {
  RESET_CHANGE_PASSWORD_DATA,
  RESET_UPDATE_USERAUDIT_IS_DONE,
  DEFAULT_PAGE_SIZE_TIMELINE,
  DEFAULT_START_INDEX,
} from "../../utils/AppConstants";

import { UPDATE_USER_PROFILE, UPDATE_OWN_PROFILE } from "../../utils/FeatureConstants";

import {
  EMAIL_VALIDATION_PATTERN,
  PHONE_VALIDATION_PATTERN,
  NAME_PATTERN,
} from "../../utils/AppConstants";

const useStyles = makeStyles((theme) => ({
  cardHeading: {
    paddingTop: "12px",
    paddingBottom: "10px",
  },
  cardHeadingSize: {
    fontSize: "18px",
  },
  row: {
    padding: "10px 0 0",
  },
  col: {
    padding: "5px 10px",
  },
  dialogTitle: {
    fontWeight: 300,
  },
  chip: {
    margin: "2px",
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
  grow: {
    flexGrow: 1,
  },
  buttonCol: {
    padding: "5px 10px",
    display: "flex",
  },
  cancelBtn: {
    marginRight: "16px",
  },
}));

const UserProfileDetails = (props) => {
  const styles = useStyles();
  const { isUpdated, fireOnUpdate } = props;
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearError,
    errors,
    formState,
    reset,
  } = useForm({ mode: "onBlur" });
  let { dirty } = formState;
  const clientList = useSelector((state) => state.MhkClient.data.list);
  const userData = useSelector((state) => state.User.profile);
  const loggedInUser = useSelector((state) => state.User.loggedInUser.details);
  const [isSubmited, setIsSubmited] = useState(false);
  const [apiError, setApiError] = useState(null);
  const featuresAssigned = useSelector(
    (state) => state.User.features
  );
  const dispatch = useDispatch();
  // const [disable,setDisable] = useState(false);
  const [isEditable, setEditable] = useState(false);
  const [isSelectionChanged, setSelectionChanged] = useState(false);

  const [open, setOpen] = useState(false);
  const [changePasswordKey, setChangePasswordKey] = useState(0);

  const defaultFormData = {
    firstName: props.details.firstName,
    lastName: props.details.lastName,
    email: props.details.email,
    contactNumber: props.details.phone_number,
    checked: props.details.emailNotificationOn,
    userType: props.details.user_type,
    userRoles: props.details.roles.map((role) => role.roleName),
    clients: props.details.clients.map((client) => client.id),
  };
  const [inputs, setInputs] = useState(defaultFormData);
  const {
    clients,
    email,
    firstName,
    lastName,
    contactNumber,
    userType,
    userRoles,
  } = inputs;

  const [checked, setChecked] = useState(props.details.emailNotificationOn);

  const handleSelection = (value) => () => {
    setSelectionChanged(true);
    setChecked(!value);
  };

  let handleChange = (e) => {
    setApiError(null);
    const { name, value } = e.target;
    if (name === "clients") {
      setSelectionChanged(true);
      setInputs((inputs) => ({
        ...inputs,
        [name]: isMultipleSelection() ? value : [value],
      }));
    } else {
      setInputs((inputs) => ({ ...inputs, [name]: watch(name) }));
    }
  };

  let handleBlur = (e) => {
    const { name, value } = e.target;
    setInputs((inputs) => ({
      ...inputs,
      [name]: value.trim(),
    }));
  };

  const isMultipleSelection = () => userType === "MHK";

  const handleAddUser = () => {
    fireOnUpdate(true);
    setIsSubmited(true);
    let formData = {
      id: props.details.id,
      roles: props.details.roles.map((role) => role.id),
      status: props.details.status,
      emailNotificationOn: checked,
      ...inputs,
    };
    console.log("formDatas", formData)
    dispatch(updateUser(formData));
  };

  const handleSelectValue = (selected, list, type) => {
    return selected.map((id) => (
      <Chip
        key={id}
        label={list.filter((data) => data.id === id).length > 0 && list.filter((data) => data.id === id)[0][type]}
        className={styles.chip}
      />
    ));
  };

  const handleCancel = () => {
    fireOnUpdate(false);
    reset(defaultFormData);
    setChecked(props.details.emailNotificationOn)
    setInputs(defaultFormData);
    setEditable(false);
    setSelectionChanged(false);
  };

  const openChangePasswordDialog = () => {
    dispatch({ type: RESET_CHANGE_PASSWORD_DATA });
    setOpen(true);
    setChangePasswordKey((count) => count + 1);
  };

  const closeChangePasswordDialog = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (clients.length > 0) {
      setValue("clients", clients);
      clearError("clients");
    } else {
      register(
        { name: "clients" },
        {
          required: { value: true, message: CLIENT_ASSI_MANDATORY },
        }
      );
    }

    if (userData.error && userData.isUpdateCalled && isUpdated) {
      setEditable(true);
      setIsSubmited(false);
      setApiError(handleUserProfileDetailsError(userData.error));
    } else {
      // setEditable(false);
      setIsSubmited(false);
      setApiError(null);
    }
  }, [register, clients, setValue, clearError, userData, isUpdated]);

  useEffect(() => {
    if (userData.isAuditUpdated) {
      console.log("UserProfileDetails");
      dispatch(fetchUserAudit(props.details.id, DEFAULT_START_INDEX, DEFAULT_PAGE_SIZE_TIMELINE));
      dispatch({ type: RESET_UPDATE_USERAUDIT_IS_DONE });
    }
  }, [dispatch, userData, props]);

  // useEffect(() => {
  //   if(isEditable){
  //     if(loggedInUser.email=== userData.details.email){
  //       setEditAccess(false);

  //     }else{
  //       setEditAccess(true);
  //     }
  //   }else{
  //     setEditAccess(false);
  //   }

  // },[isEditable, loggedInUser, userData]);

  return (
    <MatCard>
      <CardHeader
        className={styles.cardHeading}
        title={
          <Typography variant="h6" className={styles.cardHeadingSize}>
            {loggedInUser.user_type === "MHK" ? "User Details" : "Details"}
          </Typography>
        }
      />
      <Divider />
      <CardContent>
        <form
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(handleAddUser)}
        >
          <Grid container className={styles.row}>
            {apiError && (
              <Grid item xs={12} className={styles.col}>
                <Card className={apiError.messageType === "error" ? styles.errorCard : styles.warningCard}>
                  <Typography variant="body2">{apiError.message}</Typography>
                </Card>
              </Grid>
            )}
            <Grid item xs={6} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  required: {
                    value: true,
                    message: FIRST_NAME_MANDATORY,
                  },
                  pattern: {
                    value: NAME_PATTERN,
                    message: VALID_NAME_MSG,
                  },
                  maxLength: {
                    value: 50,
                    message: MAXIMUN_CHARACTER_ALLOWED_MSG,
                  },
                })}
                error={errors.firstName ? true : false}
                defaultValue={firstName}
                helperText={errors.firstName ? errors.firstName.message : " "}
                required
                InputLabelProps={{
                  shrink: true,
                }}
                label={FIRST_NAME}
                name="firstName"
                onBlur={handleBlur}
                onChange={handleChange}
                disabled={!isEditable || userType === "MHK"}
              />
            </Grid>
            <Grid item xs={6} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  required: { value: true, message: LAST_NAME_MANDATORY },
                  pattern: {
                    value: NAME_PATTERN,
                    message: VALID_NAME_MSG,
                  },
                  maxLength: {
                    value: 50,
                    message: MAXIMUN_CHARACTER_ALLOWED_MSG,
                  },
                })}
                error={errors.lastName ? true : false}
                defaultValue={lastName}
                helperText={errors.lastName ? errors.lastName.message : " "}
                required
                label={LAST_NAME}
                name="lastName"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={!isEditable || userType === "MHK"}
              />
            </Grid>
            <Grid item xs={6} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  required: {
                    value: true,
                    message: EMAIL_ADDRESS_MANDATORY,
                  },
                  pattern: {
                    value: EMAIL_VALIDATION_PATTERN,
                    message: ENTER_VALID_EMAIL,
                  },
                })}
                error={errors.email ? true : false}
                defaultValue={email}
                helperText={
                  errors.email
                    ? errors.email.message
                    : EMAIL_WILL_USERNAME
                }
                required
                label={EMAIL_ADD}
                id="email"
                name="email"
                onChange={handleChange}
                disabled
              />
            </Grid>
            <Grid item xs={6} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  required: { value: userRoles.indexOf("Client User Access") !== -1 ? true : false, message: "Phone number is Mandatory" },
                })}
                inputProps={{ type: 'number'}}
                error={errors.contactNumber ? true : false}
                defaultValue={contactNumber}
                // helperText={
                //   errors.contactNumber
                //     ? errors.contactNumber.message
                //     : CONTACT_NUM_MES
                // }

                label={CONTACT_NUM}
                name="contactNumber"
                // variant="filled"
                onChange={handleChange}

                disabled={!isEditable || userType === "MHK"}
              />
            </Grid>
            <Grid item xs={6} className={styles.col}>
              <Paper variant="outlined">
                <List className={styles.switchList}>
                  <ListItem
                    className={styles.listGutter}
                    button
                    disabled={!isEditable}
                    onClick={handleSelection(checked)}
                  >
                    <ListItemIcon className={styles.switchItem}>
                      <Switch edge="end" checked={checked} disableRipple />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle2"
                          style={{ wordBreak: "break-word" }}
                        >
                          {"E-Mail Notifications"}
                        </Typography>
                      }
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
            {clientList.length > 0 && (
              <Grid item xs={12} className={styles.col}>
                <MatFormControl
                  required
                  error={errors.clients ? true : false}
                  variant="filled"
                  size="small"
                >
                  <InputLabel>Assign Client</InputLabel>
                  <MatSelect
                    multiple={isMultipleSelection()}
                    value={clients}
                    disabled={
                      !isEditable || loggedInUser.user_type === "CLIENT"
                    }
                    name="clients"
                    onChange={handleChange}
                    autoWidth
                    renderValue={(selected) =>
                      handleSelectValue(selected, clientList, "clientName")
                    }
                  >
                    {(email && !errors.email) || true ? (
                      clientList
                        .filter((obj) => !obj.isDeleted && !obj.clientStatus)
                        .map((option, key) => (
                          <MenuItem
                            key={option.id}
                            value={option.id}
                            disabled={!option.clientName}
                          >
                            {isMultipleSelection() && (
                              <Checkbox
                                checked={clients.some((id) => id === option.id)}
                              />
                            )}
                            <ListItemText primary={option.clientName} />
                          </MenuItem>
                        ))
                    ) : (
                      <MenuItem disabled>
                        <ListItemText primary={FILL_EMAIL_FIRST_CLIENT} />
                      </MenuItem>
                    )}
                  </MatSelect>
                  <FormHelperText>
                    {errors.clients ? errors.clients.message : " "}
                  </FormHelperText>
                </MatFormControl>
              </Grid>
            )}
          </Grid>
          <Grid item xs={12} className={styles.buttonCol}>
            {userData.details.id === loggedInUser.id &&
              userType !== "MHK" &&
              props.details.status !== "TERMINATED" && (
                <MatButton color="primary" onClick={openChangePasswordDialog}>
                  {CHANGE_PWD_BUTTON_TEXT}
                </MatButton>
              )}

            <div className={styles.grow} />
            {!isEditable && props.details.status !== "TERMINATED" &&
              ((featuresAssigned.indexOf(UPDATE_USER_PROFILE) !== -1 && loggedInUser.email !== userData.details.email) || (featuresAssigned.indexOf(UPDATE_OWN_PROFILE) !== -1 && loggedInUser.email === userData.details.email)) && (
                <MatButton onClick={() => setEditable(true)}>
                  {EDIT_DETAILS}
                </MatButton>
              )}

            {isEditable && (
              <div>
                <MatButton
                  className={styles.cancelBtn}
                  color="primary"
                  onClick={handleCancel}
                >
                  {CANCEL}
                </MatButton>
                <MatButton
                  type="submit"
                  disabled={
                    (isSubmited || !dirty) && !isSelectionChanged && !apiError
                  }
                >
                  {SAVE_DETAILS}
                </MatButton>
              </div>
            )}
          </Grid>
        </form>
      </CardContent>
      {open && (
        <ChangePassword
          key={changePasswordKey}
          openFor="userProfile"
          username={userData.details.email}
          handleClose={closeChangePasswordDialog}
          open={open}
        />
      )}
    </MatCard>
  );
};

export default UserProfileDetails;
