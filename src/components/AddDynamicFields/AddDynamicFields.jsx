import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

import { makeStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Card from "@material-ui/core/Card";
import Chip from "@material-ui/core/Chip";


import MatButton from "../MaterialUi/MatButton";
import MaterialTextField from "../MaterialUi/MatTextField";
import {
  //SET_DEFAULT_STARTINDEX,
  RESET_ADD_OOB_CONTROL_IS_DONE,
} from "../../utils/AppConstants";

import {
  addOobControl,
  fetchOobControl,
} from "../../actions/OobControlActions";
import { CANCEL, NO_OPT_AVAILABLE, VALUE_ALREADY_EXIST,handleAddDynamicFieldsError} from "../../utils/Messages";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    fontWeight: 300,
  },
  col: {
    padding: "5px 8px",
  },
  optionBox: {
    padding: "10px 12px",
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  addOption: {
    padding: "10px 12px 5px",
    display: "flex",
    alignItems: "center",
  },
  optionButton: {
    paddingBottom: "15px",
    marginLeft: "10px",
  },
  optionField: {
    width: "300px",
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

const AddDynamicFields = (props) => {
  const { open, handleClose, controlLabel, controlId } = props;
  const dispatch = useDispatch();
  const { oobSubmoduleId } = useParams();
  const {
    register,
    handleSubmit,
    watch,
    setError,
    setValue,
    clearError,
    errors,
  } = useForm({ mode: "onBlur" });
  const [optionField, setOptionField] = useState("");
  //get selected mastercontrol details
  const masterControlData = useSelector(
    (state) =>
      state.Control.data.list.filter((control) => control.id === +controlId)[0]
  );
  const count = useSelector((state) => state.OobControl.data.totalElements);

  //get mastercontrol properties
  const fieldList = useSelector(
    (state) =>
      state.Control.data.list.filter((control) => control.id === +controlId)[0]
        .format
  );
  const oobControlData = useSelector((state) => state.OobControl.data);
  const pageSize = useSelector((state) => state.OobControl.page.pageSize);
  const addApiError = useSelector((state) => state.OobControl.data.addError);
  const [apiError, setApiError] = useState(null);
  const styles = useStyles();
  const dynamicDefaultValue = fieldList.reduce((initObj, field) => {
    if (field.fieldType === "option") {
      initObj[field.internalName] = [];
    } else {
      initObj[field.internalName] = "";
    }
    return initObj;
  }, {});

  const [inputs, setInputs] = useState({
    ...dynamicDefaultValue,
  });

  //textfield, textarea
  let handleChange = (e) => {
    dispatch({ type: RESET_ADD_OOB_CONTROL_IS_DONE });
    setOptionField("");
    clearError("optionField");
    const { name } = e.target;
    setInputs((inputs) => ({ ...inputs, [name]: watch(name) }));
  };

  //select
  const handleSelectChange = (e) => {
    dispatch({ type: RESET_ADD_OOB_CONTROL_IS_DONE });
    setOptionField("");
    clearError("optionField");
    const { name, value } = e.target;
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };

  //select option
  let handleOptionChange = (e) => {
    dispatch({ type: RESET_ADD_OOB_CONTROL_IS_DONE });
    clearError("optionField");
    const { value } = e.target;
    setOptionField(value);
  };

  let checkPattern = (field) => {
    switch (field.validationPattern) {
      case "alphabetic":
        return {
          value: /^[a-zA-Z ]*$/,
          message: `${field.fieldLabel} field should be an alphabetic.`,
        };
      case "alpha-numeric":
        return {
          value: /^(?=.*[a-zA-Z])(?=.*[0-9])/,
          message: `${field.fieldLabel} field should be an alphanumermic`,
        };
      case "no-space-alpha-numeric":
        return {
          value: /((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/,
          message: `${field.fieldLabel} field should not have space between alphanumeric.`,
        };
      case "no-space-alphabetic":
        return {
          value: /^[A-Za-z]+$/,
          message: `${field.fieldLabel} field should not have space between alphabetic.`,
        };
      default:
        return {};
    }
  };

  useEffect(() => {    
    fieldList.forEach(field => {
      if(field.fieldType === "select" && field.isFieldRequired==="Yes"){
      if (inputs[field?.internalName] !== "") {
        setValue(field?.internalName , inputs[field?.internalName]);
        clearError(field?.internalName);
      } else {
        register(
          { name: field?.internalName },
          { required: { value: true, message: `${field.fieldLabel} field is mandatory.` } }
        );
      }
    }
    });
  }, [fieldList, clearError, register, setValue, inputs]);

  let checkMinMaxLen = (field) => field.isFieldRequired === "Yes"
  && field.maxCharLength!==""
  && field.minCharLength!=="" && (
    {
      maxLength: {
        //10<4
        value: field.maxCharLength,
        message: `${field.fieldLabel} field value should not contain more than ${field.maxCharLength} characters`,
      },

      minLength: {
        value: field.minCharLength,
        message: `${field.fieldLabel} field value should contain atleast ${field.minCharLength} Characters`,
      },
    });

    //inputs[field.fieldName].length=="undefined" &&
  let optionValidation = (field) => ({
      required: {
        value:
          field.isFieldRequired === "Yes" &&
          field.valueSetBy !== "CLIENT"
          && inputs[field.internalName].length===0
          ,
        message: `${field.fieldLabel} field is mandatory.`,
      }
    });

  const handleDelete = (fieldName, optonToDelete) => () => {
    let fieldOptions = inputs[fieldName].filter(
      (option) => option.toLowerCase() !== optonToDelete.toLowerCase()
    );
    setInputs((inputs) => ({ ...inputs, [fieldName]: fieldOptions }));
  };

  const handleAddOption = (fieldName) => {
    let fieldOptions = [...inputs[fieldName]];
    let isDuplicate = fieldOptions.some(
      (option) =>
        option.toLowerCase().trim() === optionField.toLowerCase().trim()
    );
    if (isDuplicate) {
      setError("optionField", "notMatch", VALUE_ALREADY_EXIST);
    } else {
      // let newOption = {
      //   key: fieldOptions.length,
      //   label: optionField,
      // };
      fieldOptions.push(optionField);
      setInputs((inputs) => ({ ...inputs, [fieldName]: fieldOptions }));
      setOptionField("");
    }
  };

  const handleAddControl = () => {
    let fieldLabel = "";
    let formData = {
      oobSubmoduleId,
      masterControlId: controlId,
      controlData: {
        ...inputs,
        controlType: masterControlData.name,
        configMapping: {},
        configMethod: "",
        listCategory:"",
        uniqueContext: "",
        uniqueTableName: "",
      },
    };
    if (masterControlData.type === "form") {
      fieldLabel = inputs.label;
    }
    dispatch(addOobControl(formData, fieldLabel));
  };

  useEffect(() => {
    if (oobControlData.isControlAdded) {
      props.resetSearchText();
      let pages = Math.max(0, Math.ceil((count + 1) / pageSize) - 1);
      dispatch(fetchOobControl(oobSubmoduleId, pages * pageSize, pageSize));
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, oobControlData.isControlAdded]);

  useEffect(() => {
    if (addApiError && !(addApiError.responseCode === "201")
    ) {
      setApiError(handleAddDynamicFieldsError(addApiError));
    }
    else
      setApiError(false);
  }, [addApiError]);


  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle className={styles.dialogTitle}>
        Add New {controlLabel}
      </DialogTitle>
      <DialogContent dividers="true">
        <form
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(handleAddControl)}
          id="addControl"
        >
          {apiError ? (
            <Grid item xs={12} className={styles.col}>
              <Card
                className={
                  apiError.messageType === "error"
                    ? styles.errorCard
                    : styles.warningCard
                }
              >
                <Typography variant="body2">{apiError.message}</Typography>
              </Card>
            </Grid>
          ) : null}
          <Grid container className={styles.row}>
            {fieldList.length <= 0 && (
              <Grid
                item
                xs={12}
                className={styles.col}
                style={{ textAlign: "center" }}
              >
                <Typography variant="body2">
                  No field(s) available for {controlLabel}
                </Typography>
              </Grid>
            )}
            {fieldList.length > 0 &&
              fieldList.map((field) => (
                <>
                  {field.fieldType === "textbox" && (
                    <Grid item xs={4} className={styles.col}>
                      <MaterialTextField
                        inputRef={register({
                          required: {
                            value:
                              field.isFieldRequired === "Yes" &&
                              field.valueSetBy !== "CLIENT",
                            message: `${field.fieldLabel} field is mandatory.`,
                          },
                          pattern: {
                            ...checkPattern(field),
                          },
                          ...checkMinMaxLen(field),
                        })}
                        error={errors[field.internalName] ? true : false}
                        helperText={
                          errors[field.internalName]
                            ? errors[field.internalName].message
                            : " "
                        }
                        required={
                          field.isFieldRequired === "Yes" &&
                          field.valueSetBy !== "CLIENT"
                        }
                        disabled={field.valueSetBy === "CLIENT"}
                        name={field.internalName}
                        label={field.fieldLabel}
                        // value={fieldLabel}
                        onChange={handleChange}
                      />
                      {/* { errors.field.internalName?.type === "maxLength" && "maxlength is exceded."  } */}
                    </Grid>
                  )}

                  {field.fieldType === "select" && (
                    <Grid item xs={4} className={styles.col}>                    

                      <MaterialTextField
                        error={errors[field.internalName] ? true : false}
                        helperText={
                          errors[field.internalName]
                            ? errors[field.internalName].message
                            : " "
                        }
                        required={
                          field.isFieldRequired === "Yes" &&
                          field.valueSetBy !== "CLIENT"
                        }
                        select
                        name={field.internalName}
                        label={field.fieldLabel}
                        disabled={field.valueSetBy === "CLIENT"}
                        value={inputs[field.internalName] || console.log('the value', inputs[field.internalName])}
                        onChange={handleSelectChange}
                        
                      >
                        {field.options &&
                          field.options.map((option,index) => (
                            <MenuItem key={index} name={option.label} value={option.label}>
                              {option.label}
                            </MenuItem>
                          ))}
                      </MaterialTextField>
                    </Grid>
                  )}

                  {field.fieldType === "textarea" && (
                    <Grid item xs={12} className={styles.col}>
                      <MaterialTextField
                        multiline
                        rows={3}
                        disabled={field.valueSetBy === "CLIENT"}
                        name={field.internalName}
                        label={field.fieldLabel}
                        inputRef={register({
                          required: {
                            value:
                              field.isFieldRequired === "Yes" &&
                              field.valueSetBy !== "CLIENT",
                            message: `${field.fieldLabel} is mandatory.`,
                          },
                          ...checkMinMaxLen(field),
                        })}
                        error={errors[field.internalName] ? true : false}
                        helperText={
                          errors[field.internalName]
                            ? errors[field.internalName].message
                            : " "
                        }
                        required={
                          field.isFieldRequired === "Yes" &&
                          field.valueSetBy !== "CLIENT"
                        }
                        onChange={handleChange}
                      />
                    </Grid>
                  )}

                  {field.fieldType === "option" && (
                    <Grid
                      item
                      xs={12}
                      className={styles.col}
                      style={{ paddingTop: "0px", paddingBottom: "16px" }}
                    >
                      <Paper variant="outlined">
                        <div className={styles.optionBox}>
                          <Typography
                            variant="subtitle1"
                            style={{ fontWeight: 500 }}
                            gutterBottom
                          >
                            {field.fieldLabel} (
                            {inputs[field.internalName] &&
                              inputs[field.internalName].length}
                            )
                          </Typography>
                          <div>
                            {inputs[field.internalName] &&
                            inputs[field.internalName].length > 0 ? (
                              inputs[field.internalName].map((data) => {
                                return (
                                  <Chip
                                    label={data}
                                    onDelete={handleDelete(
                                      field.internalName,
                                      data
                                    )}
                                    className={styles.chip}
                                  />
                                );
                              })
                            ) : (
                              <Typography variant="body2" gutterBottom>
                                {NO_OPT_AVAILABLE}
                              </Typography>
                            )}
                          </div>
                        </div>
                        <Divider />
                        <div className={styles.addOption}>
                          <div className={styles.optionField}>
                            <MaterialTextField
                              inputRef={register({
                                ...optionValidation(field),
                              })}
                              required
                              name="optionField"
                              disabled={field.valueSetBy === "CLIENT"}
                              label="Enter option name..."
                              value={optionField}
                              error={errors.optionField ? true : false}
                              helperText={
                                errors.optionField
                                  ? errors.optionField.message
                                  : " "
                              }
                              onChange={handleOptionChange}
                            />
                          </div>
                          <div className={styles.optionButton}>
                            <MatButton
                              disabled={!optionField.trim()}
                              type="button"
                              color="primary"
                              onClick={() =>
                                handleAddOption(field.internalName)
                              }
                            >
                              Add
                            </MatButton>
                          </div>
                        </div>
                      </Paper>
                    </Grid>
                  )}
                </>
              ))}
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <MatButton color="primary" onClick={handleClose}>
          {CANCEL}
        </MatButton>
        <MatButton
          disabled={fieldList.length <= 0}
          type="submit"
          form="addControl"
        >
          Create {controlLabel}
        </MatButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddDynamicFields;
