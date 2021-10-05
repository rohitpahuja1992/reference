import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { showMessageDialog } from "../../actions/MessageDialogActions";
import { makeStyles, FormHelperText } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import ListSubheader from '@material-ui/core/ListSubheader';
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from '@material-ui/core/InputAdornment';
import ListItemText from "@material-ui/core/ListItemText";
import MatSelect from "../MaterialUi/MatSelect";
import MatButton from "../MaterialUi/MatButton";
import MaterialTextField from "../MaterialUi/MatTextField";
import MatFormControl from "../MaterialUi/MatFormControl";
import {
  updateMasterMessage,
  // resetUpdateError,
  // resetDuplicateError,
} from "../../actions/MasterMessageActions";
import { RESET_UPDATE_ERROR, RESET_DUPLICATE_ERROR } from "../../utils/AppConstants";
import { defaultControlProperty } from "../../utils/ConfigConstants";
import {
  MODULE_ASSI_MAND,
  // CONTROL_PROPERTY_MANDATORY,
  // MIN_CODE_VERSION_MANDATORY_MSG,
  // ADD_MESSAGE_DIALOG,
  // COMMON_ERROR_MESSAGE,
  MAXIMUN_CHARACTER_ALLOWED_MSG,
  MSGCONST_ALREADY_EXIST,
  MSGCONST_MANDATORY,
  SYSVARIABLEDESC_MANDATORY,
  handleUpdateMasterMessageError,
  MSG_CONST_ALREADY_AVAILABLE,
  PLEASE_ACKN
} from "../../utils/Messages";
import { UPDATE_ACTION_APP_SETTINGS } from "../../utils/FeatureConstants";

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
  disableClick: {
    pointerEvents: "none",
  },
}));

