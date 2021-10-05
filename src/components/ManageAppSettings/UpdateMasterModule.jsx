import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

import { makeStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Paper from "@material-ui/core/Paper";
import Switch from "@material-ui/core/Switch";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
//import MenuItem from "@material-ui/core/MenuItem";

import MatButton from "../MaterialUi/MatButton";
import MaterialTextField from "../MaterialUi/MatTextField";
import {
  updateMasterModule,
  fetchAllMasterModule,
  resetUpdateError,
  resetDuplicateError,
} from "../../actions/MasterModuleActions";
import { formatDate } from "../../utils/helpers";
import { UPDATE_ACTION_APP_SETTINGS } from "../../utils/FeatureConstants";
import { CAT_MANDATORY, COMMON_ERROR_MESSAGE, MAXIMUN_CHARACTER_ALLOWED_MSG, MAX_4000_CHAR_ALLOWED, MODULE_ALREADY_EXIST, VAL_MODULENAME, handleAddModuleError } from "../../utils/Messages";
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

const UpdateMasterModule = (props) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
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

    const moduleDetailsList = useSelector((state) =>
        state.MasterModule?.allList || []
    );
  const moduleDetailsById = useSelector(
    (state) => state.MasterModule.moduleDetailsById.data
  );
  const featuresAssigned = useSelector((state) => state.User.features);
  // const categoryOptions = useSelector(
  //   (state) => state.ModuleConfig.configModuleList
  // );
  const [isSelectionChanged, setSelectionChanged] = useState(false);
  const [checked, setChecked] = useState(moduleDetailsById.global);
  const defaultFormData = {
    moduleName: moduleDetailsById.moduleName,
    shortName: moduleDetailsById.shortName,
    isGlobal: moduleDetailsById.global,
    //category: moduleDetailsById.category,
    description: moduleDetailsById.description,
    createdBy: moduleDetailsById.createdByUser,
    createdDate: formatDate(moduleDetailsById.createdDate),
    updatedBy: moduleDetailsById.updatedByUser,
    updatedDate: formatDate(moduleDetailsById.updatedDate),
  };
  const [inputs, setInputs] = useState(defaultFormData);

  let handleChange = (e) => {
    const { name, value } = e.target;
    // console.log(defaultFormData?.moduleName)
    // console.log("value", value)
    if(defaultFormData?.moduleName!==value){
      setSelectionChanged(true);
    }else{
      setSelectionChanged(false);
    }
    dispatch(resetUpdateError());
    setApiError(false);

    if (name === "isGlobal") {
      setChecked((prev) => !prev);
    }
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
    setChecked(defaultFormData.isGlobal);
    setInputs(defaultFormData);
    setIsEditable(false);
    setSelectionChanged(false);
    dispatch(resetUpdateError());
    setApiError(false);
  };

  const handleEdit = () => {
    setIsEditable(true);
  };

  const handleUpdateMasterModule = () => {
    setSelectionChanged(false);
    // const watchAllFields = watch();
    // console.log("WATCH",watchAllFields);
    //console.log("INPUTS",inputs);
    dispatch(updateMasterModule(moduleDetailsById.id, inputs));
  };

  useEffect(() => {
    if (
      putApiError &&
      !(putApiError.responseCode === "201" || putApiError.responseCode === 201)
    ) {
      setApiError(handleAddModuleError(inputs.moduleName, putApiError));
    }
    else
      setApiError(false);
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
      dispatch(fetchAllMasterModule());
      dispatch(resetDuplicateError());
    }
  }, [dispatch, putApiError, setError, isModuleUpdated, handleCloseForm]);

  // useEffect(() => {
  //   console.log(inputs.category);
  //   if (inputs.category) {
  //     setValue("category", inputs.category);
  //     clearError("category");
  //   } else {
  //     register(
  //       { name: "category" },
  //       {
  //         required: { value: true, message: CAT_MANDATORY },
  //       }
  //     );
  //   }
  // }, [inputs.category, register, setValue, clearError]);
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
        onSubmit={handleSubmit(handleUpdateMasterModule)}
        id="updateMasterModule"
      >
        <DialogContent dividers="true">
          {apiError ? (
            <Grid item xs={12} className={styles.col}>
              <Card className={styles.errorCard}>
                <Typography variant="body2">
                  {apiError.message}
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
                    message: MODULE_ALREADY_EXIST,
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9-_\s]*$/,
                    message: VAL_MODULENAME,
                  },
                  maxLength: {
                    value: 50,
                    message: MAXIMUN_CHARACTER_ALLOWED_MSG,
                  },
                })}
                required
                error={errors.moduleName ? true : false}
                helperText={errors.moduleName?.message}
                name="moduleName"
                label="Module Name"
                defaultValue={defaultFormData.moduleName}
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
                  required: { value: true, message: "Module abbreviation is mandatory" },
                  pattern: {
                    value: /^[a-zA-Z0-9-_\s]*$/,
                    message: "Enter valid module abbreviation",
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
                name="shortName"
                label="Module abbreviation"
                defaultValue={defaultFormData.shortName}
              />
            </Grid>
            {(moduleDetailsList?.filter(a => a.global).length === 0 || defaultFormData?.isGlobal) &&
            <Grid item xs={12} className={styles.col}>
              <Paper variant="outlined">
                <FormControlLabel
                  className={styles.label}
                  control={
                    <Switch
                      color="secondary"
                      checked={checked}
                      disabled={!isEditable}
                      disableRipple
                    />
                  }
                  inputRef={register}
                  onChange={handleChange}
                  label="Is Global Module?"
                  name="isGlobal"
                  labelPlacement="end"
                />
              </Paper>
            </Grid>
            }
            {/* <Grid item xs={12} className={styles.col}>
              <MaterialTextField
                select
                onChange={handleChange}
                inputRef={register}
                disabled={!isEditable}
                InputLabelProps={{
                  shrink: true,
                }}
                error={errors.category ? true : false}
                value={inputs.category}
                helperText={errors.category ? errors.category.message : " "}
                label="Category"
                name="category"
                required
              >
                {categoryOptions &&
                  categoryOptions.map((option) => (
                    <MenuItem value={option}>{option}</MenuItem>
                  ))}
              </MaterialTextField>
            </Grid> */}
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
            {/* <Grid item xs={6} className={styles.col}>
                            <MaterialTextField
                                name="createdBy" label="Created By"
                                defaultValue={defaultFormData.createdBy}
                                disabled
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={6} className={styles.col}>
                            <MaterialTextField
                                name="createdDate" label="Created Date"
                                defaultValue={defaultFormData.createdDate}
                                disabled
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid> */}
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
              {featuresAssigned.indexOf(UPDATE_ACTION_APP_SETTINGS) !== -1 && (
              <MatButton onClick={handleEdit}>Edit Module</MatButton>
              )}
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

export default UpdateMasterModule;
