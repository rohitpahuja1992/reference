import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import MatButton from "../MaterialUi/MatButton";
import MaterialTextField from "../MaterialUi/MatTextField";
import {
  addMasterSubmodule,
  resetDuplicateError,
} from "../../actions/MasterSubmoduleActions";
import { ADD_NEW_SUBMODULE, handleAddMasterSubmoduleError, ENTER_VALID_SUB, MAXIMUN_CHARACTER_ALLOWED_MSG, MAX_4000_CHAR_ALLOWED, SUB_NAME_EXIST, SUB_NAME_MANDATORY } from "../../utils/Messages";
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
    marginBottom: "14px",
},
}));

const AddMasterSubmodule = (props) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearError,
    errors,
  } = useForm({ mode: "onBlur" });
  const [isSubmited, setIsSubmited] = useState(false);
  //const [isSelectionChanged, setSelectionChanged] = useState(false);
  const isSubmoduleAdded = useSelector(
    (state) => state.MasterSubmodule.isSubmoduleAdded
  );
  const [apiError, setApiError] = useState(null);
  const addApiError = useSelector((state) => state.MasterSubmodule.addError);

  const handleCloseForm = useCallback(() => {
    setIsSubmited(false);
    clearError();
    props.handleClose();
  }, [props, clearError]);

  let handleChange = (e) => {
    dispatch(resetDuplicateError());
    setApiError(false);
    //setSelectionChanged(true);
  };

  useEffect(() => {
    if (!!addApiError) {
      setIsSubmited(false);
    }

    if (
      addApiError &&
      !(addApiError.responseCode === "201")
    ) {
      setApiError(handleAddMasterSubmoduleError(addApiError));
    }
    if (
      addApiError.responseCode && addApiError.responseCode === "2043"
    ) {
      setIsSubmited(false);
      setApiError(false);
      setError("submoduleName", "notMatch", SUB_NAME_EXIST);
    }

    if (isSubmoduleAdded) {
      handleCloseForm();
      dispatch(resetDuplicateError());
    }
  }, [dispatch, addApiError, setError, isSubmoduleAdded, handleCloseForm]);

  const handleCreateSubmodule = () => {
    setIsSubmited(true);
    const watchAllFields = watch();
    dispatch(addMasterSubmodule(watchAllFields));
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
        {ADD_NEW_SUBMODULE}
      </DialogTitle>
      <form
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(handleCreateSubmodule)}
      >
        <DialogContent dividers="true">
          {apiError ? (
            <Grid item xs={12} className={styles.col}>
              <Card className={apiError.messageType === "error" ? styles.errorCard : styles.warningCard}>
                <Typography variant="body2">{apiError.message}</Typography>
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
                error={errors.submoduleName ? true : false}
                helperText={errors.submoduleName?.message}
                onChange={handleChange}
                required
                name="submoduleName"
                label="Component Name"
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
                //({ required: { value: true, message: "Description is Mandatory" }, minLength: { value: 5, message: "Minimum 5 characters" } })
                error={errors.description ? true : false}
                helperText={errors.description?.message}
                onChange={handleChange}
                //required
                multiline
                rows={4}
                name="description"
                label="Description"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <MatButton color="primary" onClick={handleCloseForm}>
            Cancel
          </MatButton>
          <MatButton type="submit" disabled={isSubmited}>
            Add Component
          </MatButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddMasterSubmodule;
