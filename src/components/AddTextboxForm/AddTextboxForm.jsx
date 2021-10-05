import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

import { makeStyles } from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";

import MatButton from "../MaterialUi/MatButton";
import MaterialTextField from "../MaterialUi/MatTextField";

import {
  addControlField,
  fetchMasterControlById,
} from "../../actions/ControlActions";

import { RESET_ADD_MASTER_CONTROL_FIELD_ERROR } from "../../utils/AppConstants";

import { generateInternalName } from "../../utils/helpers";
import { CANCEL, handleAddTextboxFormError, ENTER_VALID_PROP, ENTER_VALID_VALUE, MAXIMUN_CHARACTER_ALLOWED_MSG, MAX_CHAR_LEN, MIN_CHAR_LEN, NO_SPACE_ALPHA, NO_SPACE_ALPHANUMERIC, PROP_IS_MANDATORY, PROP_NAME_EXIST, REQUIRED, VALUE_AT_LEAST, VALUE_CANT_MORE } from "../../utils/Messages";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    fontWeight: 300,
  },
  col: {
    padding: "5px 8px",
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

const AddTextboxForm = (props) => {
  const { controlId } = useParams();
  const styles = useStyles();
  const dispatch = useDispatch();
  const { handleCloseForm, formType } = props;
  const {
    register,
    handleSubmit,
    watch,
    errors,
    clearError,
    setError,
  } = useForm({ mode: "onBlur" });
  const controlFieldData = useSelector((state) => state.Control.data);
  const addFieldError = useSelector(
    (state) => state.Control.data.fieldAddError
  );
  const [apiError, setApiError] = useState(null);
  const [isDisabled] = useState(false);
  const activeControl = useSelector(
    (state) => state.Control.individual.details
  );
  const defaultFormObj = {
    fieldLabel: "",
    // fieldName: "",
    fieldType: formType,
    isRequired: "No",
    validationPattern: "",
    minCharLength: "",
    maxCharLength: "",
    valueSetBy: "BOTH",
  };
  const [inputs, setInputs] = useState(defaultFormObj);
  const { fieldType, isRequired, valueSetBy } = inputs;

  const titles = {
    textbox: "Textbox",
    textarea: "Textarea",
  };

  let handleChange = (e) => {
    clearError("fieldLabel");
    dispatch({ type: RESET_ADD_MASTER_CONTROL_FIELD_ERROR });
    const { name, value } = e.target;
    if (
      name === "isRequired" ||
      name === "validationPattern" ||
      name === "valueSetBy"
    ) {
      setInputs((inputs) => ({ ...inputs, [name]: value }));
    } else {
      setInputs((inputs) => ({ ...inputs, [name]: watch(name) }));
    }
  };

  const handleAddField = () => {
    let formControl = JSON.parse(JSON.stringify(activeControl));
    let isDuplicate = formControl.format.some(
      (control) =>
        control.fieldLabel.toLowerCase().trim() ===
        inputs.fieldLabel.toLowerCase().trim()
    );
    if (isDuplicate) {
      setError("fieldLabel", "notMatch", PROP_NAME_EXIST);
    } else {
      let formData = {
        fieldLabel: inputs.fieldLabel,
        internalName: generateInternalName(inputs.fieldLabel),
        fieldType: inputs.fieldType,
        isFieldRequired: inputs.isRequired,
        validationPattern: inputs.validationPattern,
        minCharLength: inputs.minCharLength,
        maxCharLength: inputs.maxCharLength,
        valueSetBy: inputs.valueSetBy,
        isDefaultGenerated: false,
      };
      formControl.format.push(formData);
      dispatch(addControlField(formControl));
    }
  };

  useEffect(() => {
    if (controlFieldData.isFieldAdded) {
      dispatch(fetchMasterControlById(controlId));
      handleCloseForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, controlFieldData.isFieldAdded, controlId]);

  useEffect(() => {
    if (
      addFieldError && !(addFieldError.responseCode === "201")
    ) {
      setApiError(handleAddTextboxFormError(addFieldError, activeControl));
    }
    else
      setApiError(false);
  }, [addFieldError, activeControl]);

  return (
    <>
      <DialogTitle className={styles.dialogTitle}>
        Add New {titles[fieldType]}
      </DialogTitle>
      <DialogContent dividers="true">
        <form
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(handleAddField)}
          id="addField"
        >
          <Grid container className={styles.row}>
            {apiError ? (
              <Grid item xs={12} className={styles.col}>
                <Card
                  className={apiError.messageType === "error" ? styles.errorCard : styles.warningCard}
                >
                  <Typography variant="body2">
                    {apiError.message}
                  </Typography>
                </Card>
              </Grid>
            ) : null}
            <Grid item xs={6} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  required: {
                    value: true,
                    message: PROP_IS_MANDATORY,
                  },
                  pattern: {
                    value: /^[a-zA-Z-_\s]*$/,
                    message: ENTER_VALID_PROP,
                  },
                  maxLength: {
                    value: 50,
                    message: MAXIMUN_CHARACTER_ALLOWED_MSG,
                  },
                })}
                error={errors.fieldLabel ? true : false}
                helperText={errors.fieldLabel ? errors.fieldLabel.message : " "}
                disabled={isDisabled}
                required
                name="fieldLabel"
                label="Property Name"
                onChange={handleChange}
              />
            </Grid>

            {/* <Grid item xs={6} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  required: {
                    value: true,
                    message: "Internal name is mandatory.",
                  },
                })}
                error={errors.fieldName ? true : false}
                helperText={errors.fieldName ? errors.fieldName.message : " "}
                required
                name="fieldName"
                label="Internal Name"
                onChange={handleChange}
              />
            </Grid> */}

            <Grid item xs={6} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  required: false,
                })}
                helperText=" "
                select
                label={REQUIRED}
                onChange={handleChange}
                name="isRequired"
                disabled={isDisabled}
                defaultValue={isRequired}
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </MaterialTextField>
            </Grid>

            <Grid item xs={6} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  required: false,
                })}
                helperText=" "
                select
                label="Value Fill By"
                onChange={handleChange}
                name="valueSetBy"
                defaultValue={valueSetBy}
                disabled={isDisabled}
              >
                <MenuItem value="MHK">MHK</MenuItem>
                <MenuItem value="CLIENT">CLIENT</MenuItem>
                <MenuItem value="BOTH">BOTH</MenuItem>
              </MaterialTextField>
            </Grid>

            {formType !== "textarea" && (
              <Grid item xs={6} className={styles.col}>
                <MaterialTextField
                  inputRef={register({
                    required: false,
                  })}
                  helperText=" "
                  select
                  label="Validation Pattern"
                  onChange={handleChange}
                  name="validationPattern"
                  disabled={isDisabled}
                >
                  <MenuItem value="alphabetic">Alphabetic</MenuItem>
                  <MenuItem value="alpha-numeric">Alphanumeric</MenuItem>
                  <MenuItem value="no-space-alpha-numeric">
                    {NO_SPACE_ALPHANUMERIC}
                  </MenuItem>
                  <MenuItem value="no-space-alphabetic">
                    {NO_SPACE_ALPHA}
                  </MenuItem>
                </MaterialTextField>
              </Grid>
            )}

            <Grid item xs={6} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  required: false,
                  min: {
                    value: 0,
                    message: VALUE_AT_LEAST,
                  },
                  max: {
                    value: 1000,
                    message: VALUE_CANT_MORE,
                  },
                  pattern: {
                    value: /^\d{1,3}$/,
                    message: ENTER_VALID_VALUE,
                  },
                })}
                helperText={
                  errors.minCharLength ? errors.minCharLength.message : " "
                }
                error={errors.minCharLength ? true : false}
                type="number"
                name="minCharLength"
                label={MIN_CHAR_LEN}
                onChange={handleChange}
                disabled={isDisabled}
              />
            </Grid>

            <Grid item xs={6} className={styles.col}>
              <MaterialTextField
                inputRef={register({
                  required: false,
                  min: {
                    value: 0,
                    message: VALUE_AT_LEAST,
                  },
                  max: {
                    value: 1000,
                    message: VALUE_CANT_MORE,
                  },
                  pattern: {
                    value: /^\d{1,3}$/,
                    message: ENTER_VALID_VALUE,
                  },
                })}
                helperText={
                  errors.maxCharLength ? errors.maxCharLength.message : " "
                }
                error={errors.maxCharLength ? true : false}
                type="number"
                name="maxCharLength"
                label={MAX_CHAR_LEN}
                disabled={isDisabled}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <MatButton color="primary" onClick={handleCloseForm}>
          {CANCEL}
        </MatButton>
        <MatButton type="submit" form="addField" disabled={isDisabled}>
          Create {titles[fieldType]}
        </MatButton>
      </DialogActions>
    </>
  );
};

export default AddTextboxForm;
