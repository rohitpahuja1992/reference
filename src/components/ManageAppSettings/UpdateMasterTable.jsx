import React, { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

import { makeStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import MatButton from "../MaterialUi/MatButton";
import MaterialTextField from "../MaterialUi/MatTextField";
import {
  updateMasterSubmodule,
  resetUpdateError,
  //resetDuplicateError,
} from "../../actions/MasterSubmoduleActions";
import { formatDate } from "../../utils/helpers";
import {
  // SUB_ASSOCIATE_OOB,
  // SUB_NAME_EXIST,
  COMMON_ERROR_MESSAGE,
  SUB_NAME_MANDATORY,
  ENTER_VALID_SUB,
  MAXIMUN_CHARACTER_ALLOWED_MSG,
  MAX_4000_CHAR_ALLOWED,
} from "../../utils/Messages";
import { UPDATE_ACTION_APP_SETTINGS } from "../../utils/FeatureConstants";
//import { NAME_PATTERN } from "../../utils/AppConstants";

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
    marginBottom: '14px'
  },
  warningCard: {
    background: theme.palette.warning.main,
    boxShadow: "none !important",
    color: "#ffffff",
    padding: "12px 16px",
    marginBottom: '14px'
  },
}));

const UpdateMasterTable = (props) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    //setValue,
    clearError,
    //setError,
    errors,
    formState,
    reset,
  } = useForm({ mode: "onBlur" });
  let { dirty } = formState;
  const [isEditable, setIsEditable] = useState(false);
  const putApiError = useSelector((state) => state.MasterSubmodule.putError);
  const [apiError, setApiError] = useState(null);
  const featuresAssigned = useSelector(
    (state) => state.User.features
  );
  // const isSubmoduleUpdated = useSelector(
  //   (state) => state.MasterSubmodule.isSubmoduleUpdated
  // );
  const submoduleDetailsById = useSelector(
    (state) => state.MasterSubmodule.submoduleDetailsById.data
  );
  const [isSelectionChanged, setSelectionChanged] = useState(false);

  const defaultFormData = {
    submoduleName: submoduleDetailsById.name,
    description: submoduleDetailsById.description,
    createdBy: submoduleDetailsById.createdByUser,
    createdDate: formatDate(submoduleDetailsById.createdDate),
    updatedBy: submoduleDetailsById.updatedByUser,
    updatedDate: formatDate(submoduleDetailsById.updatedDate),
  };

  let handleChange = (e) => {
    setSelectionChanged(true);
    dispatch(resetUpdateError());
    setApiError(false);
  };

  const handleCloseForm = useCallback(() => {
    clearError();
    setIsEditable(false);
    setSelectionChanged(false);
    props.handleClose();
  }, [props, clearError]);

  const handleResetForm = () => {
    reset(defaultFormData);
    setIsEditable(false);
    setSelectionChanged(false);
    dispatch(resetUpdateError());
    setApiError(false);
  };

  const handleEdit = () => {
    setIsEditable(true);
  };

  const handleUpdateMasterSubmodule = () => {
    setSelectionChanged(false);
    const watchAllFields = watch();
    dispatch(updateMasterSubmodule(submoduleDetailsById.id, watchAllFields));
  };

  // useEffect(() => {
  //   if (
  //     putApiError &&
  //     !(putApiError.responseCode === "201" || putApiError.responseCode === 201)
  //   ) {
  //     setApiError(true);
  //   }

  //   if (putApiError.responseCode && putApiError.responseCode === "2044") {
  //     setApiError(SUB_ASSOCIATE_OOB);
  //   }

  //   if (
  //     putApiError.responseMessage &&
  //     putApiError.responseMessage.includes("Module name") &&
  //     putApiError.responseMessage.includes("exist")
  //   ) {
  //     setApiError(false);
  //     setError("submoduleName", "notMatch", SUB_NAME_EXIST);
  //   }

  //   if (isSubmoduleUpdated) {
  //     handleCloseForm();
  //     dispatch(resetDuplicateError());
  //   }
  // }, [dispatch, putApiError, setError, isSubmoduleUpdated, handleCloseForm]);

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
        {submoduleDetailsById.name}
      </DialogTitle>
      <form
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(handleUpdateMasterSubmodule)}
        id="updateMasterSubmodule"
      >
        <DialogContent dividers="true">
          {apiError ? (
            <Grid item xs={12} className={styles.col}>
              <Card className={putApiError.responseCode === "2044" ? styles.warningCard : styles.errorCard}>
                <Typography variant="body2">
                  {apiError === true ? { COMMON_ERROR_MESSAGE } : apiError}
                </Typography>
              </Card>
            </Grid>
          ) : null}
          <Grid container className={styles.row}>
            <Grid item xs={12} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  required: {
                    value: true,
                    message: SUB_NAME_MANDATORY,
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9-_\s]*$/,
                    message: ENTER_VALID_SUB,
                  },
                  maxLength: {
                    value: 50,
                    message: MAXIMUN_CHARACTER_ALLOWED_MSG,
                  },
                })}
                required
                error={errors.submoduleName ? true : false}
                helperText={errors.submoduleName?.message}
                name="submoduleName"
                label="Component Name"
                defaultValue={defaultFormData.submoduleName}
                onChange={handleChange}
                disabled={!isEditable}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  maxLength: {
                    value: 4000,
                    message: MAX_4000_CHAR_ALLOWED,
                  },
                })}
                //required={props.selectedMenu === 'UPDATE' ? true : false}
                error={errors.description ? true : false}
                helperText={errors.description?.message}
                multiline
                rows={4}
                name="description"
                label="Description"
                defaultValue={defaultFormData.description}
                onChange={handleChange}
                disabled={!isEditable}
                InputLabelProps={{
                  shrink: true,
                }}
              />
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
                <MatButton onClick={handleEdit}>Edit Component</MatButton>}
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
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UpdateMasterTable;
