import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, FormHelperText } from "@material-ui/core";
import { useForm } from "react-hook-form";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import MatFormControl from "../MaterialUi/MatFormControl";
import MatSelect from "../MaterialUi/MatSelect";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import MatButton from "../MaterialUi/MatButton";
import MaterialTextField from "../MaterialUi/MatTextField";
import {
  fetchDefaultVersion,
  addOOBModule,
  fetchOOBModule,
  fetchOOBModuleById,
} from "../../actions/OOBModuleActions";
import {
  handleManageModuleError,
  PATCH_VER,
  PATCH_VER_MANDATORY,
  ENTER_VALID_MIN_VERSION,
  VALID_VERSION_MES,
  MODULE_ASSI_MAND,
  VALUE_MESSAGE,
  VERSION_ALREADY_EXIST,
  CRE_VERSION,
  MAJOR_VER_MANDATORY,
  MINOR_VER_MANDATORY,
  VALID_PAT_VERSION
} from "../../utils/Messages";
import {
  SET_DEFAULT_STARTINDEX,
  DEFAULT_START_INDEX,
  RESET_DEFAULTVERSION,
  RESET_ERROR,
} from "../../utils/AppConstants";
//import {addModule} from '../../actions/ModuleActions';

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
    marginBottom: '14px'
  },
}));

