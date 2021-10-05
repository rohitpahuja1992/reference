import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

import { makeStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import Paper from "@material-ui/core/Paper";
// import Switch from "@material-ui/core/Switch";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
// import MenuItem from "@material-ui/core/MenuItem";

import MatButton from "../MaterialUi/MatButton";
import MaterialTextField from "../MaterialUi/MatTextField";
import {
  updateClientModule,
  // resetUpdateError,
  resetDuplicateError,
} from "../../actions/ClientModuleActions";
// import { formatDate } from "../../utils/helpers";
import { COMMON_ERROR_MESSAGE, MAXIMUN_CHARACTER_ALLOWED_MSG, MAX_4000_CHAR_ALLOWED, MODULE_ALREADY_EXIST } from "../../utils/Messages";
//import { NAME_PATTERN } from "../../utils/AppConstants";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    fontWeight: 300,
  },
  col: {
    padding: "10px",
  },
  label: {
    margin: "0px",
  },
  errorCard: {
    background: theme.palette.error.main,
    boxShadow: "none !important",
    color: "#ffffff",
    padding: "12px 16px",
    //marginBottom: '14px'
  },
}));

const UpdateClientModule = (props) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    // setValue,
    clearError,
    setError,
    errors,
    formState,
    reset,
  } = useForm({ mode: "onBlur" });
  let { dirty } = formState;
  const [isEditable, setIsEditable] = useState(false);
  const putApiError = useSelector((state) => state.MasterModule.putError);
  const [apiError, setApiError] = useState(null);
  const isModuleUpdated = useSelector(
    (state) => state.MasterModule.isModuleUpdated
  );
  const moduleDetailsById = useSelector(
    (state) => state.ClientModule.clientModuleById.data
  );
  // const categoryOptions = useSelector(
  //   (state) => state.ModuleConfig.configModuleList
  // );
  const [isSelectionChanged, setSelectionChanged] = useState(false);
  const defaultFormData = {
    moduleName: moduleDetailsById?.module?.moduleName,
    projectLaunch: moduleDetailsById.projectLaunchDate,
    budgetedHours: moduleDetailsById.budgetedHours,
    completion: moduleDetailsById.completion,
    upcomingTask: moduleDetailsById.upcomingTask,
    overdueTask: moduleDetailsById.overdueTask,  
  };
  const [inputs, setInputs] = useState(defaultFormData?defaultFormData:{});

  let handleChange = (e) => {
    setSelectionChanged(true);
    //dispatch(resetUpdateError());
    setApiError(false);
    const { name, value } = e.target;
    
    if (name === "category") {
      setInputs((inputs) => ({ ...inputs, [name]: value }));
    } else {
      setInputs((inputs) => ({ ...inputs, [name]: watch(name) }));
    }
  };

  const handleCloseForm = useCallback(() => {
    clearError();
    setIsEditable(false);
    setSelectionChanged(false);
    props.handleClose();
  }, [props, clearError]);

  const handleResetForm = () => {
    reset(defaultFormData);
    setInputs(defaultFormData);
    setIsEditable(false);
    setSelectionChanged(false);
    //dispatch(resetUpdateError());
    setApiError(false);
  };

  const handleEdit = () => {
    setIsEditable(true);
  };

  const handleUpdateClientModule = () => {
    setSelectionChanged(false);
    // const watchAllFields = watch();
    // console.log("WATCH",watchAllFields);
    //console.log("INPUTS",inputs);
    dispatch(updateClientModule(moduleDetailsById.id, inputs));
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
      putApiError.responseMessage.includes("Module name") &&
      putApiError.responseMessage.includes("exist")
    ) {
      setApiError(false);
      setError("moduleName", "notMatch", MODULE_ALREADY_EXIST);
    }else if(putApiError.responseCode==="2035"){
      setApiError(false);
      setError("moduleName", "notMatch", putApiError.responseMessage);
    }

    if (isModuleUpdated) {
      handleCloseForm();
      dispatch(resetDuplicateError());
    }
  }, [dispatch, putApiError, setError, isModuleUpdated, handleCloseForm]);

  
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
        {moduleDetailsById.moduleName}
      </DialogTitle>
      <form
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(handleUpdateClientModule)}
        id="UpdateClientModule"
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
                name="moduleName"
                label="Module Name"
                defaultValue={defaultFormData.moduleName}
                disabled
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  required: { value: true, message: "Project launch date is mandatory" },
                  pattern: {
                    value: /^[a-zA-Z0-9-_\s]*$/,
                    message: "Enter valid date",
                  },
                
                })}
                error={errors.shortName ? true : false}
                helperText={errors.shortName?.message}
                onChange={handleChange}
                required
                disabled={!isEditable}
                name="projectLaunch"
                label="Project Launch Date"
                defaultValue={defaultFormData.projectLaunch}
              />
            </Grid>
          
            <Grid item xs={12} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  required: { value: true, message: "budget hours is mandatory" },
                  pattern: {
                    value: /^[a-zA-Z0-9-_\s]*$/,
                    message: "Enter valid numbers",
                  },
                  maxLength: {
                    value: 50,
                    message: MAXIMUN_CHARACTER_ALLOWED_MSG,
                  },
                })}
                error={errors.shortName ? true : false}
                helperText={errors.shortName?.message}
                onChange={handleChange}
                required
                disabled={!isEditable}
                name="budgetedHours"
                label="Budgeted Hours"
                defaultValue={defaultFormData.projectLaunch}
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
                rows={2}
                name="upcomingTask"
                label="Upcoming Task"
                defaultValue={defaultFormData.description}
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
                rows={2}
                name="overdueTask"
                label="Overdue Task"
                defaultValue={defaultFormData.description}
                onChange={handleChange}
                disabled={!isEditable}
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
              <MatButton onClick={handleEdit}>Edit Module</MatButton>
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

export default UpdateClientModule;
