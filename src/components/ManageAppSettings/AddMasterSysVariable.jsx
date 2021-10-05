import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { makeStyles, FormHelperText } from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import Divider from "@material-ui/core/Divider";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import ListSubheader from '@material-ui/core/ListSubheader'
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import MatButton from "../MaterialUi/MatButton";
import MaterialTextField from "../MaterialUi/MatTextField";
import MatFormControl from "../MaterialUi/MatFormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MatSelect from "../MaterialUi/MatSelect";
import MenuItem from "@material-ui/core/MenuItem";
import InputAdornment from '@material-ui/core/InputAdornment';
//import PropertyMapping from "../ManageMapping/PropertyMapping";
import { AddSystemVariable } from "../../actions/MasterSystemActions";
import { fetchMasterModule } from "../../actions/MasterModuleActions";
import { defaultControlProperty, defaultValueType } from "../../utils/ConfigConstants";
import DynamicForms from "./DynamicForms";

import {
  MODULE_ASSI_MAND,
  CONTROL_PROPERTY_MANDATORY,
  MIN_CODE_VERSION_MANDATORY_MSG,
  //VALID_CODEVERSION_MSG,
  //TABLE_IS_MANDATORY,
  ADD_SYSTEM_VARIABLE,
  COMMON_ERROR_MESSAGE,
  MAXIMUN_CHARACTER_ALLOWED_MSG,
  CODE_NAME_EXIST,
  SHORT_DESC_EXIST,
  SYSVARIABLECODE_MANDATORY,
  SYSVARIABLEDESC_MANDATORY,
  // SYSVARIABLEUNIQUE_MANDATORY,
} from "../../utils/Messages";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    fontWeight: 300,
  },
  col: {
    padding: "10px",
  },
  input: {
    color: theme.palette.primary.main
  },
  switchList: {
    padding: "4px",
  },
  switchItem: {
    marginRight: "6px",
  },
  listGutter: {
    paddingTop: "2px",
    paddingBottom: "2px",
    paddingLeft: "6px",
    "&.Mui-disabled": {
      opacity: "0.8",
    },
  },
  cardHeadingSize: {
    fontSize: "18px",
  },
  errorCard: {
    background: theme.palette.error.main,
    boxShadow: "none !important",
    color: "#ffffff",
    padding: "12px 16px",
    marginBottom: '14px'
  },
  disableClick: {
    pointerEvents: "none",
  },
}));