const ManageModule = (props) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearError,
    errors,
  } = useForm({
    mode: "onBlur",
  });
  //const [apiError, setApiError] = useState(null);
  const [isSubmited, setIsSubmited] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [isCopy, setIsCopy] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isDraft, setIsDraft] = useState(false);
  const [selectedModule, setSelectedModule] = useState("");
  //const [isManual, setIsManual] = useState(false);
  const getVersionError = useSelector(
    (state) => state.OOBModule.getVersionError
  );
  const addApiError = useSelector((state) => state.OOBModule.addError);
  const [apiError, setApiError] = useState(null);
  const pageSize = useSelector((state) => state.OOBModule.page.pageSize);
  const defaultVersion = useSelector(
    (state) => state.OOBModule.defaultVersion.data
  );
  //const getOOBModuleByIdError = useSelector((state) => state.OOBModule.OOBModuleById.getByIdError);
  const OOBModuleById = useSelector(
    (state) => state.OOBModule.OOBModuleById.data
  );
  const isModuleAdded = useSelector((state) => state.OOBModule.isModuleAdded);
  let moduleDetailsList = useSelector((state) =>
    state.MasterModule.moduleDetailsList.list.filter(item => !item.deleted).sort((a, b) =>
      a.moduleName > b.moduleName ? 1 : -1
    )
  );
  const defaultFormData = {
    moduleName: "",
    //description: "",
    copyVersion: "",
    majorversion: "",
    minorversion: "",
    patchversion: "",
    version: "",
    versionType: "manually",
  };
  const [inputs, setInputs] = useState(defaultFormData);

  const {
    moduleName,
    copyVersion,
    majorversion,
    minorversion,
    patchversion,
    versionType,
  } = inputs;
  //const watchAllFields = watch();

  useEffect(() => {
    if (OOBModuleById.versions && OOBModuleById.versions.length > 0) {
      setIsCopy(true);
      setIsDraft(
        OOBModuleById.versions.some(
          (version) => version.oobModuleStatus === "DRAFT"
        )
      );
    } else {
      setIsCopy(false);
      setIsDraft(false);
      clearError("copyVersion");
    }
  }, [OOBModuleById, clearError]);

  useEffect(() => {
    if (getVersionError) {
      setIsDisabled(true);
      setValue("majorversion", "");
      setValue("minorversion", "");
      setValue("patchversion", "");
      clearError("majorversion");
      clearError("minorversion");
      clearError("patchversion");
    }

    if (moduleName !== "") {
      setValue("moduleName", moduleName);
      clearError("moduleName");
    } else {
      register(
        { name: "moduleName" },
        { required: { value: true, message: MODULE_ASSI_MAND } }
      );
    }

    // if (isCopy && copyVersion === "") {
    //   register({ name: "copyVersion" }, { required: { value: false, message: "Version assignment is mandatory." }, });
    // } else {
    //   setValue("copyVersion", copyVersion);
    //   clearError("copyVersion");
    // }

    // if (versionType === "manually" && (!!majorversion || !!minorversion || !!patchversion)) {
    //   let defaultversions = defaultVersion.split(".");
    //   setValue("majorversion", defaultversions[0]); setValue("minorversion", defaultversions[1]); setValue("patchversion", defaultversions[2]);
    //   clearError("majorversion"); clearError("minorversion"); clearError("patchversion");
    // } else if (versionType === "automatically") {
    //   clearError("majorversion"); clearError("minorversion"); clearError("patchversion");
    // } else {
    //   register({ name: "majorversion" }, { required: { value: true, message: "Major version assignment is mandatory.", }, });
    // }
  }, [
    dispatch,
    clearError,
    copyVersion,
    getVersionError,
    isCopy,
    moduleName,
    register,
    setValue,
  ]);

  useEffect(() => {
    if (versionType === "manually" && defaultVersion && !getVersionError) {
      let defaultversions = defaultVersion.split(".");
      setValue("majorversion", defaultversions[0]);
      setValue("minorversion", defaultversions[1]);
      setValue("patchversion", defaultversions[2]);
      setInputs((inputs) => ({
        ...inputs,
        majorversion: defaultversions[0],
        minorversion: defaultversions[1],
        patchversion: defaultversions[2],
      }));
      clearError("majorversion");
      clearError("minorversion");
      clearError("patchversion");
    }
  }, [clearError, getVersionError, setValue, versionType, defaultVersion]);

  useEffect(() => {
    setInputs((inputs) => ({
      ...inputs,
      version: majorversion + "." + minorversion + "." + patchversion,
    }));
  }, [majorversion, minorversion, patchversion]);

  useEffect(() => {
    if (props.addFor === "version" && !getVersionError) {
      setIsDisabled(false);
      setInputs((inputs) => ({ ...inputs, moduleName: props.moduleId }));
    }
  }, [props, getVersionError]);

  useEffect(() => {
    if (isModuleAdded) {
      if (props.addFor === "OOB") {
        props.resetSearchText();
        dispatch({ type: SET_DEFAULT_STARTINDEX });
        dispatch(fetchOOBModule("all", DEFAULT_START_INDEX, pageSize));
      }
      // if (props.addFor === "Global") {
      //   props.resetSearchText();
      //   dispatch({ type: SET_DEFAULT_STARTINDEX });
      //   dispatch(fetchOOBModule("global", DEFAULT_START_INDEX, pageSize));
      // }
      if (props.addFor === "version") {
        dispatch(fetchOOBModuleById(props.moduleId));
      }
      dispatch({ type: RESET_ERROR });
      props.handleClose();
    }
  }, [dispatch, props, isModuleAdded, pageSize]);

  const getCopyVersion = () => {
    let result = OOBModuleById.versions
      .filter((version) => version.oobModuleStatus !== "DRAFT")
      .sort((a, b) =>
        new Date(a.createdDate) < new Date(b.createdDate) ? 1 : -1
      );
    return result.length > 0 && result[0].version;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: RESET_ERROR });
    // if (name === 'majorversion' || name === 'minorversion' || name === 'patchversion')
    //   setIsManual(true);

    if (name === "moduleName") {
      let defaultversions = defaultVersion.split(".");
      setValue("majorversion", defaultversions[0]);
      setValue("minorversion", defaultversions[1]);
      setValue("patchversion", defaultversions[2]);
      //setIsManual(false);
      dispatch({ type: RESET_DEFAULTVERSION });
      setIsCopy(false);
      setInputs((inputs) => ({
        ...inputs,
        majorversion: "",
        minorversion: "",
        patchversion: "",
        copyVersion: "",
      }));
      dispatch(fetchOOBModuleById(value));
      dispatch(fetchDefaultVersion(value));
      setIsDisabled(false);
      let oobmodulename = moduleDetailsList.filter(
        (obj) => obj.id === parseInt(value)
      );
      setSelectedModule(oobmodulename[0].moduleName);
    }
    if (name === "versionType" && value === "automatically") {
      setIsEditable(true);
      let defaultversions = defaultVersion.split(".");
      setValue("majorversion", defaultversions[0]);
      setValue("minorversion", defaultversions[1]);
      setValue("patchversion", defaultversions[2]);
      setInputs((inputs) => ({
        ...inputs,
        majorversion: defaultversions[0],
        minorversion: defaultversions[1],
        patchversion: defaultversions[2],
      }));
      clearError("majorversion");
      clearError("minorversion");
      clearError("patchversion");
    }
    if (name === "versionType" && value === "manually") {
      setIsEditable(false);
      // let defaultversions = defaultVersion.split(".");
      // setValue("majorversion", defaultversions[0]);setValue("minorversion", defaultversions[1]);setValue("patchversion", defaultversions[2]);
      //setInputs((inputs) => ({ ...inputs, majorversion:defaultversions[0],minorversion:defaultversions[1],patchversion:defaultversions[2] }));
      //setInputs((inputs) => ({ ...inputs, [name]:watch(name),minorversion:defaultversions[1],patchversion:defaultversions[2] }));
    }
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };

  const handleCloseForm = useCallback(() => {
    setIsSubmited(false);
    setIsEditable(false);
    setIsDisabled(true);
    setInputs(defaultFormData);
    clearError();
    //setApiError(null);
    dispatch({ type: RESET_ERROR });
    props.handleClose();
  }, [dispatch, props, defaultFormData, clearError]);

  const handleAddOobModule = () => {
    if (majorversion === "0" && minorversion === "0" && patchversion === "0")
      setError("patchversion", "notMatch", VALUE_MESSAGE);
    else {
      let formData = {
        ...inputs,
        copyVersion: isCopy && getCopyVersion(),
      };
      dispatch(addOOBModule(formData, selectedModule, props.addFor));
    }
  };

  useEffect(() => {
    if (addApiError) {
      setApiError(handleManageModuleError(addApiError));
    }
    else
      setApiError(false);
  }, [addApiError]);