const UpdateMasterMessage = (props) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    //watch,
    setValue,
    clearError,
    setError,
    errors,
    formState,
    reset,
  } = useForm({ mode: "onBlur" });
  let { dirty } = formState;
  const [isEditable, setIsEditable] = useState(false);
  const [isMaxDisabled, setIsMaxDisabled] = useState(false);
  const codeVersion = useSelector(state => state.CodeVersion.codeVersionDetailsList.list && state.CodeVersion.codeVersionDetailsList.list.filter(obj => !obj.deleted).sort((a, b) => (a.codeVersion > b.codeVersion ? 1 : -1)));
  codeVersion.sort( (a, b) => 
    a.codeVersion.replace(/\d+/g, n => +n+100000 )
    .localeCompare(b.codeVersion.replace(/\d+/g, n => +n+100000 ))
  );
  const [maxList, setMaxList] = useState([]);
  const putApiError = useSelector((state) => state.MasterMessage.putError);
  const [apiError, setApiError] = useState(null);
  const featuresAssigned = useSelector(
    (state) => state.User.features
  );
  const moduleDetailsList = useSelector((state) =>
    state.MasterModule.moduleDetailsList.list?.filter(item => !item.deleted)?.sort((a, b) =>
      a.moduleName > b.moduleName ? 1 : -1
    )
  );
  const isMessageUpdated = useSelector(
    (state) => state.MasterMessage.isMessageUpdated
  );
  const messageDetailsById = useSelector(
    (state) => state.MasterMessage.messageDetailsById.data
  );
  const [isSelectionChanged, setSelectionChanged] = useState(false);

  const defaultFormData = {
    id: messageDetailsById.id,
    msgConst: messageDetailsById.messageConstant,
    shortDescription: messageDetailsById.description,
    moduleIds: messageDetailsById.modules && messageDetailsById.modules.map(id => id.id),
    minCV: messageDetailsById.minCodeVersion,
    maxCV: messageDetailsById.maxCodeVersion,
    controlProperty: messageDetailsById.controlCategory,
  };

  const [inputs, setInputs] = useState(defaultFormData);

  const {
    msgConst,
    shortDescription,
    moduleIds,
    minCV,
    maxCV,
    controlProperty,
  } = inputs;
  let errorComes = [];
  const shortDescriptionList = useSelector((state) =>
    state.MasterMessage.allList.map(item => item.description).filter(a => a !== messageDetailsById.description))
  const dupValid = (name, value) => {
    if (name === "shortDescription") {
      let result = shortDescriptionList.indexOf(value);
      if (result !== -1) {
        setError(name, "notMatch", "This short description is already exist");
        errorComes.push("notMatch");
      } else {
        clearError(name);
        errorComes.push("Match");
      }
    }
  };

  let handleChange = (e) => {
    setSelectionChanged(true);
    dispatch({ type: RESET_UPDATE_ERROR });
    const { name, value } = e.target;
    dupValid(name, value);
    if (name === 'minCV')
      setInputs((inputs) => ({ ...inputs, maxCV: "" }));

    if (name === 'minCV' && value !== codeVersion[codeVersion.length - 1].codeVersion) {
      setIsMaxDisabled(false);
      const index = codeVersion.findIndex(obj => obj.codeVersion === value);
      setMaxList(codeVersion.slice(index + 1));
    }
    if (name === 'minCV' && value === codeVersion[codeVersion.length - 1].codeVersion)
      setIsMaxDisabled(true);
    setInputs((inputs) => ({ ...inputs, [name]: value }));
    setApiError(false);
  };

  const handleSelectValue = (selected, list, type) => {
    return selected.map((id) => (
      <Chip
        key={id}
        label={list.filter((data) => data.id === id)[0][type]}
        className={styles.chip}
      />
    ));
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
    dispatch({ type: RESET_UPDATE_ERROR });
    setApiError(false);
  };

  const handleEdit = () => {
    setIsEditable(true);
  };

  const handleUpdateMasterMessage = (e) => {
    dupValid("shortDescription", e.shortDescription);
    setSelectionChanged(false);
    let payloadJson = {
      id: inputs.id,
      controlCategory: inputs.controlProperty,
      description: inputs.shortDescription.trim(),
      maxCodeVersion: inputs.maxCV,
      messageConstant: inputs.msgConst.trim(),
      minCodeVersion: inputs.minCV,
      moduleIds: inputs.moduleIds
    };
    if (errorComes.indexOf("notMatch") === -1) {
      dispatch(updateMasterMessage(payloadJson));
    }
  };

  useEffect(() => {
    if (
      putApiError &&
      !(putApiError.responseCode === "201" || putApiError.responseCode === 201)
    ) {
      setApiError(handleUpdateMasterMessageError(putApiError));
    }

    if (
      putApiError.responseCode &&
      putApiError.responseCode === "9150"
    ) {
      setApiError(false);
      setError("msgConst", "notMatch", MSGCONST_ALREADY_EXIST);
    }

    if (isMessageUpdated) {
      handleCloseForm();
      dispatch({ type: RESET_DUPLICATE_ERROR });;
    }
  }, [dispatch, putApiError, setError, isMessageUpdated, handleCloseForm]);

  useEffect(() => {
    if (moduleIds.length !== 0) {
      setValue("moduleIds", moduleIds);
      clearError("moduleIds");
    } else {
      register(
        { name: "moduleIds" },
        { required: { value: true, message: MODULE_ASSI_MAND } }
      );
    }
  }, [clearError, moduleIds, register, setValue]);

  useEffect(() => {
    if (messageDetailsById.minCodeVersion !== codeVersion[codeVersion.length - 1].codeVersion) {
      setIsMaxDisabled(false);
      const index = codeVersion.findIndex(obj => obj.codeVersion === messageDetailsById.minCodeVersion);
      setMaxList(codeVersion.slice(index + 1));
    }
    if (messageDetailsById.minCodeVersion === codeVersion[codeVersion.length - 1].codeVersion)
      setIsMaxDisabled(true);
  }, []);

  useEffect(() => {
    if(messageDetailsById?.used) {
        let messageObj = {
            primaryButtonLabel: "OK",
            primaryButtonAction: () => {},
            title: PLEASE_ACKN,
            message: MSG_CONST_ALREADY_AVAILABLE,
          };
          dispatch(showMessageDialog(messageObj));
    }
},[messageDetailsById?.used])

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      open={props.open}
      onClose={props.handleClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle className={styles.dialogTitle}>
        {messageDetailsById.messageConstant}
      </DialogTitle>
      <form
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(handleUpdateMasterMessage)}
        id="updateMasterMessage"
      >
        <DialogContent dividers="true">
          {apiError ? (
            <Grid item xs={12} className={styles.col}>
              <Card className={apiError.messageType === "error" ? styles.errorCard : styles.warningCard}>
                <Typography variant="body2">
                  {apiError.message}
                </Typography>
              </Card>
            </Grid>
          ) : null}
          <Grid container className={styles.row}>
            <Grid item xs={4} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  required: {
                    value: true,
                    message: MSGCONST_MANDATORY,
                  },
                  maxLength: {
                    value: 50,
                    message: MAXIMUN_CHARACTER_ALLOWED_MSG,
                  },
                })}
                InputLabelProps={{
                  shrink: true,
                }}
                error={errors.msgConst ? true : false}
                helperText={errors.msgConst?.message}
                defaultValue={msgConst}
                disabled={!isEditable}
                onChange={handleChange}
                required
                name="msgConst"
                label="Message Constant"
              />
            </Grid>
            <Grid item xs={8} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  required: {
                    value: true,
                    message: SYSVARIABLEDESC_MANDATORY,
                  },
                  maxLength: {
                    value: 50,
                    message: MAXIMUN_CHARACTER_ALLOWED_MSG,
                  },
                })}
                InputProps={{
                  endAdornment: (<InputAdornment position="end" className={styles.input}>{shortDescription?.length}/50</InputAdornment>)
                }}
                inputProps={{
                  maxlength: 50,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                error={errors.shortDescription ? true : false}
                helperText={errors.shortDescription?.message}
                defaultValue={shortDescription}
                disabled={!isEditable}
                onChange={handleChange}
                required
                name="shortDescription"
                label="Short Description"
              />
            </Grid>
            <Grid item xs={4} className={styles.col}>
              <MatFormControl
                required
                error={errors.moduleIds ? true : false}
                variant="filled"
                size="small"
              >
                <InputLabel>Module(s)</InputLabel>
                <MatSelect
                  multiple
                  value={moduleIds}
                  name="moduleIds"
                  disabled={!isEditable}
                  onChange={handleChange}
                  renderValue={(selected) =>
                    handleSelectValue(selected, moduleDetailsList, "moduleName")
                  }
                >
                  {moduleDetailsList.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      <Checkbox
                        checked={moduleIds.some((id) => id === option.id)}
                      />
                      <ListItemText primary={option.moduleName} />
                    </MenuItem>
                  ))}
                </MatSelect>
                <FormHelperText>
                  {errors.moduleIds ? errors.moduleIds.message : " "}
                </FormHelperText>
              </MatFormControl>
            </Grid>
            <Grid item xs={4} className={styles.col}>
              <MatFormControl required disabled={!isEditable} error={errors.minCV ? true : false}
                variant="filled" size="small">
                <InputLabel>Minimum Code Version</InputLabel>
                <MatSelect
                  value={minCV}
                  name="minCV"
                  onChange={handleChange}>
                  <ListSubheader disableSticky={true} className={styles.disableClick}>Released</ListSubheader>
                  {codeVersion.filter(type => type.type === 'RELEASED').sort((a, b) => (a.codeVersion > b.codeVersion ? 1 : -1)).map((option, key) => (
                    <MenuItem key={option.id} value={option.codeVersion}>
                      {option.codeVersion}
                    </MenuItem>
                  ))}
                  <ListSubheader disableSticky={true} className={styles.disableClick}>Unreleased</ListSubheader>
                  {codeVersion.filter(type => type.type === 'UNRELEASED').sort((a, b) => (a.codeVersion > b.codeVersion ? 1 : -1)).map((option, key) => (
                    <MenuItem key={option.id} value={option.codeVersion}>
                      {option.codeVersion}
                    </MenuItem>
                  ))}
                </MatSelect>
                <FormHelperText>{errors.minCV ? errors.minCV.message : " "}</FormHelperText>
              </MatFormControl>
            </Grid>
            <Grid item xs={4} className={styles.col}>
              <MatFormControl disabled={!isEditable || isMaxDisabled} error={errors.maxCV ? true : false}
                variant="filled" size="small">
                <InputLabel>Maximum Code Version</InputLabel>
                <MatSelect
                  value={maxCV}
                  name="maxCV"
                  onChange={handleChange}>
                  <ListSubheader disableSticky={true} className={styles.disableClick}>Released</ListSubheader>
                  {maxList.filter(type => type.type === 'RELEASED').map((option, key) => (
                    <MenuItem key={option.id} value={option.codeVersion}>
                      {option.codeVersion}
                    </MenuItem>
                  ))}
                  <ListSubheader disableSticky={true} className={styles.disableClick}>Unreleased</ListSubheader>
                  {maxList.filter(type => type.type === 'UNRELEASED').map((option, key) => (
                    <MenuItem key={option.id} value={option.codeVersion}>
                      {option.codeVersion}
                    </MenuItem>
                  ))}
                </MatSelect>
                <FormHelperText>{errors.maxCV ? errors.maxCV.message : " "}</FormHelperText>
              </MatFormControl>
            </Grid>
            <Grid item xs={4} className={styles.col}>
              <MaterialTextField
                error={errors.controlProperty ? true : false}
                helperText={
                  errors.controlProperty ? errors.controlProperty.message : " "
                }
                select
                required
                label="Control Category"
                onChange={handleChange}
                disabled={!isEditable}
                value={controlProperty}
                name="controlProperty"
              >
                {defaultControlProperty.map((option, key) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.value}
                  </MenuItem>
                ))}
              </MaterialTextField>
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
                <MatButton onClick={handleEdit}>Edit Message Definition</MatButton>}
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

export default UpdateMasterMessage;