const AddMasterSysVariable = (props) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    //watch,
    setValue,
    setError,
    clearError,
    unregister,
    errors,
  } = useForm({ mode: "onBlur" });
  const [isSubmited, setIsSubmited] = useState(false);
  const [isMaxDisabled, setIsMaxDisabled] = useState(true);
  const [maxList, setMaxList] = useState([]);
  const [inputs, setInputs] = useState({
    code: "",
    shortDescription: "",
    moduleIds: [],
    minCV: "",
    maxCV: "",
    controlProperty: "",
    codeProperty: [],

  });
  const shortDescriptionList = useSelector((state) =>
  state.MasterSysVariable.systemDetailsList.list.map( item => item.description)
);
const dupValid = (name, value) => {
  if (name === "shortDescription") {
    let result = shortDescriptionList.indexOf(value);
    if (result !== -1) {
      setError(name, "notMatch", "This short description is already exist");
      return false;
    } else {
      clearError(name);
      return true;
    }
  }
};
  const {
    //code,
    shortDescription,
    moduleIds,
    minCV,
    maxCV,
    controlProperty,
    //codeProperty,
  } = inputs;
  let tempData = [{ label: "", otherLabel: "", inputRows: [{ type: '', value: "", checked: false, delimeter: "" }] }];
  const codeVersion = useSelector(state => state.CodeVersion.codeVersionDetailsList.list && state.CodeVersion.codeVersionDetailsList.list.filter(obj => !obj.deleted).sort((a, b) => (a.codeVersion > b.codeVersion ? 1 : -1)))
  codeVersion.sort( (a, b) => 
    a.codeVersion.replace(/\d+/g, n => +n+100000 )
    .localeCompare(b.codeVersion.replace(/\d+/g, n => +n+100000 ))
  );
  const isSystemAdded = useSelector(
    (state) => state.MasterSysVariable.isSystemAdded
  );
  const [apiError, setApiError] = useState(null);
  const addApiError = useSelector((state) => state.MasterSysVariable.addError);

  const moduleDetailsList = useSelector((state) =>
    state.MasterModule.moduleDetailsList.list?.filter(item => !item.deleted)?.sort((a, b) =>
      a.moduleName > b.moduleName ? 1 : -1
    )
  );

  // const tableDetailsList = useSelector((state) =>
  //   state.MasterTable.tableDetailsList.list.sort((a, b) =>
  //     a.tableName > b.tableName ? 1 : -1
  //   )
  // );

  //const defaultValueType = ["str_value", "INT_VALUE", "LONG_VALUE", "list_value_id"];

  const handleCloseForm = useCallback(() => {
    setIsSubmited(false);
    clearError();
    props.handleClose();
  }, [props, clearError]);

  let handleChange = (e) => {
    const { name, value } = e.target;
    setIsSubmited(false);
    dupValid(name,value);
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

  const handleCode = (updatedVal) => {
    setInputs((inputs) => ({ ...inputs, codeProperty: updatedVal }));
  };


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
    if (controlProperty !== "") {
      setValue("controlProperty", controlProperty);
      clearError("controlProperty");
    } else {
      register(
        { name: "controlProperty" },
        { required: { value: true, message: CONTROL_PROPERTY_MANDATORY } }
      );
    }
  }, [clearError, controlProperty, register, setValue]);

  useEffect(() => {
    if (minCV !== "") {
      setValue("minCV", minCV);
      clearError("minCV");
    } else {
      register({ name: 'minCV' }, { required: { value: true, message: MIN_CODE_VERSION_MANDATORY_MSG } });
    }
  }, [clearError, minCV, register, setValue]);

  useEffect(() => {
    if (!!addApiError) {
      setIsSubmited(false);
    }

    if (
      addApiError &&
      !(addApiError.responseCode === "201" || addApiError.responseCode === 201)
    ) {
      setApiError(true);
    }
    if (
      addApiError.responseCode &&
      addApiError.responseCode === "9148"
    ) {
      setIsSubmited(true);
      setApiError(false);
      setError("code", "notMatch", CODE_NAME_EXIST);
    }
    if (
      addApiError.responseCode &&
      addApiError.responseCode === "9154"
  ) {
    setIsSubmited(true);
      setApiError(false);
      setError("shortDescription", "notMatch", SHORT_DESC_EXIST);
  }

    if (isSystemAdded) {
      handleCloseForm();
    }
  }, [dispatch, addApiError, setError, isSystemAdded, handleCloseForm]);

  useEffect(() => {
    dispatch(fetchMasterModule());
  }, [dispatch]);

  useEffect(() => {
    console.log("ERRORS",errors);
  }, [errors]);

  const handleCreateSystem = () => {
    console.log("Errors", errors);

    setIsSubmited(true);
    let tempData = inputs.codeProperty.map(field => ({
      label: field.label ? field.label : null,
      otherLabel: field.otherLabel ? field.otherLabel : null,
      systemFunctions: defaultValueType.map(item => ({
        type: item,
        ...(item !== 'Client Value' && {
          value: field.inputRows.filter(data => data.type === item).length > 0 ? (field.inputRows.filter(data => data.type === item)[0].value ?
            field.inputRows.filter(data => data.type === item)[0].value : null) : null
        }),
        ...(item === 'Client Value' && {
          checked: field.inputRows.filter(data => data.type === item).length > 0 ? field.inputRows.filter(data => data.type === item)[0].checked : null
        }),
        ...(item === 'STR Value' && {
          delimeter: field.inputRows.filter(data => data.type === item).length > 0 ? field.inputRows.filter(data => data.type === item)[0].delimeter : null
        }),
        selected: field.inputRows.filter(data => data.type === item).length > 0 ? true : false
      }))
    }));

    let payloadJson = {
      controlCategory: inputs.controlProperty,
      description: inputs.shortDescription.trim(),
      maxCodeVersion: inputs.maxCV,
      code: inputs.code.trim(),
      minCodeVersion: inputs.minCV,
      moduleIds: inputs.moduleIds,
      propertyValue: JSON.stringify(tempData)
    };

    dispatch(AddSystemVariable(payloadJson));
  };

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
        {ADD_SYSTEM_VARIABLE}
      </DialogTitle>
      <form
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(handleCreateSystem)}
      >
        <DialogContent dividers="true">
          {apiError ? (
            <Grid item xs={12} className={styles.col}>
              <Card className={styles.errorCard}>
                <Typography variant="body2">{COMMON_ERROR_MESSAGE}</Typography>
              </Card>
            </Grid>
          ) : null}
          <Typography variant="h6" className={styles.cardHeadingSize}>
            Details
          </Typography>
          <Grid container className={styles.row}>
            <Grid item xs={4} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  required: {
                    value: true,
                    message: SYSVARIABLECODE_MANDATORY,
                  },
                  maxLength: {
                    value: 50,
                    message: MAXIMUN_CHARACTER_ALLOWED_MSG,
                  },
                })}
                error={errors.code ? true : false}
                helperText={errors.code?.message}
                onChange={handleChange}
                required
                name="code"
                label="System Variable Code"
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
                error={errors.shortDescription ? true : false}
                helperText={errors.shortDescription?.message}
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
              <MatFormControl required error={errors.minCV ? true : false}
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
              <MatFormControl disabled={isMaxDisabled} error={errors.maxCV ? true : false}
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
                name="controlProperty"
              >
                {defaultControlProperty.map((option, key) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.value}
                  </MenuItem>
                ))}
              </MaterialTextField>
            </Grid>
            <Grid item xs={12} className={styles.col}>
              <Divider variant="middle" />
            </Grid>
            <Typography variant="h6" className={styles.cardHeadingSize}>
              Configuration Settings
          </Typography>
            <DynamicForms errors={errors}
              register={register}
              setValue={setValue}
              setError={setError}
              clearError={clearError}
              unregister={unregister}
              handleCode={handleCode}
              defaultData={tempData}
              handleSubmitChange={() => setIsSubmited(false)}
              isEditable={true}
              openFor='Add' />
          </Grid>
        </DialogContent>
        <DialogActions>
          <MatButton color="primary" onClick={handleCloseForm}>
            Cancel
          </MatButton>
          <MatButton type="submit" disabled={isSubmited}>
            Submit
          </MatButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddMasterSysVariable;