let oobModules = props?.OOBModuleList?.map(({ moduleName }) => ({moduleName}))?.map(item => item?.moduleName)
if(oobModules) {
moduleDetailsList = moduleDetailsList.filter(item => {
  if(oobModules.indexOf(item.moduleName) === -1) return item
  })
}
  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      open={props.open}
      onClose={props.handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle className={styles.dialogTitle}>{props.heading}</DialogTitle>
      <DialogContent dividers="true">
        <form
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(handleAddOobModule)}
          id="addOobModule"
        >
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
            {isDraft ? (
              <Grid item xs={12} className={styles.col}>
                <Card className={styles.warningCard}>
                  <Typography variant="body2">
                    {VERSION_ALREADY_EXIST}
                  </Typography>
                </Card>
              </Grid>
            ) : null}

            {props.addFor !== "version" && (
              <Grid item xs={12} className={styles.col}>
                <MatFormControl
                  required
                  error={errors.moduleName ? true : false}
                  variant="filled"
                  size="small"
                >
                  <InputLabel>Module(s)</InputLabel>
                  <MatSelect
                    name="moduleName"
                    defaultValue={moduleName}
                    onChange={handleChange}
                  >
                    {moduleDetailsList.map((option, key) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.moduleName}
                      </MenuItem>
                    ))}
                  </MatSelect>
                  <FormHelperText>
                    {errors.moduleName ? errors.moduleName.message : " "}
                  </FormHelperText>
                </MatFormControl>
              </Grid>
            )}
            {isCopy && !isDraft && (
              <Grid item xs={12} className={styles.col}>
                <MatFormControl
                  required
                  error={errors.copyVersion ? true : false}
                  variant="filled"
                  size="small"
                >
                  <InputLabel>New copy from version</InputLabel>
                  <MatSelect
                    defaultValue={getCopyVersion}
                    //value={copyVersion}
                    name="copyVersion"
                    disabled
                    onChange={handleChange}
                  >
                    {OOBModuleById.versions
                      .sort((a, b) =>
                        new Date(a.createdDate) < new Date(b.createdDate)
                          ? 1
                          : -1
                      )
                      .map((option, key) => (
                        <MenuItem key={option.id} value={option.version}>
                          {option.version}
                        </MenuItem>
                      ))}
                  </MatSelect>
                  <FormHelperText>
                    {errors.copyVersion ? errors.copyVersion.message : " "}
                  </FormHelperText>
                </MatFormControl>
              </Grid>
            )}
            {/* <Grid item xs={12} className={styles.col}>
            <MaterialTextField
              required
              multiline
              rows={4}
              name="description"
              label="Description"
              value={description}
              onChange={handleChange}
            />
          </Grid> */}
            <Grid item xs={12} className={styles.col}>
              <FormControl component="fieldset">
                <FormLabel component="legend">{CRE_VERSION}</FormLabel>
                <RadioGroup
                  row
                  defaultValue={versionType}
                  name="versionType"
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="manually"
                    control={<Radio />}
                    label="Manually"
                    disabled={isDraft}
                  />
                  <FormControlLabel
                    value="automatically"
                    control={<Radio />}
                    label="Automatically"
                    disabled={isDisabled || isDraft}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={4} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  required: { value: true, message: MAJOR_VER_MANDATORY },
                  pattern: {
                    value: /^\d{1,2}?$/,
                    message: VALID_VERSION_MES,
                  },
                })}
                error={errors.majorversion ? true : false}
                defaultValue={majorversion}
                helperText={
                  errors.majorversion ? errors.majorversion.message : " "
                }
                disabled={isEditable || isDraft}
                required
                label="Major version"
                name="majorversion"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={4} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  required: { value: true, message: MINOR_VER_MANDATORY },
                  pattern: {
                    value: /^\d{1,2}?$/,
                    message: ENTER_VALID_MIN_VERSION,
                  },
                })}
                error={errors.minorversion ? true : false}
                defaultValue={minorversion}
                helperText={
                  errors.minorversion ? errors.minorversion.message : " "
                }
                disabled={isEditable || isDraft}
                required
                label="Minor version"
                name="minorversion"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={4} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  required: { value: true, message: PATCH_VER_MANDATORY },
                  pattern: {
                    value: /^\d{1,2}?$/,
                    message: VALID_PAT_VERSION,
                  },
                })}
                error={errors.patchversion ? true : false}
                defaultValue={patchversion}
                helperText={
                  errors.patchversion ? errors.patchversion.message : " "
                }
                disabled={isEditable || isDraft}
                required
                label={PATCH_VER}
                name="patchversion"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleChange}
              />
            </Grid>
            {/* <Grid item xs={12} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  required: { value: true, message: "version is mandatory." },
                  pattern: {
                    value: /^\d{1,2}\.\d{1,2}(?:\.\d{1,2})?$/,
                    message: "Please enter a valid version.",
                  },
                })}
                error={errors.version ? true : false}
                defaultValue={version}
                helperText={errors.version ? errors.version.message : " "}
                disabled={isEditable}
                required
                label="Version"
                name="version"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleChange}
              />
            </Grid> */}
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <MatButton color="primary" onClick={handleCloseForm}>
          Cancel
        </MatButton>
        <MatButton
          type="submit"
          form="addOobModule"
          disabled={isSubmited || isDraft}
        >
          {props.addFor !== "version" ? "Add Module" : "Add Version"}
        </MatButton>
      </DialogActions>
    </Dialog>
  );
};

export default ManageModule;
