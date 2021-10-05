import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import MaterialTextField from "../MaterialUi/MatTextField";
import MatFormControl from "../MaterialUi/MatFormControl";
import MatSelect from "../MaterialUi/MatSelect";
import MatButton from "../MaterialUi/MatButton";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import InputLabel from "@material-ui/core/InputLabel";
import Chip from "@material-ui/core/Chip";
import { Divider, makeStyles, FormHelperText } from "@material-ui/core";
import { addUser, fetchUsers } from "../../actions/UserActions";
import {
  EMAIL_VALIDATION_PATTERN,
  PHONE_VALIDATION_PATTERN,
  RESET_ADD_USER_ERROR,
  NAME_PATTERN,
  DEFAULT_START_INDEX,
} from "../../utils/AppConstants";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import {
  handleAddUsersError,
  MAXIMUN_CHARACTER_ALLOWED_MSG,
  ROLE_ASSI_MANDATORY,
  ADD_NEW_CLIENT_USER,
  FIRST_NAME_MANDATORY,
  FIRST_NAME,
  LAST_NAME,
  LAST_NAME_MANDATORY,
  EMAIL_ADD,
  EMAIL_ADDRESS_MANDATORY,
  ENTER_VALID_EMAIL,
  MAX_256_CHARACTER_ALLOW,
  ENTER_VALID_CONTACT_NUM,
  CONTACT_NUM_MES,
  CONTACT_NUM,
  FILL_EMAIL_FIRST_CLIENT,
  FILL_EMAIL_FIRST_ROLE,
  VALID_NAME_MSG,
  EMAIL_WILL_USERNAME,
  CANCEL,
  //handleUserAddMsg,
  CLIENT_ASSI_MANDATORY,
  // USER_ALREADY_EXIST,
  // PLEASE_TRY_OTHER,
  SEL_USER_TYPE
} from "../../utils/Messages";

const useStyles = makeStyles((theme) => ({
  row: {
    padding: "10px 0 0",
  },
  col: {
    padding: "3px 8px",
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
    boxShadow: "none !important",
    color: "#ffffff",
    padding: "12px 16px",
    marginBottom: "14px",
  },
  buttonCol: {
    padding: "5px 10px",
    display: "flex",
  },
  root: {
    margin: "0px 0px 0px",
  },
}));

