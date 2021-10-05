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

import { addCodeVersion } from "../../actions/CodeVersionActions";
import {
  handleAddCodeVersionError,
  VERSION_TYPE_MANDATORY_MSG,
  CODEVERSION_ALREADY_EXIST_MSG,
  VALID_CODEVERSION_MSG,
  CODEVERSION_MANDATORY_MSG,
  ADD_NEW_CODE_VER,
  ADD_CODE_VERSION,
  CANCEL,
} from "../../utils/Messages";
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

const AddVersion = (props) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearError,
    errors,
  } = useForm({ mode: "onBlur" });
  const isCodeVersionAdded = useSelector(
    (state) => state.CodeVersion.isCodeVersionAdded
  );
  //const codeVersionDetailsList = useSelector((state) => state.CodeVersion.codeVersionDetailsList);
  const addApiError = useSelector((state) => state.CodeVersion.addError);
  //const [prevList, setPrevList] = useState([]);
  const [isSubmited, setIsSubmited] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [versionType, setVersionType] = useState("");

  const handleCloseForm = useCallback(() => {
    setIsSubmited(false);
    setApiError(null);
    setVersionType("");
    clearError();
    props.handleClose();
  }, [props, clearError, setVersionType]);

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

    if (!!addApiError) {
      setIsSubmited(false);
      setApiError(handleAddCodeVersionError(addApiError));
    }

    if (addApiError.responseCode && addApiError.responseCode === "2171") {
      setIsSubmited(false);
      setApiError(null);
      setError("codeVersion", "notMatch", CODEVERSION_ALREADY_EXIST_MSG);
    }

    if (isCodeVersionAdded) {
      handleCloseForm();
    }

  }, [
    addApiError,
    clearError,
    handleCloseForm,
    register,
    setValue,
    versionType,
    isCodeVersionAdded,
    setError,
  ]);

  let handleChange = (e) => {
    dispatch({ type: RESET_DUPLICATE_ERROR });
    setApiError(null);
    if (e.target.name === "versionType") setVersionType(e.target.value);
  };

  const handleCreateVersion = () => {
    setIsSubmited(true);
    const watchAllFields = watch();
    dispatch(addCodeVersion(watchAllFields));
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
        {ADD_NEW_CODE_VER}
      </DialogTitle>
      <form
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(handleCreateVersion)}
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
                required
                label="Code Version"
                name="codeVersion"
                onChange={handleChange}
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
                  value={versionType}
                  name="versionType"
                  onChange={handleChange}
                >
                  <MenuItem value="Released">Released</MenuItem>
                  <MenuItem value="Unreleased">Unreleased</MenuItem>
                </MaterialTextField>
                <FormHelperText>
                  {errors.versionType ? errors.versionType.message : " "}
                </FormHelperText>
              </MatFormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <MatButton color="primary" onClick={handleCloseForm}>
            {CANCEL}
          </MatButton>
          <MatButton type="submit" disabled={isSubmited}>
            {ADD_CODE_VERSION}
          </MatButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddVersion;
