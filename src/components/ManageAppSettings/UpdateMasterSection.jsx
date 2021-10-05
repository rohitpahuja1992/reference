import React, { useState, useCallback, useEffect } from "react";
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
  updateMasterSection,
  resetUpdateError,
  resetDuplicateError,
} from "../../actions/MasterSectionActions";
import { formatDate } from "../../utils/helpers";
import { NAME_PATTERN } from "../../utils/AppConstants";
import { COMMON_ERROR_MESSAGE, ENTER_VALID_SEC, MAXIMUN_CHARACTER_ALLOWED_MSG, MAX_4000_CHAR_ALLOWED, SEL_NAME_ALREADY_EXIST, SEL_NAME_MANADTORY } from "../../utils/Messages";

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
    //marginBottom: '14px'
  },
}));

// const controls = [
//     { value: 'form', label: 'Form', icon: '' },
//     { value: 'question', label: 'Question', icon: '' },
//     { value: 'table', label: 'Table', icon: '' },
//     { value: 'section', label: 'Section', icon: '' }
// ];

const UpdateMasterSection = (props) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    //setValue,
    clearError,
    setError,
    errors,
    formState,
    reset,
  } = useForm({ mode: "onBlur" });
  let { dirty } = formState;
  const [isEditable, setIsEditable] = useState(false);
  const putApiError = useSelector((state) => state.MasterSection.putError);
  const [apiError, setApiError] = useState(null);
  const isSectionUpdated = useSelector(
    (state) => state.MasterSection.isSectionUpdated
  );
  const sectionDetailsById = useSelector(
    (state) => state.MasterSection.sectionDetailsById.data
  );
  const [isSelectionChanged, setSelectionChanged] = useState(false);

  const defaultFormData = {
    sectionName: sectionDetailsById.name,
    description: sectionDetailsById.description,
    createdBy: sectionDetailsById.createdByUser,
    createdDate: formatDate(sectionDetailsById.createdDate),
    updatedBy: sectionDetailsById.updatedByUser,
    updatedDate: formatDate(sectionDetailsById.updatedDate),
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

  const handleUpdateMasterSection = () => {
    setSelectionChanged(false);
    const watchAllFields = watch();
    dispatch(updateMasterSection(sectionDetailsById.id, watchAllFields));
  };

  useEffect(() => {
    if (
      putApiError &&
      !(putApiError.responseCode === "201" || putApiError.responseCode === 201)
    ) {
      setApiError(true);
    }
    if (
      putApiError.responseMessage &&
      putApiError.responseMessage.includes("Section name") &&
      putApiError.responseMessage.includes("exist")
    ) {
      setApiError(false);
      setError("sectionName", "notMatch", SEL_NAME_ALREADY_EXIST);
    }

    if (isSectionUpdated) {
      handleCloseForm();
      dispatch(resetDuplicateError());
    }
  }, [dispatch, putApiError, setError, isSectionUpdated, handleCloseForm]);

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
        {sectionDetailsById.name}
      </DialogTitle>
      <form
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(handleUpdateMasterSection)}
        id="updateMasterSection"
      >
        <DialogContent dividers="true">
          {apiError ? (
            <Grid item xs={12} className={styles.col}>
              <Card className={styles.errorCard}>
                <Typography variant="body2">
                  {COMMON_ERROR_MESSAGE}
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
                    message: SEL_NAME_MANADTORY,
                  },
                  pattern: {
                    value: NAME_PATTERN,
                    message: ENTER_VALID_SEC,
                  },
                  maxLength: {
                    value: 50,
                    message: MAXIMUN_CHARACTER_ALLOWED_MSG,
                  },
                })}
                required
                error={errors.sectionName ? true : false}
                helperText={errors.sectionName?.message}
                name="sectionName"
                label="Section Name"
                defaultValue={defaultFormData.sectionName}
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
              <MatButton onClick={handleEdit}>Edit Section</MatButton>
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

export default UpdateMasterSection;
