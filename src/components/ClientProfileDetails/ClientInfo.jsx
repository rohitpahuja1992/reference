import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import {
  Divider,
  makeStyles,
  FormHelperText,
  CardContent,
} from "@material-ui/core";
import ListSubheader from "@material-ui/core/ListSubheader";
import Grid from "@material-ui/core/Grid";
import CardHeader from "@material-ui/core/CardHeader";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import MatCard from "../MaterialUi/MatCard";
import MaterialTextField from "../MaterialUi/MatTextField";
import MatFormControl from "../MaterialUi/MatFormControl";
import MatSelect from "../MaterialUi/MatSelect";
import MatButton from "../MaterialUi/MatButton";

import {
  updateClientProfile,
  resetClientInfo,
} from "../../actions/ClientActions";
import { NAME_PATTERN } from "../../utils/AppConstants";
import { UPDATE_CLIENT_PROFILE } from "../../utils/FeatureConstants";
import {
  RELATIONSHIP_MANAGER_MANDATORY_MSG,
  ACCOUNT_STATUS_MANDATORY_MSG,
  CODE_VERSION_MANDATORY_MSG,
  CLIENT_ALREADY_EXIST_MSG,
  //COMMON_ERROR_MESSAGE,
  CLIENT_NAME_MANDATORY_MSG,
  VALID_NAME_MSG,
  MAXIMUN_CHARACTER_ALLOWED_MSG,
  SAVE_DETAILS,
  CODE_VERSION,
  handleClientInfoError,
} from "../../utils/Messages";

