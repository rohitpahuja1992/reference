import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import { Divider, makeStyles } from "@material-ui/core";
// import Card from '@material-ui/core/Card';

import MatCard from "../MaterialUi/MatCard";
import MaterialTextField from "../MaterialUi/MatTextField";
import MatButton from "../MaterialUi/MatButton";
import {
  CANCEL,
  handleUpdateRoleDetailsError,
  ROLE_DETAILS,
  ROLE_NAME_MANDATORY,
  ENTER_VALID_ROLE_NAME,
  ROLE_NAME,
  ROLE_TYPE,
  ROLE_TYPE_MANDATORY,
  ROLE_STATUS,
  ROLE_STATUS_MANDATORY,
  DESC_IS_MANDATORY,
  DESCRIPTION,
  EDIT_DETAILS,
  SAVE_DETAILS,
  MAXIMUN_CHARACTER_ALLOWED_MSG,
} from "../../utils/Messages";
import { updateRole } from "../../actions/RoleActions";
import { NAME_PATTERN } from "../../utils/AppConstants";
import { UPDATE_ROLE_PERMISSION } from "../../utils/FeatureConstants";

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

const UpdateRoleDetails = (props) => {
  const styles = useStyles();
  const { isUpdated, fireOnUpdate } = props;
  const roleProfile = useSelector((state) => state.Role.profile);
  const { register, handleSubmit, watch, errors, formState, reset } = useForm({
    mode: "onBlur",
  });
  const dispatch = useDispatch();
  let { dirty } = formState;
  const [isSubmited, setIsSubmited] = useState(false);
  const [isEditable, setEditable] = useState(false);
  const [isSelectionChanged, setSelectionChanged] = useState(false);
  const [apiError, setApiError] = useState(null);
  const featuresAssigned = useSelector(
    (state) => state.User.features
  );

  const defaultFormData = {
    roleName: props.details.roleName,
    roleStatus: props.details.roleStatus,
    roleType: props.details.roleType,
    roleDesc: props.details.roleDesc,
  };
  const [inputs, setInputs] = useState(defaultFormData);
  const { roleName, roleStatus, roleType, roleDesc } = inputs;

  let handleChange = (e) => {
    setApiError(null);
    const { name, value } = e.target;
    if (name === "roleStatus" || name === "roleType") {
      setSelectionChanged(true);
      setInputs((inputs) => ({ ...inputs, [name]: value }));
    } else {
      setInputs((inputs) => ({ ...inputs, [name]: watch(name) }));
    }
  };

  const handleUpdateRole = () => {
    fireOnUpdate(true);
    setIsSubmited(true);
    let formData = {
      id: props.details.id,
      feature: props.details.features.map((feature) => feature.id),
      queue: props.details.queues.map((queue) => queue.id),
      ...inputs,
    };
    dispatch(updateRole(formData));
  };

  const handleCancel = () => {
    fireOnUpdate(false);
    reset(defaultFormData);
    setInputs(defaultFormData);
    setEditable(false);
    setSelectionChanged(false);
  };

  useEffect(() => {
    if (roleProfile.error && roleProfile.isUpdateCalled && isUpdated) {
      setEditable(true);
      setIsSubmited(false);
      setApiError(handleUpdateRoleDetailsError(roleProfile.error));
    } else {
      setEditable(false);
      setIsSubmited(false);
      setApiError(null);
    }
  }, [roleProfile, isUpdated]);

  return (
    <MatCard>
      <CardHeader
        className={styles.cardHeading}
        title={
          <Typography variant="h6" className={styles.cardHeadingSize}>
            {ROLE_DETAILS}
          </Typography>
        }
      />
      <Divider />
      <CardContent>
        <form
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(handleUpdateRole)}
        >
          <Grid container className={styles.row}>
            {apiError && (
              <Grid item xs={12} className={styles.col}>
                <Card className={apiError.messageType === "error" ? styles.errorCard : styles.warningCard}>
                  <Typography variant="body2">{apiError.message}</Typography>
                </Card>
              </Grid>
            )}
            <Grid item xs={12} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  required: { value: true, message: ROLE_NAME_MANDATORY },
                  pattern: {
                    value: NAME_PATTERN,
                    message: ENTER_VALID_ROLE_NAME,
                  },
                  maxLength: {
                    value: 50,
                    message: MAXIMUN_CHARACTER_ALLOWED_MSG,
                  },
                })}
                error={errors.roleName ? true : false}
                defaultValue={roleName}
                helperText={errors.roleName ? errors.roleName.message : " "}
                required
                label={ROLE_NAME}
                name="roleName"
                onChange={handleChange}
                disabled
              />
            </Grid>

            <Grid item xs={6} className={styles.col}>
              <MaterialTextField
                select
                onChange={handleChange}
                error={errors.roleType ? true : false}
                value={roleType}
                helperText={errors.roleType ? errors.roleType.message : " "}
                inputRef={register({
                  required: { value: true, message: ROLE_TYPE_MANDATORY },
                })}
                label={ROLE_TYPE}
                name="roleType"
                required
                disabled
              >
                <MenuItem value="MHK">MHK</MenuItem>
                <MenuItem value="CLIENT">CLIENT</MenuItem>
              </MaterialTextField>
            </Grid>

            <Grid item xs={6} className={styles.col}>
              <MaterialTextField
                select
                onChange={handleChange}
                error={errors.roleStatus ? true : false}
                value={roleStatus}
                helperText={errors.roleStatus ? errors.roleStatus.message : " "}
                inputRef={register({
                  required: {
                    value: true,
                    message: ROLE_STATUS_MANDATORY,
                  },
                })}
                label={ROLE_STATUS}
                name="roleStatus"
                required
                disabled={!isEditable}
              >
                <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                <MenuItem value="INACTIVE">INACTIVE</MenuItem>
                {/* <MenuItem value="TERMINATED">TERMINATED</MenuItem> */}
              </MaterialTextField>
            </Grid>

            <Grid item xs={12} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  required: {
                    value: true,
                    message: DESC_IS_MANDATORY,
                  },
                })}
                error={errors.roleDesc ? true : false}
                defaultValue={roleDesc}
                helperText={errors.roleDesc ? errors.roleDesc.message : " "}
                required
                label={DESCRIPTION}
                name="roleDesc"
                onChange={handleChange}
                disabled={!isEditable}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} className={styles.buttonCol}>
            <div className={styles.grow} />
            {!isEditable && (
              featuresAssigned.indexOf(UPDATE_ROLE_PERMISSION) !== -1 &&
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
    </MatCard>
  );
};

export default UpdateRoleDetails;
