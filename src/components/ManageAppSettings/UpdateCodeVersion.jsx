import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";

import { makeStyles, FormHelperText } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";

import MatButton from "../MaterialUi/MatButton";
import MaterialTextField from "../MaterialUi/MatTextField";
import MatFormControl from "../MaterialUi/MatFormControl";
//import MatInputField from "../MaterialUi/MatInputField";
import { formatDate } from "../../utils/helpers";
import { updateCodeVersion } from "../../actions/CodeVersionActions";
import {
  handleUpdateCodeVersionError,
  VERSION_TYPE_MANDATORY_MSG,
  CODEVERSION_ALREADY_EXIST_MSG,
  VALID_CODEVERSION_MSG,
  CODEVERSION_MANDATORY_MSG,
  ADD_NEW_CODE_VER,
  ADD_CODE_VERSION,
  CANCEL,
} from "../../utils/Messages";
import { UPDATE_ACTION_APP_SETTINGS, } from "../../utils/FeatureConstants";
import { RESET_DUPLICATE_ERROR } from "../../utils/AppConstants";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    fontWeight: 300,
  },
  col: {
    padding: "10px",
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

const UpdateCodeVersion = (props) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const {
    reset,
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearError,
    errors,
    formState
  } = useForm({ mode: "onBlur" });
  let { dirty } = formState;
  const isCodeVersionUpdated = useSelector(
    (state) => state.CodeVersion.isCodeVersionUpdated
  );
  //const codeVersionDetailsList = useSelector((state) => state.CodeVersion.codeVersionDetailsList);
  const putApiError = useSelector((state) => state.CodeVersion.putError);
  //const [prevList, setPrevList] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const [isSubmited, setIsSubmited] = useState(false);
  const [isSelectionChanged, setSelectionChanged] = useState(false);
  const [apiError, setApiError] = useState(null);
  const featuresAssigned = useSelector((state) => state.User.features);
  const defaultFormData = {
    codeVersion: props.data.codeVersion,
    versionType: props.data.type.charAt(0).toUpperCase() + props.data.type.slice(1).toLowerCase(),
    updatedBy: props.data.updatedBy,
    updatedDate: props.data.updatedAt && formatDate(props.data.updatedAt),
  };
  const [versionType, setVersionType] = useState(defaultFormData.versionType);



  const handleEdit = () => {
    setIsEditable(true);
  };

  const handleCloseForm = useCallback(() => {
    clearError();
    setIsEditable(false);
    setSelectionChanged(false);
    setVersionType("");
    props.handleClose();
  }, [props, clearError, setVersionType]);

  const handleResetForm = () => {
    reset(defaultFormData);
    setIsEditable(false);
    setSelectionChanged(false);
    dispatch({ type: RESET_DUPLICATE_ERROR });
    setApiError(false);
  };

  useEffect(() => {
    if (versionType.length > 0) {
      setValue("versionType", versionType);
      clearError("versionType");
    } else {
      register(
        { name: "versionType" },
        { required: { value: true, message: VERSION_TYPE_MANDATORY_MSG } }
      );
    }

    if (
      putApiError &&
      !(putApiError.responseCode === "200" || putApiError.responseCode === 200)
    ) {
      setApiError(handleUpdateCodeVersionError(putApiError));
    }

    if (putApiError.responseCode && putApiError.responseCode === "2171") {
      setApiError(false);
      setError("codeVersion", "notMatch", CODEVERSION_ALREADY_EXIST_MSG);
    }

    if (isCodeVersionUpdated) {
      handleCloseForm();
      dispatch({ type: RESET_DUPLICATE_ERROR });
    }

  }, [
    dispatch,
    putApiError,
    clearError,
    handleCloseForm,
    register,
    setValue,
    versionType,
    isCodeVersionUpdated,
    setError,
  ]);

  let handleChange = (e) => {
    setSelectionChanged(true);
    dispatch({ type: RESET_DUPLICATE_ERROR });
    setApiError(null);
    if (e.target.name === "versionType") setVersionType(e.target.value);
  };

  const handleUpdateVersion = () => {
    setSelectionChanged(false);
    let data = {
      codeVersion: watch().codeVersion,
      id: props.data.id,
      type: versionType.toUpperCase()
    }
    dispatch(updateCodeVersion(data));
  };

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      open={props.open}
      onClose={props.handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle className={styles.dialogTitle}>
        {props.data.codeVersion}
      </DialogTitle>
      <form
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(handleUpdateVersion)}
      >
        <DialogContent dividers="true">
          <Grid container className={styles.row}>
            {apiError ? (
              <Grid item xs={12} className={styles.col}>
                <Card className={apiError.messageType === "error" ? styles.errorCard : styles.warningCard}>
                  <Typography variant="body2">
                    {apiError.message}
                  </Typography>
                </Card>
              </Grid>
            ) : null}
            <Grid item xs={12} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  required: { value: true, message: CODEVERSION_MANDATORY_MSG },
                  pattern: {
                    value: /^\d{1,2}\.\d{1,2}(?:\.\d{1,2})?$/,
                    message: VALID_CODEVERSION_MSG,
                  },
                })}
                error={errors.codeVersion ? true : false}
                helperText={errors.codeVersion?.message}
                defaultValue={defaultFormData.codeVersion}
                required
                label="Code Version"
                name="codeVersion"
                onChange={handleChange}
                disabled={!isEditable}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} className={styles.col}>
              <MatFormControl
                required
                error={errors.versionType ? true : false}
                variant="filled"
                size="small"
              >
                <MaterialTextField
                  required
                  label="Select Type"
                  select
                  defaultValue={defaultFormData.versionType}
                  name="versionType"
                  onChange={handleChange}
                  disabled={!isEditable}
                  InputLabelProps={{
                    shrink: true,
                  }}
                >
                  <MenuItem value="Released">Released</MenuItem>
                  <MenuItem value="Unreleased">Unreleased</MenuItem>
                </MaterialTextField>
                <FormHelperText>
                  {errors.versionType ? errors.versionType.message : " "}
                </FormHelperText>
              </MatFormControl>
            </Grid>
            <Grid item xs={6} className={styles.col}>
              <MaterialTextField
                name="updatedBy"
                label="Updated By"
                defaultValue={defaultFormData.updatedBy}
                disabled
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={6} className={styles.col}>
              <MaterialTextField
                name="updatedDate"
                label="Updated Date"
                defaultValue={defaultFormData.updatedDate}
                disabled
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          {!isEditable && (
            <>
              <MatButton color="primary" onClick={handleCloseForm}>
                Cancel
              </MatButton>
              {featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) !== -1 &&
                <MatButton onClick={handleEdit}>Edit Code Version</MatButton>}
            </>
          )}
          {isEditable && (
            <>
              <MatButton color="primary" onClick={handleResetForm}>
                Cancel
              </MatButton>
              <MatButton type="submit" disabled={!dirty && !isSelectionChanged}>
                Save Changes
              </MatButton>
            </>
          )}
          {/* <MatButton color="primary" onClick={handleCloseForm}>
            {CANCEL}
          </MatButton>
          <MatButton type="submit" disabled={isSubmited}>
            {ADD_CODE_VERSION}
          </MatButton> */}
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UpdateCodeVersion;