const useStyles = makeStyles((theme) => ({
  card: {
    flex: 1,
  },
  cardHeading: {
    paddingTop: "10px",
    paddingBottom: "8px",
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
    boxShadow: "none !important",
    color: "#ffffff",
    padding: "12px 16px",
    marginBottom: "14px",
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
  disableClick: {
    pointerEvents: "none",
  },
}));

const ClientInfo = (props) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const { clientId } = useParams();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearError,
    errors,
    formState,
    reset,
  } = useForm({ mode: "onBlur" });
  let { dirty } = formState;
  //const [isSubmited, setIsSubmited] = useState(false);
  const [isEditable, setEditable] = useState(false);
  const [isUpdateCalled, setIsUpdateCalled] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isSelectionChanged, setSelectionChanged] = useState(false);
  const putError = useSelector((state) => state.Client.updateError);
  const isClientUpdated = useSelector((state) => state.Client.isClientUpdated);
  const featuresAssigned = useSelector((state) => state.User.features);
  const loggedInUserData = useSelector(
    (state) => state.User.loggedInUser.details
  );
  const codeVersion = useSelector(
    (state) =>
      state.CodeVersion.codeVersionDetailsList.list &&
      state.CodeVersion.codeVersionDetailsList.list.filter(
        (obj) => !obj.deleted
      )
  );
  const managerList = useSelector((state) =>
    state.User.data.list.filter(
      (obj) => obj.user_type === "MHK" && obj.status === "ACTIVE"
    )
  );
  const clientDetailsList = useSelector(
    (state) => state.Client.clientDetailsList
  );
  const handleClientStatusLabel = (details) => {
    if (details.isDeleted) {
      return "TERMINATED";
    } else if (details.clientStatus) {
      return "INACTIVE";
    } else {
      return "ACTIVE";
    }
  };
  const defaultFormData = {
    clientName: props.details.clientName,
    version: props.details.codeVersion && props.details.codeVersion.id,
    manager:
      props.details.relationshipManager && props.details.relationshipManager.id,
    accountStatus: handleClientStatusLabel(props.details),
    //props.details.isDeleted ? props.details.clientStatus === 0 ? 'ACTIVE' : 'INACTIVE' : 'TERMINATED'
  };
  const [inputs, setInputs] = useState(defaultFormData);

  const { clientName, version, accountStatus, manager } = inputs;

  const handleCancel = () => {
    dispatch(resetClientInfo());
    reset(defaultFormData);
    setInputs(defaultFormData);
    setEditable(false);
    setSelectionChanged(false);
    setIsUpdateCalled(false);
  };

  let handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(resetClientInfo());
    setApiError(false);
    setSelectionChanged(true);
    if (name === "manager" || name === "accountStatus" || name === "version") {
      setInputs((inputs) => ({ ...inputs, [name]: value }));
    } else {
      dispatch(resetClientInfo());
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

  const handleEdit = () => {
    setEditable(true);
    setIsUpdateCalled(false);
    //setApiError(false);
  };

  const handleUpdateClientProfile = () => {
    setIsUpdateCalled(true);
    dispatch(updateClientProfile(inputs, props, clientId));
  };

  useEffect(() => {
    if (!!manager) {
      setValue("manager", manager);
      clearError("manager");
    } else {
      register(
        { name: "manager" },
        {
          required: {
            value: true,
            message: RELATIONSHIP_MANAGER_MANDATORY_MSG,
          },
        }
      );
    }
    if (!!accountStatus) {
      setValue("accountStatus", accountStatus);
      clearError("accountStatus");
    } else {
      register(
        { name: "accountStatus" },
        {
          required: {
            value: true,
            message: ACCOUNT_STATUS_MANDATORY_MSG,
          },
        }
      );
    }
    if (!!version) {
      setValue("version", version);
      clearError("version");
    } else {
      register(
        { name: "version" },
        {
          required: {
            value: true,
            message: CODE_VERSION_MANDATORY_MSG,
          },
        }
      );
    }
    if (isUpdateCalled && putError) {
      //setIsUpdateCalled(false);
      setEditable(true);
      setApiError(handleClientInfoError(Error));
    }
    if (isClientUpdated) {
      setEditable(false);
      setApiError(false);
      setIsUpdateCalled(false);
      //dispatch(fetchClientById(props.details.id));
    }
    if (putError && putError.responseCode && putError.responseCode === "2013") {
      setIsUpdateCalled(false);
      setEditable(true);
      setError("clientName", "notMatch", CLIENT_ALREADY_EXIST_MSG);
    }
  }, [
    inputs,
    props,
    isClientUpdated,
    clientDetailsList,
    manager,
    accountStatus,
    version,
    clearError,
    dispatch,
    register,
    setError,
    setValue,
    putError,
    isUpdateCalled,
  ]);

  return (
    <MatCard className={styles.card}>
      <CardHeader
        className={styles.cardHeading}
        title={
          <Typography variant="h6" className={styles.cardHeadingSize}>
            Client Details
          </Typography>
        }
      />
      <Divider />
      <CardContent>
        {apiError && isUpdateCalled ? (
          <Grid item xs={12} className={styles.col}>
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
        ) : null}
        <form
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(handleUpdateClientProfile)}
          id="updateClientInfo"
        >
          <Grid container className={styles.row}>
            <Grid item xs={6} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  required: {
                    value: true,
                    message: CLIENT_NAME_MANDATORY_MSG,
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
                defaultValue={clientName}
                //value={clientName}
                error={errors.clientName ? true : false}
                helperText={errors.clientName ? errors.clientName.message : " "}
                required
                label="Client Name"
                name="clientName"
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={!isEditable || (props.details.clientStatus === 1 && !props.details.isDeleted)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={6} className={styles.col}>
              <MatFormControl
                required
                error={errors.manager ? true : false}
                variant="filled"
                size="small"
              >
                <InputLabel>Relationship Manager</InputLabel>
                <MatSelect
                  value={manager}
                  name="manager"
                  disabled={
                    !isEditable || loggedInUserData.user_type === "CLIENT" || (props.details.clientStatus === 1 && !props.details.isDeleted)
                  }
                  onChange={handleChange}
                >
                  {managerList.map((option, key) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.firstName + " " + option.lastName}
                    </MenuItem>
                  ))}
                </MatSelect>
                <FormHelperText>
                  {errors.manager ? errors.manager.message : " "}
                </FormHelperText>
              </MatFormControl>
            </Grid>
            <Grid item xs={6} className={styles.col}>
              <MatFormControl
                required
                error={errors.accountStatus ? true : false}
                variant="filled"
                size="small"
              >
                <InputLabel>Account Status</InputLabel>
                <MatSelect
                  value={accountStatus}
                  name="accountStatus"
                  disabled={
                    !isEditable || loggedInUserData.user_type === "CLIENT"
                  }
                  onChange={handleChange}
                >
                  <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                  <MenuItem value="INACTIVE">INACTIVE</MenuItem>
                  {props.details.isDeleted && (
                    <MenuItem value="TERMINATED">TERMINATED</MenuItem>
                  )}
                </MatSelect>
                <FormHelperText>
                  {errors.accountStatus ? errors.accountStatus.message : " "}
                </FormHelperText>
              </MatFormControl>
            </Grid>
            <Grid item xs={6} className={styles.col}>
              <MatFormControl
                required
                error={errors.version ? true : false}
                variant="filled"
                size="small"
              >
                <InputLabel>{CODE_VERSION}</InputLabel>
                <MatSelect
                  value={version}
                  name="version"
                  disabled={
                    !isEditable || loggedInUserData.user_type === "CLIENT" || (props.details.clientStatus === 1 && !props.details.isDeleted)
                  }
                  onChange={handleChange}
                >
                  <ListSubheader
                    disableSticky={true}
                    className={styles.disableClick}
                  >
                    Released
                  </ListSubheader>
                  {codeVersion
                    ?.filter((type) => type.type === "RELEASED")
                    ?.map((option, key) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.codeVersion}
                      </MenuItem>
                    ))}
                  <ListSubheader
                    disableSticky={true}
                    className={styles.disableClick}
                  >
                    Unreleased
                  </ListSubheader>
                  {codeVersion
                    ?.filter((type) => type.type === "UNRELEASED")
                    ?.map((option, key) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.codeVersion}
                      </MenuItem>
                    ))}
                </MatSelect>
                <FormHelperText>
                  {errors.version ? errors.version.message : " "}
                </FormHelperText>
              </MatFormControl>
            </Grid>
          </Grid>
          <Grid item xs={12} className={styles.buttonCol}>
            <div className={styles.grow} />
            {!isEditable &&
              featuresAssigned.indexOf(UPDATE_CLIENT_PROFILE) !== -1 &&
              !props.details.isDeleted && (
                <MatButton onClick={handleEdit}>Edit Details</MatButton>
              )}

            {isEditable && (
              <div>
                <MatButton
                  className={styles.cancelBtn}
                  color="primary"
                  onClick={handleCancel}
                >
                  Cancel
                </MatButton>
                <MatButton
                  type="submit"
                  disabled={(isUpdateCalled || !dirty) && !isSelectionChanged}
                >
                  {SAVE_DETAILS}
                </MatButton>
              </div>
            )}
          </Grid>
        </form>
      </CardContent>
    </MatCard>
  );
};

export default ClientInfo;
