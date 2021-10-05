import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
//import Typography from '@material-ui/core/Typography';
//import Card from '@material-ui/core/Card';
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import MatButton from "../MaterialUi/MatButton";
import MenuItem from "@material-ui/core/MenuItem";
import MaterialTextField from "../MaterialUi/MatTextField";
import { updateModule } from "../../actions/ModuleActions";
import { NAME_PATTERN } from "../../utils/AppConstants";
import { useState } from "react";
import {
  MAXIMUN_CHARACTER_ALLOWED_MSG,
  MAX_4000_CHAR_ALLOWED,
  MODULE_NAME_MANDATORY,
  MOD_ALREADY_EXISTS,
  VAL_MODULENAME,
} from "../../utils/Messages";

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
}));

const UpdateModule = (props) => {
  const styles = useStyles();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearError,
    errors,
  } = useForm();
  const [status, setStatus] = useState("");
  const dispatch = useDispatch();
  //const moduleDetailsList = useSelector(state => state.Module.moduleDetailsList);
  const putApiError = useSelector((state) => state.Module.putError);
  const updated = useSelector((state) => state.Module.isModuleUpdated);
  const [isSubmited, setIsSubmited] = useState(false);
  //const [apiError, setApiError] = useState(null);

  const handleCloseForm = useCallback(() => {
    setIsSubmited(false);
    clearError();
    props.handleClose();
  }, [props, clearError]);

  useEffect(() => {
    register({ name: "status" });
    if (status.length > 0) setValue("status", status);
    else setValue("status", props.data.status);

    if (!!putApiError) {
      setIsSubmited(false);
    }

    if (
      putApiError.responseMessage &&
      putApiError.responseMessage.includes("Duplicate")
    ) {
      setIsSubmited(false);
      setError("moduleName", "notMatch", MOD_ALREADY_EXISTS);
    }

    if (updated) {
      handleCloseForm();
      setIsSubmited(false);
      // props.handleClose();
    }
  }, [
    handleCloseForm,
    putApiError,
    register,
    setError,
    setValue,
    status,
    updated,
    props.data,
  ]);

  const handleChange = (e) => {
    setStatus(e.target.value);
  };

  const handleUpdateModule = () => {
    setIsSubmited(true);
    const watchAllFields = watch();
    dispatch(updateModule(watchAllFields));
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
        {props.selectedMenu === "UPDATE"
          ? "Update Module"
          : "View Module Details"}
      </DialogTitle>
      <form
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(handleUpdateModule)}
      >
        <DialogContent dividers="true">
          <Grid container className={styles.row}>
            {/* {apiError ?
                            <Grid item xs={12} className={styles.col}>
                                <Card className={styles.errorCard}>
                                    <Typography variant="body2">OOPS! Something went wrong. Please try again.</Typography>
                                </Card>
                            </Grid>
                            : null} */}
            {/* <Grid item xs={4} className={styles.col}>
                            <MaterialTextField inputRef={register}
                                name="moduleId" label="Module ID"
                                value={props.data.id} disabled={true} />
                        </Grid> */}
            <Grid item xs={6} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  required: { value: true, message: MODULE_NAME_MANDATORY },
                  pattern: { value: NAME_PATTERN, message: VAL_MODULENAME },
                  maxLength: {
                    value: 50,
                    message: MAXIMUN_CHARACTER_ALLOWED_MSG,
                  },
                })}
                required={props.selectedMenu === "UPDATE" ? true : false}
                error={errors.moduleName ? true : false}
                helperText={errors.moduleName?.message}
                name="moduleName"
                label="Module Name"
                defaultValue={props.data.moduleName}
                disabled={props.selectedMenu === "UPDATE" ? false : true}
              />
            </Grid>
            <Grid item xs={6} className={styles.col}>
              <MaterialTextField
                onChange={handleChange}
                select
                label="Status"
                id="status"
                name="status"
                disabled={props.selectedMenu === "UPDATE" ? false : true}
                SelectProps={{
                  defaultValue: props.data.statusDialog,
                }}
              >
                <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                <MenuItem value="INACTIVE">INACTIVE</MenuItem>
                {props.data.deleted && (
                  <MenuItem value="TERMINATED">TERMINATED</MenuItem>
                )}
              </MaterialTextField>
            </Grid>
            <Grid item xs={12} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  maxLength: { value: 4000, message: MAX_4000_CHAR_ALLOWED },
                })}
                //required={props.selectedMenu === 'UPDATE' ? true : false}
                error={errors.description ? true : false}
                helperText={errors.description?.message}
                multiline
                rows={4}
                name="description"
                label="Description"
                defaultValue={props.data.description}
                disabled={props.selectedMenu === "UPDATE" ? false : true}
              />
            </Grid>
            {/* <Grid item xs={6} className={styles.col}>
                    <MaterialTextField name="createdBy" label="Created By" value={props.data.createdBy} disabled={true}/>
                </Grid>
                <Grid item xs={6} className={styles.col}>
                    <MaterialTextField  name="createdDate" label="Created Date" value={props.data.createdAt} disabled={true} />
                </Grid>
                <Grid item xs={6} className={styles.col}>
                    <MaterialTextField  name="lastUpdatedBy" label="Last Updated By" value={props.data.updatedBy} disabled={true} />
                </Grid>
                <Grid item xs={6} className={styles.col}>
                    <MaterialTextField name="lastUpdatedDate" label="Last Updated Date" value={props.data.updatedAt} disabled={true}/>
                </Grid> */}
          </Grid>
        </DialogContent>
        <DialogActions>
          <MatButton color="primary" onClick={handleCloseForm}>
            Cancel
          </MatButton>
          {props.selectedMenu === "UPDATE" && (
            <MatButton type="submit" disabled={isSubmited}>
              Update Module
            </MatButton>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UpdateModule;