function AddUsers(props) {
  const styles = useStyles();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearError,
    errors,
  } = useForm({ mode: "onBlur" });
  const roleList = useSelector((state) => state.Role.data.list);
  const clientList = useSelector((state) => state.MhkClient.data.list);
  //const clientList = MHKClient.filter(obj => !obj.isDeleted && !obj.clientStatus);
  const userData = useSelector((state) => state.User.data);
  const [isSubmited, setIsSubmited] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const pageSize = useSelector((state) => state.User.page.pageSize);
  const dispatch = useDispatch();

  const getRoleSelectedValue = () => {
    let role = roleList.filter((role) => role.roleType === "CLIENT");
    if (role.length === 1) {
      return [role[0].id];
    } else {
      return [];
    }
  };

  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    userType: "CLIENT",
    roles: getRoleSelectedValue(),
    clients: [],
  });
  const { roles, clients, email, userType } = inputs;

  let handleChange = (e) => {
    const { name, value } = e.target;
   
    if (name === "clients" || name === "roles") {
      setInputs((inputs) => ({
        ...inputs,
        [name]: isMultipleSelection() ? value : [value],
      }));
    } else if (name === "userType") {
      setInputs((inputs) => ({
        ...inputs,
        [name]: value,
        roles: value === "MHK" ? [] : getRoleSelectedValue(),
      }));
    } else {
      if (name === "email") {
        dispatch({ type: RESET_ADD_USER_ERROR, payload: "" });
        //setInputs(inputs => ({ ...inputs, clients: [], roles: [] }));
      }
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

  // const isMultipleSelection = () =>
  //   false && email.toLocaleLowerCase().indexOf("@mhk") > -1;

  const isMultipleSelection = () => (userType === "CLIENT" ? false : true);

  //adding user
  const handleAddUser = () => {
    setIsSubmited(true);
    let formData = {
      ...inputs
      //userType: isMultipleSelection() ? "MHK" : "CLIENT",
    };
    dispatch(addUser(formData));
  };

  const handleSelectValue = (selected, list, type) => {
    return selected.map((id) => (
      <Chip
        key={id}
        label={list.filter((data) => data.id === id)[0][type]}
        className={styles.chip}
      />
    ));
  };

  const handleCloseForm = useCallback(() => {
    setIsSubmited(false);
    props.handleClose();
  }, [props]);

  useEffect(() => {
    if (clients.length > 0) {
      setValue("clients", clients);
      clearError("clients");
    } else {
      register(
        { name: "clients" },
        {
          required: {
            value: true,
            message: CLIENT_ASSI_MANDATORY,
          },
        }
      );
    }

    if (roles.length > 0) {
      setValue("roles", roles);
      clearError("roles");
    } else {
      register(
        { name: "roles" },
        { required: { value: true, message: ROLE_ASSI_MANDATORY } }
      );
    }

    if (inputs.userType === "MHK") {
      setValue("clients", clients, { shouldValidate: true });
      clearError("firstName");
      clearError("lastName");
      setDisabled(true);
    } else {
      setDisabled(false);
    }


    if (userData.isUserAdded) {
      dispatch(fetchUsers(DEFAULT_START_INDEX, pageSize));
      handleCloseForm();
    }
  }, [dispatch, clients, clearError, handleCloseForm,
    pageSize, register, roles, setValue, inputs.userType, userData.isUserAdded]);

  useEffect(() => {
    if (
      userData.error && !(userData.error.responseCode === "201")
    ) {
      setIsSubmited(false);
      setApiError(handleAddUsersError(userData.error, inputs.email));
    }
    else {
      setIsSubmited(false);
      setApiError(false);
    }

  }, [inputs.email, userData.error]);

  return (
    <>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={props.open}
        onClose={props.handleClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle className={styles.dialogTitle}>
          {ADD_NEW_CLIENT_USER}
        </DialogTitle>
        <Divider />
        <DialogContent dividers="true">
          <form
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit(handleAddUser)}
            id="addUser"
          >
            <Grid container className={styles.row}>
              {apiError && (
                <Grid item xs={12} className={styles.col}>
                  <Card
                    className={apiError.messageType === "error" ? styles.errorCard : styles.warningCard}
                  //   userData.error.responseCode === "9124" ||
                  //     userData.error.responseCode === "9123"
                  //     ? styles.warningCard
                  //     : styles.errorCard
                  // }
                  >
                    <Typography variant="body2">{apiError.message}</Typography>
                  </Card>
                </Grid>
              )}
              <Grid item xs={6} className={styles.col}>
                <MaterialTextField
                  select
                  onChange={handleChange}

                  value={userType}
                  label={SEL_USER_TYPE}
                  name="userType"
                >
                  {roleList
                    .map((role) => role.roleType)
                    .filter((v, i, a) => a.indexOf(v) === i)
                    .map((option, index) => (
                      <MenuItem key={index} value={option} styles={styles.root}>
                        <ListItemText primary={option} />
                      </MenuItem>
                    ))}
                </MaterialTextField>
              </Grid>

              {/* <Grid item xs={6} className={styles.col}></Grid> */}
              <Grid item xs={6} className={styles.col}>
                <MaterialTextField
                  inputRef={register({
                    required: {
                      value: userType === "CLIENT",
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
                  disabled={disabled}
                  error={errors.firstName ? true : false}
                  helperText={errors.firstName ? errors.firstName.message : " "}
                  label={FIRST_NAME}
                  required={userType === "CLIENT"}
                  name="firstName"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid item xs={6} className={styles.col}>
                <MaterialTextField
                  inputRef={register({
                    required: {
                      value: userType === "CLIENT",
                      message: LAST_NAME_MANDATORY,
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
                  disabled={disabled}
                  error={errors.lastName ? true : false}
                  helperText={errors.lastName ? errors.lastName.message : " "}
                  required
                  label={LAST_NAME}
                  name="lastName"
                  onChange={handleChange}
                  onBlur={handleBlur}
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
                    maxLength: {
                      value: 256,
                      message: MAX_256_CHARACTER_ALLOW,
                    },
                  })}
                  error={errors.email ? true : false}
                  helperText={
                    errors.email ? errors.email.message : EMAIL_WILL_USERNAME
                  }
                  required
                  label={EMAIL_ADD}
                  id="email"
                  name="email"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6} className={styles.col}>
                <MaterialTextField
                  inputRef={register({
                    pattern: {
                      value: PHONE_VALIDATION_PATTERN,
                      message: ENTER_VALID_CONTACT_NUM,
                    },
                  })}
                  error={errors.contactNumber ? true : false}
                  helperText={
                    errors.contactNumber
                      ? errors.contactNumber.message
                      : CONTACT_NUM_MES
                  }
                  disabled={disabled}
                  label={CONTACT_NUM}
                  name="contactNumber"
                  variant="filled"
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={6} className={styles.col}>
                <MatFormControl
                  required
                  error={errors.roles ? true : false}
                  variant="filled"
                  size="small"
                >
                  <InputLabel>Assign Role</InputLabel>
                  <MatSelect
                    multiple={isMultipleSelection()}
                    value={roles}
                    name="roles"
                    onChange={handleChange}
                    renderValue={(selected) =>
                      handleSelectValue(selected, roleList, "roleName")
                    }
                  >
                    {(email && !errors.email) || true ? (
                      roleList.map(
                        (option, index) =>
                          ((isMultipleSelection() &&
                            option.roleType === "MHK") ||
                            (!isMultipleSelection() &&
                              option.roleType === "CLIENT")) && (
                            <MenuItem key={index} value={option.id}>
                              {isMultipleSelection() && (
                                <Checkbox
                                  checked={roles.some((id) => id === option.id)}
                                />
                              )}
                              <ListItemText primary={option.roleName} />
                            </MenuItem>
                          )
                      )
                    ) : (
                        <MenuItem disabled>
                          <ListItemText primary={FILL_EMAIL_FIRST_ROLE} />
                        </MenuItem>
                      )}
                  </MatSelect>
                  <FormHelperText>
                    {errors.roles ? errors.roles.message : " "}
                  </FormHelperText>
                </MatFormControl>
              </Grid>

              <Grid item xs={6} className={styles.col}>
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
                    name="clients"
                    onChange={handleChange}
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
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <MatButton color="primary" onClick={handleCloseForm}>
            {CANCEL}
          </MatButton>
          <MatButton type="submit" form="addUser" disabled={isSubmited}>
            Submit
          </MatButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AddUsers;
